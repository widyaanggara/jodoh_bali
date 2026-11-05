# Samyoga G6B.7 — Final Technical and Functional Review

> Catatan lanjutan: keputusan produk setelah review ini mengaktifkan UI rekomendasi secara default di repository lokal. Pernyataan produksi OFF di bawah adalah hasil historis G6B.7. Status terbaru, hasil uji tanpa flag, dan blocker keamanan publikasi ada pada [Public UI Enablement](samyoga-public-ui-enablement.md).

Tanggal review: 5 November 2026 (WITA). Worktree: `C:\Project-Trispark\jodoh_bali_samyoga`.

**READY FOR INTERNAL DEMO FREEZE.** Keputusan ini berlaku untuk demonstrasi internal simbolis/eksperimental, bukan rilis publik, validasi budaya, atau penetapan jabatan nyata.

## 1. Baseline Git dan riwayat

Branch awal/akhir `feat/samyoga-group`; HEAD tetap `3e568b768beb73c445e32db89a9672415e0e7949`. Baseline diperiksa langsung: **4 tracked modified, 35 untracked, 0 staged**. Seluruh perubahan awal dipertahankan.

Checkpoint historis yang tersedia:

| Commit | Isi |
| --- | --- |
| b84df20 | Engine kelompok kategorikal dan regression baseline |
| abba71b | UI analisis/summary kelompok |
| 13892ce | Fondasi rekomendasi posisi yang diaudit |
| b35ef2c | Approval gate dan simulasi aturan |
| c3eae7f | Kontrak dominasi Ketua dua gerbang |
| 05d9a92 | Prototipe alokasi sintetis terisolasi |
| 16335da | Presentasi dinamika relasi pasangan |
| 7d8b550 | Batas domain comparator Otonan |
| efc116f | Audit provenance evidence |
| 3e568b7 | Paket review budaya eksternal |

G6B.3–G6B.6 dan UI final masih merupakan perubahan lokal, bukan checkpoint commit yang sudah aman. Pembagian milestone dalam inventaris di bawah berdasarkan fungsi, versi modul, dan dokumentasi lokal; bukan klaim bahwa setiap file mempunyai commit milestone tersendiri.

## 2. Komponen dan alur yang tersedia

Route `/pawongan-sinergi/kelompok` memakai form 3–6 anggota, validator G2/civil-date, splash analisis, hasil keseluruhan, jaringan anggota sesuai jumlah input, distribusi Utama/Madia/Nista, serta reset menjadi tiga anggota kosong. Nama hanya label tampilan.

Jalur internal: server gate → `ExperimentalSamyogaGroupClient` → slot `SamyogaGroupPositionExperiment` → `analyzeSamyogaMemberPositions` → helper presentasi. Engine membaca snapshot Otonan aktual dan graf seluruh pasangan G2. UI tidak menghitung ulang formula Samyoga.

Jalur publik tidak merender rekomendasi internal. Rincian Pasangan dan ringkasan per anggota berada pada section yang dapat dibuka/tutup, default tertutup. Setiap kartu pasangan menampilkan dinamika kategori, Mod5/Mod16, perhatian simbolis Nista, dan tafsir tradisional opsional.

## 3. Hasil end-to-end dan review evaluator

Semua angka berikut dihitung kembali melalui engine aktual menggunakan tanggal fixture kalender, bukan profil/kategori rekaan. Jam fixture 12:00; tanggal tiap kasus ada pada `tests/fixtures/samyoga-member-positions-review.mjs` dan snapshot audit.

| Kasus | Anggota | Pasangan | Utama / Madia / Nista | Anggota dengan rekomendasi* | Kandidat Ketua |
| --- | ---: | ---: | --- | ---: | ---: |
| members-3 | 3 | 3 | 2 / 0 / 1 | 3 | 0 |
| members-4 | 4 | 6 | 3 / 1 / 2 | 3 | 0 |
| members-5 | 5 | 10 | 4 / 2 / 4 | 4 | 0 |
| members-6 | 6 | 15 | 6 / 3 / 6 | 5 | 0 |
| single-chair | 3 | 3 | 2 / 0 / 1 | 3 | 1 |
| multiple-chair | 3 | 3 | 3 / 0 / 0 | 3 | 3 |
| no-specific | 3 | 3 | 3 / 0 / 0 | 0 | 0 |
| caution-and-disputed | 3 | 3 | 0 / 2 / 1 | 3 | 0 |
| different-utama | 4 | 6 | 5 / 1 / 0 | 3 | 2 |

