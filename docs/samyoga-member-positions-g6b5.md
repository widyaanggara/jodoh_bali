# Implementasi rekomendasi posisi seluruh anggota — G6B.5

Tanggal pekerjaan: **4 November 2026, WITA**. Worktree `C:\Project-Trispark\jodoh_bali_samyoga`; branch `feat/samyoga-group`; HEAD tetap `3e568b768beb73c445e32db89a9672415e0e7949`.

**READY FOR FUNCTIONAL REVIEW — development internal.** Setiap anggota mempunyai analisis dan kartu hasil yang berasal dari engine kalender aktual. Kontribusi Manajemen, Operasional, Komunikasi, Kolaborasi, serta kandidat Ketua dua gerbang sudah dapat diuji end-to-end. Koordinator dan Wakil Ketua tidak dialokasikan. Produksi publik tetap OFF.

## 1. Baseline dan perubahan ruang lingkup

Awal pekerjaan aktual: **4 tracked modified, 26 untracked, staged kosong**. G6B.3 sampai G6B.5-P0 belum seluruhnya menjadi checkpoint. Sebelum perubahan dicatat SHA-256 atas **134 file** (108 tracked + 26 untracked). Tidak dilakukan commit, push, reset, clean, merge atau switch branch.

Instruksi G6B.5 memperluas sumber dari Palintangan saja menjadi Palintangan utama ditambah tafsir Wuku dan Wewaran Bali yang relevan. Karena itu hasil HOLD pada [audit Palintangan C+M saja](samyoga-indirect-leadership-matrix-g6b5p0.md) tetap benar dalam scope historisnya; ia tidak ditimpa atau diubah menjadi hasil positif. Integrasi baru dapat memenuhi C+M dengan sumber Bali tambahan yang kini diotorisasi.

Engine lama R1 `lib/samyoga-position-experiment.ts`, arsip G6B.3, katalog/matriks G6B.4, dokumen P0 dan sandbox G6A.8 dipertahankan identik. Panel internal kini memanggil modul G6B.5 yang terpisah; hasil lama tetap dapat diregresikan.

## 2. Sumber yang benar-benar digunakan

| Sumber | Fungsi/data aktual | Penggunaan |
| --- | --- | --- |
| Palintangan | `getBalineseDate/findLintang`, `dataLintang.penjelasan/label/makna` | Ditampilkan paling awal sebagai profil utama; identity dan karakter asli tetap utuh. |
| Wuku | `getBalineseDate(...).wuku`, master `wukuData` | `sifat_umum`, `kelebihan`, `kelemahan` dengan kutipan eksplisit; konteks deskripsi juga tersedia di disclosure. |
| Saptawara/Pancawara | Master karakter existing dari hasil engine | Support pelaksanaan, komunikasi dan hubungan prososial yang sudah memiliki mapping eksplisit. |
| Wewaran | Master `karakter` existing, antara lain asatawara/dasawara/triwara/dwiwara/sangawara | Hanya tafsir yang mempunyai mapping dipakai; angka/nama tanpa tafsir tidak menghasilkan sifat. |
| Relasi Samyoga | `calculateSamyogaGroup`, engine pasangan existing | Graf pasangan aktual untuk konteks dan gerbang mayoritas Utama; tidak menjadi sumber sifat. |

Adapter snapshot `createSamyogaGroupCalendarSnapshots` existing membaca engine dan master yang sama dengan Ramalan Otonan; parser tanggal sipil dan validasi waktu mengikuti G2. `calculateOtonanCalendar` juga tetap pada engine yang sama. Tidak ada rumus/master baru atau perubahan boundary 05:59/06:00.

Urutan tampilan sumber bukan bobot kekuatan. Zodiak tidak diimpor/dibaca oleh algoritma posisi; total urip tidak digunakan sebagai skor kompetensi.

## 3. Mapping G6B.5 yang diimplementasikan

