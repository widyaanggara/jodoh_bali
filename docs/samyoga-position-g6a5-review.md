# Product approval gate dan simulasi cakupan — G6A.5

Keputusan: **READY FOR DOMAIN REVIEW**. Rekomendasi produksi nonaktif. Bukti sumber budaya tetap missing; tidak ada aturan posisi aktual yang disetujui.

## Baseline dan perubahan

Branch `feat/samyoga-group`; HEAD awal `e41bd993e0e22a4ffab68f5ed1b7ccc314fee336`, checkpoint empat dokumen G6A.4. Checkpoint fondasi G6A.3-R1 `13892ce` tersedia sebagai ancestor; working tree awal bersih. G6A.5 tidak membuat commit atau mengubah branch.

Perubahan runtime terbatas pada field wajib `productApprovalStatus` pada SamyogaPositionRule dan pemeriksaan kesetaraan eksplisit terhadap approved. Fixture lama di tests diperbarui agar approval sintetisnya eksplisit; tidak ada rule produksi yang diisi.

Artefak:

- [Harness offline](../tests/fixtures/samyoga-position-simulation.mjs).
- [Tes approval dan simulasi](../tests/samyoga-product-approval.test.mjs).
- [Hasil JSON lengkap](samyoga-position-simulation-results.json).
- [Worksheet 22 evidence](samyoga-position-source-verification.md).

Empat dokumen G6A.4 dipertahankan sebagai bahan review pada baseline asal. Bagian G6A.4 yang menyebut gap productApprovalStatus adalah temuan historis yang ditangani G6A.5; qualification Operasional/sourceEvidenceIds/kebijakan per-rule masih bukan fitur runtime produksi.

## Kontrak approval

Rekomendasi memerlukan semua gate berikut:

1. Evidence harus berasal dari resolver dengan identitas dan kutipan master cocok persis.
2. Provenance evidence verified dengan sourceId yang dapat ditelusuri.
3. Evidence domainReviewStatus approved.
4. Rule domainReviewStatus approved.
5. Rule productApprovalStatus approved secara terpisah.
6. Rule tidak duplikat/invalid; requiredDimensions tidak kosong; bukan fallback Anggota; seluruh dimensi support wajib tersedia.
7. Kebijakan konflik global existing tidak memblokir hasil.

Pending, rejected, missing/undefined, null, atau boolean true pada productApprovalStatus tidak sama dengan string approved dan ditolak. Object literal active=true, clone evidence, dan metadata tambahan pada input snapshot tidak dapat menggantikan registry produksi. Approval sintetis pada tests hanya milik fixture, bukan bukti persetujuan budaya maupun produk.

## Cara menjalankan

Dari root worktree:

```powershell
node tests/fixtures/samyoga-position-simulation.mjs
npm.cmd run test:samyoga
```

CLI mencetak JSON ke stdout. Tidak menulis file, tidak menerima data anggota/foto pengguna, tidak mengunggah data, dan tidak diimpor runtime/UI. File hasil JSON pada docs dibuat secara eksplisit sebagai artefak milestone, bukan penyimpanan otomatis.

## Dua eksperimen yang berbeda

### A. Mekanisme sintetis

64 kombinasi kehadiran support enam dimensi (2^6). Tidak memakai tanggal kalender atau teks budaya. Rule dan evidence sepenuhnya sintetis dan memakai resolver/gate runtime. Caution directing kemudian ditambahkan pada skenario yang identik.

| Skenario / denominator 64 | Leader support | Management support | Operasional support | Lebih dari satu support match | Tanpa support match | Konflik global | Kandidat bersih ditahan global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Support saja | 8 | 16 | 32 | 12 | 21 | 0 | 0 |
| Tambah caution directing sintetis | 8 | 16 | 32 | 12 | 21 | 8 | 5 |

Angka ini menguji mekanisme keputusan, bukan frekuensi kalender atau populasi.

### B. Proyeksi hipotesis katalog G6A.4

210 snapshot dari anchor civil 2005-07-27, jam 06:00, selama satu siklus 210 hari. Semua tanggal digunakan sebagai enumerasi kombinasi kalender; tidak mewakili kelahiran orang nyata atau distribusi populasi.

Kandidat asli dipakai hanya untuk exact-match identitas dan teks. Semua kandidat tetap provenance missing dan domain/product pending. Untuk mengeksplorasi konsekuensi **andaikan** tag disetujui, harness membentuk assertion PROXY SINTETIS dengan masterRecordId/sourceId/kutipan sintetis. Hanya proxy tes ini melewati gate; tidak ada status approved yang ditulis ke katalog atau registry produksi. “Simulasi kandidat” bukan approval sebenarnya.