*Kontribusi atau kandidat simbolis; bukan jumlah jabatan yang ditetapkan.

Chrome development menguji delapan alur, termasuk 3/4/5/6 anggota, kandidat tunggal/jamak, caution/disputed, label panjang, dan reset. Chrome production menguji empat alur 3/4/5/6 anggota. Jumlah kartu 3/6/10/15, seluruh remainder, kategori, tafsir, distribusi, dan ringkasan anggota dibandingkan dengan output G2. Input tanggal non-leap yang invalid dan jam 24:00 menahan submit. Validasi terstruktur lebih lengkap tercakup unit test.

Tes permutasi/nama memastikan hasil substantif setiap ID, distribusi kategori, dan himpunan kandidat tidak berubah. Urutan tampilan boleh mengikuti input, tanpa menjadi ranking.

## 4. Rekomendasi posisi dan batas domain

Empat kontribusi final yang tersedia menurut mapping: **Manajemen, Operasional, Komunikasi, Kolaborasi**. Dua profil kepemimpinan langsung/tidak langsung menjadi dasar kelayakan kandidat, bukan jabatan otomatis.

Kandidat Ketua tetap memerlukan profil kepemimpinan yang matched **AND** gerbang Samyoga existing `2 × Utama > jumlah anggota − 1`. Jumlah Utama dicek terhadap edge graf aktual. Minimum existing untuk 3/4/5/6 anggota adalah 2/2/3/3. Tidak ada perubahan ambang.

Pada kasus different-utama, dua anggota dengan 2 dan 3 hubungan Utama tetap sama-sama kandidat; anggota lain dengan 3 Utama tetapi tanpa profil kepemimpinan tidak menjadi kandidat. Tidak ada pemenang paksa. Comparator tetap **UNKNOWN**; `selectedChairMemberId` dan `deputyMemberId` tetap null.

**Koordinator, Wakil Ketua, dan penetapan Ketua definitif belum didukung.** Profil parsial/review tidak dijadikan posisi. Status Anggota Kelompok untuk hasil belum spesifik merupakan partisipasi netral, bukan fallback jabatan.

Disputed C-PLAN-02/C-PLAN-03 tidak menjadi support. Caution tetap konteks/penahan profil terkait, bukan pengurangan skor. Tidak ada skor 0–100, ranking kekuatan, Zodiak, atau kompetensi ilmiah dalam evaluator posisi.

## 5. Alasan rekomendasi dan identitas hasil

Review sembilan kelompok memeriksa **236 referensi support** profil terhadap sumber master aktual, dimensi, dan semantik yang diizinkan. Tes helper menjangkau **420 fixture tanggal** dan seluruh **36 mapping**, tanpa mengubah data evaluator.

Alasan singkat memakai kutipan yang ada verbatim dalam sourcePhrase dan teks sumber anggota; sumber Wuku/Wewaran disebut secara eksplisit. Contoh Manajemen pada Salah Ukur berasal dari **Wewaran Indra** (“berbakat dalam perencanaan”) dan **Wewaran Beteng** (“pandai mengelola sumber daya”), bukan sifat Lintang yang dikarang.

Tidak ditemukan mapping issue pada fixture yang diperiksa. Evidence hilang/tidak cocok diuji agar menghasilkan laporan masalah mapping, bukan alasan pengganti. Setiap alasan paling banyak dua kalimat; alasan tanpa posisi satu penjelasan netral.

