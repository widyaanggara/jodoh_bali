from __future__ import annotations

import argparse
import json
import math
import re
import sys
from pathlib import Path
from typing import Sequence

from app.evaluation import (
    ROI_ALGORITHM_VERSION,
    fingerprint_file,
    load_annotation_document,
    resolve_annotation,
    score_candidates,
)
from app.image_io import hash_decoded_rgba, load_local_image
from app.services.detector import (
    PalmImageError,
    PalmLineCandidate,
    PalmLinePoint,
    detect_palm_lines,
)


def _resolve(base: Path, value: object) -> Path:
    if not isinstance(value, str) or not value:
        raise ValueError("Path manifest kosong atau tidak valid.")
    path = Path(value)
    return path if path.is_absolute() else (base / path).resolve()


def _sha256(value: object, label: str) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[a-fA-F0-9]{64}", value):
        raise ValueError(f"{label} bukan SHA-256 yang valid.")
    return value.lower()


def _source_fingerprint(sample: dict[str, object], base: Path) -> str:
    declared = sample.get("source_fingerprint")
    fingerprint = _sha256(declared, "Fingerprint sumber") if declared is not None else None
    if sample.get("source_path") is not None:
        actual = fingerprint_file(_resolve(base, sample["source_path"]))
        if fingerprint is not None and fingerprint != actual:
            raise ValueError("Fingerprint sumber tidak cocok dengan source_path.")
        return actual
    if fingerprint is None:
        raise ValueError("Manifest wajib membawa source_fingerprint atau source_path.")
    return fingerprint


def _javascript_baseline(
    value: object,
    width: int,
    height: int,
) -> tuple[dict[str, object], tuple[PalmLineCandidate, ...]]:
    if not isinstance(value, dict):
        raise ValueError("Baseline JavaScript tidak tersedia pada manifest.")
    raw_candidates = value.get("candidates")
    if not isinstance(raw_candidates, list):
        raise ValueError("Daftar kandidat JavaScript tidak valid.")
    candidates: list[PalmLineCandidate] = []
    for index, raw_candidate in enumerate(raw_candidates):
        if not isinstance(raw_candidate, dict) or not isinstance(raw_candidate.get("points"), list):
            raise ValueError("Kandidat JavaScript tidak memiliki points.")
        points: list[PalmLinePoint] = []
        for raw_point in raw_candidate["points"]:
            if not isinstance(raw_point, dict):
                raise ValueError("Koordinat kandidat JavaScript tidak valid.")
            x = raw_point.get("x")
            y = raw_point.get("y")
            if (
                not isinstance(x, (int, float))
                or not isinstance(y, (int, float))
                or not math.isfinite(float(x))
                or not math.isfinite(float(y))
                or float(x) < 0
                or float(x) >= width
                or float(y) < 0
                or float(y) >= height
            ):
                raise ValueError("Koordinat kandidat JavaScript berada di luar ROI.")
            points.append(PalmLinePoint(float(x), float(y)))
        if len(points) < 2:
            raise ValueError("Polyline kandidat JavaScript memiliki kurang dari dua titik.")
        length = raw_candidate.get("length_pixels")
        if not isinstance(length, (int, float)) or not math.isfinite(float(length)) or length <= 0:
            raise ValueError("Panjang kandidat JavaScript tidak valid.")
        candidates.append(
            PalmLineCandidate(
                candidate_id=str(raw_candidate.get("id") or f"js-{index + 1}"),
                points=tuple(points),
                length_pixels=float(length),
                average_response=0.0,
                border_fraction=0.0,
                near_outer_contour=False,
            ),
        )
    if value.get("candidate_count") != len(candidates):
        raise ValueError("Jumlah kandidat JavaScript tidak cocok dengan manifest.")
    return value, tuple(candidates)


def _fragmentation(candidate_count: int, total_length: float) -> float | None:
    return candidate_count * 100.0 / total_length if total_length > 0 else None


def _summary(rows: list[dict[str, object]], score_field: str) -> list[dict[str, object]]:
    summary: list[dict[str, object]] = []
    for tolerance in (3, 6, 9):
        values = [
            score
            for row in rows
            for score in row.get(score_field, [])
            if score["tolerance_pixels"] == tolerance
        ]
        summary.append(
            {
                "tolerance_pixels": tolerance,
                "denominator": len(values),
                "coverage": sum(float(value["coverage"]) for value in values) / len(values) if values else None,
                "precision": sum(float(value["precision"]) for value in values) / len(values) if values else None,
                "f1": sum(float(value["f1"]) for value in values) / len(values) if values else None,
            },
        )
    return summary


