from __future__ import annotations

import hashlib
import math
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from time import perf_counter
from typing import Literal, Protocol

import cv2
import numpy as np
from numpy.typing import NDArray

from app.services.detector import PalmImageError, PalmLineCandidate, PalmLinePoint


ALGORITHM_VERSION = "palm-line-student-exp2-fp16"
MODEL_NAME = "palm-line-student-exp2"
MODEL_INPUT_NAME = "input"
MODEL_OUTPUT_NAME = "logits"
MODEL_INPUT_SIZE = 512
CLASS_NAMES = ("background", "heart_line", "head_line", "life_line")
ResizeMode = Literal["bilinear-stretch", "letterbox-black"]
IMAGENET_MEAN = np.array((0.485, 0.456, 0.406), dtype=np.float32)
IMAGENET_STD = np.array((0.229, 0.224, 0.225), dtype=np.float32)


class ModelContractError(ValueError):
    """Raised when a model file or inference result violates the audited contract."""


class SessionValue(Protocol):
    name: str
    shape: list[object]
    type: str


class InferenceSession(Protocol):
    def get_inputs(self) -> list[SessionValue]: ...

    def get_outputs(self) -> list[SessionValue]: ...

    def get_providers(self) -> list[str]: ...

    def run(
        self,
        output_names: list[str],
        input_feed: dict[str, NDArray[np.float32]],
    ) -> list[NDArray[np.float32]]: ...


@dataclass(frozen=True)
class PreprocessTransform:
    original_width: int
    original_height: int
    model_width: int = MODEL_INPUT_SIZE
    model_height: int = MODEL_INPUT_SIZE
    mirrored_for_canonical_left: bool = False
    resize_mode: ResizeMode = "bilinear-stretch"
    content_x: int = 0
    content_y: int = 0
    content_width: int = MODEL_INPUT_SIZE
    content_height: int = MODEL_INPUT_SIZE


@dataclass
class PretrainedDiagnostics:
    class_mask_model: NDArray[np.uint8] | None = None
    class_mask_roi: NDArray[np.uint8] | None = None
    foreground_mask_roi: NDArray[np.uint8] | None = None
    centerline_mask_roi: NDArray[np.uint8] | None = None
    probability_maps_model: dict[str, NDArray[np.float32]] = field(default_factory=dict)
    candidate_classes: dict[str, str] = field(default_factory=dict)


@dataclass
class PretrainedDetectionResult:
    algorithm_version: str
    model_name: str
    model_sha256: str | None
    status: Literal["candidates", "abstain"]
    abstain_reason: str | None
    roi_width: int
    roi_height: int
    candidate_count: int
    total_length_pixels: float
    near_outer_contour_count: int
    class_pixel_counts: dict[str, int]
    probability_summary: dict[str, object]
    postprocess_summary: dict[str, object]
    transform: PreprocessTransform
    timings_ms: dict[str, float]
    candidates: tuple[PalmLineCandidate, ...] = field(default_factory=tuple)
    diagnostics: PretrainedDiagnostics | None = None

    def to_payload(self, *, include_candidates: bool = False) -> dict[str, object]:
        payload: dict[str, object] = {
            "algorithm_version": self.algorithm_version,
            "model_name": self.model_name,
            "model_sha256": self.model_sha256,
            "status": self.status,
            "abstain_reason": self.abstain_reason,
            "roi_width": self.roi_width,
            "roi_height": self.roi_height,
            "candidate_count": self.candidate_count,
            "total_length_pixels": round(self.total_length_pixels, 3),
            "near_outer_contour_count": self.near_outer_contour_count,
            "class_pixel_counts": self.class_pixel_counts,
            "transform": {
                "original_width": self.transform.original_width,
                "original_height": self.transform.original_height,
                "model_width": self.transform.model_width,
                "model_height": self.transform.model_height,
                "mirrored_for_canonical_left": self.transform.mirrored_for_canonical_left,
                "resize_mode": self.transform.resize_mode,
                "content_box_model": {
                    "x": self.transform.content_x,
                    "y": self.transform.content_y,
                    "width": self.transform.content_width,
                    "height": self.transform.content_height,
                },
            },
            "probability_summary": self.probability_summary,
            "postprocess_summary": self.postprocess_summary,
            "timings_ms": {
                name: round(value, 3) for name, value in self.timings_ms.items()
            },
        }
        if include_candidates:
            payload["candidates"] = [candidate.to_payload() for candidate in self.candidates]
            if self.diagnostics is not None:
                payload["candidate_classes"] = self.diagnostics.candidate_classes
        return payload


