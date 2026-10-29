from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Sequence

import cv2
import numpy as np

from app.benchmark import run_manifest
from app.cli import _load_exact_annotation
from app.evaluation import score_candidates
from app.image_io import load_local_image
from app.pretrained_cli import save_pretrained_diagnostics
from app.services.detector import PalmImageError
from app.services.pretrained_detector import (
    ModelContractError,
    PretrainedDetectionResult,
    PretrainedPalmLineDetector,
    ResizeMode,
    preprocess_image,
)


DIAGNOSTIC_VARIANTS: tuple[ResizeMode, ...] = (
    "bilinear-stretch",
    "letterbox-black",
)


def _resolve(base: Path, value: object) -> Path:
    if not isinstance(value, str) or not value:
        raise ValueError("Path ROI benchmark tidak valid.")
    path = Path(value)
    return path if path.is_absolute() else (base / path).resolve()


def _mask_overlap(reference: np.ndarray, prediction: np.ndarray) -> dict[str, float | int]:
    reference = reference.astype(bool)
    prediction = prediction.astype(bool)
    intersection = int(np.count_nonzero(reference & prediction))
    union = int(np.count_nonzero(reference | prediction))
    reference_count = int(np.count_nonzero(reference))
    prediction_count = int(np.count_nonzero(prediction))
    return {
        "reference_pixels": reference_count,
        "prediction_pixels": prediction_count,
        "intersection_pixels": intersection,
        "iou": intersection / union if union else 1.0,
        "reference_coverage": intersection / reference_count if reference_count else 1.0,
        "prediction_precision": intersection / prediction_count if prediction_count else 1.0,
    }


def score_raw_mask_pixels(
    foreground_mask: np.ndarray,
    annotation,
) -> list[dict[str, float | int]]:
    """Pixel-proximity agreement; deliberately not called mask Dice."""
    foreground = foreground_mask > 0
    manual = np.zeros(foreground.shape, dtype=np.uint8)
    for polyline in annotation.polylines:
        points = np.array(
            [[round(point.x), round(point.y)] for point in polyline.points],
            dtype=np.int32,
        ).reshape(-1, 1, 2)
        cv2.polylines(manual, [points], False, 255, 1, cv2.LINE_8)
    manual_pixels = manual > 0
    distance_to_foreground = cv2.distanceTransform(
        (~foreground).astype(np.uint8),
        cv2.DIST_L2,
        5,
    )
    distance_to_manual = cv2.distanceTransform(
        (~manual_pixels).astype(np.uint8),
        cv2.DIST_L2,
        5,
    )
    output: list[dict[str, float | int]] = []
    for tolerance in (3, 6, 9):
        coverage = (
            float(np.mean(distance_to_foreground[manual_pixels] <= tolerance))
            if np.any(manual_pixels)
            else 0.0
        )
        precision = (
            float(np.mean(distance_to_manual[foreground] <= tolerance))
            if np.any(foreground)
            else 0.0
        )
        harmonic = (
            2.0 * coverage * precision / (coverage + precision)
            if coverage + precision
            else 0.0
        )
        output.append(
            {
                "tolerance_pixels": tolerance,
                "annotation_pixel_coverage": coverage,
                "foreground_pixel_precision": precision,
                "harmonic_agreement": harmonic,
                "annotation_pixel_count": int(np.count_nonzero(manual_pixels)),
                "foreground_pixel_count": int(np.count_nonzero(foreground)),
            },
        )
    manual.fill(0)
    distance_to_foreground.fill(0)
    distance_to_manual.fill(0)
    return output


def _variant_payload(
    result: PretrainedDetectionResult,
    annotation,
) -> dict[str, object]:
    scores = score_candidates(result.candidates, annotation) if result.status == "candidates" else []
    raw_mask_scores = (
        score_raw_mask_pixels(result.diagnostics.foreground_mask_roi, annotation)
        if result.diagnostics is not None
        and result.diagnostics.foreground_mask_roi is not None
        else []
    )
    return {
        "resize_mode": result.transform.resize_mode,
        "transform": result.to_payload()["transform"],
        "status": result.status,
        "abstain_reason": result.abstain_reason,
        "candidate_count": result.candidate_count,
        "total_length_pixels": result.total_length_pixels,
        "fragmentation_per_100px": (
            result.candidate_count * 100.0 / result.total_length_pixels
            if result.total_length_pixels > 0
            else None
        ),
        "near_outer_contour_count": result.near_outer_contour_count,
        "class_pixel_counts": result.class_pixel_counts,
        "probability_summary": result.probability_summary,
        "postprocess_summary": result.postprocess_summary,
        "scores": scores,
        "raw_mask_pixel_agreement": raw_mask_scores,
        "scores_provisional": annotation.completeness != "complete",
        "timings_ms": result.timings_ms,
    }


