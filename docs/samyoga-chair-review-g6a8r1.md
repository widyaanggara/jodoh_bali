# Independent technical review prototipe Ketua/Wakil — G6A.8-R1

Keputusan akhir: **READY FOR CHECKPOINT** untuk prototipe synthetic-test-only, setelah dua temuan diperbaiki. Bukan persetujuan produksi, budaya, metode pembanding atau policy Wakil. Tidak ada commit dibuat.

## Baseline dan metode review

Worktree C:\Project-Trispark\jodoh_bali_samyoga; branch feat/samyoga-group; HEAD 6298a4ca22c20ae296ec667be792e3c91532fe47. Staged/diff tracked awal kosong; tujuh file milestone sebelumnya masih untracked.

Dibaca: tiga dokumen G6A.7-R1, [laporan G6A.8](samyoga-chair-prototype-g6a8.md), dua modul sandbox dan tes prototipe. Sebelum perubahan, 93 file (86 tracked + 7 untracked) dicatat SHA-256. Review menambah counterexample lewat registry fixture tetap yang sama, bukan membypass WeakSet atau menerima payload pengguna.

Tes baru dijalankan **sebelum perbaikan**: dari enam tes review awal, empat gagal dan dua lulus. Dua akar masalah: pemenang dari kelas equivalence yang tidak koheren dan exception data fixture malformed. Sesudah perbaikan, seluruh tes lulus. Reproduksi terpisah memakai salinan kode awal di memori dengan import registry lokal yang sama; tidak menulis ulang/mereset file sandbox.

## Temuan berbasis risiko

