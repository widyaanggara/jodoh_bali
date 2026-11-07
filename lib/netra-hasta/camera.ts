export interface CameraDeviceOption {
  deviceId: string;
  label: string;
}

export function getCameraErrorMessage(error: unknown): string {
  const name = error && typeof error === "object" && "name" in error
    ? String(error.name)
    : "";

  switch (name) {
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

export function createCameraVideoConstraints(
  deviceId?: string,
): MediaTrackConstraints {
  return {
    ...(deviceId
      ? { deviceId: { exact: deviceId } }
      : { facingMode: "user" }),
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };
}

export function createCameraDeviceOptions(
  devices: Array<Pick<MediaDeviceInfo, "deviceId" | "kind" | "label">>,
): CameraDeviceOption[] {
  const videoDevices = devices.filter(
    (device, index, entries) =>
      device.kind === "videoinput" &&
      device.deviceId.length > 0 &&
      entries.findIndex(
        (candidate) =>
          candidate.kind === "videoinput" &&
          candidate.deviceId === device.deviceId,
      ) === index,
  );

  return videoDevices.map((device, index) => ({
    deviceId: device.deviceId,
    label: device.label.trim() || `Kamera ${index + 1}`,
  }));
}
