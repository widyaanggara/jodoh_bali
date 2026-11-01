# Decision log dominasi Ketua/Wakil — G6A.7-R1

Versi: `g6a7r1-chair-decision-draft-0.2`. **READY FOR PRODUCT REVIEW untuk dokumen; implementasi/aktivasi tetap HOLD.** Referensi: [kontrak R1](samyoga-chair-contract-g6a7.md), [71 kasus sintetis](samyoga-chair-test-matrix-g6a7.md), [provenance G6A.6](samyoga-position-provenance-g6a6.md), [Lembar A budaya](samyoga-position-cultural-decisions-g6a6.md), [Lembar B rule individu](samyoga-position-product-decisions-g6a6.md).

## Keputusan produk yang benar-benar diberikan

**APPROVED DESIGN PRINCIPLE:** “Jumlah Utama tidak dapat mengalahkan ketidaktersediaan pembanding kekuatan Otonan.”

Sumber keputusan: instruksi eksplisit pemilik produk pada G6A.7-R1. Persetujuan hanya pada prinsip larangan fallback count tersebut. Ini **bukan** persetujuan budaya, metode pembanding, ruleset Leader, ambang mayoritas, policy Wakil atau aktivasi. Tidak ada identitas/tanggal reviewer ahli atau sumber verified yang direka. Tidak membuat tanggal keputusan formal yang tidak diberikan.

Opsi A G6A.7 tetap dipilih: eligibility Otonan AND eligibility relasi Samyoga. R1 memperketat tahap **dominasi di antara kandidat yang sudah layak**, tanpa mengubah hasil individu.

## Register keputusan dan proposal

ID G6A7-D01..D14 dipertahankan agar jejak proposal awal dapat ditelusuri; D15 mencatat prinsip baru. Versi 0.1 count-fallback digantikan kontrak R1, bukan tetap tersedia sebagai opsi runtime.

| ID | Pokok | Status aktual R1 | Isi dan batas |
| --- | --- | --- | --- |
| G6A7-D01 | Opsi A dua gerbang | selected_by_owner | Ketua memerlukan Leader Otonan yang disetujui AND dukungan relasi Samyoga yang disetujui; tidak ada indikator pengganti. |
| G6A7-D02 | Evidence/scope/rule Leader | pending_cultural_and_product_review | Sumber, dimensi, coverage dan rule Leader tetap belum disetujui. Prinsip R1 tidak mengesahkannya. |
| G6A7-D03 | strict_majority_utama | pending_product_approval | 2×Utama > N−1; minimum 2/2/3/3 masih hipotesis kebijakan produk. |
| G6A7-D04 | multiple_candidates termasuk Leader | pending_product_approval | Proposal lolos bila matched rule/evidence Leader sah dan tanpa konflik global; tidak mengubah interpretasi individu menjadi tunggal. |
| G6A7-D05 | Coverage dan basis tidak lengkap | pending_product_approval | Eligibility belum lengkap → not_evaluated, Q belum diketahui. Eligibility selesai tetapi comparator tidak siap → not_evaluated dengan Q yang sudah diketahui, tanpa alokasi. |
| G6A7-D06 | Pembeda count versi 0.1 | **superseded_by_G6A7-D15** | Hapus jalur eligibility_only/count Utama sebagai pengganti comparator. UNKNOWN/INCOMPARABLE tidak dapat dibaca sebagai EQUIVALENT. |
| G6A7-D07 | Kekuatan relatif Otonan | **HOLD — pending cultural/product approval** | Lima keadaan STRONGER, WEAKER, EQUIVALENT, INCOMPARABLE, UNKNOWN; belum ada metode budaya approved. Legacy no_proven_difference tidak menjadi EQUIVALENT. |
| G6A7-D08 | Dominasi dua indikator | revised_design_for_product_review | A tidak lebih lemah pada keduanya dan unggul pada satu. STRONGER+Utama sama mendominasi; STRONGER+Utama lebih sedikit konflik. Detail policy pareto_dominates_all_v1 belum diaktifkan/disetujui sebagai ruleset produksi. |
| G6A7-D09 | Wakil tepat dua Q | pending_separate_product_approval | Ketua harus dominator sah; Wakil hanya setelah approval policy terpisah. Pending/rejected/missing → Ketua saja, tanpa memaksa Wakil. |
| G6A7-D10 | Tiga atau lebih Q | specified_for_R1_design; aktivasi pending | Ketua hanya jika tepat satu kandidat mendominasi semua yang lain. Tidak ada auto-runner-up atau Wakil tanpa kontrak tambahan. |
| G6A7-D11 | Enam status keluaran | specified_for_design; aktivasi pending | not_evaluated, no_qualified_candidate, chair_only, chair_and_deputy_proposed, undetermined, conflicting_priority. No role dari UNKNOWN/INCOMPARABLE yang belum membuktikan dominasi. |
| G6A7-D12 | Nista | specified_constraint_by_owner | Perhatian simbolis, bukan diskualifikasi, skor penalti atau tie-break. |
| G6A7-D13 | Batas individu/arsitektur | specified_constraint_by_owner | Modul alokasi terpisah; hasil individu, kalender, master, Samyoga, Pal Sri Sedana dan approval gate existing tetap. |
| G6A7-D14 | Klaim produk/privasi | pending_product_review; batas teknis wajib | Usulan simbolis, bukan asesmen kompetensi/jabatan formal. Tidak menambahkan UI, network, persistence atau dependency. |
| G6A7-D15 | Larangan fallback count saat pembanding tidak tersedia | **APPROVED DESIGN PRINCIPLE** | “Jumlah Utama tidak dapat mengalahkan ketidaktersediaan pembanding kekuatan Otonan.” Persetujuan eksplisit pengguna G6A.7-R1; tidak diperluas menjadi approval domain/aktivasi. |
| G6A7-D16 | Aktivasi produksi | **pending — HOLD** | Tidak ada izin aktivasi. Registry/rule produksi tetap kosong. |

