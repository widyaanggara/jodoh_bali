from __future__ import annotations

import argparse
import hashlib
import json
import statistics
import sys
from pathlib import Path
from typing import Sequence

import numpy as np

from app.evaluation import fingerprint_file, load_annotation_document
from app.image_io import load_local_image
from app.pretrained_cli import save_pretrained_diagnostics
from app.services.detector import PalmImageError
from app.services.full_hand_framing import FullHandTransform, compose_source_to_model, frame_full_hand
from app.services.pretrained_detector import ModelContractError, PretrainedPalmLineDetector


def _subject_group(relative_path: Path) -> str:
    source = relative_path.parts[0] if relative_path.parts else "unknown"
    return f"subject-{hashlib.sha256(source.encode('utf-8')).hexdigest()[:10]}"


def _hand_group(path: Path) -> str:
    lowered = str(path).lower()
    if "right_hand" in lowered:
        return "right"
    if "left_hand" in lowered:
        return "left"
    return "unknown"


def _camera_group(path: Path) -> str:
    lowered = str(path).lower()
    if "front_cam" in lowered:
        return "front"
    if "back_cam" in lowered:
        return "back"
    return "unknown"


def _annotation_samples(paths: Sequence[Path]) -> dict[str, dict[str, object]]:
    output: dict[str, dict[str, object]] = {}
    for path in paths:
        document = load_annotation_document(path)
        for sample in document["samples"]:
            if not isinstance(sample, dict):
                continue
            fingerprint = sample.get("sample_fingerprint")
            sample_id = str(sample.get("sample_id") or "")
            if not isinstance(fingerprint, str) or len(fingerprint) != 64 or not sample_id:
                continue
            key = f"{sample_id}:{fingerprint}"
            output[key] = {
                "sample_id": sample_id,
                "source_fingerprint": fingerprint,
                "roi_signature": sample.get("roi_signature"),
                "roi_width": sample.get("roi_width"),
                "roi_height": sample.get("roi_height"),
                "annotation_status": sample.get("annotation_status", sample.get("status")),
                "annotation_path": str(path.resolve()),
            }
    return output


def _find_sources(
    dataset_root: Path,
    samples: dict[str, dict[str, object]],
) -> dict[str, Path]:
    wanted = {
        str(sample["source_fingerprint"]).lower(): key
        for key, sample in samples.items()
    }
    matches: dict[str, Path] = {}
    for path in sorted(candidate for candidate in dataset_root.rglob("*") if candidate.is_file()):
        digest = fingerprint_file(path)
        key = wanted.get(digest)
        if key is not None:
            matches[key] = path.resolve()
    return matches


def _algorithm_payload(result) -> dict[str, object]:
    return {
        "status": result.status,
        "abstain_reason": result.abstain_reason,
        "candidate_count": result.candidate_count,
        "total_length_pixels": result.total_length_pixels,
        "class_pixel_counts": result.class_pixel_counts,
        "probability_summary": result.probability_summary,
        "postprocess_summary": result.postprocess_summary,
        "transform": result.to_payload()["transform"],
        "processing_time_ms": result.timings_ms["total"],
    }


def _landmark_frame(
    landmark_path: Path,
    sample: dict[str, object],
    image: np.ndarray,
) -> tuple[np.ndarray, FullHandTransform]:
    document = json.loads(landmark_path.read_text(encoding="utf-8"))
    if (
        not isinstance(document, dict)
        or document.get("format") != "metemu-hand-landmarks"
        or document.get("version") != 1
    ):
        raise ValueError(f"Format landmark tidak valid: {landmark_path}")
    if document.get("source_fingerprint") != sample.get("source_fingerprint"):
        raise ValueError(f"Fingerprint landmark tidak cocok: {landmark_path}")
    raw_landmarks = document.get("landmarks")
    if not isinstance(raw_landmarks, list) or len(raw_landmarks) != 21:
        raise ValueError("Landmark export wajib memiliki 21 titik.")
    points = np.array(
        [[point.get("x"), point.get("y")] for point in raw_landmarks if isinstance(point, dict)],
        dtype=np.float64,
    )
    if points.shape != (21, 2) or not np.isfinite(points).all():
        raise ValueError("Koordinat landmark export tidak valid.")
    coordinate_space = document.get("coordinate_space")
    if coordinate_space == "normalized":
        points[:, 0] *= image.shape[1]
        points[:, 1] *= image.shape[0]
    elif coordinate_space != "pixels":
        raise ValueError("coordinate_space landmark harus normalized atau pixels.")
    framed, framing = frame_full_hand(
        image,
        points,
        detected_handedness=(
            str(document["handedness"])
            if isinstance(document.get("handedness"), str)
            else None
        ),
        margin_pixels=float(document.get("margin_pixels", 100.0)),
    )
    return framed, framing


