# Netra Hasta Web — Empat Rekha untuk Demo

Tanggal: 7 November 2026 (WITA).
Web: feat/netra-hasta-web, baseline 51865e71ae40efa3755fe0edc98637cf96098d42.
AI reference read-only: feat/netra-hasta-ai, 645db93ca216d17778051b36019a1eee65409831.
Web bersih saat mulai; 10 file riset untracked pada AI dipertahankan.
Status: READY FOR LOCAL DEMO untuk alur berbantuan pengguna.
Klasifikasi otomatis empat Rekha: HOLD. Uji fisik integrasi dikonfirmasi PASS oleh pengguna pada checkpoint.

## Hasil yang benar-benar tersedia

- dark-ridge-v1 tetap memproses piksel ROI di Web Worker tanpa perubahan algoritma,
  threshold, ROI, orientasi atau koordinat.
- Segmen otomatis tetap tanpa kelas, dapat abstain/error.
- Setelah capture, editor menunjukkan ROI original dan overlay dengan koordinat
  native. Tidak ada garis awal, snapping, penyambungan, atau perpanjangan otomatis.
- Pengguna memilih salah satu Heart/Head/Life/Fate, memilih segmen yang disorot
  kuning lalu mengonfirmasi labelnya: user_confirmed / user_confirmation.
- Alternatif: tandai titik berurutan pada foto atau input koordinat piksel yang
  aksesibel keyboard, lalu terapkan: user_drawn / user_drawing.
- Label per kelas dapat dihapus atau ditandai uncertain. Tidak ada tanda bukan
  bukti garis absen. Default unsupported artinya klasifikasi otomatis belum tersedia.
- Duplikasi satu kandidat pada dua kelas ditolak. Minimal dua titik berbeda,
  bounds ROI dan batas 512 titik diperiksa. Kandidat/ROI asli tidak dimutasi.
- Hasil dasar dan Ramalan Detail menampilkan empat status serta asal hasil.
  Tidak ada penafsiran budaya atau klaim validasi ahli yang ditambahkan.
- Semua ringkasan diberi rekha-user-review-v1. Callback hanya meneruskan metadata,
  tanpa gambar, koordinat, ID kandidat, atau identitas sampel.
- Ringkasan bertahan saat worker memperbarui capture yang sama dan melalui login
  dalam tab yang sama. Capture berbeda, retake, mode switch, reset, pagehide dan
  background membersihkannya mengikuti lifecycle existing.
- Foto/koordinat hanya dimiliki editor capture, canvas dan mark dibersihkan saat
  unmount. Tidak ada ekspor atau penyimpanan otomatis.
- Database dan rules TIDAK berubah. Penandaan pengguna TIDAK ikut simpan riwayat.
  UI save/detail menjelaskan batas ini; payload riwayat tetap identik byte-for-byte
  sebelum/sesudah review. Halaman riwayat tidak menciptakan penandaan historis.

## Dasar pemilihan pendekatan

Dibaca: REKHA_R4.md, REKHA_R5.md, rekha_detector.py, rekha_r5.py,
rekha_review.py, pretrained_detector.py pada AI; product flow, ROI, quality,
runtime, worker hook, hasil dasar/detail/history pada Web.

JS existing mengekstrak dark ridges, morphology, thinning dan connected segments
hingga native ROI. Tidak ada classifier Heart/Head/Life/Fate.
R4/R5 memakai Python ONNX + OpenCV. Hasil dua subjek parsial tidak konsisten,
handedness/mirroring unresolved dan orientasi sensitif. Filter R4 juga memiliki
regresi. ONNX berkontrak input [1,3,512,512], output [1,4,512,512]:
background + Heart/Head/Life, tanpa Fate. Bobot fp16 lokal sekitar 11,3 MB.
Web tidak memiliki dependency ONNX runtime. Memindahkan bobot belum menyelesaikan
validasi, perbedaan crop atau Fate dan akan memerlukan dependency/asset/runtime baru.
Karena itu tidak diintegrasikan tanpa persetujuan. Tidak ada backend Python,
OpenCV, ONNX atau commit AI yang disalin ke Web.

