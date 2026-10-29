from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pytest

from app.services.pretrained_detector import (
    IMAGENET_MEAN,
    IMAGENET_STD,
    ModelContractError,
    PretrainedPalmLineDetector,
    preprocess_image,
)


@dataclass
class FakeValue:
    name: str
    shape: list[int]
    type: str = "tensor(float)"


class FakeSession:
    def __init__(self, logits: np.ndarray | None = None) -> None:
        self.input = FakeValue("input", [1, 3, 512, 512])
        self.output = FakeValue("logits", [1, 4, 512, 512])
        self.logits = (
            logits
            if logits is not None
            else np.zeros((1, 4, 512, 512), dtype=np.float32)
        )
        self.last_tensor: np.ndarray | None = None

    def get_inputs(self):
        return [self.input]

    def get_outputs(self):
        return [self.output]

    def get_providers(self):
        return ["CPUExecutionProvider"]

    def run(self, output_names, input_feed):
        assert output_names == ["logits"]
        self.last_tensor = input_feed["input"].copy()
        return [self.logits.copy()]


def line_logits() -> np.ndarray:
    logits = np.zeros((1, 4, 512, 512), dtype=np.float32)
    logits[:, 0] = 2.0
    logits[0, 2, 200, 60:450] = 5.0
    return logits


def junction_logits() -> np.ndarray:
    logits = np.zeros((1, 4, 512, 512), dtype=np.float32)
    logits[:, 0] = 2.0
    logits[0, 2, 254:259, 100:412] = 5.0
    logits[0, 2, 100:412, 254:259] = 5.0
    return logits


def geometry(result):
    return [
        [(round(point.x, 4), round(point.y, 4)) for point in candidate.points]
        for candidate in result.candidates
    ]


def test_preprocess_uses_rgb_nchw_float32_and_imagenet_normalization() -> None:
    image = np.zeros((5, 7, 3), dtype=np.uint8)
    image[:, :] = (0, 0, 255)  # OpenCV BGR red.

    tensor, transform = preprocess_image(image)

    assert tensor.shape == (1, 3, 512, 512)
    assert tensor.dtype == np.float32
    assert tensor[0, 0, 0, 0] == pytest.approx((1.0 - IMAGENET_MEAN[0]) / IMAGENET_STD[0])
    assert tensor[0, 1, 0, 0] == pytest.approx((0.0 - IMAGENET_MEAN[1]) / IMAGENET_STD[1])
    assert transform.original_width == 7
    assert transform.original_height == 5


def test_model_output_is_mapped_to_original_roi_coordinates() -> None:
    detector = PretrainedPalmLineDetector(session=FakeSession(line_logits()))
    image = np.full((200, 300, 3), 128, dtype=np.uint8)

    result = detector.detect(image)

    assert result.status == "candidates"
    assert result.candidate_count > 0
    assert result.class_pixel_counts["head_line"] == 390
    for candidate in result.candidates:
        for point in candidate.points:
            assert 0 <= point.x < 300
            assert 0 <= point.y < 200


def test_letterbox_preserves_aspect_ratio_and_records_content_box() -> None:
    image = np.full((200, 300, 3), 128, dtype=np.uint8)

    tensor, transform = preprocess_image(image, resize_mode="letterbox-black")

    assert tensor.shape == (1, 3, 512, 512)
    assert transform.resize_mode == "letterbox-black"
    assert transform.content_width == 512
    assert transform.content_height == 341
    assert transform.content_x == 0
    assert transform.content_y == 85
    # Black padding is normalized, not silently replaced with image content.
    assert tensor[0, 0, 0, 0] == pytest.approx(-IMAGENET_MEAN[0] / IMAGENET_STD[0])


def test_right_hand_mirroring_is_reversed_in_output_coordinates() -> None:
    logits = np.zeros((1, 4, 512, 512), dtype=np.float32)
    logits[:, 0] = 2.0
    logits[0, 1, 50:450, 50] = 5.0
    detector = PretrainedPalmLineDetector(session=FakeSession(logits))
    image = np.full((200, 300, 3), 128, dtype=np.uint8)

    normal = detector.detect(image)
    mirrored = detector.detect(image, mirror_right_hand=True)

    normal_x = np.mean([point.x for item in normal.candidates for point in item.points])
    mirrored_x = np.mean([point.x for item in mirrored.candidates for point in item.points])
    assert normal_x + mirrored_x == pytest.approx(299.0, abs=1.0)
    assert mirrored.transform.mirrored_for_canonical_left is True


