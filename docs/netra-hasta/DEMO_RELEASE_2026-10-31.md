# Metemu Netra-Hasta — Demo Release 2026-10-31

## 1. Identitas checkpoint

- Branch: `feat/netra-hasta-ai`
- Target demo: 31 Oktober 2026
- Status: **DEMO READY — eksperimental**
- Baseline ROI: `adaptive-roi-v1`
- Baseline kandidat: `dark-ridge-v1`
- Parameter riset: `baseline-2026-10-27`

Status ini hanya menyatakan prototipe kamera dapat didemonstrasikan. Status ini
tidak berarti production-ready dan tidak memvalidasi pembacaan Hasta Rekha,
interpretasi budaya, atau akurasi ilmiah.

## 2. Fitur yang benar-benar berfungsi

- Kamera browser dengan consent, pesan error, lifecycle cleanup, pemilihan kamera
  internal/eksternal, dan pergantian perangkat.
- MediaPipe Hand Landmarker untuk 21 landmark, panduan posisi, handedness, serta
  quality gate telapak secara real-time.
- MediaPipe Face Landmarker untuk mesh wajah, estimasi yaw/pitch/roll, dan rasio
  geometris zona atas/tengah/bawah tanpa interpretasi pribadi.
- Capture satu frame resolusi sumber, ROI telapak terotasi `adaptive-roi-v1`,
  snapshot metrik, grayscale, dan contrast enhancement konservatif.
- Hard gate untuk kamera, consent, satu tangan, ROI, dan stabilitas; soft gate
  untuk brightness, contrast, dan sharpness dengan manual override yang jelas.
- Ekstraksi kandidat `dark-ridge-v1` dalam Web Worker, termasuk timeout, error,
  abstain, stale-result protection, retake, dan pembersihan buffer.
- Overlay kandidat pada koordinat ROI yang sama. Kandidat tidak diberi nama empat
  Rekha dan tidak dihubungkan dengan karakter, kesehatan, karier, atau Samyoga.
- Evaluator, anotasi manual, ekspor benchmark, serta pembanding algoritma tersedia
  hanya pada route development.

## 3. Hasil pengujian otomatis terakhir

Audit dijalankan 30 Oktober 2026:

| Pemeriksaan | Hasil |
| --- | --- |
| TypeScript `tsc --noEmit` | Lulus |
| ESLint file Netra-Hasta terkait | Lulus |
| Frontend palm regression | 54/54 lulus |
| Python pytest | 45 lulus, 2 skip, 1 warning deprecation |
| Production build Next.js | Lulus |
| Production `/netra-hasta` | HTTP 200 |
| Production `/dev/palm-evaluation` | HTTP 404 |
| `git diff --check` | Lulus |

Dua tes Python dilewati karena `METEMU_PRETRAINED_MODEL` dan upstream snapshot
tidak dikonfigurasi. Bobot tersebut sengaja lokal dan tidak menjadi dependency
rilis. Pesan `INFO: Created TensorFlow Lite XNNPACK delegate for CPU` adalah
informasi runtime, bukan error.

## 4. Physical acceptance yang dilaporkan developer

Hasil berikut berasal dari laporan developer, bukan pengujian kamera yang
dijalankan Codex:

- 8/8 kelompok acceptance dinyatakan lulus.
- Pergantian Hand/Face lima kali lulus.
- Kamera internal dan eksternal berhasil digunakan.
- Retake sepuluh kali lulus.
- Tracking normal dan tidak menampilkan stale result.
- Network dan lifecycle kamera telah diperiksa manual.

## 5. Cara menjalankan prototipe

```powershell
npm ci
npm run dev
```

Buka `http://localhost:3000/netra-hasta`. Kamera membutuhkan localhost atau HTTPS.
Model MediaPipe dan aset WebAssembly dibaca dari `public/mediapipe/`.

Validasi rilis:

```powershell
npx tsc --noEmit
npx eslint components/netra-hasta/CameraStage.tsx components/netra-hasta/NetraHastaClient.tsx components/netra-hasta/PalmPreviewPanel.tsx components/netra-hasta/PalmLineResultPanel.tsx components/netra-hasta/QualityIndicator.tsx hooks/useCamera.ts hooks/usePalmLineExtraction.ts lib/netra-hasta/camera.ts tests/netra-hasta-palm.test.mjs
npm run test:palm
npm run build
```

Tes Python memakai environment Conda existing `metemu`:

```powershell
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu python -m pytest
```

Jalankan perintah tersebut dari `backend/palm-analysis`.

## 6. Skenario demo

1. Buka `/netra-hasta`, pilih Hasta Rekha, lalu berikan consent kamera.
2. Bila tersedia, pilih kamera internal atau eksternal dari selector.
3. Hadapkan satu telapak dan ikuti panduan emas sampai hard gate terpenuhi.
4. Setujui pemrosesan satu frame lokal, lalu tekan **Jepret Telapak**. Jika hanya
   soft gate yang gagal, gunakan manual override dengan memahami peringatannya.
5. Perlihatkan ROI asli, grayscale, enhanced contrast, snapshot kualitas, loading
   worker, lalu overlay kandidat atau status abstain.
