from __future__ import annotations

from dataclasses import asdict, dataclass, field
from time import perf_counter
from typing import Literal

import cv2
import numpy as np
from numpy.typing import NDArray


ALGORITHM_VERSION = "opencv-palm-lines-v1"


class PalmImageError(ValueError):
    """Raised when an input cannot be treated as a palm ROI image."""


@dataclass(frozen=True)
class DetectorConfig:
    max_analysis_dimension: int = 640
    minimum_dimension: int = 64
    minimum_contrast: float = 7.0
    minimum_sharpness: float = 3.0
    response_percentile: float = 97.0
    minimum_response: float = 7.0
    minimum_length_ratio: float = 0.09
    border_margin_ratio: float = 0.07
    maximum_border_fraction: float = 0.55
    maximum_candidates: int = 24


DEFAULT_CONFIG = DetectorConfig()


@dataclass(frozen=True)
class PalmLinePoint:
    x: float
    y: float


@dataclass(frozen=True)
class PalmLineCandidate:
    candidate_id: str
    points: tuple[PalmLinePoint, ...]
    length_pixels: float
    average_response: float
    border_fraction: float
    near_outer_contour: bool

    def to_payload(self) -> dict[str, object]:
        return {
            "id": self.candidate_id,
            "points": [
                {"x": round(point.x, 3), "y": round(point.y, 3)}
                for point in self.points
            ],
            "length_pixels": round(self.length_pixels, 3),
            "average_response": round(self.average_response, 3),
            "border_fraction": round(self.border_fraction, 4),
            "near_outer_contour": self.near_outer_contour,
        }


@dataclass
class DetectorDiagnostics:
    grayscale: NDArray[np.uint8] | None = None
    normalized: NDArray[np.uint8] | None = None
    ridge_response: NDArray[np.uint8] | None = None
    blackhat_response: NDArray[np.uint8] | None = None
    hessian_response: NDArray[np.uint8] | None = None
    weighted_response: NDArray[np.uint8] | None = None
    threshold_raw: NDArray[np.uint8] | None = None
    threshold_morphed: NDArray[np.uint8] | None = None
    threshold_map: NDArray[np.uint8] | None = None
    skeleton: NDArray[np.uint8] | None = None
    parameters: dict[str, object] = field(default_factory=dict)
    stage_metrics: dict[str, object] = field(default_factory=dict)
    stage_timings_ms: dict[str, float] = field(default_factory=dict)
    path_decisions: list[dict[str, object]] = field(default_factory=list)

    def summary_payload(self) -> dict[str, object]:
        return {
            "parameters": self.parameters,
            "stage_metrics": self.stage_metrics,
            "stage_timings_ms": {
                key: round(value, 3) for key, value in self.stage_timings_ms.items()
            },
        }


@dataclass
class PalmLineDetectionResult:
    algorithm_version: str
    status: Literal["candidates", "abstain"]
    abstain_reason: str | None
    roi_width: int
    roi_height: int
    analysis_width: int
    analysis_height: int
    candidate_count: int
    total_length_pixels: float
    processing_time_ms: float
    quality: dict[str, float]
    candidates: tuple[PalmLineCandidate, ...] = field(default_factory=tuple)
    diagnostics: DetectorDiagnostics | None = None

    def to_payload(self, *, include_candidates: bool = True) -> dict[str, object]:
        payload: dict[str, object] = {
            "algorithm_version": self.algorithm_version,
            "status": self.status,
            "abstain_reason": self.abstain_reason,
            "roi_width": self.roi_width,
            "roi_height": self.roi_height,
            "analysis_width": self.analysis_width,
            "analysis_height": self.analysis_height,
            "candidate_count": self.candidate_count,
            "total_length_pixels": round(self.total_length_pixels, 3),
            "processing_time_ms": round(self.processing_time_ms, 3),
            "quality": {key: round(value, 3) for key, value in self.quality.items()},
        }
        if include_candidates:
            payload["candidates"] = [candidate.to_payload() for candidate in self.candidates]
        if self.diagnostics is not None:
            payload["diagnostics"] = self.diagnostics.summary_payload()
        return payload


