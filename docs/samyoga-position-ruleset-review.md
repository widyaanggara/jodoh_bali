# Review ruleset posisi kandidat — G6A.4

Status: **READY FOR DOMAIN DECISION; produksi tetap nonaktif**. Baseline `13892cea1603d3a134d6480323adecf419923842`.

Semua object JSON di dokumen ini adalah proposal review, bukan konfigurasi runtime. Seluruh rule memiliki `domainReviewStatus: pending`, `productApprovalStatus: pending`, dan tidak ada `activationStatus: active`. Dokumen tidak diimpor aplikasi.

Referensi: [katalog evidence](samyoga-position-evidence-catalog.md), [dimensi](samyoga-position-dimensions.md), [daftar keputusan](samyoga-position-domain-decisions.md).

## Matriks posisi

| Posisi | Fungsi organisasi yang diusulkan produk | Dimensi kandidat | Status | Batas |
| --- | --- | --- | --- | --- |
| Leader | Membantu memberi arah dan menjaga komunikasi tindakan bersama | directing AND collaborating AND communicating | needs_domain_review | Semua dimensi wajib dibahas; satu teks berjiwa pemimpin tidak menentukan jabatan |
| Management | Menata rencana dan proses/sumber daya | planning AND managing | needs_domain_review | Bukan bukti kompetensi anggaran, bisnis, atau personel |
| Operasional | Menindaklanjuti aktivitas dengan ketelitian/konsistensi | executing dengan qualification eksplisit | HOLD qualification | Bukan posisi sisa atau jenjang orang yang dianggap kurang mampu |
| Koordinator | Menyelaraskan hubungan informasi dan aktivitas | communicating AND collaborating sebagai bahan awal | HOLD definisi/bukti | Belum ada evidence coordinating; kombinasi dua dimensi saja belum cukup |
| Co-Leader | Mendampingi arah bersama dan menjaga kontinuitas jika Leader berhalangan, jika produk memilih fungsi tersebut | Belum dirumuskan | HOLD; tidak ada rule | Fungsi delegasi/otoritas tidak dapat diturunkan dari tanggal lahir |
| Anggota | Status dasar seluruh orang dalam kelompok | Tidak berlaku | Ditolak sebagai fallback | Insufficient_basis tidak diubah menjadi Anggota |

Fungsi-fungsi di tabel merupakan usulan produk. Pengguna tidak memilih jabatan melalui dropdown. Setelah aturan disetujui, sistem dapat menawarkan kecenderungan simbolis, bukan penunjukan jabatan formal. Beberapa orang boleh mendapat kandidat sama; tidak dipaksa satu Leader/Co-Leader.

## Kontrak dan gap terhadap implementasi saat ini

