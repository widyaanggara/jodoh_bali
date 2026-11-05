# Integrasi Palintangan Ramalan Otonan — G6B.3-R1

Tanggal: 2 November 2026, WITA. Worktree: `C:\Project-Trispark\jodoh_bali_samyoga`. Branch: `feat/samyoga-group`. HEAD tetap `3e568b768beb73c445e32db89a9672415e0e7949`.

**READY FOR INTERNAL REVIEW.** Integrasi teknis siap diperiksa secara internal; validasi budaya dan aktivasi produksi tetap **HOLD**. Ini bukan pengesahan rekomendasi jabatan atau kemampuan seseorang.

## 1. Audit dan satu sumber perhitungan

- Mesin aktual: [`getBalineseDate(date, birthTime)`](../lib/balinese-calendar.ts#L59), yang memakai tanggal sipil dan batas hari 06.00. Sebelum 06.00 digunakan hari kalender sebelumnya.
- Lintang diperoleh melalui [`findLintang(saptawara, pancawara)`](../lib/balinese-calendar.ts#L226). Kombinasi Sapta/Panca dicocokkan terhadap `dataLintang`, bukan rumus Lintang baru.
- Master nama, label, makna, dan karakter adalah [`dataLintang`](../lib/data.ts#L518), 35 record. Tipe `Lintang` berada di [`lib/types.ts`](../lib/types.ts#L13); hasil `BalineseDate` memiliki properti `lintang`.
- `lib/otonan-logic.ts/findMasehiDates` merupakan pencarian tanggal balik, bukan mesin utama pembentukan karakter Lintang.
- Pemakaian UI berada di [`app/ramalan-otonan/page.tsx`](../app/ramalan-otonan/page.tsx): perhitungan, tampilan nama/label/makna/penjelasan, dan tanggal untuk chart existing.

Mesin sudah murni dan dapat digunakan langsung. Tidak diperlukan pemindahan formula dari UI. Adapter bersama `lib/otonan-calendar.ts` memvalidasi tanggal menggunakan parser civil-date G2 dan waktu `HH:mm`, kemudian memanggil `getBalineseDate`. Ramalan Otonan dan Samyoga memanggil adapter yang sama. Formula, anchor, Wariga, Samyoga pasangan, dan master tidak diubah atau diduplikasi.

### Bug input tanggal yang ditemukan

UI Otonan sebelumnya menggunakan `new Date("YYYY-MM-DD")`, yang menafsirkan input sebagai UTC. Reproduksi aktual untuk `2005-07-27`, `12:00`:

| Timezone | Jalur UI lama | Adapter civil-date bersama |
| --- | --- | --- |
| Asia/Makassar | Tiwa-tiwa | Tiwa-tiwa |
| America/Los_Angeles | Jongsarat | Tiwa-tiwa |

Perbaikan terbatas pada parsing input UI. Input tanggal ke label dan chart Pal Sri Sedana juga menggunakan civil-date; formula chart tidak berubah. Kesalahan input ditangani sebelum perhitungan. Zodiak existing tetap merupakan bagian terpisah dari UI Otonan dan tidak dipakai dalam analisis posisi Samyoga.

## 2. Kontrak profil dan mapping

`createSamyogaPalintanganProfile(member)` menghasilkan ID anggota stabil, identitas master Sapta/Panca, nama Lintang, label, makna, **teks karakter asli**, referensi master, daftar evidence support/caution, konteks pembatas, dan informasi boundary. Status provenance tetap `missing`, review budaya `pending`, interpretasi `experimental`.

Tidak ada classifier substring. Mapping harus cocok dengan identitas master, nama Lintang, field `penjelasan`, kutipan lengkap, dan ID assertion dalam allowlist eksperimen. Perubahan teks yang tidak cocok tidak memperoleh mapping pengganti.

| Lintang | Assertion existing | Dimensi | Hasil saat ini |
| --- | --- | --- | --- |
| Tiwa-tiwa — Buda/Kliwon | C-COMM-03 | communicating, support | Leader parsial; bukan kandidat Ketua |
| Begoong — Saniscara/Umanis | C-COMM-04 | communicating, caution | `caution_only`; tidak dianggap support positif |
| Kukus — Soma/Paing | C-EXEC-04 | executing, support | Operasional terpenuhi dalam lingkup eksperimen terbatas |
| 32 identitas lain | Tidak ada assertion Palintangan dalam allowlist | Belum ditetapkan | Karakter asli tersedia, posisi belum dapat ditentukan |

Inventaris lengkap 35 identitas, karakter, dasar tekstual, kemungkinan dimensi, caution, dan ambiguitas ada di [inventaris Palintangan](samyoga-palintangan-inventory-g6b3r1.md). Semua 35 kutipan diperiksa identik dengan master. Catatan kemungkinan mapping pada inventaris adalah **draft review yang tidak aktif**, bukan evidence baru atau persetujuan budaya.

### Evaluasi aturan profil existing

| Profil | Syarat tetap | Cakupan Palintangan saat ini |
| --- | --- | --- |
| Leader | directing AND communicating AND collaborating | Hanya communicating; tidak dapat terpenuhi |
| Manajemen | planning AND managing | Kedua dimensi belum memiliki mapping support; tidak dapat terpenuhi |
| Operasional | executing | Kukus memenuhi indikator awal, bukan bukti kompetensi |
| Koordinator | Belum ada kontrak memadai | Tetap belum dapat ditentukan |
| Wakil Ketua | Kebijakan terpisah belum disetujui | Tetap `null` |

Counterexample konkret: Tiwa-tiwa mempunyai dukungan komunikasi tetapi tidak boleh dinaikkan menjadi Leader tanpa directing/collaborating. Gajah mempunyai narasi pergaulan tetapi inventaris draft tidak otomatis menjadi evidence kolaborasi. Kelompok yang sebelumnya menghasilkan dua kandidat melalui indikator multi-kalender tidak lagi menghasilkan kandidat Leader pada mapping Palintangan yang tertutup ini.

Usulan review berikutnya: kurasi assertion Palintangan per dimensi beserta konteks dan provenance terlebih dahulu, kemudian putuskan apakah syarat profil perlu direvisi secara eksplisit. Tidak ada syarat yang dilonggarkan pada implementasi ini. Tidak ada jumlah tag/evidence atau skor arbitrer untuk mengukur kekuatan seseorang.

## 3. Integrasi dua tingkat dan perubahan perilaku G6B.3

Tingkat pertama menggunakan Palintangan saja. Versi eksperimen: `g6b3r1-palintangan-only-v1`. Indikator Wewaran/Wuku dari jalur multi-indikator lama tidak lagi menentukan profil posisi.

Tingkat kedua tetap menggunakan gerbang **Leader AND dukungan Samyoga**. Mayoritas percobaan tetap `2 × Utama > jumlah anggota − 1` (minimum 2/2/3/3 untuk kelompok 3/4/5/6). Ini kebijakan eksperimen yang belum disahkan sebagai aturan budaya. Comparator Otonan tetap UNKNOWN; jumlah Utama tidak dapat menyelesaikan ketidaktersediaan pembanding. Tidak ada ranking atau Ketua/Wakil yang dipaksakan.

Dengan tiga mapping sekarang, **tidak ada profil Leader lengkap dan tidak ada kandidat Ketua**. Kontrak beberapa kandidat tetap dipertahankan, tetapi kasus beberapa kandidat dari baseline lama diuji pada arsip baseline, bukan diklaim sebagai keluaran Palintangan saat ini.

Baseline G6B.3 sebelum perubahan disimpan sebagai `lib/samyoga-position-experiment-baseline-g6b3.ts`, identik setelah normalisasi line ending dan newline akhir. Tes perilaku baseline lama tetap tersedia dan mengimpor arsip tersebut. Runtime tidak mengimpornya.

## 4. Contoh aktual dan UI

Fixture berikut berasal dari mesin kalender aktual dan pencarian identitas, bukan data orang atau tanggal yang dikarang untuk laporan:

| Tanggal, waktu | Hasil mesin | Hasil percobaan |
| --- | --- | --- |
| 2005-07-27, 12:00 | Tiwa-tiwa, Buda/Kliwon | Komunikasi; Leader parsial; konteks sensitivitas tetap ditampilkan |
| 2005-08-08, 12:00 | Kukus, Soma/Paing | Operasional dalam lingkup executing terbatas |
| 2005-08-27, 12:00 | Begoong, Saniscara/Umanis | Caution komunikasi saja; tidak diposisikan sebagai support |
| 2005-08-28, 12:00 | Gajah, Redite/Paing | Karakter asli tampil; tidak ada assertion posisi yang diaktifkan |

Panel existing menampilkan nama anggota, nama Lintang, Sapta/Panca, label/makna, karakter asli lengkap, status profil, dimensi support/belum tersedia, caution, dua gerbang Ketua, dan label Eksperimental. Disclosure native menampilkan referensi master, cakupan profil, kutipan evidence, alasan, batas interpretasi, serta status sumber/review.

Untuk profil yang belum terpenuhi ditampilkan: **“Belum cukup dasar untuk merekomendasikan posisi dari indikator Palintangan yang tersedia.”** Tidak dipaksakan satu posisi untuk semua anggota. Penghitungan ulang/reset dan disclosure keyboard tetap berjalan.

## 5. File dan penyelamatan perubahan lokal

Awal pekerjaan: 3 file tracked termodifikasi dan 9 file untracked milik G6B.3. Seluruhnya dipertahankan; G6B.3 belum mempunyai checkpoint commit tersendiri. Fingerprint SHA-256 dibuat atas seluruh 117 file yang telah tersedia (108 tracked + 9 untracked).

File baru R1:

1. `lib/otonan-calendar.ts` — adapter input bersama ke mesin existing.
2. `lib/samyoga-palintangan.ts` — proyeksi karakter asli dan referensi master.
3. `lib/samyoga-palintangan-experiment-rules.ts` — allowlist tiga assertion dan cakupan profil, tanpa mengubah syarat lama.
4. `lib/samyoga-position-experiment-baseline-g6b3.ts` — arsip baseline lokal yang tidak dipanggil runtime.
5. `tests/samyoga-palintangan.test.mjs` — kesetaraan, mapping, kelompok, invariansi, dan timezone.
6. `tests/otonan-palintangan.test.mjs` — regresi mesin/adapter dan reproduksi parsing tanggal lama.
7. `docs/samyoga-palintangan-inventory-g6b3r1.md` — inventaris seluruh master dan draft review.
8. `docs/samyoga-palintangan-integration-g6b3r1.md` — laporan ini.

Enam file berubah dibanding kondisi awal sesi:

- `app/ramalan-otonan/page.tsx` — adapter civil-date dan penanganan invalid; lint cleanup kecil tanpa perubahan teks render.
- `lib/samyoga-position-experiment.ts` — sumber Palintangan saja, metadata/cakupan, status caution-only.
- `components/samyoga-group/SamyogaGroupPositionExperiment.tsx` — profil asli, konteks, coverage, dan disclosure.
- `tests/samyoga-position-experiment.test.mjs` — regresi lama diarahkan ke arsip baseline.
- `tests/samyoga-position-experiment-ui.test.mjs` — ekspektasi evidence/Lintang baru.
- `tests/fixtures/samyoga-position-browser-smoke.mjs` — kesetaraan UI Otonan–Samyoga, viewport, reset, dan gate.

**111 dari 117 file awal tetap identik byte-for-byte**, termasuk kalender, synergy, G2, master, evaluator/approval produksi, gate server, dokumen evidence dan review sebelumnya. `package.json`/lockfile, Netra-Hasta, Python, Docker, dan Firebase tidak diubah.

## 6. Hasil pengujian nyata

| Pemeriksaan | Hasil |
| --- | --- |
| Tes baru Palintangan 15 + Otonan 5 | 20/20 lulus |
| `node --test tests/samyoga-*.test.mjs tests/otonan-palintangan.test.mjs` | 258/258 lulus; Samyoga 253 + Otonan 5, tanpa fail/skip |
| Baseline G6B.3 yang dipertahankan | 22 tes engine arsip + 4 tes integrasi UI lulus dalam suite di atas |
| 35 Lintang × waktu 05:59, 06:00, 12:00 | Sama dengan mesin sumber; karakter asli sama |
| Asia/Makassar dan America/Los_Angeles | Hasil profil deterministik; bug parsing UI lama berhasil direproduksi |
| Kelompok 3–6, perubahan nama, permutasi, invalid input/graf stale | Lulus; tidak mengubah profil individual karena nama/urutan/jumlah anggota |
| TypeScript `npx.cmd tsc --noEmit --incremental false` | Lulus |
| ESLint file terkait | Lulus; tanpa error/warning pada pemeriksaan terpilih |
| Production build Next.js 16.1.6 Turbopack | Lulus, termasuk TypeScript dan halaman kelompok/Otonan |
| `git diff --check` | Lulus |
| Integritas master/deskripsi/arsip | 35/35 kutipan sama; arsip baseline sama setelah normalisasi newline; 111 file awal tidak berubah |

Smoke browser Chrome nyata melalui CDP:

- Development ON: kelompok 3/4/5/6, nama dan karakter Lintang tepat sesuai engine, disclosure Enter/Space, reset, viewport 1440/390/320 tanpa overflow.
- Production OFF: HTTP 200, kelompok 3 dan 6 tetap berfungsi; panel eksperimen tidak muncul walaupun environment flag bernilai `1` dan query dicoba.
- Pada kedua mode, halaman **Ramalan Otonan aktual** diuji di timezone browser Los Angeles: input Tiwa-tiwa di atas menghasilkan nama dan karakter sama dengan Samyoga, lalu reset berhasil.
- Tidak ada uncaught exception atau request data pribadi Samyoga yang teramati pada harness. Development memakai mirror sementara dengan Webpack agar tidak mengganggu dev server pengguna; production memakai build aktual worktree melalui `next start`.
- Ini pengujian browser otomatis dan emulasi ukuran viewport, bukan pengujian manual perangkat mobile fisik. Profil browser, mirror, dan proses server milik tes dibersihkan; dev server pengguna tidak dihentikan.

Menjalankan ulang:

```powershell
node --test tests/samyoga-*.test.mjs tests/otonan-palintangan.test.mjs
npx.cmd tsc --noEmit --incremental false
npm.cmd run build
node tests/fixtures/samyoga-position-browser-smoke.mjs development
node tests/fixtures/samyoga-position-browser-smoke.mjs production
```

Untuk review manual internal, set `$env:SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT = "1"` sebelum menjalankan development server. Restart server milik developer secara manual bila diperlukan. Tanpa flag ini panel default OFF; production tetap OFF apa pun nilai flag.

## 7. Bukti isolasi, privasi, dan gate

- Gate server existing tidak berubah: `import "server-only"`, `NODE_ENV === "development"` AND `SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT === "1"`. Tidak menerima argumen/query/storage sebagai approval.
- Registry evidence produksi dan rules posisi produksi tetap `Object.freeze([])`. Tidak ada aktivasi approval atau evidence yang diangkat menjadi verified/approved.
- Jalur analisis posisi tidak mengimpor atau memakai fungsi/output Zodiak untuk eligibility, ranking, tie-break, ataupun penjelasan. Master `data.ts` masih mempunyai export aplikasi lain; keberadaan export Zodiak yang tidak dipakai bukan bukti pemakaiannya dalam algoritma posisi.
- Tidak ada dependency, request, penyimpanan, endpoint, atau analytics baru. Adapter dan analisis berjalan lokal.
- **Batas klaim privasi:** halaman Otonan existing sudah memanggil `logActivity`; perilaku logging tersebut tidak dihapus atau diperluas. Harness memblokir HTTPS eksternal sehingga nol request log yang teramati bukan bukti penghapusan seluruh logging aplikasi. Audit ini tidak menyatakan Firebase existing telah dinonaktifkan.

## 8. Status akhir dan risiko

Git terhadap HEAD tetap: **4 tracked modified, 17 untracked, tidak ada staged**. Tiga perubahan tracked G6B.3 sebelumnya tetap ada; perubahan tracked tambahan hanya halaman Otonan. Delapan file R1 baru ditambahkan di atas sembilan file untracked awal. Tidak dilakukan commit, push, merge, reset, clean, atau switch branch.

Risiko utama ialah keterbatasan evidence, bukan kegagalan integrasi: hanya tiga mapping dan belum ada validasi budaya/provenance. Leader/Manajemen serta kandidat Ketua belum dapat dihasilkan oleh katalog Palintangan sekarang. Draft 35 Lintang harus direview manusia sebelum dapat menjadi assertion runtime; ambang mayoritas, aturan profil, comparator kekuatan Otonan, dan kebijakan Wakil tetap memerlukan keputusan tersendiri.

**READY FOR INTERNAL REVIEW** untuk kesetaraan engine dan UI beta internal. **Produksi tetap nonaktif; tidak ada klaim kompetensi, kesehatan, karakter ilmiah, atau penetapan jabatan.**