Camera memakai calculatePalmRoiGeometry baseline. Penanda adaptive-roi-v1 tidak
berarti geometri identik dengan kandidat adaptive evaluator AI. Editor memakai
ROI yang benar-benar dihasilkan capture Web, tanpa recrop, canonical mirroring,
atau asumsi handedness. PNG riset dipakai tepat sebagaimana didekode, bukan dibuat
ulang menjadi crop kamera.

## Bukti pengujian

- 70 tes Node lulus: 59 existing + 11 review/geometry/source/cleanup/privacy.
- TypeScript noEmit, ESLint file terkait, production build lulus.
  Generator menyatakan public/workers/palm-line.worker.js unchanged.
- 9 pemeriksaan browser N8 lulus (form, jam opsional, consent, keyboard,
  mode, hasil dasar, reset, responsive dan reduced motion).
- Tes browser editor: worker nyata pada piksel sintetis menghasilkan 5 segmen.
  Konfirmasi, duplicate rejection, uncertain, penandaan koordinat/pointer,
  hapus label, retake, canvas zero-size cleanup dan reset lulus.
  Hasil ini menguji interaksi; label pada fixture sintetis bukan bukti akurasi.
- Editor lulus pada development dan production standalone lokal.
- Dua PNG manusia AI dibaca lokal dan didekode ke memori browser melalui CDP,
  tidak diunggah ke HTTP, tidak dimasukkan aset Web. Pipeline worker existing:
  palm-1591af27886e: 838 x 1470, 18 segmen;
  palm-b2105a2a9bbc: 1293 x 1813, 24 segmen.
  Semua kelas otomatis tetap unsupported; tidak ada label manual yang diarang
  pada citra manusia. Ini dua kelompok subjek historis, bukan holdout baru.
  Fragmentasi, lipatan terlewat dan kontur luar tetap terlihat pada hasil.
- Overlay canvas/SVG sama posisi dan ukuran pada 320/390/1440; tanpa overflow.
  Pointer mapping unit test memeriksa native pixel pada beberapa skala.
- 19 pemeriksaan Firebase live lulus pada dev dan standalone production:
  login salah/benar, server identity/CSRF/UID isolation, snapshot v2,
  consent save/read/delete/logout, status pengguna bertahan login/detail,
  dan penandaan tidak terbawa ke riwayat. Akun/record sintetis dibersihkan.
  Harness melaporkan 0 upload citra/landmark, 0 kebocoran password/birth payload,
  0 rendering exceptions.
- Production HTTP /netra-hasta 200; detail tanpa login 307; /dev/palm-evaluation
  404; worker 200 application/javascript.
- Pada pengujian otomatis implementasi, kamera tidak dapat digunakan; error UI
  ditangani. Pengujian editor memakai injeksi capture HANYA dalam skrip developer
  melalui CDP; tidak ada endpoint input/file baru pada produk.
- Pada checkpoint, pengguna mengonfirmasi PASS untuk capture webcam, overlay
  mengikuti ROI, konfirmasi Heart/Head/Life, penandaan manual Fate, handoff status
  ke Ramalan Detail, retake dan reset. Ini hasil uji fisik pengguna untuk integrasi
  Rekha ini, terpisah dari pengujian otomatis dan PASS N8 sebelumnya.
  Pengujian hardware mobile terpisah belum dikonfirmasi.
- Engine kalender/Jodoh/Samyoga, master, auth, database/rules, dependency,
  ROI/preprocessing, live tracking dan worker tidak berubah.

## Cara mencoba

Buka http://localhost:3027/netra-hasta atau standalone localhost:3028.
Isi tanggal (jam opsional), izinkan kamera, capture telapak.
Di panel Tinjau empat Rekha:
1. Pilih kelas dan segmen; lihat highlight; konfirmasi hanya bila Anda yakin.
2. Atau Tandai garis sendiri, ketuk titik mengikuti garis yang terlihat, lalu
   Gunakan penandaan. Untuk keyboard, gunakan input X/Y dan Tambah titik.