Evaluator tidak diubah. Kedua snapshot byte-identik:
- [Sebelum](../coverage/samyoga-g6b7/evaluator-before.json).
- [Sesudah](../coverage/samyoga-g6b7/evaluator-after.json).
- SHA-256 keduanya: `09b45ed7eb0edf2d6573bb57708c5c6f32a14702644d3fe1a9c09dee9afc9c20`.

Tidak ada klaim peningkatan hasil evaluator akibat perubahan UI.

## 6. UI, responsivitas dan screenshot

Urutan kartu posisi sesuai keputusan terakhir: nama + Eksperimental → badge kontribusi → kandidat Ketua bila lolos → nama/sifat Lintang asli → langsung disclosure alasan. Tidak ada paragraf sela, dump Wewaran/Dasawara, mapping ID, reason code, atau dropdown bertingkat.

Chrome memverifikasi disclosure default tertutup, state antaranggota/pasangan independen, Enter/Space, reset, dan analisis baru. Membuka alasan tidak meregangkan tinggi kartu tetangga. Viewport **320, 390, 1440 px** diperiksa saat rincian tertutup maupun terbuka, termasuk nama panjang; tidak ditemukan horizontal overflow. Tidak ada uncaught exception/hydration failure yang tertangkap.

Bukti lokal (input uji, di-ignore Git):
- [Kartu posisi desktop](../coverage/samyoga-g6b7/after-multiple-profiles-w1440.png).
- [Alasan terbuka mobile](../coverage/samyoga-g6b7/after-management-reason-w390.png).
- [Tafsir pasangan mobile](../coverage/samyoga-g6b7/after-pair-traditional-w390.png).
- [Publik OFF](../coverage/samyoga-g6b7/production-public-off-w390.png).
- [Indeks screenshot dan konsol development](../coverage/samyoga-g6b7/after-screenshots.json).
- [Indeks screenshot dan konsol production](../coverage/samyoga-g6b7/production-screenshots.json).

## 7. Regression, timezone dan build

| Pemeriksaan | Hasil nyata |
| --- | --- |
| Samyoga + Otonan unit/regression tests | **309/309 PASS**, awal sebelum fix 307 |
| TypeScript, noEmit/incremental false | PASS |
| ESLint route terkait, komponen kelompok, modul/tes Samyoga dan Otonan | PASS |
| Production build Next.js 16.1.6 | PASS; route kelompok terbangun |
| Chrome development ON | PASS, 8 alur |
| Chrome production OFF, flag 1 | PASS, 4 alur |
| Mod5/Mod16, kategori dan seluruh pasangan | PASS |
| Native disclosure keyboard/independensi/reset | PASS |
| Civil-date Asia/Makassar vs America/Los_Angeles | PASS, output kelompok/rekomendasi identik |
| Batas 05:59 / 06:00 | PASS; fixture 2005-07-27 menghasilkan Jongsarat / Tiwa-tiwa |
| Ramalan Otonan vs Samyoga | PASS; nama dan sifat Tiwa-tiwa identik di browser timezone Los Angeles |
| git diff --check | PASS |

Perintah reproduksi dari worktree Samyoga:

```powershell
node --test tests/samyoga-*.test.mjs tests/otonan-palintangan.test.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js app/pawongan-sinergi/kelompok/page.tsx app/ramalan-otonan/page.tsx components/samyoga-group lib/otonan-calendar.ts lib/samyoga-*.ts tests/samyoga-*.mjs tests/otonan-palintangan.test.mjs tests/fixtures/samyoga-*.mjs
npm.cmd run build
node tests/fixtures/samyoga-position-browser-smoke.mjs development --audit-dir coverage/samyoga-g6b7 --audit-label after
node tests/fixtures/samyoga-position-browser-smoke.mjs production --audit-dir coverage/samyoga-g6b7 --audit-label production
```

## 8. Perbaikan minimal G6B.7

**Bukti reproduksi:** baseline `SamyogaGroupPairCard.tsx` tidak merender details/summary Tafsir Tradisional; tes UI lama justru mengassert ketiadaannya. Catatan teratas `docs/samyoga-pair-ui-r1.md` menjelaskan penghapusan itu merupakan keputusan UI sebelumnya. Jadi ini selisih terhadap checklist G6B.7, bukan kerusakan formula.