Yang diuji hanya Leader, Management, dan Operasional sebagai hipotesis. Koordinator, Co-Leader, dan Anggota tidak diberi rule simulasi katalog. Facet consistency/precision Operasional dipakai sebagai prasyarat tambahan di harness; tidak diaktifkan dalam evaluator produksi. sourceEvidenceIds berasal dari kumpulan kandidat yang relevan, tanpa keyword matching.

## Hasil utama hipotesis (denominator 210)

| Ukuran | Support saja | Katalog dengan caution |
| --- | ---: | ---: |
| Leader memenuhi seluruh support wajib | 6 | 6 |
| Leader tanpa blocker pada rule terkait | 6 | 4 |
| Management support / tanpa blocker | 12 / 12 | 12 / 12 |
| Operasional support / tanpa blocker | 62 / 62 | 62 / 62 |
| Memenuhi lebih dari satu posisi sebelum caution | 3 | 3 |
| Lebih dari satu posisi tanpa blocker | 3 | 2 |
| Tidak memenuhi support rule mana pun | 133 | 133 |
| Tidak ada kandidat tanpa blocker | 133 | 134 |
| Global: recommended | 74 | 73 |
| Global: multiple_candidates | 3 | 2 |
| Global: conflicting_indicators | 0 | 2 |
| Global: insufficient_basis | 133 | 133 |

Jumlah per posisi dapat tumpang tindih. Kolom support bukan keluaran rekomendasi; kolom tanpa blocker adalah eligibility per-rule, yang tetap dapat ditahan kebijakan global. Kasus tanpa support berbeda dari kasus konflik. Angka ini bukan akurasi, tingkat kecocokan, atau prediksi kompetensi manusia.

## Sensitivitas persyaratan

Seluruh varian selain baris pertama menyertakan caution katalog; tidak ada threshold/aturan produksi yang diganti.

| Varian / denominator 210 | Leader support | Management support | Operasional support | Multi support | Tanpa support | Konflik global |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Semua support; caution dikeluarkan | 6 | 12 | 62 | 3 | 133 | 0 |
| Katalog + caution (acuan eksperimen) | 6 | 12 | 62 | 3 | 133 | 2 |
| Leader tanpa directing | 43 | 12 | 62 | 14 | 108 | 2 |
| Leader tanpa collaborating | 24 | 12 | 62 | 11 | 123 | 3 |
| Leader tanpa communicating | 8 | 12 | 62 | 3 | 131 | 2 |
| Leader ditambah planning | 0 | 12 | 62 | 2 | 138 | 0 |
| Management tanpa planning | 6 | 91 | 62 | 25 | 77 | 2 |
| Management tanpa managing | 6 | 46 | 62 | 11 | 107 | 3 |
| Operasional consistency AND precision | 6 | 12 | 6 | 0 | 186 | 2 |
| Operasional consistency saja | 6 | 12 | 26 | 2 | 168 | 2 |
| Operasional precision saja | 6 | 12 | 42 | 1 | 151 | 2 |
| Caution directing tambahan sintetis | 6 | 12 | 62 | 3 | 133 | 6 |

Temuan untuk review:

- Leader sangat sensitif pada directing: menghapusnya memperluas support 6 menjadi 43; ini menunjukkan perubahan definisi yang besar, bukan alasan memilih angka lebih tinggi.
- Menambah planning menghasilkan 0 Leader pada siklus/catalog ini. Kombinasi itu terlalu restriktif untuk cakupan katalog saat ini; tidak membuktikan bahwa orang tidak dapat memimpin sekaligus merencanakan.
- Management tanpa planning meluas 12 menjadi 91; managing saja terlalu mudah dipenuhi relatif proposal dua dimensi. Ini penilaian cakupan hipotesis, bukan false positive terukur.
- Operasional dengan OR consistency/precision mencakup 62; AND hanya 6, consistency saja 26, precision saja 42. Keputusan facet merupakan perubahan semantik produk yang perlu persetujuan.
- C-DIR-01/C-MAN-02 berbagi satu kalimat. Dependency kalender, alias master, dan keterbatasan katalog membuat jumlah tag tidak menjadi ukuran confidence.
- Caution mereduksi eligibility dan dapat menahan kandidat bersih. Caution tidak otomatis dibenarkan hanya karena mengubah hasil.
- Dua anggota dengan indikator sama menghasilkan hasil identik; tidak ada penempatan posisi unik atau tie-break urutan.

## Konflik global versus per-rule

Pembandingan memakai snapshot, evidence proxy, dan rule identik. Kebijakan global runtime **tidak diubah**. Per-rule hanya komparator offline yang menjalankan setiap rule secara terpisah dan selalu melaporkan blockedPositions.

