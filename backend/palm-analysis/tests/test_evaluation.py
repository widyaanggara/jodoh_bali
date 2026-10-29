from __future__ import annotations

import hashlib
import json
import subprocess
import zipfile
from pathlib import Path

import numpy as np
import pytest

from app.benchmark import run_manifest, run_manifests
from app.evaluation import (
    fingerprint_file,
    load_annotation_document,
    resolve_annotation,
    score_candidates,
)
from app.image_io import hash_decoded_rgba, load_local_image
from app.services.detector import PalmLineCandidate, PalmLinePoint
from tests.helpers import synthetic_palm, write_png


def annotation_document(fingerprint: str, signature: str, width: int, height: int):
    return {
        "format": "metemu-palm-lines",
        "version": 2,
        "samples": [
            {
                "sample_id": "sample-test",
                "sample_fingerprint": fingerprint,
                "roi_signature": signature,
                "roi_width": width,
                "roi_height": height,
                "roi_algorithm_version": "adaptive-roi-v1",
                "line_extraction_version": "dark-ridge-v1",
                "line_parameter_version": "baseline-2026-10-27",
                "status": "annotated",
                "completeness": "partial",
                "polylines": [
                    {
                        "id": "manual-1",
                        "points": [{"x": 30, "y": 100}, {"x": 190, "y": 100}],
                    },
                ],
            },
        ],
    }


def javascript_baseline():
    return {
        "algorithm_version": "dark-ridge-v1",
        "parameter_version": "baseline-2026-10-27",
        "status": "detected",
        "abstain_reason": None,
        "candidate_count": 1,
        "total_length_pixels": 160,
        "near_outer_contour_count": 0,
        "processing_time_ms": 4.25,
        "candidates": [
            {
                "id": "js-1",
                "length_pixels": 160,
                "points": [{"x": 30, "y": 100}, {"x": 190, "y": 100}],
            },
        ],
    }


def write_benchmark_bundle(tmp_path, *, annotation=None, sample_updates=None, image=None):
    source_path = tmp_path / "source.bin"
    source_path.write_bytes(b"source-image-content")
    fingerprint = hashlib.sha256(source_path.read_bytes()).hexdigest()
    roi_path = tmp_path / "roi.png"
    write_png(roi_path, synthetic_palm() if image is None else image)
    decoded = load_local_image(roi_path)
    height, width = decoded.shape[:2]
    pixel_hash = hash_decoded_rgba(decoded)
    decoded.fill(0)
    signature = "roi-compatible"
    document = annotation or annotation_document(fingerprint, signature, width, height)
    annotation_path = tmp_path / "annotations.json"
    annotation_path.write_text(json.dumps(document), encoding="utf-8")
    sample = {
        "sample_id": "sample-test",
        "source_path": "source.bin",
        "source_fingerprint": fingerprint,
        "roi_path": "roi.png",
        "roi_sha256": fingerprint_file(roi_path),
        "roi_pixel_sha256": pixel_hash,
        "roi_signature": signature,
        "roi_width": width,
        "roi_height": height,
        "roi_algorithm_version": "adaptive-roi-v1",
        "subject_group": "subject-anon-a",
        "split": "development",
        "javascript_baseline": javascript_baseline(),
    }
    sample.update(sample_updates or {})
    manifest_path = tmp_path / "manifest.json"
    manifest_path.write_text(
        json.dumps({
            "format": "metemu-palm-benchmark",
            "version": 1,
            "annotations": "annotations.json",
            "samples": [sample],
        }),
        encoding="utf-8",
    )
    return manifest_path, document


