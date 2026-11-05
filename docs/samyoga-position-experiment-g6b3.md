# Samyoga Kelompok — G6B.3 eksperimen profil posisi

Keputusan: **READY FOR INTERNAL BETA REVIEW**. Produksi publik tetap OFF dan seluruh persetujuan budaya/produk tetap pending. Tanggal pekerjaan: 2 November 2026 (WITA).

## Baseline Git dan scope

Worktree C:\Project-Trispark\jodoh_bali_samyoga; branch feat/samyoga-group; HEAD awal/akhir 3e568b768beb73c445e32db89a9672415e0e7949. Awal bersih, staged/unstaged/untracked kosong.

Checkpoint yang benar-benar tersedia: G6A.7/R1 c3eae7f; G6A.8/R1 05d9a92; UI-R1/revisi 16335da; G6A.9 7d8b550; G6B.1 efc116f; G6B.2 3e568b7. Form review manusia dan seluruh arsip tidak diisi/diubah. Tidak ada commit, push, merge, reset, clean atau switch branch.

Instruksi G6B.3 mengizinkan percobaan internal memakai mapping yang belum diverifikasi. Percobaan ini **terpisah dari resolver dan approval produksi**, bukan persetujuan budaya atau cara mengaktifkan registry.

## Arsitektur dan file

Tiga file existing diubah:

- [Route kelompok](../app/pawongan-sinergi/kelompok/page.tsx): memilih entry client eksperimen hanya melalui gate server.
- [SamyogaGroupClient](../components/samyoga-group/SamyogaGroupClient.tsx): renderer opsional saat hasil tersedia; form/splash/reset tetap memakai reducer existing.
- [SamyogaGroupResults](../components/samyoga-group/SamyogaGroupResults.tsx): slot hasil eksperimen setelah hero keseluruhan dan sebelum tombol/rincian pasangan; default tetap placeholder existing.

Sembilan file baru:

- [Rules dan mapping eksperimen](../lib/samyoga-position-experiment-rules.ts).
- [Evaluator eksperimen](../lib/samyoga-position-experiment.ts).
- [Gate server-only](../lib/samyoga-internal-beta.server.ts).
- [Entry client internal](../components/samyoga-group/ExperimentalSamyogaGroupClient.tsx).
- [Panel kartu posisi](../components/samyoga-group/SamyogaGroupPositionExperiment.tsx).
- [Unit test evaluator](../tests/samyoga-position-experiment.test.mjs).
- [Tes UI/gate](../tests/samyoga-position-experiment-ui.test.mjs).
- [Runner Chrome CDP lokal](../tests/fixtures/samyoga-position-browser-smoke.mjs).
- Laporan ini.

Alur: route server → gate development → entry client internal → renderer slot → snapshot Otonan existing + graf G2 → exact matching katalog → profil kualitatif → kandidat dua gerbang. Tidak ada import fixture/sandbox Ketua ke runtime. Fungsi renderer dibuat di entry client dan diteruskan antar komponen client, bukan fungsi yang diserialisasi dari server bersama data anggota.

## Mapping dan batas domain

Versi eksperimen: g6b3-otonan-profile-v1. **22 assertion katalog existing** disalin dengan identity/siklus/record/field/kutipan, alasan, keterbatasan dan status asal. Mapping G6B3-MAP-* adalah ID hipotesis, bukan sourceId budaya. Semua provenance missing, review budaya pending, produk pending; tidak ada verified/approved baru.

| Profil | Syarat percobaan | Batas |
| --- | --- | --- |
| Leader | directing AND communicating AND collaborating | Memenuhi profil tidak berarti lebih kuat atau lebih kompeten |
| Manajemen | planning AND managing | Hipotesis produk; bukan kemampuan organisasi terukur |
| Operasional | executing | Indikator awal saja; kriteria belum lengkap, bukan pengesahan qualification G6A.4 |
| Koordinator | Belum ada aturan khusus yang memadai | Belum dapat ditentukan |
| Wakil Ketua | Tidak ada kebijakan tersendiri | Tetap null |
| Anggota | Tidak menjadi profil fallback | Ketiadaan evidence bukan penilaian negatif |

Satu assertion cocok hanya jika identity dan kutipan persis. Dukungan digabung sebagai **himpunan dimensi**, tanpa jumlah evidence, bobot, urip atau sentimen sebagai intensitas. C-DIR-01/C-MAN-02 mempunyai referensi dependensi; dua field Sinta juga tercatat satu record. Derivasi kalender tidak diklaim sebagai observasi independen.

Caution ditampilkan sebagai konteks, bukan pengurangan skor. Konflik support+caution yang mengenai profil lengkap menahan seluruh match percobaan, mempertahankan kebijakan konservatif evaluator existing. Profil parsial tetap informasi, bukan rekomendasi. Usulan C-PLAN-02/C-PLAN-03 yang disarankan ditolak oleh audit sumber tetap diberi peringatan eksplisit; mempertahankannya dalam percobaan bukan mengesahkan atau menghapus hasil audit.

## Kontrak hasil

