# Lembar B — Persetujuan aturan produk G6A.6

Draft diskusi fungsi dan batas produk. **Tidak ada rule siap untuk persetujuan final atau aktivasi.** Semua keputusan pemilik produk, review budaya rule, reviewer, tanggal dan versi keputusan tetap pending/null. Dokumen tidak diimpor runtime.

Prasyarat: [Lembar A budaya](samyoga-position-cultural-decisions-g6a6.md) harus membuktikan asal teks dan kelayakan dimensi yang digunakan; gate produk tidak dapat menggantikan keduanya. Temuan dan matriks kelayakan ada pada [laporan provenance](samyoga-position-provenance-g6a6.md).

## Kontrak review

ID, versi hipotesis, dimensi wajib, caution, daftar evidence dan kebijakan konflik dipertahankan dari proposal G6A.4. reviewRecordVersion hanya versi format lembar ini, bukan perubahan algoritma. activationStatus review_only menyatakan semua record berikut tidak aktif; catatan HOLD Operasional tetap berlaku.

Keputusan teks, keputusan dimensi, review budaya atas kombinasi rule dan persetujuan pemilik produk merupakan keputusan terpisah. Mengisi lembar bukan aktivasi registry. Pemilik produk harus menyatakan fungsi, batas simbolis, bahasa hasil, penanganan konflik serta kandidat ganda; kemudian mencatat keputusan nyata dengan alasan, identitas, tanggal, versi dan referensi. Dokumen baru tidak mengganti aturan produksi maupun status historis proposal G6A.4.

Tidak ada skor 0–100, persentase kompatibilitas, ranking personal, atau inferensi kompetensi. Beberapa orang boleh mendapatkan kandidat sama dan satu orang boleh mendapat beberapa kandidat; tidak dipaksa satu Leader. No evidence/no support tetap insufficient_basis. Pal Sri Sedana dan kategori Samyoga tidak menjadi dasar penentuan posisi.

## Tiga rule kandidat

### METEMU-CAND-LEADER-01

```json
{
  "reviewRecordVersion": "g6a6-product-worksheet-draft-0.1",
  "ruleId": "METEMU-CAND-LEADER-01",
  "version": "g6a4-candidate-0.1",
  "position": "Leader",
  "functionDefinition": "Membantu memberi arah dan menjaga komunikasi tindakan bersama; bukan penunjukan pemimpin formal atau kompetensi personal.",
  "requiredDimensions": [
    "directing",
    "collaborating",
    "communicating"
  ],
  "optionalDimensions": [],
  "cautionConditions": [
    "C-DIR-04 pada directing bila maknanya disetujui ahli.",
    "C-COMM-04 pada communicating bila relevan dan disetujui ahli.",
    "C-COLL-04 pada collaborating bila relevan dan disetujui ahli."
  ],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "conflictPolicyNotes": "Kebijakan global existing dipertahankan. Per-rule hanya pembanding offline G6A.5; memerlukan usulan dan persetujuan terpisah bila ingin diubah.",
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
  "evidenceQualification": null,
  "evidenceDependencies": "Setiap evidence yang benar-benar dipakai harus exact-match master, provenance verified dan review budaya approved; daftar sourceEvidenceIds bukan kewajiban menghitung semua sekaligus. C-DIR-01/C-MAN-02 berbagi asal kalimat.",
  "approvalDependencies": [
    "Persetujuan sumber dan makna setiap evidence yang dipakai.",
    "Persetujuan produk atas syarat ketiga dimensi; ini bukan formula tradisional.",
    "Review konflik dan hubungan beberapa tag dari satu asal teks."
  ],
  "auditRecommendation": "HOLD — membutuhkan review budaya",
  "risk": "Karisma, kemampuan verbal dan sifat prososial dapat disalahartikan sebagai kemampuan memimpin. Hindari kuota Leader tunggal dan ranking anggota.",
  "simulationContext": {
    "denominator": 210,
    "supportMatches": 6,
    "unblockedPerRule": 4,
    "meaning": "Hipotesis kombinasi kalender, bukan kelahiran subjek, akurasi, kebenaran budaya atau kompetensi."
  },
  "culturalRuleReview": {
    "status": "pending",
    "decisionReason": null,
    "reviewer": null,
    "reviewDate": null
  },
  "productDecision": {
    "status": "pending",
    "reason": null,
    "owner": null,
    "decisionDate": null,
    "decisionVersion": null,
    "decisionReference": null
  },
  "activationStatus": "review_only",
  "productionEnabled": false,
  "reviewQuestions": [
    "Apakah ketiga dimensi wajib memang tepat untuk fungsi produk ini, dan bagaimana menjelaskan kandidat ganda tanpa penunjukan jabatan?",
    "Apakah bahasa hasil, kandidat ganda, konflik dan insufficient_basis cukup jelas tanpa skor/ranking atau fallback Anggota?",
    "Sudahkah setiap sumber dan dimensi disetujui pada Lembar A? Approval produk tidak dapat menggantikan review budaya."
  ]
}
```

