# Worksheet verifikasi sumber dan interpretasi — G6A.5

Status: **22/22 menunggu review; tidak ada verifikasi budaya baru**.

Input: katalog G6A.4 pada checkpoint `e41bd993e0e22a4ffab68f5ed1b7ccc314fee336`. Tanggal pelaksanaan milestone bukan tanggal review ahli; seluruh reviewDate di bawah null karena review belum dilakukan.

Baca [katalog lengkap dan konteks record](samyoga-position-evidence-catalog.md), [dimensi](samyoga-position-dimensions.md), serta [hasil simulasi G6A.5](samyoga-position-g6a5-review.md).

## Petunjuk penggunaan

1. Periksa teks tradisional terlebih dahulu dan isi edisi serta halaman/locator yang benar-benar ditemukan. Lokasi lib/data.ts adalah lokasi master kode, bukan halaman naskah budaya.
2. Jika sumber belum diperiksa atau kutipan hanya mirip, pertahankan status missing. Daftar bibliographyToInspect adalah antrean pencarian dari bibliografi global repository, bukan atribusi sumber yang sudah terbukti.
3. Berikan keputusan terpisah untuk makna teks → dimensi/polarity. Kutipan yang benar dapat tetap menghasilkan usulan dimensi yang ditolak.
4. Pemilik produk meninjau dimensi → fungsi posisi melalui productPositionMappingReview tersendiri. Persetujuan ahli tidak mengisi approval produk secara otomatis.
5. Catat reviewer, tanggal review, keputusan, batas interpretasi dan referensi keputusan hanya setelah review nyata. Naikkan reviewRecordVersion bila keputusan berubah; simpan versi sebelumnya melalui workflow review yang disepakati.
6. Worksheet ini tidak dibaca registry produksi. Mengisi dokumen bukan tindakan aktivasi runtime.

Tidak ada angka simulasi yang boleh menjadi alasan untuk menyatakan kutipan verified atau mengubah keputusan ahli agar cakupan posisi terlihat lebih tinggi.

## Daftar worksheet

### C-DIR-01