def _validate_source(image: NDArray[np.generic]) -> NDArray[np.uint8]:
    if not isinstance(image, np.ndarray) or image.size == 0:
        raise PalmImageError("Citra ROI kosong atau bukan array NumPy.")
    if image.ndim == 2:
        rgb = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.ndim == 3 and image.shape[2] == 3:
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    elif image.ndim == 3 and image.shape[2] == 4:
        rgb = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
    else:
        raise PalmImageError("Format citra harus grayscale, BGR, atau BGRA.")
    if rgb.dtype != np.uint8:
        if not np.issubdtype(rgb.dtype, np.number):
            raise PalmImageError("Tipe piksel citra tidak didukung.")
        rgb = np.clip(np.nan_to_num(rgb, nan=0.0, posinf=255.0), 0, 255).astype(np.uint8)
    return np.ascontiguousarray(rgb)


def preprocess_image(
    image: NDArray[np.generic],
    *,
    mirror_right_hand: bool = False,
    resize_mode: ResizeMode = "bilinear-stretch",
) -> tuple[NDArray[np.float32], PreprocessTransform]:
    """Apply the upstream RGB/ImageNet contract without crop or enhancement."""
    rgb = _validate_source(image)
    height, width = rgb.shape[:2]
    if mirror_right_hand:
        rgb = np.ascontiguousarray(rgb[:, ::-1])
    if resize_mode == "bilinear-stretch":
        content_x = content_y = 0
        content_width = content_height = MODEL_INPUT_SIZE
        resized = cv2.resize(
            rgb,
            (MODEL_INPUT_SIZE, MODEL_INPUT_SIZE),
            interpolation=cv2.INTER_LINEAR,
        )
    elif resize_mode == "letterbox-black":
        scale = min(MODEL_INPUT_SIZE / width, MODEL_INPUT_SIZE / height)
        content_width = max(1, min(MODEL_INPUT_SIZE, round(width * scale)))
        content_height = max(1, min(MODEL_INPUT_SIZE, round(height * scale)))
        content_x = (MODEL_INPUT_SIZE - content_width) // 2
        content_y = (MODEL_INPUT_SIZE - content_height) // 2
        resized_content = cv2.resize(
            rgb,
            (content_width, content_height),
            interpolation=cv2.INTER_LINEAR,
        )
        resized = np.zeros((MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, 3), dtype=np.uint8)
        resized[
            content_y : content_y + content_height,
            content_x : content_x + content_width,
        ] = resized_content
        resized_content.fill(0)
    else:
        raise PalmImageError(f"Mode resize pretrained tidak didukung: {resize_mode}")
    normalized = resized.astype(np.float32) / np.float32(255.0)
    normalized = (normalized - IMAGENET_MEAN) / IMAGENET_STD
    tensor = np.ascontiguousarray(normalized.transpose(2, 0, 1)[None, ...], dtype=np.float32)
    resized.fill(0)
    normalized.fill(0)
    rgb.fill(0)
    return tensor, PreprocessTransform(
        original_width=width,
        original_height=height,
        mirrored_for_canonical_left=mirror_right_hand,
        resize_mode=resize_mode,
        content_x=content_x,
        content_y=content_y,
        content_width=content_width,
        content_height=content_height,
    )


def _validate_contract(session: InferenceSession) -> None:
    inputs = session.get_inputs()
    outputs = session.get_outputs()
    if len(inputs) != 1 or len(outputs) != 1:
        raise ModelContractError("Model wajib memiliki tepat satu input dan satu output.")
    model_input, model_output = inputs[0], outputs[0]
    if (
        model_input.name != MODEL_INPUT_NAME
        or list(model_input.shape) != [1, 3, 512, 512]
        or model_input.type != "tensor(float)"
    ):
        raise ModelContractError("Kontrak input model bukan input float32 [1,3,512,512].")
    if (
        model_output.name != MODEL_OUTPUT_NAME
        or list(model_output.shape) != [1, 4, 512, 512]
        or model_output.type != "tensor(float)"
    ):
        raise ModelContractError("Kontrak output model bukan logits float32 [1,4,512,512].")
    if "CPUExecutionProvider" not in session.get_providers():
        raise ModelContractError("CPUExecutionProvider tidak tersedia.")


