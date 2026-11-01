# Prototipe terisolasi Ketua/Wakil — G6A.8

Keputusan: **READY FOR TECHNICAL REVIEW** untuk sandbox pengujian. Rekomendasi posisi nyata/produksi tetap **HOLD**. Tidak ada ruleset budaya atau kebijakan Wakil yang disahkan oleh hasil tes ini.

## Baseline dan perubahan

Worktree C:\Project-Trispark\jodoh_bali_samyoga; branch feat/samyoga-group; HEAD 6298a4ca22c20ae296ec667be792e3c91532fe47. Awal pekerjaan: tiga dokumen G6A.7-R1 untracked, staged dan diff tracked kosong. Ketiga dokumen itu **tidak diubah**. Checkpoint G6A.5/G6A.6 tersedia.

Empat file baru:

- [Registry fixture sintetis](../tests/fixtures/samyoga-chair-scenarios.mjs): membaca JSON dari matriks R1, membentuk graf/assessment sintetis, menambah 16 kasus, menerapkan transform identitas/urutan dan mendaftarkan capability fixture.
- [Evaluator sandbox](../tests/fixtures/samyoga-chair-prototype.mjs): dua gerbang, validasi comparator, dominasi universal dan hasil eksperimen; tidak mengimpor engine/registry produksi.
- [Unit test prototipe dan isolasi](../tests/samyoga-chair-prototype.test.mjs): oracle, kerusakan input, invariant, permutasi, approval palsu dan audit import.
- Laporan ini.

Pemeriksaan SHA-256 mengonfirmasi seluruh 86 file tracked dan tiga dokumen R1 yang sudah ada (89 file baseline) tetap identik. Engine kalender, Samyoga, master, Pal Sri Sedana, evaluator/gate produksi, UI, Firebase, konfigurasi dan dependency tidak berubah.

## Kontrak prototipe

API Node-only:

- getSyntheticChairScenario(fixtureId, transforms?) menghasilkan objek deep-frozen yang terdaftar dalam WeakSet proses tes.
- evaluateSyntheticChairScenario(scenario) hanya menerima capability tersebut. Object literal, active/approved=true, clone atau deserialize tidak menjadi sumber approval.
- Hanya ID fixture tetap dan transform memberOrder/rename/reversePairs/reverseComparisons yang diterima factory. Tidak menerima data kelahiran, comparator pengguna, atau parameter boolean approval.
- Versi eksperimen tetap g6a8-pareto-synthetic-v1; setiap hasil memuat marker synthetic-test-only dan syntheticTestOnly=true.
- Semua asumsi persetujuan hanya milik fixture. Capability ini batas sandbox tes, **bukan** mekanisme approval/autentikasi produksi.

Input fixture: 3–6 ID stabil, assessment Leader sintetis, kategori relasi seluruh pasangan, ringkasan count N−1, revisi input, preset kebijakan sintetis dan comparator eksplisit. Tidak ada tanggal/jam lahir atau penafsiran budaya yang dibuat untuk membangkitkan comparator.

Keluaran memuat fixtureId, policyVersion, status, eligibleMemberIds (lolos gerbang Leader), qualifiedMemberIds (lolos kedua gerbang), chairMemberId, reasonCodes/explanations, memberDecisions, comparisons, dominancePairs, universalDominatorIds dan alternativeCandidateIds. Basis yang belum tersedia menghasilkan not_evaluated, bukan penilaian gagal personal.

Gerbang Samyoga menguji proposal 2×Utama > N−1. Graf harus lengkap/unik dengan N−1 relasi per anggota; summary pecahan, NaN, negatif atau berbeda dari graf ditolak. Nista tetap konteks perhatian tanpa veto.

## Perbandingan dan ketidaklengkapan

Model tetap STRONGER / WEAKER / EQUIVALENT / INCOMPARABLE / UNKNOWN. Dominasi A atas B hanya:

