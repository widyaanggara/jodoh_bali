from typing import Literal

import cv2
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel


class HealthPayload(BaseModel):
    status: Literal["ok"]
    service: str
    opencv_version: str
    numpy_version: str
    analysis_enabled: bool


app = FastAPI(
    title="Metemu Palm Analysis",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.get("/health", response_model=HealthPayload)
def health() -> HealthPayload:
    """Container readiness only; no biometric input is accepted in 3C.2 setup."""
    return HealthPayload(
        status="ok",
        service="palm-analysis",
        opencv_version=cv2.__version__,
        numpy_version=np.__version__,
        analysis_enabled=False,
    )
