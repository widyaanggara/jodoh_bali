# Review fungsional rekomendasi posisi — G6B.6

Tanggal: **4 November 2026, WITA**. Worktree `C:\Project-Trispark\jodoh_bali_samyoga`; branch `feat/samyoga-group`; HEAD tetap `3e568b768beb73c445e32db89a9672415e0e7949`.

**READY FOR PRODUCT DEMO — development internal.** Sebelas kondisi review berhasil ditemukan dari input tanggal yang dihitung ulang mesin existing. Alasan rekomendasi sesuai identity/kutipan master dan aturan evaluator. Perbaikan dibatasi pada penyajian UI dan pengujian; engine, 36 mapping, kriteria posisi dan approval gate tidak berubah.

## 1. Git baseline dan perlindungan pekerjaan

Awal aktual: **4 tracked modified, 30 untracked, staged kosong**. Seluruh pekerjaan G6B.3 hingga G6B.5 masih tersedia dan tidak dianggap sudah di-commit.

Sebelum perubahan dicatat SHA-256 atas **138 file** (108 tracked + 30 untracked). Sesudah perubahan:
- **135/138 file awal identik**; hanya panel dan dua file tes/browser untracked existing yang berubah sesuai scope review.
- Seluruh **108 file tracked identik dengan baseline sesi**, termasuk empat perubahan tracked dari pekerjaan terdahulu.
- Engine kalender/Palintangan, master data, Samyoga pasangan/G2, Mod5/Mod16, snapshot Otonan, engine/rules G6B.5, resolver/gate produksi serta sandbox Ketua/Wakil tidak disentuh.
- Tidak ada commit, push, merge, reset, clean atau switch branch.

Bahan yang dibaca: [G6B.3](samyoga-position-experiment-g6b3.md), [integrasi R1](samyoga-palintangan-integration-g6b3r1.md), [audit G6B.4](samyoga-palintangan-mapping-g6b4.md), [kontrak P0](samyoga-indirect-leadership-contract-g6b5p0.md), dan [implementasi G6B.5](samyoga-member-positions-g6b5.md), beserta kode/tes aktualnya.

## 2. Metode dan hasil audit data aktual

Audit menjalankan `calculateSamyogaGroup`, `analyzeSamyogaMemberPositions` dan `createSamyogaGroupCalendarSnapshots` atas input uji. Tidak memasukkan profil, kategori pasangan atau output fixture buatan sebagai hasil kalender. Semua waktu pada contoh di bawah **12:00** dan label orang berupa **Anggota Uji A/B/...**, bukan pengguna nyata.

Ada **9 kelompok input** yang mencakup seluruh **11 kondisi**:
Manajemen, Operasional, Komunikasi, Kolaborasi, kepemimpinan, beberapa profil, belum spesifik, caution, serta kelompok tanpa/satu/beberapa kandidat Ketua. Tidak ada kondisi yang perlu diisi dengan hasil palsu atau dinyatakan tidak ditemukan.

Detail per anggota/per profil tersimpan lokal di [recommendations-after.json](../coverage/samyoga-g6b6/recommendations-after.json): identity indikator, field master, kutipan, dimensi, mapping/evidence ID, alasan, batas interpretasi, caution, graf relasi dan hasil evaluator. **236 referensi support profil** diperiksa terhadap teks master asli; ini jumlah jejak audit, bukan skor atau jumlah bukti independen.

### Contoh yang mewakili setiap profil