Katalog internal memiliki **36 mapping**:
- 22 assertion katalog G6B.3 dengan identitas/kutipan asli dan status provenance/review dipertahankan.
- 14 representasi eksperimen dari hasil audit tekstual G6B.4: **13 support Palintangan tambahan** (7 komunikasi, 2 pengelolaan, 4 pelaksanaan), serta **1 caution komunikasi** Salah Ukur.
- Total **30 support**: 26 berhubungan tekstual, 4 interpretatif terbatas (kontinuitas C-EXEC-02 dan prososial C-COLL-01/02/03).
- **4 caution** digunakan sebagai konteks/review: C-DIR-04, C-COMM-04, C-COLL-04 dan Salah Ukur.
- **2 mapping disputed**, C-PLAN-02 dan C-PLAN-03, tetap terlihat tetapi **tidak menjadi support atau blocker otomatis**. Tidak mengaktifkan semua 69 draft audit.

Semua definisi memakai exact indicator type, siklus, identity master, nama, field, kutipan lengkap dan frasa audit. Pengujian `includes(sourcePhrase)` hanya memvalidasi kutipan pada record yang tepat; tidak ada klasifikasi keyword bebas.

Metadata tetap `provenanceStatus: missing`, `domainReviewStatus: pending`, `productApprovalStatus: pending`, sourceId/sourcePage null. Otorisasi implementasi internal tidak ditulis sebagai approval budaya/produksi.

| ID | Sumber | Dimensi | Perlakuan | Hubungan semantik | Caution effect |
| --- | --- | --- | --- | --- | --- |
| C-DIR-01 | wewaran: Sri | directing | support | textual | none |
| C-DIR-02 | wewaran: Raja | directing | support | textual | none |
| C-DIR-03 | wuku: Sinta | directing | support | textual | none |
| C-DIR-04 | wuku: Sinta | directing | caution | interpretive | review |
| C-PLAN-01 | wewaran: Indra | planning | support | textual | none |
| C-PLAN-02 | wewaran: Urungan | planning | Ambigu; bukan support | ambiguous | none |
| C-PLAN-03 | wuku: Pujut | planning | Ambigu; bukan support | ambiguous | none |
| C-MAN-01 | wewaran: Beteng | managing | support | textual | none |
| C-MAN-02 | wewaran: Sri | managing | support | textual | none |
| C-MAN-03 | wuku: Kuningan | managing | support | textual | none |
| C-COMM-01 | wewaran: Menga | communicating | support | textual | none |
| C-COMM-02 | pancawara: Kliwon | communicating | support | textual | none |
| C-COMM-03 | lintang: Tiwa-tiwa | communicating | support | textual | none |
| C-COMM-04 | lintang: Begoong | communicating | caution | interpretive | context |
| C-EXEC-01 | saptawara: Buda | executing | support | textual | none |
| C-EXEC-02 | wewaran: Dangu | executing | support | interpretive | none |
| C-EXEC-03 | wuku: Wariga | executing | support | textual | none |
| C-EXEC-04 | lintang: Kukus | executing | support | textual | none |
| C-COLL-01 | saptawara: Redite | collaborating | support | interpretive | none |
| C-COLL-02 | wewaran: Manusa | collaborating | support | interpretive | none |
| C-COLL-03 | wuku: Pahang | collaborating | support | interpretive | none |
| C-COLL-04 | wuku: Langkir | collaborating | caution | interpretive | review |
| EXP-G6B5-L08-EXEC-01 | lintang: Uluku | executing | support | textual | none |
| EXP-G6B5-L10-EXEC-01 | lintang: Kuda | executing | support | textual | none |
| EXP-G6B5-L14-COMM-01 | lintang: Pagelangan | communicating | support | textual | none |
| EXP-G6B5-L17-COMM-01 | lintang: Asu | communicating | support | textual | none |
| EXP-G6B5-L20-COMM-01 | lintang: Banyak Angrem | communicating | support | textual | none |
| EXP-G6B5-L21-MAN-01 | lintang: Ru | managing | support | textual | none |
| EXP-G6B5-L22-COMM-01 | lintang: Patrem | communicating | support | textual | none |
| EXP-G6B5-L24-COMM-01 | lintang: Depat | communicating | support | textual | none |
| EXP-G6B5-L26-COMM-03 | lintang: Salah Ukur | communicating | caution | textual | context |
| EXP-G6B5-L28-MAN-01 | lintang: Puwuh Atarung | managing | support | textual | none |
| EXP-G6B5-L29-COMM-01 | lintang: Lawean | communicating | support | textual | none |
| EXP-G6B5-L32-EXEC-01 | lintang: Lumbung | executing | support | textual | none |
| EXP-G6B5-L34-COMM-01 | lintang: Udang | communicating | support | textual | none |
| EXP-G6B5-L35-EXEC-01 | lintang: Begoong | executing | support | textual | none |

