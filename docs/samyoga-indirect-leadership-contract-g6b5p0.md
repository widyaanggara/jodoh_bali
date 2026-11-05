# Kontrak profil pendukung kepemimpinan — G6B.5-P0

Versi desain: `g6b5p0-indirect-contract-draft-1`. Tanggal audit: 2 November 2026, WITA. **DOCUMENTATION AND DESIGN ONLY.** Tidak ada modul, mapping, UI, gate, comparator atau sandbox yang diubah.

**Keputusan akhir: HOLD — INDIRECT PROFILE NOT SUPPORTED.** Kontrak dapat direview, tetapi communicating AND managing belum memiliki satu pun irisan pada 35 Lintang yang diaudit. Persetujuan prinsip eksperimen tidak menjadikan aturan operasional.

## 1. Keputusan produk dan bukti aktual

Pemilik produk memilih RANCANGAN A melalui instruksi G6B.5-P0:

> Indikator sifat tidak langsung boleh digunakan untuk merekomendasikan kandidat Ketua secara eksperimental, apabila pemetaan sifat memiliki dasar tekstual yang dapat ditelusuri dan hubungan Samyoga memenuhi persyaratan.

Ini persetujuan prinsip desain eksperimen, bukan validasi budaya, provenance, persetujuan setiap ID mapping, ambang mayoritas produksi, comparator atau aktivasi. Rekomendasi simbolis bukan penetapan jabatan/kompetensi.