def test_annotation_requires_fingerprint_signature_dimensions_and_roi_version() -> None:
    document = annotation_document("a" * 64, "roi-correct", 240, 320)
    exact = resolve_annotation(
        document,
        sample_fingerprint="a" * 64,
        roi_signature="roi-correct",
        roi_width=240,
        roi_height=320,
    )
    fingerprint_mismatch = resolve_annotation(
        document,
        sample_fingerprint="b" * 64,
        roi_signature="roi-correct",
        roi_width=240,
        roi_height=320,
    )
    roi_mismatch = resolve_annotation(
        document,
        sample_fingerprint="a" * 64,
        roi_signature="roi-other",
        roi_width=240,
        roi_height=320,
    )

    assert exact.compatibility == "exact"
    assert fingerprint_mismatch.compatibility == "unmatched"
    assert roi_mismatch.compatibility == "roi-mismatch"


def test_length_weighted_scores_use_documented_tolerances() -> None:
    document = annotation_document("a" * 64, "roi-correct", 240, 320)
    resolution = resolve_annotation(
        document,
        sample_fingerprint="a" * 64,
        roi_signature="roi-correct",
        roi_width=240,
        roi_height=320,
    )
    assert resolution.annotation is not None
    candidate = PalmLineCandidate(
        candidate_id="candidate-1",
        points=(PalmLinePoint(30, 104), PalmLinePoint(190, 104)),
        length_pixels=160,
        average_response=50,
        border_fraction=0,
        near_outer_contour=False,
    )
    scores = score_candidates([candidate], resolution.annotation)

    assert [score["tolerance_pixels"] for score in scores] == [3, 6, 9]
    assert scores[0]["f1"] == 0
    assert scores[1]["f1"] == pytest.approx(1)
    assert scores[2]["f1"] == pytest.approx(1)


def test_benchmark_scores_only_exact_compatible_roi(tmp_path) -> None:
    manifest_path, _ = write_benchmark_bundle(tmp_path)

    result = run_manifest(manifest_path)

    assert result["compatible_count"] == 1
    assert result["python_scored_count"] == 1
    assert result["javascript_scored_count"] == 1
    assert result["samples"][0]["pixel_identity_verified"] is True
    assert result["samples"][0]["validation_status"] == "valid"
    assert result["samples"][0]["scores_provisional"] is True
    assert [row["tolerance_pixels"] for row in result["python_summary_by_tolerance"]] == [3, 6, 9]
    assert [row["tolerance_pixels"] for row in result["javascript_summary_by_tolerance"]] == [3, 6, 9]

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["samples"][0]["roi_signature"] = "roi-mismatch"
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    mismatch = run_manifest(manifest_path)
    assert mismatch["compatible_count"] == 0
    assert mismatch["python_scored_count"] == 0
    assert mismatch["javascript_scored_count"] == 0


@pytest.mark.parametrize(
    "sample_updates, reason",
    [
        ({"roi_sha256": "0" * 64}, "SHA-256 file ROI"),
        ({"roi_pixel_sha256": "0" * 64}, "SHA-256 piksel ROI"),
        ({"roi_width": 239}, "Dimensi ROI"),
        ({"roi_algorithm_version": "future-roi"}, "Versi adaptive ROI"),
    ],
)
def test_benchmark_rejects_manifest_identity_mismatch(tmp_path, sample_updates, reason) -> None:
    manifest_path, _ = write_benchmark_bundle(tmp_path, sample_updates=sample_updates)

    result = run_manifest(manifest_path)

    assert result["compatible_count"] == 0
    assert result["invalid_count"] == 1
    assert reason in result["samples"][0]["compatibility_reason"]
    assert result["samples"][0]["pixel_identity_verified"] is False


def test_benchmark_reports_undetermined_without_scoring(tmp_path) -> None:
    manifest_path, document = write_benchmark_bundle(tmp_path)
    document["samples"][0]["status"] = "undetermined"
    document["samples"][0]["polylines"] = []
    (tmp_path / "annotations.json").write_text(json.dumps(document), encoding="utf-8")

    result = run_manifest(manifest_path)

    assert result["undetermined_count"] == 1
    assert result["compatible_count"] == 0
    assert result["python_scored_count"] == 0