3. Jika ragu pilih Belum dapat dipastikan. Tidak ada keharusan mengisi empat garis.
4. Buka Ramalan Detail dan login. Status dan asal hasil ada pada bagian Rekha.
5. Simpan hanya jika menyetujui notice; penandaan tidak ikut riwayat.
6. Ambil Ulang/reset untuk menghapus hasil sementara.

## File berubah (17)

Modified (11):
- app/netra-hasta/netra-hasta.css
- components/netra-hasta/NetraDetailSections.tsx
- components/netra-hasta/NetraHastaBasicResult.tsx
- components/netra-hasta/NetraHastaClient.tsx
- components/netra-hasta/NetraHastaDetailView.tsx
- components/netra-hasta/NetraHastaFlow.tsx
- components/netra-hasta/NetraSavePanel.tsx
- components/netra-hasta/PalmPreviewPanel.tsx
- lib/netra-hasta/product-flow.ts
- scripts/test-netra-account-live.mjs
- tests/helpers/load-netra-typescript.mjs (mendukung import komponen .tsx pada tes)

New (6):
- components/netra-hasta/RekhaCaptureEditor.tsx
- components/netra-hasta/RekhaStatusList.tsx
- lib/netra-hasta/rekha-review.ts
- scripts/test-netra-rekha-browser.mjs
- tests/netra-hasta-rekha-review.test.mjs
- NETRA_HASTA_REKHA_WEB.md

Screenshot hanya di coverage/rekha-web/ (ignored):
- synthetic-320/390/1440.png: sumber piksel sintetis, interaksi pengguna.
- palm-1591af27886e-roi-png-320/390/1440.png: ROI manusia, kandidat tanpa kelas.
- palm-b2105a2a9bbc-roi-png-320/390/1440.png: ROI manusia kedua.
- detail-status-320/390/1440.png: hasil detail dengan metadata sintetis.

Saat implementasi selesai (sebelum checkpoint): 11 modified, 6 untracked,
0 staged pada HEAD 51865e7. Tidak ada commit/push/deploy, dependency, atau
pengaturan auth yang diubah. Checkpoint berikutnya hanya men-stage 17 file
implementasi, tes dan dokumentasi; hasil uji fisik pengguna dicatat di atas.

## Mengulang tes

Unit: node --test tests/netra-hasta-*.test.mjs
UI N8: node scripts/test-netra-ui.mjs
Editor: node scripts/test-netra-rekha-browser.mjs --screenshots
Opsional --roi <PNG lokal> untuk diagnosis read-only satu gambar.
Skrip browser memerlukan Chrome terisolasi CDP 9327; METEMU_LIVE_BASE_URL
boleh menunjuk http://127.0.0.1:3028 untuk standalone.

Firebase live hanya dengan opt-in METEMU_RUN_FIREBASE_LIVE_TESTS=1:
node scripts/test-netra-account-live.mjs --database --browser --detail --rekha
Ini membuat lalu menghapus akun/record sintetis, bukan dijalankan oleh build.

## Keterbatasan dan langkah berikut

Keempat kelas belum mempunyai klasifikasi otomatis yang andal di Web.
Fate juga tidak ada dalam model riset. Konfirmasi bukan verifikasi budaya/ahli;
pengguna dapat salah memberi label/drawing. Garis terpotong di ROI tidak dapat
dipulihkan dengan penandaan. Label satu segmen tidak menyambung lipatan terfragmentasi.
Jangan menilai jumlah segmen sebagai akurasi. Jangan menafsirkan lipatan menjadi
kesehatan, karakter atau nasib.

Prioritas berikut: review manusia terhadap label dan bukti piksel dengan subjek
lain, serta uji hardware mobile; baru evaluasi runtime/model browser atas
persetujuan dependency dan data yang memadai. Menyimpan review manual memerlukan
milestone kontrak/consent/database terpisah, bukan mengirim tambahan field ke schema v2.
Blocker publikasi dependency/logging existing dari R7 tetap belum diselesaikan.
