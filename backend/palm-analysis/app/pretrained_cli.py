from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Sequence

import cv2
import numpy as np

from app.cli import _load_exact_annotation
from app.image_io import load_local_image
from app.services.detector import PalmImageError
from app.services.pretrained_detector import (
    CLASS_NAMES,
    ModelContractError,
    PretrainedDetectionResult,
    PretrainedPalmLineDetector,
)


def _write_png(path: Path, image: np.ndarray) -> None:
    success, encoded = cv2.imencode(".png", image)
    if not success:
        raise PalmImageError(f"Gagal mengenkode diagnostik {path.name}.")
    try:
        path.write_bytes(encoded.tobytes())
    finally:
        encoded.fill(0)


def save_pretrained_diagnostics(
    result: PretrainedDetectionResult,
    source: np.ndarray,
    output_directory: Path,
    annotation=None,
) -> list[Path]:
    """Write model artifacts only after an explicit developer CLI request."""
    diagnostics = result.diagnostics
    if diagnostics is None or diagnostics.class_mask_roi is None:
        raise PalmImageError("Detektor tidak dijalankan dengan diagnostik.")
    output_directory.mkdir(parents=True, exist_ok=True)
    if source.ndim == 2:
        source_bgr = cv2.cvtColor(source, cv2.COLOR_GRAY2BGR)
    elif source.ndim == 3 and source.shape[2] == 4:
        source_bgr = cv2.cvtColor(source, cv2.COLOR_BGRA2BGR)
    else:
        source_bgr = source[:, :, :3].copy()
    palette = np.array(
        (
            (0, 0, 0),
            (0, 0, 255),
            (0, 255, 255),
            (255, 0, 255),
        ),
        dtype=np.uint8,
    )
    color_mask = palette[diagnostics.class_mask_roi]
    overlay = cv2.addWeighted(source_bgr, 0.72, color_mask, 0.6, 0.0)
    candidate_overlay = source_bgr.copy()
    for candidate in result.candidates:
        points = np.array(
            [[round(point.x), round(point.y)] for point in candidate.points],
            dtype=np.int32,
        ).reshape(-1, 1, 2)
        cv2.polylines(candidate_overlay, [points], False, (0, 255, 255), 2, cv2.LINE_AA)
    comparison = candidate_overlay.copy()
    if annotation is not None:
        for polyline in annotation.polylines:
            points = np.array(
                [[round(point.x), round(point.y)] for point in polyline.points],
                dtype=np.int32,
            ).reshape(-1, 1, 2)
            cv2.polylines(comparison, [points], False, (255, 0, 255), 3, cv2.LINE_AA)
    files = {
        "00-original-roi.png": source_bgr,
        "01-semantic-mask.png": color_mask,
        "02-foreground-mask.png": diagnostics.foreground_mask_roi,
        "02-centerline-after-postprocess.png": diagnostics.centerline_mask_roi,
        "03-semantic-overlay.png": overlay,
        "04-candidate-overlay.png": candidate_overlay,
        "05-manual-vs-pretrained.png": comparison,
    }
    written: list[Path] = []
    for name, image in files.items():
        if image is None:
            continue
        target = output_directory / name
        _write_png(target, image)
        written.append(target)
    for class_name, probability in diagnostics.probability_maps_model.items():
        probability_image = np.clip(probability * 255.0, 0, 255).astype(np.uint8)
        target = output_directory / f"06-{class_name.replace('_', '-')}-probability.png"
        _write_png(target, probability_image)
        probability_image.fill(0)
        written.append(target)
    for class_index, class_name in enumerate(CLASS_NAMES[1:], start=1):
        class_binary = np.where(
            diagnostics.class_mask_roi == class_index,
            255,
            0,
        ).astype(np.uint8)
        target = output_directory / f"01-{class_name.replace('_', '-')}-mask.png"
        _write_png(target, class_binary)
        class_binary.fill(0)
        written.append(target)
    report = output_directory / "diagnostics.json"
    report.write_text(
        json.dumps(
            {
                **result.to_payload(include_candidates=True),
                "class_names": list(CLASS_NAMES),
                "annotation_overlayed": annotation is not None,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    written.append(report)
    for image in (source_bgr, color_mask, overlay, candidate_overlay, comparison):
        image.fill(0)
    return written


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run the audited pretrained palm-line model against one local ROI.",
    )
    parser.add_argument("image", type=Path)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--hand", choices=("left", "right", "unknown"), default="unknown")
    parser.add_argument(
        "--resize-mode",
        choices=("bilinear-stretch", "letterbox-black"),
        default="bilinear-stretch",
    )
    parser.add_argument("--diagnostics", type=Path)
    parser.add_argument("--benchmark-manifest", type=Path)
    parser.add_argument("--json", action="store_true", help="Include candidate coordinates")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    image = None
    try:
        image = load_local_image(args.image)
        annotation = (
            _load_exact_annotation(args.benchmark_manifest, args.image, image)
            if args.benchmark_manifest is not None
            else None
        )
        detector = PretrainedPalmLineDetector(args.model)
        result = detector.detect(
            image,
            mirror_right_hand=args.hand == "right",
            resize_mode=args.resize_mode,
            include_diagnostics=args.diagnostics is not None,
        )
        if args.diagnostics is not None:
            save_pretrained_diagnostics(result, image, args.diagnostics, annotation)
        print(json.dumps(result.to_payload(include_candidates=args.json), indent=2))
        return 0
    except (PalmImageError, ModelContractError, ValueError, OSError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    finally:
        if image is not None:
            image.fill(0)


if __name__ == "__main__":
    raise SystemExit(main())