C-DIR-01 dan C-MAN-02 memakai kalimat Sri yang sama. Tidak dihitung sebagai dua bukti independen. Seluruh indikator individu juga sama-sama merupakan derivasi kalender; banyaknya evidence/profil/jalur tidak menjadi ranking.

## 4. Aturan profil dan rekomendasi

Versi kebijakan: **g6b5-otonan-contribution-v1**.

| Profil | Syarat | Arti keluaran |
| --- | --- | --- |
| Kepemimpinan langsung | directing AND communicating AND collaborating | Mengikuti konjungsi G6B.3; ada tafsir pengarahan eksplisit disertai komunikasi dan hipotesis prososial. Tidak cukup satu kata positif. |
| Pendukung kepemimpinan tidak langsung | communicating AND managing, keduanya tekstual | Gabungan hipotesis Metemu dari sumber Bali yang sekarang diperluas; tidak menjadi comparator atau kekuatan yang setara dengan jalur langsung. |
| Manajemen | planning AND managing, tekstual | Kontribusi perencanaan/pengelolaan dalam scope sumber, bukan kompetensi profesional. |
| Operasional | executing | Indikator pelaksanaan/kerajinan/kontinuitas terbatas; belum ukuran ketuntasan. |
| Komunikasi | communicating, tekstual | Kecenderungan kontribusi komunikasi. |
| Kolaborasi | collaborating dengan batas prososial eksplisit | Hipotesis tindakan membantu/relasi, bukan bukti kapasitas kerja tim. |

Kepemimpinan merupakan kecenderungan; **Kandidat Ketua baru ditambahkan bila gerbang Samyoga juga lolos**. Profil kontribusi lain tidak mengalokasikan slot jabatan. Anggota boleh mempunyai beberapa kontribusi dan tidak dipaksa satu posisi khusus.

Jika tidak ada rekomendasi, keluaran/kartu tetap ada dengan teks:
**“Anggota Kelompok — Kecenderungan posisi belum spesifik.”**
Ini `participationStatus`, bukan hasil mapping sifat dan tidak dimasukkan sebagai posisi yang direkomendasikan.

Koordinator dan Wakil Ketua tetap unavailable. Tidak ada fallback jabatan atau runner-up.

### Caution dan ambiguitas

- Kritik/kekakuan Sinta (C-DIR-04) menahan **profil kepemimpinan yang sudah lengkap** sebagai review_required; kontribusi lain tetap dapat muncul.
- Kesulitan kompromi Langkir (C-COLL-04) menahan profil terkait kolaborasi dan kepemimpinan langsung yang lengkap.
- Begoong dan Salah Ukur mempertahankan caution komunikasi sebagai konteks, tanpa penalti otomatis atau diskualifikasi.
- C-DIR-04/C-COMM-04/C-COLL-04 tetap ditandai interpretatif; tidak dipromosikan sebagai sumber terverifikasi.
- Policy G6B.5 ini eksplisit per profil. Tidak menerapkan global conflict yang menghapus semua kontribusi karena satu profil perlu review; evaluator lama tetap utuh.
- Mapping ambigu/disputed tidak melengkapi dimensi yang hilang. Tidak ada pengurangan poin.

## 5. Kandidat Ketua dan graf

Gerbang tetap **dukungan kepemimpinan Otonan AND mayoritas Utama Samyoga**. Kebutuhan minimum 2/2/3/3 untuk kelompok 3/4/5/6, dari `2 × Utama > N−1`. Ini kebijakan eksperimen, bukan hukum Wariga.

