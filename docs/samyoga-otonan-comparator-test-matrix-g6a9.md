# Matriks desain pembanding Otonan — G6A.9

**Desain sintetis, bukan hasil kalender, review budaya atau comparator yang diimplementasikan.** Mengikuti [audit domain](samyoga-otonan-leadership-comparator-g6a9.md), [kontrak G6A.7-R1](samyoga-chair-contract-g6a7.md) dan [review sandbox G6A.8-R1](samyoga-chair-review-g6a8r1.md). Tidak mengubah fixture, oracle atau prototipe existing.

## Cara membaca dan prasyarat

A/B/C/D adalah simbol kandidat, tanpa identitas atau tanggal lahir nyata. Semua label approved pada skenario positif adalah **asumsi counterfactual khusus tes**, bukan status evidence katalog atau izin produksi. Tidak ada sourceId/reviewer/approval budaya baru.

Kecuali dinyatakan lain, eligibility Leader hanya diasumsikan untuk menguji kontrak. Mengasumsikan eligibility tidak menyelesaikan comparator. Produksi saat ini tidak memiliki registry atau metode approved, sehingga hasil aktual Q≥2 tetap not_evaluated, bukan hasil skenario positif.

Tiga lapisan harus dibedakan:

1. Kelayakan input dan readiness: jika eligibility belum dapat dibuktikan, pasangan tidak masuk comparator. UNKNOWN pada tabel berarti tidak ada klaim kekuatan; bukan record comparison_applied yang sah.
2. Relasi Otonan: lima status, tanpa kategori/Utama sebagai masukan.
3. Alokasi Ketua: membaca relasi yang valid dan count Samyoga terpisah, hanya setelah dua gerbang dan policy yang diperlukan disetujui.

Pada P04–P06, caution yang aktif mengenai support pada rule Leader lengkap memicu kontrak konflik existing. P19 sengaja membatasi caution di luar **semua** matched rule agar tidak diam-diam mengganti kebijakan konflik global.

## Dua kandidat — 22 kasus desain