[SamyogaPositionRule:40](../lib/samyoga-position-recommendation.ts#L40) saat ini memuat `ruleId`, `ruleVersion`, `position`, `requiredDimensions`, `domainReviewStatus`, dan `rationale`. Object dokumen memakai `version` serta field review yang lebih kaya. Object ini **tidak boleh di-cast atau disalin langsung** ke interface runtime.

Persetujuan harus dipisah menjadi:

1. **Evidence budaya**: asal kutipan, kecocokan record, konteks, dimensi, dan polarity disetujui ahli.
2. **Rule budaya/interpretasi**: dasar penggunaan kombinasi indikator disetujui pada rule.
3. **Pemetaan produk**: pemilik produk menyetujui fungsi posisi, hubungan dimensi, bahasa hasil, dan batas penggunaannya.

Gate evidence existing sudah memeriksa exact matching + verified + approved di [resolver:108](../lib/samyoga-position-evidence.ts#L108). Gate rule existing memeriksa `domainReviewStatus`, tetapi **belum ada field/gate productApprovalStatus terpisah** di runtime. Ini gap kontrak untuk G6B, bukan alasan mengubah fondasi pada G6A.4. Sebelum aktivasi, buat perubahan kontrak yang eksplisit dan tes evidence approved/rule pending/product pending serta seluruh permutasinya.

`sourceEvidenceIds` di setiap rule adalah daftar assertion yang diizinkan sebagai bahan rule, bukan perintah memakai semua sekaligus. Kandidat harus cocok dengan snapshot anggota dan seluruh approval. Tag dari satu kalimat atau alias siklus tidak dihitung sebagai observasi tambahan. Tidak ada jumlah evidence minimum berbobot, skor posisi, ranking, atau confidence persentase.

`optionalDimensions` kosong pada semua proposal supaya tidak menjadi bonus tersembunyi. Caution hanya dapat berasal dari katalog yang sudah direview, bukan kemunculan kata negatif. `evidenceQualification` pada Operasional belum dapat diekspresikan evaluator current dan harus tetap HOLD.

## Object rule kandidat

### METEMU-CAND-LEADER-01

```json
{
  "version": "g6a4-candidate-0.1",
  "optionalDimensions": [],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "activationStatus": "review_only",
  "ruleId": "METEMU-CAND-LEADER-01",
  "position": "Leader",
  "requiredDimensions": [
    "directing",
    "collaborating",
    "communicating"
  ],
  "cautionConditions": [
    "C-DIR-04 pada directing bila maknanya disetujui ahli.",
    "C-COMM-04 pada communicating bila relevan dan disetujui ahli.",
    "C-COLL-04 pada collaborating bila relevan dan disetujui ahli."
  ],
  "sourceEvidenceIds": [
    "C-DIR-01",
    "C-DIR-02",
    "C-DIR-03",
    "C-DIR-04",
    "C-COMM-01",
    "C-COMM-02",
    "C-COMM-03",
    "C-COMM-04",
    "C-COLL-01",
    "C-COLL-02",
    "C-COLL-03",
    "C-COLL-04"
  ],
  "mappingRationale": "Hipotesis produk: memberi arah perlu disandingkan dengan hubungan sosial dan pertukaran pesan. Satu kalimat memimpin saja tidak mencukupi tiga kebutuhan tersebut.",
  "alternativeInterpretations": [
    "Dapat menggambarkan fasilitator atau penggerak informal, bukan pejabat Leader.",
    "Dimensi dapat tumpang tindih dan belum membuktikan kepemimpinan partisipatif."
  ],
  "approvalDependencies": [
    "Persetujuan sumber dan makna setiap evidence yang dipakai.",
    "Persetujuan produk atas syarat ketiga dimensi; ini bukan formula tradisional.",
    "Review konflik dan hubungan beberapa tag dari satu asal teks."
  ]
}
```

### METEMU-CAND-MANAGEMENT-01

```json
{
  "version": "g6a4-candidate-0.1",
  "optionalDimensions": [],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "activationStatus": "review_only",
  "ruleId": "METEMU-CAND-MANAGEMENT-01",
  "position": "Management",
  "requiredDimensions": [
    "planning",
    "managing"
  ],
  "cautionConditions": [
    "C-PLAN-03 hanya setelah ahli menentukan apakah keraguan bertindak relevan sebagai caution planning.",
    "Kerapian atau keberuntungan saja tidak memenuhi managing dan planning sekaligus."
  ],
  "sourceEvidenceIds": [
    "C-PLAN-01",
    "C-PLAN-02",
    "C-PLAN-03",
    "C-MAN-01",
    "C-MAN-02",
    "C-MAN-03"
  ],
  "mappingRationale": "Hipotesis produk: pertimbangan langkah bersama penataan proses/sumber daya memberi kecenderungan pengelolaan simbolis. Tidak menyatakan kompetensi bisnis atau keuangan.",
  "alternativeInterpretations": [
    "Teks managing dapat bermakna rumah tangga atau keteraturan diri.",
    "Planning belum menjamin kemampuan menjalankan rencana."
  ],
  "approvalDependencies": [
    "Persetujuan batas planning vs managing.",
    "Persetujuan konteks sumber daya/rumah tangga pada C-MAN-01 dan keuangan pada C-MAN-03.",
    "Tidak memakai nilai peruntungan sebagai bukti."
  ]
}
```

### METEMU-CAND-OPERATIONAL-01

```json
{
  "version": "g6a4-candidate-0.1",
  "optionalDimensions": [],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "activationStatus": "hold_pending_facet_decision",
  "ruleId": "METEMU-CAND-OPERATIONAL-01",
  "position": "Operasional",
  "requiredDimensions": [
    "executing"
  ],
  "cautionConditions": [
    "Wajib memenuhi qualification consistency_or_precision di bawah; tidak cukup sekadar nama dimensi.",
    "Tidak boleh dipakai karena seseorang tidak memenuhi Leader/Management.",
    "Tidak ada caution executing terkurasi pada katalog ini; tidak adanya caution bukan bukti bebas risiko."
  ],
  "sourceEvidenceIds": [
    "C-EXEC-01",
    "C-EXEC-02",
    "C-EXEC-03",
    "C-EXEC-04"
  ],
  "mappingRationale": "Hipotesis produk: tindak lanjut aktivitas dengan konteks konsistensi atau ketelitian mendukung kecenderungan pelaksanaan, tanpa hierarki kemampuan terhadap posisi lain.",
  "alternativeInterpretations": [
    "Konsisten bisa berarti kaku; rapi bisa berarti estetika.",
    "Rajin tidak mengukur produktivitas, kecepatan, ataupun kesediaan mengambil beban."
  ],
  "evidenceQualification": {
    "requiredFacet": "consistency_or_precision",
    "consistencyEvidenceIds": [
      "C-EXEC-02"
    ],
    "precisionEvidenceIds": [
      "C-EXEC-01",
      "C-EXEC-03",
      "C-EXEC-04"
    ],
    "runtimeSupport": "not_implemented"
  },
  "approvalDependencies": [
    "Ahli menyetujui apakah konsistensi atau ketelitian cukup untuk tafsir executing.",
    "Produk memutuskan OR dibanding AND untuk kedua aspek.",
    "Jangan konversi ke runtime sebelum evidenceQualification dapat ditegakkan."
  ]
}
```

### METEMU-CAND-COORDINATOR-01

```json
{
  "version": "g6a4-candidate-0.1",
  "optionalDimensions": [],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "activationStatus": "hold_pending_definition_and_evidence",
  "ruleId": "METEMU-CAND-COORDINATOR-01",
  "position": "Koordinator",
  "requiredDimensions": [
    "communicating",
    "collaborating"
  ],
  "cautionConditions": [
    "Kedua dimensi belum membuktikan penyelarasan aktivitas.",
    "Rule ini tidak boleh diaktifkan meskipun kedua dimensi didukung.",
    "Belum ada sourceEvidenceIds untuk coordinating."
  ],
  "sourceEvidenceIds": [
    "C-COMM-01",
    "C-COMM-02",
    "C-COMM-03",
    "C-COMM-04",
    "C-COLL-01",
    "C-COLL-02",
    "C-COLL-03",
    "C-COLL-04"
  ],
  "mappingRationale": "Bahan diskusi fungsi penghubung, belum memiliki dasar yang cukup untuk membedakan Koordinator dari fasilitator komunikasi umum.",
  "alternativeInterpretations": [
    "Dapat hanya menunjukkan kecenderungan sosial atau komunikasi.",
    "Pembagian aktivitas/jadwal belum didukung interpretasi yang eksplisit."
  ],
  "approvalDependencies": [
    "Definisi fungsi Koordinator dari pemilik produk.",
    "Pembeda domain terhadap komunikasi/kerja sama.",
    "Bukti yang mendukung coordinating atau keputusan menunda posisi."
  ]
}
```


## Co-Leader dan Anggota: tanpa rule buatan

Tidak dibuat object rule Co-Leader karena belum ada indikator yang membedakannya secara memadai dari Leader. Produk boleh mendefinisikan pendamping/delegasi sebagai kebutuhan organisasi, tetapi itu belum memberi dasar kalender untuk memilih pemegangnya.

Anggota merupakan status seluruh input, bukan hasil interpretasi. Tidak dibuat rule fallback Anggota. Evaluator existing memang menolak `position: Anggota` pada [gate:104](../lib/samyoga-position-recommendation.ts#L104). Ketiadaan dasar menghasilkan `insufficient_basis`, bukan “Anggota biasa”.

## Kebijakan konflik

Kontrak current di [evaluator:131](../lib/samyoga-position-recommendation.ts#L131) dan [cabang status:142](../lib/samyoga-position-recommendation.ts#L142):

- Dimensi menjadi konflik jika evidence aktif mendukung dan memberi caution pada dimensi yang sama.
- Konflik memblokir keseluruhan rekomendasi hanya bila menyentuh **setidaknya satu rule yang seluruh support wajibnya terpenuhi**.
- Rule lain yang bersih dapat tetap muncul di `matchedRuleIds`, tetapi tidak menjadi rekomendasi utama selama konflik tersebut ada.
- `alternativePositions` pada status konflik berisi posisi dari preliminary matches, sehingga dapat mencakup posisi yang konflik maupun bersih. Semuanya provisional; UI mendatang harus membedakannya.
- Konflik pada dimensi yang tidak relevan terhadap preliminary match tidak otomatis memblokir.
- Tidak ada support untuk rule apa pun tetap `insufficient_basis` meski evidence mempunyai konflik; status konflik current bukan pelaporan semua pertentangan tanpa kandidat.

### Konsekuensi dua pilihan kebijakan

Semua skenario berikut **sintetis**, menggunakan tag konseptual, bukan tanggal kelahiran atau klaim tradisional.

| Evidence sintetis setelah semua approval | Konflik global current | Usulan konflik per-rule |
| --- | --- | --- |
| directing support+caution; collaborating/communicating support; planning/managing support | conflicting_indicators; Leader dan Management provisional; tidak ada utama | Leader ditahan, Management dapat dipertimbangkan dengan status konflik terpisah |
| directing/communicating/collaborating support; planning support+caution tanpa managing | Leader dapat recommended; rule Management belum lengkap sehingga konflik planning tidak memblokir | Leader juga dapat dipertimbangkan; konflik planning dicatat |
| Semua dimensi wajib dua posisi bersih | multiple_candidates; tidak ada tie-break | Sama |
| Tidak ada evidence/rule approved | insufficient_basis | Sama |

**Rekomendasi G6A.4:** pertahankan kebijakan global current untuk checkpoint dan rancangan awal, sambil meminta keputusan eksplisit P-04. Jangan mengganti evaluasi menjadi per-rule tanpa kontrak output per kandidat (`eligible/blocked/conflicting`) dan cara UI menjelaskannya. Konservatisme global dapat menahan kandidat bersih; per-rule dapat memberi kesan terlalu pasti bila konflik lain disembunyikan. Keduanya keputusan produk, bukan rumus budaya yang telah terbukti.

## Ketidakpastian dan hasil individu

| Status | Arti kontrak |
| --- | --- |
| recommended | Satu posisi eligible setelah semua gate yang kelak disepakati; tidak membuktikan kompetensi |
| multiple_candidates | Beberapa posisi eligible; tampilkan tanpa peringkat berbasis urutan |
| conflicting_indicators | Kebijakan konflik yang disepakati menahan rekomendasi; kandidat provisional |
| insufficient_basis | Tidak ada rule yang memenuhi dasar/approval; tidak diberi posisi pengganti |

Tidak ada nama, urutan anggota, kategori relasi, atau peruntungan yang menjadi tie-break. Hasil per anggota tidak berubah hanya karena orang lain mendapat posisi sama. Penempatan jabatan unik, bila diperlukan, menjadi modul keputusan organisasi terpisah dan tidak otomatis mengikuti kalender.

## Samyoga sebagai konteks

[Engine pasangan:26](../lib/synergy-logic.ts#L26) dan [engine kelompok:245](../lib/samyoga-group.ts#L245) tetap menghasilkan relasi Utama/Madia/Nista. Kategori itu ditampilkan di bagian hubungan, bukan dibawa ke `requiredDimensions`, caution, eligibility, atau priority posisi.

Dilarang menaikkan karena banyak Utama, menurunkan karena banyak Nista, memilih Leader melalui frekuensi kategori, atau mendiskualifikasi anggota. Modul komposisi di masa depan harus terpisah dari rekomendasi individu dan tidak membuat ranking kompetensi.

## Pal Sri Sedana: HOLD

Tidak ada sourceEvidenceIds dari Pal Sri Sedana. Nilai peruntungan tidak menjadi dimensi, bobot, optional bonus, atau tie-break. Daftar keputusan umur/asOfDate/sel kosong ada di [keputusan domain](samyoga-position-domain-decisions.md). Engine existing tidak diubah.

## Jalur menuju G6B

1. Lengkapi dan verifikasi sumber per evidence; catat review beserta konteks.
2. Putuskan enam dimensi dan caution, terutama C-PLAN-03 yang lemah.
3. Putuskan fungsi posisi dan masing-masing pemetaan produk; Co-Leader/Koordinator tetap HOLD bila belum ada dasar.
4. Putuskan kebijakan konflik dan qualification Operasional.
5. Rancang perubahan kontrak dual approval secara eksplisit, lalu unit test semua gate sebelum registry diisi.
6. Uji matriks sintetis dan ketercapaian gabungan indikator pada seluruh siklus kalender; jangan memaksa coverage bila tidak ada anggota yang memenuhi rule.
7. Lakukan domain review terhadap output kasus kalender nyata dengan izin yang sesuai; bukan bukti empiris kompetensi.
8. Aktivasi hanya setelah keputusan eksplisit; dokumen kandidat ini bukan approval.