@lru_cache(maxsize=4)
def _load_session(model_path: str) -> InferenceSession:
    path = Path(model_path)
    if not path.is_file():
        raise ModelContractError(f"File model tidak ditemukan: {path}")
    try:
        import onnxruntime as ort
    except ImportError as error:
        raise ModelContractError(
            "onnxruntime belum tersedia; pasang hanya pada environment eksperimen.",
        ) from error
    options = ort.SessionOptions()
    options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
    options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    try:
        session = ort.InferenceSession(
            str(path),
            sess_options=options,
            providers=["CPUExecutionProvider"],
        )
    except Exception as error:
        raise ModelContractError(f"Model ONNX tidak dapat dimuat: {error}") from error
    _validate_contract(session)
    return session


def _file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


Pixel = tuple[int, int]


def _skeletonize(binary: NDArray[np.uint8]) -> NDArray[np.uint8]:
    working = binary.copy()
    skeleton = np.zeros_like(binary)
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    for _ in range(max(binary.shape) * 2):
        if cv2.countNonZero(working) == 0:
            break
        eroded = cv2.erode(working, kernel)
        skeleton = cv2.bitwise_or(
            skeleton,
            cv2.subtract(working, cv2.dilate(eroded, kernel)),
        )
        working = eroded
    return skeleton


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
    pixels = {(int(y), int(x)) for y, x in np.argwhere(skeleton > 0)}
    if not pixels:
        return []
    neighbors = {pixel: _neighbors(pixel, pixels) for pixel in pixels}
    visited: set[tuple[Pixel, Pixel]] = set()
    paths: list[list[Pixel]] = []

    def edge(first: Pixel, second: Pixel) -> tuple[Pixel, Pixel]:
        return (first, second) if first <= second else (second, first)

    def walk(start: Pixel, following: Pixel) -> list[Pixel]:
        path = [start]
        previous, current = start, following
        visited.add(edge(previous, current))
        while True:
            path.append(current)
            available = [
                point
                for point in neighbors[current]
                if point != previous and edge(current, point) not in visited
            ]
            if len(neighbors[current]) != 2 or not available:
                return path
            following = available[0]
            visited.add(edge(current, following))
            previous, current = current, following

    nodes = sorted(point for point in pixels if len(neighbors[point]) != 2)
    for node in nodes:
        for following in neighbors[node]:
            if edge(node, following) not in visited:
                paths.append(walk(node, following))
    for point in sorted(pixels):
        for following in neighbors[point]:
            if edge(point, following) not in visited:
                paths.append(walk(point, following))
    return paths


def _path_length(points: tuple[PalmLinePoint, ...]) -> float:
    return sum(
        math.hypot(second.x - first.x, second.y - first.y)
        for first, second in zip(points, points[1:])
    )


def _skeleton_graph_metrics(
    skeleton: NDArray[np.uint8],
    paths: list[list[Pixel]],
) -> dict[str, float | int]:
    active = (skeleton > 0).astype(np.uint8)
    kernel = np.ones((3, 3), dtype=np.uint8)
    kernel[1, 1] = 0
    neighbors = cv2.filter2D(active, cv2.CV_16S, kernel, borderType=cv2.BORDER_CONSTANT)
    endpoints = int(np.count_nonzero((active > 0) & (neighbors == 1)))
    junctions = int(np.count_nonzero((active > 0) & (neighbors > 2)))
    isolated = int(np.count_nonzero((active > 0) & (neighbors == 0)))
    coordinates = {(int(y), int(x)) for y, x in np.argwhere(active > 0)}
    graph_length = 0.0
    edge_count = 0
    for y, x in coordinates:
        for candidate_y in range(y - 1, y + 2):
            for candidate_x in range(x - 1, x + 2):
                candidate = (candidate_y, candidate_x)
                if candidate <= (y, x) or candidate not in coordinates:
                    continue
                edge_count += 1
                graph_length += math.sqrt(2.0) if candidate_y != y and candidate_x != x else 1.0
    traced_length = sum(
        math.hypot(second[1] - first[1], second[0] - first[0])
        for path in paths
        for first, second in zip(path, path[1:])
    )
    return {
        "skeleton_pixels": int(np.count_nonzero(active)),
        "skeleton_components": max(0, cv2.connectedComponents(active, 8)[0] - 1),
        "graph_edges": edge_count,
        "endpoints": endpoints,
        "junction_pixels": junctions,
        "isolated_pixels": isolated,
        "graph_length_model_pixels": graph_length,
        "traced_path_count": len(paths),
        "traced_path_total_length_model_pixels": traced_length,
        "trace_length_minus_graph_length": traced_length - graph_length,
    }


