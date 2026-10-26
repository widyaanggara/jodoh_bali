"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "active" | "error";

interface CameraState {
  status: CameraStatus;
  stream: MediaStream | null;
  error: string | null;
  notice: string | null;
}

const INITIAL_STATE: CameraState = {
  status: "idle",
  stream: null,
  error: null,
  notice: null,
};

function getCameraErrorMessage(error: unknown): string {
  if (!(error instanceof DOMException)) {
    return "Kamera tidak dapat dimulai. Silakan coba lagi.";
  }

  switch (error.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Izin kamera ditolak. Izinkan akses kamera melalui pengaturan browser, lalu coba lagi.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "Kamera tidak ditemukan pada perangkat ini.";
    case "NotReadableError":
    case "TrackStartError":
      return "Kamera sedang digunakan aplikasi lain atau tidak dapat dibaca.";
    case "OverconstrainedError":
      return "Kamera tersedia, tetapi tidak mendukung konfigurasi video yang diminta.";
    default:
      return "Kamera tidak dapat dimulai. Periksa izin browser dan coba lagi.";
  }
}

export function useCamera() {
  const [camera, setCamera] = useState<CameraState>(INITIAL_STATE);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);

  const releaseStream = useCallback(() => {
    requestIdRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopCamera = useCallback(
    (notice = "Pemindaian dihentikan.") => {
      releaseStream();
      setCamera({ status: "idle", stream: null, error: null, notice });
    },
    [releaseStream],
  );

  const startCamera = useCallback(async () => {
    releaseStream();
    const requestId = requestIdRef.current;
    setCamera({ status: "requesting", stream: null, error: null, notice: null });

    if (!window.isSecureContext) {
      setCamera({
        status: "error",
        stream: null,
        error: "Kamera hanya tersedia melalui HTTPS atau localhost.",
        notice: null,
      });
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera({
        status: "error",
        stream: null,
        error: "Browser ini tidak mendukung akses webcam.",
        notice: null,
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      setCamera({ status: "active", stream, error: null, notice: null });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      setCamera({
        status: "error",
        stream: null,
        error: getCameraErrorMessage(error),
        notice: null,
      });
    }
  }, [releaseStream]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && streamRef.current) {
        stopCamera("Kamera dihentikan otomatis saat tab tidak aktif.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseStream();
    };
  }, [releaseStream, stopCamera]);

  return {
    ...camera,
    startCamera,
    stopCamera,
  };
}