Source of truth tetap [getBalineseDate/findLintang](../lib/balinese-calendar.ts), [master dataLintang](../lib/data.ts#L518), [adapter Otonan](../lib/otonan-calendar.ts) dan [profil Samyoga read-only](../lib/samyoga-palintangan.ts). Tidak ada rumus atau deskripsi Palintangan baru. Zodiak tidak menjadi input profil, eligibility, comparator, explanation atau tie-break.

Dari [72 assertion G6B.4](samyoga-palintangan-mapping-g6b4.md), 16 didukung tekstual, 21 perlu interpretasi, 23 ambigu, 12 tidak didukung. Angka ini **sudah mencakup tiga representasi tertaut existing**; ada 69 draft baru, bukan 72 ditambah 3. Lihat [matriks data dan simulasi](samyoga-indirect-leadership-matrix-g6b5p0.md).

- Mapping runtime existing: communicating 1, managing 0, irisan 0.
- Draft tekstual: communicating 8, managing 2, irisan 0.
- Sensitivitas termasuk interpretatif: communicating 8, managing 4, irisan 0.
- Directing tetap tanpa support yang diterima. Tidak dibuat dukungan pengarahan dari keberanian, ketegasan, pengaruh, derajat atau jumlah sifat.
- Mapping dan kriteria runtime G6B.3-R1 tetap sama sampai ada implementasi terpisah yang diotorisasi.

## 2. Nama dan dua jalur konsep

Nama yang direkomendasikan untuk pengguna: **Profil Pendukung Kepemimpinan — Hipotesis Tidak Langsung**. Nama teknis rancangan `INDIRECT` hanya membedakan jalur penalaran; bukan skala kekuatan atau pengakuan bahwa kemampuan memimpin telah terdeteksi.

| Jalur | Syarat konseptual | Batas |
| --- | --- | --- |
| DIRECT | Indikator pengarahan/kepemimpinan eksplisit dan rule yang dipilih/disetujui untuk scope eksperimen | Belum ada support directing pada audit. Konsep ini tidak membuat rule aktif atau mengganti Leader existing. |
| INDIRECT | communicating AND managing pada Lintang **yang sama**, keduanya didukung tekstual dan memiliki pemetaan semantik yang diterima untuk eksperimen | Hipotesis produk Metemu; bukan kategori kepemimpinan tradisional Wariga. Pada data sekarang irisan kosong. |

DIRECT dan INDIRECT tidak diasumsikan EQUIVALENT, tidak diurutkan STRONGER/WEAKER, dan tidak diberi bobot. Satu kandidat memenuhi dua jalur kelak tetap satu anggota pada himpunan kandidat, tanpa bonus atau prioritas.

Leader existing `directing AND communicating AND collaborating` dibekukan sebagai pembanding historis/runtime. Penambahan jalur indirect adalah **proposal kontrak baru**, bukan penulisan ulang hasil evaluator lama. Tidak ada perubahan hasil Otonan, Samyoga pasangan, atau alokasi sandbox.

## 3. Syarat support yang dapat dipakai

Untuk setiap dimensi wajib, rancangan harus menelusuri:

1. Identitas Lintang Sapta/Panca yang benar dari engine existing pada revisi input yang sama.
2. Referensi master `dataLintang.penjelasan`, kutipan tepat, ID mapping draft yang benar, dan keputusan semantik DIDUKUNG TEKSTUAL.
3. Alasan mengapa frasa mendukung dimensi dalam scope yang dibatasi. Pengaturan rumah tangga tidak otomatis menjadi pengelolaan organisasi; kefasihan bahasa tidak otomatis menjadi koordinasi atau kepemimpinan.
4. Keputusan produk yang nyata untuk memakai versi mapping dalam eksperimen. Persetujuan prinsip RANCANGAN A tidak merupakan approval seluruh 72 assertion.
5. Status sumber/review asli dan konteks caution yang tetap terlihat.

PERLU INTERPRETASI, AMBIGU, TIDAK DIDUKUNG, tidak ada informasi, atau absence of caution **tidak menggantikan support tekstual wajib**. Skenario interpretatif dalam matriks hanya sensitivitas data dan tetap tidak memenuhi kontrak tekstual jika salah satu dimensi hanya interpretatif.

Dua dimensi pada satu frasa boleh dicatat hanya jika dua maknanya benar-benar eksplisit dan pemetaan masing-masing dapat ditelusuri; dua pembacaan atas frasa ambigu tidak cukup. Baik satu maupun dua frasa berbeda dalam satu master Lintang tetap derivasi dari sumber kalender yang sama, bukan dua bukti independen tentang kompetensi. Tidak ada hitungan evidence sebagai skor.

## 4. Caution dan kontradiksi: proposal semantik, bukan penalti

| Kelas informasi | Perlakuan desain |
| --- | --- |
| Support tekstual | Menyediakan satu dimensi dalam scope yang dinyatakan; tidak menjadi ukuran kekuatan. |
| Caution terkait profil | Wajib kutipan, target dimensi/klaim, alasan relevansi, dan batas scope. Jika langsung membatasi inferensi yang dipakai untuk kandidat, status REVIEW_REQUIRED. |
| Ambiguitas | Simpan alternatif pembacaan; jangan diubah menjadi support positif atau caution negatif. |
| Tidak ada informasi | Tandai missing/unknown, bukan false atau sifat positif. Ketiadaan caution bukan jaminan. |
| Kontradiksi langsung | Pernyataan yang benar-benar berlawanan dengan klaim spesifik yang digunakan; REVIEW_REQUIRED dengan reason khusus. Bukan sekadar sifat yang terdengar negatif. |

Kebetulan berada pada dimensi yang sama **tidak cukup** membuktikan kontradiksi. Caution seperti sensitivitas, ketegasan atau menjaga batas relasi harus dibaca utuh. Relevansi yang belum jelas → REVIEW_REQUIRED bila support lengkap akan dipakai untuk rekomendasi tegas; tidak ditebak sebagai aman.

Caution yang jelas tidak terkait dengan inferensi profil tetap ditampilkan dan tidak menggugurkan support. Tidak ada pengurangan poin, veto Nista, atau penalti otomatis karena “mudah tersinggung”. Tidak ada kontradiksi langsung terhadap profil lengkap yang ditemukan pada data aktual: memang tidak ada profil lengkap yang dapat diuji.

Review dibatasi pada kandidat/interpretasi yang memerlukannya. Untuk laporan kelompok, jika review/basis seorang anggota belum dapat diselesaikan, himpunan kandidat keseluruhan belum dinyatakan final: hasil kelompok NOT_EVALUATED dapat menyertakan `provisionalCandidateIds` sebagai informasi, bukan rekomendasi tegas. Ini proposal fail-closed untuk review produk, **bukan** aktivasi blokir global baru di evaluator G6B.3.

Policy konflik global G6B.3 dan perilaku sandbox tetap tidak disentuh. Rancangan caution P0 tidak diterapkan diam-diam pada modul tersebut.

## 5. Dua gerbang dan graf relasi

Gerbang 1: profil Palintangan dari jalur eksperimen yang **benar-benar dipilih** memenuhi syarat, basis/versi konsisten, dan tidak ada review yang menahan rekomendasi.

Gerbang 2: jumlah relasi Utama anggota dari graf pasangan yang sah memenuhi:

```text
2 × jumlahUtama > jumlahAnggota − 1
```

| Anggota | Relasi tiap anggota | Minimum Utama |
| --- | --- | --- |
| 3 | 2 | 2 |
| 4 | 3 | 2 |
| 5 | 4 | 3 |
| 6 | 5 | 3 |

Mayoritas ini tetap kebijakan eksperimen Metemu, bukan rumus tradisional kepemimpinan atau approval produksi. Count berasal dari incidence edge aktual, bukan angka input bebas, kategori dominan, atau skor.

Sebelum memberi kandidat:
- Validasi 3–6 ID unik, anggota sama pada semua assessment, revisi data/versi sama.
- Tepat N(N−1)/2 pasangan unik, setiap anggota N−1 relasi; tidak ada self-pair, anggota asing, duplicate/reversed duplicate, key salah atau pasangan hilang.
- Gunakan [createCanonicalSamyogaPairKey](../lib/samyoga-group.ts) existing; urutan serialisasi ID tidak menjadi prioritas.
- Kategori Utama/Madia/Nista dan summary harus sesuai edge incident. Summary tidak menggantikan graf; tidak melengkapi pasangan hilang secara diam-diam.
- Jalur nyata kelak membaca output engine G2 yang sah. Fixture graf di matriks hanya kontrol desain sintetis, tidak menggantikan hasil kalender.
- Nista tetap perhatian simbolis, bukan diskualifikasi.

Q adalah himpunan anggota yang lolos **keduanya**. Satu support atau lebih banyak Utama tidak menyelamatkan gerbang Palintangan yang belum lengkap. Banyaknya anggota Utama tidak memilih pemenang.

## 6. Kontrak status dan bahasa UI yang diusulkan

Ini spesifikasi dokumentasi, bukan tipe runtime yang sudah ditambahkan.

| Status | Syarat | Reason code minimum | Bukti yang ditampilkan | Boleh sebagai rekomendasi? | Teks UI yang sesuai |
| --- | --- | --- | --- | --- | --- |
| INDIRECT_SUPPORTED | Dua support tekstual C/M, semantik/versi eksperimen diterima; tidak ada blocker konteks | INDIRECT_COMM_MAN_TEXTUAL; EXPERIMENTAL_ONLY | Lintang, dua kutipan/ID, scope, dependency dan missing/pending | Profil simbolis saja; kandidat perlu gerbang Samyoga | “Indikator komunikasi dan pengelolaan mendukung profil pendukung kepemimpinan secara eksperimental.” |
| SUPPORTING_PARTIAL | Tepat satu dimensi wajib didukung tekstual | INDIRECT_DIMENSION_MISSING; bila relevan INTERPRETIVE_MAPPING_NOT_ACCEPTED | Support yang ada dan dimensi yang belum punya dasar | Tidak sebagai kandidat | “Sebagian indikator tersedia; belum cukup dasar untuk kandidat Ketua.” |
| AMBIGUOUS_EVIDENCE | Tidak ada support wajib yang diterima dan ada mapping ambigu pada dimensi yang diperlukan | REQUIRED_MAPPING_AMBIGUOUS | Frasa, pembacaan alternatif, ID draft | Tidak | “Makna indikator belum cukup jelas untuk digunakan sebagai rekomendasi.” |
| REVIEW_REQUIRED | Caution langsung membatasi inferensi, kontradiksi langsung, atau relevansi caution belum terselesaikan sebelum rekomendasi tegas | RELEVANT_CAUTION_REVIEW_REQUIRED / DIRECT_CONTRADICTION_REVIEW_REQUIRED / CAUTION_RELEVANCE_UNRESOLVED | Support yang tetap ada, kutipan konteks, klaim yang dibatasi, alasan review | Tidak tegas sebelum review | “Konteks Palintangan perlu ditinjau sebelum rekomendasi dapat diberikan.” |
| INSUFFICIENT_EVIDENCE | Scope telah diaudit tetapi tidak ada support wajib yang diterima dan tidak ada hipotesis ambigu yang relevan | NO_USABLE_SUPPORT; bila relevan INTERPRETIVE_MAPPING_NOT_ACCEPTED | Identitas/sumber dan gap; bukan label negatif | Tidak | “Belum cukup dasar Palintangan untuk merekomendasikan profil ini.” |
| CANDIDATE_SINGLE | Evaluasi kelompok lengkap, tepat satu anggota lolos dua gerbang | DUAL_GATE_MET; SINGLE_SYMBOLIC_CANDIDATE | Dua support, count dari graf, threshold, caution, status sumber | Ya sebagai satu kandidat simbolis, bukan Ketua terpilih | “Satu kandidat Ketua simbolis memenuhi dua gerbang percobaan.” |
| CANDIDATES_MULTIPLE | Evaluasi lengkap, Q berisi sedikitnya dua anggota | DUAL_GATE_MET; MULTIPLE_SYMBOLIC_CANDIDATES; NO_FORCED_WINNER | Alasan dan relasi tiap kandidat tanpa urutan kekuatan | Semua sebagai kandidat; tidak memilih satu | “Beberapa kandidat memenuhi dua gerbang; tidak ditetapkan satu Ketua.” |
| NO_CANDIDATE | Struktur/basis evaluasi lengkap dan Q kosong | NO_DUAL_GATE_CANDIDATE | Hasil kedua gerbang dan batas bukti | Tidak | “Belum ada kandidat yang memenuhi kedua gerbang dalam percobaan ini.” |
| NOT_EVALUATED | Policy/mapping belum dipilih, basis/versi belum tersedia atau invalid, graf rusak/stale, atau himpunan kandidat masih tertahan review | MAPPING_POLICY_UNDECIDED / INVALID_PAIR_GRAPH / RELATION_SUMMARY_MISMATCH / STALE_INPUT / SOURCE_IDENTITY_MISMATCH / CANDIDATE_SET_INCOMPLETE | Alasan readiness; jangan mengisi count atau kandidat final karangan | Tidak; Q sementara hanya informasi yang diberi label | “Rekomendasi belum dapat dievaluasi dengan dasar yang tersedia.” |

Prioritas presentasi individu: basis tidak valid → NOT_EVALUATED; review yang menahan rekomendasi → REVIEW_REQUIRED; dua support sah → INDIRECT_SUPPORTED; satu support → SUPPORTING_PARTIAL; tanpa support tetapi ada AMBIGU relevan → AMBIGUOUS_EVIDENCE; selain itu INSUFFICIENT_EVIDENCE. Ambiguitas pada dimensi yang belum lengkap tetap disimpan sebagai flag sekunder pada profil parsial.

Interpretasi yang belum diterima tidak diam-diam disebut teks kuat atau digabung sebagai profil lengkap. Status profil dan status kandidat kelompok terpisah; jangan menyebut SUPPORTING_PARTIAL sebagai INDIRECT_SUPPORTED.

Semua tampilan hipotetis harus menyatakan: **“Rekomendasi simbolis berdasarkan interpretasi eksperimental Metemu atas Palintangan dan relasi Samyoga. Bukan pengukuran kompetensi atau penetapan jabatan.”** Tidak ada UI yang diubah pada P0.

## 7. Eligibility berbeda dari kekuatan dan alokasi

[G6A.7-R1](samyoga-chair-contract-g6a7.md) dan [sandbox G6A.8-R1](samyoga-chair-review-g6a8r1.md) membedakan eligibility, comparator dan dominasi. P0 hanya mendesain basis eligibility tambahan serta presentasi himpunan kandidat.

- communicating + managing **bukan comparator**. Memenuhi profil tidak membuktikan STRONGER, WEAKER, atau EQUIVALENT.
- Comparator yang belum tersedia tetap UNKNOWN; INCOMPARABLE tidak menjadi EQUIVALENT. Identitas/nama/input-order, jumlah evidence/tag/kata positif atau Utama saja bukan tie-break.
- Q≥2 boleh menjadi daftar kandidat eligibility simbolis, sementara alokasi G6A.7 tetap not_evaluated ketika comparator belum tersedia. Jangan menyamakan “daftar kandidat ada” dengan “Ketua dipilih”.
- Untuk Q=1 tidak perlu pembandingan antarkandidat; status P0 tetap CANDIDATE_SINGLE. Istilah historis chair_only di G6A.7 adalah usulan kandidat tunggal dalam scope kontraknya, bukan pemilihan formal; sandbox tidak diubah oleh proyeksi presentasi P0.
- P0 tidak meminta alokasi Ketua. Field rancangan `selectedChairMemberId` tetap null, `deputyMemberId` selalu null; `candidateMemberIds` merupakan himpunan tanpa ranking.
- Tidak ada hierarki DIRECT versus INDIRECT, tidak ada ukuran kekuatan relatif dari status profil, dan tidak ada Wakil otomatis.

## 8. Readiness dan isolasi approval

RANCANGAN A mengizinkan **jenis hipotesis**, bukan mengesahkan suatu mapping. Saat ini masih belum dipilih versi mapping/semantik C+M yang dapat menghasilkan profil lengkap. Karena itu hasil formal jalur P0 sekarang NOT_EVALUATED atau HOLD; simulasi di matriks hanya mengukur apakah isi data dapat memenuhi formula konseptual.

Eksperimen internal kelak dapat tetap menampilkan provenance missing/review pending secara jujur sesuai ruang lingkup yang diotorisasi. Tidak ada kewajiban reviewer eksternal baru untuk menyelesaikan desain/fitur internal. Namun status missing/pending **tidak** diubah menjadi verified/approved dan tidak melewati gate produksi.

Gate produksi [resolver evidence](../lib/samyoga-position-evidence.ts) masih memerlukan identitas/kutipan tepat, provenance verified, sourceId sah, review approved dan capability resolver; [evaluator rule](../lib/samyoga-position-recommendation.ts) masih memerlukan rule domain/product approved. Registry/rule produksi kosong dan frozen. Object literal, JSON, flag pengguna, query atau localStorage bukan approval.

[Gate server internal](../lib/samyoga-internal-beta.server.ts) tetap development AND environment flag server `SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT=1`; default OFF, produksi publik OFF. Dokumen ini tidak mengubah readiness gate, menambah endpoint, storage, network, dependency atau aturan runtime baru.

Daftar keputusan yang masih pending dan alternatif jika irisan kosong ada pada [decision log P0](samyoga-indirect-leadership-decisions-g6b5p0.md).