### METEMU-CAND-MANAGEMENT-01

```json
{
  "reviewRecordVersion": "g6a6-product-worksheet-draft-0.1",
  "ruleId": "METEMU-CAND-MANAGEMENT-01",
  "version": "g6a4-candidate-0.1",
  "position": "Management",
  "functionDefinition": "Menata rencana dan proses/sumber daya dalam kerangka simbolis; bukan sertifikasi keuangan, administrasi atau manajerial.",
  "requiredDimensions": [
    "planning",
    "managing"
  ],
  "optionalDimensions": [],
  "cautionConditions": [
    "C-PLAN-03 hanya setelah ahli menentukan apakah keraguan bertindak relevan sebagai caution planning.",
    "Kerapian atau keberuntungan saja tidak memenuhi managing dan planning sekaligus."
  ],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "conflictPolicyNotes": "Kebijakan global existing dipertahankan. Per-rule hanya pembanding offline G6A.5; memerlukan usulan dan persetujuan terpisah bila ingin diubah.",
  "sourceEvidenceIds": [
    "C-PLAN-01",
    "C-PLAN-02",
    "C-PLAN-03",
    "C-MAN-01",
    "C-MAN-02",
    "C-MAN-03"
  ],
  "evidenceQualification": null,
  "evidenceDependencies": "Setiap evidence yang benar-benar dipakai harus exact-match master, provenance verified dan review budaya approved; daftar sourceEvidenceIds bukan kewajiban menghitung semua sekaligus. C-DIR-01/C-MAN-02 berbagi asal kalimat.",
  "approvalDependencies": [
    "Persetujuan batas planning vs managing.",
    "Persetujuan konteks sumber daya/rumah tangga pada C-MAN-01 dan keuangan pada C-MAN-03.",
    "Tidak memakai nilai peruntungan sebagai bukti."
  ],
  "auditRecommendation": "HOLD — revisi proposal evidence planning sebelum persetujuan",
  "risk": "Makmur/peruntungan dan ketelitian pribadi dapat disalahartikan sebagai keahlian mengelola anggaran/orang. Dua sumber planning belum memadai.",
  "simulationContext": {
    "denominator": 210,
    "supportMatches": 12,
    "unblockedPerRule": 12,
    "meaning": "Hipotesis kombinasi kalender, bukan kelahiran subjek, akurasi, kebenaran budaya atau kompetensi."
  },
  "culturalRuleReview": {
    "status": "pending",
    "decisionReason": null,
    "reviewer": null,
    "reviewDate": null
  },
  "productDecision": {
    "status": "pending",
    "reason": null,
    "owner": null,
    "decisionDate": null,
    "decisionVersion": null,
    "decisionReference": null
  },
  "activationStatus": "review_only",
  "productionEnabled": false,
  "reviewQuestions": [
    "Bagaimana menetapkan batas planning versus managing dan menangani C-PLAN-02/C-PLAN-03 yang disarankan ditolak?",
    "Apakah bahasa hasil, kandidat ganda, konflik dan insufficient_basis cukup jelas tanpa skor/ranking atau fallback Anggota?",
    "Sudahkah setiap sumber dan dimensi disetujui pada Lembar A? Approval produk tidak dapat menggantikan review budaya."
  ]
}
```

### METEMU-CAND-OPERATIONAL-01