| Hasil pada katalog+caution / denominator 210 | Global existing | Per-rule eksperimen |
| --- | ---: | ---: |
| recommended | 73 | 74 |
| multiple_candidates | 2 | 2 |
| conflicting_indicators tanpa rekomendasi utama | 2 | 1 |
| insufficient_basis | 133 | 133 |

Dua kombinasi mempunyai rule konflik. Pada satu di antaranya (dayIndex 207, indeks mulai 0), support Leader berkonflik dan Operasional bersih. Global menghasilkan conflicting_indicators tanpa utama; per-rule dapat menampilkan Operasional sambil menahan Leader. Ini potensi abstain yang lebih luas, bukan false abstain yang sudah divalidasi terhadap manusia.

Keuntungan global: penjelasan konservatif dan sederhana. Risikonya: kandidat bersih ikut tertahan. Keuntungan per-rule: kandidat bersih tetap terlihat. Risikonya: UI dapat terlihat terlalu yakin apabila konflik posisi lain disembunyikan. UI per-rule wajib membedakan kandidat eligible, blocked, dan alasan serta tetap memberi disclaimer simbolis.

Rekomendasi review: pertahankan global sampai pemilik produk secara eksplisit memutuskan alternatif. Jangan mengganti kebijakan hanya untuk menaikkan cakupan.

## Reproduksibilitas dan provenance

Artefak input dipatok dengan SHA-256 **file dokumentasi**, bukan fingerprint pribadi:

- Katalog: `ff87e2b4f5af983ea6450655f10b8c19b607e7db9c61c370396d21eeaefc4658`
- Ruleset G6A.4: `a58fe3678d8e2ad441f20aec2c0847566ebfc55d34cecfb1b76900a22445497d`

Harness memeriksa 2.520 permutasi urutan rule/evidence pada 12 varian x 210 snapshot; 210 pemeriksaan dua anggota berindikator sama; 210 pemeriksaan permutasi anggota. Report lengkap identik pada Asia/Makassar dan America/Los_Angeles.

Hasil proyeksi pending bukan hasil evaluasi produksi. Produksi tetap insufficient_basis pada 210/210 snapshot; evidence produksi aktif 0 dan rule produksi aktif 0.

## Worksheet sumber

[Worksheet](samyoga-position-source-verification.md) memuat 22 kutipan utuh, identitas cycle/master, lokasi kode, dimensi/polarity, antrean bibliografi yang perlu dicari, sumber/halaman terkonfirmasi null, pertanyaan ahli, keputusan pending, reviewer/tanggal null, serta versi review.

Verifikasi teks tradisional, persetujuan makna dimensi/polarity, dan persetujuan produk atas posisi dicatat terpisah. Tidak ada sumber, halaman, reviewer, atau tanggal persetujuan yang direka.

## Batasan dan status

- Seluruh approval budaya/produk nyata masih pending; scope milestone ini adalah gate dan eksperimen offline.
- Qualification Operasional/sourceEvidenceIds belum menjadi kontrak runtime; hanya diukur dalam harness.
- Pal Sri Sedana dikecualikan dan tidak diubah. Samyoga tetap konteks relasi.
- Tidak ada UI simulasi, skor posisi, persistence/network baru, atau data anggota nyata.
- Layout global masih menginisialisasi telemetry existing sebagaimana dicatat R1; fitur baru tidak meneruskan input ke sana.
- Validasi teknis tidak memberi validasi budaya/kompetensi.

## Hasil validasi implementasi

| Pemeriksaan | Hasil nyata |
| --- | --- |
| Seluruh regression Samyoga | 86/86 lulus |
| Matriks gate provenance/evidence/rule/product | 288 kombinasi status diperiksa |
| TypeScript tanpa emit | Lulus |
| ESLint file runtime/test terkait | Lulus |
| Production build default Next.js 16.1.6 Turbopack | Lulus |
| Report JSON terhadap hasil harness | Identik |
| Worksheet terhadap 22 kutipan/identitas katalog | Cocok; seluruh keputusan pending |
| Determinisme report Asia/Makassar vs America/Los_Angeles | Identik |
| Registry evidence/rule produksi | 0/0 |
| Evaluasi produksi sepanjang siklus | 210/210 insufficient_basis |
| Pemeriksaan bundle .next/static dan .next/server | Tidak ditemukan penanda harness/proxy G6A.5 |
| Protected engine, UI, Firebase/Docker, dependency | Tidak berubah |
| git diff --check | Lulus |

Status akhir: 3 tracked files dimodifikasi (gate runtime dan 2 helper test), 5 file baru (harness, test gate, dan 3 artefak docs). Tidak ada staged changes; HEAD tetap e41bd993e0e22a4ffab68f5ed1b7ccc314fee336. Empat dokumen G6A.4 tetap identik dengan checkpoint. Tidak ada commit, push, merge, reset, clean, atau switch branch.
