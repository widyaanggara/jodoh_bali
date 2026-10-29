from __future__ import annotations

import cv2
import numpy as np
import pytest

from app.evaluation import CompatibleAnnotation, ManualPolyline
from app.pretrained_diagnostic import score_raw_mask_pixels
from app.services.detector import PalmLinePoint
from app.services.full_hand_framing import (
    compose_source_to_model,
    frame_full_hand,
    transform_points,
)
from app.services.pretrained_detector import preprocess_image


def synthetic_landmarks() -> np.ndarray:
    points = np.array(
        [
            (200, 410),
            (245, 350), (270, 290), (290, 230), (310, 180),
            (160, 300), (150, 220), (145, 145), (145, 80),
            (200, 285), (200, 190), (200, 105), (200, 45),
            (240, 300), (250, 220), (255, 145), (260, 85),
            (275, 325), (295, 260), (310, 205), (325, 160),
        ],
        dtype=np.float64,
    )
    return points


def test_full_hand_transform_round_trips_landmarks_with_mirroring_and_padding() -> None:
    image = np.full((500, 400, 3), 127, dtype=np.uint8)
    landmarks = synthetic_landmarks()

    framed, transform = frame_full_hand(
        image,
        landmarks,
        detected_handedness="Right",
        margin_pixels=70,
    )
    crop_points = transform_points(landmarks, transform.source_to_crop)
    restored = transform_points(crop_points, transform.crop_to_source)

    assert transform.mirrored_to_canonical_left is True
    assert framed.shape[:2] == (transform.crop_height, transform.crop_width)
    assert np.max(np.abs(restored - landmarks)) < 1e-8
    assert np.all(crop_points[:, 0] >= 0)
    assert np.all(crop_points[:, 0] < transform.crop_width)
    assert np.all(crop_points[:, 1] >= 0)
    assert np.all(crop_points[:, 1] < transform.crop_height)


def test_composed_source_model_transform_is_invertible() -> None:
    image = np.full((500, 400, 3), 127, dtype=np.uint8)
    landmarks = synthetic_landmarks()
    framed, framing = frame_full_hand(
        image,
        landmarks,
        detected_handedness="Left",
        margin_pixels=50,
    )
    _, preprocessing = preprocess_image(framed, resize_mode="letterbox-black")
    source_to_model = compose_source_to_model(framing, preprocessing)
    model_to_source = np.linalg.inv(source_to_model)

    model_points = transform_points(landmarks, source_to_model)
    restored = transform_points(model_points, model_to_source)

    assert np.max(np.abs(restored - landmarks)) < 1e-8
    assert np.all(model_points[:, 0] >= preprocessing.content_x)
    assert np.all(model_points[:, 0] < preprocessing.content_x + preprocessing.content_width)
    assert np.all(model_points[:, 1] >= preprocessing.content_y)
    assert np.all(model_points[:, 1] < preprocessing.content_y + preprocessing.content_height)


def test_full_hand_framing_rejects_invalid_landmarks_and_handles_border_padding() -> None:
    image = np.full((500, 400, 3), 127, dtype=np.uint8)
    near_border = synthetic_landmarks()
    near_border[:, 0] -= 140
    near_border[:, 1] -= 40
    framed, transform = frame_full_hand(
        image,
        near_border,
        detected_handedness="Left",
        margin_pixels=100,
    )

    assert framed.shape[0] == transform.crop_height
    assert framed.shape[1] == transform.crop_width
    assert np.any(framed == 0)  # Explicit black padding outside the source frame.

    invalid = near_border.copy()
    invalid[0, 0] = -1
    with pytest.raises(ValueError, match="di luar"):
        frame_full_hand(image, invalid, detected_handedness="Left")


def test_raw_mask_pixel_agreement_uses_tolerance_without_claiming_dice() -> None:
    mask = np.zeros((100, 120), dtype=np.uint8)
    cv2.line(mask, (10, 50), (100, 50), 255, 3)
    annotation = CompatibleAnnotation(
        sample_id="synthetic",
        completeness="complete",
        polylines=(
            ManualPolyline(
                polyline_id="manual",
                points=(PalmLinePoint(10, 52), PalmLinePoint(100, 52)),
            ),
        ),
        baseline_extraction_version=None,
        baseline_parameter_version=None,
    )

    scores = score_raw_mask_pixels(mask, annotation)

    assert [score["tolerance_pixels"] for score in scores] == [3, 6, 9]
    assert scores[0]["annotation_pixel_coverage"] == pytest.approx(1.0)
    assert scores[0]["foreground_pixel_precision"] > 0.75
    assert "dice" not in scores[0]
