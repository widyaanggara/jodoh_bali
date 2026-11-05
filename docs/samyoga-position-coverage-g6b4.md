# Simulasi cakupan Palintangan — G6B.4

Tanggal: 2 November 2026 (WITA). **READY FOR MAPPING DECISION.** Angka di bawah hasil simulasi deterministik atas identitas master, bukan probabilitas kecocokan, prevalensi populasi, akurasi, atau jumlah kandidat Ketua.

## Baseline Git dan ruang lingkup

Worktree `C:\Project-Trispark\jodoh_bali_samyoga`; branch `feat/samyoga-group`; HEAD `3e568b768beb73c445e32db89a9672415e0e7949`. Worktree cwd utama tetap branch Netra-Hasta; semua artefak G6B.4 ditempatkan hanya pada worktree Samyoga tanpa switch branch.

Awal G6B.4: **4 tracked modified, 17 untracked, staged kosong**. G6B.3/R1 belum di-commit. Seluruh 125 file yang telah tersedia (108 tracked + 17 untracked) dicatat SHA-256 untuk pembandingan akhir. Tidak menimpa atau menganggap file lokal sudah menjadi checkpoint.

Audit membaca [source of truth kalender](../lib/balinese-calendar.ts), [master dataLintang](../lib/data.ts#L518), [adapter Otonan](../lib/otonan-calendar.ts), [Palintangan Samyoga](../lib/samyoga-palintangan.ts), [tiga mapping existing](../lib/samyoga-palintangan-experiment-rules.ts), katalog eksperimen dan registry produksi. Lihat [matriks 35 Lintang](samyoga-palintangan-mapping-g6b4.md) dan [review profil](samyoga-position-profile-review-g6b4.md).

## Data, status, dan definisi hitungan

- **35** identitas master unik; semua nama dan kutipan diverifikasi terhadap `dataLintang.penjelasan`.
- **3 assertion existing** tetap aktif hanya dalam beta internal G6B.3-R1: C-COMM-03, C-COMM-04, C-EXEC-04.
- **72 assertion audit draft**: 3 representasi tertaut existing + **69 draft baru**, dengan ID DRAFT-G6B4 yang tidak menjadi ID evidence produksi.
- Keputusan per assertion: **16 DIDUKUNG TEKSTUAL** (15 support + 1 caution), **21 PERLU INTERPRETASI** (13 support + 8 caution), **23 AMBIGU**, **12 TIDAK DIDUKUNG**.
- Ada **9** assertion caution draft total. Jumlah ini tidak sama dengan 33 Lintang yang memiliki caution karakter asli.
- Semua draft `active: false`, provenance `missing`, cultural review `pending`, persetujuan eksperimen `draft_pending`. DIDUKUNG TEKSTUAL bukan approval atau pembuktian kompetensi.
- Dua assertion dalam satu dimensi pada satu Lintang dihitung **satu identitas**, bukan dua dukungan independen. Seluruh assertion dalam satu record memiliki dependency group sumber yang sama.
- Simulasi tidak memakai tanggal lahir buatan, Zodiak, input kelompok, graf Samyoga, network, atau persistence.

Tiga skenario terpisah:

1. **Existing**: menggunakan tepat tiga assertion dari modul runtime existing, bukan rekonstruksi dari draft. Hasil setiap identitas dibandingkan dengan inspector runtime read-only.
2. **Draft tekstual**: hanya assertion berkeputusan DIDUKUNG TEKSTUAL. Artinya pemetaan langsung dan terbatas secara semantik, **bukan aturan baru yang aktif**.
3. **Draft interpretatif**: menambahkan PERLU INTERPRETASI sebagai batas sensitivitas hipotetis. **Tidak** memasukkan AMBIGU atau TIDAK DIDUKUNG sebagai support.

Skenario draft bukan union otomatis dengan baseline. Contohnya caution Begoong existing tetap ada pada baseline, tetapi representasinya dinilai PERLU INTERPRETASI dan tidak termasuk skenario tekstual saja. Perbedaan simulasi ini tidak menghapus caution runtime.

Profil existing dibaca dari modul existing: Leader D+C+Collab, Manajemen planning+managing, Operasional executing. Simulator mereplikasi policy konflik G6B.3-R1 untuk pembandingan bersyarat. Ini tidak mengesahkan caution draft sebagai pemblokir. Uji kontrol dimensi sintetis memeriksa aturan conflict, bukan membuat hasil kalender palsu.

## Distribusi enam dimensi

Semua sel adalah **jumlah Lintang unik**, bukan jumlah assertion atau skor. Kolom tambahan interpretatif tidak menghitung ulang Lintang yang sudah mempunyai support tekstual. Caution draft mencakup tekstual+interpretatif dan tidak menjadi penalti aktif. Ambigu hanya keputusan AMBIGU; penolakan dipisahkan.

| Dimensi | Existing support/caution | Support draft tekstual | Tambahan support interpretatif | Caution draft | Ambigu belum diterima | Usulan ditolak |
| --- | --- | --- | --- | --- | --- | --- |
| directing | 0/0 | 0 | 0 | 0 | 4 | 5 |
| planning | 0/0 | 0 | 3 | 0 | 0 | 4 |
| managing | 0/0 | 2 | 2 | 1 | 0 | 1 |
| communicating | 1/1 | 8 | 0 | 3 | 5 | 0 |
| executing | 1/0 | 5 | 0 | 2 | 3 | 0 |
| collaborating | 0/0 | 0 | 7 | 3 | 11 | 2 |

Tidak ada support directing yang diterima bahkan dalam skenario interpretatif. Planning memiliki 3 hipotesis interpretatif, managing memiliki 2 tekstual + 2 interpretatif, tetapi tidak terdapat pada identitas yang sama. Collaborating hanya 7 hipotesis prososial/keluarga, belum support tekstual kerja bersama.

## Cakupan profil existing

“Parsial saja” berarti tidak ada profil matched, ada status partial, dan tidak ada conflict. “Konflik tanpa matched” dipisahkan. “Tanpa rekomendasi” mencakup parsial, konflik, caution-only dan tidak ada mapping diterima; bukan kategori disjoint yang dijumlahkan dengan parsial. “Tanpa mapping diterima” berarti tidak ada support/caution yang masuk skenario.

| Skenario | Assertion yang masuk skenario | Leader | Manajemen | Operasional | Beberapa profil | Parsial saja | Konflik tanpa matched | Tanpa rekomendasi | Tanpa mapping diterima |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Existing aktif G6B.3-R1 | 3 | 0 | 0 | 1 | 0 | 1 | 0 | 34 | 32 |
| Draft tekstual saja | 16 | 0 | 0 | 5 | 0 | 10 | 0 | 30 | 19 |
| Draft tekstual + interpretatif (sensitivitas) | 37 | 0 | 0 | 5 | 0 | 19 | 1 | 30 | 7 |

| Skenario | Tanpa support positif | Caution-only | Operasional |
| --- | --- | --- | --- |
| Existing aktif G6B.3-R1 | 33 | 1 | Kukus |
| Draft tekstual saja | 20 | 1 | Uluku, Kuda, Kukus, Lumbung, Begoong |
| Draft tekstual + interpretatif (sensitivitas) | 10 | 3 | Uluku, Kuda, Kukus, Lumbung, Begoong |

Tidak ada identitas tanpa **usulan non-ditolak** sama sekali (0), tetapi ini termasuk hipotesis AMBIGU. Angka itu **bukan** berarti semua Lintang mempunyai mapping yang diterima. Mapping support/caution yang diterima dalam skenario existing/tekstual/interpretatif tidak tersedia pada **32/19/7** identitas.

Konteks caution ditemukan pada **33/35** record; Kukus dan Udang tidak memiliki caution eksplisit yang dicatat. Tidak ada caution bukan klaim aman. Konteks ambigu tercatat pada **35/35** record, berbeda dari **23 assertion** AMBIGU.

### Per identitas

Kolom tidak menambahkan alternatif profil; hanya tiga aturan existing yang dibekukan. Detail dimensi/caution tersedia pada output JSON CLI dan matriks mapping.

| No. | Lintang | Existing | Draft tekstual | Draft interpretatif |
| --- | --- | --- | --- | --- |
| 1 | Gajah | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 2 | Kiriman | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 3 | Jongsarat | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 4 | Tiwa-tiwa | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 5 | Sangka Tikel | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 6 | Bubu Bolong | Tanpa mapping diterima | Tanpa mapping diterima | Caution-only; tanpa rekomendasi |
| 7 | Sungenge | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 8 | Uluku | Tanpa mapping diterima | Operasional | Operasional |
| 9 | Pedati | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 10 | Kuda | Tanpa mapping diterima | Operasional | Operasional |
| 11 | Gajahmina | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 12 | Bade | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 13 | Maglut | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 14 | Pagelangan | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 15 | Kala Sungsang | Tanpa mapping diterima | Tanpa mapping diterima | Tanpa mapping diterima |
| 16 | Kukus | Operasional | Operasional | Operasional |
| 17 | Asu | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 18 | Kartika | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 19 | Naga | Tanpa mapping diterima | Tanpa mapping diterima | Caution-only; tanpa rekomendasi |
| 20 | Banyak Angrem | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 21 | Ru | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 22 | Patrem | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 23 | Lembu | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 24 | Depat | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 25 | Tangis | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 26 | Salah Ukur | Tanpa mapping diterima | Caution-only; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 27 | Prahu Pegat | Tanpa mapping diterima | Tanpa mapping diterima | Caution-only; tanpa rekomendasi |
| 28 | Puwuh Atarung | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 29 | Lawean | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 30 | Kelapa | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 31 | Yuyu | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 32 | Lumbung | Tanpa mapping diterima | Operasional | Operasional |
| 33 | Kumba | Tanpa mapping diterima | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi |
| 34 | Udang | Tanpa mapping diterima | Parsial/konflik; tanpa rekomendasi | Parsial/konflik; tanpa rekomendasi |
| 35 | Begoong | Caution-only; tanpa rekomendasi | Operasional | Operasional |

## Review alternatif dan dampak kandidat

Tidak ada kandidat Ketua yang dihitung: unit audit hanya Lintang, tanpa relasi Samyoga. Angka di bawah adalah identitas yang memenuhi pola profil alternatif hipotetis.

- **Pengelolaan Simbolis, managing inti:** 2 tekstual (Ru, Puwuh Atarung), 4 interpretatif (tambah Kukus, Kartika). Planning pendukung opsional dan tidak diklaim tersedia. Menjadi 2/4 hasil hanya bila definisi alternatif tersebut disetujui; hasil Manajemen existing tetap 0. Pada alternatif ini Kukus bisa mempunyai Operasional dan Pengelolaan sekaligus dalam sensitivitas interpretatif.
- **Komunikasi–Prososial, communicating AND collaborating:** 0 tekstual, 1 interpretatif sebelum konteks caution (Banyak Angrem); ia memerlukan review konteks pemutusan relasi. Policy konflik existing memberi 0 hasil tanpa konflik. Profil ini tidak disebut Leader dan tidak boleh menggantikan gerbang Ketua.
- Leader existing tetap 0; tidak disarankan menyamakan popularitas, berani, keteguhan atau jabatan sosial dengan directing.
- Operasional 5 pada draft berarti kecenderungan executing dengan lingkup berbeda, bukan bukti kompetensi/kualitas/ketuntasan. Kriteria executing-only tidak diubah.

Alasan konseptual, syarat minimum, false positive/negative simbolis dan batas masing-masing alternatif dijelaskan pada [review profil](samyoga-position-profile-review-g6b4.md). Tidak ada comparator baru atau ranking jumlah support. Koordinator belum mempunyai aturan; Wakil tetap tanpa kontrak alokasi; Anggota bukan fallback.

## Rekomendasi G6B.5

1. Putuskan menerima/menolak setiap ID draft dengan status produk eksplisit. Review ahli eksternal bukan prasyarat baru penyelesaian fitur; sumber belum diverifikasi tetap harus terlihat sebagai missing/pending.
2. Prioritaskan mapping tekstual berlingkup sempit; jangan menggabungkan semua tier sebagai aturan yang sudah disetujui.
3. Pisahkan persetujuan mapping support dari kebijakan caution. Jangan menjadikan sensitivitas, keraguan, atau batas relasi sebagai penalti otomatis.
4. Pertahankan Leader/Ketua belum dapat direkomendasikan jika directing tetap tanpa dasar. Jangan mengubah kontrak hanya untuk menampilkan Ketua.
5. Jika dibutuhkan, putuskan alternatif Pengelolaan Simbolis sebagai profil terpisah dengan batas konteks domestik; jangan diam-diam mengganti definisi Manajemen.
6. Pertahankan Leader AND Samyoga, mayoritas Utama sebagai eksperimen, UNKNOWN/INCOMPARABLE bukan EQUIVALENT, beberapa kandidat tanpa pemenang paksa, dan Wakil null.
7. Implementasi kelak memerlukan tes per ID, kontrak profil parsial/konflik dan invariansi identitas. Milestone ini tidak menyentuh UI, comparator, atau gate.
8. Produksi tetap mengikuti gate existing. Tidak ada aturan, evidence, maupun narasi kemampuan nyata yang diaktifkan oleh audit ini.

## Artefak dan reproduksi

Enam file baru saja; seluruh file awal dipertahankan:

1. `docs/samyoga-palintangan-mapping-g6b4.md`
2. `docs/samyoga-position-profile-review-g6b4.md`
3. `docs/samyoga-position-coverage-g6b4.md`
4. `tests/fixtures/samyoga-palintangan-mapping-g6b4.json`
5. `tests/fixtures/samyoga-palintangan-coverage-g6b4.mjs`
6. `tests/samyoga-palintangan-mapping-g6b4.test.mjs`

CLI **read-only** menulis JSON ke stdout, tidak menyimpan output otomatis:

```powershell
node tests/fixtures/samyoga-palintangan-coverage-g6b4.mjs
node --test tests/samyoga-palintangan-mapping-g6b4.test.mjs
node --test tests/samyoga-*.test.mjs tests/otonan-palintangan.test.mjs
npx.cmd eslint tests/fixtures/samyoga-palintangan-coverage-g6b4.mjs tests/samyoga-palintangan-mapping-g6b4.test.mjs
```

Validator memeriksa 35 identitas, nama/kutipan master, source refs, ID unik, tautan tiga evidence existing, enam dimensi, keputusan/jenis, kelompok dependensi dan status tidak aktif. Tes negatif menolak data hilang/duplikat, kutipan palsu, ID evidence fiktif dan aktivasi. Kesetaraan simulator dengan inspector existing diuji pada 35 identitas tanpa membuat tanggal lahir. Hasil deterministik diperiksa di Asia/Makassar dan America/Los_Angeles.

## Validasi akhir

| Pemeriksaan yang dijalankan | Hasil nyata |
| --- | --- |
| Validator identitas/kutipan/metadata draft | 35/35 identitas dan 72/72 assertion valid |
| Tes audit G6B.4 | 17/17 lulus, tanpa fail/skip |
| Regresi Samyoga + Otonan | 275/275 lulus (270 Samyoga termasuk 17 tes baru + 5 Otonan), tanpa fail/skip |
| Kesetaraan simulasi existing dengan inspector runtime | Lulus untuk seluruh 35 identitas |
| Determinisme Asia/Makassar dan America/Los_Angeles | Output simulasi identik |
| ESLint kedua file tooling/test baru | Lulus, tanpa error/warning |
| TypeScript `npx.cmd tsc --noEmit --incremental false` | Lulus |
| SHA-256 terhadap baseline G6B.4 | **125/125 file awal tetap identik**, tidak ada file awal yang berubah atau hilang |
| Registry evidence dan rules posisi produksi | Keduanya tetap kosong dan frozen; diuji |
| Import runtime terhadap fixture/simulator baru | Tidak ditemukan pada app/components/lib; diuji |
| `git diff --check` | Lulus |
| Tautan lokal ketiga dokumen | Valid; diuji |

Production build dan smoke browser **tidak dijalankan ulang pada G6B.4**: milestone ini hanya menambah dokumen dan tooling offline, tanpa perubahan runtime. Hasil build/browser R1 terdokumentasi terpisah dan tidak diklaim sebagai pengujian baru G6B.4. Tidak ada verifikasi ahli budaya atau validasi kompetensi empiris yang diklaim.

Git akhir: branch dan HEAD sama dengan baseline; **4 tracked modified, 23 untracked, staged kosong**. Semua 4 perubahan tracked dan 17 file untracked awal identik; tambahan hanya enam artefak G6B.4 di atas. Kalender, Palintangan, master sifat, Samyoga, Mod5/Mod16, hasil Otonan, comparator Ketua, approval gate, UI, dependency, storage/network, Netra-Hasta, Docker, dan Firebase tidak berubah pada milestone ini. Gate beta tetap default OFF dan produksi publik OFF. Tidak dilakukan commit, push, merge, reset, clean, atau switch branch.

**READY FOR MAPPING DECISION** untuk katalog dan pilihan produk berikutnya. Kecukupan evidence untuk Leader, Manajemen existing dan pengalokasian Ketua masih belum terpenuhi; keputusan ini bukan izin aktivasi runtime.
