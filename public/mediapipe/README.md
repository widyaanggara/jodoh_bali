# MediaPipe assets

Assets in this directory are served locally by the Metemu application. No CDN URL is used at runtime.

## Runtime

- Package: `@mediapipe/tasks-vision`
- Version: `1.1.1`
- Source: files copied from `node_modules/@mediapipe/tasks-vision/wasm`
- Package license: Apache License 2.0 (as declared in the package manifest)
- License copy: `LICENSE-APACHE-2.0.txt`

The SIMD, non-SIMD, and ES module loader/binary pairs are kept together and must be updated as a set when the package version changes.

## Hand Landmarker model

- File: `models/hand_landmarker.task`
- Official source: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`
- Model card: `https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Hand%20Tracking%20(Lite_Full)%20with%20Fairness%20Oct%202021.pdf`
- License stated by the model card: Apache License 2.0

The model card describes the model as experimental, unsuitable for identity recognition or surveillance, and sensitive to occlusion, jewelry, tattoos, henna, low light, and motion blur.

## Network and privacy note

The application loads the model and WASM from `/mediapipe/` on the same origin. It does not upload camera frames, images, landmarks, or detection results.

The MediaPipe Tasks 1.1.1 privacy notice states that inputs are processed on-device and are not sent to Google servers. It also states that the APIs send performance and utilization metrics to Google. The public 1.1.1 TypeScript API does not expose a telemetry opt-out setting, so this behavior must be disclosed to users and checked in browser network tooling before production release.
