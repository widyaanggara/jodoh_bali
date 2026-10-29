# Audit Model Palm-Line Pretrained — Milestone 3C.2E

Tanggal audit: 2026-10-29. Status: **research-only / HOLD**.

## Artefak dan kontrak yang diverifikasi

- Sumber: `samuelwbarber/palm-line-reader`, commit
  `bc48939f4deee6d8ff842bfde499396dab9c4830`.
- Lisensi repository: MIT. Tidak ada lisensi dataset atau bukti consent per citra
  yang menyertai bobot.
- Model lokal: `student_fp16.onnx`, 11.284.720 byte, SHA-256
  `e2c9f826676b3aaf0a715f3087fcd4fc0b4dccd8c53de05fd26696a8399f8dd6`.
- Arsitektur upstream: segmentation-models-pytorch UNet dengan encoder MiT-B0,
  opset ONNX 17, bobot FP16 dengan input/output FP32.
- Input: RGB `float32 [1,3,512,512]`, nilai dibagi 255 kemudian normalisasi
  ImageNet mean `(0.485, 0.456, 0.406)` dan std `(0.229, 0.224, 0.225)`.
- Resize: bilinear langsung ke 512 × 512, tanpa letterbox.
- Output: logits `float32 [1,4,512,512]`; kelas background, heart-line,
  head-line, life-line. Benchmark Metemu hanya memakai union foreground dan
  tidak memetakan kelas tersebut ke istilah budaya Hasta Rekha.
- Runtime lokal terverifikasi: ONNX Runtime CPU 1.31.1, Python 3.11.18.

Referensi upstream:

- https://github.com/samuelwbarber/palm-line-reader
- https://github.com/samuelwbarber/palm-line-reader/blob/main/models/model_meta.json
- https://github.com/samuelwbarber/palm-line-reader/blob/main/web/palmLines.js
- https://github.com/samuelwbarber/palm-line-reader/blob/main/LICENSE

## Provenance dan batas pemakaian

README upstream menyatakan student model dilatih menggunakan pseudo-label dari
beberapa ribu foto yang di-scrape dari r/PalmReading. Foto sumber dan teacher
checkpoint tidak diterbitkan karena alasan ukuran dan provenance. Karena itu,
lisensi MIT repository tidak cukup untuk membuktikan hak penggunaan, consent,
representasi demografis, atau izin pemrosesan biometrik dari data latih.

Model hanya boleh digunakan untuk evaluasi lokal yang eksplisit. Bobot disimpan
di bawah `dataset/palm-models/`, yang di-ignore Git dan Docker. Model tidak
dimuat FastAPI, tidak menerima upload, dan tidak mengubah
`analysis_enabled=false`.

## Risiko domain dan geometri

Upstream mengharapkan crop telapak yang ketat dan kira-kira persegi. ROI Metemu
pilot berukuran 1039 × 1425 dan berasal dari `adaptive-roi-v1`; preprocessing
upstream meregangkannya menjadi persegi. Ini mengubah rasio geometris dan
merupakan domain shift nyata. Upstream juga menormalkan tangan kanan dengan
mirror agar tampak sebagai tangan kiri. Integrasi offline hanya melakukan mirror
saat metadata manifest menyatakan `hand_group=right`, lalu membalik koordinat
hasil kembali ke ROI asli.

Klaim upstream `val_fg_dice=0.8098` dicatat sebagai metadata, bukan hasil yang
telah direplikasi Metemu. Dataset validasi upstream tidak tersedia untuk audit
independen.

## Kebijakan postprocessing

Implementasi tidak melakukan enhancement, threshold logits tambahan, closing,
atau penggabungan segmen. Ia memakai `argmax`, union kelas foreground,
skeletonisasi per kelas, dan pemetaan koordinat ke ROI asli. Hasil kosong dapat
abstain. Diagnostik hanya ditulis ketika developer memberi flag eksplisit.

Keputusan awal **HOLD** sampai benchmark multi-subjek menunjukkan manfaat yang
konsisten, provenance/hak penggunaan diselesaikan, dan strategi aspect ratio
divalidasi tanpa mengubah ground truth.

