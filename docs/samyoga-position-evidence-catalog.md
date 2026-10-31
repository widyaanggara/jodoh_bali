# Katalog evidence Otonan kandidat — G6A.4

Status: **READY FOR DOMAIN DECISION; rekomendasi produksi nonaktif**.

Baseline: branch `feat/samyoga-group`, commit `13892cea1603d3a134d6480323adecf419923842` (G6A.3-R1). Working tree awal bersih. Checkpoint `abba71b` terverifikasi sebagai ancestor. Tidak ada commit dibuat pada G6A.4.

Katalog ini mencatat teks repository, lalu mengusulkan pemaknaan produk secara terpisah. Kebenaran budaya teks belum dibuktikan. Katalog bukan registry runtime, tidak diimpor aplikasi, dan tidak mengaktifkan evidence. `candidate`, `needs_source_verification`, `needs_domain_review`, dan `rejected` adalah lifecycle dokumen. Seluruh 22 evidence yang dipertahankan saat ini `needs_source_verification`, `domainReviewStatus: pending`, `productApprovalStatus: pending`.

Dokumen terkait: [dimensi](samyoga-position-dimensions.md), [ruleset](samyoga-position-ruleset-review.md), [keputusan domain](samyoga-position-domain-decisions.md).

## Cakupan dan metode

Terdapat 5 keluarga indikator, 14 konteks indikator/siklus, **132 identitas record** dan **311 field interpretasi**. Jumlah record master fisik unik: **120**; 12 record Saptawara/Pancawara direferensikan ulang pada konteks Wewaran. Ini hitungan katalog, bukan jumlah evidence independen atau skor.

| Konteks | Record | Field teks |
| --- | ---: | ---: |
| saptawara | 7 | 14 |
| pancawara | 5 | 5 |
| wuku | 30 | 120 |
| wewaran/ekawara | 1 | 1 |
| wewaran/dwiwara | 2 | 2 |
| wewaran/triwara | 3 | 3 |
| wewaran/caturwara | 4 | 4 |
| wewaran/pancawara | 5 | 5 |
| wewaran/sadwara | 6 | 18 |
| wewaran/saptawara | 7 | 7 |
| wewaran/asatawara | 8 | 8 |
| wewaran/sangawara | 9 | 9 |
| wewaran/dasawara | 10 | 10 |
| lintang | 35 | 105 |

Inventaris menyalin semua field interpretasi yang diekspos adapter: Saptawara `sifat/karakter`, Pancawara `karakter`, Wuku `deskripsi/sifat_umum/kelebihan/kelemahan`, Wewaran `karakter` (Sadwara: `arti/sifat/pesan`), Lintang `label/makna/penjelasan`. Nilai urip adalah hasil/data kalender dan tidak diubah menjadi kecakapan. `rekomendasi_pasangan` Wuku merupakan konteks pasangan, dikecualikan dari evidence posisi. Zodiak, skor perjodohan umum, dan Pal Sri Sedana juga dikecualikan.

Ekawara dapat menghasilkan `-` sebagai ketiadaan Luang; tidak ada record karakter untuk nilai tersebut, sehingga tidak dibuat interpretasi pengganti. Ejaan `asatawara`, `Menail`, dan nama lainnya mengikuti kode existing.

Penyalinan teks dan nomor baris dilakukan secara mekanis melalui AST TypeScript. Pemilihan 22 kandidat dan alasannya merupakan kurasi eksplisit per record/field; tidak ada klasifikasi keyword, sentiment analysis, atau tag yang dibuat otomatis untuk record lain. Referensi lokasi adalah nomor baris sumber pada baseline tersebut, bukan halaman buku.

## Provenance yang tersedia