| Kondisi | Input uji | Hasil aktual | Sumber dan alasan |
| --- | --- | --- | --- |
| Manajemen | 2005-08-18, Lintang Salah Ukur | Manajemen didukung | Indra/asatawara memberi planning; Beteng/triwara memberi managing. Bukan kesimpulan dari label Palintangan “Giat”. |
| Operasional | 2005-07-27, Tiwa-tiwa | Operasional dan Komunikasi | Buda menyebut ketelitian bekerja; Dangu menyebut konsistensi sebagai hipotesis kontinuitas terbatas. |
| Komunikasi | 2005-07-27, Tiwa-tiwa | Komunikasi didukung | Kliwon menyebut berbicara dan teks Tiwa-tiwa menyebut merangkai kata; konteks sensitivitas tetap terlihat. |
| Kolaborasi | 2005-09-18, Patrem | Kolaborasi dan Komunikasi | Redite menyebut menolong; ini hipotesis prososial, bukan bukti kompetensi kerja tim. |
| Kepemimpinan | 2005-09-18 dalam kelompok 2005-09-18/2005-07-27/2005-07-27 | Jalur langsung dan tidak langsung, kandidat Ketua tunggal | Ada support pengarahan/komunikasi/kolaborasi dan managing; dua edge Utama memenuhi minimum 2. |
| Beberapa profil | 2005-08-03 dalam kelompok 2005-08-03/2005-08-03/2005-08-01 | Operasional, Komunikasi, Kolaborasi dan kandidat | Semua berasal dari aturan existing; tidak dihitung sebagai kekuatan lebih tinggi. |
| Belum spesifik | 2005-07-28, Sangka Tikel | Status partisipasi Anggota Kelompok; profil masih parsial | Tidak ada komunikasi yang melengkapi profil terkait; jumlah Utama tidak membuat sifat baru. |
| Caution/review | 2005-07-30, Sungenge/Sinta | Komunikasi dan Kolaborasi tetap tampil; kepemimpinan perlu review | C-DIR-04 membatasi interpretasi kepemimpinan terkait, tidak menghapus kontribusi lainnya. |

Tanggal tersebut adalah input uji kalender, bukan identitas subjek/pengguna. Sumber Bali tambahan memang diotorisasi pada G6B.5; audit Palintangan-only P0 yang irisannya kosong tetap dipertahankan sebagai catatan scope sebelumnya.

### Kutipan tepat dan mapping yang diperiksa

**Manajemen:**

- `wewaran:asatawara:2/karakter`, Indra, **C-PLAN-01 / G6B3-MAP-C-PLAN-01**:
  > Visioner, berbakat dalam perencanaan, dan sangat tekun.

  Perencanaan disebut eksplisit; tidak diklaim sebagai kualitas rencana organisasi.
- `wewaran:triwara:2/karakter`, Beteng, **C-MAN-01 / G6B3-MAP-C-MAN-01**:
  > Berjiwa pelindung, pandai mengelola sumber daya, dan makmur.

  Pengelolaan disebut eksplisit. Kata makmur tidak dipakai sebagai kompetensi.

**Operasional:**

- `saptawara:4/karakter`, Buda, **C-EXEC-01 / G6B3-MAP-C-EXEC-01**:
  > Cerdas, teliti dalam bekerja, dan sangat menghargai aturan.

  Ketelitian bekerja mendukung hipotesis pelaksanaan.
- `wewaran:sangawara:1/karakter`, Dangu, **C-EXEC-02 / G6B3-MAP-C-EXEC-02**:
  > Tenang, konsisten, dan tidak suka terburu-buru.

  Kontinuitas merupakan interpretasi terbatas; tidak membuktikan ketuntasan atau produktivitas.

**Komunikasi:**

- `pancawara:5/karakter`, Kliwon, **C-COMM-02 / G6B3-MAP-C-COMM-02**:
  > Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi.

  Ekspresi verbal dipetakan; spiritualitas tidak dipakai sebagai kemampuan kerja.
- `lintang:Buda:Kliwon/penjelasan`, Tiwa-tiwa, **C-COMM-03 / G6B3-MAP-C-COMM-03**:
  > Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung.

  Merangkai kata mendukung komunikasi; tidak dipromosikan menjadi planning/managing, sensitivitas tidak dihapus.

**Kolaborasi:**

- `saptawara:1/karakter`, Redite, **C-COLL-01 / G6B3-MAP-C-COLL-01**:
  > Berjiwa sosial tinggi, berwibawa, dan senang menolong.

  Menolong memberi hipotesis hubungan saling membantu. Pergaulan/menolong tidak dinyatakan sebagai bukti kemampuan kerja tim.

**Kepemimpinan langsung/tidak langsung pada Patrem:**