def _histogram(values: NDArray[np.floating]) -> dict[str, object]:
    edges = np.array((0.0, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99, 1.000001))
    counts, _ = np.histogram(values, bins=edges)
    return {
        "edges": [round(float(value), 6) for value in edges],
        "counts": [int(value) for value in counts],
    }


def _probability_diagnostics(
    logits: NDArray[np.float32],
) -> tuple[dict[str, NDArray[np.float32]], dict[str, object]]:
    shifted = logits - np.max(logits, axis=0, keepdims=True)
    exponent = np.exp(shifted)
    probabilities = exponent / np.sum(exponent, axis=0, keepdims=True)
    maps = {
        name: np.array(
            probabilities[index],
            dtype=np.float32,
            copy=True,
            order="C",
        )
        for index, name in enumerate(CLASS_NAMES)
    }
    top_two = np.partition(probabilities, -2, axis=0)[-2:]
    top1 = top_two[1]
    margin = top_two[1] - top_two[0]
    foreground = 1.0 - probabilities[0]

    def distribution(values: NDArray[np.floating]) -> dict[str, object]:
        return {
            "minimum": float(np.min(values)),
            "mean": float(np.mean(values)),
            "median": float(np.median(values)),
            "p95": float(np.percentile(values, 95)),
            "maximum": float(np.max(values)),
            "histogram": _histogram(values),
        }

    summary: dict[str, object] = {
        "classes": {name: distribution(values) for name, values in maps.items()},
        "foreground_union": distribution(foreground),
        "top1_confidence": distribution(top1),
        "top1_margin": distribution(margin),
    }
    exponent.fill(0)
    probabilities.fill(0)
    top_two.fill(0)
    return maps, summary


