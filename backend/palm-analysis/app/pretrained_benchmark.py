from __future__ import annotations

import argparse
import json
import os
import platform
import statistics
import sys
from pathlib import Path
from typing import Sequence

from app.benchmark import run_manifest
from app.cli import _load_exact_annotation
from app.evaluation import score_candidates
from app.image_io import load_local_image
from app.pretrained_cli import save_pretrained_diagnostics
from app.services.detector import PalmImageError
from app.services.pretrained_detector import ModelContractError, PretrainedPalmLineDetector


def _percentile(values: list[float], percentile: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    index = (len(ordered) - 1) * percentile
    lower = int(index)
    upper = min(lower + 1, len(ordered) - 1)
    fraction = index - lower
    return ordered[lower] * (1.0 - fraction) + ordered[upper] * fraction


def _peak_rss_mb() -> float | None:
    if sys.platform == "win32":
        try:
            import ctypes
            from ctypes import wintypes

            class ProcessMemoryCounters(ctypes.Structure):
                _fields_ = [
                    ("cb", wintypes.DWORD),
                    ("PageFaultCount", wintypes.DWORD),
                    ("PeakWorkingSetSize", ctypes.c_size_t),
                    ("WorkingSetSize", ctypes.c_size_t),
                    ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                    ("PagefileUsage", ctypes.c_size_t),
                    ("PeakPagefileUsage", ctypes.c_size_t),
                ]

            counters = ProcessMemoryCounters()
            counters.cb = ctypes.sizeof(counters)
            get_process = ctypes.windll.kernel32.GetCurrentProcess
            get_process.restype = wintypes.HANDLE
            handle = get_process()
            get_memory = ctypes.windll.psapi.GetProcessMemoryInfo
            get_memory.argtypes = [
                wintypes.HANDLE,
                ctypes.POINTER(ProcessMemoryCounters),
                wintypes.DWORD,
            ]
            get_memory.restype = wintypes.BOOL
            if get_memory(
                handle,
                ctypes.byref(counters),
                counters.cb,
            ):
                return counters.PeakWorkingSetSize / (1024.0 * 1024.0)
        except (AttributeError, OSError):
            return None
        return None
    try:
        import resource

        peak = float(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)
        return peak / (1024.0 if sys.platform != "darwin" else 1024.0 * 1024.0)
    except (ImportError, OSError):
        return None


def _resolve(base: Path, value: object) -> Path:
    if not isinstance(value, str) or not value:
        raise ValueError("Path ROI pada manifest tidak valid.")
    path = Path(value)
    return path if path.is_absolute() else (base / path).resolve()


def run_pretrained_benchmark(
    manifest_path: Path,
    model_path: Path,
    *,
    iterations: int = 10,
    diagnostics_directory: Path | None = None,
) -> dict[str, object]:
    if iterations < 2:
        raise ValueError("Benchmark membutuhkan sedikitnya dua iterasi (cold dan warm).")
    baseline = run_manifest(manifest_path)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    samples = manifest.get("samples")
    if not isinstance(samples, list):
        raise ValueError("Manifest tidak memiliki samples.")
    detector = PretrainedPalmLineDetector(model_path)
    output: list[dict[str, object]] = []
    for raw_sample in samples:
        if not isinstance(raw_sample, dict):
            continue
        sample_id = str(raw_sample.get("sample_id") or "unknown")
        image = None
        try:
            image_path = _resolve(manifest_path.parent, raw_sample.get("roi_path"))
            image = load_local_image(image_path)
            annotation = _load_exact_annotation(manifest_path, image_path, image)
            hand = str(raw_sample.get("hand_group") or "unknown")
            results = [
                detector.detect(
                    image,
                    mirror_right_hand=hand == "right",
                    include_diagnostics=diagnostics_directory is not None and index == 0,
                )
                for index in range(iterations)
            ]
            first = results[0]
            warm = results[1:]
            scores = score_candidates(first.candidates, annotation) if first.status == "candidates" else []
            if diagnostics_directory is not None:
                save_pretrained_diagnostics(
                    first,
                    image,
                    diagnostics_directory / sample_id,
                    annotation,
                )
            stage_performance: dict[str, object] = {}
            for stage in ("preprocess", "inference", "postprocess", "total"):
                warm_values = [result.timings_ms[stage] for result in warm]
                stage_performance[stage] = {
                    "cold_ms": first.timings_ms[stage],
                    "warm_median_ms": statistics.median(warm_values),
                    "warm_p95_ms": _percentile(warm_values, 0.95),
                }
            output.append(
                {
                    "sample_id": sample_id,
                    "pixel_identity_verified": True,
                    "annotation_completeness": annotation.completeness,
                    "scores_provisional": annotation.completeness != "complete",
                    "hand_group": hand,
                    "canonicalized_right_to_left": first.transform.mirrored_for_canonical_left,
                    "status": first.status,
                    "abstain_reason": first.abstain_reason,
                    "candidate_count": first.candidate_count,
                    "total_length_pixels": first.total_length_pixels,
                    "fragmentation_per_100px": (
                        first.candidate_count * 100.0 / first.total_length_pixels
                        if first.total_length_pixels > 0
                        else None
                    ),
                    "near_outer_contour_count": first.near_outer_contour_count,
                    "near_outer_contour_ratio": (
                        first.near_outer_contour_count / first.candidate_count
                        if first.candidate_count
                        else None
                    ),
                    "class_pixel_counts": first.class_pixel_counts,
                    "scores": scores,
                    "performance": stage_performance,
                },
            )
        finally:
            if image is not None:
                image.fill(0)
    try:
        import onnxruntime as ort

        ort_version: str | None = ort.__version__
    except ImportError:
        ort_version = None
    return {
        "format": "metemu-pretrained-palm-benchmark",
        "version": 1,
        "research_only": True,
        "model": {
            "algorithm_version": "palm-line-student-exp2-fp16",
            "path": str(model_path.resolve()),
            "sha256": detector.model_sha256,
            "load_time_ms": detector.load_time_ms,
            "provider": "CPUExecutionProvider",
        },
        "runtime": {
            "python": platform.python_version(),
            "onnxruntime": ort_version,
            "system": platform.platform(),
            "processor": platform.processor(),
            "logical_cpu_count": os.cpu_count(),
            "process_peak_rss_mb": _peak_rss_mb(),
            "iterations_per_sample": iterations,
        },
        "strict_baseline": baseline,
        "pretrained_samples": output,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Strict local benchmark for the audited ONNX model.")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--iterations", type=int, default=10)
    parser.add_argument("--diagnostics", type=Path)
    parser.add_argument("--output", type=Path, help="Explicit JSON output; stdout is always available")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        result = run_pretrained_benchmark(
            args.manifest,
            args.model,
            iterations=args.iterations,
            diagnostics_directory=args.diagnostics,
        )
        payload = json.dumps(result, indent=2)
        if args.output is not None:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(payload, encoding="utf-8")
        print(payload)
        return 0
    except (PalmImageError, ModelContractError, ValueError, OSError, json.JSONDecodeError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