def _validate_image(image: NDArray[np.generic]) -> NDArray[np.uint8]:
    if not isinstance(image, np.ndarray) or image.size == 0:
        raise PalmImageError("Citra ROI kosong atau bukan array NumPy.")
    if image.ndim == 2:
        grayscale = image
    elif image.ndim == 3 and image.shape[2] == 3:
        grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    elif image.ndim == 3 and image.shape[2] == 4:
        grayscale = cv2.cvtColor(image, cv2.COLOR_BGRA2GRAY)
    else:
        raise PalmImageError("Format citra harus grayscale, BGR, atau BGRA.")
    if grayscale.dtype != np.uint8:
        if not np.issubdtype(grayscale.dtype, np.number):
            raise PalmImageError("Tipe piksel citra tidak didukung.")
        finite = np.nan_to_num(grayscale, nan=0.0, posinf=255.0, neginf=0.0)
        grayscale = np.clip(finite, 0, 255).astype(np.uint8)
    return np.ascontiguousarray(grayscale)


def _odd(value: float, minimum: int = 3) -> int:
    rounded = max(minimum, int(round(value)))
    return rounded if rounded % 2 == 1 else rounded + 1


def _quality_metrics(grayscale: NDArray[np.uint8]) -> dict[str, float]:
    return {
        "brightness": float(np.mean(grayscale)),
        "contrast": float(np.std(grayscale)),
        "sharpness": float(cv2.Laplacian(grayscale, cv2.CV_64F).var()),
    }


def _resize_for_analysis(
    grayscale: NDArray[np.uint8],
    maximum_dimension: int,
) -> tuple[NDArray[np.uint8], float]:
    height, width = grayscale.shape
    scale = min(1.0, maximum_dimension / max(width, height))
    if scale == 1.0:
        return grayscale.copy(), scale
    resized = cv2.resize(
        grayscale,
        (max(1, round(width * scale)), max(1, round(height * scale))),
        interpolation=cv2.INTER_AREA,
    )
    return resized, scale


