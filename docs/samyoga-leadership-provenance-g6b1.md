# Matriks provenance 12 evidence kepemimpinan — G6B.1

**READY FOR HUMAN DOMAIN REVIEW — paket pembanding terbatas, bukan approval.** Ada teks/locator yang dapat dibawa ke ahli untuk menguji, merevisi usulan, atau menolak atribusi. **Tidak satu pun kutipan master utuh berhasil dibuktikan berasal dari edisi tertentu.** Evidence produksi dan comparator tetap HOLD.

Audit teknis 2 November 2026 (WITA), bukan tanggal review budaya. Worktree `C:\Project-Trispark\jodoh_bali_samyoga`, branch `feat/samyoga-group`, HEAD `7d8b550ac81726128491bd3375804daeb179d45e`. Tidak ada data kelahiran individu yang dipakai untuk pencarian.

## Baseline Git dan sumber internal

Awal: working tree bersih; staged, unstaged dan untracked kosong. Commit `7d8b550` memasukkan tepat tiga dokumen G6A.9. Ancestor G6A.7-R1 `c3eae7f`, G6A.8/R1 `05d9a92`, UI-R1/revisi `16335da` tersedia. Milestone ini tidak membuat checkpoint.

Bahan internal: [katalog G6A.4](samyoga-position-evidence-catalog.md), [dimensi](samyoga-position-dimensions.md), [ruleset](samyoga-position-ruleset-review.md), [keputusan G6A.4](samyoga-position-domain-decisions.md), [worksheet G6A.5](samyoga-position-source-verification.md), [review G6A.5](samyoga-position-g6a5-review.md), [provenance G6A.6](samyoga-position-provenance-g6a6.md), [Lembar A](samyoga-position-cultural-decisions-g6a6.md), [Lembar B](samyoga-position-product-decisions-g6a6.md), [kontrak G6A.7](samyoga-chair-contract-g6a7.md), [review G6A.8-R1](samyoga-chair-review-g6a8r1.md), dan [audit G6A.9](samyoga-otonan-leadership-comparator-g6a9.md). Dokumen historis tidak ditimpa atau dipakai untuk mengesahkan dirinya sendiri.