def _algorithm_summary(rows: list[dict[str, object]], field: str) -> dict[str, object]:
    values = [row[field] for row in rows if isinstance(row.get(field), dict)]
    detected = [value for value in values if value.get("status") in {"detected", "candidates"}]

    def average(name: str) -> float | None:
        numbers = [float(value[name]) for value in values if isinstance(value.get(name), (int, float))]
        return sum(numbers) / len(numbers) if numbers else None

    return {
        "sample_count": len(values),
        "positive_annotated_count": len(values),
        "detected_count": len(detected),
        "abstain_count": len(values) - len(detected),
        "detection_coverage_failure_count": len(values) - len(detected),
        "abstain_rate": (len(values) - len(detected)) / len(values) if values else None,
        "line_output_rate": len(detected) / len(values) if values else None,
        "candidate_count_total": sum(int(value.get("candidate_count") or 0) for value in values),
        "total_length_pixels": sum(float(value.get("total_length_pixels") or 0) for value in values),
        "mean_fragmentation_per_100px": average("fragmentation_per_100px"),
        "mean_near_outer_contour_ratio": average("near_outer_contour_ratio"),
        "mean_processing_time_ms": average("processing_time_ms"),
    }


def _group_summary(rows: list[dict[str, object]], key: str) -> list[dict[str, object]]:
    groups = sorted({str(row.get(key) or "unknown") for row in rows})
    return [
        {
            key: group,
            "sample_count": len(group_rows := [row for row in rows if str(row.get(key) or "unknown") == group]),
            "python_summary": _summary(group_rows, "python_scores"),
            "javascript_summary": _summary(group_rows, "javascript_scores"),
            "python_diagnostics": _algorithm_summary(group_rows, "python"),
            "javascript_diagnostics": _algorithm_summary(group_rows, "javascript"),
        }
        for group in groups
    ]


def _build_result(output: list[dict[str, object]]) -> dict[str, object]:
    scored = [row for row in output if row.get("validation_status") == "valid"]
    return {
        "format": "metemu-palm-benchmark-result",
        "version": 1,
        "sample_count": len(output),
        "compatible_count": len(scored),
        "undetermined_count": sum(row.get("validation_status") == "undetermined" for row in output),
        "invalid_count": sum(row.get("validation_status") == "invalid" for row in output),
        "python_scored_count": sum(bool(row.get("python_scores")) for row in scored),
        "javascript_scored_count": sum(bool(row.get("javascript_scores")) for row in scored),
        "python_summary_by_tolerance": _summary(scored, "python_scores"),
        "javascript_summary_by_tolerance": _summary(scored, "javascript_scores"),
        "python_diagnostics": _algorithm_summary(scored, "python"),
        "javascript_diagnostics": _algorithm_summary(scored, "javascript"),
        "by_subject": _group_summary(scored, "subject_group"),
        "by_split": _group_summary(scored, "split"),
        "samples": output,
    }