def _positive_controls(
    detector: PretrainedPalmLineDetector,
    upstream_root: Path,
    diagnostics_directory: Path | None,
) -> list[dict[str, object]]:
    docs = upstream_root / "docs"
    output: list[dict[str, object]] = []
    for index in range(1, 5):
        input_path = docs / f"example{index}_input.png"
        overlay_path = docs / f"example{index}_overlay.png"
        if not input_path.is_file() or not overlay_path.is_file():
            continue
        image = load_local_image(input_path)
        overlay = load_local_image(overlay_path)
        try:
            result = detector.detect(
                image,
                resize_mode="bilinear-stretch",
                include_diagnostics=True,
            )
            if result.diagnostics is None or result.diagnostics.foreground_mask_roi is None:
                raise ValueError("Mask diagnostik positive control tidak tersedia.")
            official_overlay_support = np.any(overlay != image, axis=2)
            raw_prediction = result.diagnostics.foreground_mask_roi > 0
            tensor, _ = preprocess_image(image, resize_mode="bilinear-stretch")
            try:
                tensor_sha256 = hashlib.sha256(tensor.tobytes()).hexdigest()
            finally:
                tensor.fill(0)
            if diagnostics_directory is not None:
                save_pretrained_diagnostics(
                    result,
                    image,
                    diagnostics_directory / "positive-controls" / f"example-{index}",
                )
            output.append(
                {
                    "example": index,
                    "source": str(input_path.resolve()),
                    "input_dimensions": [image.shape[1], image.shape[0]],
                    "tensor_sha256": tensor_sha256,
                    "class_pixel_counts": result.class_pixel_counts,
                    "raw_mask_vs_published_overlay_support": _mask_overlap(
                        official_overlay_support,
                        raw_prediction,
                    ),
                    "note": (
                        "Published overlay support is a positive-control reference, "
                        "not independent human ground truth."
                    ),
                },
            )
        finally:
            image.fill(0)
            overlay.fill(0)
    return output


def run_diagnostic(
    manifest_path: Path,
    model_path: Path,
    upstream_root: Path,
    *,
    diagnostics_directory: Path | None = None,
) -> dict[str, object]:
    baseline = run_manifest(manifest_path)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    samples = manifest.get("samples")
    if not isinstance(samples, list) or len(samples) != 1 or not isinstance(samples[0], dict):
        raise ValueError("Diagnostik 3C.2F saat ini memerlukan manifest satu sampel.")
    sample = samples[0]
    image_path = _resolve(manifest_path.parent, sample.get("roi_path"))
    image = load_local_image(image_path)
    detector = PretrainedPalmLineDetector(model_path)
    try:
        annotation = _load_exact_annotation(manifest_path, image_path, image)
        hand = str(sample.get("hand_group") or "unknown")
        variants: list[dict[str, object]] = []
        for mode in DIAGNOSTIC_VARIANTS:
            result = detector.detect(
                image,
                mirror_right_hand=hand == "right",
                resize_mode=mode,
                include_diagnostics=True,
            )
            if diagnostics_directory is not None:
                save_pretrained_diagnostics(
                    result,
                    image,
                    diagnostics_directory / str(sample.get("sample_id")) / mode,
                    annotation,
                )
            variants.append(_variant_payload(result, annotation))
        controls = _positive_controls(detector, upstream_root, diagnostics_directory)
        return {
            "format": "metemu-pretrained-parity-diagnostic",
            "version": 1,
            "research_only": True,
            "sample_id": sample.get("sample_id"),
            "strict_pixel_identity_verified": True,
            "annotation": {
                "completeness": annotation.completeness,
                "polyline_count": len(annotation.polylines),
                "semantic_class_labels_available": False,
                "evaluation_scope": "class-agnostic union foreground only",
            },
            "model": {
                "path": str(model_path.resolve()),
                "sha256": detector.model_sha256,
            },
            "upstream": {
                "root": str(upstream_root.resolve()),
                "commit": "bc48939f4deee6d8ff842bfde499396dab9c4830",
                "web_contract": "plain bilinear resize to 512x512",
                "training_pack_contract": (
                    "MediaPipe full-hand landmark bbox + 100px margin, fingers-up, "
                    "canonical handedness, aspect-preserving black padding to square"
                ),
                "crop_source_reconstruction_warning": (
                    "Upstream hand_preprocess.py says the original preprocessing file "
                    "was not recovered and this implementation is a reconstruction."
                ),
            },
            "strict_baseline": baseline,
            "preprocessing_variants": variants,
            "positive_controls": controls,
        }
    finally:
        image.fill(0)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Pretrained crop/parity diagnostic without changing model weights.",
    )
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--upstream-root", type=Path, required=True)
    parser.add_argument("--diagnostics", type=Path)
    parser.add_argument("--output", type=Path)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        result = run_diagnostic(
            args.manifest,
            args.model,
            args.upstream_root,
            diagnostics_directory=args.diagnostics,
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