- `wewaran:asatawara:1/karakter`, Sri, **C-DIR-01 / G6B3-MAP-C-DIR-01** dan **C-MAN-02 / G6B3-MAP-C-MAN-02**:
  > Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.

  Dipakai pada dua dimensi yang dinyatakan eksplisit, tetapi **kalimat/sumber sama, bukan dua bukti independen**.
- `wewaran:dwiwara:1/karakter`, Menga, **C-COMM-01 / G6B3-MAP-C-COMM-01**:
  > Terbuka, komunikatif, dan mudah menerima masukan dari luar.

  Komunikasi mempunyai konteks keterbukaan; bukan skor.
- `lintang:Redite:Pon/penjelasan`, Patrem, **EXP-G6B5-L22-COMM-01 / G6B5-MAP-L22-COMM-01**, frasa:
  > pandai berdiplomasi

  Teks lengkap yang tetap ditampilkan:
  > Sangat licin dan pandai berdiplomasi. Suka memperlihatkan kekayaan dan kepandaiannya di hadapan orang lain, namun pandai menyimpan perasaan yang sesungguhnya.

  Konteks tidak dihapus. C-COLL-01 menyediakan dimensi prososial jalur langsung. Jalur tidak langsung memerlukan communicating AND managing tekstual, bukan banyaknya evidence.

**Caution dan disputed:**

- Sinta `wuku:1/kelemahan`, **C-DIR-04 / G6B3-MAP-C-DIR-04**:
  > Keras kepala, sulit menerima kritik.

  Tetap sebagai konteks interpretasi, bukan vonis karakter. Pada profil lengkap yang terkait, evaluator memberi review_required; kontribusi komunikasi/kolaborasi dapat tetap ada.
- **C-PLAN-02** dan **C-PLAN-03** tidak muncul sebagai support profil mana pun pada kasus audit. Teks/rationale/limit tetap dapat dilihat sebagai disputed.
- Caution komunikasi Salah Ukur tetap ditampilkan, tetapi tidak menjadi penalti otomatis untuk profil Manajemen.

Seluruh metadata sumber tetap missing/pending; tidak ada kutipan yang disahkan sebagai verified/approved oleh review ini.

## 3. Konsistensi kelompok dan kandidat Ketua

Urutan sampel standar:
`2005-07-27, 2005-09-18, 2005-08-18, 2005-07-28, 2005-08-03, 2005-08-21`.

| Kasus | N | Anggota dengan rekomendasi kontribusi/kandidat | Belum spesifik | Kandidat Ketua |
| --- | --- | --- | --- | --- |
| 3 sampel standar | 3 | 3 | 0 | 0 |
| 4 sampel standar | 4 | 3 | 1 | 0 |
| 5 sampel standar | 5 | 4 | 1 | 0 |
| 6 sampel standar | 6 | 5 | 1 | 0 |
| 2005-09-18 / 2005-07-27 / 2005-07-27 | 3 | 3 | 0 | 1 |
| 2005-08-03 / 2005-08-03 / 2005-08-01 | 3 | 3 | 0 | 3 |
| 2005-07-28, tiga ID berbeda | 3 | 0 | 3 | 0 |
| 2005-07-30 / 2005-08-02 / 2005-08-18 | 3 | 3 | 0 | 0 |
| 2005-08-15 / 2005-08-21 / 2005-07-27 / 2005-07-28 | 4 | 3 | 1 | 2 |

Semua count berasal dari pasangan yang benar-benar dihitung engine. Mayoritas tetap minimum 2/2/3/3 untuk N=3/4/5/6, `2 × Utama > N−1`, sebagai kebijakan eksperimen.

Kasus terakhir: Lembu memiliki **2 Utama**, Lawean **3 Utama**, keduanya kandidat. Tidak dipilih pemenang; comparator UNKNOWN, selectedChair null dan deputy null. Sangka Tikel pada kelompok itu mempunyai 3 Utama tetapi tidak mempunyai profil kepemimpinan, sehingga bukan kandidat. Kontribusi komunikasi tidak menjadi Koordinator, dan profil kepemimpinan sendiri tidak otomatis menjadi Ketua.

