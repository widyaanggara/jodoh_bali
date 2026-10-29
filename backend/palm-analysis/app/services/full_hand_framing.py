from __future__ import annotations

import math
from dataclasses import dataclass

import cv2
import numpy as np
from numpy.typing import NDArray

from app.services.detector import PalmImageError
from app.services.pretrained_detector import PreprocessTransform


WRIST = 0
MIDDLE_MCP = 9


@dataclass(frozen=True)
class FullHandTransform:
    source_width: int
    source_height: int
    crop_width: int
    crop_height: int
    rotation_degrees: float
    margin_pixels: float
    mirrored_to_canonical_left: bool
    source_to_crop: NDArray[np.float64]
    crop_to_source: NDArray[np.float64]

    def to_payload(self) -> dict[str, object]:
        return {
            "source_width": self.source_width,
            "source_height": self.source_height,
            "crop_width": self.crop_width,
            "crop_height": self.crop_height,
            "rotation_degrees": self.rotation_degrees,
            "margin_pixels": self.margin_pixels,
            "mirrored_to_canonical_left": self.mirrored_to_canonical_left,
            "source_to_crop": self.source_to_crop.tolist(),
            "crop_to_source": self.crop_to_source.tolist(),
        }


def _homogeneous(affine: NDArray[np.floating]) -> NDArray[np.float64]:
    matrix = np.eye(3, dtype=np.float64)
    matrix[:2] = affine
    return matrix


def transform_points(
    points: NDArray[np.floating],
    matrix: NDArray[np.floating],
) -> NDArray[np.float64]:
    values = np.asarray(points, dtype=np.float64)
    if values.ndim != 2 or values.shape[1] != 2:
        raise ValueError("Titik transformasi wajib berbentuk Nx2.")
    homogeneous = np.column_stack((values, np.ones(len(values), dtype=np.float64)))
    mapped = homogeneous @ np.asarray(matrix, dtype=np.float64).T
    denominator = mapped[:, 2:3]
    if np.any(np.isclose(denominator, 0.0)):
        raise ValueError("Transformasi menghasilkan koordinat homogen nol.")
    return mapped[:, :2] / denominator


def frame_full_hand(
    image: NDArray[np.uint8],
    landmarks_pixels: NDArray[np.floating],
    *,
    detected_handedness: str | None,
    canonical_handedness: str = "Left",
    margin_pixels: float = 100.0,
) -> tuple[NDArray[np.uint8], FullHandTransform]:
    """Experimental upstream-like full-hand crop; never replaces adaptive-roi-v1."""
    if not isinstance(image, np.ndarray) or image.size == 0 or image.ndim not in (2, 3):
        raise PalmImageError("Citra sumber full-hand tidak valid.")
    points = np.asarray(landmarks_pixels, dtype=np.float64)
    if points.shape != (21, 2) or not np.isfinite(points).all():
        raise ValueError("Full-hand framing membutuhkan tepat 21 landmark piksel finite.")
    if margin_pixels < 0:
        raise ValueError("Margin full-hand tidak boleh negatif.")
    source_height, source_width = image.shape[:2]
    if (
        np.any(points[:, 0] < 0)
        or np.any(points[:, 0] >= source_width)
        or np.any(points[:, 1] < 0)
        or np.any(points[:, 1] >= source_height)
    ):
        raise ValueError("Landmark full-hand berada di luar citra sumber.")
    vector = points[MIDDLE_MCP] - points[WRIST]
    theta = math.degrees(math.atan2(vector[0], -vector[1]))
    center = tuple(np.mean(points, axis=0))
    best_affine = None
    best_angle = theta
    best_horizontal_error = None
    for angle in (theta, -theta):
        affine = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = transform_points(points, _homogeneous(affine))
        if rotated[MIDDLE_MCP, 1] >= rotated[WRIST, 1]:
            continue
        horizontal_error = abs(rotated[MIDDLE_MCP, 0] - rotated[WRIST, 0])
        if best_horizontal_error is None or horizontal_error < best_horizontal_error:
            best_affine = affine
            best_angle = angle
            best_horizontal_error = horizontal_error
    if best_affine is None:
        best_affine = cv2.getRotationMatrix2D(center, theta, 1.0)
        best_angle = theta
    rotated = transform_points(points, _homogeneous(best_affine))
    minimum = np.min(rotated, axis=0) - margin_pixels
    maximum = np.max(rotated, axis=0) + margin_pixels
    crop_width = max(1, int(math.ceil(maximum[0] - minimum[0])))
    crop_height = max(1, int(math.ceil(maximum[1] - minimum[1])))
    crop_affine = best_affine.copy()
    crop_affine[0, 2] -= minimum[0]
    crop_affine[1, 2] -= minimum[1]
    source_to_crop = _homogeneous(crop_affine)
    framed = cv2.warpAffine(
        image,
        crop_affine,
        (crop_width, crop_height),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=0,
    )
    mirrored = bool(
        detected_handedness
        and canonical_handedness
        and detected_handedness != canonical_handedness
    )
    if mirrored:
        framed = cv2.flip(framed, 1)
        mirror = np.array(
            ((-1.0, 0.0, crop_width - 1.0), (0.0, 1.0, 0.0), (0.0, 0.0, 1.0)),
            dtype=np.float64,
        )
        source_to_crop = mirror @ source_to_crop
    crop_to_source = np.linalg.inv(source_to_crop)
    return framed, FullHandTransform(
        source_width=source_width,
        source_height=source_height,
        crop_width=crop_width,
        crop_height=crop_height,
        rotation_degrees=float(best_angle),
        margin_pixels=float(margin_pixels),
        mirrored_to_canonical_left=mirrored,
        source_to_crop=source_to_crop,
        crop_to_source=crop_to_source,
    )


def crop_to_model_matrix(transform: PreprocessTransform) -> NDArray[np.float64]:
    scale_x = (transform.content_width - 1) / max(1, transform.original_width - 1)
    scale_y = (transform.content_height - 1) / max(1, transform.original_height - 1)
    return np.array(
        (
            (scale_x, 0.0, float(transform.content_x)),
            (0.0, scale_y, float(transform.content_y)),
            (0.0, 0.0, 1.0),
        ),
        dtype=np.float64,
    )


def compose_source_to_model(
    framing: FullHandTransform,
    preprocessing: PreprocessTransform,
) -> NDArray[np.float64]:
    if preprocessing.original_width != framing.crop_width or preprocessing.original_height != framing.crop_height:
        raise ValueError("Dimensi crop framing dan preprocessing tidak cocok.")
    return crop_to_model_matrix(preprocessing) @ framing.source_to_crop