| ID | Skenario sintetis | Prasyarat / readiness | Status yang dibenarkan | Alasan |
| --- | --- | --- | --- | --- |
| P01 | Indikator simbolis A dan B identik; aturan kesetaraan belum ada. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Kesamaan data bukan bukti kesetaraan kekuatan. |
| P02 | Keduanya lolos Leader hipotetis dari evidence berbeda; tidak ada aturan relatif. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Lolos syarat biner tidak memberi urutan. |
| P03 | A mempunyai support tambahan tanpa aturan intensitas. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Tambahan support tidak mengubah kekuatan. |
| P04 | A mempunyai caution pada dimensi Leader yang juga didukung. | eligibility_not_confirmed; outside_comparator_scope | **UNKNOWN** | Konflik eligibility existing ditangani lebih dulu; bukan WEAKER. |
| P05 | A dan B mempunyai caution berbeda pada dimensi Leader yang didukung. | eligibility_not_confirmed; outside_comparator_scope | **UNKNOWN** | Jangan banding jumlah atau jenis caution sebagai penalti. |
| P06 | Support dan caution berasal dari satu record dan mengenai dimensi Leader. | eligibility_not_confirmed; outside_comparator_scope | **UNKNOWN** | Tidak saling menghapus; konflik bukan angka neto. |
| P07 | Aturan ordinal per dimensi DIASUMSIKAN approved untuk tes: A unggul directing, B communicating; dimensi lain setara, tidak ada prioritas dimensi. | eligibility_assumed_only; approved_mock_only | **INCOMPARABLE** | Trade-off sah dalam asumsi partial-order; tanpa asumsi tersebut hasil aktual UNKNOWN. |
| P08 | Aturan ordinal per dimensi DIASUMSIKAN approved untuk tes: A unggul communicating, B collaborating; dimensi lain setara, tanpa prioritas. | eligibility_assumed_only; approved_mock_only | **INCOMPARABLE** | Tidak menjumlahkan dimensi yang dimenangkan. |
| P09 | Seluruh evidence DIASUMSIKAN approved, tetapi rule pembanding belum approved. | eligibility_assumed_only; method_unapproved | **UNKNOWN** | Approval evidence tidak menjadi approval metode relatif. |
| P10 | Satu evidence wajib masih pending review; anggota lain lengkap dalam asumsi tes. | eligibility_not_confirmed; outside_comparator_scope | **UNKNOWN** | Evidence yang belum sah tidak dipakai untuk kelayakan/kekuatan. |
| P11 | Provenance satu evidence wajib missing walaupun ada label support. | eligibility_not_confirmed; outside_comparator_scope | **UNKNOWN** | Label support tidak mengganti provenance. |
| P12 | Rule produk Leader belum approved walaupun teks sudah diasumsikan verified. | eligibility_not_confirmed; outside_comparator_scope | **UNKNOWN** | Dua approval terpisah; tidak menyatakan NOT_QUALIFIED dari approval yang hilang. |
| P13 | Kombinasi kalender A dan B berbeda, hasil dimensi sama; tidak ada rule equality. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Kesamaan himpunan dimensi tidak otomatis EQUIVALENT. |
| P14 | Data lengkap dan metode parsial DIASUMSIKAN approved secara eksplisit menyatakan kedua profil sah tidak mempunyai urutan. | eligibility_assumed_only; approved_mock_only | **INCOMPARABLE** | Dasar ketidakterurutan tersedia, berbeda dari sekadar tidak tahu. |
| P15 | Tidak terbukti ada perbedaan; aturan kesetaraan belum tersedia. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Ketiadaan bukti perbedaan bukan bukti equality. |
| P16 | Aturan relatif dan basis perbandingan A terhadap B DIASUMSIKAN approved, berlaku dan eksplisit membuktikan A lebih kuat pada scope simbolis yang sama. | eligibility_assumed_only; approved_mock_only | **STRONGER** | Kontrol positif logika; bukan aturan budaya nyata. |
| P17 | P16 dengan orientasi B terhadap A dan basis/rule yang sama. | eligibility_assumed_only; approved_mock_only | **WEAKER** | Pembalikan konsisten, bukan inferensi dari UNKNOWN. |
| P18 | Aturan equality simbolis eksplisit dan basisnya DIASUMSIKAN approved; berlaku pada A/B dan koheren ke pihak ketiga. | eligibility_assumed_only; approved_mock_only | **EQUIVALENT** | Kesetaraan hanya pada scope aturan, bukan kompetensi manusia. |
| P19 | A tidak mempunyai caution terkurasi; B punya caution di luar semua rule lengkap yang cocok. Keduanya tetap lolos pada asumsi eligibility; metode relatif belum ada. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Tidak ada caution bukan kekuatan lebih tinggi; kasus berbeda dari P04. |
| P20 | Urip atau banyaknya tag A lebih besar; tidak ada aturan relatif leadership. | eligibility_assumed_only; method_unavailable | **UNKNOWN** | Nilai kalender/coverage tidak menjadi skor pemimpin. |
| P21 | Metode DIASUMSIKAN approved sudah diterapkan, tetapi basis pasangan tertentu tidak cukup; reason eksplisit. | eligibility_assumed_only; applied_mock_unknown | **UNKNOWN** | Record unknown sah tidak menghasilkan edge; bukan metode global unavailable. |
| P22 | Ada aturan relatif untuk konteks lain, tetapi scope atau versi snapshot tidak cocok. | eligibility_assumed_only; method_inapplicable | **UNKNOWN** | Jangan memindahkan prioritas lintas domain atau versi. |

P01–P15 memenuhi seluruh 15 skenario wajib. P07/P08 berbeda dari sekadar kata unggul tanpa definisi: relasi ordinal per dimensi sengaja diasumsikan sah untuk menguji trade-off. Bila asumsi itu dicabut, gunakan UNKNOWN. Sama-sama Leader tidak otomatis EQUIVALENT meskipun sumber evidence sudah approved.

P16/P17/P18 hanya membuktikan **bentuk kontrak yang mungkin**, bukan keberadaan dasar tradisional. P21 membedakan keterbatasan pasangan pada metode valid dari metode yang tidak tersedia. Input malformed harus ditolak sebagai invalid; jangan mengubahnya menjadi hasil sah UNKNOWN/INCOMPARABLE.

## Registry kasus desain untuk pemeriksaan dokumentasi

JSON ini hanya deskripsi readiness/expected, tidak diimpor aplikasi atau sandbox dan tidak mengimplementasikan algoritma. `approved_mock_only` menyatakan asumsi logis yang belum ada di produksi. Tidak ada basis budaya baru di dalamnya.