**Perbaikan:** mengembalikan disclosure opsional sesuai permintaan G6B.7, default tertutup, memakai label/makna Sodasa Rsi asli. Helper presentasi menyaring field kosong/Unknown tanpa tafsir buatan. useId + native summary memberi target unik dan interaksi keyboard. Narasi kategori, remainder dan perhatian Nista tidak berubah.

File yang diubah pada sesi ini:
1. `components/samyoga-group/SamyogaGroupPairCard.tsx`.
2. `components/samyoga-group/samyoga-pair-presentation.ts`.
3. `tests/samyoga-pair-presentation.test.mjs` — menyesuaikan kontrak UI terbaru dan menambah dua tes.
4. `tests/fixtures/samyoga-position-browser-smoke.mjs` — review kategori/pasangan/summary/tafsir, validasi submit, keyboard dan produksi 3–6 anggota.
5. Laporan ini.

Tidak mengubah kalender, Otonan, Samyoga pasangan/kelompok, master, 36 mapping, threshold, comparator, evaluator posisi, gate, dependency, Docker atau Netra-Hasta.

## 9. Masalah terbuka dan indikator Next.js Issue

- **Firebase existing:** harness memblokir HTTPS selain font statis, sehingga inisialisasi Analytics/Installations menampilkan Failed to fetch. Saat kontrol Ramalan Otonan dipakai, logging Firestore existing juga gagal karena diblokir. Error konsol ini bukan exception tak tertangani atau bukti regresi Samyoga.
- **Grafik Otonan existing:** Recharts melaporkan width/height -1 saat pergantian tampilan kontrol Ramalan Otonan. Peringatan tidak berasal dari kartu/engine kelompok.
- Indikator Next.js Issue pada screenshot tidak disembunyikan. Konsol merekam sumber di atas; review ini tidak mengklaim konsol aplikasi bebas warning.
- Validasi budaya/provenance, approval mapping/policy, dan comparator tetap belum selesai. Rekomendasi tidak mengukur kepemimpinan/kompetensi nyata.
- Audit dependency/security terkini tidak dijalankan pada review fungsional ini. Tidak ditemukan laporan penutupan security terdahulu dalam dokumen worktree ini; status risiko security rilis tetap belum dibuktikan, bukan dinyatakan bersih. Versi dependency tidak diubah.
- Review dosen, penerimaan manual pada perangkat developer, serta audit rilis publik masih diperlukan.

## 10. Gate produksi, privasi dan integritas

`isSamyogaPositionExperimentEnabled()` hanya true bila NODE_ENV development **dan** SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT tepat “1”. Query, label anggota, atau properti input tidak memberi approval. Tes unit serta browser produksi dengan flag 1 membuktikan panel tidak muncul dan placeholder “Rekomendasi posisi belum diaktifkan” tetap tersedia.

Registry evidence dan rules posisi produksi tetap kosong/frozen. Resolver/approval gate tidak diubah. Sandbox/prototipe sintetis tidak dipanggil jalur runtime kelompok publik.

Tidak ada dependency, network, persistence atau logging baru pada perubahan Samyoga. Pemeriksaan source dan request browser kelompok tidak menemukan nama/tanggal fixture dikirim. Screenshot/JSON hanya dihasilkan oleh tindakan audit CLI eksplisit ke coverage lokal, tidak oleh aplikasi.

**Batas klaim privasi:** aplikasi keseluruhan tidak bebas logging. `app/ramalan-otonan/page.tsx` tetap memakai logActivity existing; `components/SessionProvider.tsx` → `lib/session.ts` dapat mengirim tanggal/jam fitur Otonan ke Firestore daily_logs. Fitur Samyoga Kelompok tidak memanggil jalur tersebut. Bootstrap Firebase global juga tetap ada. Audit ini tidak mengubah logging lama dan tidak mengklaim semua fitur aplikasi berjalan tanpa jaringan.

## 11. Inventaris seluruh perubahan lokal

