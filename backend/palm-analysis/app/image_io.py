from __future__ import annotations

from pathlib import Path
import hashlib
import json

import cv2
import numpy as np
from numpy.typing import NDArray

from app.evaluation import CompatibleAnnotation
from app.services.detector import PalmImageError, PalmLineDetectionResult


def load_local_image(path: Path) -> NDArray[np.uint8]:
    """Decode one explicitly selected local file without scanning its directory."""
    if not path.is_file():
        raise PalmImageError(f"File citra tidak ditemukan: {path}")
    encoded = np.fromfile(path, dtype=np.uint8)
    if encoded.size == 0:
        raise PalmImageError(f"File citra kosong: {path}")
    image = cv2.imdecode(encoded, cv2.IMREAD_UNCHANGED)
    encoded.fill(0)
    if image is None:
        raise PalmImageError(f"File bukan citra yang dapat dibaca: {path}")
    return image


def hash_decoded_rgba(image: NDArray[np.uint8]) -> str:
    """Hash canonical RGBA bytes to prove JS and Python received identical pixels."""
    if image.ndim == 2:
        rgba = cv2.cvtColor(image, cv2.COLOR_GRAY2RGBA)
    elif image.ndim == 3 and image.shape[2] == 3:
        rgba = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)
    elif image.ndim == 3 and image.shape[2] == 4:
        rgba = cv2.cvtColor(image, cv2.COLOR_BGRA2RGBA)
    else:
        raise PalmImageError("Format citra tidak dapat dinormalisasi menjadi RGBA.")
    try:
        return hashlib.sha256(np.ascontiguousarray(rgba).tobytes()).hexdigest()
    finally:
        rgba.fill(0)


def _write_image(path: Path, image: NDArray[np.uint8]) -> None:
    success, encoded = cv2.imencode(path.suffix, image)
    if not success:
        raise PalmImageError(f"Gagal mengenkode diagnostik: {path.name}")
    try:
        path.write_bytes(encoded.tobytes())
    finally:
        encoded.fill(0)


