from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Literal, Sequence

from app.services.detector import PalmLineCandidate, PalmLinePoint


ANNOTATION_FORMAT = "metemu-palm-lines"
ANNOTATION_VERSION = 2
ROI_ALGORITHM_VERSION = "adaptive-roi-v1"
TOLERANCES = (3, 6, 9)


@dataclass(frozen=True)
class ManualPolyline:
    polyline_id: str
    points: tuple[PalmLinePoint, ...]


@dataclass(frozen=True)
class CompatibleAnnotation:
    sample_id: str
    completeness: Literal["complete", "partial", "unknown"]
    polylines: tuple[ManualPolyline, ...]
    baseline_extraction_version: str | None
    baseline_parameter_version: str | None


@dataclass(frozen=True)
class AnnotationResolution:
    compatibility: Literal[
        "exact",
        "unmatched",
        "roi-mismatch",
        "version-mismatch",
        "not-annotated",
        "undetermined",
        "invalid",
    ]
    reason: str
    annotation: CompatibleAnnotation | None = None


def fingerprint_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_annotation_document(path: Path) -> dict[str, object]:
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"Dokumen anotasi tidak dapat dibaca: {error}") from error
    if not isinstance(document, dict):
        raise ValueError("Dokumen anotasi bukan objek JSON.")
    if document.get("format") != ANNOTATION_FORMAT or document.get("version") != ANNOTATION_VERSION:
        raise ValueError("Benchmark hanya menerima metemu-palm-lines versi 2.")
    if not isinstance(document.get("samples"), list):
        raise ValueError("Dokumen anotasi tidak memiliki daftar samples.")
    return document


def _valid_polylines(
    value: object,
    width: int,
    height: int,
) -> tuple[ManualPolyline, ...] | None:
    if not isinstance(value, list):
        return None
    output: list[ManualPolyline] = []
    for index, item in enumerate(value):
        if not isinstance(item, dict) or not isinstance(item.get("points"), list):
            return None
        points: list[PalmLinePoint] = []
        valid = True
        for point in item["points"]:
            if not isinstance(point, dict):
                valid = False
                break
            x = point.get("x")
            y = point.get("y")
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
                valid = False
                break
            points.append(PalmLinePoint(float(x), float(y)))
        if not valid or len(points) < 2:
            return None
        output.append(
            ManualPolyline(
                polyline_id=str(item.get("id") or f"manual-{index + 1}"),
                points=tuple(points),
            ),
        )
    return tuple(output)


def resolve_annotation(
    document: dict[str, object],
    *,
    sample_fingerprint: str,
    roi_signature: str,
    roi_width: int,
    roi_height: int,
    roi_algorithm_version: str = ROI_ALGORITHM_VERSION,
) -> AnnotationResolution:
    samples = document.get("samples")
    if not isinstance(samples, list):
        return AnnotationResolution("invalid", "Daftar anotasi tidak valid.")
    matching = [
        sample
        for sample in samples
        if isinstance(sample, dict)
        and sample.get("sample_fingerprint") == sample_fingerprint
    ]
    if not matching:
        return AnnotationResolution("unmatched", "Fingerprint sumber tidak cocok.")
    roi_matching = [
        sample
        for sample in matching
        if sample.get("roi_signature") == roi_signature
        and sample.get("roi_width") == roi_width
        and sample.get("roi_height") == roi_height
    ]
    if not roi_matching:
        return AnnotationResolution(
            "roi-mismatch",
            "Fingerprint cocok, tetapi ROI signature atau dimensinya berbeda.",
        )
    sample = roi_matching[0]
    if sample.get("roi_algorithm_version") != roi_algorithm_version:
        return AnnotationResolution(
            "version-mismatch",
            "Versi algoritma ROI tidak cocok.",
        )
    status = sample.get("status", sample.get("annotation_status"))
    width = int(roi_width)
    height = int(roi_height)
    if status == "undetermined":
        return AnnotationResolution(
            "undetermined",
            "Sampel ditandai belum dapat ditentukan dan tidak boleh diberi skor.",
        )
    polylines = _valid_polylines(sample.get("polylines"), width, height)
    if status == "annotated" and polylines is None:
        return AnnotationResolution(
            "invalid",
            "Polyline manual tidak valid atau memiliki koordinat di luar ROI.",
        )
    if status != "annotated" or not polylines:
        return AnnotationResolution(
            "not-annotated",
            "Sampel belum memiliki polyline manual yang dapat dinilai.",
        )
    completeness_value = sample.get("completeness")
    completeness: Literal["complete", "partial", "unknown"] = (
        completeness_value
        if completeness_value in {"complete", "partial", "unknown"}
        else "unknown"
    )
    return AnnotationResolution(
        "exact",
        "Fingerprint, ROI signature, dimensi, dan versi ROI cocok.",
        CompatibleAnnotation(
            sample_id=str(sample.get("sample_id") or "unlabeled"),
            completeness=completeness,
            polylines=polylines,
            baseline_extraction_version=(
                str(sample["line_extraction_version"])
                if isinstance(sample.get("line_extraction_version"), str)
                else None
            ),
            baseline_parameter_version=(
                str(sample["line_parameter_version"])
                if isinstance(sample.get("line_parameter_version"), str)
                else None
            ),
        ),
    )