6. Tegaskan bahwa cyan adalah kandidat eksperimental, bukan empat Rekha.
7. Tekan **Ambil Ulang** untuk menunjukkan cleanup dan tidak adanya hasil lama.
8. Beralih ke Rupa Lakshana untuk menunjukkan face mesh, pose, dan rasio teknis.

## 7. Traceability terhadap PRD

| Kapabilitas PRD | Status | Bukti/batas aktual |
| --- | --- | --- |
| Hand tracking 21 landmark | Implemented and tested | VIDEO mode, panduan, handedness, quality, GPU→CPU fallback |
| Face tracking | Implemented and tested | Satu wajah, mesh lengkap model, pose ±15°, rasio teknis; bukan interpretasi |
| Palm ROI dan capture | Implemented and tested | `adaptive-roi-v1`, frame sumber, hard/soft gate, retake |
| Empat garis Rekha | Not implemented | Hanya kandidat class-agnostic `dark-ridge-v1`; tidak ada Hayu/Jnana/Hredaya/Bhaga |
| Interpretasi budaya Hasta Rekha | Not implemented | Tidak ada rule engine atau klaim karakter tervalidasi |
| Tri Angga wajah | Partial | Rasio zona atas/tengah/bawah tersedia; pemetaan budaya dan validasi belum ada |
| Pemindaian pasangan | Not implemented | Hanya mode vision tangan/wajah bergantian untuk satu sesi, bukan dua subjek |
| Samyoga multimodal | Not implemented | Tidak ada pembobotan 40/35/25 atau integrasi biometrik ke kalender |
| Kartu budaya 9:16 | Not implemented | Tidak ada generator 1080×1920, download, atau Web Share |
| Target ≥25 FPS / ≤100 ms | Implemented but not validated | Loop inferensi sengaja ditargetkan 15 FPS; belum ada benchmark perangkat representatif |
| Akurasi landmark ≥92% | Not implemented | Belum ada evaluasi 100 foto/variasi rona kulit dan lux tervalidasi |
| Privasi on-device | Implemented and tested | Tidak ada upload/autosave pada flow live; stream dan buffer dibersihkan |
| Analytics anonim PRD | Not implemented | Tidak ditambahkan agar tidak memperluas pemrosesan biometrik tanpa desain consent |
| FastAPI palm analysis | Blocked | Hanya `GET /health`; `analysis_enabled=false`; tidak ada POST ROI |
| Pretrained segmentation | Implemented but not validated | Eksperimen offline berjalan, tetapi status tetap HOLD dan dua tes integrasi membutuhkan aset lokal |

Catatan engine lama: repository mengekspor `getBalineseDate()` dan
`calculateCompatibility()`, sedangkan `calculateWewaran()` bersifat internal dan
fungsi bernama `calculateSamyoga()` tidak tersedia. Tidak ada fungsi tersebut yang
diubah atau dihubungkan ke hasil biometrik pada release ini.

## 8. Keterbatasan algoritma

- `dark-ridge-v1` masih dapat memilih kontur luar, bayangan, atau tekstur kulit.
- Tidak semua lipatan telapak ditemukan dan jumlah kandidat bukan ukuran akurasi.
- Manual override tidak membuat citra otomatis layak untuk interpretasi.
- Abstain adalah hasil valid ketika bukti piksel tidak cukup; bukan skor nol.
- Benchmark manusia dan anotasi ground truth masih terbatas serta sebagian parsial.
- Target performa dan akurasi PRD belum dibuktikan pada populasi/perangkat yang
  representatif.

## 9. Status FastAPI dan pretrained model

FastAPI tetap internal dan hanya menyediakan health check dengan
`analysis_enabled=false`. Frontend tidak mengirim ROI, koordinat, fingerprint,
atau metrik biometrik ke backend. Aktivasi analisis memerlukan consent baru, TLS,
autentikasi, batas payload, rate limit, timeout, kebijakan retensi, larangan body
logging, threat model, dan revisi PRD/kebijakan privasi.

OpenCV serta pretrained ONNX tetap alat penelitian offline. Bobot berada di
`dataset/`, tidak dilacak Git, tidak masuk Docker image, dan tidak menjadi fallback
production. Eksperimen pretrained tetap **HOLD** karena belum mengungguli baseline
secara kompatibel pada benchmark yang memadai.

## 10. Risiko dan pekerjaan terbuka sebelum production

- Validasi empat kelas Rekha dengan anotasi budaya yang disetujui ahli.
- Evaluasi akurasi, bias rona kulit, pencahayaan, perangkat, dan performa PRD.
- Desain interpretasi budaya yang dapat diaudit dan tidak membuat klaim kesehatan.
- Implementasi serta validasi mode pasangan dan Samyoga multimodal.
- Generator kartu 9:16 dengan review kutipan/aksara dan hak penggunaan aset.
- Threat model dan consent khusus bila ROI akan meninggalkan perangkat.
- Observability non-biometrik, aksesibilitas lintas-browser, serta uji beban dan
  keamanan deployment.

Sampai pekerjaan tersebut selesai, checkpoint ini hanya **DEMO READY —
eksperimental**, bukan production-ready.
