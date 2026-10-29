from __future__ import annotations

import os
from pathlib import Path

import numpy as np
import pytest

from app.image_io import load_local_image
from app.pretrained_diagnostic import _mask_overlap
from app.services.pretrained_detector import PretrainedPalmLineDetector


@pytest.mark.integration
def test_real_onnx_cpu_inference_is_deterministic() -> None:
    configured = os.environ.get("METEMU_PRETRAINED_MODEL")
    if not configured:
        pytest.skip("METEMU_PRETRAINED_MODEL is not configured")
    model_path = Path(configured)
    detector = PretrainedPalmLineDetector(model_path)
    # Synthetic input validates runtime reproducibility, not model accuracy.
    y, x = np.mgrid[:180, :140]
    intensity = np.clip(80 + x * 0.7 + y * 0.3, 0, 255).astype(np.uint8)
    image = np.dstack((intensity, intensity, intensity))

    first = detector.detect(image)
    second = detector.detect(image)

    assert first.status == second.status
    assert first.class_pixel_counts == second.class_pixel_counts
    assert [candidate.to_payload() for candidate in first.candidates] == [
        candidate.to_payload() for candidate in second.candidates
    ]


@pytest.mark.integration
def test_real_model_matches_published_positive_control_support() -> None:
    model = os.environ.get("METEMU_PRETRAINED_MODEL")
    upstream = os.environ.get("METEMU_PRETRAINED_UPSTREAM")
    if not model or not upstream:
        pytest.skip("Pretrained model and upstream snapshot are not configured")
    detector = PretrainedPalmLineDetector(Path(model))
    root = Path(upstream)
    overlaps = []
    for index in range(1, 5):
        image = load_local_image(root / "docs" / f"example{index}_input.png")
        overlay = load_local_image(root / "docs" / f"example{index}_overlay.png")
        try:
            result = detector.detect(image, include_diagnostics=True)
            assert result.diagnostics is not None
            predicted = result.diagnostics.foreground_mask_roi > 0
            published = np.any(overlay != image, axis=2)
            overlaps.append(_mask_overlap(published, predicted))
        finally:
            image.fill(0)
            overlay.fill(0)

    assert min(float(item["iou"]) for item in overlaps) > 0.70
    assert min(float(item["reference_coverage"]) for item in overlaps) > 0.80