[About:667](../app/about/page.tsx#L667) sampai bagian daftar pustakanya mencantumkan Kusuma (*Wariga Dewasa*, 1979), Ardhana (*Pokok-pokok Wariga*, 2009), Rini (*Astrologi Hindu*, 2012), Aryana (*Tenung Wariga-Kunci Ramalan Astrologi Bali*, 2010), Arwati (*Ramalan Terhadap Hari Kelahiran Manusia*, 2010), dan Saelan (*Logika Fuzzy*, 2009). [About:687](../app/about/page.tsx#L687) dan [About:696](../app/about/page.tsx#L696) juga mencantumkan tautan Palintangan serta artikel Merpati. Ini **klaim bibliografi global repository**, bukan penetapan bahwa setiap kalimat di bawah berasal dari buku/artikel tertentu. Tidak ada pencocokan halaman buku yang berhasil dibuktikan pada milestone ini; sumber eksternal tidak diverifikasi ulang.

Untuk seluruh entri inventaris dan kandidat: sumber budaya spesifik `unknown`, `sourceId: null`, `sourcePage: null`, `provenanceStatus: missing`. Kata “missing” berarti hubungan ke sumber spesifik belum tersedia, bukan berarti tradisinya tidak ada. Jangan menjadikan path `lib/data.ts` sebagai sourceId budaya. Peninjau harus menyediakan edisi, halaman atau locator dokumen, serta kecocokan tafsir sebelum verifikasi dapat dinaikkan.

## Katalog kandidat prioritas

22 kandidat: 18 support dan 4 caution. Dukungan teks eksplisit tidak sama dengan verifikasi sumber atau validasi jabatan.

| Dimensi | Support | Caution | Total |
| --- | ---: | ---: | ---: |
| directing | 3 | 1 | 4 |
| planning | 2 | 1 | 3 |
| managing | 3 | 0 | 3 |
| communicating | 3 | 1 | 4 |
| executing | 4 | 0 | 4 |
| collaborating | 3 | 1 | 4 |

Tidak ada kandidat `coordinating`. C-DIR-01 dan C-MAN-02 berasal dari kalimat/field yang sama; dua tag tidak menjadi dua bukti. Identitas teknis evidence tetap menyertakan cycle. Saat review lintas Saptawara/Pancawara, alias stand-alone dan Wewaran dari record yang sama harus ditautkan sebagai satu asal sumber.

### C-DIR-01 — directing / support

```json
{
  "evidenceId": "C-DIR-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "asatawara",
  "indicatorValue": "Sri",
  "masterRecordId": "wewaran:asatawara:1",
  "sourceField": "karakter",
  "excerpt": "Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 437
  },
  "dimension": "directing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kalimat menyebut mengatur, kerapian bekerja, dan kecenderungan memimpin secara eksplisit; memberi bahan tafsir pengarahan, bukan penetapan Leader tunggal.",
  "alternativeInterpretations": "Mengatur dapat berarti keteraturan pribadi; bagian kerapian juga dapat dibahas sebagai managing.",
  "interpretationRisk": "Satu kalimat dipakai pada dua dimensi (C-MAN-02); bukan dua bukti independen."
}
```

Lokasi kutipan: [lib/data.ts:437](../lib/data.ts#L437). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-DIR-02 — directing / support

```json
{
  "evidenceId": "C-DIR-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "dasawara",
  "indicatorValue": "Raja",
  "masterRecordId": "wewaran:dasawara:8",
  "sourceField": "karakter",
  "excerpt": "Berjiwa besar, kharismatik, dan berbakat mengatur orang.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 467
  },
  "dimension": "directing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Klausa mengatur orang mendukung hipotesis pengarahan dalam konteks wibawa dan karisma.",
  "alternativeInterpretations": "Dapat dibaca sebagai pengaruh sosial atau otoritas, bukan kepemimpinan partisipatif.",
  "interpretationRisk": "Karisma tidak membuktikan pengambilan keputusan, tanggung jawab, atau etika kepemimpinan."
}
```

Lokasi kutipan: [lib/data.ts:467](../lib/data.ts#L467). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-DIR-03 — directing / support

```json
{
  "evidenceId": "C-DIR-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Sinta",
  "masterRecordId": "wuku:1",
  "sourceField": "sifat_umum",
  "excerpt": "Tegas, agak kaku, berjiwa pemimpin.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 9
  },
  "dimension": "directing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Teks secara bersamaan menyebut kepemimpinan, ketegasan, dan kekakuan; dukungan pengarahan harus dibaca bersama C-DIR-04.",
  "alternativeInterpretations": "Ketegasan dapat berarti teguh terhadap pendapat sendiri tanpa mengarahkan orang lain.",
  "interpretationRisk": "Tidak boleh mengekstrak frasa positif lalu membuang konteks agak kaku."
}
```

Lokasi kutipan: [lib/data.ts:9](../lib/data.ts#L9). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-DIR-04 — directing / caution

```json
{
  "evidenceId": "C-DIR-04",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Sinta",
  "masterRecordId": "wuku:1",
  "sourceField": "kelemahan",
  "excerpt": "Keras kepala, sulit menerima kritik.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 11
  },
  "dimension": "directing",
  "polarity": "caution",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kesulitan menerima kritik menjadi pertanyaan domain tentang keterbukaan saat memberi arah, terkait C-DIR-03.",
  "alternativeInterpretations": "Ini juga dapat berkaitan dengan komunikasi atau sikap mempertahankan prinsip; tidak otomatis blocker.",
  "interpretationRisk": "Caution ini masih inferensi; konflik same-dimension belum boleh diaktifkan tanpa persetujuan."
}
```

Lokasi kutipan: [lib/data.ts:11](../lib/data.ts#L11). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-PLAN-01 — planning / support

```json
{
  "evidenceId": "C-PLAN-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "asatawara",
  "indicatorValue": "Indra",
  "masterRecordId": "wewaran:asatawara:2",
  "sourceField": "karakter",
  "excerpt": "Visioner, berbakat dalam perencanaan, dan sangat tekun.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 438
  },
  "dimension": "planning",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Perencanaan disebut eksplisit bersama orientasi ke depan dan ketekunan.",
  "alternativeInterpretations": "Bisa berarti aspirasi atau ketekunan individu, bukan rencana kerja organisasi.",
  "interpretationRisk": "Tidak ada ukuran kualitas, realisme, atau pelaksanaan rencana."
}
```

Lokasi kutipan: [lib/data.ts:438](../lib/data.ts#L438). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-PLAN-02 — planning / support

```json
{
  "evidenceId": "C-PLAN-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "sangawara",
  "indicatorValue": "Urungan",
  "masterRecordId": "wewaran:sangawara:7",
  "sourceField": "karakter",
  "excerpt": "Penuh pertimbangan dan sangat hati-hati dalam melangkah.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 454
  },
  "dimension": "planning",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Pertimbangan dan kehati-hatian sebelum melangkah memberi hipotesis deliberasi.",
  "alternativeInterpretations": "Kehati-hatian dapat berarti penghindaran risiko; belum tentu menghasilkan rencana.",
  "interpretationRisk": "Dukungan lebih tidak langsung dibanding C-PLAN-01."
}
```

Lokasi kutipan: [lib/data.ts:454](../lib/data.ts#L454). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-PLAN-03 — planning / caution

```json
{
  "evidenceId": "C-PLAN-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Pujut",
  "masterRecordId": "wuku:15",
  "sourceField": "kelemahan",
  "excerpt": "Lamban bertindak, suka ragu.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 137
  },
  "dimension": "planning",
  "polarity": "caution",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Keraguan dan lambat bertindak perlu ditinjau sebagai batas tafsir deliberasi yang berlebihan, bukan cacat kemampuan.",
  "alternativeInterpretations": "Kelambatan bisa mencerminkan kehati-hatian yang adaptif; bukan bukti buruk merencanakan.",
  "interpretationRisk": "Pemetaan ke planning lemah; ahli boleh menolak tag ini."
}
```

Lokasi kutipan: [lib/data.ts:137](../lib/data.ts#L137). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-MAN-01 — managing / support

```json
{
  "evidenceId": "C-MAN-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "triwara",
  "indicatorValue": "Beteng",
  "masterRecordId": "wewaran:triwara:2",
  "sourceField": "karakter",
  "excerpt": "Berjiwa pelindung, pandai mengelola sumber daya, dan makmur.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 353
  },
  "dimension": "managing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Pengelolaan sumber daya disebut eksplisit dalam kalimat yang juga memuat pelindung dan kemakmuran.",
  "alternativeInterpretations": "Dapat merujuk konteks rumah tangga atau simbol kesejahteraan.",
  "interpretationRisk": "Klaim makmur dalam kalimat tidak ikut dijadikan bukti kompetensi."
}
```

Lokasi kutipan: [lib/data.ts:353](../lib/data.ts#L353). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-MAN-02 — managing / support

```json
{
  "evidenceId": "C-MAN-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "asatawara",
  "indicatorValue": "Sri",
  "masterRecordId": "wewaran:asatawara:1",
  "sourceField": "karakter",
  "excerpt": "Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 437
  },
  "dimension": "managing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kerapian bekerja dan pengaturan mendukung hipotesis penataan proses pada teks yang sama dengan C-DIR-01.",
  "alternativeInterpretations": "Dapat merupakan keteraturan diri, bukan pengelolaan sumber daya kelompok.",
  "interpretationRisk": "Jangan menghitung C-DIR-01 dan C-MAN-02 sebagai sumber independen."
}
```

Lokasi kutipan: [lib/data.ts:437](../lib/data.ts#L437). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-MAN-03 — managing / support

```json
{
  "evidenceId": "C-MAN-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Kuningan",
  "masterRecordId": "wuku:12",
  "sourceField": "kelebihan",
  "excerpt": "Sangat teliti dalam keuangan dan aturan.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 109
  },
  "dimension": "managing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Teks mengaitkan ketelitian dengan keuangan dan aturan; layak dibahas sebagai simbol keteraturan terbatas.",
  "alternativeInterpretations": "Ketelitian ini juga bisa berkaitan dengan executing; bukan bukti perencanaan anggaran.",
  "interpretationRisk": "Berisiko menyamakan ramalan dengan kompetensi profesional keuangan; batasnya harus eksplisit."
}
```

Lokasi kutipan: [lib/data.ts:109](../lib/data.ts#L109). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COMM-01 — communicating / support

```json
{
  "evidenceId": "C-COMM-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "dwiwara",
  "indicatorValue": "Menga",
  "masterRecordId": "wewaran:dwiwara:1",
  "sourceField": "karakter",
  "excerpt": "Terbuka, komunikatif, dan mudah menerima masukan dari luar.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 347
  },
  "dimension": "communicating",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Komunikasi muncul bersama keterbukaan dan penerimaan masukan; konteks lebih lengkap daripada hanya pandai bicara.",
  "alternativeInterpretations": "Keterbukaan dapat merupakan kerja sama atau sikap menerima pengaruh luar.",
  "interpretationRisk": "Tidak membuktikan akurasi pesan, kemampuan mendengar, atau penyelesaian konflik nyata."
}
```

Lokasi kutipan: [lib/data.ts:347](../lib/data.ts#L347). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COMM-02 — communicating / support

```json
{
  "evidenceId": "C-COMM-02",
  "indicatorType": "pancawara",
  "wewaranCycle": null,
  "indicatorValue": "Kliwon",
  "masterRecordId": "pancawara:5",
  "sourceField": "karakter",
  "excerpt": "Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 370
  },
  "dimension": "communicating",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Pandai berbicara memberi hipotesis ekspresi verbal; pemaaf dan spiritualitas tetap menjadi konteks kalimat.",
  "alternativeInterpretations": "Kefasihan berbicara bisa bersifat retoris, bukan pertukaran informasi yang efektif.",
  "interpretationRisk": "Tidak boleh menganggap spiritualitas sebagai kemampuan kerja."
}
```

Lokasi kutipan: [lib/data.ts:370](../lib/data.ts#L370). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COMM-03 — communicating / support

```json
{
  "evidenceId": "C-COMM-03",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Tiwa-tiwa",
  "masterRecordId": "lintang:Buda:Kliwon",
  "sourceField": "penjelasan",
  "excerpt": "Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 549
  },
  "dimension": "communicating",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kemampuan merangkai kata dijelaskan bersama kesantunan dan sensitivitas; kandidat ekspresi verbal/tulis terbatas.",
  "alternativeInterpretations": "Mengarang dapat merujuk karya sastra, tidak sama dengan koordinasi tugas.",
  "interpretationRisk": "Bagian sensitif/mudah tersinggung tidak boleh dihilangkan dari penjelasan pengguna."
}
```

Lokasi kutipan: [lib/data.ts:549](../lib/data.ts#L549). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COMM-04 — communicating / caution

```json
{
  "evidenceId": "C-COMM-04",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Begoong",
  "masterRecordId": "lintang:Saniscara:Umanis",
  "sourceField": "penjelasan",
  "excerpt": "Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 797
  },
  "dimension": "communicating",
  "polarity": "caution",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kalimat menyebut bicara tajam dan mencampuri urusan orang lain sekaligus keberanian dan keterampilan; membutuhkan pembacaan utuh.",
  "alternativeInterpretations": "Bicara tajam dapat berarti langsung atau kritis, bukan komunikasi yang buruk.",
  "interpretationRisk": "Caution ini bukan alasan menilai seseorang tidak layak memimpin; perlu penentuan konteks oleh ahli."
}
```

Lokasi kutipan: [lib/data.ts:797](../lib/data.ts#L797). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-EXEC-01 — executing / support

```json
{
  "evidenceId": "C-EXEC-01",
  "indicatorType": "saptawara",
  "wewaranCycle": null,
  "indicatorValue": "Buda",
  "masterRecordId": "saptawara:4",
  "sourceField": "karakter",
  "excerpt": "Cerdas, teliti dalam bekerja, dan sangat menghargai aturan.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 430
  },
  "dimension": "executing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Ketelitian dalam bekerja dan penghargaan aturan lebih spesifik terhadap pelaksanaan aktivitas daripada sifat cerdas saja.",
  "alternativeInterpretations": "Dapat menggambarkan preferensi keteraturan; belum membuktikan ketekunan.",
  "interpretationRisk": "Tidak cukup sebagai satu-satunya bukti konsistensi untuk rule Operasional."
}
```

Lokasi kutipan: [lib/data.ts:430](../lib/data.ts#L430). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-EXEC-02 — executing / support

```json
{
  "evidenceId": "C-EXEC-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "sangawara",
  "indicatorValue": "Dangu",
  "masterRecordId": "wewaran:sangawara:1",
  "sourceField": "karakter",
  "excerpt": "Tenang, konsisten, dan tidak suka terburu-buru.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 448
  },
  "dimension": "executing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Konsistensi dan tidak terburu-buru memberi aspek kontinuitas tindakan simbolis.",
  "alternativeInterpretations": "Tidak terburu-buru dapat berarti lambat; tidak menunjukkan kapasitas menyelesaikan tugas.",
  "interpretationRisk": "Tidak boleh disamakan dengan produktivitas atau kecepatan kerja."
}
```

Lokasi kutipan: [lib/data.ts:448](../lib/data.ts#L448). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-EXEC-03 — executing / support

```json
{
  "evidenceId": "C-EXEC-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Wariga",
  "masterRecordId": "wuku:7",
  "sourceField": "kelebihan",
  "excerpt": "Rapi dalam bekerja, setia, artistik.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 64
  },
  "dimension": "executing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kerapian dalam bekerja memberi aspek ketelitian proses, dengan kesetiaan dan artistik sebagai konteks.",
  "alternativeInterpretations": "Kerapian dapat lebih dekat ke estetika dan penataan pribadi.",
  "interpretationRisk": "Tidak membuktikan konsistensi; hindari memperluas artistik ke kemampuan kerja umum."
}
```

Lokasi kutipan: [lib/data.ts:64](../lib/data.ts#L64). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-EXEC-04 — executing / support

```json
{
  "evidenceId": "C-EXEC-04",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Kukus",
  "masterRecordId": "lintang:Soma:Paing",
  "sourceField": "penjelasan",
  "excerpt": "Berkelakuan baik, jujur, dan rajin bekerja. Memiliki cita-cita tinggi dan sangat setia pada janjinya. Hidupnya cenderung hemat, cermat, dan tertata.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 645
  },
  "dimension": "executing",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Rajin bekerja, setia pada janji, cermat, dan tertata memberikan konteks yang saling berkaitan untuk tindak lanjut aktivitas.",
  "alternativeInterpretations": "Dapat merupakan deskripsi moral atau ekonomi rumah tangga.",
  "interpretationRisk": "Teks bersifat umum dan belum teruji secara empiris; bukan asesmen profesional."
}
```

Lokasi kutipan: [lib/data.ts:645](../lib/data.ts#L645). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COLL-01 — collaborating / support

```json
{
  "evidenceId": "C-COLL-01",
  "indicatorType": "saptawara",
  "wewaranCycle": null,
  "indicatorValue": "Redite",
  "masterRecordId": "saptawara:1",
  "sourceField": "karakter",
  "excerpt": "Berjiwa sosial tinggi, berwibawa, dan senang menolong.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 427
  },
  "dimension": "collaborating",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Sifat sosial dan menolong memberi hipotesis hubungan saling membantu, dengan wibawa sebagai konteks.",
  "alternativeInterpretations": "Menolong tidak selalu berupa kolaborasi tim yang timbal balik.",
  "interpretationRisk": "Batas antara prososial dan kerja sama organisasi harus ditinjau."
}
```

Lokasi kutipan: [lib/data.ts:427](../lib/data.ts#L427). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COLL-02 — collaborating / support

```json
{
  "evidenceId": "C-COLL-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "dasawara",
  "indicatorValue": "Manusa",
  "masterRecordId": "wewaran:dasawara:7",
  "sourceField": "karakter",
  "excerpt": "Suka bersosialisasi dan sangat mementingkan hubungan manusia.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 466
  },
  "dimension": "collaborating",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Sosialisasi dan perhatian pada hubungan manusia memberi arah hubungan interpersonal.",
  "alternativeInterpretations": "Bisa berarti kebutuhan bersosialisasi, bukan berbagi tugas.",
  "interpretationRisk": "Belum menunjukkan kesediaan kompromi atau penyelesaian konflik."
}
```

Lokasi kutipan: [lib/data.ts:466](../lib/data.ts#L466). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COLL-03 — collaborating / support

```json
{
  "evidenceId": "C-COLL-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Pahang",
  "masterRecordId": "wuku:16",
  "sourceField": "kelebihan",
  "excerpt": "Pendengar yang baik, loyal.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 145
  },
  "dimension": "collaborating",
  "polarity": "support",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Mendengar dan loyalitas memberi bahan tafsir partisipasi dalam hubungan; baca bersama konteks protektif dan mencampuri urusan pada record utuh.",
  "alternativeInterpretations": "Loyalitas bisa bersifat selektif pada kelompok dekat.",
  "interpretationRisk": "Mendengar tidak otomatis berarti bekerja sama; hindari janji harmoni tim."
}
```

Lokasi kutipan: [lib/data.ts:145](../lib/data.ts#L145). Baca seluruh record inventaris di bawah untuk konteks field pendamping.

### C-COLL-04 — collaborating / caution

```json
{
  "evidenceId": "C-COLL-04",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Langkir",
  "masterRecordId": "wuku:13",
  "sourceField": "kelemahan",
  "excerpt": "Keras hati, sulit diajak kompromi.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 119
  },
  "dimension": "collaborating",
  "polarity": "caution",
  "sourceId": null,
  "sourcePage": null,
  "provenanceStatus": "missing",
  "domainReviewStatus": "pending",
  "productApprovalStatus": "pending",
  "catalogStatus": "needs_source_verification",
  "ruleVersion": "g6a4-candidate-0.1",
  "mappingRationale": "Kesulitan kompromi merupakan pertanyaan yang relevan untuk dimensi kerja sama, dengan konteks keberanian dan kemandirian record utuh.",
  "alternativeInterpretations": "Teguh pada prinsip tidak selalu buruk; penolakan kompromi dapat tepat pada situasi tertentu.",
  "interpretationRisk": "Tidak boleh menjadi diskualifikasi atau menurunkan jabatan."
}
```

Lokasi kutipan: [lib/data.ts:119](../lib/data.ts#L119). Baca seluruh record inventaris di bawah untuk konteks field pendamping.


## Usulan yang ditolak

Tiga usulan berikut dicatat agar penolakan tidak hilang saat review. Ini bukan evidence aktif dan tidak termasuk hitungan 22 kandidat yang dipertahankan.

### RJ-01

```json
{
  "proposalId": "RJ-01",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Kala Sungsang",
  "masterRecordId": "lintang:Redite:Umanis",
  "sourceField": "label",
  "excerpt": "Diplomat Tenang",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 635
  },
  "proposedDimension": "communicating",
  "catalogStatus": "rejected",
  "provenanceStatus": "missing",
  "rejectionRationale": "Label singkat diplomat tidak cukup: penjelasan penuh berbicara tentang menyembunyikan perasaan, berdebat, mencampuri urusan, dan kekakuan. Jangan mengaktifkan communicating dari label saja."
}
```

Lokasi: [lib/data.ts:635](../lib/data.ts#L635).

### RJ-02

```json
{
  "proposalId": "RJ-02",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Gumbreg",
  "masterRecordId": "wuku:6",
  "sourceField": "kelebihan",
  "excerpt": "Murah rezeki, dicintai banyak orang.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 55
  },
  "proposedDimension": "managing",
  "catalogStatus": "rejected",
  "provenanceStatus": "missing",
  "rejectionRationale": "Murah rezeki dan disukai bukan evidence pengelolaan proses/sumber daya. Peruntungan tidak menjadi kompetensi Management."
}
```

Lokasi: [lib/data.ts:55](../lib/data.ts#L55).

### RJ-03

```json
{
  "proposalId": "RJ-03",
  "indicatorType": "wewaran",
  "wewaranCycle": "sadwara",
  "indicatorValue": "Tungleh",
  "masterRecordId": "wewaran:sadwara:1",
  "sourceField": "sifat",
  "excerpt": "Hari penuh kebohongan dan ingkar janji.",
  "sourceLocation": {
    "file": "lib/data.ts",
    "line": 380
  },
  "proposedDimension": "collaborating",
  "catalogStatus": "rejected",
  "provenanceStatus": "missing",
  "rejectionRationale": "Master menyebut sifat hari. Mengubahnya menjadi label bahwa individu tidak jujur atau tidak bisa bekerja sama adalah lompatan domain yang tidak didukung."
}
```

Lokasi: [lib/data.ts:380](../lib/data.ts#L380).


## Inventaris lengkap master

Setiap record memakai namespace sesuai adapter [samyoga-calendar-snapshot.ts:58](../lib/samyoga-calendar-snapshot.ts#L58). Potensi dimensi di tabel berarti **usulan kurasi**; “belum diusulkan” berarti belum dipilih sebagai evidence, bukan sifat itu tidak dimiliki seseorang. Seluruh record memiliki sumber budaya spesifik `unknown`, provenance `missing`, dan status review `pending`.

Keterbatasan berlaku pada setiap entri: teks adalah tafsir master internal, bukan pengukuran individu. Label singkat dan makna simbolis tidak cukup untuk menentukan dimensi. Naungan/dewa pada deskripsi Wuku tidak otomatis menjadi perilaku; Sadwara sering menggambarkan hari; penjelasan Lintang dapat mencampur perilaku, peruntungan, dan peringatan. Seluruh field pendamping harus ikut dibaca; jangan hanya mengambil klausa yang disukai.

### saptawara — 7 record

#### saptawara:1 — Redite

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Kasih | [lib/data.ts:427](../lib/data.ts#L427) | Belum diusulkan; inventaris saja |
| karakter | Berjiwa sosial tinggi, berwibawa, dan senang menolong. | [lib/data.ts:427](../lib/data.ts#L427) | collaborating (support; C-COLL-01) |

#### saptawara:2 — Soma

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Luwes | [lib/data.ts:428](../lib/data.ts#L428) | Belum diusulkan; inventaris saja |
| karakter | Fleksibel, mudah beradaptasi, namun terkadang mudah berubah pikiran. | [lib/data.ts:428](../lib/data.ts#L428) | Belum diusulkan; inventaris saja |

#### saptawara:3 — Anggara

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Berani | [lib/data.ts:429](../lib/data.ts#L429) | Belum diusulkan; inventaris saja |
| karakter | Penuh semangat, pemberani, tapi terkadang emosional. | [lib/data.ts:429](../lib/data.ts#L429) | Belum diusulkan; inventaris saja |

#### saptawara:4 — Buda

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Bijak | [lib/data.ts:430](../lib/data.ts#L430) | Belum diusulkan; inventaris saja |
| karakter | Cerdas, teliti dalam bekerja, dan sangat menghargai aturan. | [lib/data.ts:430](../lib/data.ts#L430) | executing (support; C-EXEC-01) |

#### saptawara:5 — Wraspati

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Mulia | [lib/data.ts:431](../lib/data.ts#L431) | Belum diusulkan; inventaris saja |
| karakter | Sabar, taat pada agama/prinsip, dan dihormati banyak orang. | [lib/data.ts:431](../lib/data.ts#L431) | Belum diusulkan; inventaris saja |

#### saptawara:6 — Sukra

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Suci | [lib/data.ts:432](../lib/data.ts#L432) | Belum diusulkan; inventaris saja |
| karakter | Cenderung religius, menyukai kebersihan, dan memiliki cita rasa seni. | [lib/data.ts:432](../lib/data.ts#L432) | Belum diusulkan; inventaris saja |

#### saptawara:7 — Saniscara

Jenis: `saptawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| sifat | Tangguh | [lib/data.ts:433](../lib/data.ts#L433) | Belum diusulkan; inventaris saja |
| karakter | Pekerja keras, kuat menghadapi cobaan, namun agak tertutup. | [lib/data.ts:433](../lib/data.ts#L433) | Belum diusulkan; inventaris saja |

### pancawara — 5 record

#### pancawara:1 — Umanis

Jenis: `pancawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Penggerak, memiliki kemauan kuat, dan pemurah. | [lib/data.ts:366](../lib/data.ts#L366) | Belum diusulkan; inventaris saja |

#### pancawara:2 — Paing

Jenis: `pancawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berani, tegas, namun terkadang emosional. | [lib/data.ts:367](../lib/data.ts#L367) | Belum diusulkan; inventaris saja |

#### pancawara:3 — Pon

Jenis: `pancawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Tenang, bijaksana, dan pandai menyimpan rahasia. | [lib/data.ts:368](../lib/data.ts#L368) | Belum diusulkan; inventaris saja |

#### pancawara:4 — Wage

Jenis: `pancawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Teguh pada pendirian, pekerja keras, namun kaku. | [lib/data.ts:369](../lib/data.ts#L369) | Belum diusulkan; inventaris saja |

#### pancawara:5 — Kliwon

Jenis: `pancawara`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi. | [lib/data.ts:370](../lib/data.ts#L370) | communicating (support; C-COMM-02) |

### wuku — 30 record

#### wuku:1 — Sinta

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Yamadipati. Karakter sakral dan penuh wibawa. | [lib/data.ts:8](../lib/data.ts#L8) | Belum diusulkan; inventaris saja |
| sifat_umum | Tegas, agak kaku, berjiwa pemimpin. | [lib/data.ts:9](../lib/data.ts#L9) | directing (support; C-DIR-03) |
| kelebihan | Cepat memahami ilmu, teliti, mandiri. | [lib/data.ts:10](../lib/data.ts#L10) | Belum diusulkan; inventaris saja |
| kelemahan | Keras kepala, sulit menerima kritik. | [lib/data.ts:11](../lib/data.ts#L11) | directing (caution; C-DIR-04) |

#### wuku:2 — Landep

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Mahadewa. Melambangkan ketajaman pikiran. | [lib/data.ts:17](../lib/data.ts#L17) | Belum diusulkan; inventaris saja |
| sifat_umum | Cerdas, visioner, jujur. | [lib/data.ts:18](../lib/data.ts#L18) | Belum diusulkan; inventaris saja |
| kelebihan | Daya tangkap kuat, logis, problem solver. | [lib/data.ts:19](../lib/data.ts#L19) | Belum diusulkan; inventaris saja |
| kelemahan | Suka pamer kepintaran, agak sombong. | [lib/data.ts:20](../lib/data.ts#L20) | Belum diusulkan; inventaris saja |

#### wuku:3 — Ukir

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Mahayakti. Karakter yang kaya akan perasaan. | [lib/data.ts:26](../lib/data.ts#L26) | Belum diusulkan; inventaris saja |
| sifat_umum | Tenang, rendah hati, tertutup. | [lib/data.ts:27](../lib/data.ts#L27) | Belum diusulkan; inventaris saja |
| kelebihan | Sangat baik hati, penolong, setia. | [lib/data.ts:28](../lib/data.ts#L28) | Belum diusulkan; inventaris saja |
| kelemahan | Sering memendam perasaan, pendendam. | [lib/data.ts:29](../lib/data.ts#L29) | Belum diusulkan; inventaris saja |

#### wuku:4 — Kulantir

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Singajalma. Karakter yang dinamis. | [lib/data.ts:35](../lib/data.ts#L35) | Belum diusulkan; inventaris saja |
| sifat_umum | Lincah, mudah bergaul, aktif. | [lib/data.ts:36](../lib/data.ts#L36) | Belum diusulkan; inventaris saja |
| kelebihan | Pandai bicara, adaptif, komunikatif. | [lib/data.ts:37](../lib/data.ts#L37) | Belum diusulkan; inventaris saja |
| kelemahan | Boros, sulit fokus pada satu tujuan. | [lib/data.ts:38](../lib/data.ts#L38) | Belum diusulkan; inventaris saja |

#### wuku:5 — Tolu

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Bayu. Sosok yang kuat dan pelindung. | [lib/data.ts:44](../lib/data.ts#L44) | Belum diusulkan; inventaris saja |
| sifat_umum | Berjiwa pemimpin, sabar, kuat. | [lib/data.ts:45](../lib/data.ts#L45) | Belum diusulkan; inventaris saja |
| kelebihan | Fisik tangguh, pantang menyerah. | [lib/data.ts:46](../lib/data.ts#L46) | Belum diusulkan; inventaris saja |
| kelemahan | Kurang peka terhadap perasaan orang lain. | [lib/data.ts:47](../lib/data.ts#L47) | Belum diusulkan; inventaris saja |

#### wuku:6 — Gumbreg

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Candra. Melambangkan kemakmuran. | [lib/data.ts:53](../lib/data.ts#L53) | Belum diusulkan; inventaris saja |
| sifat_umum | Lembut, tenang, religius. | [lib/data.ts:54](../lib/data.ts#L54) | Belum diusulkan; inventaris saja |
| kelebihan | Murah rezeki, dicintai banyak orang. | [lib/data.ts:55](../lib/data.ts#L55) | Belum diusulkan; inventaris saja |
| kelemahan | Terlalu perasa, kurang tegas mengambil sikap. | [lib/data.ts:56](../lib/data.ts#L56) | Belum diusulkan; inventaris saja |

#### wuku:7 — Wariga

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Asmara. Memiliki daya tarik tinggi. | [lib/data.ts:62](../lib/data.ts#L62) | Belum diusulkan; inventaris saja |
| sifat_umum | Artistik, romantis, teliti. | [lib/data.ts:63](../lib/data.ts#L63) | Belum diusulkan; inventaris saja |
| kelebihan | Rapi dalam bekerja, setia, artistik. | [lib/data.ts:64](../lib/data.ts#L64) | executing (support; C-EXEC-03) |
| kelemahan | Mudah curiga dan sering cemburu. | [lib/data.ts:65](../lib/data.ts#L65) | Belum diusulkan; inventaris saja |

#### wuku:8 — Warigadean

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Maharesi. Sosok pembelajar. | [lib/data.ts:71](../lib/data.ts#L71) | Belum diusulkan; inventaris saja |
| sifat_umum | Cerdas, analitis, logis. | [lib/data.ts:72](../lib/data.ts#L72) | Belum diusulkan; inventaris saja |
| kelebihan | Logika kuat, pandai bernegosiasi. | [lib/data.ts:73](../lib/data.ts#L73) | Belum diusulkan; inventaris saja |
| kelemahan | Terlihat dingin dan kurang empati. | [lib/data.ts:74](../lib/data.ts#L74) | Belum diusulkan; inventaris saja |

#### wuku:9 — Julungwangi

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Sambu. Sosok yang populer. | [lib/data.ts:80](../lib/data.ts#L80) | Belum diusulkan; inventaris saja |
| sifat_umum | Rapi, jujur, menjaga reputasi. | [lib/data.ts:81](../lib/data.ts#L81) | Belum diusulkan; inventaris saja |
| kelebihan | Sangat dipercaya, penampilan menarik. | [lib/data.ts:82](../lib/data.ts#L82) | Belum diusulkan; inventaris saja |
| kelemahan | Suka dipuji, agak narsis. | [lib/data.ts:83](../lib/data.ts#L83) | Belum diusulkan; inventaris saja |

#### wuku:10 — Sungsang

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Gana. Penakluk rintangan. | [lib/data.ts:89](../lib/data.ts#L89) | Belum diusulkan; inventaris saja |
| sifat_umum | Kuat, berani, pantang menyerah. | [lib/data.ts:90](../lib/data.ts#L90) | Belum diusulkan; inventaris saja |
| kelebihan | Solutif, mental baja. | [lib/data.ts:91](../lib/data.ts#L91) | Belum diusulkan; inventaris saja |
| kelemahan | Mudah marah (temperamental). | [lib/data.ts:92](../lib/data.ts#L92) | Belum diusulkan; inventaris saja |

#### wuku:11 — Dungulan

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Kamajaya. Sosok pemenang. | [lib/data.ts:98](../lib/data.ts#L98) | Belum diusulkan; inventaris saja |
| sifat_umum | Bijaksana, sabar, tenang. | [lib/data.ts:99](../lib/data.ts#L99) | Belum diusulkan; inventaris saja |
| kelebihan | Selalu menang dalam argumen, berwibawa. | [lib/data.ts:100](../lib/data.ts#L100) | Belum diusulkan; inventaris saja |
| kelemahan | Terlalu santai, sering meremehkan lawan. | [lib/data.ts:101](../lib/data.ts#L101) | Belum diusulkan; inventaris saja |

#### wuku:12 — Kuningan

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Indera. Berjiwa ningrat. | [lib/data.ts:107](../lib/data.ts#L107) | Belum diusulkan; inventaris saja |
| sifat_umum | Disiplin, perfeksionis, hemat. | [lib/data.ts:108](../lib/data.ts#L108) | Belum diusulkan; inventaris saja |
| kelebihan | Sangat teliti dalam keuangan dan aturan. | [lib/data.ts:109](../lib/data.ts#L109) | managing (support; C-MAN-03) |
| kelemahan | Cenderung pelit dan terlalu kaku. | [lib/data.ts:110](../lib/data.ts#L110) | Belum diusulkan; inventaris saja |

#### wuku:13 — Langkir

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Kala. Sosok yang tangguh. | [lib/data.ts:116](../lib/data.ts#L116) | Belum diusulkan; inventaris saja |
| sifat_umum | Berani, mandiri, nekat. | [lib/data.ts:117](../lib/data.ts#L117) | Belum diusulkan; inventaris saja |
| kelebihan | Tidak takut tantangan, ulet. | [lib/data.ts:118](../lib/data.ts#L118) | Belum diusulkan; inventaris saja |
| kelemahan | Keras hati, sulit diajak kompromi. | [lib/data.ts:119](../lib/data.ts#L119) | collaborating (caution; C-COLL-04) |

#### wuku:14 — Medangsia

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Brahma. Semangat membara. | [lib/data.ts:125](../lib/data.ts#L125) | Belum diusulkan; inventaris saja |
| sifat_umum | Ambisius, kompetitif, ceria. | [lib/data.ts:126](../lib/data.ts#L126) | Belum diusulkan; inventaris saja |
| kelebihan | Motivator ulung, energik. | [lib/data.ts:127](../lib/data.ts#L127) | Belum diusulkan; inventaris saja |
| kelemahan | Ceroboh, terburu-buru. | [lib/data.ts:128](../lib/data.ts#L128) | Belum diusulkan; inventaris saja |

#### wuku:15 — Pujut

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Guritna. Sosok pemikir. | [lib/data.ts:134](../lib/data.ts#L134) | Belum diusulkan; inventaris saja |
| sifat_umum | Filosofis, introvert, bijak. | [lib/data.ts:135](../lib/data.ts#L135) | Belum diusulkan; inventaris saja |
| kelebihan | Ide orisinal, pemikiran dalam. | [lib/data.ts:136](../lib/data.ts#L136) | Belum diusulkan; inventaris saja |
| kelemahan | Lamban bertindak, suka ragu. | [lib/data.ts:137](../lib/data.ts#L137) | planning (caution; C-PLAN-03) |

#### wuku:16 — Pahang

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Tantra. Pelindung. | [lib/data.ts:143](../lib/data.ts#L143) | Belum diusulkan; inventaris saja |
| sifat_umum | Setia kawan, protektif. | [lib/data.ts:144](../lib/data.ts#L144) | Belum diusulkan; inventaris saja |
| kelebihan | Pendengar yang baik, loyal. | [lib/data.ts:145](../lib/data.ts#L145) | collaborating (support; C-COLL-03) |
| kelemahan | Suka mencampuri urusan orang. | [lib/data.ts:146](../lib/data.ts#L146) | Belum diusulkan; inventaris saja |

#### wuku:17 — Krulut

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Wisnu. Penuh kasih sayang. | [lib/data.ts:152](../lib/data.ts#L152) | Belum diusulkan; inventaris saja |
| sifat_umum | Penyayang, lembut, dermawan. | [lib/data.ts:153](../lib/data.ts#L153) | Belum diusulkan; inventaris saja |
| kelebihan | Murah hati, penyabar. | [lib/data.ts:154](../lib/data.ts#L154) | Belum diusulkan; inventaris saja |
| kelemahan | Mudah ditipu/dimanfaatkan. | [lib/data.ts:155](../lib/data.ts#L155) | Belum diusulkan; inventaris saja |

#### wuku:18 — Merakih

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Surenggana. Sosok rupawan. | [lib/data.ts:161](../lib/data.ts#L161) | Belum diusulkan; inventaris saja |
| sifat_umum | Estetik, rapi, diplomatis. | [lib/data.ts:162](../lib/data.ts#L162) | Belum diusulkan; inventaris saja |
| kelebihan | Pandai bicara, penampilan menarik. | [lib/data.ts:163](../lib/data.ts#L163) | Belum diusulkan; inventaris saja |
| kelemahan | Boros demi gaya hidup. | [lib/data.ts:164](../lib/data.ts#L164) | Belum diusulkan; inventaris saja |

#### wuku:19 — Tambir

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Siwa. Wibawa tinggi. | [lib/data.ts:170](../lib/data.ts#L170) | Belum diusulkan; inventaris saja |
| sifat_umum | Religius, serius, berprinsip. | [lib/data.ts:171](../lib/data.ts#L171) | Belum diusulkan; inventaris saja |
| kelebihan | Sangat memegang janji, jujur. | [lib/data.ts:172](../lib/data.ts#L172) | Belum diusulkan; inventaris saja |
| kelemahan | Kaku, kurang humoris. | [lib/data.ts:173](../lib/data.ts#L173) | Belum diusulkan; inventaris saja |

#### wuku:20 — Medangkungan

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Basuki. Pembawa damai. | [lib/data.ts:179](../lib/data.ts#L179) | Belum diusulkan; inventaris saja |
| sifat_umum | Tenang, adil, sejuk. | [lib/data.ts:180](../lib/data.ts#L180) | Belum diusulkan; inventaris saja |
| kelebihan | Penengah konflik yang handal. | [lib/data.ts:181](../lib/data.ts#L181) | Belum diusulkan; inventaris saja |
| kelemahan | Sering bimbang (plin-plan). | [lib/data.ts:182](../lib/data.ts#L182) | Belum diusulkan; inventaris saja |

#### wuku:21 — Matal

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Sakri. Kuat mental. | [lib/data.ts:188](../lib/data.ts#L188) | Belum diusulkan; inventaris saja |
| sifat_umum | Tangguh, sederhana, jujur. | [lib/data.ts:189](../lib/data.ts#L189) | Belum diusulkan; inventaris saja |
| kelebihan | Tahan banting hadapi cobaan. | [lib/data.ts:190](../lib/data.ts#L190) | Belum diusulkan; inventaris saja |
| kelemahan | Kurang kreatif, kaku. | [lib/data.ts:191](../lib/data.ts#L191) | Belum diusulkan; inventaris saja |

#### wuku:22 — Uye

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Kuwera. Bakat dagang. | [lib/data.ts:197](../lib/data.ts#L197) | Belum diusulkan; inventaris saja |
| sifat_umum | Hemat, teliti, kalkulatif. | [lib/data.ts:198](../lib/data.ts#L198) | Belum diusulkan; inventaris saja |
| kelebihan | Pandai mencari peluang uang. | [lib/data.ts:199](../lib/data.ts#L199) | Belum diusulkan; inventaris saja |
| kelemahan | Sering cemas soal masa depan. | [lib/data.ts:200](../lib/data.ts#L200) | Belum diusulkan; inventaris saja |

#### wuku:23 — Menail

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Citragotra. Jiwa seni. | [lib/data.ts:206](../lib/data.ts#L206) | Belum diusulkan; inventaris saja |
| sifat_umum | Kreatif, imajinatif, unik. | [lib/data.ts:207](../lib/data.ts#L207) | Belum diusulkan; inventaris saja |
| kelebihan | Inovatif, cara berpikir berbeda. | [lib/data.ts:208](../lib/data.ts#L208) | Belum diusulkan; inventaris saja |
| kelemahan | Kurang realistis, suka menghayal. | [lib/data.ts:209](../lib/data.ts#L209) | Belum diusulkan; inventaris saja |

#### wuku:24 — Prangbakat

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Bisma. Pejuang tangguh. | [lib/data.ts:215](../lib/data.ts#L215) | Belum diusulkan; inventaris saja |
| sifat_umum | Disiplin, kuat, kaku. | [lib/data.ts:216](../lib/data.ts#L216) | Belum diusulkan; inventaris saja |
| kelebihan | Fisik sehat, mental pejuang. | [lib/data.ts:217](../lib/data.ts#L217) | Belum diusulkan; inventaris saja |
| kelemahan | Sulit beradaptasi dengan perubahan. | [lib/data.ts:218](../lib/data.ts#L218) | Belum diusulkan; inventaris saja |

#### wuku:25 — Bala

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Durga. Disegani. | [lib/data.ts:224](../lib/data.ts#L224) | Belum diusulkan; inventaris saja |
| sifat_umum | Misterius, karismatik, dominan. | [lib/data.ts:225](../lib/data.ts#L225) | Belum diusulkan; inventaris saja |
| kelebihan | Pengaruh besar pada kelompok. | [lib/data.ts:226](../lib/data.ts#L226) | Belum diusulkan; inventaris saja |
| kelemahan | Cenderung menekan/otoriter. | [lib/data.ts:227](../lib/data.ts#L227) | Belum diusulkan; inventaris saja |

#### wuku:26 — Ugu

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Singajalma. Stabil. | [lib/data.ts:233](../lib/data.ts#L233) | Belum diusulkan; inventaris saja |
| sifat_umum | Konsisten, setia, tenang. | [lib/data.ts:234](../lib/data.ts#L234) | Belum diusulkan; inventaris saja |
| kelebihan | Tidak mudah berubah pendirian. | [lib/data.ts:235](../lib/data.ts#L235) | Belum diusulkan; inventaris saja |
| kelemahan | Sangat keras kepala. | [lib/data.ts:236](../lib/data.ts#L236) | Belum diusulkan; inventaris saja |

#### wuku:27 — Wayang

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Sri. Keindahan. | [lib/data.ts:242](../lib/data.ts#L242) | Belum diusulkan; inventaris saja |
| sifat_umum | Lembut, artistik, peka. | [lib/data.ts:243](../lib/data.ts#L243) | Belum diusulkan; inventaris saja |
| kelebihan | Bakat seni halus, perasa. | [lib/data.ts:244](../lib/data.ts#L244) | Belum diusulkan; inventaris saja |
| kelemahan | Sangat sensitif, mudah tersinggung. | [lib/data.ts:245](../lib/data.ts#L245) | Belum diusulkan; inventaris saja |

#### wuku:28 — Klawu

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Sadana. Kemakmuran. | [lib/data.ts:251](../lib/data.ts#L251) | Belum diusulkan; inventaris saja |
| sifat_umum | Beruntung, rajin, hemat. | [lib/data.ts:252](../lib/data.ts#L252) | Belum diusulkan; inventaris saja |
| kelebihan | Rezeki lancar, tekun bekerja. | [lib/data.ts:253](../lib/data.ts#L253) | Belum diusulkan; inventaris saja |
| kelemahan | Terlalu terpaku pada materi. | [lib/data.ts:254](../lib/data.ts#L254) | Belum diusulkan; inventaris saja |

#### wuku:29 — Dukut

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Baruna. Luas dan dalam. | [lib/data.ts:260](../lib/data.ts#L260) | Belum diusulkan; inventaris saja |
| sifat_umum | Tenang, misterius, sabar. | [lib/data.ts:261](../lib/data.ts#L261) | Belum diusulkan; inventaris saja |
| kelebihan | Wawasan luas, bijaksana. | [lib/data.ts:262](../lib/data.ts#L262) | Belum diusulkan; inventaris saja |
| kelemahan | Sulit ditebak, tertutup. | [lib/data.ts:263](../lib/data.ts#L263) | Belum diusulkan; inventaris saja |

#### wuku:30 — Watugunung

Jenis: `wuku`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| deskripsi | Naungan Bathara Anantaboga. Kokoh. | [lib/data.ts:269](../lib/data.ts#L269) | Belum diusulkan; inventaris saja |
| sifat_umum | Stabil, teguh, pelindung. | [lib/data.ts:270](../lib/data.ts#L270) | Belum diusulkan; inventaris saja |
| kelebihan | Menjadi tumpuan banyak orang. | [lib/data.ts:271](../lib/data.ts#L271) | Belum diusulkan; inventaris saja |
| kelemahan | Sulit menerima perubahan mendadak. | [lib/data.ts:272](../lib/data.ts#L272) | Belum diusulkan; inventaris saja |

### wewaran / ekawara — 1 record

#### wewaran:ekawara:1 — Luang

Jenis: `wewaran`; cycle: `ekawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Mandiri, memiliki pendirian kuat, namun cenderung penyendiri. | [lib/data.ts:343](../lib/data.ts#L343) | Belum diusulkan; inventaris saja |

### wewaran / dwiwara — 2 record

#### wewaran:dwiwara:1 — Menga

Jenis: `wewaran`; cycle: `dwiwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Terbuka, komunikatif, dan mudah menerima masukan dari luar. | [lib/data.ts:347](../lib/data.ts#L347) | communicating (support; C-COMM-01) |

#### wewaran:dwiwara:2 — Pepet

Jenis: `wewaran`; cycle: `dwiwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pandai menyimpan rahasia, waspada, dan pemikir yang mendalam. | [lib/data.ts:348](../lib/data.ts#L348) | Belum diusulkan; inventaris saja |

### wewaran / triwara — 3 record

#### wewaran:triwara:1 — Pasah

Jenis: `wewaran`; cycle: `triwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Suka kebebasan, tidak suka diatur, dan sangat mandiri. | [lib/data.ts:352](../lib/data.ts#L352) | Belum diusulkan; inventaris saja |

#### wewaran:triwara:2 — Beteng

Jenis: `wewaran`; cycle: `triwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berjiwa pelindung, pandai mengelola sumber daya, dan makmur. | [lib/data.ts:353](../lib/data.ts#L353) | managing (support; C-MAN-01) |

#### wewaran:triwara:3 — Kajeng

Jenis: `wewaran`; cycle: `triwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Kritis, memiliki intuisi tajam, dan teguh pada prinsip. | [lib/data.ts:354](../lib/data.ts#L354) | Belum diusulkan; inventaris saja |

### wewaran / caturwara — 4 record

#### wewaran:caturwara:1 — Sri

Jenis: `wewaran`; cycle: `caturwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Dermawan, pembawa kebahagiaan, dan senang berbagi rezeki. | [lib/data.ts:358](../lib/data.ts#L358) | Belum diusulkan; inventaris saja |

#### wewaran:caturwara:2 — Laba

Jenis: `wewaran`; cycle: `caturwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pandai mencari peluang dan sering berhasil dalam usaha. | [lib/data.ts:359](../lib/data.ts#L359) | Belum diusulkan; inventaris saja |

#### wewaran:caturwara:3 — Jaya

Jenis: `wewaran`; cycle: `caturwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pantang menyerah, kompetitif, dan memiliki mental pemenang. | [lib/data.ts:360](../lib/data.ts#L360) | Belum diusulkan; inventaris saja |

#### wewaran:caturwara:4 — Menala

Jenis: `wewaran`; cycle: `caturwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berwibawa, kharismatik, dan dihormati di lingkungannya. | [lib/data.ts:361](../lib/data.ts#L361) | Belum diusulkan; inventaris saja |

### wewaran / pancawara — 5 record

#### wewaran:pancawara:1 — Umanis

Jenis: `wewaran`; cycle: `pancawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Penggerak, memiliki kemauan kuat, dan pemurah. | [lib/data.ts:366](../lib/data.ts#L366) | Belum diusulkan; inventaris saja |

#### wewaran:pancawara:2 — Paing

Jenis: `wewaran`; cycle: `pancawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berani, tegas, namun terkadang emosional. | [lib/data.ts:367](../lib/data.ts#L367) | Belum diusulkan; inventaris saja |

#### wewaran:pancawara:3 — Pon

Jenis: `wewaran`; cycle: `pancawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Tenang, bijaksana, dan pandai menyimpan rahasia. | [lib/data.ts:368](../lib/data.ts#L368) | Belum diusulkan; inventaris saja |

#### wewaran:pancawara:4 — Wage

Jenis: `wewaran`; cycle: `pancawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Teguh pada pendirian, pekerja keras, namun kaku. | [lib/data.ts:369](../lib/data.ts#L369) | Belum diusulkan; inventaris saja |

#### wewaran:pancawara:5 — Kliwon

Jenis: `wewaran`; cycle: `pancawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi. | [lib/data.ts:370](../lib/data.ts#L370) | Belum diusulkan; inventaris saja |

### wewaran / sadwara — 6 record

#### wewaran:sadwara:1 — Tungleh

Jenis: `wewaran`; cycle: `sadwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| arti | Tidak kekal | [lib/data.ts:379](../lib/data.ts#L379) | Belum diusulkan; inventaris saja |
| sifat | Hari penuh kebohongan dan ingkar janji. | [lib/data.ts:380](../lib/data.ts#L380) | Belum diusulkan; inventaris saja |
| pesan | Waspadalah terhadap fitnah dan kebohongan. Jangan paksa orang jujur, tapi buatlah ia menyesali akibat kebohongannya. | [lib/data.ts:381](../lib/data.ts#L381) | Belum diusulkan; inventaris saja |

#### wewaran:sadwara:2 — Aryang

Jenis: `wewaran`; cycle: `sadwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| arti | Kurus | [lib/data.ts:387](../lib/data.ts#L387) | Belum diusulkan; inventaris saja |
| sifat | Harinya orang lupa (kepikunan). | [lib/data.ts:388](../lib/data.ts#L388) | Belum diusulkan; inventaris saja |
| pesan | Buatlah catatan pribadi agar tidak mengandalkan ingatan. Tulisan akan abadi, sementara ucapan akan terlupakan. | [lib/data.ts:389](../lib/data.ts#L389) | Belum diusulkan; inventaris saja |

#### wewaran:sadwara:3 — Urukung

Jenis: `wewaran`; cycle: `sadwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| arti | Punah | [lib/data.ts:395](../lib/data.ts#L395) | Belum diusulkan; inventaris saja |
| sifat | Hari kecerobohan dan kealpaan. | [lib/data.ts:396](../lib/data.ts#L396) | Belum diusulkan; inventaris saja |
| pesan | Waspadalah terhadap kesalahan tidak sengaja. Kurangi tindakan berbahaya dan berhati-hatilah di jalan. | [lib/data.ts:397](../lib/data.ts#L397) | Belum diusulkan; inventaris saja |

#### wewaran:sadwara:4 — Paniron

Jenis: `wewaran`; cycle: `sadwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| arti | Gemuk | [lib/data.ts:403](../lib/data.ts#L403) | Belum diusulkan; inventaris saja |
| sifat | Hari kepura-puraan atau fatamorgana. | [lib/data.ts:404](../lib/data.ts#L404) | Belum diusulkan; inventaris saja |
| pesan | Waspadalah terhadap kepalsuan. Teliti segalanya sebelum bertindak, karena hal yang tampak baik mungkin tidak demikian. | [lib/data.ts:405](../lib/data.ts#L405) | Belum diusulkan; inventaris saja |

#### wewaran:sadwara:5 — Was

Jenis: `wewaran`; cycle: `sadwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| arti | Kuat | [lib/data.ts:411](../lib/data.ts#L411) | Belum diusulkan; inventaris saja |
| sifat | Hari gembira. | [lib/data.ts:412](../lib/data.ts#L412) | Belum diusulkan; inventaris saja |
| pesan | Jangan mengumbar kegembiraan berlebih. Gunakan hari ini untuk membahagiakan orang lain dan berderma. | [lib/data.ts:413](../lib/data.ts#L413) | Belum diusulkan; inventaris saja |

#### wewaran:sadwara:6 — Maulu

Jenis: `wewaran`; cycle: `sadwara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| arti | Membiak | [lib/data.ts:419](../lib/data.ts#L419) | Belum diusulkan; inventaris saja |
| sifat | Hari pitam (kemarahan). | [lib/data.ts:420](../lib/data.ts#L420) | Belum diusulkan; inventaris saja |
| pesan | Kemurkaan ada di mana-mana. Tahan diri dari menyinggung perasaan orang lain. Diam adalah emas saat menghadapi amarah. | [lib/data.ts:421](../lib/data.ts#L421) | Belum diusulkan; inventaris saja |

### wewaran / saptawara — 7 record

#### wewaran:saptawara:1 — Redite

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berjiwa sosial tinggi, berwibawa, dan senang menolong. | [lib/data.ts:427](../lib/data.ts#L427) | Belum diusulkan; inventaris saja |

#### wewaran:saptawara:2 — Soma

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Fleksibel, mudah beradaptasi, namun terkadang mudah berubah pikiran. | [lib/data.ts:428](../lib/data.ts#L428) | Belum diusulkan; inventaris saja |

#### wewaran:saptawara:3 — Anggara

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Penuh semangat, pemberani, tapi terkadang emosional. | [lib/data.ts:429](../lib/data.ts#L429) | Belum diusulkan; inventaris saja |

#### wewaran:saptawara:4 — Buda

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Cerdas, teliti dalam bekerja, dan sangat menghargai aturan. | [lib/data.ts:430](../lib/data.ts#L430) | Belum diusulkan; inventaris saja |

#### wewaran:saptawara:5 — Wraspati

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Sabar, taat pada agama/prinsip, dan dihormati banyak orang. | [lib/data.ts:431](../lib/data.ts#L431) | Belum diusulkan; inventaris saja |

#### wewaran:saptawara:6 — Sukra

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Cenderung religius, menyukai kebersihan, dan memiliki cita rasa seni. | [lib/data.ts:432](../lib/data.ts#L432) | Belum diusulkan; inventaris saja |

#### wewaran:saptawara:7 — Saniscara

Jenis: `wewaran`; cycle: `saptawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pekerja keras, kuat menghadapi cobaan, namun agak tertutup. | [lib/data.ts:433](../lib/data.ts#L433) | Belum diusulkan; inventaris saja |

### wewaran / asatawara — 8 record

#### wewaran:asatawara:1 — Sri

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin. | [lib/data.ts:437](../lib/data.ts#L437) | directing (support; C-DIR-01); managing (support; C-MAN-02) |

#### wewaran:asatawara:2 — Indra

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Visioner, berbakat dalam perencanaan, dan sangat tekun. | [lib/data.ts:438](../lib/data.ts#L438) | planning (support; C-PLAN-01) |

#### wewaran:asatawara:3 — Guru

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Suka membimbing, bijaksana, dan sabar dalam mengajar. | [lib/data.ts:439](../lib/data.ts#L439) | Belum diusulkan; inventaris saja |

#### wewaran:asatawara:4 — Yama

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Sangat disiplin, menjunjung tinggi keadilan, dan tegas. | [lib/data.ts:440](../lib/data.ts#L440) | Belum diusulkan; inventaris saja |

#### wewaran:asatawara:5 — Ludra

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Memiliki semangat yang meluap-luap dan tekad yang kuat. | [lib/data.ts:441](../lib/data.ts#L441) | Belum diusulkan; inventaris saja |

#### wewaran:asatawara:6 — Brahma

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Kreatif, penuh inovasi, dan memiliki energi yang besar. | [lib/data.ts:442](../lib/data.ts#L442) | Belum diusulkan; inventaris saja |

#### wewaran:asatawara:7 — Kala

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Sangat waspada terhadap perubahan dan peka pada situasi. | [lib/data.ts:443](../lib/data.ts#L443) | Belum diusulkan; inventaris saja |

#### wewaran:asatawara:8 — Uma

Jenis: `wewaran`; cycle: `asatawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Penyayang, lembut hati, dan memiliki jiwa pengasuh. | [lib/data.ts:444](../lib/data.ts#L444) | Belum diusulkan; inventaris saja |

### wewaran / sangawara — 9 record

#### wewaran:sangawara:1 — Dangu

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Tenang, konsisten, dan tidak suka terburu-buru. | [lib/data.ts:448](../lib/data.ts#L448) | executing (support; C-EXEC-02) |

#### wewaran:sangawara:2 — Jangur

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Kokoh, sulit dipengaruhi, dan memiliki pendirian baja. | [lib/data.ts:449](../lib/data.ts#L449) | Belum diusulkan; inventaris saja |

#### wewaran:sangawara:3 — Gigis

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berwawasan luas, pemaaf, dan mudah beradaptasi. | [lib/data.ts:450](../lib/data.ts#L450) | Belum diusulkan; inventaris saja |

#### wewaran:sangawara:4 — Nohan

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Ceria, optimis, dan selalu membawa suasana positif. | [lib/data.ts:451](../lib/data.ts#L451) | Belum diusulkan; inventaris saja |

#### wewaran:sangawara:5 — Ogan

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Aktif, dinamis, dan senang dengan hal-hal baru. | [lib/data.ts:452](../lib/data.ts#L452) | Belum diusulkan; inventaris saja |

#### wewaran:sangawara:6 — Erangan

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Intuitif, sensitif terhadap perasaan orang lain, dan halus. | [lib/data.ts:453](../lib/data.ts#L453) | Belum diusulkan; inventaris saja |

#### wewaran:sangawara:7 — Urungan

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Penuh pertimbangan dan sangat hati-hati dalam melangkah. | [lib/data.ts:454](../lib/data.ts#L454) | planning (support; C-PLAN-02) |

#### wewaran:sangawara:8 — Tulus

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Jujur, apa adanya, dan sangat dapat dipercaya. | [lib/data.ts:455](../lib/data.ts#L455) | Belum diusulkan; inventaris saja |

#### wewaran:sangawara:9 — Dadi

Jenis: `wewaran`; cycle: `sangawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Memiliki tujuan hidup yang pasti dan jarang ragu-ragu. | [lib/data.ts:456](../lib/data.ts#L456) | Belum diusulkan; inventaris saja |

### wewaran / dasawara — 10 record

#### wewaran:dasawara:1 — Pandita

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Bijaksana, tenang, dan memiliki kedalaman ilmu. | [lib/data.ts:460](../lib/data.ts#L460) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:2 — Pati

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Tegas, memiliki otoritas, dan berani mengambil risiko. | [lib/data.ts:461](../lib/data.ts#L461) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:3 — Suka

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Optimis, ceria, dan pandai menghibur orang lain. | [lib/data.ts:462](../lib/data.ts#L462) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:4 — Duka

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Mudah berempati dan memiliki kepekaan sosial tinggi. | [lib/data.ts:463](../lib/data.ts#L463) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:5 — Sri

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Menyukai keindahan, rapi, dan memiliki cita rasa tinggi. | [lib/data.ts:464](../lib/data.ts#L464) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:6 — Manuh

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Disiplin, patuh pada aturan, dan rendah hati. | [lib/data.ts:465](../lib/data.ts#L465) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:7 — Manusa

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Suka bersosialisasi dan sangat mementingkan hubungan manusia. | [lib/data.ts:466](../lib/data.ts#L466) | collaborating (support; C-COLL-02) |

#### wewaran:dasawara:8 — Raja

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Berjiwa besar, kharismatik, dan berbakat mengatur orang. | [lib/data.ts:467](../lib/data.ts#L467) | directing (support; C-DIR-02) |

#### wewaran:dasawara:9 — Dewa

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Memiliki spiritualitas tinggi dan fokus pada kebajikan. | [lib/data.ts:468](../lib/data.ts#L468) | Belum diusulkan; inventaris saja |

#### wewaran:dasawara:10 — Raksasa

Jenis: `wewaran`; cycle: `dasawara`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| karakter | Memiliki energi besar, kuat fisik, dan mental yang tangguh. | [lib/data.ts:469](../lib/data.ts#L469) | Belum diusulkan; inventaris saja |

### lintang — 35 record

#### lintang:Redite:Paing — Gajah

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Tenang & Teguh | [lib/data.ts:523](../lib/data.ts#L523) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bulan | [lib/data.ts:524](../lib/data.ts#L524) | Belum diusulkan; inventaris saja |
| penjelasan | Pandai merahasiakan perasaan, meski sedang marah atau menyesal tetap terlihat tenang. Pandai bergaul dan banyak kawan, namun memiliki pendirian yang sangat kuat dan terkadang sulit dikendalikan nafsunya. | [lib/data.ts:525](../lib/data.ts#L525) | Belum diusulkan; inventaris saja |

#### lintang:Soma:Pon — Kiriman

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Rendah Hati | [lib/data.ts:531](../lib/data.ts#L531) | Belum diusulkan; inventaris saja |
| makna | Sumur Sinaba | [lib/data.ts:532](../lib/data.ts#L532) | Belum diusulkan; inventaris saja |
| penjelasan | Meskipun terlihat suka pamer, aslinya sangat berhati-hati dan suka mengalah. Bicaranya mungkin terdengar keras, namun sebenarnya baik budi, ramah tamah, dan sangat menjunjung tata susila. | [lib/data.ts:533](../lib/data.ts#L533) | Belum diusulkan; inventaris saja |

#### lintang:Anggara:Wage — Jongsarat

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Penyelidik Setia | [lib/data.ts:539](../lib/data.ts#L539) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bumi | [lib/data.ts:540](../lib/data.ts#L540) | Belum diusulkan; inventaris saja |
| penjelasan | Suka mengalah dalam pergaulan dan gemar menolong orang yang sedang kesulitan. Sangat mantap dalam menyelidiki hal-hal penting, namun cenderung pencemburu dan mudah tersinggung. | [lib/data.ts:541](../lib/data.ts#L541) | Belum diusulkan; inventaris saja |

#### lintang:Buda:Kliwon — Tiwa-tiwa

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Penyusun Kata | [lib/data.ts:547](../lib/data.ts#L547) | Belum diusulkan; inventaris saja |
| makna | Lakunya Surya | [lib/data.ts:548](../lib/data.ts#L548) | Belum diusulkan; inventaris saja |
| penjelasan | Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung. | [lib/data.ts:549](../lib/data.ts#L549) | communicating (support; C-COMM-03) |

#### lintang:Wraspati:Umanis — Sangka Tikel

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Visioner Bijak | [lib/data.ts:555](../lib/data.ts#L555) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bintang | [lib/data.ts:556](../lib/data.ts#L556) | Belum diusulkan; inventaris saja |
| penjelasan | Memiliki cita-cita setinggi langit, bijaksana, dan pandai bergaul. Bicaranya tegas dan keras, namun terkadang suka mencampuri urusan orang lain dan butuh dorongan agar tidak lekas patah hati. | [lib/data.ts:557](../lib/data.ts#L557) | Belum diusulkan; inventaris saja |

#### lintang:Sukra:Paing — Bubu Bolong

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Jujur & Dermawan | [lib/data.ts:563](../lib/data.ts#L563) | Belum diusulkan; inventaris saja |
| makna | Tunggak Semi | [lib/data.ts:564](../lib/data.ts#L564) | Belum diusulkan; inventaris saja |
| penjelasan | Pribadi yang ramah, jujur, dan memiliki angan-angan mulia sehingga disukai banyak orang. Namun, perlu waspada terhadap sifat pemboros dan kemauan yang terlalu keras. | [lib/data.ts:565](../lib/data.ts#L565) | Belum diusulkan; inventaris saja |

#### lintang:Saniscara:Pon — Sungenge

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Berwibawa Tinggi | [lib/data.ts:571](../lib/data.ts#L571) | Belum diusulkan; inventaris saja |
| makna | Lakunya Air | [lib/data.ts:572](../lib/data.ts#L572) | Belum diusulkan; inventaris saja |
| penjelasan | Bercita-cita mulia dan senang menunjukkan kepandaian atau kekayaan. Disegani oleh orang banyak dan memiliki sifat pemaaf bagi mereka yang mengakui kesalahan. | [lib/data.ts:573](../lib/data.ts#L573) | Belum diusulkan; inventaris saja |

#### lintang:Redite:Wage — Uluku

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Pekerja Keras | [lib/data.ts:579](../lib/data.ts#L579) | Belum diusulkan; inventaris saja |
| makna | Lakunya Angin | [lib/data.ts:580](../lib/data.ts#L580) | Belum diusulkan; inventaris saja |
| penjelasan | Sangat suka bekerja dan pandai menjaga rahasia penting. Meskipun dermawan, mereka sangat teguh pada pendapatnya jika ditentang dan sering memiliki sifat mudah kaget. | [lib/data.ts:581](../lib/data.ts#L581) | Belum diusulkan; inventaris saja |

#### lintang:Soma:Kliwon — Pedati

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Pengorban Tulus | [lib/data.ts:587](../lib/data.ts#L587) | Belum diusulkan; inventaris saja |
| makna | Satria Wirang | [lib/data.ts:588](../lib/data.ts#L588) | Belum diusulkan; inventaris saja |
| penjelasan | Lemah lembut dan berkelakuan pantas. Meskipun mudah sakit hati, mereka sangat cepat memaafkan dan melupakan dendam. Rela berkorban demi keadilan bagi orang lain. | [lib/data.ts:589](../lib/data.ts#L589) | Belum diusulkan; inventaris saja |

#### lintang:Anggara:Umanis — Kuda

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Tangkas & Maju | [lib/data.ts:595](../lib/data.ts#L595) | Belum diusulkan; inventaris saja |
| makna | Lakunya Api | [lib/data.ts:596](../lib/data.ts#L596) | Belum diusulkan; inventaris saja |
| penjelasan | Sangat tangkas dalam bekerja dan selalu mengejar kemajuan. Memiliki cita-cita besar namun sering kali cemburu dan jengkel jika ada yang menentang pendiriannya. | [lib/data.ts:597](../lib/data.ts#L597) | Belum diusulkan; inventaris saja |

#### lintang:Buda:Paing — Gajahmina

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Waspada & Murah Hati | [lib/data.ts:603](../lib/data.ts#L603) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bulan | [lib/data.ts:604](../lib/data.ts#L604) | Belum diusulkan; inventaris saja |
| penjelasan | Sangat berhati-hati dan selalu mempertimbangkan segala hal sebelum bertindak. Tidak suka mencampuri urusan orang lain, namun jika marah bisa sangat hebat. | [lib/data.ts:605](../lib/data.ts#L605) | Belum diusulkan; inventaris saja |

#### lintang:Wraspati:Pon — Bade

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Pencari Pengalaman | [lib/data.ts:611](../lib/data.ts#L611) | Belum diusulkan; inventaris saja |
| makna | Lakunya Surya | [lib/data.ts:612](../lib/data.ts#L612) | Belum diusulkan; inventaris saja |
| penjelasan | Selalu ingin menambah pengalaman dan mencari kemajuan lahir batin. Namun, perlu berhati-hati dengan sifat pamer kepandaian agar tidak mendatangkan bahaya bagi diri sendiri. | [lib/data.ts:613](../lib/data.ts#L613) | Belum diusulkan; inventaris saja |

#### lintang:Sukra:Wage — Maglut

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Setia & Pengabdi | [lib/data.ts:619](../lib/data.ts#L619) | Belum diusulkan; inventaris saja |
| makna | Pendeta Sakti | [lib/data.ts:620](../lib/data.ts#L620) | Belum diusulkan; inventaris saja |
| penjelasan | Sangat jujur, setia, dan murah hati. Sering menjadi korban demi kepentingan keluarga atau saudaranya, namun tetap teguh dengan pendiriannya meskipun harus menderita. | [lib/data.ts:621](../lib/data.ts#L621) | Belum diusulkan; inventaris saja |

#### lintang:Saniscara:Kliwon — Pagelangan

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Sopan & Hati-hati | [lib/data.ts:627](../lib/data.ts#L627) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bumi | [lib/data.ts:628](../lib/data.ts#L628) | Belum diusulkan; inventaris saja |
| penjelasan | Ramah tamah dan sangat hati-hati dalam bertindak. Pandai menyusun kata-kata, namun terkadang kurang percaya diri dan mudah putus asa saat menghadapi kesulitan besar. | [lib/data.ts:629](../lib/data.ts#L629) | Belum diusulkan; inventaris saja |

#### lintang:Redite:Umanis — Kala Sungsang

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Diplomat Tenang | [lib/data.ts:635](../lib/data.ts#L635) | Belum diusulkan; inventaris saja |
| makna | Pendeta Sakti | [lib/data.ts:636](../lib/data.ts#L636) | Belum diusulkan; inventaris saja |
| penjelasan | Pandai menyembunyikan perasaan dan tetap tenang meski sedang marah. Suka berdebat dan terkadang mencampuri urusan orang lain, namun aslinya berhati kaku. | [lib/data.ts:637](../lib/data.ts#L637) | Belum diusulkan; inventaris saja |

#### lintang:Soma:Paing — Kukus

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Rajin & Setia | [lib/data.ts:643](../lib/data.ts#L643) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bintang | [lib/data.ts:644](../lib/data.ts#L644) | Belum diusulkan; inventaris saja |
| penjelasan | Berkelakuan baik, jujur, dan rajin bekerja. Memiliki cita-cita tinggi dan sangat setia pada janjinya. Hidupnya cenderung hemat, cermat, dan tertata. | [lib/data.ts:645](../lib/data.ts#L645) | executing (support; C-EXEC-04) |

#### lintang:Anggara:Pon — Asu

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Waspada & Mewah | [lib/data.ts:651](../lib/data.ts#L651) | Belum diusulkan; inventaris saja |
| makna | Satria Wibawa | [lib/data.ts:652](../lib/data.ts#L652) | Belum diusulkan; inventaris saja |
| penjelasan | Menyukai kemewahan namun tetap waspada dan pandai berbahasa. Sangat baik terhadap kawan yang loyal, namun sulit percaya pada orang baru dan suka berdebat. | [lib/data.ts:653](../lib/data.ts#L653) | Belum diusulkan; inventaris saja |

#### lintang:Buda:Wage — Kartika

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Adil & Pantas | [lib/data.ts:659](../lib/data.ts#L659) | Belum diusulkan; inventaris saja |
| makna | Aras Tuding | [lib/data.ts:660](../lib/data.ts#L660) | Belum diusulkan; inventaris saja |
| penjelasan | Umumnya berkelakuan baik dan mengerti nilai uang (ekonomis). Suka menimbang segala hal dengan adil, bicaranya tegas meskipun terkadang terdengar janggal. | [lib/data.ts:661](../lib/data.ts#L661) | Belum diusulkan; inventaris saja |

#### lintang:Wraspati:Kliwon — Naga

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Tajam & Ulet | [lib/data.ts:667](../lib/data.ts#L667) | Belum diusulkan; inventaris saja |
| makna | Lakunya Air | [lib/data.ts:668](../lib/data.ts#L668) | Belum diusulkan; inventaris saja |
| penjelasan | Bicaranya tajam dan cita-citanya tinggi. Memiliki pikiran yang ulet dan ramah, namun hatinya sangat sensitif sehingga mudah tersinggung dan jatuh dalam kesedihan. | [lib/data.ts:669](../lib/data.ts#L669) | Belum diusulkan; inventaris saja |

#### lintang:Sukra:Umanis — Banyak Angrem

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Terus Terang | [lib/data.ts:675](../lib/data.ts#L675) | Belum diusulkan; inventaris saja |
| makna | Aras Tuding | [lib/data.ts:676](../lib/data.ts#L676) | Belum diusulkan; inventaris saja |
| penjelasan | Jujur, suka berterus terang, dan dermawan. Sangat suka menolong, namun jika sudah tidak cocok dengan seseorang, mereka bisa memutus hubungan secara total. | [lib/data.ts:677](../lib/data.ts#L677) | Belum diusulkan; inventaris saja |

#### lintang:Saniscara:Paing — Ru

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Cepat Memaafkan | [lib/data.ts:683](../lib/data.ts#L683) | Belum diusulkan; inventaris saja |
| makna | Lakunya Api | [lib/data.ts:684](../lib/data.ts#L684) | Belum diusulkan; inventaris saja |
| penjelasan | Memiliki nafsu yang besar dan lekas marah, namun sangat mudah sabar dan menyesal. Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan. | [lib/data.ts:685](../lib/data.ts#L685) | Belum diusulkan; inventaris saja |

#### lintang:Redite:Pon — Patrem

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Ahli Diplomasi | [lib/data.ts:691](../lib/data.ts#L691) | Belum diusulkan; inventaris saja |
| makna | Aras Kembang | [lib/data.ts:692](../lib/data.ts#L692) | Belum diusulkan; inventaris saja |
| penjelasan | Sangat licin dan pandai berdiplomasi. Suka memperlihatkan kekayaan dan kepandaiannya di hadapan orang lain, namun pandai menyimpan perasaan yang sesungguhnya. | [lib/data.ts:693](../lib/data.ts#L693) | Belum diusulkan; inventaris saja |

#### lintang:Soma:Wage — Lembu

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Jujur & Empati | [lib/data.ts:699](../lib/data.ts#L699) | Belum diusulkan; inventaris saja |
| makna | Lakunya Api | [lib/data.ts:700](../lib/data.ts#L700) | Belum diusulkan; inventaris saja |
| penjelasan | Segala urusan ditimbang dengan baik dan tidak terburu nafsu. Memiliki empati yang tinggi terhadap kesulitan orang lain, namun jika marah sangat sulit diredakan. | [lib/data.ts:701](../lib/data.ts#L701) | Belum diusulkan; inventaris saja |

#### lintang:Anggara:Kliwon — Depat

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Ramah & Menyenangkan | [lib/data.ts:707](../lib/data.ts#L707) | Belum diusulkan; inventaris saja |
| makna | Sumur Sinaba | [lib/data.ts:708](../lib/data.ts#L708) | Belum diusulkan; inventaris saja |
| penjelasan | Pintar menyusun kata-kata sehingga bicaranya menyenangkan pendengar. Murah hati, namun terkadang memiliki pikiran yang keruh dan sulit percaya pada orang lain. | [lib/data.ts:709](../lib/data.ts#L709) | Belum diusulkan; inventaris saja |

#### lintang:Buda:Umanis — Tangis

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Bijaksana & Peka | [lib/data.ts:715](../lib/data.ts#L715) | Belum diusulkan; inventaris saja |
| makna | Aras Kembang | [lib/data.ts:716](../lib/data.ts#L716) | Belum diusulkan; inventaris saja |
| penjelasan | Berkelakuan sopan, adil, dan bijaksana. Suka menolong kawan setia, namun sering dilingkupi rasa bimbang dan kesedihan yang mendalam. | [lib/data.ts:717](../lib/data.ts#L717) | Belum diusulkan; inventaris saja |

#### lintang:Wraspati:Paing — Salah Ukur

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Giat & Dinamis | [lib/data.ts:723](../lib/data.ts#L723) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bumi | [lib/data.ts:724](../lib/data.ts#L724) | Belum diusulkan; inventaris saja |
| penjelasan | Memiliki kemauan yang tangkas dan giat mencari kemajuan lahir batin. Sangat rukun dengan keluarga, namun bicaranya terkadang menyinggung atau salah terka terhadap orang lain. | [lib/data.ts:725](../lib/data.ts#L725) | Belum diusulkan; inventaris saja |

#### lintang:Sukra:Pon — Prahu Pegat

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Pecinta Keadilan | [lib/data.ts:731](../lib/data.ts#L731) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bintang | [lib/data.ts:732](../lib/data.ts#L732) | Belum diusulkan; inventaris saja |
| penjelasan | Suka bergaul, jujur, dan memiliki perikemanusiaan yang tinggi. Namun, sering merasa bimbang dan sedih hati yang membuat kemauannya mudah terputus di tengah jalan. | [lib/data.ts:733](../lib/data.ts#L733) | Belum diusulkan; inventaris saja |

#### lintang:Saniscara:Wage — Puwuh Atarung

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Tegas & Dermawan | [lib/data.ts:739](../lib/data.ts#L739) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bintang | [lib/data.ts:740](../lib/data.ts#L740) | Belum diusulkan; inventaris saja |
| penjelasan | Pintar mengatur rumah tangga dan menyukai kemewahan. Bicaranya tegas dan sangat murah hati kepada mereka yang memuji dirinya, namun cenderung pencemburu. | [lib/data.ts:741](../lib/data.ts#L741) | Belum diusulkan; inventaris saja |

#### lintang:Redite:Kliwon — Lawean

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Sabar & Sopan | [lib/data.ts:747](../lib/data.ts#L747) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bintang | [lib/data.ts:748](../lib/data.ts#L748) | Belum diusulkan; inventaris saja |
| penjelasan | Pribadi yang sabar, sopan, dan pandai berdiplomasi. Memiliki derajat yang tinggi dan pendiam, namun sulit diubah jika sudah memiliki pendapat sendiri. | [lib/data.ts:749](../lib/data.ts#L749) | Belum diusulkan; inventaris saja |

#### lintang:Soma:Umanis — Kelapa

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Sopan & Dermawan | [lib/data.ts:755](../lib/data.ts#L755) | Belum diusulkan; inventaris saja |
| makna | Lakunya Angin | [lib/data.ts:756](../lib/data.ts#L756) | Belum diusulkan; inventaris saja |
| penjelasan | Berperilaku sopan santun dan ingin selalu berbuat baik. Suka membantu orang yang disetujuinya, namun memiliki kegemaran mengembara dan berdebat. | [lib/data.ts:757](../lib/data.ts#L757) | Belum diusulkan; inventaris saja |

#### lintang:Anggara:Paing — Yuyu

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Murah Rezeki | [lib/data.ts:763](../lib/data.ts#L763) | Belum diusulkan; inventaris saja |
| makna | Aras Kembang | [lib/data.ts:764](../lib/data.ts#L764) | Belum diusulkan; inventaris saja |
| penjelasan | Murah hati dan suka menolong orang yang disukai. Rezekinya lancar, namun cenderung serakah terhadap apa yang dilihat dan mudah menyesal setelah bertindak emosional. | [lib/data.ts:765](../lib/data.ts#L765) | Belum diusulkan; inventaris saja |

#### lintang:Buda:Pon — Lumbung

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Waspada & Rajin | [lib/data.ts:771](../lib/data.ts#L771) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bulan | [lib/data.ts:772](../lib/data.ts#L772) | Belum diusulkan; inventaris saja |
| penjelasan | Sopan santun, waspada, dan memiliki rezeki yang baik. Sangat rajin dalam bekerja dan dicintai banyak orang, namun mudah tersinggung jika merasa tidak dihargai. | [lib/data.ts:773](../lib/data.ts#L773) | Belum diusulkan; inventaris saja |

#### lintang:Wraspati:Wage — Kumba

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Adil & Cerdas | [lib/data.ts:779](../lib/data.ts#L779) | Belum diusulkan; inventaris saja |
| makna | Aras Kembang | [lib/data.ts:780](../lib/data.ts#L780) | Belum diusulkan; inventaris saja |
| penjelasan | Memiliki angan-angan tinggi dan suka berlaku adil. Sangat cerdas dalam memikirkan solusi masalah, namun cenderung pendendam jika merasa disalahi. | [lib/data.ts:781](../lib/data.ts#L781) | Belum diusulkan; inventaris saja |

#### lintang:Sukra:Kliwon — Udang

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Berpengaruh Besar | [lib/data.ts:787](../lib/data.ts#L787) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bulan | [lib/data.ts:788](../lib/data.ts#L788) | Belum diusulkan; inventaris saja |
| penjelasan | Berbudi baik, sabar, dan sangat ahli dalam mengarang atau berdiplomasi. Memiliki pengaruh besar dan dicintai orang, sukses biasanya datang saat usia dewasa. | [lib/data.ts:789](../lib/data.ts#L789) | Belum diusulkan; inventaris saja |

#### lintang:Saniscara:Umanis — Begoong

Jenis: `lintang`; cycle: `null`; sumber budaya: `unknown`; provenance: `missing`; review: `pending`.

| sourceField | Teks interpretasi asli | Lokasi | Potensi dimensi (belum disetujui) |
| --- | --- | --- | --- |
| label | Pandai & Berani | [lib/data.ts:795](../lib/data.ts#L795) | Belum diusulkan; inventaris saja |
| makna | Lakunya Bulan | [lib/data.ts:796](../lib/data.ts#L796) | Belum diusulkan; inventaris saja |
| penjelasan | Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain. | [lib/data.ts:797](../lib/data.ts#L797) | communicating (caution; C-COMM-04) |


## Validasi dan batas hasil

Seluruh 311 kutipan/field inventaris serta 25 kutipan kandidat/usulan penolakan harus cocok persis dengan AST `lib/data.ts`. Identitas record dan cycle disandingkan dengan adapter. Pemeriksaan G6A.4 juga memastikan referensi lokal valid, registry produksi kosong, dan diff di luar `docs/` kosong. Hasil validasi teknis tidak menaikkan status sumber budaya atau approval.

Keputusan: katalog siap ditinjau. Tidak ada evidence yang boleh dipindahkan ke registry runtime sebelum keputusan ahli dan pemilik produk tercatat.