def _postprocess(
    class_mask_model: NDArray[np.uint8],
    transform: PreprocessTransform,
) -> tuple[
    tuple[PalmLineCandidate, ...],
    dict[str, str],
    NDArray[np.uint8],
    NDArray[np.uint8],
    NDArray[np.uint8],
    dict[str, object],
]:
    content_mask = class_mask_model[
        transform.content_y : transform.content_y + transform.content_height,
        transform.content_x : transform.content_x + transform.content_width,
    ]
    roi_mask = cv2.resize(
        content_mask,
        (transform.original_width, transform.original_height),
        interpolation=cv2.INTER_NEAREST,
    )
    if transform.mirrored_for_canonical_left:
        roi_mask = np.ascontiguousarray(roi_mask[:, ::-1])
    foreground = np.where(roi_mask > 0, 255, 0).astype(np.uint8)
    candidates: list[PalmLineCandidate] = []
    candidate_classes: dict[str, str] = {}
    class_stages: dict[str, object] = {}
    rejection_totals = {
        "degenerate_path": 0,
        "simplified_below_two_points": 0,
        "mapped_outside_content": 0,
        "zero_mapped_length": 0,
    }
    margin = min(transform.original_width, transform.original_height) * 0.07
    for class_index, class_name in enumerate(CLASS_NAMES[1:], start=1):
        binary = np.where(class_mask_model == class_index, 255, 0).astype(np.uint8)
        if transform.content_y > 0:
            binary[: transform.content_y] = 0
            binary[transform.content_y + transform.content_height :] = 0
        if transform.content_x > 0:
            binary[:, : transform.content_x] = 0
            binary[:, transform.content_x + transform.content_width :] = 0
        raw_pixels = int(cv2.countNonZero(binary))
        component_count = max(0, cv2.connectedComponents(binary, 8)[0] - 1)
        skeleton = _skeletonize(binary)
        paths = _trace_skeleton(skeleton)
        graph_metrics = _skeleton_graph_metrics(skeleton, paths)
        accepted_before = len(candidates)
        rejected = {name: 0 for name in rejection_totals}
        for path in paths:
            if len(path) < 2:
                rejected["degenerate_path"] += 1
                continue
            contour = np.array(
                [[x, y] for y, x in path],
                dtype=np.float32,
            ).reshape(-1, 1, 2)
            simplified = cv2.approxPolyDP(contour, epsilon=1.0, closed=False)
            if len(simplified) < 2:
                rejected["simplified_below_two_points"] += 1
                continue
            points: list[PalmLinePoint] = []
            for point in simplified[:, 0, :]:
                model_x, model_y = float(point[0]), float(point[1])
                if not (
                    transform.content_x <= model_x < transform.content_x + transform.content_width
                    and transform.content_y <= model_y < transform.content_y + transform.content_height
                ):
                    continue
                roi_x = (
                    (model_x - transform.content_x)
                    * (transform.original_width - 1)
                    / max(1, transform.content_width - 1)
                )
                roi_y = (
                    (model_y - transform.content_y)
                    * (transform.original_height - 1)
                    / max(1, transform.content_height - 1)
                )
                if transform.mirrored_for_canonical_left:
                    roi_x = transform.original_width - 1 - roi_x
                points.append(PalmLinePoint(roi_x, roi_y))
            point_tuple = tuple(points)
            if len(point_tuple) < 2:
                rejected["mapped_outside_content"] += 1
                continue
            length = _path_length(point_tuple)
            if length <= 0:
                rejected["zero_mapped_length"] += 1
                continue
            border_count = sum(
                min(
                    point.x,
                    point.y,
                    transform.original_width - 1 - point.x,
                    transform.original_height - 1 - point.y,
                ) < margin
                for point in point_tuple
            )
            border_fraction = border_count / len(point_tuple)
            candidate_id = f"pretrained-{len(candidates) + 1}"
            candidates.append(
                PalmLineCandidate(
                    candidate_id=candidate_id,
                    points=point_tuple,
                    length_pixels=length,
                    average_response=1.0,
                    border_fraction=border_fraction,
                    near_outer_contour=border_fraction > 0.5,
                ),
            )
            candidate_classes[candidate_id] = class_name
        for reason, count in rejected.items():
            rejection_totals[reason] += count
        class_stages[class_name] = {
            "argmax_pixels_in_content": raw_pixels,
            "connected_components": component_count,
            **graph_metrics,
            "traced_paths": len(paths),
            "accepted_candidates": len(candidates) - accepted_before,
            "rejected": rejected,
        }
        binary.fill(0)
        skeleton.fill(0)
    centerline = np.zeros((transform.original_height, transform.original_width), dtype=np.uint8)
    for candidate in candidates:
        points = np.array(
            [[round(point.x), round(point.y)] for point in candidate.points],
            dtype=np.int32,
        ).reshape(-1, 1, 2)
        cv2.polylines(centerline, [points], False, 255, 1, cv2.LINE_8)
    summary: dict[str, object] = {
        "raw_foreground_pixels_model": int(np.count_nonzero(class_mask_model)),
        "raw_foreground_pixels_roi": int(cv2.countNonZero(foreground)),
        "centerline_pixels_roi": int(cv2.countNonZero(centerline)),
        "candidate_count": len(candidates),
        "classes": class_stages,
        "candidate_rejections": rejection_totals,
        "heuristic_filtering": "none; only degenerate geometry is rejected",
    }
    return (
        tuple(candidates),
        candidate_classes,
        roi_mask,
        foreground,
        centerline,
        summary,
    )