## Perubahan keputusan dibanding G6A.7 v0.1

1. eligibility_only tidak lagi dapat memilih Ketua dari perbedaan Utama. Q≥2 tanpa comparator approved menghasilkan not_evaluated, bukan count-fallback.
2. Model empat hasil diganti lima keadaan. no_proven_difference lama diperlakukan UNKNOWN; EQUIVALENT harus memiliki bukti positif dari metode yang disetujui.
3. Pemeriksaan veto terhadap maksimum Utama diganti **dominasi terhadap semua kandidat**. Kandidat dengan Utama sama dapat mendominasi jika Otonan STRONGER sah.
4. Jika tidak ada dominator universal, arah dua indikator yang berlawanan → conflicting_priority. Jika tidak ada konflik tetapi masih UNKNOWN/INCOMPARABLE/seri → undetermined.
5. Policy Wakil tidak lagi menjadi blocker global untuk Ketua yang sah. Pending/rejected/missing memberi chair_only; Q≥3 tidak mengalokasikan Wakil.
6. Q dibedakan dari alokasi: bila gerbangnya sudah selesai, missing comparator tidak menghapus fakta eligibility; seluruh peran tetap null.
7. Seluruh 55 ID/graf/override Otonan sintetis lama dipertahankan. Expected 14 kasus berubah sesuai R1; 16 kasus baru menambah pembuktian dominasi (total 71). priorExpected disimpan sebagai catatan historis, bukan oracle aktif.

## Rekonsiliasi dengan G6A.4–G6A.6

P-11: Samyoga tetap tidak mengubah eligibility/tafsir individu Otonan; ia dipakai hanya pada lapisan peran kelompok Opsi A. P-06 Co-Leader dan Koordinator tetap HOLD sebagai rule kalender. Wakil yang dibahas adalah fungsi organisasi dengan policy terpisah, bukan identifikasi Co-Leader dari tanggal lahir.