Git akhir setelah laporan: **7 tracked modified, 36 untracked, 0 staged** (43 file). Empat tracked modified awal dan semua 35 untracked awal tetap tersedia. Tiga tracked tambahan adalah fix kartu/helper/tes pasangan; satu untracked tambahan adalah laporan G6B.7.

Status ` M` berarti tracked modified/unstaged; `??` berarti untracked. File di beberapa milestone dikelompokkan sekali berdasarkan tanggung jawab versi finalnya.

**1. Integrasi rekomendasi awal G6B.3 — C1.** Rules dan baseline eksperimen dipakai ulang oleh integrasi Palintangan serta mapping G6B.5; route/wrapper final juga memerlukan panel G6B.5 dan helper UI.

| Status | File |
| --- | --- |
| `??` | `lib/samyoga-position-experiment-rules.ts` |
| `??` | `lib/samyoga-position-experiment-baseline-g6b3.ts` |
| `??` | `lib/samyoga-internal-beta.server.ts` |
| `??` | `tests/samyoga-position-experiment.test.mjs` |
| `??` | `docs/samyoga-position-experiment-g6b3.md` |
| `??` | `components/samyoga-group/ExperimentalSamyogaGroupClient.tsx` |
| ` M` | `app/pawongan-sinergi/kelompok/page.tsx` |
| ` M` | `components/samyoga-group/SamyogaGroupClient.tsx` |
| ` M` | `components/samyoga-group/SamyogaGroupResults.tsx` |

**2. Integrasi Palintangan dan konsistensi Otonan G6B.3-R1 — C1.** Bergantung pada rules G6B.3; adapter civil-date dipakai Ramalan Otonan dan eksperimen Palintangan.

| Status | File |
| --- | --- |
| `??` | `lib/otonan-calendar.ts` |
| ` M` | `app/ramalan-otonan/page.tsx` |
| `??` | `lib/samyoga-palintangan.ts` |
| `??` | `lib/samyoga-palintangan-experiment-rules.ts` |
| `??` | `lib/samyoga-position-experiment.ts` |
| `??` | `tests/otonan-palintangan.test.mjs` |
| `??` | `tests/samyoga-palintangan.test.mjs` |
| `??` | `docs/samyoga-palintangan-integration-g6b3r1.md` |
| `??` | `docs/samyoga-palintangan-inventory-g6b3r1.md` |

**3. Audit mapping G6B.4 dan kontrak G6B.5-P0 — C1.** Fixture dan tes audit bergantung pada Palintangan/master existing serta dokumen mapping/kontrak; tidak mengaktifkan registry produksi.

| Status | File |
| --- | --- |
| `??` | `docs/samyoga-palintangan-mapping-g6b4.md` |
| `??` | `docs/samyoga-position-coverage-g6b4.md` |
| `??` | `docs/samyoga-position-profile-review-g6b4.md` |
| `??` | `docs/samyoga-indirect-leadership-contract-g6b5p0.md` |
| `??` | `docs/samyoga-indirect-leadership-decisions-g6b5p0.md` |
| `??` | `docs/samyoga-indirect-leadership-matrix-g6b5p0.md` |
| `??` | `tests/fixtures/samyoga-palintangan-coverage-g6b4.mjs` |
| `??` | `tests/fixtures/samyoga-palintangan-mapping-g6b4.json` |
| `??` | `tests/samyoga-palintangan-mapping-g6b4.test.mjs` |

**4. Implementasi posisi per anggota G6B.5 — C1.** Engine final mengimpor rules G6B.3 dan snapshot kalender tracked; digunakan panel dan helper presentasi final.

| Status | File |
| --- | --- |
| `??` | `lib/samyoga-member-position-rules.ts` |
| `??` | `lib/samyoga-member-positions.ts` |
| `??` | `tests/samyoga-member-positions.test.mjs` |
| `??` | `docs/samyoga-member-positions-g6b5.md` |

**5. Review G6B.6, UI ringkas dan dropdown final — C1.** Panel/helper/tes bergantung pada evaluator G6B.5; harness memeriksa juga UI pasangan G6B.7. File final menggabungkan beberapa milestone, bukan snapshot historis terpisah.