- STRONGER dan Utama A ≥ B; atau
- EQUIVALENT sah dan Utama A > B.

UNKNOWN/INCOMPARABLE tidak membuat dominance edge. Q≥3 membutuhkan satu kandidat yang mendominasi semua kandidat lain. Tidak ada skor, tag-count, ID/nama/input-order tie-break atau pemilihan maksimum Utama sebagai fallback.

Kebijakan data pairwise:

1. Metode/approval belum tersedia → not_evaluated; Q yang eligibility-nya sudah selesai tetap boleh diketahui.
2. Record hilang/basis invalid → not_evaluated, COMPARATOR_BASIS_UNAVAILABLE; tidak diam-diam mengisi UNKNOWN/setara.
3. Record UNKNOWN eksplisit dalam metode sintetis yang sah → tidak ada dominasi pasangan itu. Bila tidak ada dominator universal → undetermined.
4. UNKNOWN di antara dua kandidat yang sudah sama-sama didominasi tidak menggagalkan bukti Ketua terhadap mereka.
5. Arah terbalik harus konsisten; record duplikat tetap ditolak walau konsisten karena kontrak memerlukan satu record per pasangan.
6. Siklus strict selalu ditolak secara konservatif sesuai R1. EQUIVALENT membentuk kelas kesetaraan; strict superiority di dalam kelas atau arah yang bertentangan terhadap kelas yang sama ditolak.
7. Default fixture R1 tidak mengklaim seluruh informasi parsialnya transitif: tidak mengisi relasi UNKNOWN dari dugaan transitivitas. Jika comparator secara eksplisit claimsTransitivity=true, A>B dan B>C wajib didukung A>C. INCOMPARABLE/UNKNOWN pada A–C ditolak sebagai klaim transitif yang tidak didukung; bukan diubah otomatis menjadi STRONGER/EQUIVALENT.

Temuan kasus sintetis: arah STRONGER dua arah, EQUIVALENT/INCOMPARABLE asimetris, duplikasi reversed-pair, kontradiksi kelas kesetaraan, strict-cycle dan transitivitas yang rusak semuanya menghasilkan not_evaluated dengan Ketua null. Ini hasil pengujian diagnostik, bukan temuan terhadap comparator budaya nyata yang belum tersedia.

## Wakil dan oracle R1

**Policy Wakil aktual tetap pending; deputyMemberId selalu null.**

Matriks R1 memiliki lima counterfactual chair_and_deputy_proposed dengan asumsi approval Wakil. G6A.8 mengikuti instruksi terbaru: kelima hasil itu menjadi chair_only, dengan kandidat lainnya pada alternativeCandidateIds. Tidak ada dokumen/oracle R1 yang ditimpa. Unit test secara eksplisit memeriksa adaptasi tersebut.

Alternatif adalah himpunan kandidat layak yang belum dialokasikan, **bukan ranking atau penetapan Wakil**. Q≥3 tidak mengambil runner-up. Prototype tidak pernah mengeluarkan status chair_and_deputy_proposed selama kebijakan aktual ini pending.

## Hasil pengujian nyata

| Pemeriksaan | Hasil |
| --- | --- |
| 71 kasus acuan R1 | Tercakup; adaptasi lima counterfactual Wakil diuji eksplisit |
| Skenario tambahan G6A.8 | 16; total 87 oracle sintetis |
| Unit prototipe | **99/99 lulus** (87 oracle + 12 tes lintas kasus) |
| Seluruh suite Samyoga | **185/185 lulus**, termasuk 86 regression existing |
| Permutasi 3–6 anggota | **870** pemeriksaan |
| Permutasi multi-kandidat dan reversal | **144** pemeriksaan; pembalikan lima state, rename ID dan detachment hasil juga lulus |
| TypeScript proyek | npx.cmd tsc --noEmit --incremental false — lulus; sandbox .mjs diuji Node/ESLint, bukan diklaim typechecked TS |
| ESLint tiga file baru | Lulus |
| Import/export/dynamic import/require literal | AST memeriksa app/components/lib/hooks/firebase dan source/config root; tidak ada jalur menuju sandbox tests |
| Integritas baseline | 89/89 file identik SHA-256; tracked diff dan staged kosong |
| Registry evidence/rule produksi | Tetap 0/0; prototipe tidak mengaksesnya, tes isolasi hanya membaca keadaan untuk assertion |
| Production build | Tidak dijalankan: tidak ada source runtime/config/package/build script berubah; modul sandbox hanya di tests dan terbukti tidak terimpor produksi |
| Instalasi/network/persistence baru | Tidak ada; loader hanya membaca dokumen fixture lokal, tanpa write |