def _normalize_illumination(
    grayscale: NDArray[np.uint8],
    diagnostics: DetectorDiagnostics | None = None,
) -> NDArray[np.uint8]:
    height, width = grayscale.shape
    tiles = max(4, min(8, min(width, height) // 32))
    clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(tiles, tiles))
    stage_started = perf_counter()
    local_contrast = clahe.apply(grayscale)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["clahe"] = (perf_counter() - stage_started) * 1000.0
        diagnostics.parameters["clahe_clip_limit"] = 1.8
        diagnostics.parameters["clahe_tile_grid"] = [tiles, tiles]
    sigma = max(5.0, min(width, height) * 0.075)
    stage_started = perf_counter()
    background = cv2.GaussianBlur(local_contrast, (0, 0), sigmaX=sigma, sigmaY=sigma)
    normalized = cv2.addWeighted(local_contrast, 1.0, background, -1.0, 128.0)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["background_normalization"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.parameters["background_sigma"] = sigma
    return np.clip(normalized, 0, 255).astype(np.uint8)


def _robust_uint8(values: NDArray[np.floating]) -> NDArray[np.uint8]:
    positive = values[values > 0]
    if positive.size == 0:
        return np.zeros(values.shape, dtype=np.uint8)
    ceiling = float(np.percentile(positive, 99.5))
    if ceiling <= 0:
        return np.zeros(values.shape, dtype=np.uint8)
    return np.clip(values * (255.0 / ceiling), 0, 255).astype(np.uint8)


def _dark_ridge_response(
    normalized: NDArray[np.uint8],
    diagnostics: DetectorDiagnostics | None = None,
) -> NDArray[np.uint8]:
    height, width = normalized.shape
    minimum = min(width, height)
    first_size = _odd(minimum * 0.035, 7)
    second_size = _odd(minimum * 0.075, 13)
    first_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (first_size, first_size))
    second_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (second_size, second_size))
    stage_started = perf_counter()
    first_blackhat = cv2.morphologyEx(normalized, cv2.MORPH_BLACKHAT, first_kernel)
    second_blackhat = cv2.morphologyEx(normalized, cv2.MORPH_BLACKHAT, second_kernel)
    blackhat = cv2.max(first_blackhat, second_blackhat)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["morphological_blackhat"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.parameters["blackhat_kernel_sizes"] = [first_size, second_size]
        diagnostics.blackhat_response = blackhat.copy()

    stage_started = perf_counter()
    smooth = cv2.GaussianBlur(normalized, (0, 0), 1.1)
    dxx = cv2.Sobel(smooth, cv2.CV_32F, 2, 0, ksize=3)
    dyy = cv2.Sobel(smooth, cv2.CV_32F, 0, 2, ksize=3)
    dxy = cv2.Sobel(smooth, cv2.CV_32F, 1, 1, ksize=3)
    discriminant = np.sqrt(np.maximum(0.0, (dxx - dyy) ** 2 + 4.0 * dxy**2))
    ridge_eigenvalue = np.maximum(0.0, 0.5 * (dxx + dyy + discriminant))
    hessian = _robust_uint8(ridge_eigenvalue)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["hessian_ridge_response"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.parameters["hessian_smoothing_sigma"] = 1.1
        diagnostics.hessian_response = hessian.copy()

    stage_started = perf_counter()
    combined = cv2.addWeighted(blackhat, 0.7, hessian, 0.3, 0.0)
    response = cv2.GaussianBlur(combined, (3, 3), 0.6)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["ridge_combination"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.parameters["blackhat_weight"] = 0.7
        diagnostics.parameters["hessian_weight"] = 0.3
        diagnostics.stage_metrics["positive_ridge_response_pixels"] = int(
            cv2.countNonZero(response),
        )
    return response


def _interior_weight(height: int, width: int, margin: float) -> NDArray[np.float32]:
    y_coordinates, x_coordinates = np.ogrid[:height, :width]
    distance = np.minimum.reduce(
        [
            np.broadcast_to(x_coordinates, (height, width)),
            np.broadcast_to(width - 1 - x_coordinates, (height, width)),
            np.broadcast_to(y_coordinates, (height, width)),
            np.broadcast_to(height - 1 - y_coordinates, (height, width)),
        ],
    ).astype(np.float32)
    return np.clip(distance / max(1.0, margin * 1.5), 0.25, 1.0)


def _threshold_ridges(
    response: NDArray[np.uint8],
    config: DetectorConfig,
    diagnostics: DetectorDiagnostics | None = None,
) -> NDArray[np.uint8]:
    height, width = response.shape
    margin = max(3.0, min(width, height) * config.border_margin_ratio)
    stage_started = perf_counter()
    weighted = response.astype(np.float32) * _interior_weight(height, width, margin)
    central = weighted[
        round(margin) : max(round(margin) + 1, height - round(margin)),
        round(margin) : max(round(margin) + 1, width - round(margin)),
    ]
    positive = central[central > 0]
    if positive.size == 0:
        if diagnostics is not None:
            diagnostics.stage_timings_ms["interior_weighting_and_threshold"] = (
                perf_counter() - stage_started
            ) * 1000.0
            diagnostics.stage_metrics.update({
                "central_positive_response_pixels": 0,
                "threshold_value": None,
                "threshold_pixels_before_morphology": 0,
                "components_before_morphology": 0,
                "components_after_morphology": 0,
                "components_after_area_filter": 0,
                "threshold_pixels_after_cleanup": 0,
            })
        return np.zeros(response.shape, dtype=np.uint8)
    threshold = max(config.minimum_response, float(np.percentile(positive, config.response_percentile)))
    binary = np.where(weighted >= threshold, 255, 0).astype(np.uint8)
    binary[:2, :] = 0
    binary[-2:, :] = 0
    binary[:, :2] = 0
    binary[:, -2:] = 0
    if diagnostics is not None:
        diagnostics.stage_timings_ms["interior_weighting_and_threshold"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.parameters["analysis_border_margin_pixels"] = margin
        diagnostics.parameters["response_threshold"] = threshold
        diagnostics.stage_metrics["central_positive_response_pixels"] = int(positive.size)
        diagnostics.stage_metrics["threshold_pixels_before_morphology"] = int(
            cv2.countNonZero(binary),
        )
        diagnostics.stage_metrics["components_before_morphology"] = max(
            0,
            cv2.connectedComponents(binary, 8)[0] - 1,
        )
        diagnostics.threshold_raw = binary.copy()
        diagnostics.weighted_response = np.clip(weighted, 0, 255).astype(np.uint8)
    stage_started = perf_counter()
    binary = cv2.morphologyEx(
        binary,
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)),
    )
    if diagnostics is not None:
        diagnostics.stage_timings_ms["morphological_cleanup"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.threshold_morphed = binary.copy()
    stage_started = perf_counter()
    component_count, labels, stats, _ = cv2.connectedComponentsWithStats(binary, 8)
    minimum_area = max(5, round(min(width, height) * 0.025))
    cleaned = np.zeros(binary.shape, dtype=np.uint8)
    retained_components = 0
    for label in range(1, component_count):
        if int(stats[label, cv2.CC_STAT_AREA]) >= minimum_area:
            cleaned[labels == label] = 255
            retained_components += 1
    if diagnostics is not None:
        diagnostics.stage_timings_ms["connected_component_area_filter"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.parameters["minimum_component_area_pixels"] = minimum_area
        diagnostics.stage_metrics["components_after_morphology"] = component_count - 1
        diagnostics.stage_metrics["components_after_area_filter"] = retained_components
        diagnostics.stage_metrics["threshold_pixels_after_cleanup"] = int(
            cv2.countNonZero(cleaned),
        )
    return cleaned


def _skeletonize(binary: NDArray[np.uint8]) -> NDArray[np.uint8]:
    working = binary.copy()
    skeleton = np.zeros(binary.shape, dtype=np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    maximum_iterations = max(binary.shape) * 2
    for _ in range(maximum_iterations):
        if cv2.countNonZero(working) == 0:
            break
        eroded = cv2.erode(working, kernel)
        opened = cv2.dilate(eroded, kernel)
        skeleton = cv2.bitwise_or(skeleton, cv2.subtract(working, opened))
        working = eroded
    return skeleton


Pixel = tuple[int, int]
Edge = tuple[Pixel, Pixel]


def _canonical_edge(first: Pixel, second: Pixel) -> Edge:
    return (first, second) if first <= second else (second, first)


def _neighbors(pixel: Pixel, pixels: set[Pixel]) -> list[Pixel]:
    y, x = pixel
    return sorted(
        (candidate_y, candidate_x)
        for candidate_y in range(y - 1, y + 2)
        for candidate_x in range(x - 1, x + 2)
        if (candidate_y, candidate_x) != pixel
        and (candidate_y, candidate_x) in pixels
    )


def _trace_skeleton(skeleton: NDArray[np.uint8]) -> list[list[Pixel]]:
    coordinates = np.argwhere(skeleton > 0)
    pixels: set[Pixel] = {(int(y), int(x)) for y, x in coordinates}
    if not pixels:
        return []
    neighbor_map = {pixel: _neighbors(pixel, pixels) for pixel in pixels}
    nodes = sorted(pixel for pixel, neighbors in neighbor_map.items() if len(neighbors) != 2)
    visited: set[Edge] = set()
    paths: list[list[Pixel]] = []

    def walk(start: Pixel, following: Pixel) -> list[Pixel]:
        path = [start]
        previous = start
        current = following
        visited.add(_canonical_edge(previous, current))
        while True:
            path.append(current)
            available = [
                neighbor
                for neighbor in neighbor_map[current]
                if neighbor != previous and _canonical_edge(current, neighbor) not in visited
            ]
            if len(neighbor_map[current]) != 2 or not available:
                break
            next_pixel = available[0]
            visited.add(_canonical_edge(current, next_pixel))
            previous, current = current, next_pixel
        return path

    for node in nodes:
        for neighbor in neighbor_map[node]:
            if _canonical_edge(node, neighbor) not in visited:
                paths.append(walk(node, neighbor))

    for pixel in sorted(pixels):
        for neighbor in neighbor_map[pixel]:
            if _canonical_edge(pixel, neighbor) not in visited:
                paths.append(walk(pixel, neighbor))
    return paths


def _path_length(points: list[tuple[float, float]]) -> float:
    return sum(
        float(np.hypot(second[0] - first[0], second[1] - first[1]))
        for first, second in zip(points, points[1:])
    )


def _build_candidates(
    paths: list[list[Pixel]],
    response: NDArray[np.uint8],
    scale: float,
    roi_width: int,
    roi_height: int,
    config: DetectorConfig,
    diagnostics: DetectorDiagnostics | None = None,
) -> tuple[PalmLineCandidate, ...]:
    analysis_height, analysis_width = response.shape
    minimum_length = max(10.0, min(analysis_width, analysis_height) * config.minimum_length_ratio)
    margin = max(3.0, min(analysis_width, analysis_height) * config.border_margin_ratio)
    retained: list[tuple[list[Pixel], float, float, float]] = []
    decisions: dict[int, dict[str, object]] = {}
    rejected = {
        "degenerate_path": 0,
        "minimum_length": 0,
        "border_fraction": 0,
        "candidate_limit": 0,
        "simplification": 0,
        "mapped_length": 0,
        "final_pixel_support": 0,
    }
    for path in paths:
        decision: dict[str, object] = {
            "points": tuple((int(x), int(y)) for y, x in path),
            "point_count": len(path),
            "decision": "pending",
        }
        decisions[id(path)] = decision
        if len(path) < 2:
            rejected["degenerate_path"] += 1
            decision["decision"] = "rejected-degenerate"
            continue
        xy_points = [(float(x), float(y)) for y, x in path]
        length = _path_length(xy_points)
        decision["analysis_length_pixels"] = length
        if length < minimum_length:
            rejected["minimum_length"] += 1
            decision["decision"] = "rejected-length"
            continue
        border_count = sum(
            min(x, y, analysis_width - 1 - x, analysis_height - 1 - y) < margin
            for x, y in xy_points
        )
        border_fraction = border_count / len(xy_points)
        decision["border_fraction"] = border_fraction
        if border_fraction > config.maximum_border_fraction:
            rejected["border_fraction"] += 1
            decision["decision"] = "rejected-border"
            continue
        average_response = float(np.mean([response[y, x] for y, x in path]))
        decision["average_response"] = average_response
        decision["decision"] = "retained-before-limit"
        retained.append((path, length, average_response, border_fraction))

    retained.sort(key=lambda item: (-(item[1] * item[2]), item[0][0]))
    for path, _, _, _ in retained[config.maximum_candidates :]:
        rejected["candidate_limit"] += 1
        decisions[id(path)]["decision"] = "rejected-candidate-limit"
    candidates: list[PalmLineCandidate] = []
    for index, (path, _, average_response, border_fraction) in enumerate(
        retained[: config.maximum_candidates],
        start=1,
    ):
        contour = np.array([(x, y) for y, x in path], dtype=np.float32).reshape(-1, 1, 2)
        simplified = cv2.approxPolyDP(contour, epsilon=1.25, closed=False).reshape(-1, 2)
        if len(simplified) < 2:
            rejected["simplification"] += 1
            decisions[id(path)]["decision"] = "rejected-simplification"
            continue
        mapped = [
            (
                min(roi_width - 1.0, max(0.0, float(x) / scale)),
                min(roi_height - 1.0, max(0.0, float(y) / scale)),
            )
            for x, y in simplified
        ]
        mapped_length = _path_length(mapped)
        if mapped_length <= 0:
            rejected["mapped_length"] += 1
            decisions[id(path)]["decision"] = "rejected-mapped-length"
            continue
        decisions[id(path)]["decision"] = "accepted"
        decisions[id(path)]["mapped_length_pixels"] = mapped_length
        candidates.append(
            PalmLineCandidate(
                candidate_id=f"candidate-{index}",
                points=tuple(PalmLinePoint(x=x, y=y) for x, y in mapped),
                length_pixels=mapped_length,
                average_response=average_response,
                border_fraction=border_fraction,
                near_outer_contour=border_fraction >= 0.25,
            ),
        )
    if diagnostics is not None:
        path_lengths = [
            float(decision["analysis_length_pixels"])
            for decision in decisions.values()
            if isinstance(decision.get("analysis_length_pixels"), (int, float))
        ]
        diagnostics.parameters["minimum_path_length_analysis_pixels"] = minimum_length
        diagnostics.parameters["border_filter_margin_analysis_pixels"] = margin
        diagnostics.parameters["maximum_border_fraction"] = config.maximum_border_fraction
        diagnostics.stage_metrics.update({
            "skeleton_paths_before_filtering": len(paths),
            "nondegenerate_paths_before_filtering": sum(len(path) >= 2 for path in paths),
            "paths_retained_before_candidate_limit": len(retained),
            "path_length_distribution_analysis_pixels": {
                "maximum": max(path_lengths) if path_lengths else None,
                "median": float(np.percentile(path_lengths, 50)) if path_lengths else None,
                "p95": float(np.percentile(path_lengths, 95)) if path_lengths else None,
                "p99": float(np.percentile(path_lengths, 99)) if path_lengths else None,
            },
            "candidate_rejections": rejected,
            "final_pixel_support_filter_applied": False,
            "final_candidate_count": len(candidates),
        })
        diagnostics.path_decisions = list(decisions.values())
    return tuple(candidates)


def detect_palm_lines(
    image: NDArray[np.generic],
    *,
    config: DetectorConfig = DEFAULT_CONFIG,
    include_diagnostics: bool = False,
) -> PalmLineDetectionResult:
    started_at = perf_counter()
    stage_started = perf_counter()
    grayscale = _validate_image(image)
    validation_time = (perf_counter() - stage_started) * 1000.0
    roi_height, roi_width = grayscale.shape
    stage_started = perf_counter()
    quality = _quality_metrics(grayscale)
    quality_time = (perf_counter() - stage_started) * 1000.0
    diagnostics = (
        DetectorDiagnostics(
            grayscale=grayscale.copy(),
            parameters={"config": asdict(config)},
            stage_metrics={
                "quality_gate_passed": False,
                "quality_gate_reason": None,
            },
            stage_timings_ms={
                "input_validation_and_grayscale": validation_time,
                "quality_metrics": quality_time,
            },
        )
        if include_diagnostics
        else None
    )

    def abstain(reason: str, analysis_shape: tuple[int, int] | None = None) -> PalmLineDetectionResult:
        analysis_height, analysis_width = analysis_shape or (roi_height, roi_width)
        if diagnostics is not None:
            diagnostics.stage_metrics["final_candidate_count"] = 0
            diagnostics.stage_metrics["abstain_reason"] = reason
            diagnostics.stage_timings_ms["total"] = (perf_counter() - started_at) * 1000.0
        return PalmLineDetectionResult(
            algorithm_version=ALGORITHM_VERSION,
            status="abstain",
            abstain_reason=reason,
            roi_width=roi_width,
            roi_height=roi_height,
            analysis_width=analysis_width,
            analysis_height=analysis_height,
            candidate_count=0,
            total_length_pixels=0.0,
            processing_time_ms=(perf_counter() - started_at) * 1000.0,
            quality=quality,
            diagnostics=diagnostics,
        )

    if min(roi_width, roi_height) < config.minimum_dimension:
        if diagnostics is not None:
            diagnostics.stage_metrics["quality_gate_reason"] = "minimum_dimension"
        return abstain("Dimensi ROI terlalu kecil untuk analisis garis.")
    if quality["brightness"] <= 8.0 or quality["brightness"] >= 247.0:
        if diagnostics is not None:
            diagnostics.stage_metrics["quality_gate_reason"] = "brightness"
        return abstain("Pencahayaan ROI berada di luar rentang yang dapat dianalisis.")
    if quality["contrast"] < config.minimum_contrast:
        if diagnostics is not None:
            diagnostics.stage_metrics["quality_gate_reason"] = "contrast"
        return abstain("Kontras ROI tidak cukup untuk membedakan lipatan.")
    if quality["sharpness"] < config.minimum_sharpness:
        if diagnostics is not None:
            diagnostics.stage_metrics["quality_gate_reason"] = "sharpness"
        return abstain("ROI terlalu buram untuk mendukung kandidat garis.")
    if diagnostics is not None:
        diagnostics.stage_metrics["quality_gate_passed"] = True

    stage_started = perf_counter()
    analysis, scale = _resize_for_analysis(grayscale, config.max_analysis_dimension)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["downscale"] = (perf_counter() - stage_started) * 1000.0
        diagnostics.parameters["analysis_scale"] = scale
        diagnostics.parameters["analysis_dimensions"] = [analysis.shape[1], analysis.shape[0]]
    normalized = _normalize_illumination(analysis, diagnostics)
    response = _dark_ridge_response(normalized, diagnostics)
    threshold_map = _threshold_ridges(response, config, diagnostics)
    stage_started = perf_counter()
    skeleton = _skeletonize(threshold_map)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["skeletonization"] = (
            perf_counter() - stage_started
        ) * 1000.0
        skeleton_components = cv2.connectedComponents(
            np.where(skeleton > 0, 255, 0).astype(np.uint8),
            8,
        )[0] - 1
        diagnostics.stage_metrics["skeleton_pixels"] = int(cv2.countNonZero(skeleton))
        diagnostics.stage_metrics["skeleton_components"] = max(0, skeleton_components)
    if diagnostics is not None:
        diagnostics.normalized = normalized.copy()
        diagnostics.ridge_response = response.copy()
        diagnostics.threshold_map = threshold_map.copy()
        diagnostics.skeleton = skeleton.copy()

    stage_started = perf_counter()
    paths = _trace_skeleton(skeleton)
    if diagnostics is not None:
        diagnostics.stage_timings_ms["centerline_tracing"] = (
            perf_counter() - stage_started
        ) * 1000.0
    stage_started = perf_counter()
    candidates = _build_candidates(
        paths,
        response,
        scale,
        roi_width,
        roi_height,
        config,
        diagnostics,
    )
    if diagnostics is not None:
        diagnostics.stage_timings_ms["candidate_filtering_and_mapping"] = (
            perf_counter() - stage_started
        ) * 1000.0
        diagnostics.stage_timings_ms["total"] = (perf_counter() - started_at) * 1000.0
    if not candidates:
        return abstain(
            "Tidak ada struktur garis internal yang memiliki dukungan piksel memadai.",
            analysis.shape,
        )

    return PalmLineDetectionResult(
        algorithm_version=ALGORITHM_VERSION,
        status="candidates",
        abstain_reason=None,
        roi_width=roi_width,
        roi_height=roi_height,
        analysis_width=analysis.shape[1],
        analysis_height=analysis.shape[0],
        candidate_count=len(candidates),
        total_length_pixels=sum(candidate.length_pixels for candidate in candidates),
        processing_time_ms=(perf_counter() - started_at) * 1000.0,
        quality=quality,
        candidates=candidates,
        diagnostics=diagnostics,
    )
