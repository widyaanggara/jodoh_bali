from __future__ import annotations

import cv2
import numpy as np
import pytest

from app.services.detector import (
    ALGORITHM_VERSION,
    PalmImageError,
    detect_palm_lines,
)
from tests.helpers import synthetic_palm


def candidate_geometry(result):
    return [
        [
            (round(point.x, 4), round(point.y, 4))
            for point in candidate.points
        ]
        for candidate in result.candidates
    ]


def test_valid_roi_produces_supported_candidates() -> None:
    result = detect_palm_lines(synthetic_palm())

    assert result.status == "candidates"
    assert result.candidate_count > 0
    assert result.total_length_pixels > 0
    assert result.algorithm_version == ALGORITHM_VERSION


@pytest.mark.parametrize(
    "image, expected_reason",
    [
        (np.full((180, 160, 3), 128, dtype=np.uint8), "Kontras"),
        (
            np.dstack(
                [
                    np.tile(np.linspace(90, 190, 180, dtype=np.uint8), (160, 1)).T
                ]
                * 3,
            ),
            "buram",
        ),
    ],
)
def test_low_information_images_abstain(image, expected_reason: str) -> None:
    result = detect_palm_lines(image)

    assert result.status == "abstain"
    assert result.candidate_count == 0
    assert expected_reason in (result.abstain_reason or "")


def test_empty_and_unsupported_images_fail_clearly() -> None:
    with pytest.raises(PalmImageError):
        detect_palm_lines(np.array([], dtype=np.uint8))
    with pytest.raises(PalmImageError):
        detect_palm_lines(np.zeros((80, 80, 2), dtype=np.uint8))


def test_coordinates_and_lengths_remain_in_original_roi_space() -> None:
    image = synthetic_palm(width=900, height=1100)
    result = detect_palm_lines(image)

    assert result.analysis_height <= 640
    assert result.status == "candidates"
    for candidate in result.candidates:
        assert candidate.length_pixels > 0
        assert len(candidate.points) >= 2
        assert 0 <= candidate.border_fraction <= 1
        for point in candidate.points:
            assert 0 <= point.x < image.shape[1]
            assert 0 <= point.y < image.shape[0]


def test_identical_input_is_geometrically_deterministic() -> None:
    image = synthetic_palm()
    first = detect_palm_lines(image)
    second = detect_palm_lines(image)

    assert first.status == second.status
    assert first.candidate_count == second.candidate_count
    assert candidate_geometry(first) == candidate_geometry(second)
    assert first.total_length_pixels == pytest.approx(second.total_length_pixels)


def test_heavily_blurred_roi_abstains() -> None:
    blurred = cv2.GaussianBlur(synthetic_palm(), (81, 81), 30)
    result = detect_palm_lines(blurred)

    assert result.status == "abstain"
    assert result.candidate_count == 0


def test_outer_frame_contour_is_not_returned_as_a_candidate() -> None:
    image = synthetic_palm()
    cv2.rectangle(
        image,
        (3, 3),
        (image.shape[1] - 4, image.shape[0] - 4),
        (40, 40, 40),
        4,
    )
    result = detect_palm_lines(image)

    assert result.status == "candidates"
    assert result.candidates
    assert all(not candidate.near_outer_contour for candidate in result.candidates)
    for candidate in result.candidates:
        assert all(
            min(
                point.x,
                point.y,
                image.shape[1] - 1 - point.x,
                image.shape[0] - 1 - point.y,
            )
            > 10
            for point in candidate.points
        )


def test_detector_does_not_persist_images_automatically(tmp_path) -> None:
    before = set(tmp_path.iterdir())
    detect_palm_lines(synthetic_palm(), include_diagnostics=True)

    assert set(tmp_path.iterdir()) == before


def test_diagnostics_explain_each_candidate_filter_without_changing_result() -> None:
    image = synthetic_palm()
    baseline = detect_palm_lines(image)
    diagnostic = detect_palm_lines(image, include_diagnostics=True)

    assert diagnostic.status == baseline.status
    assert candidate_geometry(diagnostic) == candidate_geometry(baseline)
    assert diagnostic.diagnostics is not None
    metrics = diagnostic.diagnostics.stage_metrics
    assert metrics["quality_gate_passed"] is True
    assert metrics["positive_ridge_response_pixels"] > 0
    assert metrics["components_after_area_filter"] >= 0
    assert metrics["skeleton_components"] >= 0
    assert metrics["skeleton_paths_before_filtering"] >= metrics["final_candidate_count"]
    assert set(metrics["candidate_rejections"]) == {
        "degenerate_path",
        "minimum_length",
        "border_fraction",
        "candidate_limit",
        "simplification",
        "mapped_length",
        "final_pixel_support",
    }
    assert metrics["final_pixel_support_filter_applied"] is False
    assert diagnostic.diagnostics.stage_timings_ms["total"] > 0
