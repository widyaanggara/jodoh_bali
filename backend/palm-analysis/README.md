# Metemu Palm Analysis

Backend ini masih berada pada tahap eksperimen offline Milestone 3C.2B. FastAPI
hanya mendaftarkan `GET /health` dengan `analysis_enabled=false`. Browser belum
mengirim ROI dan endpoint analisis belum diaktifkan.

## Environment lokal

Gunakan environment Conda existing `metemu`:

```powershell
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu python --version
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu python -m pip check
```

Dependency production berada di `requirements.txt`; pytest dan HTTP test client
berada di `requirements-dev.txt`. Docker tetap memakai Python 3.11 Linux dan
tidak menyalin environment Conda Windows.

## Detector offline

`opencv-palm-lines-v1` menerima satu citra ROI telapak yang sudah dipotong dan
dirotasi oleh frontend. Pipeline-nya:

1. validasi ukuran, brightness, contrast, dan sharpness;
2. CLAHE terbatas dan pengurangan background Gaussian;
3. respons lipatan gelap menggunakan black-hat multiskala dan eigenvalue Hessian;
4. threshold robust dengan bobot interior lunak;
5. morphology, skeletonisasi, dan penelusuran centerline;
6. penolakan fragmen pendek dan segmen yang dominan berada di border;
7. pemetaan koordinat kembali ke resolusi ROI asli.

Detector dapat mengembalikan `candidates` atau `abstain`. Kandidat bukan label
Rekha dan bukan bukti akurasi pembacaan telapak.

Jalankan satu ROI tanpa menyimpan gambar:

```powershell
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu `
  python -m app.cli C:\path\to\palm-roi.png
```

Koordinat kandidat hanya dicetak bila developer meminta `--json`. Diagnostik
hanya ditulis melalui tindakan eksplisit:

```powershell
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu `
  python -m app.cli C:\path\to\palm-roi.png `
  --diagnostics tmp\palm-diagnostics --json
```

Untuk diagnostik manusia yang terikat ground truth, sertakan manifest benchmark.
CLI akan memvalidasi hash file, hash piksel RGBA, dimensi, versi ROI, fingerprint,
ROI signature, sample ID, dan anotasi sebelum menulis overlay:

```powershell
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu `
  python -m app.cli C:\path\to\sample-roi.png `
  --benchmark-manifest C:\path\to\sample-benchmark.json `
  --diagnostics dataset\palm-benchmark\pilot-01\diagnostics\sample
```

Output eksplisit memuat citra tahap ridge/threshold/skeleton, kandidat sebelum
filter, keputusan filter, area border, anotasi manual, perbandingan hasil akhir,
dan `diagnostics.json`. Warna overlay keputusan: hijau diterima, merah gagal
minimum length, jingga gagal border, dan ungu terpotong candidate cap. Tidak ada
file yang dibuat bila flag `--diagnostics` tidak diberikan.

## Ekspor ROI dan benchmark yang kompatibel

Buka `/dev/palm-evaluation` pada development, proses foto sumber, pilih hasil dan
anotasinya, lalu tekan **Ekspor paket ZIP**. Browser mengunduh satu ZIP yang
berisi PNG ROI lossless, anotasi `metemu-palm-lines` versi 2, dan manifest
benchmark. ZIP tidak dibuat sampai PNG berhasil didekode ulang dan identitas
pikselnya cocok dengan snapshot ROI. Tidak ada file yang diunggah atau disimpan
otomatis.

Ekstrak ZIP ke satu folder lokal, misalnya
`dataset/palm-benchmark/<pilot>/` (seluruh `dataset/` di-ignore Git dan Docker).
Manifest mengikat pasangan tanpa menebak dari nama file:

```json
{
  "format": "metemu-palm-benchmark",
  "version": 1,
  "annotations": "palm-a-annotations.json",
  "samples": [
    {
      "sample_id": "palm-a1b2c3d4e5f6",
      "source_fingerprint": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "roi_path": "palm-a-roi.png",
      "roi_sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "roi_pixel_sha256": "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      "roi_signature": "roi-example-signature",
      "roi_width": 241,
      "roi_height": 338,
      "roi_algorithm_version": "adaptive-roi-v1",
      "roi_method": "adaptive-oriented",
      "rotation_degrees": 1.25,
      "padding_scale": 1.0,
      "subject_group": "subject-a1b2c3d4",
      "hand_group": "right",
      "camera_group": "front",
      "split": "development",
      "javascript_baseline": {
        "algorithm_version": "dark-ridge-v1",
        "parameter_version": "baseline-2026-10-27",
        "status": "detected",
        "abstain_reason": null,
        "candidate_count": 4,
        "total_length_pixels": 310.5,
        "near_outer_contour_count": 1,
        "processing_time_ms": 12.5,
        "candidates": [
          {
            "id": "candidate-1",
            "length_pixels": 110.0,
            "points": [{"x": 42, "y": 100}, {"x": 152, "y": 100}]
          }
        ]
      }
    }
  ]
}
```

Sebelum scoring, Python memverifikasi hash file PNG, hash piksel RGBA hasil
decode, fingerprint sumber, sample ID, ROI signature, dimensi, versi
`adaptive-roi-v1`, dan koordinat polyline. Mismatch ditolak; Python tidak
melakukan crop, rotasi, rescale, atau perbaikan anotasi. Status `undetermined`
dicatat tetapi tidak diberi skor.

```powershell
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu `
  python -m app.benchmark C:\path\to\benchmark-manifest.json
```

Beberapa paket satu-sampel dapat digabung secara read-only tanpa menyunting
manifest atau citra:

```powershell
$manifests = Get-ChildItem dataset\palm-benchmark\pilot-01\*-benchmark.json
C:\Users\wisnu\miniconda3\Scripts\conda.exe run --no-capture-output -n metemu `
  python -m app.benchmark $manifests.FullName
```

CLI menolak `sample_id` duplikat agar satu ROI tidak terhitung dua kali.

Coverage, precision, dan F1 dihitung secara length-weighted pada toleransi 3, 6,
dan 9 piksel untuk `dark-ridge-v1` serta `opencv-palm-lines-v1` pada byte piksel
yang identik. Output juga memuat jumlah/panjang kandidat, fragmentasi, kandidat
dekat border, waktu proses, abstain, ringkasan per subjek, dan split. Precision
serta F1 tetap provisional untuk anotasi parsial.

Untuk pilot sekitar 24 ROI, pilih variasi kualitas secara manusia dan gunakan
`subject_group` anonim. Split ditetapkan deterministik pada tingkat subjek,
sehingga semua foto satu subjek selalu berada di development atau holdout.
Keluaran algoritma tidak boleh digunakan sebagai ground truth manual.

## Kontrak masa depan — belum aktif

Integrasi 3C.3 dapat mempertimbangkan:

```text
POST /v1/palm-lines/analyze
Content-Type: multipart/form-data
```

Metadata minimum: versi ROI, ROI signature, dimensi, dan consent context yang
ditetapkan PRD. Respons mengikuti payload `PalmLineDetectionResult`: versi
algoritma, status, alasan abstain, kandidat dalam koordinat ROI, jumlah/panjang,
dan waktu proses.

Endpoint tersebut belum didaftarkan. Sebelum diaktifkan diperlukan consent
eksplisit, autentikasi/otorisasi, TLS, batas ukuran request, decoding aman, rate
limit, timeout, kebijakan retensi, dan pengujian lingkungan deployment. Tidak
boleh ada fallback tersembunyi ke ekstraktor JavaScript.