Audit keluaran sebelum/sesudah UI menghasilkan JSON **identik** dengan SHA-256:
`09b45ed7eb0edf2d6573bb57708c5c6f32a14702644d3fe1a9c09dee9afc9c20`.
File lokal: [sebelum](../coverage/samyoga-g6b6/recommendations.json) dan [sesudah](../coverage/samyoga-g6b6/recommendations-after.json).

## 4. Temuan dan perbaikan minimal UI

Tidak ditemukan masalah aturan posisi/graf pada seluruh skenario valid yang ditinjau. Temuan presentasi:

1. **Kontribusi dan kandidat tercampur.** Sebelumnya label Kandidat Ketua tampil dalam kumpulan chip dengan gaya yang sama seperti Komunikasi/Kolaborasi. Kini ada bagian **Profil kontribusi** dan panel **Kandidat Ketua simbolis** terpisah, dengan keterangan belum menetapkan Ketua/Wakil.
2. **Rekomendasi kurang cepat ditemukan.** Label kini berada di atas tafsir Palintangan, dekat nama anggota; karakter asli tetap utuh.
3. **Jejak alasan per profil kurang langsung.** Disclosure kini menampilkan frasa, indikator, dimensi serta ID mapping/evidence yang benar-benar dipakai pada profil itu, bukan hanya daftar evidence umum.
4. **Status teknis kurang ramah dibaca.** matched/partial/review_required/unsupported diterjemahkan ke bahasa Indonesia. Tidak ada dimensi yang kurang ditampilkan sebagai “tidak ada”, bukan “belum ditemukan”.
5. **Membuka evidence dapat memanjangkan kartu tetangga dalam grid desktop.** Grid kini memakai items-start; regression browser memeriksa tinggi kartu tetangga tetap stabil ketika evidence dibuka.

Semua perbaikan adalah presentasi hasil evaluator existing. Tidak mengubah kriteria, formula, master, mapping, eligibility, caution policy, threshold, bobot atau jumlah rekomendasi.

Keadaan belum spesifik tetap netral, tidak memakai role alert/error. Semua anggota tetap terlihat. Profil parsial tidak disebut profil lengkap. Wakil/Koordinator tidak menjadi fallback.

Urutan halaman tetap Hasil Keseluruhan → Rekomendasi Posisi Anggota → Rincian Pasangan; regression SSR memastikan urutannya.

## 5. Screenshot lokal dan keterbacaan

Lokasi: `coverage/samyoga-g6b6/`, **sudah di-ignore Git melalui /coverage**. Tidak berada di public/ dan tidak menjadi source rilis. Pengambilan hanya dilakukan lewat flag eksplisit `--audit-dir`; smoke biasa tidak menyimpan gambar.

Ada **54 PNG**: 24 baseline, 27 final development, 3 production OFF. Screenshot berupa viewport browser sebenarnya pada 320/390/1440 px, memakai nama Anggota Uji, tanpa nama/tanggal lahir pengguna nyata. Form input sudah tersembunyi ketika hasil ditangkap. Bukti ini bukan foto pengguna atau biometrik.