Modul menghitung ulang hasil G2 untuk input anggota yang sama dan mencocokkan seluruh graf/summary yang diberikan. Graf tidak lengkap, duplikat, count buatan, kategori/field palsu atau hasil stale ditolak dengan error terstruktur sebelum publikasi kandidat. Count Utama/Madia/Nista diambil dari incidence edge aktual, tanpa input angka bebas.

Satu kandidat boleh ditampilkan sebagai kandidat simbolis; jika beberapa lolos, semua ditampilkan tanpa ranking. `comparatorStatus: UNKNOWN`, `selectedChairMemberId: null`, `deputyMemberId: null`. Count Utama yang lebih tinggi tidak memilih pemenang dan tidak mengatasi ketiadaan pembanding Otonan. Tidak membuat skor atau metode kekuatan baru.

## 6. Kontrak input-output

API internal murni:
`analyzeSamyogaMemberPositions(members, group)`.

Input memakai tipe anggota G2: ID stabil/unik, civil date YYYY-MM-DD, HH:mm dan label opsional; 3–6 anggota. Nama hanya presentasi. Tidak memutasi input.

Hasil analisis memuat policyVersion, experimental/dataOrigin, disclaimer, status analyzed/error, seluruh memberResults, daftar kandidat dan posisi yang belum didukung.

Setiap anggota memuat:
- memberId/displayName dan versi kebijakan.
- Palintangan asli, indikator Otonan dan tafsir master yang dipakai.
- Evidence dengan identity/field/kutipan, dimensi, alasan, scope, semanticStatus dan metadata sumber/review.
- Profil matched/partial/review_required/unsupported, dimensi yang hilang, ID support/review dan reason codes.
- contributionProfiles, recommendedPositions, partialProfiles, cautions/ambiguousEvidence, penjelasan.
- Status partisipasi dan fallback belum spesifik bila diperlukan.
- Jalur kepemimpinan, count relasi aktual, threshold, dan boolean kandidat.
- Tidak ada field skor kompetensi atau ranking.

Status error tidak menghasilkan rekomendasi setengah jadi dari input/graf invalid. Semua anggota valid tetap ditampilkan, termasuk yang tidak mempunyai posisi spesifik.

## 7. UI dan contoh hasil aktual

Panel tetap pada `/pawongan-sinergi/kelompok`, setelah hero Hasil Keseluruhan dan sebelum Rincian Pasangan. Menampilkan kartu setiap anggota, Lintang/karakter asli, Wuku, chip kontribusi/kandidat, alasan, profil parsial, caution/review, count relasi dan disclosure evidence/tafsir Bali. Komponen existing splash, form, reset dan hero tidak diubah.

Hasil berikut memakai **input fixture kalender**, dihitung ulang melalui engine aktual; bukan data orang atau penetapan jabatan:

| Input tanggal, semua jam 12:00 | Contoh keluaran |
| --- | --- |
| 2005-07-27 — Tiwa-tiwa/Sinta | Operasional dan Komunikasi. |
| 2005-09-18 — Patrem/Julungwangi | Jalur langsung dan tidak langsung; Komunikasi/Kolaborasi; menjadi kandidat hanya jika graf mendukung. |
| 2005-08-18 — Salah Ukur/Kulantir | Manajemen dari perencanaan/pengelolaan Wewaran; caution Palintangan tetap ditampilkan. |
| 2005-07-28 — Sangka Tikel/Sinta | Belum spesifik, profil parsial tetap terlihat; banyak Utama tidak menciptakan Leader. |
| 2005-07-30 — Sungenge/Sinta | Komunikasi dan Kolaborasi; kepemimpinan lengkap tertahan review konteks Sinta. |
| 2005-08-02 — Kuda/Landep | Operasional/Komunikasi; C-PLAN-02 terlihat sebagai disputed, tidak dipakai sebagai support. |

### Jumlah rekomendasi versus belum spesifik dalam uji browser

Urutan sampel standar:
`2005-07-27, 2005-09-18, 2005-08-18, 2005-07-28, 2005-08-03, 2005-08-21`, jam 12:00, ID berbeda.