def run_full_hand_controls(
    annotation_paths: Sequence[Path],
    dataset_root: Path,
    model_path: Path,
    *,
    diagnostics_directory: Path | None = None,
    landmarks_directory: Path | None = None,
) -> dict[str, object]:
    samples = _annotation_samples(annotation_paths)
    sources = _find_sources(dataset_root, samples)
    detector = PretrainedPalmLineDetector(model_path)
    rows: list[dict[str, object]] = []
    for key, sample in sorted(samples.items()):
        source_path = sources.get(key)
        if source_path is None:
            rows.append({**sample, "source_status": "missing", "scoring_status": "N/A"})
            continue
        relative = source_path.relative_to(dataset_root.resolve())
        hand = _hand_group(relative)
        image = load_local_image(source_path)
        framed = image
        try:
            landmark_path = (
                landmarks_directory / f"{sample['sample_id']}.json"
                if landmarks_directory is not None
                else None
            )
            framing_transform = None
            framing_variant = "full-source-letterbox-control"
            landmark_crop_available = bool(landmark_path is not None and landmark_path.is_file())
            if landmark_crop_available and landmark_path is not None:
                framed, framing_transform = _landmark_frame(landmark_path, sample, image)
                framing_variant = "landmark-full-hand-letterbox"
            result = detector.detect(
                framed,
                mirror_right_hand=False if landmark_crop_available else hand == "right",
                resize_mode="letterbox-black",
                include_diagnostics=diagnostics_directory is not None,
            )
            framing_payload = framing_transform.to_payload() if framing_transform is not None else None
            if framing_transform is not None and framing_payload is not None:
                source_to_model = compose_source_to_model(framing_transform, result.transform)
                framing_payload["source_to_model"] = source_to_model.tolist()
                framing_payload["model_to_source"] = np.linalg.inv(source_to_model).tolist()
            if diagnostics_directory is not None:
                save_pretrained_diagnostics(
                    result,
                    framed,
                    diagnostics_directory / str(sample["sample_id"]),
                )
            rows.append(
                {
                    **sample,
                    "source_status": "fingerprint-exact",
                    "source_path": str(source_path),
                    "subject_group": _subject_group(relative),
                    "hand_group": hand,
                    "camera_group": _camera_group(relative),
                    "source_dimensions": [image.shape[1], image.shape[0]],
                    "framing_variant": framing_variant,
                    "landmark_crop_available": landmark_crop_available,
                    "framing_transform": framing_payload,
                    "scoring_status": "N/A",
                    "scoring_reason": (
                        "Source-to-annotation-ROI transform and historical ROI PNG are unavailable."
                    ),
                    "pretrained": _algorithm_payload(result),
                },
            )
        finally:
            if framed is not image:
                framed.fill(0)
            image.fill(0)
    valid = [row for row in rows if isinstance(row.get("pretrained"), dict)]
    groups = sorted({str(row.get("subject_group")) for row in valid})
    by_subject = []
    for group in groups:
        group_rows = [row for row in valid if row.get("subject_group") == group]
        foreground = [
            int(row["pretrained"]["postprocess_summary"]["raw_foreground_pixels_model"])
            for row in group_rows
        ]
        by_subject.append(
            {
                "subject_group": group,
                "sample_count": len(group_rows),
                "line_output_count": sum(
                    row["pretrained"]["status"] == "candidates" for row in group_rows
                ),
                "median_raw_foreground_pixels_model": statistics.median(foreground),
            },
        )
    return {
        "format": "metemu-full-hand-framing-diagnostic",
        "version": 1,
        "research_only": True,
        "framing_disclaimer": (
            "This run uses the complete source frame because historical MediaPipe landmarks "
            "were not persisted. It is not claimed as the exact upstream landmark crop."
        ),
        "model_sha256": detector.model_sha256,
        "sample_count": len(rows),
        "source_match_count": len(valid),
        "scored_count": 0,
        "by_subject": by_subject,
        "samples": rows,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Full-hand source framing control; no historical ROI scoring.")
    parser.add_argument("--annotations", type=Path, nargs="+", required=True)
    parser.add_argument("--dataset-root", type=Path, required=True)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--diagnostics", type=Path)
    parser.add_argument("--landmarks-dir", type=Path)
    parser.add_argument("--output", type=Path)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        result = run_full_hand_controls(
            args.annotations,
            args.dataset_root,
            args.model,
            diagnostics_directory=args.diagnostics,
            landmarks_directory=args.landmarks_dir,
        )
        payload = json.dumps(result, indent=2)
        if args.output is not None:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(payload, encoding="utf-8")
        print(payload)
        return 0
    except (PalmImageError, ModelContractError, ValueError, OSError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