Konflik global evaluator individu tetap berlaku. conflicting_priority adalah konflik antarkandidat yang telah lolos dua gerbang, bukan pengubahan evaluator menjadi per-rule. Evidence approved, sumber verified dan hasil perhitungan tidak ditambahkan oleh dokumen ini. HOLD provenance G6A.6 tetap berlaku.

## Persetujuan yang tetap pending

- Verifikasi evidence budaya dan pemetaan dimensi/polarity.
- Ruleset Leader Otonan, cakupan sumber dan review budaya/approval produknya.
- Metode kekuatan relatif Otonan, termasuk arti/bukti EQUIVALENT yang sah.
- Ambang mayoritas Utama 2×Utama > N−1.
- Detail policy dominasi, mapping multiple_candidates, coverage/readiness dan bahasa hasil.
- Kebijakan penetapan Wakil Ketua untuk tepat dua kandidat; kontrak tambahan untuk Q≥3.
- Aktivasi rekomendasi produksi.

Tidak ada pending di atas yang otomatis menjadi approved karena prinsip D15 sudah disepakati. Semua identitas reviewer ahli, tanggal review, halaman sumber terkonfirmasi dan reference approval budaya tetap seperti dokumen G6A.6 (pending/null).

## Pertanyaan review berikut

1. Bagaimana ahli mendefinisikan pembanding kepemimpinan Otonan tanpa menghitung tag, evidence, kata positif atau skor arbitrer?
2. Bukti apa yang benar-benar mengesahkan EQUIVALENT, berbeda dari UNKNOWN dan INCOMPARABLE?
3. Apakah scope, ambiguity dan conflict evidence dapat ditetapkan sebelum eligibility dinyatakan selesai?
4. Apakah mayoritas ketat 2/2/3/3 dapat disetujui sebagai policy produk, dengan batas tradisi yang eksplisit?
5. Apakah detail dominasi universal dan prioritas reason ketika tidak ada pemenang sudah sesuai kebutuhan produk?
6. Apa fungsi/batas Wakil, siapa pemberi approval policy terpisah, dan apakah Q≥3 perlu tetap ditunda?
7. Bagaimana teks UI kelak menjelaskan Q yang layak tetapi belum dapat dialokasikan tanpa memberi stigma atau klaim kompetensi?

## Validasi teknis dan Git

Pekerjaan hanya merevisi tiga dokumen existing G6A.7: kontrak, matriks, decision log. Awal R1: branch feat/samyoga-group, HEAD 6298a4ca22c20ae296ec667be792e3c91532fe47; tiga dokumen itu untracked, staged/diff tracked kosong. Checkpoint G6A.5/G6A.6 tersedia. Semua 86 file tracked baseline dipertahankan; tidak ada file riset/runtime lain yang diubah.

Hasil aktual pemeriksaan ad hoc: **71/71 kasus desain konsisten**, seluruh **55 ID/graf/override Otonan lama identik**, **144/144 permutasi** identik, **2/2 pembalikan orientasi comparator** dan **2/2 rename ID** menjaga keputusan, serta **17 tautan lokal valid**. Distribusi expected: 31 not_evaluated, 8 no_qualified_candidate, 16 chair_only, 5 chair_and_deputy_proposed, 8 undetermined, 3 conflicting_priority. Tidak ada count-fallback ketika comparator tidak tersedia.

Regression existing `npm.cmd run test:samyoga`: **86/86 lulus**. Seluruh **86 file tracked** cocok SHA-256 dengan awal R1; registry evidence/rule produksi tetap **0/0**. Status Git awal/akhir identik: hanya tiga dokumen desain untracked, staged/diff tracked kosong. Ini pengujian konsistensi desain, bukan unit test allocator produksi. TypeScript/lint/build tidak dijalankan ulang untuk perubahan Markdown.

**READY FOR PRODUCT REVIEW untuk kontrak R1. HOLD untuk implementasi/aktivasi.** Produksi tetap nonaktif. Tidak ada commit, push, merge, reset, clean, switch branch, UI, dependency, network atau storage baru.

