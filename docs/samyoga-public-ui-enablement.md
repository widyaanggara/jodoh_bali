# Samyoga — Public UI Enablement

5 November 2026, WITA. Worktree `C:\Project-Trispark\jodoh_bali_samyoga`, branch `feat/samyoga-group`.

**Enablement lokal: PASS. Publikasi/deployment: HOLD untuk triase dan perbaikan dependency security.** Perubahan belum di-push atau di-deploy.

## 1. Baseline dan penyebab panel tersembunyi

HEAD awal/akhir `3e568b768beb73c445e32db89a9672415e0e7949`. Git awal diperiksa langsung: **7 tracked modified, 36 untracked, 0 staged**. Seluruh perubahan sebelumnya dipertahankan, termasuk penghapusan tombol kembali ke pasangan.

Route sebelumnya memilih client eksperimental hanya jika `isSamyogaPositionExperimentEnabled()` true: NODE_ENV harus development dan `SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT` harus tepat `1`. Production selalu memilih client tanpa slot rekomendasi sehingga menampilkan placeholder belum diaktifkan.

Gate tersebut merupakan pembatas tampilan. Ia berbeda dari resolver, registry evidence dan approval gate evaluator produksi.

## 2. Cara enablement baru bekerja

Route `/pawongan-sinergi/kelompok` sekarang langsung merender `ExperimentalSamyogaGroupClient` pada development maupun production. Client ini mengirim slot panel yang memakai evaluator anggota existing; tidak ada engine atau aturan baru.

Tidak ada syarat environment, query parameter, localStorage atau input tambahan. Ketika hasil analisis tersedia, panel tampil untuk semua anggota. Fallback pada shared `SamyogaGroupResults` tetap ada untuk pemanggil tanpa slot; route pengguna sekarang selalu mengirim slot sehingga pesan belum diaktifkan tidak muncul.

Helper gate internal lama dipertahankan sebagai arsip, tetap restrictive dan tidak lagi diimpor route/runtime kelompok. Approval gate lain tidak disentuh. Nama file client tetap Experimental untuk menegaskan status evaluator, bukan membatasi environment.

Label UI menjadi **Beta · Eksperimental**. Disclaimer evaluator tetap utuh: interpretasi simbolis, bukan pengukuran kompetensi/penetapan jabatan, belum divalidasi ahli. Badge anggota, kandidat Ketua simbolis, Lintang asli, dropdown alasan dan status anggota belum spesifik tetap sama.

## 3. File yang diubah

| File | Perubahan |
| --- | --- |
| `app/pawongan-sinergi/kelompok/page.tsx` | Merender client dengan rekomendasi tanpa kondisi environment |
| `components/samyoga-group/ExperimentalSamyogaGroupClient.tsx` | Komentar batas presentasi publik dan status eksperimen |
| `components/samyoga-group/SamyogaGroupPositionExperiment.tsx` | Menghapus kata internal dari label Beta; kartu tidak diubah |
| `lib/samyoga-internal-beta.server.ts` | Komentar helper historis; logika lama tidak diubah |
| `tests/samyoga-position-experiment-ui.test.mjs` | Memverifikasi default route pada dev/prod dengan flag absent/0/1 serta gate historis tetap terpisah |
| `tests/fixtures/samyoga-position-browser-smoke.mjs` | Browser dev/prod sama-sama memeriksa panel, tanpa flag dan tanpa query |
| `docs/samyoga-final-review-g6b7.md` | Catatan bahwa produksi OFF merupakan hasil historis; tautan status terbaru |
| `docs/samyoga-public-ui-enablement.md` | Laporan ini |

Engine Otonan/Palintangan/Samyoga, master, 36 mapping, threshold mayoritas Utama, algoritma kandidat Ketua, kebijakan Wakil/Koordinator, evaluator, registry dan approval gate tidak diubah. `package.json`/lockfile juga tidak diubah.

## 4. Hasil pengujian tanpa flag

| Pemeriksaan | Hasil |
| --- | --- |
| Unit/regression Samyoga + Otonan | **310/310 PASS** |
| TypeScript noEmit, incremental false | PASS |
| ESLint route/komponen/modul/tes terkait | PASS |
| Production build lokal tanpa flag | PASS, route kelompok tersedia |
| Chrome development tanpa flag | PASS, delapan alur |
| Chrome production lokal tanpa flag | PASS, delapan alur |
| 3/4/5/6 anggota | 3/6/10/15 pasangan; rekomendasi tampil langsung |
| Alasan posisi dan Tafsir Tradisional | Default tertutup, state independen, Enter/Space PASS |
| Reset dan analisis baru | PASS, tiga anggota kosong; tidak ada hasil/disclosure tertinggal |
| Viewport 320/390/1440 | PASS, tidak ada horizontal overflow |
| Output posisi/kategori/Mod5/Mod16 | Cocok dengan engine aktual |
| Civil-date/batas 05:59–06:00/timezone | Regression PASS; parity Otonan browser Los Angeles PASS |
| Rendering | Nol uncaught exception; panel/placeholder sesuai keputusan baru |

Harness menghapus flag dari environment child server setelah pemuatan konfigurasi development dan membuka URL tanpa query. Kedua run mencatat `internalFlagPresent:false`, `query:""`. Kasus tambahan mencakup kandidat tunggal/jamak, belum spesifik, caution/disputed dan nama panjang.