```json
{
  "evidenceId": "C-DIR-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "asatawara",
  "indicatorValue": "Sri",
  "masterRecordId": "wewaran:asatawara:1",
  "sourceField": "karakter",
  "excerpt": "Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 437
  },
  "proposedDimension": "directing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kalimat menyebut mengatur, kerapian bekerja, dan kecenderungan memimpin secara eksplisit; memberi bahan tafsir pengarahan, bukan penetapan Leader tunggal.",
    "alternativeInterpretations": "Mengatur dapat berarti keteraturan pribadi; bagian kerapian juga dapat dibahas sebagai managing.",
    "risk": "Satu kalimat dipakai pada dua dimensi (C-MAN-02); bukan dua bukti independen.",
    "expertQuestions": [
      "Apakah pemetaan ke directing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:437](../lib/data.ts#L437). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-DIR-02

```json
{
  "evidenceId": "C-DIR-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "dasawara",
  "indicatorValue": "Raja",
  "masterRecordId": "wewaran:dasawara:8",
  "sourceField": "karakter",
  "excerpt": "Berjiwa besar, kharismatik, dan berbakat mengatur orang.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 467
  },
  "proposedDimension": "directing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Klausa mengatur orang mendukung hipotesis pengarahan dalam konteks wibawa dan karisma.",
    "alternativeInterpretations": "Dapat dibaca sebagai pengaruh sosial atau otoritas, bukan kepemimpinan partisipatif.",
    "risk": "Karisma tidak membuktikan pengambilan keputusan, tanggung jawab, atau etika kepemimpinan.",
    "expertQuestions": [
      "Apakah pemetaan ke directing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:467](../lib/data.ts#L467). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-DIR-03

```json
{
  "evidenceId": "C-DIR-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Sinta",
  "masterRecordId": "wuku:1",
  "sourceField": "sifat_umum",
  "excerpt": "Tegas, agak kaku, berjiwa pemimpin.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 9
  },
  "proposedDimension": "directing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Teks secara bersamaan menyebut kepemimpinan, ketegasan, dan kekakuan; dukungan pengarahan harus dibaca bersama C-DIR-04.",
    "alternativeInterpretations": "Ketegasan dapat berarti teguh terhadap pendapat sendiri tanpa mengarahkan orang lain.",
    "risk": "Tidak boleh mengekstrak frasa positif lalu membuang konteks agak kaku.",
    "expertQuestions": [
      "Apakah pemetaan ke directing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:9](../lib/data.ts#L9). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-DIR-04

```json
{
  "evidenceId": "C-DIR-04",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Sinta",
  "masterRecordId": "wuku:1",
  "sourceField": "kelemahan",
  "excerpt": "Keras kepala, sulit menerima kritik.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 11
  },
  "proposedDimension": "directing",
  "polarity": "caution",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kesulitan menerima kritik menjadi pertanyaan domain tentang keterbukaan saat memberi arah, terkait C-DIR-03.",
    "alternativeInterpretations": "Ini juga dapat berkaitan dengan komunikasi atau sikap mempertahankan prinsip; tidak otomatis blocker.",
    "risk": "Caution ini masih inferensi; konflik same-dimension belum boleh diaktifkan tanpa persetujuan.",
    "expertQuestions": [
      "Apakah pemetaan ke directing dengan polarity caution tepat dalam konteks kalimat penuh?",
      "Apakah caution ini benar relevan, atau sebaiknya ditolak/ditampilkan sebagai catatan konteks tanpa memblokir rule?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:11](../lib/data.ts#L11). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-PLAN-01

```json
{
  "evidenceId": "C-PLAN-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "asatawara",
  "indicatorValue": "Indra",
  "masterRecordId": "wewaran:asatawara:2",
  "sourceField": "karakter",
  "excerpt": "Visioner, berbakat dalam perencanaan, dan sangat tekun.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 438
  },
  "proposedDimension": "planning",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Perencanaan disebut eksplisit bersama orientasi ke depan dan ketekunan.",
    "alternativeInterpretations": "Bisa berarti aspirasi atau ketekunan individu, bukan rencana kerja organisasi.",
    "risk": "Tidak ada ukuran kualitas, realisme, atau pelaksanaan rencana.",
    "expertQuestions": [
      "Apakah pemetaan ke planning dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:438](../lib/data.ts#L438). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-PLAN-02

```json
{
  "evidenceId": "C-PLAN-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "sangawara",
  "indicatorValue": "Urungan",
  "masterRecordId": "wewaran:sangawara:7",
  "sourceField": "karakter",
  "excerpt": "Penuh pertimbangan dan sangat hati-hati dalam melangkah.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 454
  },
  "proposedDimension": "planning",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Pertimbangan dan kehati-hatian sebelum melangkah memberi hipotesis deliberasi.",
    "alternativeInterpretations": "Kehati-hatian dapat berarti penghindaran risiko; belum tentu menghasilkan rencana.",
    "risk": "Dukungan lebih tidak langsung dibanding C-PLAN-01.",
    "expertQuestions": [
      "Apakah pemetaan ke planning dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:454](../lib/data.ts#L454). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-PLAN-03

```json
{
  "evidenceId": "C-PLAN-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Pujut",
  "masterRecordId": "wuku:15",
  "sourceField": "kelemahan",
  "excerpt": "Lamban bertindak, suka ragu.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 137
  },
  "proposedDimension": "planning",
  "polarity": "caution",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Keraguan dan lambat bertindak perlu ditinjau sebagai batas tafsir deliberasi yang berlebihan, bukan cacat kemampuan.",
    "alternativeInterpretations": "Kelambatan bisa mencerminkan kehati-hatian yang adaptif; bukan bukti buruk merencanakan.",
    "risk": "Pemetaan ke planning lemah; ahli boleh menolak tag ini.",
    "expertQuestions": [
      "Apakah pemetaan ke planning dengan polarity caution tepat dalam konteks kalimat penuh?",
      "Apakah caution ini benar relevan, atau sebaiknya ditolak/ditampilkan sebagai catatan konteks tanpa memblokir rule?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:137](../lib/data.ts#L137). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-MAN-01

```json
{
  "evidenceId": "C-MAN-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "triwara",
  "indicatorValue": "Beteng",
  "masterRecordId": "wewaran:triwara:2",
  "sourceField": "karakter",
  "excerpt": "Berjiwa pelindung, pandai mengelola sumber daya, dan makmur.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 353
  },
  "proposedDimension": "managing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Pengelolaan sumber daya disebut eksplisit dalam kalimat yang juga memuat pelindung dan kemakmuran.",
    "alternativeInterpretations": "Dapat merujuk konteks rumah tangga atau simbol kesejahteraan.",
    "risk": "Klaim makmur dalam kalimat tidak ikut dijadikan bukti kompetensi.",
    "expertQuestions": [
      "Apakah pemetaan ke managing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:353](../lib/data.ts#L353). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-MAN-02

```json
{
  "evidenceId": "C-MAN-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "asatawara",
  "indicatorValue": "Sri",
  "masterRecordId": "wewaran:asatawara:1",
  "sourceField": "karakter",
  "excerpt": "Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 437
  },
  "proposedDimension": "managing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kerapian bekerja dan pengaturan mendukung hipotesis penataan proses pada teks yang sama dengan C-DIR-01.",
    "alternativeInterpretations": "Dapat merupakan keteraturan diri, bukan pengelolaan sumber daya kelompok.",
    "risk": "Jangan menghitung C-DIR-01 dan C-MAN-02 sebagai sumber independen.",
    "expertQuestions": [
      "Apakah pemetaan ke managing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:437](../lib/data.ts#L437). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-MAN-03

```json
{
  "evidenceId": "C-MAN-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Kuningan",
  "masterRecordId": "wuku:12",
  "sourceField": "kelebihan",
  "excerpt": "Sangat teliti dalam keuangan dan aturan.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 109
  },
  "proposedDimension": "managing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Teks mengaitkan ketelitian dengan keuangan dan aturan; layak dibahas sebagai simbol keteraturan terbatas.",
    "alternativeInterpretations": "Ketelitian ini juga bisa berkaitan dengan executing; bukan bukti perencanaan anggaran.",
    "risk": "Berisiko menyamakan ramalan dengan kompetensi profesional keuangan; batasnya harus eksplisit.",
    "expertQuestions": [
      "Apakah pemetaan ke managing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:109](../lib/data.ts#L109). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COMM-01

```json
{
  "evidenceId": "C-COMM-01",
  "indicatorType": "wewaran",
  "wewaranCycle": "dwiwara",
  "indicatorValue": "Menga",
  "masterRecordId": "wewaran:dwiwara:1",
  "sourceField": "karakter",
  "excerpt": "Terbuka, komunikatif, dan mudah menerima masukan dari luar.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 347
  },
  "proposedDimension": "communicating",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Komunikasi muncul bersama keterbukaan dan penerimaan masukan; konteks lebih lengkap daripada hanya pandai bicara.",
    "alternativeInterpretations": "Keterbukaan dapat merupakan kerja sama atau sikap menerima pengaruh luar.",
    "risk": "Tidak membuktikan akurasi pesan, kemampuan mendengar, atau penyelesaian konflik nyata.",
    "expertQuestions": [
      "Apakah pemetaan ke communicating dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:347](../lib/data.ts#L347). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COMM-02

```json
{
  "evidenceId": "C-COMM-02",
  "indicatorType": "pancawara",
  "wewaranCycle": null,
  "indicatorValue": "Kliwon",
  "masterRecordId": "pancawara:5",
  "sourceField": "karakter",
  "excerpt": "Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 370
  },
  "proposedDimension": "communicating",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Pandai berbicara memberi hipotesis ekspresi verbal; pemaaf dan spiritualitas tetap menjadi konteks kalimat.",
    "alternativeInterpretations": "Kefasihan berbicara bisa bersifat retoris, bukan pertukaran informasi yang efektif.",
    "risk": "Tidak boleh menganggap spiritualitas sebagai kemampuan kerja.",
    "expertQuestions": [
      "Apakah pemetaan ke communicating dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:370](../lib/data.ts#L370). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COMM-03

```json
{
  "evidenceId": "C-COMM-03",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Tiwa-tiwa",
  "masterRecordId": "lintang:Buda:Kliwon",
  "sourceField": "penjelasan",
  "excerpt": "Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 549
  },
  "proposedDimension": "communicating",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (tercantum About:671; hubungan kutipan belum dibuktikan).",
      "Tautan Palintangan yang tercantum About:687 (isi dan asal kutipan belum diverifikasi)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kemampuan merangkai kata dijelaskan bersama kesantunan dan sensitivitas; kandidat ekspresi verbal/tulis terbatas.",
    "alternativeInterpretations": "Mengarang dapat merujuk karya sastra, tidak sama dengan koordinasi tugas.",
    "risk": "Bagian sensitif/mudah tersinggung tidak boleh dihilangkan dari penjelasan pengguna.",
    "expertQuestions": [
      "Apakah pemetaan ke communicating dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:549](../lib/data.ts#L549). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COMM-04

```json
{
  "evidenceId": "C-COMM-04",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Begoong",
  "masterRecordId": "lintang:Saniscara:Umanis",
  "sourceField": "penjelasan",
  "excerpt": "Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 797
  },
  "proposedDimension": "communicating",
  "polarity": "caution",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (tercantum About:671; hubungan kutipan belum dibuktikan).",
      "Tautan Palintangan yang tercantum About:687 (isi dan asal kutipan belum diverifikasi)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kalimat menyebut bicara tajam dan mencampuri urusan orang lain sekaligus keberanian dan keterampilan; membutuhkan pembacaan utuh.",
    "alternativeInterpretations": "Bicara tajam dapat berarti langsung atau kritis, bukan komunikasi yang buruk.",
    "risk": "Caution ini bukan alasan menilai seseorang tidak layak memimpin; perlu penentuan konteks oleh ahli.",
    "expertQuestions": [
      "Apakah pemetaan ke communicating dengan polarity caution tepat dalam konteks kalimat penuh?",
      "Apakah caution ini benar relevan, atau sebaiknya ditolak/ditampilkan sebagai catatan konteks tanpa memblokir rule?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:797](../lib/data.ts#L797). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-EXEC-01

```json
{
  "evidenceId": "C-EXEC-01",
  "indicatorType": "saptawara",
  "wewaranCycle": null,
  "indicatorValue": "Buda",
  "masterRecordId": "saptawara:4",
  "sourceField": "karakter",
  "excerpt": "Cerdas, teliti dalam bekerja, dan sangat menghargai aturan.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 430
  },
  "proposedDimension": "executing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Ketelitian dalam bekerja dan penghargaan aturan lebih spesifik terhadap pelaksanaan aktivitas daripada sifat cerdas saja.",
    "alternativeInterpretations": "Dapat menggambarkan preferensi keteraturan; belum membuktikan ketekunan.",
    "risk": "Tidak cukup sebagai satu-satunya bukti konsistensi untuk rule Operasional.",
    "expertQuestions": [
      "Apakah pemetaan ke executing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:430](../lib/data.ts#L430). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-EXEC-02

```json
{
  "evidenceId": "C-EXEC-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "sangawara",
  "indicatorValue": "Dangu",
  "masterRecordId": "wewaran:sangawara:1",
  "sourceField": "karakter",
  "excerpt": "Tenang, konsisten, dan tidak suka terburu-buru.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 448
  },
  "proposedDimension": "executing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Konsistensi dan tidak terburu-buru memberi aspek kontinuitas tindakan simbolis.",
    "alternativeInterpretations": "Tidak terburu-buru dapat berarti lambat; tidak menunjukkan kapasitas menyelesaikan tugas.",
    "risk": "Tidak boleh disamakan dengan produktivitas atau kecepatan kerja.",
    "expertQuestions": [
      "Apakah pemetaan ke executing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:448](../lib/data.ts#L448). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-EXEC-03

```json
{
  "evidenceId": "C-EXEC-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Wariga",
  "masterRecordId": "wuku:7",
  "sourceField": "kelebihan",
  "excerpt": "Rapi dalam bekerja, setia, artistik.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 64
  },
  "proposedDimension": "executing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kerapian dalam bekerja memberi aspek ketelitian proses, dengan kesetiaan dan artistik sebagai konteks.",
    "alternativeInterpretations": "Kerapian dapat lebih dekat ke estetika dan penataan pribadi.",
    "risk": "Tidak membuktikan konsistensi; hindari memperluas artistik ke kemampuan kerja umum.",
    "expertQuestions": [
      "Apakah pemetaan ke executing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:64](../lib/data.ts#L64). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-EXEC-04

```json
{
  "evidenceId": "C-EXEC-04",
  "indicatorType": "lintang",
  "wewaranCycle": null,
  "indicatorValue": "Kukus",
  "masterRecordId": "lintang:Soma:Paing",
  "sourceField": "penjelasan",
  "excerpt": "Berkelakuan baik, jujur, dan rajin bekerja. Memiliki cita-cita tinggi dan sangat setia pada janjinya. Hidupnya cenderung hemat, cermat, dan tertata.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 645
  },
  "proposedDimension": "executing",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (tercantum About:671; hubungan kutipan belum dibuktikan).",
      "Tautan Palintangan yang tercantum About:687 (isi dan asal kutipan belum diverifikasi)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Rajin bekerja, setia pada janji, cermat, dan tertata memberikan konteks yang saling berkaitan untuk tindak lanjut aktivitas.",
    "alternativeInterpretations": "Dapat merupakan deskripsi moral atau ekonomi rumah tangga.",
    "risk": "Teks bersifat umum dan belum teruji secara empiris; bukan asesmen profesional.",
    "expertQuestions": [
      "Apakah pemetaan ke executing dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:645](../lib/data.ts#L645). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COLL-01

```json
{
  "evidenceId": "C-COLL-01",
  "indicatorType": "saptawara",
  "wewaranCycle": null,
  "indicatorValue": "Redite",
  "masterRecordId": "saptawara:1",
  "sourceField": "karakter",
  "excerpt": "Berjiwa sosial tinggi, berwibawa, dan senang menolong.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 427
  },
  "proposedDimension": "collaborating",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Sifat sosial dan menolong memberi hipotesis hubungan saling membantu, dengan wibawa sebagai konteks.",
    "alternativeInterpretations": "Menolong tidak selalu berupa kolaborasi tim yang timbal balik.",
    "risk": "Batas antara prososial dan kerja sama organisasi harus ditinjau.",
    "expertQuestions": [
      "Apakah pemetaan ke collaborating dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:427](../lib/data.ts#L427). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COLL-02

```json
{
  "evidenceId": "C-COLL-02",
  "indicatorType": "wewaran",
  "wewaranCycle": "dasawara",
  "indicatorValue": "Manusa",
  "masterRecordId": "wewaran:dasawara:7",
  "sourceField": "karakter",
  "excerpt": "Suka bersosialisasi dan sangat mementingkan hubungan manusia.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 466
  },
  "proposedDimension": "collaborating",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Ardhana, I.B.Suparta. Pokok-pokok Wariga. 2009 (tercantum About:668; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Sosialisasi dan perhatian pada hubungan manusia memberi arah hubungan interpersonal.",
    "alternativeInterpretations": "Bisa berarti kebutuhan bersosialisasi, bukan berbagi tugas.",
    "risk": "Belum menunjukkan kesediaan kompromi atau penyelesaian konflik.",
    "expertQuestions": [
      "Apakah pemetaan ke collaborating dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:466](../lib/data.ts#L466). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COLL-03

```json
{
  "evidenceId": "C-COLL-03",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Pahang",
  "masterRecordId": "wuku:16",
  "sourceField": "kelebihan",
  "excerpt": "Pendengar yang baik, loyal.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 145
  },
  "proposedDimension": "collaborating",
  "polarity": "support",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Mendengar dan loyalitas memberi bahan tafsir partisipasi dalam hubungan; baca bersama konteks protektif dan mencampuri urusan pada record utuh.",
    "alternativeInterpretations": "Loyalitas bisa bersifat selektif pada kelompok dekat.",
    "risk": "Mendengar tidak otomatis berarti bekerja sama; hindari janji harmoni tim.",
    "expertQuestions": [
      "Apakah pemetaan ke collaborating dengan polarity support tepat dalam konteks kalimat penuh?",
      "Apakah dukungan ini langsung atau hanya analogi produk; batas apa yang wajib ditampilkan?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:145](../lib/data.ts#L145). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).

### C-COLL-04

```json
{
  "evidenceId": "C-COLL-04",
  "indicatorType": "wuku",
  "wewaranCycle": null,
  "indicatorValue": "Langkir",
  "masterRecordId": "wuku:13",
  "sourceField": "kelemahan",
  "excerpt": "Keras hati, sulit diajak kompromi.",
  "masterLocation": {
    "file": "lib/data.ts",
    "line": 119
  },
  "proposedDimension": "collaborating",
  "polarity": "caution",
  "traditionalTextVerification": {
    "status": "missing",
    "confirmedSourceId": null,
    "confirmedPage": null,
    "confirmedSourceLocation": null,
    "bibliographyToInspect": [
      "Kusuma, Sri Rsi Ananda. Wariga Dewasa. 1979 (tercantum About:667; hubungan kutipan belum dibuktikan).",
      "Arwati, Ni Made Sri. Ramalan Terhadap Hari Kelahiran Manusia. 2010 (About:671; hubungan kutipan belum dibuktikan)."
    ],
    "expertQuestions": [
      "Apakah kalimat lengkap ini benar tercantum pada sumber tradisional/terjemahan yang dapat ditunjukkan? Sebutkan edisi dan halaman atau locator.",
      "Apakah teks ini menafsirkan pribadi kelahiran, sifat hari, nasihat situasional, atau peruntungan? Adakah konteks yang terlewat?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "culturalInterpretationReview": {
    "status": "pending",
    "proposedRationale": "Kesulitan kompromi merupakan pertanyaan yang relevan untuk dimensi kerja sama, dengan konteks keberanian dan kemandirian record utuh.",
    "alternativeInterpretations": "Teguh pada prinsip tidak selalu buruk; penolakan kompromi dapat tepat pada situasi tertentu.",
    "risk": "Tidak boleh menjadi diskualifikasi atau menurunkan jabatan.",
    "expertQuestions": [
      "Apakah pemetaan ke collaborating dengan polarity caution tepat dalam konteks kalimat penuh?",
      "Apakah caution ini benar relevan, atau sebaiknya ditolak/ditampilkan sebagai catatan konteks tanpa memblokir rule?"
    ],
    "expertDecision": "pending",
    "reviewer": null,
    "reviewDate": null
  },
  "productPositionMappingReview": {
    "status": "pending",
    "productDecision": "pending",
    "decisionReference": null,
    "reviewer": null,
    "reviewDate": null,
    "question": "Setelah teks dan dimensi direview ahli, apakah menghubungkannya dengan fungsi posisi produk disetujui? Approval ini harus terpisah."
  },
  "reviewRecordVersion": "g6a5-worksheet-draft-0.1"
}
```

Kutipan master: [lib/data.ts:119](../lib/data.ts#L119). Lokasi bibliografi global: [About:667](../app/about/page.tsx#L667), [About:668](../app/about/page.tsx#L668), [About:671](../app/about/page.tsx#L671), dan [tautan Palintangan:687](../app/about/page.tsx#L687).


## Batas keputusan

Seluruh dimensi dan polarity di atas tetap usulan Metemu. Ketidaksepakatan ahli dicatat, tidak diselesaikan dengan jumlah kata atau jumlah kandidat posisi. C-DIR-01 dan C-MAN-02 berbagi sumber kalimat yang sama; jangan menyajikannya sebagai bukti independen. Saptawara/Pancawara pada dua konteks adapter juga dapat merujuk satu asal master.

Pal Sri Sedana tidak menjadi bahan pemilihan posisi. Samyoga hanya konteks relasi. Koordinator/Co-Leader tetap HOLD, Anggota bukan fallback.

Paket ini siap dipakai untuk review ahli; tidak ada klaim bahwa keaslian budaya, pemetaan dimensi, atau kecakapan jabatan sudah tervalidasi.