Kode aktual [resolver/registry evidence](../lib/samyoga-position-evidence.ts#L63) dan [rule produksi](../lib/samyoga-position-recommendation.ts#L67) tetap kosong/frozen. Resolver menuntut exact identity/quote, provenance verified/sourceId dan review evidence; evaluator menuntut approval budaya serta produk pada rule. `productApprovalStatus` kandidat berada pada katalog/worksheet; bukan field approval terpisah pada interface evidence runtime. Perbedaan lapisan ini tidak diubah.

## Arti status penelusuran

| Status audit | Makna terbatas |
| --- | --- |
| SOURCE LOCATED — TEXT MATCHED | Kutipan utuh ditemukan persis pada publikasi yang benar dan locator dapat diulang; tetap tidak otomatis membuktikan rantai penyalinan atau validasi dimensi |
| SOURCE LOCATED — TEXT DIFFERS | Entri indikator pada karya pembanding ditemukan, redaksinya berbeda; **bukan** pernyataan karya itu sumber asal master atau master pasti salah |
| SECONDARY SOURCE ONLY | Pembanding yang paling dekat hanya sekunder; belum ada sumber asal/primer yang dapat mengesahkan kalimat |
| SOURCE NOT FOUND | Sumber asal/eksemplar yang diperlukan belum ditemukan dalam cakupan penelusuran ini |
| SOURCE INACCESSIBLE | Ada lead, isi tidak berhasil diperiksa; cuplikan pencarian tidak dipromosikan menjadi bukti |

Empat pertanyaan berbeda: cocok dengan master internal, cocok dengan teks publikasi, benar berasal/diadaptasi dari publikasi itu, dan layak dipetakan secara budaya. Jawaban pertama ya tidak membuktikan tiga lainnya. Dugaan parafrasa dipisahkan dari kutipan langsung atau adaptasi yang terbukti.

## Ringkasan matriks

| Evidence | Identitas | Usulan | Ref pembanding | Hasil audit sumber |
| --- | --- | --- | --- | --- |
| C-DIR-01 | Sri / asatawara | directing / support | WD, BB-A | **SOURCE LOCATED — TEXT DIFFERS** |
| C-DIR-02 | Raja / dasawara | directing / support | WD, BB-D | **SOURCE LOCATED — TEXT DIFFERS** |
| C-DIR-03 | Sinta / wuku | directing / support | PJ | **SECONDARY SOURCE ONLY** |
| C-DIR-04 | Sinta / wuku | directing / caution | PJ | **SECONDARY SOURCE ONLY** |
| C-COMM-01 | Menga / dwiwara | communicating / support | WD, BB-2 | **SOURCE LOCATED — TEXT DIFFERS** |
| C-COMM-02 | Kliwon / pancawara | communicating / support | WD, BB-P | **SOURCE LOCATED — TEXT DIFFERS** |
| C-COMM-03 | Tiwa-tiwa / lintang | communicating / support | SH | **SECONDARY SOURCE ONLY** |
| C-COMM-04 | Begoong / lintang | communicating / caution | SH | **SECONDARY SOURCE ONLY** |
| C-COLL-01 | Redite / saptawara | collaborating / support | WD, BB-S | **SOURCE LOCATED — TEXT DIFFERS** |
| C-COLL-02 | Manusa / dasawara | collaborating / support | WD, BB-D | **SOURCE LOCATED — TEXT DIFFERS** |
| C-COLL-03 | Pahang / wuku | collaborating / support | PJ | **SECONDARY SOURCE ONLY** |
| C-COLL-04 | Langkir / wuku | collaborating / caution | PJ | **SECONDARY SOURCE ONLY** |

Agregat:

- **12/12** identity/record/field/kutipan cocok dengan master dan Lembar A.
- **6** entry buku terlokasi dengan teks berbeda; **6** masih secondary source only untuk atribusi yang dibutuhkan.
- **0** SOURCE LOCATED — TEXT MATCHED untuk **kalimat master utuh pada sumber asal**.
- **12/12 sumber asal kalimat lengkap belum terbukti**, termasuk enam yang sudah punya entry pembanding buku. Jangan menyebutnya hanya enam yang tanpa sumber.
- **0/12 provenance verified**, 12 missing; seluruh review budaya/approval produk pending; sourceId/sourcePage null.
- Sumber yang dibaca: 1 buku OCR + 7 halaman sekunder + 2 metadata/konteks; lihat [register dan hambatan akses](samyoga-leadership-source-register-g6b1.md).

Tidak ada hitungan kecocokan frasa yang disajikan sebagai confidence, validitas budaya atau kekuatan memimpin.

## Perbandingan per evidence

Kutipan blockquote berasal dari **master repository**. Teks sumber eksternal hanya cuplikan pendek dengan locator; tidak mengklaim menyalin paragraf utuh atau menerjemahkan secara ahli. Ref bibliografis lengkap ada di register.

### C-DIR-01

- Unsur: `wewaran`; siklus `asatawara`; nilai `Sri`; record `wewaran:asatawara:1`; field `karakter`.
- Lokasi master: [lib/data.ts:437](../lib/data.ts#L437); dimensi/polarity usulan: `directing/support`.

> Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `WD`, `BB-A` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: WD §128 Asthawara/Shri: cetak 70, viewer P:80; BB-A entri Sri.
- Teks sumber pendek: WD: “tan kirang pangan kinum.” BB-A: “makmur dan pengatur”.
- Konteks: WD membahas kecukupan; BB-A memberi padanan pengaturan.
- Perbandingan/chain: Kerapian bekerja dan seluruh klausa berjiwa pemimpin belum terlacak. Tidak ada bukti master merupakan kutipan langsung, terjemahan atau saduran resmi salah satu sumber.
- Analisis pemetaan: directing tetap interpretasi produk; mengatur juga bisa keteraturan pribadi. Kalimat sama dengan C-MAN-02 bukan bukti tambahan.
- Status audit: **SOURCE LOCATED — TEXT DIFFERS**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Di edisi mana frasa mengatur, rapi dan memimpin muncul bersama? Apakah pengatur membahas hari atau orang, dan apakah directing/managing tepat?

### C-DIR-02

- Unsur: `wewaran`; siklus `dasawara`; nilai `Raja`; record `wewaran:dasawara:8`; field `karakter`.
- Lokasi master: [lib/data.ts:467](../lib/data.ts#L467); dimensi/polarity usulan: `directing/support`.

> Berjiwa besar, kharismatik, dan berbakat mengatur orang.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `WD`, `BB-D` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: WD §128 Dasawara/Raja: cetak 72, viewer P:82; BB-D nomor 8.
- Teks sumber pendek: WD: “Wikan tur seneng mapidabdab.” BB-D: “Pemimpin”.
- Konteks: Padanan pengaturan perlu terjemahan ahli; karisma belum terbukti.
- Perbandingan/chain: Identitas Raja terlokasi, tetapi berjiwa besar, kharismatik dan objek mengatur orang belum terbukti pada kalimat utuh. Tidak dapat menetapkan sumber atau bentuk saduran hanya dari kesamaan tema.
- Analisis pemetaan: Karisma/otoritas bukan efektivitas kepemimpinan. Kandidat prioritas tekstual karena entry terlokasi, bukan karena lebih kuat atau lebih positif.
- Status audit: **SOURCE LOCATED — TEXT DIFFERS**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apa terjemahan tepat mapidabdab di konteks ini? Adakah dasar menambahkan berjiwa besar, karisma dan objek orang?

### C-DIR-03

- Unsur: `wuku`; siklus `null`; nilai `Sinta`; record `wuku:1`; field `sifat_umum`.
- Lokasi master: [lib/data.ts:9](../lib/data.ts#L9); dimensi/polarity usulan: `directing/support`.

> Tegas, agak kaku, berjiwa pemimpin.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `PJ` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: PJ heading wuku SINTA, paragraf sesudah lumbung.
- Teks sumber pendek: PJ: “Perintahnya keras”.
- Konteks: Deskripsi sekunder juga menyebut perlindungan dan kelembutan; bukan kalimat master.
- Perbandingan/chain: Tidak ditemukan kalimat master lengkap pada sumber asal. Ada tema memberi perintah tetapi tidak membuktikan tegas/agak kaku/berjiwa pemimpin sebagai kutipan atau saduran yang dapat diatribusikan.
- Analisis pemetaan: Perintah keras tidak otomatis kecenderungan memimpin yang legitim/partisipatif; makna directing dan konteks kaku memerlukan review.
- Status audit: **SECONDARY SOURCE ONLY**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apa naskah/buku/edisi asal Sinta? Apakah menyederhanakan uraian perintah menjadi berjiwa pemimpin dibenarkan?

### C-DIR-04

- Unsur: `wuku`; siklus `null`; nilai `Sinta`; record `wuku:1`; field `kelemahan`.
- Lokasi master: [lib/data.ts:11](../lib/data.ts#L11); dimensi/polarity usulan: `directing/caution`.

> Keras kepala, sulit menerima kritik.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `PJ` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: PJ heading wuku SINTA, dua paragraf sifat/perintah.
- Teks sumber pendek: PJ: “lembut hati”.
- Konteks: Sumber sekunder tidak hanya mengandung kekerasan; konteksnya campuran.
- Perbandingan/chain: Sulit menerima kritik belum terlacak. Kutipan ini bukan lawan kata yang dapat menggugurkan master; variasi konteks harus ditinjau, bukan diputus otomatis salah/benar.
- Analisis pemetaan: Caution directing belum disahkan; satu record dengan DIR03 tidak menjadi penalti numerik atau dua observasi independen.
- Status audit: **SECONDARY SOURCE ONLY**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apakah sumber asal memang menyebut resistensi kritik? Jika hanya keteguhan/keras, kapan itu layak menjadi caution?

### C-COMM-01

- Unsur: `wewaran`; siklus `dwiwara`; nilai `Menga`; record `wewaran:dwiwara:1`; field `karakter`.
- Lokasi master: [lib/data.ts:347](../lib/data.ts#L347); dimensi/polarity usulan: `communicating/support`.

> Terbuka, komunikatif, dan mudah menerima masukan dari luar.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `WD`, `BB-2` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: WD §128 Dwiwara/Menga: cetak 66, viewer P:76; BB-2 nomor 1.
- Teks sumber pendek: WD: “Meleleh.” BB-2: “mudah menerima kritik”.
- Konteks: BB-2 mencampur kegiatan hari dengan sifat kelahiran; pisahkan keduanya.
- Perbandingan/chain: Ada padanan keterbukaan/menerima kritik pada sumber sekunder, tetapi kalimat utuh master belum ditemukan. Kata komunikatif dan dari luar tidak dibuktikan sebagai kutipan langsung atau terjemahan WD.
- Analisis pemetaan: Keterbukaan dapat menjadi bahan communicating, tetapi tidak membuktikan kemampuan mendengar/koordinasi kelompok. Satu makna kamus tidak cukup untuk leadership.
- Status audit: **SOURCE LOCATED — TEXT DIFFERS**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apakah perluasan terbuka menjadi komunikatif dan menerima masukan disokong sumber asal? Mana tafsir kegiatan hari dan mana watak kelahiran?

### C-COMM-02

- Unsur: `pancawara`; siklus `null`; nilai `Kliwon`; record `pancawara:5`; field `karakter`.
- Lokasi master: [lib/data.ts:370](../lib/data.ts#L370); dimensi/polarity usulan: `communicating/support`.

> Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `WD`, `BB-P` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: WD §128 Pancawara/Keliwon: cetak 68–69, viewer P:78–79; BB-P tabel simbolisasi nomor 5.
- Teks sumber pendek: WD: “Seneng mapawangun.” BB-P: “Budi”.
- Konteks: WD konteks pembangunan/ritual, bukan klausa kefasihan master.
- Perbandingan/chain: Pemaaf, pandai berbicara dan spiritualitas tinggi belum ditemukan sebagai kalimat sumber. Tabel simbolisasi BB-P tidak membuktikan tiga sifat tersebut. Atribusi suatu indikator saja bukan provenance kutipan.
- Analisis pemetaan: Kefasihan/spiritualitas tidak otomatis komunikasi kelompok. Prioritas mencari sumber, bukan memperkuat tag dari satu label simbol.
- Status audit: **SOURCE LOCATED — TEXT DIFFERS**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Dari mana tiga sifat Kliwon berasal? Apakah ada konteks yang menghubungkan kefasihan dengan pertukaran pesan, bukan sekadar kefasihan tutur?

### C-COMM-03

- Unsur: `lintang`; siklus `null`; nilai `Tiwa-tiwa`; record `lintang:Buda:Kliwon`; field `penjelasan`.
- Lokasi master: [lib/data.ts:549](../lib/data.ts#L549); dimensi/polarity usulan: `communicating/support`.

> Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `SH` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: SH Nama-nama Lintang nomor 4 BUDA–KLIWON/Tiwa-tiwa; Refrensi.
- Teks sumber pendek: SH: “pandai menyusun kata-kata”; “telinganya amat tipis”.
- Konteks: Ada konteks mengarang dan mudah tersinggung; rujukan kalender asal belum dibaca.
- Perbandingan/chain: Padanan semantik cukup dekat untuk diajukan sebagai hipotesis parafrasa, bukan bukti master menyadur SH atau kalender tertentu. Tidak exact-match kalimat utuh dan rantai independensi belum diketahui.
- Analisis pemetaan: Ekspresi sastra tidak sama dengan komunikasi organisasi. Sensitivitas jangan hilang ketika memilih support. Butuh konfirmasi identitas/varian dan edisi kalender.
- Status audit: **SECONDARY SOURCE ONLY**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Bisakah reviewer menunjukkan kalender/naskah asal entry Buda–Kliwon, menyelaraskan varian Tiwa/Atiwa, dan membatasi makna komunikasi terhadap mengarang?

### C-COMM-04

- Unsur: `lintang`; siklus `null`; nilai `Begoong`; record `lintang:Saniscara:Umanis`; field `penjelasan`.
- Lokasi master: [lib/data.ts:797](../lib/data.ts#L797); dimensi/polarity usulan: `communicating/caution`.

> Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `SH` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: SH Nama-nama Lintang nomor 35 SANISCARA–UMANIS/Bgoong; Refrensi.
- Teks sumber pendek: SH: “tajam bicaranya”; “suka campur urusan orang lain”.
- Konteks: Tutur tajam dibahas bersama keadaan marah dan konteks lain.
- Perbandingan/chain: Konteks keterampilan/tutur berpadanan sebagian; berani dalam bertindak belum terkonfirmasi. Nama Bgoong/Begoong harus diselaraskan dari sumber asal; tidak diasumsikan sama hanya karena mirip.
- Analisis pemetaan: Caution communicating hanya hipotesis situasional. Jangan memberi label ketidakmampuan atau menghilangkan konteks marah.
- Status audit: **SECONDARY SOURCE ONLY**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apakah entry dan nama varian benar identik? Apakah ketajaman tutur hanya saat marah, dan apakah caution lintas situasi dibenarkan?

### C-COLL-01

- Unsur: `saptawara`; siklus `null`; nilai `Redite`; record `saptawara:1`; field `karakter`.
- Lokasi master: [lib/data.ts:427](../lib/data.ts#L427); dimensi/polarity usulan: `collaborating/support`.

> Berjiwa sosial tinggi, berwibawa, dan senang menolong.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `WD`, `BB-S` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: WD §128 Saptawara/Radite: cetak 69, viewer P:79; BB-S entri Redite.
- Teks sumber pendek: WD: “seneng medhana punia.”
- Konteks: Ada konteks derma; belum membuktikan timbal balik kerja kelompok.
- Perbandingan/chain: Aspek menolong berpadanan terbatas, tetapi kalimat master utuh dan wibawa belum terlacak. BB-S memakai simbol Surya, bukan kalimat master. Tidak ada bukti hubungan penyalinan.
- Analisis pemetaan: Prososial bukan kolaborasi profesional/berbagi tugas. Alias Sapta pada Wewaran tidak menjadi bukti kedua.
- Status audit: **SOURCE LOCATED — TEXT DIFFERS**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apa batas makna derma terhadap collaborating? Sumber mana membuktikan wibawa dan sosial pada kalimat lengkap Redite?

### C-COLL-02

- Unsur: `wewaran`; siklus `dasawara`; nilai `Manusa`; record `wewaran:dasawara:7`; field `karakter`.
- Lokasi master: [lib/data.ts:466](../lib/data.ts#L466); dimensi/polarity usulan: `collaborating/support`.

> Suka bersosialisasi dan sangat mementingkan hubungan manusia.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `WD`, `BB-D` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: WD §128 Dasawara/Manusa: cetak 72, viewer P:82; BB-D nomor 7.
- Teks sumber pendek: WD: “Sering nandang sedih.” BB-D: “Sosial”.
- Konteks: Arah deskripsi berbeda; label/kolom OCR perlu cek scan.
- Perbandingan/chain: Belum dapat menentukan apakah perbedaan berasal dari edisi, tradisi atau pembacaan. Tidak menganggap sosial sebagai terjemahan otomatis teks WD, juga tidak menyatakan master pasti salah.
- Analisis pemetaan: Bersosialisasi tidak membuktikan kolaborasi timbal balik. Perlu rekonsiliasi sumber sebelum pemetaan.
- Status audit: **SOURCE LOCATED — TEXT DIFFERS**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Mengapa WD dan BB-D berbeda tema pada Manusa? Dapatkah ahli memastikan kolom/edisi lalu menentukan sumber yang sah tanpa memilih versi paling positif?

### C-COLL-03

- Unsur: `wuku`; siklus `null`; nilai `Pahang`; record `wuku:16`; field `kelebihan`.
- Lokasi master: [lib/data.ts:145](../lib/data.ts#L145); dimensi/polarity usulan: `collaborating/support`.

> Pendengar yang baik, loyal.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `PJ` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: PJ heading wuku PAHANG, paragraf Tabiat dan sifatnya.
- Teks sumber pendek: PJ: “Garang ucapannya”.
- Konteks: Narasi sekunder menonjolkan tutur dan perlindungan, bukan kemampuan mendengar.
- Perbandingan/chain: Pendengar yang baik dan loyal belum berhasil ditelusuri. Ini gap sumber, bukan bukti bahwa setiap tradisi Pahang menyangkalnya; tidak ada atribusi saduran yang dapat dibuktikan.
- Analisis pemetaan: Perlindungan/banyak bicara tidak dapat diterjemahkan otomatis sebagai menyimak/loyal/kolaborasi. Perlu verifikasi sumber dahulu.
- Status audit: **SECONDARY SOURCE ONLY**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Di mana sifat mendengar dan loyal tertulis pada sumber Pahang? Apakah itu tambahan tafsir internal; apa konteks loyalitasnya?

### C-COLL-04

- Unsur: `wuku`; siklus `null`; nilai `Langkir`; record `wuku:13`; field `kelemahan`.
- Lokasi master: [lib/data.ts:119](../lib/data.ts#L119); dimensi/polarity usulan: `collaborating/caution`.

> Keras hati, sulit diajak kompromi.

- Sumber yang diklaim repository: **hanya bibliografi global About, tanpa atribusi kalimat ini**; sourceId/sourcePage tetap null. Referensi pembanding penelusuran ini: `PJ` pada [register sumber](samyoga-leadership-source-register-g6b1.md). Pembanding bukan klaim sumber asal.
- Locator: PJ heading wuku LANGKIR, paragraf Tabiat dan sifatnya.
- Teks sumber pendek: PJ: “keras kepala”.
- Konteks: Ada tema keteguhan/kekerasan, belum frasa kompromi master.
- Perbandingan/chain: Sebagian tema caution berpadanan; sulit diajak kompromi belum eksplisit pada sumber ini. Tidak ada bukti kalimat master mengutip atau menyadur sumber tertentu.
- Analisis pemetaan: Keteguhan prinsip tidak otomatis rendah kemampuan bekerja sama. Caution tidak menjadi vonis pribadi atau nilai minus.
- Status audit: **SECONDARY SOURCE ONLY**. Exact-match kalimat utuh terhadap sumber asal: **belum terbukti**. Status katalog dipertahankan: provenance `missing`, cultural review `pending`, product approval `pending`.
- Pertanyaan ahli: Apakah sumber asli menyebut kompromi atau itu inferensi produk? Pada situasi apa keteguhan layak/tidak layak menjadi caution?

## Temuan lintas sumber yang perlu diuji manusia

1. **Kemungkinan penyederhanaan/penambahan makna:** beberapa kata master tidak mempunyai dasar tekstual pada pembanding yang dibaca. Ini temuan gap atribusi, bukan bukti siapa menyadur siapa. Perlu riwayat kurasi atau sumber asal yang dinyatakan penyusun master.
2. **Variasi Lintang pada WD §152:** urutan Buda–Keliwon (cetak 83 / viewer P:93) memakai nama **Atiwa-tiwa**, Saniscara–Umanis (cetak 84 / P:94) **Begong**. Teksnya tidak sama dengan SH. Identitas varian dan kolom OCR belum diautentikasi; jangan menggabungkan makna dari dua versi atau mengklaim keduanya pasti indikator berbeda/sama.
3. **Ketergantungan sumber:** lima halaman Babad berasal dari satu penerbit web; SH mengacu kalender yang belum dibaca; PJ kompilasi tanpa locator. Kecocokan kata di banyak situs tidak menjadi saksi independen atau asal master yang terbukti.
4. **Konflik interpretasi belum diputus:** jangan memilih sumber paling positif untuk Manusa atau mengurangi konteks sensitivitas/marah pada Lintang. Master dipertahankan, tidak diperbaiki otomatis.
5. **Dimensi adalah konstruksi produk:** memberi perintah, fasih, derma, sosial atau loyal tidak otomatis membuktikan directing/communicating/collaborating dalam organisasi. Relasi kekuatan dua kandidat sama sekali belum tersedia.

## Penjelasan 214 vs 212 tes

[UI-R1](samyoga-pair-ui-r1.md#revisi-tampilan--2-november-2026) mencatat revisi penghapusan panel tradisional dan penyesuaian tes di awal dokumen, tetapi bagian historis di bawahnya masih menyebut sembilan tes/214 total. File [tes presentasi aktual](../tests/samyoga-pair-presentation.test.mjs#L36) memuat **7** test() terdaftar, semuanya ditemukan dan lulus.

| Pemeriksaan yang direproduksi sekarang | Hasil |
| --- | --- |
| Seluruh 10 file tests/samyoga-*.test.mjs | **212/212 lulus**, fail/cancelled/skipped masing-masing 0 |
| Sembilan file yang sama tanpa samyoga-pair-presentation.test.mjs | **205/205 lulus**, fail/cancelled/skipped masing-masing 0 |
| Kontribusi tes presentasi saat ini | 7, sehingga 205 + 7 = 212 |
| Klaim historis UI-R1 | 9 tes presentasi, sehingga 205 + 9 = 214; bukan hasil run ulang atas versi lama |
| package.json / package-lock.json, 05d9a92 → HEAD | Tidak berubah; script discovery tetap node --test tests/samyoga-*.test.mjs |
| Riwayat file presentasi | Pertama masuk commit 16335da sudah berisi 7 tes; tidak ada blob sembilan tes pada history branch yang diperiksa |

Kesimpulan: selisih didukung perubahan cakupan tes presentasi setelah penghapusan fitur disclosure, **bukan bukti dua tes gagal atau discovery diam-diam melewatkan tes**. Nama persis dua kasus lama dan diff 9→7 tidak dapat dibuktikan dari Git: versi sembilan tes hanya tercatat di laporan fase uncommitted. Jangan mengarang nama tes yang dihapus atau mengklaim telah menjalankan versi lama. Tidak mengubah laporan historis untuk menutupi selisih.

## Validasi dan Git akhir

Pemeriksaan mekanis mencocokkan 12 identity/kutipan terhadap master dan Lembar A, memastikan status missing/pending/null tetap, registry/rule produksi kosong/frozen, referensi file valid dan tidak ada perubahan pada seluruh **102 file tracked baseline** (SHA-256).

Hanya tiga dokumen G6B.1 baru; staged/unstaged tracked tetap kosong. Branch dan HEAD tidak berubah. Tidak ada runtime, tes existing, master, evaluator, sandbox, UI, dependency atau konfigurasi diubah; tidak ada commit/push/merge/reset/clean/switch branch. TypeScript/lint/build tidak dijalankan ulang karena scope dokumentasi; tidak ada klaim build baru.

[Antrean review manusia](samyoga-leadership-human-review-g6b1.md) menjelaskan prioritas, pertanyaan dan keputusan pending. Kesiapan review terbatas tidak berarti seluruh 12 evidence siap disetujui. **Aktivasi produksi dan comparator tetap HOLD.**