class PretrainedPalmLineDetector:
    def __init__(
        self,
        model_path: Path | None = None,
        *,
        session: InferenceSession | None = None,
    ) -> None:
        if model_path is None and session is None:
            raise ModelContractError("Model path atau session pengujian wajib tersedia.")
        started = perf_counter()
        self.model_path = model_path.resolve() if model_path is not None else None
        self.session = session if session is not None else _load_session(str(self.model_path))
        _validate_contract(self.session)
        self.load_time_ms = (perf_counter() - started) * 1000.0
        self.model_sha256 = _file_sha256(self.model_path) if self.model_path is not None else None

    def detect(
        self,
        image: NDArray[np.generic],
        *,
        mirror_right_hand: bool = False,
        resize_mode: ResizeMode = "bilinear-stretch",
        include_diagnostics: bool = False,
    ) -> PretrainedDetectionResult:
        total_started = perf_counter()
        stage_started = perf_counter()
        tensor, transform = preprocess_image(
            image,
            mirror_right_hand=mirror_right_hand,
            resize_mode=resize_mode,
        )
        preprocess_ms = (perf_counter() - stage_started) * 1000.0
        try:
            stage_started = perf_counter()
            raw_outputs = self.session.run(
                [MODEL_OUTPUT_NAME],
                {MODEL_INPUT_NAME: tensor},
            )
            inference_ms = (perf_counter() - stage_started) * 1000.0
        finally:
            tensor.fill(0)
        if len(raw_outputs) != 1:
            raise ModelContractError("Runtime tidak mengembalikan tepat satu tensor logits.")
        logits = np.asarray(raw_outputs[0])
        if logits.shape != (1, 4, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE):
            raise ModelContractError(f"Shape logits tidak valid: {list(logits.shape)}")
        if logits.dtype != np.float32:
            raise ModelContractError(f"Dtype logits harus float32, bukan {logits.dtype}.")
        if not np.isfinite(logits).all():
            raise ModelContractError("Logits mengandung NaN atau infinity.")
        stage_started = perf_counter()
        probability_maps, probability_summary = _probability_diagnostics(logits[0])
        class_mask_model = np.argmax(logits[0], axis=0).astype(np.uint8)
        (
            candidates,
            classes,
            class_mask_roi,
            foreground,
            centerline,
            postprocess_summary,
        ) = _postprocess(
            class_mask_model,
            transform,
        )
        postprocess_ms = (perf_counter() - stage_started) * 1000.0
        class_counts = {
            name: int(np.count_nonzero(class_mask_model == index))
            for index, name in enumerate(CLASS_NAMES)
        }
        diagnostics = (
            PretrainedDiagnostics(
                class_mask_model=class_mask_model.copy(),
                class_mask_roi=class_mask_roi.copy(),
                foreground_mask_roi=foreground.copy(),
                centerline_mask_roi=centerline.copy(),
                probability_maps_model={
                    name: values.copy() for name, values in probability_maps.items()
                },
                candidate_classes=classes,
            )
            if include_diagnostics
            else None
        )
        total_ms = (perf_counter() - total_started) * 1000.0
        status: Literal["candidates", "abstain"] = "candidates" if candidates else "abstain"
        result = PretrainedDetectionResult(
            algorithm_version=ALGORITHM_VERSION,
            model_name=MODEL_NAME,
            model_sha256=self.model_sha256,
            status=status,
            abstain_reason=(
                None
                if candidates
                else "Model tidak menghasilkan centerline foreground yang dapat dipetakan."
            ),
            roi_width=transform.original_width,
            roi_height=transform.original_height,
            candidate_count=len(candidates),
            total_length_pixels=sum(candidate.length_pixels for candidate in candidates),
            near_outer_contour_count=sum(candidate.near_outer_contour for candidate in candidates),
            class_pixel_counts=class_counts,
            probability_summary=probability_summary,
            postprocess_summary=postprocess_summary,
            transform=transform,
            timings_ms={
                "model_load": self.load_time_ms,
                "preprocess": preprocess_ms,
                "inference": inference_ms,
                "postprocess": postprocess_ms,
                "total": total_ms,
            },
            candidates=candidates,
            diagnostics=diagnostics,
        )
        if not include_diagnostics:
            class_mask_model.fill(0)
            class_mask_roi.fill(0)
            foreground.fill(0)
            centerline.fill(0)
        for values in probability_maps.values():
            values.fill(0)
        return result