| Prioritas | Temuan | Lokasi kini | Dampak dan status |
| --- | --- | --- | --- |
| P1 pada ketepatan eksperimen | UNKNOWN dilewati dalam pemeriksaan hubungan kelas EQUIVALENT | [analyzeComparator](../tests/fixtures/samyoga-chair-prototype.mjs#L58), khususnya pemeriksaan quotient [baris 93](../tests/fixtures/samyoga-chair-prototype.mjs#L93) | Bisa menghasilkan Ketua dari data comparator yang tidak koheren. **Diperbaiki**, regression eksplisit. Tidak ada jalur produksi yang terdampak. |
| P2 pada ketahanan sandbox | Elemen null/non-array bisa melempar TypeError sebelum error terstruktur | [graphError](../tests/fixtures/samyoga-chair-prototype.mjs#L16), [readinessError](../tests/fixtures/samyoga-chair-prototype.mjs#L46), [analyzeComparator](../tests/fixtures/samyoga-chair-prototype.mjs#L58), [guard comparator](../tests/fixtures/samyoga-chair-prototype.mjs#L205) | Proses batch tes dapat berhenti, berlawanan dengan kontrak fail-closed. **Diperbaiki** dengan guard bentuk data; tidak mengubah eligibility/policy. |
| Tidak ditemukan bug pada matematik graf valid | Count per anggota sudah dibandingkan dengan edge incident aktual | [tes incidence independen](../tests/samyoga-chair-review.test.mjs#L50) | Edge count, N−1 maupun global totals saja tidak dipercaya. Counterexample tambahan ditolak. |
| Perbedaan eksplisit scope, bukan bug | Lima counterfactual Wakil R1 menjadi chair_only di G6A.8 | [tes adaptasi Wakil](../tests/samyoga-chair-prototype.test.mjs#L45) | Terang-terangan mengikuti batas terbaru G6A.8; sejarah dokumen tidak diubah, deputy selalu null. |

P1/P2 di atas adalah prioritas review terhadap sandbox, bukan laporan bahwa pengguna produksi menerima rekomendasi salah.

## Bukti reproduksi dan perbaikan

### F1 — Equivalence tidak koheren terhadap kandidat ketiga

Fixture tetap G8R1-EQUIVALENCE-UNKNOWN, [definisi](../tests/fixtures/samyoga-chair-scenarios.mjs#L96), memakai graf N=5 yang valid:

- A=4, B=3, C=3 Utama; A/B/C lolos kedua gerbang.
- A EQUIVALENT B.
- A STRONGER C.
- B UNKNOWN C.

Kode awal melewati state UNKNOWN saat membangun quotient antar kelas, sehingga tidak memeriksa perbedaan cakupan tersebut. Hasil aktual awal: **chair_only, Ketua a**. A memakai perbedaan Utama atas B dan keunggulan atas C walaupun equivalence A/B tidak mempunyai hubungan konsisten terhadap C.

Perbaikan minimal: UNKNOWN tetap dipertahankan sebagai state saat membandingkan hubungan kelas. Known/UNKNOWN yang berbeda pada kelas setara menghasilkan **not_evaluated, Ketua null**, reason COMPARATOR_INCONSISTENT + EQUIVALENCE_ORDER_CONTRADICTION. Tidak mengisi B>C, tidak menganggap UNKNOWN setara/lemah, dan tidak membuat rule budaya baru.

Kontrol positif: A~B, A>C dan B>C tetap dapat memberi Ketua A; jika A–C dan B–C sama-sama UNKNOWN, data tetap konsisten sebagai ketidakpastian dan menghasilkan undetermined. UNKNOWN di antara kandidat berbeda kelas yang telah didominasi tetap tidak otomatis membatalkan Ketua. Semua expected 87 skenario G6A.8 lama tetap lulus.

[Regression counterexample](../tests/samyoga-chair-review.test.mjs#L11) dan [permutasi/orientasinya](../tests/samyoga-chair-review.test.mjs#L75) memastikan hasil tidak bergantung input order.

### F2 — Fixture malformed harus gagal terstruktur

Salinan evaluator awal menghasilkan TypeError untuk tujuh fixture terdaftar:

| Bentuk rusak | Pembacaan awal yang melempar | Hasil sesudah perbaikan |
| --- | --- | --- |
| Member null | member.id | not_evaluated / INVALID_GROUP_SHAPE |
| Summary null | summary.memberId | not_evaluated / INVALID_GROUP_SHAPE |
| Pair null | pair.pairKey | not_evaluated / INVALID_PAIR_GRAPH |
| Comparator null | comparator.mode | not_evaluated / COMPARATOR_BASIS_UNAVAILABLE |
| rows berupa object non-array | for-of rows | not_evaluated / COMPARATOR_BASIS_UNAVAILABLE |
| Row comparator null | destructure memberAId | not_evaluated / COMPARATOR_BASIS_UNAVAILABLE |
| leaderRuleRefs null | refs.length | not_evaluated / OTONAN_APPROVAL_INCOMPLETE |

Guard objek/array dan referensi string nonkosong ditambahkan hanya di sandbox. [Regression malformed](../tests/samyoga-chair-review.test.mjs#L22) membuktikan tidak ada exception, Ketua maupun Wakil. Ini robustness fixture internal; raw object pengguna tetap ditolak lebih dahulu oleh capability.

## Audit graf Samyoga

Untuk N=3/4/5/6, seluruh pasangan valid harus berjumlah 3/6/10/15. Validator memeriksa canonical key, endpoint anggota, tidak ada self-pair/duplikasi dan ukuran tepat N(N−1)/2. Karena setiap edge berasal dari himpunan pasangan yang mungkin, unik, dan jumlahnya sama dengan ukuran himpunan, tidak ada pasangan hilang.

Satu kategori dimiliki satu undirected edge. A–B dan B–A tidak menjadi dua observasi; reverse duplicate dengan kategori berbeda ditolak. Summary bukan sumber bebas: jumlah setiap kategori harus sama dengan edge incident aktual setiap anggota, pairCount dan total kategori N−1. Maka jumlah count seluruh anggota per kategori harus dua kali jumlah edge kategori itu; tes independen memverifikasinya lagi.

Dari **100 fixture kini**, **79** memiliki struktur kelompok/graf/summary yang sah; **21** sengaja invalid pada schema kelompok, graf atau summary untuk tes penolakan. Distribusi 79 struktur sah: N=3 sebanyak 8, N=4 sebanyak 49, N=5 sebanyak 18, N=6 sebanyak 4. Tidak semua not_evaluated berarti graf salah: banyak graf valid berhenti karena readiness/comparator.

Counterexample baru:

- [Balanced wrong summary](../tests/samyoga-chair-review.test.mjs#L32): count per anggota N−1 dan global kategori tepat 2×edge, tetapi count A/B tertukar. Tetap ditolak karena incident edges tidak cocok.
- Derajat Utama A=2, B=2, C=0 pada triangle semua-Utama: summary tidak mungkin sesuai graf, ditolak.
- [Same-size asymmetric graph](../tests/samyoga-chair-review.test.mjs#L42): enam edge N=4, tetapi satu reverse duplicate berkategori berbeda menggantikan edge yang hilang. Jumlah edge benar tidak menyelamatkan duplikasi/ketidaklengkapan.

Tidak ada perubahan engine pasangan/kelompok Samyoga atau formula Mod5/Mod16.

## Comparator, dua gerbang dan Wakil

STRONGER/WEAKER dibalik konsisten; EQUIVALENT/INCOMPARABLE/UNKNOWN simetris. Strict-cycle, kelas setara yang berlawanan, duplikasi record dan klaim transitivitas yang tidak didukung ditolak sebelum dominasi. Metode yang mengklaim transitif memerlukan A>C saat A>B dan B>C; data parsial tanpa klaim itu tidak dilengkapi secara otomatis.

Record pairwise hilang/invalid → not_evaluated. Record UNKNOWN eksplisit → tidak memberi dominance edge; tidak menjadi EQUIVALENT. Perbaikan F1 memperluas pemeriksaan koherensi kelas, bukan membuat inferensi pengganti proof.

Leader wajib lolos dan mayoritas Utama wajib lolos dalam konteks approval fixture. Mayoritas minimum 2/2/3/3 tetap proposal produk. Lebih banyak Utama tidak melewati UNKNOWN/INCOMPARABLE; arah prioritas berlawanan menghasilkan konflik jika tidak ada dominator universal. Untuk Q≥3 Ketua harus mendominasi semua kandidat lain; satu Q tidak membutuhkan comparator antarkandidat, sesuai kontrak.

Ketiga dokumen R1 dan laporan G6A.8 asli **dipertahankan identik**. Lima kasus chair_and_deputy_proposed di matriks R1 merupakan counterfactual dengan policy Wakil diasumsikan approved. Sandbox sengaja tidak menerapkannya: deputyMemberId selalu null, policy pending, alternatif tidak dilabeli Wakil atau dipilih sebagai runner-up. Tes asli atas lima kasus itu tetap lulus; tidak ada persetujuan Wakil tersembunyi.

## Bukti isolasi produksi aktual

[Regression resolver graph](../tests/samyoga-chair-review.test.mjs#L82) memulai dari seluruh source App Router dan config Next/Tailwind/PostCSS, lalu menyelesaikan import/export, dynamic import dan require literal, termasuk alias @/, ekstensi/index dan realpath. Hasil:

- **14 entrypoint**, **41 file lokal reachable**, **99 edge lokal**.
- **0 import lokal unresolved**, **0 computed dynamic import/require**, **0 target sandbox**.
- Jalur actual antara lain app/layout.tsx → components/SessionProvider.tsx → lib/session.ts → firebase/firebase.js, tanpa edge menuju fixture/prototipe.
- Tes isolasi asli juga memindai semua source app/components/lib/hooks/firebase dan root config, termasuk modul lib yang tidak reachable dari route.
- Scripts dev/build/start tetap aplikasi Next existing dan tidak memanggil sandbox.
- Capability WeakSet hanya diterbitkan factory ID fixture tetap; raw/clone/deserialized/approved=true tetap ditolak. Tidak ada jalur pengguna yang menerbitkannya.
- Modul sandbox tidak mengimpor engine/registry/UI/Firebase. Tidak ada dependency, network, telemetry atau penulisan storage baru; loader hanya membaca dokumen fixture lokal.
- Registry evidence/rule produksi tetap 0/0, diperiksa tes; tidak dipakai sebagai input prototipe.

UI kelompok tetap menampilkan [Rekomendasi posisi belum diaktifkan](../components/samyoga-group/SamyogaGroupResults.tsx#L233). Halaman pasangan lama memiliki label input [Mitra Kolaborasi B (Wakil Pemimpin)](../app/pawongan-sinergi/page.tsx#L117); itu label existing, bukan rekomendasi Wakil hasil prototipe. Tidak diubah pada review ini.

## File terdampak dan validasi

Dua file existing dimodifikasi secara minimal:

1. tests/fixtures/samyoga-chair-prototype.mjs — guard schema dan konsistensi equivalence.
2. tests/fixtures/samyoga-chair-scenarios.mjs — append 13 fixture tetap: counterexample, kontrol positif/UNKNOWN, schema malformed dan graf tidak konsisten. Semua 87 ID/expected sebelumnya dipertahankan.

Dua file baru:

3. tests/samyoga-chair-review.test.mjs — tujuh tes review termasuk resolver import aktual.
4. Dokumen laporan ini.

| Pemeriksaan nyata | Hasil |
| --- | --- |
| Prototipe beserta oracle lama/baru | 112/112 tes lulus, meliputi 100 fixture + 12 invariant |
| Review adversarial | 7/7 lulus |
| Prototipe + review | **119/119 lulus** |
| Seluruh regression Samyoga | **205/205 lulus**, termasuk 86 tes existing |
| Permutasi prototipe existing | 870 untuk N=3–6 dan 144 multi-kandidat tetap lulus |
| TypeScript proyek | npx.cmd tsc --noEmit --incremental false — lulus |
| ESLint empat file sandbox/tes terkait | Lulus |
| Import graph actual dan audit source | Lulus; 0 jalur produksi ke sandbox |
| git diff --check | Lulus |
| Build produksi | Dilewati: tidak ada file runtime/config/dependency/build-script berubah; actual graph membuktikan sandbox tidak reachable |

Sandbox .mjs diuji Node/ESLint; TypeScript proyek tidak diklaim memberi type-check pada semua .mjs. Hasil tes adalah konsistensi eksperimen sintetis, bukan validasi budaya, akurasi atau kompetensi.

Cara menjalankan:

~~~powershell
node --test tests/samyoga-chair-review.test.mjs tests/samyoga-chair-prototype.test.mjs
npm.cmd run test:samyoga
npx.cmd tsc --noEmit --incremental false
npx.cmd eslint tests/fixtures/samyoga-chair-prototype.mjs tests/fixtures/samyoga-chair-scenarios.mjs tests/samyoga-chair-prototype.test.mjs tests/samyoga-chair-review.test.mjs
~~~

## Git akhir dan keputusan

HEAD/branch tetap seperti baseline. **Seluruh 86 file tracked identik** dengan awal review; staged/diff tracked kosong. Dari tujuh file untracked awal, dua sandbox files berubah sesuai perbaikan, lima lainnya identik SHA-256 (termasuk tiga dokumen R1, laporan G6A.8 dan tes prototipe asli). Dua file baru review membuat total **sembilan file untracked**. Git status sendiri tidak menampilkan diff konten file untracked, sehingga pemeriksaan checksum baseline dipakai untuk membatasi perubahan.

Tidak ada commit, push, merge, reset, clean atau switch branch. Tidak ada checkpoint yang dibuat otomatis.

**READY FOR CHECKPOINT — prototipe synthetic-test-only.** Dua temuan telah ditutup dengan reproduksi dan regression. Verifikasi budaya, rule Leader, comparator aktual, mayoritas, policy Wakil dan aktivasi produksi tetap pending/HOLD; kesiapan checkpoint teknis tidak mengaktifkan rekomendasi nyata.

