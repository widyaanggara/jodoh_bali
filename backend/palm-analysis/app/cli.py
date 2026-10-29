from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Sequence

from app.evaluation import (
    ROI_ALGORITHM_VERSION,
    CompatibleAnnotation,
    fingerprint_file,
    load_annotation_document,
    resolve_annotation,
)
from app.image_io import hash_decoded_rgba, load_local_image, save_diagnostics
from app.services.detector import PalmImageError, detect_palm_lines


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run opencv-palm-lines-v1 against one local palm ROI.",
    )
    parser.add_argument("image", type=Path, help="JPG/PNG/WebP palm ROI path")
    parser.add_argument(
        "--diagnostics",
        type=Path,
        help="Explicit local directory for diagnostic images",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Include candidate polyline coordinates in stdout JSON",
    )
    parser.add_argument(
        "--benchmark-manifest",
        type=Path,
        help="Validate and overlay the exact JSON v1 benchmark annotation",
    )
    return parser


def _load_exact_annotation(
    manifest_path: Path,
    image_path: Path,
    image,
) -> CompatibleAnnotation:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(manifest, dict) or manifest.get("format") != "metemu-palm-benchmark":
        raise ValueError("Format manifest benchmark tidak dikenali.")
    samples = manifest.get("samples")
    if manifest.get("version") != 1 or not isinstance(samples, list):
        raise ValueError("Manifest benchmark wajib versi 1 dan memiliki samples.")
    base = manifest_path.parent.resolve()
    image_resolved = image_path.resolve()
    matching = [
        sample
        for sample in samples
        if isinstance(sample, dict)
        and isinstance(sample.get("roi_path"), str)
        and (base / str(sample["roi_path"])).resolve() == image_resolved
    ]
    if len(matching) != 1:
        raise ValueError("Manifest tidak memiliki tepat satu referensi ke ROI diagnostik.")
    sample = matching[0]
    if fingerprint_file(image_resolved) != sample.get("roi_sha256"):
        raise ValueError("SHA-256 file ROI tidak cocok dengan manifest.")
    if hash_decoded_rgba(image) != sample.get("roi_pixel_sha256"):
        raise ValueError("SHA-256 piksel ROI tidak cocok dengan manifest.")
    height, width = image.shape[:2]
    if sample.get("roi_width") != width or sample.get("roi_height") != height:
        raise ValueError("Dimensi ROI tidak cocok dengan manifest.")
    if sample.get("roi_algorithm_version") != ROI_ALGORITHM_VERSION:
        raise ValueError("Versi adaptive ROI tidak cocok dengan manifest.")
    annotation_reference = manifest.get("annotations")
    if not isinstance(annotation_reference, str) or not annotation_reference:
        raise ValueError("Manifest tidak memiliki referensi anotasi.")
    source_fingerprint = sample.get("source_fingerprint")
    roi_signature = sample.get("roi_signature")
    if not isinstance(source_fingerprint, str) or not isinstance(roi_signature, str):
        raise ValueError("Fingerprint sumber atau ROI signature tidak valid.")
    annotations = load_annotation_document((base / annotation_reference).resolve())
    resolution = resolve_annotation(
        annotations,
        sample_fingerprint=source_fingerprint,
        roi_signature=roi_signature,
        roi_width=width,
        roi_height=height,
    )
    if resolution.compatibility != "exact" or resolution.annotation is None:
        raise ValueError(f"Anotasi benchmark tidak kompatibel: {resolution.reason}")
    if resolution.annotation.sample_id != sample.get("sample_id"):
        raise ValueError("Sample ID anotasi tidak cocok dengan manifest.")
    return resolution.annotation


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
        result = detect_palm_lines(
            image,
            include_diagnostics=args.diagnostics is not None,
        )
        if args.diagnostics is not None:
            save_diagnostics(result, image, args.diagnostics, annotation)
        print(json.dumps(result.to_payload(include_candidates=args.json), indent=2))
        return 0
    except (PalmImageError, ValueError, OSError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    finally:
        if image is not None:
            image.fill(0)


if __name__ == "__main__":
    raise SystemExit(main())