```json
[
  {
    "id": "P01",
    "scenario": "Indikator simbolis A dan B identik; aturan kesetaraan belum ada.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Kesamaan data bukan bukti kesetaraan kekuatan."
  },
  {
    "id": "P02",
    "scenario": "Keduanya lolos Leader hipotetis dari evidence berbeda; tidak ada aturan relatif.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Lolos syarat biner tidak memberi urutan."
  },
  {
    "id": "P03",
    "scenario": "A mempunyai support tambahan tanpa aturan intensitas.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Tambahan support tidak mengubah kekuatan."
  },
  {
    "id": "P04",
    "scenario": "A mempunyai caution pada dimensi Leader yang juga didukung.",
    "eligibility": "eligibility_not_confirmed",
    "basis": "outside_comparator_scope",
    "expected": "UNKNOWN",
    "reason": "Konflik eligibility existing ditangani lebih dulu; bukan WEAKER."
  },
  {
    "id": "P05",
    "scenario": "A dan B mempunyai caution berbeda pada dimensi Leader yang didukung.",
    "eligibility": "eligibility_not_confirmed",
    "basis": "outside_comparator_scope",
    "expected": "UNKNOWN",
    "reason": "Jangan banding jumlah atau jenis caution sebagai penalti."
  },
  {
    "id": "P06",
    "scenario": "Support dan caution berasal dari satu record dan mengenai dimensi Leader.",
    "eligibility": "eligibility_not_confirmed",
    "basis": "outside_comparator_scope",
    "expected": "UNKNOWN",
    "reason": "Tidak saling menghapus; konflik bukan angka neto."
  },
  {
    "id": "P07",
    "scenario": "Aturan ordinal per dimensi DIASUMSIKAN approved untuk tes: A unggul directing, B communicating; dimensi lain setara, tidak ada prioritas dimensi.",
    "eligibility": "eligibility_assumed_only",
    "basis": "approved_mock_only",
    "expected": "INCOMPARABLE",
    "reason": "Trade-off sah dalam asumsi partial-order; tanpa asumsi tersebut hasil aktual UNKNOWN."
  },
  {
    "id": "P08",
    "scenario": "Aturan ordinal per dimensi DIASUMSIKAN approved untuk tes: A unggul communicating, B collaborating; dimensi lain setara, tanpa prioritas.",
    "eligibility": "eligibility_assumed_only",
    "basis": "approved_mock_only",
    "expected": "INCOMPARABLE",
    "reason": "Tidak menjumlahkan dimensi yang dimenangkan."
  },
  {
    "id": "P09",
    "scenario": "Seluruh evidence DIASUMSIKAN approved, tetapi rule pembanding belum approved.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unapproved",
    "expected": "UNKNOWN",
    "reason": "Approval evidence tidak menjadi approval metode relatif."
  },
  {
    "id": "P10",
    "scenario": "Satu evidence wajib masih pending review; anggota lain lengkap dalam asumsi tes.",
    "eligibility": "eligibility_not_confirmed",
    "basis": "outside_comparator_scope",
    "expected": "UNKNOWN",
    "reason": "Evidence yang belum sah tidak dipakai untuk kelayakan/kekuatan."
  },
  {
    "id": "P11",
    "scenario": "Provenance satu evidence wajib missing walaupun ada label support.",
    "eligibility": "eligibility_not_confirmed",
    "basis": "outside_comparator_scope",
    "expected": "UNKNOWN",
    "reason": "Label support tidak mengganti provenance."
  },
  {
    "id": "P12",
    "scenario": "Rule produk Leader belum approved walaupun teks sudah diasumsikan verified.",
    "eligibility": "eligibility_not_confirmed",
    "basis": "outside_comparator_scope",
    "expected": "UNKNOWN",
    "reason": "Dua approval terpisah; tidak menyatakan NOT_QUALIFIED dari approval yang hilang."
  },
  {
    "id": "P13",
    "scenario": "Kombinasi kalender A dan B berbeda, hasil dimensi sama; tidak ada rule equality.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Kesamaan himpunan dimensi tidak otomatis EQUIVALENT."
  },
  {
    "id": "P14",
    "scenario": "Data lengkap dan metode parsial DIASUMSIKAN approved secara eksplisit menyatakan kedua profil sah tidak mempunyai urutan.",
    "eligibility": "eligibility_assumed_only",
    "basis": "approved_mock_only",
    "expected": "INCOMPARABLE",
    "reason": "Dasar ketidakterurutan tersedia, berbeda dari sekadar tidak tahu."
  },
  {
    "id": "P15",
    "scenario": "Tidak terbukti ada perbedaan; aturan kesetaraan belum tersedia.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Ketiadaan bukti perbedaan bukan bukti equality."
  },
  {
    "id": "P16",
    "scenario": "Aturan relatif dan basis perbandingan A terhadap B DIASUMSIKAN approved, berlaku dan eksplisit membuktikan A lebih kuat pada scope simbolis yang sama.",
    "eligibility": "eligibility_assumed_only",
    "basis": "approved_mock_only",
    "expected": "STRONGER",
    "reason": "Kontrol positif logika; bukan aturan budaya nyata."
  },
  {
    "id": "P17",
    "scenario": "P16 dengan orientasi B terhadap A dan basis/rule yang sama.",
    "eligibility": "eligibility_assumed_only",
    "basis": "approved_mock_only",
    "expected": "WEAKER",
    "reason": "Pembalikan konsisten, bukan inferensi dari UNKNOWN."
  },
  {
    "id": "P18",
    "scenario": "Aturan equality simbolis eksplisit dan basisnya DIASUMSIKAN approved; berlaku pada A/B dan koheren ke pihak ketiga.",
    "eligibility": "eligibility_assumed_only",
    "basis": "approved_mock_only",
    "expected": "EQUIVALENT",
    "reason": "Kesetaraan hanya pada scope aturan, bukan kompetensi manusia."
  },
  {
    "id": "P19",
    "scenario": "A tidak mempunyai caution terkurasi; B punya caution di luar semua rule lengkap yang cocok. Keduanya tetap lolos pada asumsi eligibility; metode relatif belum ada.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Tidak ada caution bukan kekuatan lebih tinggi; kasus berbeda dari P04."
  },
  {
    "id": "P20",
    "scenario": "Urip atau banyaknya tag A lebih besar; tidak ada aturan relatif leadership.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_unavailable",
    "expected": "UNKNOWN",
    "reason": "Nilai kalender/coverage tidak menjadi skor pemimpin."
  },
  {
    "id": "P21",
    "scenario": "Metode DIASUMSIKAN approved sudah diterapkan, tetapi basis pasangan tertentu tidak cukup; reason eksplisit.",
    "eligibility": "eligibility_assumed_only",
    "basis": "applied_mock_unknown",
    "expected": "UNKNOWN",
    "reason": "Record unknown sah tidak menghasilkan edge; bukan metode global unavailable."
  },
  {
    "id": "P22",
    "scenario": "Ada aturan relatif untuk konteks lain, tetapi scope atau versi snapshot tidak cocok.",
    "eligibility": "eligibility_assumed_only",
    "basis": "method_inapplicable",
    "expected": "UNKNOWN",
    "reason": "Jangan memindahkan prioritas lintas domain atau versi."
  }
]
```

