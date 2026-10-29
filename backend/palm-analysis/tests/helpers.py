from __future__ import annotations

import cv2
import numpy as np
from numpy.typing import NDArray


def synthetic_palm(width: int = 240, height: int = 320) -> NDArray[np.uint8]:
    y_coordinates, x_coordinates = np.mgrid[:height, :width]
    illumination = 166.0 + 16.0 * x_coordinates / width - 10.0 * y_coordinates / height
    image = np.dstack([illumination * 0.94, illumination, illumination * 1.04])
    image = np.clip(image, 0, 255).astype(np.uint8)
    curves = [
        np.array(
            [
                [round(width * 0.17), round(height * 0.32)],
                [round(width * 0.38), round(height * 0.37)],
                [round(width * 0.64), round(height * 0.36)],
                [round(width * 0.82), round(height * 0.30)],
            ],
            dtype=np.int32,
        ),
        np.array(
            [
                [round(width * 0.20), round(height * 0.50)],
                [round(width * 0.40), round(height * 0.47)],
                [round(width * 0.62), round(height * 0.52)],
                [round(width * 0.77), round(height * 0.61)],
            ],
            dtype=np.int32,
        ),
        np.array(
            [
                [round(width * 0.32), round(height * 0.72)],
                [round(width * 0.36), round(height * 0.58)],
                [round(width * 0.34), round(height * 0.45)],
                [round(width * 0.27), round(height * 0.35)],
            ],
            dtype=np.int32,
        ),
    ]
    line_width = max(3, round(min(width, height) * 0.0125))
    for curve in curves:
        cv2.polylines(
            image,
            [curve.reshape(-1, 1, 2)],
            False,
            (82, 88, 92),
            line_width,
            cv2.LINE_AA,
        )
    random = np.random.default_rng(20261028)
    noise = random.normal(0.0, 1.8, image.shape[:2]).astype(np.float32)
    return np.clip(image.astype(np.float32) + noise[:, :, None], 0, 255).astype(np.uint8)


def write_png(path, image: NDArray[np.uint8]) -> None:
    success, encoded = cv2.imencode(".png", image)
    assert success
    path.write_bytes(encoded.tobytes())
    encoded.fill(0)
