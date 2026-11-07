# Netra Hasta N8 — Redesign UI untuk Demo

Tanggal: 7 November 2026 (WITA).
Worktree: C:\Project-Trispark\jodoh_bali_web
Branch: feat/netra-hasta-web
Baseline HEAD: 06323e9c3108d5df195b2a344a92bc8d370575d6; working tree bersih.
Keputusan: READY FOR LOCAL DEMO. Ini bukan persetujuan deployment publik.

## Desain yang diterapkan

Skill: C:/Users/wisnu/.agents/skills/frontend-design/SKILL.md.

Token: merah Metemu #A62C21, merah gelap #7F211A, teks #292522,
kertas #FAF9F6, aksen emas #9B772F, putih #FFFFFF.
Tipografi: Playfair Display untuk judul, Plus Jakarta Sans untuk isi/kontrol,
menggunakan aset font existing. Font isi ditetapkan eksplisit hanya di Netra
karena pemeriksaan browser menemukan font sistem pada tampilan sebelumnya.

Hero berpasangan dengan ilustrasi telapak tanpa empat garis rekaan. Ilustrasi
diberi keterangan bahwa ini bukan hasil deteksi. CTA menuju form nyata; riwayat
tetap melewati autentikasi existing. Penomoran hanya dipakai untuk proses nyata
data kelahiran → pindai → hasil. Form dua kolom di desktop, satu kolom di mobile.
Panel foto, persetujuan, hasil, login, detail dan riwayat memakai bahasa visual
yang sama; warna dan teks peringatan tetap dipertahankan.

Keputusan setelah review rencana: mempertahankan warna dan font brand Metemu
alih-alih mengganti identitas seluruh aplikasi; menghindari kartu langkah
berulang, animasi dekoratif, serta ilustrasi garis yang menyerupai hasil AI.
Style berada di app/netra-hasta/netra-hasta.css dan dibatasi wrapper netra-theme.
Homepage, global CSS, Header/Footer bersama tidak diedit.

## Perilaku yang dipertahankan

- Tanggal wajib dan jam opsional, validasi civil date, batas hari 06:00.
- Kamera memerlukan persetujuan; tracking tangan/wajah existing.
- Hard/soft gate, capture manual, ROI, koordinat video/canvas, buffer cleanup,
  worker timeout/cancellation/stale protection, capture/retake/reset.
- Hasil dasar publik; detail dan riwayat tetap memerlukan verifikasi server.
- Login/daftar/logout Firebase existing, pemulihan alur ringkasan dalam memori.
- Otonan lengkap, Pal Sri Sedana, Top-3 Jodoh dari engine existing, snapshot v2
  serta pembacaan legacy v1. Tidak ada rumus atau master yang disalin/diubah.
- Simpan hanya setelah persetujuan; baca/hapus owner-only, tanpa citra/koordinat.
- Empat kelas Rekha tetap belum didukung oleh detektor browser; Beta tetap jelas.
- Pilihan mode memperoleh roving tab stop dan tombol arah/Home/End; callback
  onChange existing tetap dipakai. Ini perubahan interaksi UI, bukan tracking.

## Validasi nyata

- 59 tes regresi Node lulus (account, product, render, detail dan runtime/golden).
- TypeScript noEmit lulus; ESLint file terkait dengan max-warnings 0 lulus.
- Production build lulus; generator menyatakan worker browser tidak berubah.
- 9 pemeriksaan browser UI lulus pada development dan standalone production:
  form/error aksesibel, jam kosong, consent-before-camera, keyboard Enter/Space,
  pemilihan mode dengan tombol arah/Home, hasil dasar dan warning manual,
  reset kosong, login/daftar, reduced motion, tanpa exception/upload citra.
- Layout start, consent, basic dan login: 320/390/1440 tanpa overflow horizontal.
  Detail juga diuji pada tiga lebar tersebut oleh harness integrasi.
- 17 pemeriksaan integrasi nyata Firebase/Auth/Firestore lulus setelah redesign,
  baik development maupun standalone production. Meliputi login gagal/berhasil,
  token palsu ditolak, CSRF, akses detail, cross-UID read/update/delete ditolak,
  save/read/delete, snapshot v2/top-3 identik, consent, logout.
  Semua akun dan record sintetis dibersihkan. Tidak ada akun pengguna nyata dipakai.
- Pemeriksaan network harness: 0 payload citra/landmark, 0 kebocoran password ke
  tujuan selain Firebase, 0 pengiriman data kelahiran di luar endpoint consent-save.