## Invariants multi-kandidat dan uji adversarial

Semua baris M memakai relasi counterfactual yang memenuhi approval fixture, kecuali baris yang memang menguji kegagalan readiness/validitas. Untuk relasi valid, sediakan setiap pasangan unik eksplisit. Tidak mengisi pasangan yang hilang.

| ID | Kondisi | Hasil/konsekuensi desain |
| --- | --- | --- |
| M01 | A STRONGER B, orientasi dibalik | B WEAKER A; basis dan scope sama. |
| M02 | A EQUIVALENT B, atau A INCOMPARABLE B, atau A UNKNOWN B | Pembalikan mempertahankan status yang sama; UNKNOWN tidak berubah menjadi equality. |
| M03 | A~B dan A>C, tetapi B–C UNKNOWN | Tidak koheren terhadap kelas setara: invalid, allocator not_evaluated. Jangan mengisi B>C. Persis risiko yang diperbaiki G6A.8-R1. |
| M04 | A~B, A–C UNKNOWN, B–C UNKNOWN | Koheren sebagai ketidakpastian; tidak ada edge ke C. Bila tidak ada dominator universal, undetermined pada evaluasi yang sah. |
| M05 | A~B, A>C, B>C | Kelas setara koheren. Count Utama baru boleh membedakan A/B sesuai policy hipotetis approved; bukan dari ID. |
| M06 | A~B dan B~C tetapi A–C UNKNOWN atau STRONGER | Klaim kelas equality bertentangan: invalid, not_evaluated. Jangan memaksakan closure. |
| M07 | A>B, B>C, C>A | Siklus strict ditolak walau metode tidak mengklaim transitif; not_evaluated. |
| M08 | A>B dan B>C, A–C UNKNOWN; metode mengklaim transitif | Data tidak mendukung klaim metode: not_evaluated. Jangan mengisi A>C lewat fallback allocator. |
| M09 | A>B dan B>C, A–C UNKNOWN; metode tidak mengklaim transitif | Graf parsial boleh koheren, tetapi A belum mendominasi C; jangan klaim transitivitas/Chair universal. |
| M10 | Satu record pasangan hilang, duplikat reverse, basis invalid atau beda versi | Invalid, not_evaluated; bukan undetermined dari comparator yang selesai. |
| M11 | Urutan kandidat/perbandingan dipermutasi, pasangan dibalik, ID/nama diganti | Relasi semantik dan keputusan tetap sama setelah pemetaan balik. ID hanya canonical storage, tidak memberi prioritas. |
| M12 | A mendominasi B dan C secara sah; B–C UNKNOWN/INCOMPARABLE, tidak ada equality/cycle yang tidak koheren | A tetap dominator universal; ketidakpastian antara B/C tidak menghapus bukti A. B/C tidak otomatis Wakil. |
| M13 | Hanya ada satu kandidat nondominated, tetapi tidak terbukti mendominasi semua | Jangan menunjuk Ketua; undetermined atau conflicting_priority menurut graf yang sah. |
| M14 | EQUIVALENT dibentuk dari jumlah support/dimensi sama | Tolak dasar equality; metode/basis unavailable → not_evaluated, bukan pemecah seri Utama. |

