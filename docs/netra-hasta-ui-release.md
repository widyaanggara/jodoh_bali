# Netra Hasta: rilis UI/UX terisolasi

Kandidat disiapkan dari origin/main 5c137e7d2930b421ec46c90f666e12daf4c497c0, 8 November 2026. Patch hanya UI/UX dan batas hasil login; bukan aktivasi logging otomatis/statistik/riset.

## Kontrak produk

Tanggal lahir (jam opsional), persetujuan kamera, capture, lalu hasil di bawah kamera pada halaman yang sama. Hasta Rekha default; picker mode disembunyikan hanya pada productMode, implementasi Face Tracking tetap ada. Otonan publik, pasangan dan status/editor Rekha terkunci dengan skeleton blur sampai server memverifikasi sesi Firebase existing. Placeholder tidak memuat hasil asli di DOM. Pratinjau lokal tertutup default. Retake/reset membersihkan buffer; pindah tab browser mempertahankan hasil tetapi menghentikan kamera. Refresh, keluar halaman atau tab dibuang browser masih dapat menghapus memori.

POST /api/netra-hasta/detail: same-origin, sesi diverifikasi requireNetraIdentity, empat field data lahir/rentang, payload maksimal 4096 byte, private/no-store. Tidak menerima gambar, ROI, koordinat atau UID pilihan client. Hasil hanya diterima untuk UID/capture/input/request aktif dan sesi belum kedaluwarsa. Endpoint tidak menyimpan database. Login ulang dapat membuka capture yang sama. Ini batas akses endpoint/presentasi, bukan DRM atas algoritma yang memang publik pada fitur lain atau citra milik pengguna yang diproses lokal.

Tidak ada perubahan aturan budaya, threshold, ROI, dark-ridge-v1, auth provider, schema/rules history atau dependency. Save history tetap tindakan eksplisit dengan persetujuan; penandaan manual tidak disimpan sebagai data biometrik. Automatic semantic Rekha masih unsupported. Implementasi server/client/data yang sudah ada di main tetap menjadi dependency.

## Isolasi

NetraHastaFlow pada patch tidak mengimpor SessionProvider, tidak memanggil logger dan tidak memuat notice logging otomatis. SessionProvider, lib/session.ts, firebase/app.js, firebase/firestore.rules, dashboard statistik, deployment config, package/lockfile, kedua hook landmarker yang sudah diperbaiki di main, serta release gate tetap byte-identik dengan base main. Eksperimen N9-N11 dan log debug tidak masuk patch.

## Pengujian

Pada kandidat main + patch: 84 unit/regression test lulus, termasuk dua release gate yang tidak diubah; TypeScript, ESLint delta dan production build lulus menggunakan lockfile main (Next.js/eslint 16.4.5, Firebase 12.19.0). Browser standalone production: 9 pemeriksaan UI, 14 pemeriksaan alur/kamera sintetis, regresi editor Rekha manual/pointer/overlay/cleanup, serta 15 pemeriksaan Auth/Firestore Emulator lulus. Anonymous/forged detail ditolak, login membuka hasil tanpa kehilangan capture, expiry mengunci, relogin membuka, owner save/list/open/delete dan deny UID lain lulus. /dev tidak tersedia; worker MIME JavaScript.

Mesin validasi memakai Node 22.23.4 pada Windows. Docker main tetap Node 24; Docker/Linux dan webcam fisik pada kandidat belum diuji. Tidak ada data atau kredensial production dipakai. Uji kamera adalah stream canvas/piksel sintetis dan bukan bukti landmark manusia/klasifikasi empat garis.

## Mengulang tes

1. npm ci (versi dari lockfile main; jangan menyalin node_modules branch pengembangan).
2. npm run build; npx tsc --noEmit; node --test tests/*.test.mjs. Jalankan ESLint pada file patch.
3. Mulai Chrome terisolasi dengan remote debugging 9327. Untuk tes auth/history, jalankan firebase emulators:start --only auth,firestore --project daily-logs-a1442 --config firebase/netra-ui.emulator.json. Konfigurasi hanya bind loopback; nama project harus sesuai audience token fixture, tidak menghubungi instance production.
4. Jalankan server produksi di loopback port 3039 dengan NETRA_HISTORY_ENABLED=true, NETRA_HISTORY_RULES_PROJECT=daily-logs-a1442 dan preload tests/helpers/netra-loopback.cjs. Preload mengalihkan auth/Firestore ke emulator dan menolak network eksternal; hanya untuk proses tes, tidak diaktifkan dalam aplikasi.
5. Set METEMU_LIVE_BASE_URL=http://127.0.0.1:3039 lalu jalankan berurutan scripts/test-netra-ui.mjs, scripts/test-netra-single-flow-browser.mjs, scripts/test-netra-rekha-browser.mjs dan scripts/test-netra-detail-gate-browser.mjs. Jangan menjalankan tes browser bersamaan karena perpindahan tab dapat memicu lifecycle aplikasi.
6. Uji HTTPS dan webcam fisik oleh pengelola sebelum deploy. Tidak ada publish rules yang dibutuhkan khusus patch UI ini; prasyarat auth/history main tetap berlaku.

## Git

Seluruh perubahan lokal branch pengembangan tetap utuh. Kandidat adalah salinan file biasa, bukan Git worktree/branch. Patch terpisah harus diterapkan hanya pada branch PR berbasis main setelah pekerjaan lokal diamankan. Jangan stage seluruh NetraHastaFlow lokal karena masih mengandung logging otomatis. Tidak ada staging, commit, push, merge, deploy, atau publish rules selama persiapan ini.