```json
{
  "reviewRecordVersion": "g6a6-product-worksheet-draft-0.1",
  "ruleId": "METEMU-CAND-OPERATIONAL-01",
  "version": "g6a4-candidate-0.1",
  "position": "Operasional",
  "functionDefinition": "Menindaklanjuti aktivitas dengan konteks konsistensi atau ketelitian; bukan jabatan sisa atau tingkat kemampuan yang lebih rendah.",
  "requiredDimensions": [
    "executing"
  ],
  "optionalDimensions": [],
  "cautionConditions": [
    "Wajib memenuhi qualification consistency_or_precision di bawah; tidak cukup sekadar nama dimensi.",
    "Tidak boleh dipakai karena seseorang tidak memenuhi Leader/Management.",
    "Tidak ada caution executing terkurasi pada katalog ini; tidak adanya caution bukan bukti bebas risiko."
  ],
  "conflictPolicy": "global_abstain_on_conflict_affecting_fully_supported_rule",
  "conflictPolicyNotes": "Kebijakan global existing dipertahankan. Per-rule hanya pembanding offline G6A.5; memerlukan usulan dan persetujuan terpisah bila ingin diubah.",
  "sourceEvidenceIds": [
    "C-EXEC-01",
    "C-EXEC-02",
    "C-EXEC-03",
    "C-EXEC-04"
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
  "evidenceDependencies": "Setiap evidence yang benar-benar dipakai harus exact-match master, provenance verified dan review budaya approved; daftar sourceEvidenceIds bukan kewajiban menghitung semua sekaligus. C-DIR-01/C-MAN-02 berbagi asal kalimat.",
  "approvalDependencies": [
    "Ahli menyetujui apakah konsistensi atau ketelitian cukup untuk tafsir executing.",
    "Produk memutuskan OR dibanding AND untuk kedua aspek.",
    "Jangan konversi ke runtime sebelum evidenceQualification dapat ditegakkan."
  ],
  "auditRecommendation": "HOLD — definisi facet dan review budaya belum selesai",
  "risk": "Rajin/rapi tidak mengukur produktivitas. Facet consistency belum mempunyai sumber lengkap. Tanpa caution terkurasi tidak berarti bebas risiko.",
  "simulationContext": {
    "denominator": 210,
    "supportMatches": 62,
    "unblockedPerRule": 62,
    "facetOR": 62,
    "facetAND": 6,
    "consistencyOnly": 26,
    "precisionOnly": 42,
    "meaning": "Hipotesis kombinasi kalender, bukan kelahiran subjek, akurasi, kebenaran budaya atau kompetensi."
  },
  "culturalRuleReview": {
    "status": "pending",
    "decisionReason": null,
    "reviewer": null,
    "reviewDate": null
  },
  "productDecision": {
    "status": "pending",
    "reason": null,
    "owner": null,
    "decisionDate": null,
    "decisionVersion": null,
    "decisionReference": null
  },
  "activationStatus": "review_only",
  "productionEnabled": false,
  "reviewQuestions": [
    "Apakah OR atau AND konsistensi/ketelitian dapat dibenarkan, bukti apa yang tepat, dan bagaimana menghindari hierarki kemampuan antarposisi?",
    "Apakah bahasa hasil, kandidat ganda, konflik dan insufficient_basis cukup jelas tanpa skor/ranking atau fallback Anggota?",
    "Sudahkah setiap sumber dan dimensi disetujui pada Lembar A? Approval produk tidak dapat menggantikan review budaya."
  ]
}
```

## Posisi yang belum mempunyai rule layak

| Posisi | Fungsi draft yang harus dibahas | Dasar yang belum tersedia | Status keputusan |
| --- | --- | --- | --- |
| Koordinator | Menyelaraskan informasi dan aktivitas; batas terhadap Management belum tegas | Definisi coordinating, evidence dan hubungan communicating/collaborating belum disetujui; tidak membuat ID/versi rule baru | HOLD; review budaya/produk pending; reviewer/tanggal/versi keputusan null |
| Co-Leader | Mendampingi arah dan kontinuitas, bila fungsi ini dipilih produk | Delegasi, otoritas dan relasi Leader tidak dapat diturunkan otomatis dari kalender; belum ada rule/evidence memadai | HOLD; review budaya/produk pending; reviewer/tanggal/versi keputusan null |
| Anggota | Status dasar setiap orang | Bukan rekomendasi posisi atau rule fallback | Tidak diajukan sebagai fallback; insufficient_basis tetap dipertahankan |

Tidak ada pemilik produk atau ahli yang telah memberikan persetujuan dalam pelaksanaan audit ini. Setelah keputusan nyata, arsipkan versi terdahulu dan rencanakan perubahan kode melalui milestone terpisah; jangan menyalin JSON ini langsung ke evaluator produksi.

