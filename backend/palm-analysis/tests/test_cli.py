from __future__ import annotations

import json

from app.cli import main
from app.evaluation import fingerprint_file
from app.image_io import hash_decoded_rgba, load_local_image
from tests.helpers import synthetic_palm, write_png


def test_cli_reports_invalid_file(capsys, tmp_path) -> None:
    exit_code = main([str(tmp_path / "missing.jpg")])

    assert exit_code == 2
    assert "tidak ditemukan" in capsys.readouterr().err


def test_cli_prints_summary_without_automatic_output(capsys, tmp_path) -> None:
    image_path = tmp_path / "roi.png"
    write_png(image_path, synthetic_palm())

    exit_code = main([str(image_path)])
    payload = json.loads(capsys.readouterr().out)

    assert exit_code == 0
    assert payload["algorithm_version"] == "opencv-palm-lines-v1"
    assert payload["status"] == "candidates"
    assert "candidates" not in payload
    assert sorted(path.name for path in tmp_path.iterdir()) == ["roi.png"]


def test_cli_writes_diagnostics_only_when_explicit(capsys, tmp_path) -> None:
    image_path = tmp_path / "roi.png"
    output_path = tmp_path / "diagnostics"
    write_png(image_path, synthetic_palm())

    exit_code = main([str(image_path), "--diagnostics", str(output_path)])
    capsys.readouterr()

    assert exit_code == 0
    assert (output_path / "00-original-roi.png").is_file()
    assert (output_path / "01-grayscale.png").is_file()
    assert (output_path / "06-candidate-overlay.png").is_file()
    assert (output_path / "12-candidates-before-filter.png").is_file()
    assert (output_path / "13-filter-decisions.png").is_file()
    assert (output_path / "14-border-rejection-area.png").is_file()
    report = json.loads((output_path / "diagnostics.json").read_text(encoding="utf-8"))
    assert report["diagnostics"]["stage_metrics"]["quality_gate_passed"] is True
    assert "path_decisions" not in report["diagnostics"]


def test_cli_validates_manifest_before_drawing_manual_annotation(capsys, tmp_path) -> None:
    image_path = tmp_path / "roi.png"
    annotation_path = tmp_path / "annotations.json"
    manifest_path = tmp_path / "benchmark.json"
    output_path = tmp_path / "diagnostics"
    write_png(image_path, synthetic_palm())
    image = load_local_image(image_path)
    pixel_hash = hash_decoded_rgba(image)
    height, width = image.shape[:2]
    image.fill(0)
    fingerprint = "a" * 64
    annotation_path.write_text(json.dumps({
        "format": "metemu-palm-lines",
        "version": 2,
        "samples": [{
            "sample_id": "sample-test",
            "sample_fingerprint": fingerprint,
            "roi_signature": "roi-test",
            "roi_width": width,
            "roi_height": height,
            "roi_algorithm_version": "adaptive-roi-v1",
            "status": "annotated",
            "completeness": "partial",
            "polylines": [{"id": "manual", "points": [{"x": 30, "y": 100}, {"x": 190, "y": 100}]}],
        }],
    }), encoding="utf-8")
    manifest_path.write_text(json.dumps({
        "format": "metemu-palm-benchmark",
        "version": 1,
        "annotations": annotation_path.name,
        "samples": [{
            "sample_id": "sample-test",
            "source_fingerprint": fingerprint,
            "roi_path": image_path.name,
            "roi_sha256": fingerprint_file(image_path),
            "roi_pixel_sha256": pixel_hash,
            "roi_signature": "roi-test",
            "roi_width": width,
            "roi_height": height,
            "roi_algorithm_version": "adaptive-roi-v1",
        }],
    }), encoding="utf-8")

    exit_code = main([
        str(image_path),
        "--benchmark-manifest", str(manifest_path),
        "--diagnostics", str(output_path),
    ])
    capsys.readouterr()

    assert exit_code == 0
    assert (output_path / "15-manual-annotation.png").is_file()
    assert (output_path / "16-manual-vs-final.png").is_file()

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["samples"][0]["roi_sha256"] = "0" * 64
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    mismatch_output = tmp_path / "mismatch"
    mismatch_exit = main([
        str(image_path),
        "--benchmark-manifest", str(manifest_path),
        "--diagnostics", str(mismatch_output),
    ])

    assert mismatch_exit == 2
    assert not mismatch_output.exists()