- Uji fisik N8: pemilik menjawab PASS untuk rangkaian izin, tracking, capture,
  hasil dasar, ambil ulang, reset, dan mode wajah yang diminta. Ini konfirmasi
  pengguna; otomatisasi memakai fixture metadata untuk handoff dan bukan bukti
  inferensi telapak fisik. Hardware mobile terpisah belum dikonfirmasi.
- Production HTTP: /netra-hasta dan /akses-detail 200; detail/riwayat tanpa login
  307 ke akses-detail; /dev/palm-evaluation 404; worker 200 application/javascript.
- git diff --check lulus. Diff lib/, hooks/, firebase/, app/api/, package/lock,
  global CSS, Header/Footer dan worker kosong. Samyoga dan worktree AI tidak diedit.

## Screenshot lokal (di-ignore Git)

Sebelum: coverage/n8/before/
Sesudah: coverage/n8/after/

- start-1440.png dan start-390.png: hero dan form.
- login-1440.png dan login-390.png: akun.
- detail-1440.png, detail-390.png, detail-320.png: hasil detail sintetis.
- after juga memuat consent dan basic pada 320/390/1440.

Screenshot tidak memuat foto telapak/kredensial. Pengujian memblokir stylesheet
ikon eksternal Google agar Netra tetap dapat diperiksa tanpa ketergantungan
ikon remote. Akibatnya ligature Header/Footer existing bisa tampak sebagai
teks pada screenshot. Ikon kontrol Netra yang diperbarui memakai SVG lokal.
Tidak ada perubahan pada komponen Header/Footer global.

## File

Modified (19):
- app/netra-hasta/page.tsx
- app/netra-hasta/layout.tsx
- app/netra-hasta/akses-detail/page.tsx
- app/netra-hasta/detail/page.tsx
- app/netra-hasta/riwayat/page.tsx
- app/netra-hasta/riwayat/[id]/page.tsx
- components/netra-hasta/CameraStage.tsx
- components/netra-hasta/ConsentPanel.tsx
- components/netra-hasta/NetraAccountActions.tsx
- components/netra-hasta/NetraDetailSections.tsx
- components/netra-hasta/NetraHastaBasicResult.tsx
- components/netra-hasta/NetraHastaDetailView.tsx
- components/netra-hasta/NetraHastaFlow.tsx
- components/netra-hasta/NetraHistoryPanel.tsx
- components/netra-hasta/NetraLoginPanel.tsx
- components/netra-hasta/NetraSavePanel.tsx
- components/netra-hasta/PalmCapturePanel.tsx
- components/netra-hasta/PalmPreviewPanel.tsx
- components/netra-hasta/ScanModePicker.tsx

New (4):
- app/netra-hasta/netra-hasta.css
- components/netra-hasta/NetraIcon.tsx
- scripts/test-netra-ui.mjs
- NETRA_HASTA_N8.md

Akhir: 19 modified, 4 untracked, 0 staged; HEAD tidak berubah.
Tidak ada commit, push, deploy, dependency, atau Firebase rules yang diubah.

## Mengulang pengujian

Server development: http://localhost:3027/netra-hasta.
Standalone production lokal saat validasi: http://127.0.0.1:3028/netra-hasta.
Standalone disiapkan dengan salinan public dan .next/static di direktori build
yang di-ignore, menggunakan server.js existing; konfigurasi deployment tidak diedit.

Unit:
node --test tests/netra-hasta-account.test.mjs tests/netra-hasta-product.test.mjs tests/netra-hasta-product-render.test.mjs tests/netra-hasta-runtime.test.mjs tests/netra-hasta-detail.test.mjs

UI: sediakan Chrome terisolasi dengan CDP 9327; jalankan
node scripts/test-netra-ui.mjs --screenshots
METEMU_LIVE_BASE_URL dapat menunjuk server localhost berbeda.

Integrasi: harness scripts/test-netra-account-live.mjs tetap existing.
Perlu opt-in METEMU_RUN_FIREBASE_LIVE_TESTS=1, lalu --database --browser --detail.
Tes ini benar-benar membuat dan membersihkan akun/data sintetis pada Firebase;
jangan menjalankannya sebagai bagian build atau memakai data pengguna nyata.

## Masalah terbuka

Empat Rekha dan tafsir telapak belum tersedia/tervalidasi. Data sementara tetap
hilang pada refresh/background sesuai kebijakan existing yang dijelaskan UI.
Pemeriksaan viewport tidak menggantikan uji hardware mobile/screen reader nyata.
Risiko publikasi dependency dan daily_logs public-read yang dilaporkan R7 tetap
di luar perubahan UI ini; statusnya tidak dinaikkan menjadi aman/approved.