| Kondisi | Desktop 1440 | Mobile 390 | Mobile 320 |
| --- | --- | --- | --- |
| Manajemen tersedia | [gambar](../coverage/samyoga-g6b6/after-management-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-management-w390.png) | [gambar](../coverage/samyoga-g6b6/after-management-w320.png) |
| Beberapa profil | [gambar](../coverage/samyoga-g6b6/after-multiple-profiles-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-multiple-profiles-w390.png) | [gambar](../coverage/samyoga-g6b6/after-multiple-profiles-w320.png) |
| Kandidat tunggal | [gambar](../coverage/samyoga-g6b6/after-single-chair-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-single-chair-w390.png) | [gambar](../coverage/samyoga-g6b6/after-single-chair-w320.png) |
| Beberapa kandidat | [gambar](../coverage/samyoga-g6b6/after-multiple-chair-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-multiple-chair-w390.png) | [gambar](../coverage/samyoga-g6b6/after-multiple-chair-w320.png) |
| Tanpa kandidat | [gambar](../coverage/samyoga-g6b6/after-no-chair-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-no-chair-w390.png) | [gambar](../coverage/samyoga-g6b6/after-no-chair-w320.png) |
| Belum spesifik | [gambar](../coverage/samyoga-g6b6/after-unspecified-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-unspecified-w390.png) | [gambar](../coverage/samyoga-g6b6/after-unspecified-w320.png) |
| Caution/review | [gambar](../coverage/samyoga-g6b6/after-caution-review-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-caution-review-w390.png) | [gambar](../coverage/samyoga-g6b6/after-caution-review-w320.png) |
| Bukti profil-evidence | [gambar](../coverage/samyoga-g6b6/after-management-evidence-w1440.png) | [gambar](../coverage/samyoga-g6b6/after-management-evidence-w390.png) | [gambar](../coverage/samyoga-g6b6/after-management-evidence-w320.png) |
| Production OFF | [gambar](../coverage/samyoga-g6b6/production-public-off-w1440.png) | [gambar](../coverage/samyoga-g6b6/production-public-off-w390.png) | [gambar](../coverage/samyoga-g6b6/production-public-off-w320.png) |

Indeks final: [development](../coverage/samyoga-g6b6/after-screenshots.json), [production](../coverage/samyoga-g6b6/production-screenshots.json).

**Hasil baca:** 1440 px memberi dua kolom; 320/390 px satu kolom tanpa overflow horizontal, termasuk label panjang dan evidence terbuka. Kartu panjang tetap perlu scroll vertikal, terutama pada 320 px. Posisi/kandidat kini lebih cepat terlihat; paragraf master tidak dipotong. Disclosure keyboard Enter/Space, reset, dan rincian pasangan lulus.

Screenshot diinspeksi visual untuk kandidat mobile, belum spesifik 320, evidence desktop dan kartu Manajemen. Ini emulasi viewport Chrome, bukan klaim uji perangkat mobile fisik.

## 6. Pengujian final

| Pemeriksaan | Hasil |
| --- | --- |
| Seluruh unit/regresi Samyoga + Otonan | **302/302 lulus**, tanpa fail/skip |
| Tambahan G6B.6 | 4 tes audit fungsional + 2 tes presentasi UI; 296 baseline tetap lulus |
| Kondisi fungsional yang diminta | **11/11 ditemukan secara valid** melalui 9 kelompok input |
| Referensi support profil | **236** dicek terhadap sumber, dimensi dan semantic status |
| Konsistensi keluaran sebelum/sesudah | SHA-256 JSON identik |
| TypeScript noEmit | Lulus |
| ESLint 5 file terkait | Lulus |
| Production build, flag eksperimen 1 | Lulus, Next.js 16.1.6 Turbopack |
| Development ON | Anggota 3/4/5/6, kandidat nol/tunggal/jamak, caution/disputed, label panjang: lulus |
| Browser 320/390/1440 | Tanpa overflow; membuka evidence tidak meregangkan kartu tetangga |
| Production OFF | HTTP 200, anggota 3/6, flag=1 dan query positions=1: panel tetap tidak tersedia |
| Kesetaraan Otonan di browser Los Angeles | Nama/karakter Tiwa-tiwa identik, reset lulus |
| Privasi alur Samyoga pada harness | 0 request berisi tanggal/label uji yang teramati; tidak ada transport/persistence runtime baru |
| Exception browser | 0 uncaught exception pada development/production |
| Engine dan approval protected | Tetap identik, registry evidence/rules 0/0 dan frozen |
| Git diff/whitespace | Lulus |

### Batas pengujian dan pesan konsol existing

Harness memblokir HTTPS eksternal selain host font statis existing `fonts.googleapis.com/fonts.gstatic.com`, agar visual tetap memakai font situs. Firebase global yang sudah ada mencoba bootstrap/analytics dan mengeluarkan warning serta Failed to fetch karena sengaja diblokir. Sesudah navigasi kontrol ke Ramalan Otonan, ada pula warning ukuran Recharts dan transport Firestore existing.