## Diagnostik parity dan crop — 3C.2F

Snapshot source commit yang sama memperlihatkan dua kontrak framing:

1. `web/palmLines.js` melakukan plain bilinear resize dari crop yang diberikan
   menjadi 512 × 512.
2. Generator training melakukan MediaPipe full-hand landmark bounding box,
   rotasi fingers-up, margin 100 px, canonical handedness, lalu
   aspect-preserving black padding sebelum menyimpan training image 512 × 512.

`pipeline/hand_preprocess.py` secara eksplisit menyatakan implementasi crop asli
tidak berhasil dipulihkan dan file yang diterbitkan adalah rekonstruksi. Demo
`web/index.html` juga hanya menerima gambar/camera frame yang sudah siap dan
tidak memuat implementasi MediaPipe crop, sehingga parity crop end-to-end tidak
dapat dibuktikan dari repository tersebut.

Empat positive control resmi berukuran 512 × 512 menghasilkan raw-mask union
IoU 0,752–0,811 terhadap support garis pada published overlay, coverage
0,843–0,899, dan precision 0,862–0,893. Ini mendukung parity inference secara
kuat, tetapi tidak pixel-identical; published overlay bukan ground truth manusia
dan script pembuat overlay dokumentasi tidak tersedia.

Pada ROI Metemu yang sama:

- plain stretch: F1 @6 0,0402, 426 foreground argmax pixels;
- black letterbox diagnostic control: F1 @6 0,3454, 3.598 foreground argmax
  pixels, tetapi 647 centerline fragments;
- baseline JavaScript: F1 @6 0,5135.

Letterbox menunjukkan framing adalah penyebab besar, tetapi tidak membuktikan
solusi final. Ground truth Metemu berisi lima polyline partial tanpa label kelas,
sedangkan model hanya memprediksi tiga kelas. Evaluasi tetap class-agnostic dan
tidak boleh dipakai untuk menghitung akurasi semantik.

## Full-hand dan graph tracing — 3C.2G

Pada black-letterbox pilot, enam connected components mask berubah menjadi 27
skeleton components. Skeleton 531 piksel memiliki 339 junction pixels, 33
endpoints, dan 794 graph edges. Tracer menghasilkan 647 path, tetapi jumlah
panjang graph dan seluruh path identik; tidak ada edge yang hilang atau ditolak.
Fragmentasi terutama berasal dari skeleton morphology yang menghasilkan banyak
junction 8-neighbor, lalu tracer memecah graph pada setiap node non-degree-2.

Geometric pixel-proximity agreement raw mask @6 adalah coverage 0,4301,
precision 0,4200, harmonic 0,4250. Hasil polyline length-weighted pada toleransi
yang sama adalah coverage 0,2820, precision 0,4457, F1 0,3454. Keduanya bukan
metrik identik dan tidak disebut Dice, tetapi menunjukkan konversi centerline
menurunkan cakupan anotasi.

Tujuh foto sumber dengan fingerprint exact ditemukan pada dua kelompok subjek.
Full-source letterbox menghasilkan output pada 7/7, tetapi tidak satu pun
menghasilkan kelas head-line; sebagian besar hanya menghasilkan satu kelas.
Foto sumber memiliki orientasi yang berbeda dan landmark historis tidak
disimpan, sehingga kontrol ini bukan replika full-hand crop upstream dan tidak
diberi F1. Pipeline crop berbasis 21 landmark, inverse transform, canonical
mirror, padding, dan komposisi source→model tersedia untuk ekspor berikutnya.

MediaPipe Python tidak ditambahkan: dry-run versi 1.2.0 akan memasang
`opencv-contrib-python` 5.0 di samping `opencv-python-headless` 4.11 production
experiment. Risiko ABI/package collision tidak layak hanya untuk memulihkan
landmark historis. Landmark sebaiknya diekspor eksplisit dari evaluator browser
yang sudah memakai MediaPipe Tasks Vision.