def save_diagnostics(
    result: PalmLineDetectionResult,
    source: NDArray[np.uint8],
    output_directory: Path,
    annotation: CompatibleAnnotation | None = None,
) -> list[Path]:
    """Persist diagnostics only after an explicit CLI output-directory request."""
    diagnostics = result.diagnostics
    if diagnostics is None:
        raise PalmImageError("Detektor tidak dijalankan dalam mode diagnostik.")
    output_directory.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    if source.ndim == 2:
        source_bgr = cv2.cvtColor(source, cv2.COLOR_GRAY2BGR)
    elif source.ndim == 3 and source.shape[2] == 4:
        source_bgr = cv2.cvtColor(source, cv2.COLOR_BGRA2BGR)
    else:
        source_bgr = source[:, :, :3].copy()
    original_path = output_directory / "00-original-roi.png"
    _write_image(original_path, source_bgr)
    written.append(original_path)

    stages = {
        "01-grayscale.png": diagnostics.grayscale,
        "02-normalized.png": diagnostics.normalized,
        "03-ridge-response.png": diagnostics.ridge_response,
        "04-threshold.png": diagnostics.threshold_map,
        "05-skeleton.png": diagnostics.skeleton,
        "07-blackhat-response.png": diagnostics.blackhat_response,
        "08-hessian-response.png": diagnostics.hessian_response,
        "09-weighted-response.png": diagnostics.weighted_response,
        "10-threshold-before-morphology.png": diagnostics.threshold_raw,
        "11-threshold-after-morphology.png": diagnostics.threshold_morphed,
    }
    for filename, image in stages.items():
        if image is None:
            continue
        target = output_directory / filename
        _write_image(target, image)
        written.append(target)

    overlay = source_bgr.copy()
    for candidate in result.candidates:
        points = np.array(
            [[round(point.x), round(point.y)] for point in candidate.points],
            dtype=np.int32,
        ).reshape(-1, 1, 2)
        cv2.polylines(overlay, [points], False, (255, 255, 0), 2, cv2.LINE_AA)
    overlay_path = output_directory / "06-candidate-overlay.png"
    _write_image(overlay_path, overlay)
    overlay.fill(0)
    written.append(overlay_path)

    scale_value = diagnostics.parameters.get("analysis_scale", 1.0)
    scale = float(scale_value) if isinstance(scale_value, (int, float)) and scale_value > 0 else 1.0
    thickness = max(1, round(min(source_bgr.shape[:2]) / 500))

    def mapped_contour(decision: dict[str, object]) -> NDArray[np.int32] | None:
        points = decision.get("points")
        if not isinstance(points, tuple) or len(points) < 2:
            return None
        contour = np.array(
            [[round(float(x) / scale), round(float(y) / scale)] for x, y in points],
            dtype=np.int32,
        ).reshape(-1, 1, 2)
        return cv2.approxPolyDP(contour, epsilon=max(1.0, 1.25 / scale), closed=False)

    prefilter = source_bgr.copy()
    for decision in diagnostics.path_decisions:
        contour = mapped_contour(decision)
        if contour is not None and len(contour) >= 2:
            cv2.polylines(prefilter, [contour], False, (0, 215, 255), thickness, cv2.LINE_AA)
    prefilter_path = output_directory / "12-candidates-before-filter.png"
    _write_image(prefilter_path, prefilter)
    prefilter.fill(0)
    written.append(prefilter_path)

    decision_colors = {
        "accepted": (0, 220, 0),
        "rejected-border": (0, 128, 255),
        "rejected-length": (0, 0, 255),
        "rejected-candidate-limit": (255, 0, 255),
        "rejected-simplification": (255, 128, 0),
        "rejected-mapped-length": (255, 128, 0),
        "rejected-degenerate": (128, 128, 128),
    }
    decisions_overlay = source_bgr.copy()
    for decision in diagnostics.path_decisions:
        contour = mapped_contour(decision)
        if contour is None or len(contour) < 2:
            continue
        color = decision_colors.get(str(decision.get("decision")), (255, 255, 255))
        cv2.polylines(decisions_overlay, [contour], False, color, thickness, cv2.LINE_AA)
    decisions_path = output_directory / "13-filter-decisions.png"
    _write_image(decisions_path, decisions_overlay)
    decisions_overlay.fill(0)
    written.append(decisions_path)

    border_overlay = source_bgr.copy()
    margin_value = diagnostics.parameters.get("border_filter_margin_analysis_pixels", 0.0)
    margin = max(0, round(float(margin_value) / scale)) if isinstance(margin_value, (int, float)) else 0
    if margin > 0:
        tint = border_overlay.copy()
        height, width = border_overlay.shape[:2]
        cv2.rectangle(tint, (0, 0), (width - 1, margin), (0, 0, 255), -1)
        cv2.rectangle(tint, (0, height - 1 - margin), (width - 1, height - 1), (0, 0, 255), -1)
        cv2.rectangle(tint, (0, 0), (margin, height - 1), (0, 0, 255), -1)
        cv2.rectangle(tint, (width - 1 - margin, 0), (width - 1, height - 1), (0, 0, 255), -1)
        cv2.addWeighted(tint, 0.28, border_overlay, 0.72, 0, border_overlay)
        tint.fill(0)
    border_path = output_directory / "14-border-rejection-area.png"
    _write_image(border_path, border_overlay)
    border_overlay.fill(0)
    written.append(border_path)

    if annotation is not None:
        manual_overlay = source_bgr.copy()
        comparison = source_bgr.copy()
        for polyline in annotation.polylines:
            points = np.array(
                [[round(point.x), round(point.y)] for point in polyline.points],
                dtype=np.int32,
            ).reshape(-1, 1, 2)
            cv2.polylines(manual_overlay, [points], False, (255, 0, 255), thickness * 2, cv2.LINE_AA)
            cv2.polylines(comparison, [points], False, (255, 0, 255), thickness * 2, cv2.LINE_AA)
        for candidate in result.candidates:
            points = np.array(
                [[round(point.x), round(point.y)] for point in candidate.points],
                dtype=np.int32,
            ).reshape(-1, 1, 2)
            cv2.polylines(comparison, [points], False, (255, 255, 0), thickness, cv2.LINE_AA)
        manual_path = output_directory / "15-manual-annotation.png"
        comparison_path = output_directory / "16-manual-vs-final.png"
        _write_image(manual_path, manual_overlay)
        _write_image(comparison_path, comparison)
        manual_overlay.fill(0)
        comparison.fill(0)
        written.extend([manual_path, comparison_path])

    report_path = output_directory / "diagnostics.json"
    report_path.write_text(
        json.dumps(result.to_payload(include_candidates=True), indent=2),
        encoding="utf-8",
    )
    written.append(report_path)
    source_bgr.fill(0)
    return written