API utama: analyzeExperimentalSamyogaPositions(members, groupResult). Menggunakan createSamyogaGroupCalendarSnapshots dan calculateSamyogaGroup existing; result graf harus identik dengan hasil engine aktual untuk input tersebut. Graf tidak lengkap, duplikat, summary Utama bebas, kategori berbeda atau hasil lama ditolak.

Hasil memuat memberId/nama, indikator kalender, boundary, dimensi support/caution/missing, seluruh profil matched/partial/conflict/unsupported, evidence dan rule references, reason codes, versi, experimental=true, synthetic=false dan disclaimer. Asal kalender aktual tidak menyatakan validitas budaya.

Status anggota dibedakan menjadi no_indicators, no_matching_evidence, partial_profile, conflicting_indicators, multiple_profiles atau profile_matched. Status evidence unverified/no_evidence terpisah sehingga profil matched tetap memperlihatkan ketidakpastian sumber. Helper inspection menerima snapshot yang dinyatakan eksplisit dan tidak mengklaim asalnya; fault injection tes tidak disebut hasil kalender nyata.

## Contoh yang direproduksi melalui engine

Tanggal berikut **input kalender pengujian, bukan data subjek/manusia**; jam 12:00, hasil dihitung engine existing. Tidak ada fixture approval atau kategori pasangan buatan.

| Input tanggal | Hasil profil | Catatan |
| --- | --- | --- |
| 2005-09-18 | Leader | C-DIR-01, C-MAN-02, C-COMM-01, C-COLL-01; dependensi kutipan tetap terlihat |
| 2005-08-18 | Manajemen | C-PLAN-01 dan C-MAN-01 memenuhi dua dimensi; C-DIR-02 juga tampil sebagai konteks |
| 2005-07-27 | Operasional terbatas | executing dari C-EXEC-01/02; caution directing tetap terlihat, Leader tidak otomatis terpenuhi |
| 2005-11-16 | Manajemen dan Operasional | Tidak dipaksa satu posisi utama |
| 2005-08-04 | Belum dapat ditentukan | Indikator tersedia, tidak ada assertion katalog yang cocok |

Contoh enam anggota A/B/C/D/E/F: 2005-09-18, 2005-10-30, 2005-07-27, 2005-07-27, 2005-07-27, 2005-07-30. ID berbeda dengan tanggal sama diperbolehkan G2. A/B memenuhi Leader dan memiliki **4 serta 3 Utama dari 5 relasi**. Kedua gerbang lolos, tetapi comparator UNKNOWN: **multiple_candidates**, tidak ada satu Ketua atau Wakil yang ditetapkan.

Contoh tiga anggota: 2005-09-18, 2005-07-27, 2005-07-27 menghasilkan satu kandidat percobaan; tiga tanggal 2005-07-27 menghasilkan no_candidate. Kandidat bukan penetapan jabatan nyata.

## Gerbang kandidat Ketua

| Jumlah anggota | Relasi per anggota | Minimum Utama |
| --- | --- | --- |
| 3 | 2 | 2 |
| 4 | 3 | 2 |
| 5 | 4 | 3 |
| 6 | 5 | 3 |

Rumus percobaan: 2 × Utama > N−1. Count dihitung dari edge incident pada graf engine yang sudah diperiksa, bukan input summary bebas. Kebijakan tetap pending; kategori dominan kelompok tidak digunakan.

Otonan Leader AND dukungan Samyoga wajib sama-sama lolos. Nol kandidat → no_candidate; satu → single_candidate berlabel kandidat eksperimen; dua atau lebih → multiple_candidates tanpa pemilihan ID/nama/urutan. Wakil selalu null.

Comparator tetap UNKNOWN; kesetaraan tidak diasumsikan. Konflik indikator ditampilkan. **Konflik prioritas Otonan versus Samyoga belum dapat dibuktikan tanpa comparator yang sah**, sehingga priorityStatus=not_evaluable_without_comparator; tidak mengarang konflik atau STRONGER dari count berbeda. Alokasi produksi/kontrak G6A.7-R1 dan sandbox tidak diubah.

## Gate dan cara mencoba

Gate server-only tidak menerima parameter enablement/approval. Hanya NODE_ENV=development **dan** SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT=1 yang membuka entry eksperimen. Default OFF. NODE_ENV=production/test tetap OFF walau flag=1; query, localStorage dan boolean approval bukan jalur enablement.

Pola marker server-only dan environment server mengikuti [dokumentasi Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components). Flag tidak memakai NEXT_PUBLIC_. Jangan menjalankan development server sebagai deployment publik; server beta contoh dibatasi localhost.

PowerShell pada worktree ini: mulai ulang server development yang Anda kelola dengan flag berikut, menggunakan port bebas. Instance lama perlu dihentikan terlebih dahulu agar lock development dilepas.

~~~powershell
$env:SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT = '1'
npm.cmd run dev -- --hostname 127.0.0.1 --port 3022
~~~

Buka /pawongan-sinergi/kelompok, isi 3–6 anggota, klik Analisis Samyoga Group. Setelah splash/hero, kartu posisi terlihat sebelum rincian pasangan. Detail alasan memakai details/summary native; Enter/Space dapat mengubah keadaan. Analisis ulang menghapus hasil dan mengembalikan form awal.