| Kelompok | Punya rekomendasi kontribusi/kandidat | Belum spesifik | Kandidat Ketua |
| --- | --- | --- | --- |
| 3 sampel pertama | 3 | 0 | 0 |
| 4 sampel pertama | 3 | 1 | 0 |
| 5 sampel pertama | 4 | 1 | 0 |
| 6 sampel pertama | 5 | 1 | 0 |
| 2005-09-18, 2005-07-27, 2005-07-27 | 3 | 0 | 1 |
| 2005-08-03, 2005-08-03, 2005-08-01 | 3 | 0 | 3 |

Contoh perbedaan Utama yang diuji unit: `2005-08-15, 2005-08-21, 2005-07-27, 2005-07-28`. Lembu dan Lawean sama-sama kandidat dengan **2 dan 3 Utama** pada N=4. Keduanya tetap kandidat; tidak dipilih satu Ketua. Sangka Tikel mempunyai 3 Utama tetapi tidak mempunyai profil kepemimpinan dan tetap belum spesifik.

Tanggal sama dengan ID berbeda diperbolehkan oleh G2. Tidak ada kandidat/profil fixture yang dimasukkan sebagai hasil default UI; form tetap kosong dan analisis berasal dari input pengguna.

## 8. Pengujian nyata

| Pemeriksaan | Hasil |
| --- | --- |
| Unit engine G6B.5 baru | **18/18 lulus** |
| Tes UI baru | **3/3 lulus**, ditambahkan pada 4 tes UI/gate existing sehingga 7/7 |
| Seluruh regresi Samyoga + Otonan | **296/296 lulus**, tanpa fail/skip (275 sebelumnya + 21 baru) |
| Reachability dan exact identity/text mapping | **36/36** ditemukan dari engine pada rentang input uji 420 hari; bukan akurasi atau prevalensi |
| Sumber palsu/field/nama/cycle/kutipan berubah | Ditolak oleh matcher |
| Kesetaraan Palintangan/Wuku dengan engine Otonan | Lulus untuk 35 tanggal berurutan |
| Direct/indirect, Manajemen/Operasional/Komunikasi/Kolaborasi | Lulus memakai tanggal yang benar-benar dihitung engine |
| Semua anggota 3–6, beberapa profil, fallback partisipasi | Lulus |
| Caution, review per profil dan planning ambigu | Lulus |
| Kandidat nol/tunggal/jamak dan beda count Utama | Lulus; tidak memilih pemenang |
| Graf malformed/stale/duplikat/count palsu | Error terstruktur, tidak menerbitkan kandidat palsu |
| Nama/urutan/extra user flags dan input immutability | Lulus |
| Boundary 05:59/06:00 dan lintas timezone | Lulus; Makassar/Los Angeles menghasilkan output rekomendasi identik |
| TypeScript | `npx.cmd tsc --noEmit --incremental false` lulus |
| ESLint 6 file terkait | Lulus tanpa error/warning |
| Production build Next.js 16.1.6 Turbopack | Lulus, termasuk TypeScript dan route kelompok |
| `git diff --check` | Lulus |

Build pertama pada sandbox tidak dapat menulis `.next/trace` di worktree di luar writable root. Build final dijalankan dengan akses worktree yang diperlukan dan **lulus**; tidak mengubah konfigurasi deployment atau menghentikan server pengguna.

### Smoke browser Chrome nyata

Development ON:
- Enam alur: anggota 3/4/5/6, satu kandidat dan tiga kandidat.
- Kartu, label partisipasi, kandidat dan count dibandingkan dengan hasil engine aktual untuk input yang sama.
- Original nama/karakter Lintang dibandingkan dengan Ramalan Otonan.
- Disclosure Enter/Space, reset ke tiga input kosong, dan detail pasangan lulus.
- Viewport **320/390/1440 px** lulus tanpa overflow, termasuk disclosure evidence dalam keadaan terbuka.

Production OFF:
- HTTP 200, kelompok 3 dan 6, reset/detail/responsivitas lulus.
- Panel eksperimen tidak muncul **walaupun environment flag bernilai 1 dan query positions=1**.
- Halaman Ramalan Otonan aktual di browser Los Angeles tetap menghasilkan Tiwa-tiwa/karakter yang sama dan reset berhasil.