Distribusi 87 skenario: 45 not_evaluated, 8 no_qualified_candidate, 22 chair_only, 3 conflicting_priority, 9 undetermined. Ini cakupan oracle, **bukan akurasi atau validitas budaya**. Jumlah chair_and_deputy_proposed adalah nol.

## Menjalankan ulang

Dari worktree Samyoga di PowerShell:

~~~powershell
node --test tests/samyoga-chair-prototype.test.mjs
npm.cmd run test:samyoga
npx.cmd eslint tests/fixtures/samyoga-chair-scenarios.mjs tests/fixtures/samyoga-chair-prototype.mjs tests/samyoga-chair-prototype.test.mjs
npx.cmd tsc --noEmit --incremental false
~~~

Contoh hasil sintetis melalui stdout saja, tanpa menyimpan file:

~~~powershell
node --input-type=module -e "import {getSyntheticChairScenario} from './tests/fixtures/samyoga-chair-scenarios.mjs'; import {evaluateSyntheticChairScenario} from './tests/fixtures/samyoga-chair-prototype.mjs'; console.log(JSON.stringify(evaluateSyntheticChairScenario(getSyntheticChairScenario('R1-EQUIVALENT-DIFF')),null,2));"
~~~

Contoh tersebut mempunyai A=3 Utama, B=2 Utama dan EQUIVALENT yang diasumsikan sah hanya pada fixture. Hasil: chair_only, Ketua a, Wakil null, alternatif b, DEPUTY_POLICY_UNAPPROVED. Ganti ID dengan R1-UNKNOWN-DIFF/R1-INCOMPARABLE-DIFF untuk melihat abstain, atau R1-STRONGER-LESS untuk konflik prioritas. Tidak ada kalkulasi tanggal manusia dalam contoh.

## Isolasi, Git dan persetujuan tersisa

Kode sandbox berada di tests/fixtures dan hanya dijangkau test. Tidak ada perubahan npm scripts atau root export. Evaluator tidak mengimpor UI, kalender, registry produksi, Firebase/analytics, network atau storage. Tes membaca registry produksi hanya untuk memastikan tetap kosong. Tidak ada penulisan otomatis hasil simulasi.

Git akhir: branch feat/samyoga-group, HEAD tetap 6298a4ca22c20ae296ec667be792e3c91532fe47. Staged/diff tracked kosong. Tujuh file untracked: tiga dokumen R1 lama yang dipertahankan, tiga file tes/prototipe baru, dan laporan G6A.8 ini. Tidak ada commit, push, merge, reset, clean atau switch branch.

Tetap pending: verifikasi evidence budaya, rule Leader/scope/multiple eligibility, metode kekuatan relatif, ambang mayoritas, detail policy dominasi/coverage, kebijakan Wakil, bahasa produk dan aktivasi produksi. Prinsip larangan count-fallback yang disetujui R1 tetap berlaku, tanpa menggantikan approval lain.

**READY FOR TECHNICAL REVIEW** hanya untuk prototipe pengujian. Tidak ada rekomendasi jabatan formal/kompetensi profesional, output kalender baru, ataupun dasar untuk mengaktifkan rekomendasi posisi nyata.