Untuk mematikan di sesi shell baru, jangan set flag; pada sesi yang sama gunakan Remove-Item Env:SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT lalu mulai ulang server yang dikelola sendiri. Tidak mengubah .env atau menghentikan instance developer secara otomatis.

## Pengujian nyata

| Pemeriksaan | Hasil |
| --- | --- |
| Tes evaluator/UI/gate baru | **26/26 lulus** |
| Seluruh regression Samyoga | **238/238 lulus**, 0 fail/skipped; termasuk 212 existing |
| TypeScript | npx.cmd tsc --noEmit --incremental false — lulus |
| ESLint file terkait | Lulus, 0 error/warning setelah perbaikan tes |
| Production build | Lulus, Next 16.1.6/Turbopack; flag eksperimen sengaja 1 selama build |
| Production Chrome | Route HTTP 200, 3 dan 6 anggota; eksperimen tetap tidak muncul meski flag=1 dan query percobaan; reset/detail pasangan berfungsi |
| Production viewport | 1440/390/320 px tanpa overflow, termasuk label fixture panjang |
| Development Chrome | **Lulus** 3/4/5/6 anggota; kartu eksperimen muncul, disclaimer terlihat, Enter membuka/Space menutup disclosure, dua kandidat tetap tanpa pemenang, detail pasangan dan reset berfungsi |
| Development viewport | 1440/390/320 px tanpa overflow untuk seluruh ukuran kelompok, termasuk label fixture panjang |
| Browser exception / request body | 0 uncaught exception dan 0 request body berisi nama/tanggal fixture pada setiap run final development/production |
| Timezone eksperimen | Asia/Makassar dan America/Los_Angeles identik SHA-256 d61aebb162e23752ac190cd51c74f554e50fe00b2a18a3177c34e121f6a8dca1 pada fixture enam anggota |
| Integritas source | 108 file baseline; hanya tiga integrasi UI/route berubah, **105 lainnya identik SHA-256** |
| Registry/rule produksi | Keduanya kosong/frozen; objek eksperimen tidak memperoleh capability approval resolver |
| Transport/storage baru | Tidak ada fetch/upload, telemetry, logging nama/tanggal/hasil, localStorage, IndexedDB atau server action |

Runner: node tests/fixtures/samyoga-position-browser-smoke.mjs production atau development setelah build. Instance dev existing memegang .next/dev/lock; harness tidak menghentikannya. Development diuji pada salinan sumber sementara dengan dependency junction existing dan webpack, agar tidak mengubah konfigurasi repo/lock server pengguna. Salinan mencakup modul Firebase existing yang dipakai layout, tanpa mengubah file Firebase. Rahasia .env tidak disalin; environment existing dimuat pada proses pengujian tanpa dicetak.

Chrome memakai profil sementara sendiri, blok request HTTPS eksternal untuk mencegah telemetry existing selama smoke test. Ini bukan klaim telemetry global aplikasi telah dihapus. Pemeriksaan request body hanya fixture sintetis; audit source menunjukkan fitur tidak menambah transport/persistensi. Viewport mobile merupakan emulasi, bukan perangkat fisik. Helper membersihkan proses/profil/salinan miliknya dengan target temporary yang diverifikasi.

Kegagalan awal helper: lock dev pengguna, salinan awal yang belum menyertakan dependency Firebase layout, input dikirim sebelum hydration, serta fokus/event keyboard CDP yang belum lengkap. Helper diperbaiki dan run final lulus; tidak ada perubahan engine untuk mengatasinya. Tidak mencatat kegagalan helper sebagai regresi algoritma.

## Protected scope, Git akhir dan risiko terbuka

Tidak mengubah synergy-logic, samyoga-group, samyoga-group-summary, balinese-calendar, data/types master, snapshot, Pal Sri Sedana, registry/resolver/evaluator approval produksi, sandbox/fixture Ketua, UI pair card, Firebase, package/lockfile atau Docker/deployment. Tampilan Tafsir Tradisional yang sudah dihapus pada revisi UI-R1 tidak dikembalikan; data tafsir existing tetap utuh.

Git akhir: branch/HEAD tetap; staged kosong; **3 tracked modified + 9 untracked baru** sesuai daftar. Diff tracked hanya 18 penambahan/7 penghapusan untuk slot dan pemilihan entry, bukan perubahan formula. File baru tidak disembunyikan dari daftar perubahan.

Risiko: seluruh mapping belum divalidasi ahli; planning mempunyai usulan yang dipersoalkan; Operasional belum lengkap; Koordinator/Wakil belum mempunyai aturan; comparator dan konflik prioritas belum dapat disimpulkan. Tidak ada klaim kompetensi, ranking, efektivitas tim, validasi empiris atau persetujuan budaya. Review ahli/produk dan pengujian internal pengguna masih diperlukan sebelum membahas aktivasi publik.

**READY FOR INTERNAL BETA REVIEW** untuk percobaan yang dijaga gate development. Bukan approval budaya atau izin rilis publik.
