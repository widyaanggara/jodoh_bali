"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createCameraDeviceOptions,
  createCameraVideoConstraints,
  getCameraErrorMessage,
  type CameraDeviceOption,
} from "@/lib/netra-hasta/camera";

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

export function useCamera() {
  const [camera, setCamera] = useState<CameraState>(INITIAL_STATE);
  const [devices, setDevices] = useState<CameraDeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestIdRef = useRef(0);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const availableDevices = createCameraDeviceOptions(
        await navigator.mediaDevices.enumerateDevices(),
      );
      setDevices(availableDevices);
    } catch {
      // Device enumeration is optional; camera capture can still continue.
    }
  }, []);

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

  const startCamera = useCallback(async (deviceId?: string) => {
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
        video: createCameraVideoConstraints(deviceId),
      });

      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      const activeDeviceId = videoTrack?.getSettings().deviceId ?? deviceId ?? null;
      setSelectedDeviceId(activeDeviceId);
      videoTrack?.addEventListener("ended", () => {
        if (streamRef.current !== stream) return;
        streamRef.current = null;
        requestIdRef.current += 1;
        setSelectedDeviceId(null);
        setCamera({
          status: "error",
          stream: null,
          error: "Kamera terputus. Pilih kamera lain atau sambungkan kembali perangkat.",
          notice: null,
        });
        void refreshDevices();
      }, { once: true });
      setCamera({ status: "active", stream, error: null, notice: null });
      void refreshDevices();
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      setCamera({
        status: "error",
        stream: null,
        error: getCameraErrorMessage(error),
        notice: null,
      });
    }
  }, [refreshDevices, releaseStream]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && streamRef.current) {
        stopCamera("Kamera dihentikan otomatis saat tab tidak aktif.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
      releaseStream();
    };
  }, [refreshDevices, releaseStream, stopCamera]);

  return {
    ...camera,
    devices,
    selectedDeviceId,
    startCamera,
    stopCamera,
  };
}