Karena itu laporan **tidak mengklaim nol console error/warning**. Tidak ada exception alur rekomendasi atau error baru dari komponennya yang ditemukan. Indikator “1 Issue” pada beberapa screenshot development berasal dari bootstrap yang diblokir tersebut; tidak ditutup atau disembunyikan demi bukti visual. Tidak mengubah Firebase, chart Otonan, telemetry global atau deployment.

Pesan tersebut tidak menahan perhitungan Samyoga yang diuji. Saat demo manual, gunakan environment aplikasi normal; jangan menganggap hasil harness ini validasi seluruh layanan eksternal. Nol request log dalam harness bukan bukti logging Otonan/Firebase global telah dihapus.

## 7. File terdampak, Git akhir dan isolasi

Tiga file untracked existing dimodifikasi:
1. `components/samyoga-group/SamyogaGroupPositionExperiment.tsx` — pemisahan kontribusi/kandidat, penempatan label, status Indonesia, evidence per profil, align kartu.
2. `tests/samyoga-position-experiment-ui.test.mjs` — dua regression UI tambahan.
3. `tests/fixtures/samyoga-position-browser-smoke.mjs` — screenshot eksplisit lokal, pemeriksaan tinggi kartu/console dan font existing untuk audit.

Tiga file baru:
4. `tests/fixtures/samyoga-member-positions-review.mjs` — menghitung kelompok audit melalui engine aktual; ekspor JSON hanya lewat flag eksplisit ke coverage.
5. `tests/samyoga-member-positions-review.test.mjs` — empat tes review.
6. `docs/samyoga-member-positions-review-g6b6.md` — laporan ini.

PNG/JSON audit berada di coverage yang ignored; tidak ditambahkan ke source/dependency, tidak diunggah dan tidak disimpan oleh aplikasi secara otomatis.

Git akhir: **4 tracked modified, 33 untracked, staged kosong**. Branch/HEAD tetap. Seluruh 108 file tracked sama dengan awal sesi; perubahan tracked yang tampak merupakan pekerjaan sebelumnya. Tidak ada commit, push, merge, reset, clean atau switch branch.

Gate tetap default OFF dan produksi publik OFF. Query, localStorage atau input anggota tidak menjadi approval; resolver/WeakSet serta registry produksi tidak berubah. Tidak ada dependency, storage/network aplikasi, telemetry atau algoritma baru.

## 8. Cara reproduksi dan kesiapan demo

Perintah dari worktree Samyoga:

```powershell
node --test tests/samyoga-*.test.mjs tests/otonan-palintangan.test.mjs
npx.cmd tsc --noEmit --incremental false
npm.cmd run build
node tests/fixtures/samyoga-member-positions-review.mjs --output coverage/samyoga-g6b6/recommendations-after.json
node tests/fixtures/samyoga-position-browser-smoke.mjs development --audit-dir coverage/samyoga-g6b6 --audit-label after
node tests/fixtures/samyoga-position-browser-smoke.mjs production --audit-dir coverage/samyoga-g6b6 --audit-label production
```

Demo internal:

```powershell
$env:SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT = "1"
npm.cmd run dev -- --port 3020
```

Buka `http://localhost:3020/pawongan-sinergi/kelompok`. Gunakan input uji pada tabel, jam 12:00 dan label bebas. Tunjukkan satu profil, beberapa kontribusi, kandidat tunggal/jamak, lalu kasus belum spesifik. Buka evidence untuk menelusuri frasa master; akhiri dengan Analisis Ulang untuk memperlihatkan reset.

**Tidak ada penghalang fungsional pada alur Samyoga yang diuji.** Batas demo tetap: simbolis/eksperimental, bukan validitas kompetensi; sumber/review pending; Koordinator dan Wakil belum tersedia; comparator UNKNOWN tidak memilih Ketua. Evaluasi dosen dan pengujian perangkat fisik belum diklaim selesai.

**READY FOR PRODUCT DEMO — internal; bukan izin aktivasi produksi.**