def test_blank_foreground_abstains_and_detector_is_deterministic(tmp_path) -> None:
    session = FakeSession()
    detector = PretrainedPalmLineDetector(session=session)
    image = np.full((120, 100, 3), 128, dtype=np.uint8)
    before = set(tmp_path.iterdir())

    first = detector.detect(image, include_diagnostics=True)
    second = detector.detect(image, include_diagnostics=True)

    assert first.status == "abstain"
    assert first.candidate_count == 0
    assert geometry(first) == geometry(second)
    assert set(tmp_path.iterdir()) == before


def test_raw_probability_and_postprocess_diagnostics_explain_fragmentation() -> None:
    detector = PretrainedPalmLineDetector(session=FakeSession(line_logits()))

    result = detector.detect(
        np.full((200, 300, 3), 128, dtype=np.uint8),
        include_diagnostics=True,
    )

    assert result.probability_summary["foreground_union"]["maximum"] > 0.5
    assert result.postprocess_summary["raw_foreground_pixels_model"] == 390
    assert result.postprocess_summary["classes"]["head_line"]["connected_components"] == 1
    assert result.postprocess_summary["classes"]["head_line"]["traced_paths"] >= 1
    assert result.postprocess_summary["candidate_rejections"] == {
        "degenerate_path": 0,
        "simplified_below_two_points": 0,
        "mapped_outside_content": 0,
        "zero_mapped_length": 0,
    }
    assert result.diagnostics is not None
    assert set(result.diagnostics.probability_maps_model) == {
        "background",
        "heart_line",
        "head_line",
        "life_line",
    }
    assert result.diagnostics.probability_maps_model["head_line"].max() > 0.5


def test_skeleton_graph_reports_junctions_and_preserves_edge_length() -> None:
    detector = PretrainedPalmLineDetector(session=FakeSession(junction_logits()))

    result = detector.detect(np.full((512, 512, 3), 128, dtype=np.uint8))
    graph = result.postprocess_summary["classes"]["head_line"]

    assert graph["connected_components"] == 1
    assert graph["junction_pixels"] > 0
    assert graph["endpoints"] >= 4
    assert graph["traced_path_count"] > 1
    assert graph["traced_path_total_length_model_pixels"] == pytest.approx(
        graph["graph_length_model_pixels"],
    )


@pytest.mark.parametrize(
    "logits, message",
    [
        (np.zeros((1, 3, 512, 512), dtype=np.float32), "Shape logits"),
        (np.zeros((1, 4, 512, 512), dtype=np.float64), "Dtype logits"),
        (np.full((1, 4, 512, 512), np.nan, dtype=np.float32), "NaN"),
    ],
)
def test_invalid_model_outputs_are_rejected(logits, message: str) -> None:
    detector = PretrainedPalmLineDetector(session=FakeSession(logits))

    with pytest.raises(ModelContractError, match=message):
        detector.detect(np.zeros((100, 100, 3), dtype=np.uint8))


def test_invalid_session_contract_and_missing_model_are_rejected(tmp_path) -> None:
    bad = FakeSession()
    bad.input.shape = [1, 512, 512, 3]
    with pytest.raises(ModelContractError, match="Kontrak input"):
        PretrainedPalmLineDetector(session=bad)
    with pytest.raises(ModelContractError, match="tidak ditemukan"):
        PretrainedPalmLineDetector(tmp_path / "missing.onnx")


def test_corrupt_model_is_rejected(tmp_path) -> None:
    corrupt = tmp_path / "corrupt.onnx"
    corrupt.write_bytes(b"not-an-onnx-model")

    with pytest.raises(ModelContractError, match="tidak dapat dimuat"):
        PretrainedPalmLineDetector(corrupt)