PointSequence = Sequence[PalmLinePoint]


def _segments(polylines: Iterable[PointSequence]) -> list[tuple[PalmLinePoint, PalmLinePoint]]:
    return [
        (first, second)
        for points in polylines
        for first, second in zip(points, points[1:])
        if first != second
    ]


def _squared_distance_to_segment(
    point: PalmLinePoint,
    segment: tuple[PalmLinePoint, PalmLinePoint],
) -> float:
    start, end = segment
    delta_x = end.x - start.x
    delta_y = end.y - start.y
    denominator = delta_x * delta_x + delta_y * delta_y
    if denominator == 0:
        return (point.x - start.x) ** 2 + (point.y - start.y) ** 2
    ratio = max(
        0.0,
        min(
            1.0,
            ((point.x - start.x) * delta_x + (point.y - start.y) * delta_y)
            / denominator,
        ),
    )
    projection_x = start.x + ratio * delta_x
    projection_y = start.y + ratio * delta_y
    return (point.x - projection_x) ** 2 + (point.y - projection_y) ** 2


def _length_coverage(
    source: Iterable[PointSequence],
    target: Iterable[PointSequence],
    tolerance: float,
) -> float:
    source_segments = _segments(source)
    target_segments = _segments(target)
    if not source_segments or not target_segments:
        return 0.0
    tolerance_squared = tolerance * tolerance
    total_length = 0.0
    matched_length = 0.0
    for start, end in source_segments:
        length = math.hypot(end.x - start.x, end.y - start.y)
        steps = max(1, math.ceil(length))
        step_length = length / steps
        total_length += length
        for step in range(steps):
            ratio = (step + 0.5) / steps
            midpoint = PalmLinePoint(
                start.x + (end.x - start.x) * ratio,
                start.y + (end.y - start.y) * ratio,
            )
            if any(
                _squared_distance_to_segment(midpoint, segment) <= tolerance_squared
                for segment in target_segments
            ):
                matched_length += step_length
    return matched_length / total_length if total_length else 0.0


def score_candidates(
    candidates: Sequence[PalmLineCandidate],
    annotation: CompatibleAnnotation,
) -> list[dict[str, float | int]]:
    candidate_lines = [candidate.points for candidate in candidates]
    manual_lines = [polyline.points for polyline in annotation.polylines]
    scores: list[dict[str, float | int]] = []
    for tolerance in TOLERANCES:
        coverage = _length_coverage(manual_lines, candidate_lines, tolerance)
        precision = _length_coverage(candidate_lines, manual_lines, tolerance)
        f1 = (
            2.0 * coverage * precision / (coverage + precision)
            if coverage + precision
            else 0.0
        )
        scores.append(
            {
                "tolerance_pixels": tolerance,
                "coverage": coverage,
                "precision": precision,
                "f1": f1,
            },
        )
    return scores