def run_manifest(manifest_path: Path) -> dict[str, object]:
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"Manifest benchmark tidak dapat dibaca: {error}") from error
    if not isinstance(manifest, dict) or manifest.get("format") != "metemu-palm-benchmark":
        raise ValueError("Format manifest benchmark tidak dikenali.")
    if manifest.get("version") != 1 or not isinstance(manifest.get("samples"), list):
        raise ValueError("Manifest benchmark harus versi 1 dan memiliki samples.")
    base = manifest_path.parent
    annotations = load_annotation_document(_resolve(base, manifest.get("annotations")))
    output: list[dict[str, object]] = []

    for index, sample in enumerate(manifest["samples"]):
        if not isinstance(sample, dict):
            output.append({"sample_id": f"sample-{index + 1}", "compatibility": "invalid"})
            continue
        sample_id = str(sample.get("sample_id") or f"sample-{index + 1}")
        image = None
        try:
            roi_path = _resolve(base, sample.get("roi_path"))
            roi_signature = sample.get("roi_signature")
            if not isinstance(roi_signature, str) or not roi_signature:
                raise ValueError("ROI signature wajib tersedia pada manifest.")
            expected_file_hash = _sha256(sample.get("roi_sha256"), "SHA-256 file ROI")
            if fingerprint_file(roi_path) != expected_file_hash:
                raise ValueError("SHA-256 file ROI tidak cocok; scoring ditolak.")
            image = load_local_image(roi_path)
            height, width = image.shape[:2]
            expected_pixel_hash = _sha256(sample.get("roi_pixel_sha256"), "SHA-256 piksel ROI")
            if hash_decoded_rgba(image) != expected_pixel_hash:
                raise ValueError("SHA-256 piksel ROI tidak cocok; decoding atau file telah berubah.")
            if sample.get("roi_width") != width or sample.get("roi_height") != height:
                raise ValueError("Dimensi ROI tidak cocok dengan manifest.")
            if sample.get("roi_algorithm_version") != ROI_ALGORITHM_VERSION:
                raise ValueError("Versi adaptive ROI tidak cocok.")
            resolution = resolve_annotation(
                annotations,
                sample_fingerprint=_source_fingerprint(sample, base),
                roi_signature=roi_signature,
                roi_width=width,
                roi_height=height,
            )
            row: dict[str, object] = {
                "sample_id": sample_id,
                "subject_group": str(sample.get("subject_group") or "unknown"),
                "split": str(sample.get("split") or "unspecified"),
                "compatibility": resolution.compatibility,
                "compatibility_reason": resolution.reason,
                "validation_status": (
                    "valid"
                    if resolution.compatibility == "exact"
                    else "undetermined"
                    if resolution.compatibility == "undetermined"
                    else "invalid"
                ),
                "roi_width": width,
                "roi_height": height,
                "pixel_identity_verified": True,
            }
            if resolution.compatibility != "exact" or resolution.annotation is None:
                output.append(row)
                continue
            if resolution.annotation.sample_id != sample_id:
                raise ValueError("Sample ID manifest tidak cocok dengan anotasi.")

            javascript, javascript_candidates = _javascript_baseline(sample.get("javascript_baseline"), width, height)
            detection = detect_palm_lines(image)
            python_scores = score_candidates(detection.candidates, resolution.annotation) if detection.status == "candidates" else []
            javascript_status = str(javascript.get("status") or "abstain")
            javascript_scores = score_candidates(javascript_candidates, resolution.annotation) if javascript_status == "detected" else []
            javascript_total = float(javascript.get("total_length_pixels") or 0.0)
            javascript_border = javascript.get("near_outer_contour_count")
            python_border = sum(candidate.near_outer_contour for candidate in detection.candidates)
            row.update(
                {
                    "annotation_completeness": resolution.annotation.completeness,
                    "positive_annotated_sample": True,
                    "scores_provisional": resolution.annotation.completeness != "complete",
                    "python": {
                        "algorithm_version": detection.algorithm_version,
                        "status": detection.status,
                        "detection_coverage_failure": detection.status == "abstain",
                        "abstain_reason": detection.abstain_reason,
                        "candidate_count": detection.candidate_count,
                        "total_length_pixels": round(detection.total_length_pixels, 3),
                        "fragmentation_per_100px": _fragmentation(detection.candidate_count, detection.total_length_pixels),
                        "near_outer_contour_count": python_border,
                        "near_outer_contour_ratio": python_border / detection.candidate_count if detection.candidate_count else None,
                        "processing_time_ms": round(detection.processing_time_ms, 3),
                    },
                    "javascript": {
                        "algorithm_version": javascript.get("algorithm_version"),
                        "status": javascript_status,
                        "detection_coverage_failure": javascript_status != "detected",
                        "abstain_reason": javascript.get("abstain_reason"),
                        "candidate_count": len(javascript_candidates),
                        "total_length_pixels": javascript_total,
                        "fragmentation_per_100px": _fragmentation(len(javascript_candidates), javascript_total),
                        "near_outer_contour_count": javascript_border,
                        "near_outer_contour_ratio": float(javascript_border) / len(javascript_candidates) if isinstance(javascript_border, (int, float)) and javascript_candidates else None,
                        "processing_time_ms": javascript.get("processing_time_ms"),
                    },
                    "python_scores": python_scores,
                    "javascript_scores": javascript_scores,
                },
            )
            output.append(row)
        except (PalmImageError, ValueError, OSError) as error:
            output.append(
                {
                    "sample_id": sample_id,
                    "subject_group": str(sample.get("subject_group") or "unknown"),
                    "split": str(sample.get("split") or "unspecified"),
                    "compatibility": "invalid",
                    "compatibility_reason": str(error),
                    "validation_status": "invalid",
                    "pixel_identity_verified": False,
                },
            )
        finally:
            if image is not None:
                image.fill(0)

    return _build_result(output)


def run_manifests(manifest_paths: Sequence[Path]) -> dict[str, object]:
    if not manifest_paths:
        raise ValueError("Setidaknya satu manifest benchmark diperlukan.")
    samples: list[dict[str, object]] = []
    seen_sample_ids: set[str] = set()
    for manifest_path in manifest_paths:
        result = run_manifest(manifest_path)
        for row in result["samples"]:
            sample_id = str(row.get("sample_id") or "")
            if sample_id in seen_sample_ids:
                raise ValueError(f"Sample ID duplikat pada pilot: {sample_id}.")
            seen_sample_ids.add(sample_id)
            samples.append(row)
    combined = _build_result(samples)
    combined["manifest_count"] = len(manifest_paths)
    return combined


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compare JS and Python only for exact ROI/annotation pairs.")
    parser.add_argument("manifest", type=Path, nargs="+")
    args = parser.parse_args(argv)
    try:
        print(json.dumps(run_manifests(args.manifest), indent=2))
        return 0
    except ValueError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