Bukti lokal, di-ignore Git:
- [Development desktop](../coverage/samyoga-public-ui/after-multiple-profiles-w1440.png).
- [Production mobile](../coverage/samyoga-public-ui/production-public-on-w390.png).
- [Alasan production](../coverage/samyoga-public-ui/production-management-reason-w390.png).
- [Tafsir production](../coverage/samyoga-public-ui/production-pair-traditional-w390.png).
- [Indeks development](../coverage/samyoga-public-ui/after-screenshots.json) dan [production](../coverage/samyoga-public-ui/production-screenshots.json).

## 5. Hasil evaluator dan approval tetap identik

Snapshot sembilan kelompok menggunakan input kalender aktual yang sama:
- [Sebelum](../coverage/samyoga-public-ui/evaluator-before.json).
- [Sesudah](../coverage/samyoga-public-ui/evaluator-after.json).
- SHA-256 keduanya `09b45ed7eb0edf2d6573bb57708c5c6f32a14702644d3fe1a9c09dee9afc9c20`.

Tidak ada perbedaan byte/output evaluator. Tes helper tetap menelusuri alasan ke evidence aktual pada 420 fixture tanggal/seluruh 36 mapping. Tidak ada perubahan provenance, cultural review, product approval atau eligibility.

Registry evidence dan rules posisi produksi tetap kosong/frozen. Tidak ada pemanggilan sandbox sintetis dari jalur pengguna. Keputusan ini hanya menampilkan evaluator eksperimental existing kepada pengguna; tidak menyatakan ia lolos approval produksi budaya. Koordinator/Wakil belum tersedia; kandidat Ketua tidak menjadi penetapan jabatan.

## 6. Privasi dan pesan konsol existing

Tidak menambahkan request, storage, logging sensitif atau dependency aplikasi. Jalur kelompok tidak memanggil logActivity/Firestore. Harness tidak menemukan request berisi nama/tanggal fixture kelompok. Network eksternal selain font statis diblokir selama smoke test.

Firebase bootstrap existing menghasilkan Failed to fetch karena blokir harness; saat kontrol Ramalan Otonan dipakai, logger Firestore existing dan grafik Recharts juga menghasilkan pesan konsol. Ini tetap dicatat, tidak disembunyikan. Tidak ada uncaught exception atau error rendering panel baru. Nol request tanggal yang tertangkap harness tidak berarti semua fitur aplikasi bebas logging; jalur logging Otonan existing tetap ada dan tidak diubah.

## 7. Blocker keamanan dependency sebelum publikasi

`npm audit --json` dan `npm audit --omit=dev --json` dijalankan read-only ke registry npm. Exit code 1 berarti temuan vulnerability, bukan kegagalan menghubungi registry.

| Cakupan | Critical | High | Moderate | Low | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Seluruh dependency | 3 | 13 | 4 | 3 | 23 |
| Dependency production | 3 | 6 | 2 | 2 | 13 |

Angka adalah entri paket rentan menurut npm audit, bukan jumlah CVE unik. [Audit lengkap](../coverage/samyoga-public-ui/npm-audit.json) dan [audit production](../coverage/samyoga-public-ui/npm-audit-production.json) disimpan lokal/ignored.

Tiga paket ditandai critical oleh npm:

| Paket terpasang | Jalur dependency | Bukti advisory |
| --- | --- | --- |
| `next@16.1.6` | Dependency langsung | Termasuk range terdampak advisory RCE Windows; ini salah satu dari beberapa advisory yang dilaporkan. [Maintainer Next.js](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) |
| `protobufjs@7.5.4` | firebase → firestore → grpc/proto-loader | Versi terdampak code execution melalui definisi protobuf; npm/GitHub Reviewed menandai critical, halaman upstream menyebut high. [Maintainer protobufjs](https://github.com/protobufjs/protobuf.js/security/advisories/GHSA-xq3m-2v4x-88gg) |
| `websocket-driver@0.7.4` | firebase → database → faye-websocket | Versi terdampak korupsi pesan melalui header panjang protokol. [Maintainer websocket-driver](https://github.com/faye/websocket-driver-node/security/advisories/GHSA-xv26-6w52-cph6) |

Belum dilakukan uji eksploitasi; keterjangkauan tiap advisory bergantung platform, fitur dan jalur runtime. Temuan tidak membuktikan setiap CVE dapat dieksploitasi pada deployment tertentu, tetapi cukup untuk **HOLD publikasi sampai triase/perbaikan dan regression security selesai**. Audit npm menawarkan update Next; pemilihan versi serta perubahan dependency harus menjadi pekerjaan terpisah. Tidak menjalankan npm audit fix atau instalasi dependency.

Risiko domain tetap: mapping budaya/provenance belum diverifikasi ahli, comparator UNKNOWN, dan rekomendasi simbolis bukan kompetensi/jabatan nyata. Build lulus tidak menghapus risiko tersebut.

## 8. Git akhir dan cara menjalankan

Branch/HEAD tetap. Git akhir: **7 tracked modified, 37 untracked, 0 staged**. Satu file baru pada sesi ini adalah laporan ini; perubahan lainnya merupakan edit terhadap file lokal yang sudah tersedia. Screenshot, audit npm dan snapshot berada dalam coverage ignored, tidak di-stage.

Development biasa: `npm.cmd run dev`. Production lokal: `npm.cmd run build`, lalu `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3020`. Buka `/pawongan-sinergi/kelompok`, isi anggota dan lakukan analisis. Tidak perlu flag atau query.

Tidak ada commit, push, merge, reset, clean, restore, switch branch, deployment atau perubahan konfigurasi server. Status produksi OFF pada laporan G6B.7 dipertahankan sebagai catatan historis; implementasi lokal terbaru sudah menampilkan rekomendasi di production build.