R1 menuntut konsekuensi EQUIVALENT terhadap pihak ketiga sama **termasuk UNKNOWN**. Equality yang hanya cocok pada beberapa pasangan tetapi gagal substitusi tidak boleh dipakai sebagai kelas kesetaraan comparator ini. Bila domain kelak hanya memberi kemiripan lokal, jangan menyebutnya EQUIVALENT dalam kontrak ini; ajukan desain baru untuk review.

Kebijakan transitivitas harus dinyatakan versi metode, bukan ditambahkan allocator. Ketidakadaan klaim transitif bukan izin siklus, relasi kebalikan yang salah, atau kelas equality yang tidak koheren. Tidak ada total ordering wajib atau tie-break identitas.

## Konsekuensi pada Ketua, tanpa mencampur masukan comparator

Seluruh contoh A di bawah **bersyarat**: sumber, rule Leader, dua gerbang, comparator dan policy alokasi sudah approved/valid dalam fixture, kecuali A01. Count Utama adalah jumlah edge Samyoga, bukan strength Otonan dan tidak masuk comparator. Count harus dapat direalisasikan oleh graf kelompok existing, bukan summary bebas.

| ID | Relasi Otonan / kondisi | Jumlah Utama A terhadap B | Konsekuensi |
| --- | --- | --- | --- |
| A01 | Metode belum tersedia/disetujui | Berapa pun | Q≥2: not_evaluated, Ketua/Wakil null. |
| A02 | UNKNOWN eksplisit dalam metode yang valid, hanya dua kandidat Q | Lebih banyak | Tidak ada dominasi; undetermined, bukan Ketua dari count. |
| A03 | INCOMPARABLE sah, hanya dua kandidat Q | Lebih banyak | Tidak ada dominasi; undetermined. |
| A04 | EQUIVALENT sah dan koheren | Lebih banyak | A mendominasi B hanya menurut policy count yang kelak disetujui. |
| A05 | STRONGER sah | Sama atau lebih banyak | A mendominasi B; bukan bukti otomatis mendominasi semua kandidat Q lainnya. |
| A06 | STRONGER sah | Lebih sedikit | Konflik prioritas bila tidak ada dominator universal; jangan menambah bobot. |
| A07 | EQUIVALENT sah | Sama | Seri, tidak ada Ketua/Wakil paksa. |
| A08 | Q≥3 dan satu kandidat mendominasi setiap kandidat lain | Graf koheren | Dapat mengusulkan Ketua, tanpa Wakil otomatis. |
| A09 | Q≥3 dan tidak ada dominator universal | Graf koheren | conflicting_priority bila ada arah indikator yang berlawanan; selain itu undetermined. |
| A10 | Q=0 atau Q=1 | Tidak perlu comparator antaranggota Q | Ikuti kontrak existing dan semua approval/readiness; registry kosong bukan bukti no_qualified_candidate. |

Status `chair_and_deputy_proposed` masih tercantum dalam desain G6A.7, tetapi sandbox G6A.8 saat ini tidak mempunyai kebijakan Wakil approved dan tidak mengusulkan Wakil. G6A.9 tidak membuat kebijakan tersebut.

## Pelaksanaan validasi

- **22 kasus P, 14 kasus M, 10 kasus A** adalah matriks desain, direview terhadap kontrak lima status dan invariants G6A.7/R1. Bukan 46 unit test comparator baru dan bukan kalender nyata.
- Pemeriksaan ad hoc memvalidasi struktur/ID/expected registry P dan referensi dokumen. Tidak mengklaim menguji comparator yang belum dibuat.
- Regression nyata tetap memakai `npm.cmd run test:samyoga`, termasuk oracle prototipe, review equivalence UNKNOWN, approval gate, engine pasangan/kelompok dan timezone.
- Tidak ada edit tes atau fixture existing. Hasil aktual dan batas pengujian ada di [catatan keputusan](samyoga-otonan-comparator-decisions-g6a9.md).