| Status | File |
| --- | --- |
| `??` | `components/samyoga-group/SamyogaGroupPositionExperiment.tsx` |
| `??` | `lib/samyoga-position-presentation.ts` |
| `??` | `tests/samyoga-position-experiment-ui.test.mjs` |
| `??` | `tests/samyoga-position-presentation.test.mjs` |
| `??` | `tests/fixtures/samyoga-member-positions-review.mjs` |
| `??` | `tests/samyoga-member-positions-review.test.mjs` |
| `??` | `docs/samyoga-member-positions-review-g6b6.md` |
| `??` | `tests/fixtures/samyoga-position-browser-smoke.mjs` |

**6. Final regression fix dan review G6B.7 — C1 (laporan C2).** Helper tafsir hanya membaca hasil G2, kartu memakai helper; tes/harness harus mengikuti disclosure yang dikembalikan. Laporan bergantung pada hasil validasi seluruh kelompok.

| Status | File |
| --- | --- |
| ` M` | `components/samyoga-group/SamyogaGroupPairCard.tsx` |
| ` M` | `components/samyoga-group/samyoga-pair-presentation.ts` |
| ` M` | `tests/samyoga-pair-presentation.test.mjs` |
| `??` | `docs/samyoga-final-review-g6b7.md` |

## 12. Rencana checkpoint aman — belum dieksekusi

**C1 — checkpoint atomik semua 42 file inventaris selain laporan G6B.7.**

Usulan pesan: `feat(samyoga): finalize internal group positions and regression coverage`.

C1 mencakup keenam kelompok logis di atas: integrasi awal → Palintangan → audit/kontrak → evaluator anggota → UI final → regression fix. Urutan tersebut menjelaskan dependensi, bukan instruksi membuat enam commit terpisah. Kode final sudah saling mengimpor lintas milestone; men-stage panel/gate tanpa evaluator/helper, atau tes audit tanpa fixture/dokumen, dapat menghasilkan intermediate commit yang rusak. Tidak merekonstruksi sejarah milestone dengan file final yang tidak sesuai snapshot historisnya.

**C2 — laporan final**, sesudah C1.

Usulan pesan: `docs(samyoga): record G6B7 final review and demo freeze`.

C2 hanya `docs/samyoga-final-review-g6b7.md`; tidak ada runtime yang bergantung padanya. Paket C1 telah diperiksa cakupan import/fixture/dokumennya, tetapi intermediate committed tree belum dibuat atau diuji terpisah. Sebelum mengeksekusi checkpoint, developer tetap perlu meninjau daftar path dan staged diff secara eksplisit.

Pengecualian: `.next/`, `node_modules/`, `coverage/`, `next-env.d.ts`, tsbuildinfo dan secret/env tetap ignored. Screenshot, JSON audit, cache dan credential tidak masuk inventaris/checkpoint. Tidak ada staged file, jadi tidak ada artefak audit yang ter-stage.

Tidak menjalankan add, commit, push, merge, reset, clean, restore atau switch/checkout branch.

## 13. Demo freeze dan langkah demonstrasi

```powershell
$env:SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT = "1"
npm.cmd run dev -- --port 3020
```

Buka `http://localhost:3020/pawongan-sinergi/kelompok`. Gunakan fixture kalender dalam harness review: mulai 3 anggota, naik 6, tunjukkan badge kontribusi dan sifat Lintang, buka alasan, lalu seluruh pasangan dan Tafsir Tradisional. Tunjukkan kandidat tunggal/jamak, kasus belum spesifik, dan Analisis Ulang yang mengosongkan input.

Bekukan aturan/mapping dan UI hasil yang telah diuji. Kumpulkan masukan dosen tanpa mengubah eksperimen menjadi klaim jabatan nyata. Produksi publik tetap OFF.

**READY FOR INTERNAL DEMO FREEZE**, dengan batas domain, risiko existing, dan status checkpoint lokal yang dijelaskan di atas.