Kedua mode: **0 uncaught exception**, **0 request berisi data input Samyoga yang teramati**. HTTPS eksternal diblokir pada harness. Logging Ramalan Otonan existing tidak dihapus; nol request log dalam harness bukan klaim logging global telah dinonaktifkan. Tidak ada storage/network/telemetry baru pada modul ini.

Development smoke memakai mirror sementara dan Webpack untuk menghindari benturan server milik developer; production memakai build aktual. Profil Chrome, mirror dan proses milik tes dibersihkan. Tidak mengklaim pengujian manual perangkat mobile fisik atau evaluasi dosen sudah dilakukan.

## 9. Gate, privasi dan modul protected

[Gate server](../lib/samyoga-internal-beta.server.ts) tetap:
`NODE_ENV === development AND SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT === 1`.
Default OFF, produksi publik OFF. Tidak menerima input/query/storage sebagai approval.

Registry evidence dan rule produksi tetap **kosong/frozen**. Resolver production/WeakSet, approval budaya/produk dan sandbox Ketua/Wakil tidak berubah. Tidak ada auto-verified/approved, tidak ada fallback Zodiak, atau dependency baru.

Semua **108 file tracked** identik dengan baseline sesi ini. Dari 134 file awal, **131 tetap identik SHA-256**; hanya tiga file untracked existing yang memang menjadi target integrasi berubah. Kalender Bali, master, Samyoga pasangan/G2, Mod5/Mod16, adapter Otonan, snapshot, hasil UI pasangan, Netra-Hasta, Docker/Firebase/package/lockfile tetap utuh.

## 10. File terdampak dan Git akhir

Empat file baru:
1. `lib/samyoga-member-position-rules.ts` — 36 mapping eksplisit, scope semantik/caution dan enam profil kontribusi.
2. `lib/samyoga-member-positions.ts` — engine rekomendasi, bukti, fallback partisipasi dan kandidat dua gerbang.
3. `tests/samyoga-member-positions.test.mjs` — 18 unit/regression baru.
4. `docs/samyoga-member-positions-g6b5.md` — laporan ini.

Tiga file untracked existing dimodifikasi:
5. `components/samyoga-group/SamyogaGroupPositionExperiment.tsx` — panel memakai engine G6B.5 dan menampilkan seluruh anggota.
6. `tests/samyoga-position-experiment-ui.test.mjs` — ekspektasi rule versi baru dan tiga tes UI tambahan.
7. `tests/fixtures/samyoga-position-browser-smoke.mjs` — verifikasi hasil tiap kartu, fallback, satu/jamak kandidat serta evidence terbuka pada tiga viewport.

Git akhir: **4 tracked modified, 30 untracked, staged kosong**. Empat perubahan tracked merupakan pekerjaan awal dan tidak disentuh pada G6B.5. HEAD/branch tetap. Tidak ada commit, push, merge, reset, clean atau switch branch.

## 11. Cara review internal

Di PowerShell, dari worktree Samyoga:

```powershell
$env:SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT = "1"
npm.cmd run dev -- --port 3020
```

Buka `http://localhost:3020/pawongan-sinergi/kelompok`. Flag perlu ada saat development server dimulai. Produksi tetap OFF walau flag tersebut dipasang.

Checklist review:
1. Isi 3–6 anggota, analisis, cek semua kartu dan sumber Lintang/Wuku/Wewaran.
2. Uji contoh kandidat tunggal/jamak dan fallback di atas dengan jam 12:00; label/nama bebas.
3. Buka evidence, pastikan kutipan asli, caution, profil parsial dan metadata sumber terlihat.
4. Uji ulang pada smartphone, keyboard dan label anggota panjang.
5. Klik Analisis Ulang: hasil hilang, tiga input tanggal/nama kosong.
6. Pastikan rekomendasi dipahami sebagai kontribusi simbolis; tidak membagi jabatan atau memilih pemenang.

**READY FOR FUNCTIONAL REVIEW.** Fitur internal berjalan end-to-end. Sumber/interpretasi belum divalidasi empiris/budaya; Koordinator, Wakil dan comparator kekuatan belum didukung. Tidak mengklaim semua anggota memperoleh jabatan khusus atau bahwa seluruh posisi tersedia.