def test_benchmark_rejects_out_of_bounds_annotation(tmp_path) -> None:
    manifest_path, document = write_benchmark_bundle(tmp_path)
    document["samples"][0]["polylines"][0]["points"][1]["x"] = 999
    (tmp_path / "annotations.json").write_text(json.dumps(document), encoding="utf-8")

    result = run_manifest(manifest_path)

    assert result["compatible_count"] == 0
    assert result["samples"][0]["compatibility"] == "invalid"
    assert result["samples"][0]["validation_status"] == "invalid"
    assert "di luar ROI" in result["samples"][0]["compatibility_reason"]


def test_multi_manifest_pilot_rejects_duplicate_sample_id(tmp_path) -> None:
    first = tmp_path / "first"
    second = tmp_path / "second"
    first.mkdir()
    second.mkdir()
    first_manifest, _ = write_benchmark_bundle(first)
    second_manifest, _ = write_benchmark_bundle(second)

    with pytest.raises(ValueError, match="Sample ID duplikat"):
        run_manifests([first_manifest, second_manifest])

    single = run_manifests([first_manifest])
    assert single["manifest_count"] == 1
    assert single["compatible_count"] == 1


def test_complete_export_zip_can_be_extracted_and_benchmarked(tmp_path) -> None:
    source = tmp_path / "source"
    extracted = tmp_path / "extracted"
    source.mkdir()
    manifest_path, _ = write_benchmark_bundle(source)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["samples"][0].pop("source_path")
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    archive_path = tmp_path / "benchmark-package.zip"
    expected_names = {"roi.png", "annotations.json", "manifest.json"}
    project_root = Path(__file__).resolve().parents[3]
    subprocess.run(
        [
            "node",
            str(project_root / "tests" / "create-palm-zip-fixture.mjs"),
            str(archive_path),
            str(source / "roi.png"),
            str(source / "annotations.json"),
            str(manifest_path),
        ],
        cwd=project_root,
        check=True,
        capture_output=True,
        text=True,
    )
    with zipfile.ZipFile(archive_path, "r") as archive:
        assert set(archive.namelist()) == expected_names
        archive.extractall(extracted)

    decoded = load_local_image(extracted / "roi.png")
    try:
        assert decoded.shape[:2] == (
            manifest["samples"][0]["roi_height"],
            manifest["samples"][0]["roi_width"],
        )
        assert fingerprint_file(extracted / "roi.png") == manifest["samples"][0]["roi_sha256"]
        assert hash_decoded_rgba(decoded) == manifest["samples"][0]["roi_pixel_sha256"]
    finally:
        decoded.fill(0)

    result = run_manifest(extracted / "manifest.json")
    assert result["compatible_count"] == 1
    assert result["samples"][0]["pixel_identity_verified"] is True


def test_abstain_policy_keeps_null_f1_and_reports_detection_coverage_failure(tmp_path) -> None:
    manifest_path, _ = write_benchmark_bundle(
        tmp_path,
        image=np.full((320, 240, 3), 128, dtype=np.uint8),
    )

    result = run_manifest(manifest_path)
    sample = result["samples"][0]
    python_summary = result["python_diagnostics"]

    assert sample["positive_annotated_sample"] is True
    assert sample["python"]["status"] == "abstain"
    assert sample["python"]["detection_coverage_failure"] is True
    assert sample["python"]["near_outer_contour_ratio"] is None
    assert sample["python_scores"] == []
    assert result["python_summary_by_tolerance"][1]["f1"] is None
    assert python_summary["abstain_rate"] == 1
    assert python_summary["line_output_rate"] == 0
    assert python_summary["detection_coverage_failure_count"] == 1


def test_annotation_loader_rejects_legacy_or_invalid_document(tmp_path) -> None:
    path = tmp_path / "legacy.json"
    path.write_text(
        json.dumps({"format": "metemu-palm-lines", "version": 1, "samples": []}),
        encoding="utf-8",
    )
    with pytest.raises(ValueError):
        load_annotation_document(path)
