# Audit domain pembanding kepemimpinan Otonan — G6A.9

Keputusan: **HOLD — NO DEFENSIBLE COMPARATOR** pada bahan yang berhasil diperiksa, bukan klaim bahwa aturan seperti itu tidak mungkin ada di semua tradisi. Tanggal audit teknis: 2 November 2026 (WITA), bukan tanggal review ahli. Dokumen ini rancangan dan audit; tidak mengaktifkan comparator atau rekomendasi produksi.

## Baseline dan batas audit

Worktree `C:\Project-Trispark\jodoh_bali_samyoga`, branch `feat/samyoga-group`, HEAD `16335da010635b85624d006e4e5f090a490e09f2`. Awal audit bersih: staged, unstaged, dan untracked kosong. Checkpoint aktual: G6A.7-R1 `c3eae7f`; G6A.8 beserta R1 `05d9a92`; UI-R1 dan penyempurnaan tampilan `16335da`. Ini hasil Git, bukan asumsi dari saran checkpoint lama.

Audit membaca kode snapshot/resolver/evaluator, katalog, dimensi, ruleset, provenance, Lembar A/B, kontrak/log G6A.7, prototipe dan review G6A.8-R1. Hanya tiga dokumen G6A.9 baru yang diizinkan berubah. Dokumen historis dipertahankan termasuk catatan gap yang sudah ditangani pada checkpoint berikutnya.

## Fakta implementasi saat ini

| Area | Perilaku aktual dan locator | Implikasi |
| --- | --- | --- |
| Snapshot | [tipe snapshot](../lib/samyoga-calendar-snapshot.ts#L42), [createMemberSnapshot](../lib/samyoga-calendar-snapshot.ts#L164), [API kelompok](../lib/samyoga-calendar-snapshot.ts#L322): indikator, urip, identitas record/field dan teks master | Tidak mempunyai skala intensitas, prioritas kepemimpinan atau relasi kesetaraan. Urip bukan skor pemimpin. |
| Alias dan dependensi | [WEWARAN_MASTER](../lib/samyoga-calendar-snapshot.ts#L76): Sapta/Panca berasal dari master yang sama; Lintang memakai kombinasi Sapta/Panca | Banyak entri bukan banyak pengamatan independen. Nama siklus `asatawara` dipertahankan sesuai kode. |
| Resolver evidence | [registry](../lib/samyoga-position-evidence.ts#L63), [resolver](../lib/samyoga-position-evidence.ts#L85): exact identity + kutipan, provenance verified/sourceId, review budaya approved; ID duplikat tidak aktif; hasil terdaftar dalam proses | Registry produksi kosong/frozen. String active/approved dari luar tidak menggantikan proses resolver. |
| Evaluator rule | [approval dan penggabungan dimensi](../lib/samyoga-position-recommendation.ts#L84): rule budaya dan produk approved, support/caution berupa himpunan dimensi, bukan jumlah/intensitas | Daftar rule produksi [kosong/frozen](../lib/samyoga-position-recommendation.ts#L67). Semua tiga dimensi Leader masih proposal. |
| Konflik | [global conflict](../lib/samyoga-position-recommendation.ts#L129): support+caution yang mengenai rule lengkap menahan seluruh rekomendasi | Comparator tidak boleh memutihkan konflik menjadi kekuatan rendah. Perubahan kebijakan konflik di luar scope. |
| Produk | [dimensi](samyoga-position-dimensions.md), [Lembar B](samyoga-position-product-decisions-g6a6.md): Leader = directing AND collaborating AND communicating masih hipotesis | Eligibility biner tidak mengukur perbedaan kekuatan di antara orang yang lolos. Urutan taxonomy hanya penyajian, bukan ranking. |
| Alokasi sandbox | [lima status, validasi graf](../tests/fixtures/samyoga-chair-prototype.mjs#L58), [review R1](samyoga-chair-review-g6a8r1.md) | Mengonsumsi relasi sintetis; tidak menemukan kekuatan dari teks kalender. Hasil tes bukan validasi budaya. |

## Sumber yang diperiksa dan batas pembuktian

Label R1–R5 di sini **locator riset dokumen**, bukan sourceId registry. Tidak ada approved sourceId baru. Tautan S1–S8 pada inventaris evidence merujuk penelusuran historis [G6A.6](samyoga-position-provenance-g6a6.md), bukan pengesahan ulang.

| Ref | Identitas dan akses nyata G6A.9 | Locator, konteks dan hasil terbatas | Yang belum terbukti |
| --- | --- | --- | --- |
| R1 | Sri Reshi Anandakusuma, [Wariga Dewasa melalui OCR scan](https://fliphtml5.com/cwzns/dclt/Wariga_Dewasa_/). Identitas/edisi scan belum dipastikan; prakata memuat 1979, tidak otomatis menetapkan edisi. | §5 Alahing Sasih, cetak 7 / viewer P:17, membahas prioritas unsur waktu; §128 Pawatekan Wewaran, cetak 66–72 / P:76–82, berisi deskripsi. Entri Raja pada akhir §128 bukan perbandingan dua pemimpin. | OCR/kolom dan terjemahan perlu cek scan oleh ahli. Prioritas padewasan tidak menjadi urutan kepemimpinan; tidak ditemukan aturan relatif leadership eksplisit dalam bagian yang diperiksa. |
| R2 | Kelian Kelir / Babad Bali, [Wuku](https://www.babadbali.com/pewarigaan/wuku.htm/index.html); artikel sekunder, tahun/edisi asal tidak tercantum pada halaman yang dibaca. | Paragraf pembuka memang menyatakan Wuku diprioritaskan atas Wewaran dalam tafsir sifat, kemudian menautkan padewasan. Klaim ini dicatat, bukan diabaikan. | Prioritas antarjenis interpretasi tidak menyatakan Wuku seseorang lebih kuat memimpin daripada indikator orang lain; belum ada aturan lintas pribadi/dimensi atau rujukan primer terlokasi. Perlu review konteks dan otoritas. |
| R3 | I Wayan Agus Eka Cahyadi dan Cok Alit Artawan, 2015, [Membaca Bahasa Rupa Ilustrasi Palelintangan…](https://jurnal.isi-dps.ac.id/index.php/segarawidya/article/download/214/128/526), Segara Widya 3(1), 444–451. | Penelitian primer deskriptif kualitatif terhadap ilustrasi dan informasi teks di Bale Kambang; abstrak dan konteks hlm. 444 diperiksa. | Tidak menguji kemampuan memimpin atau memberi ordinal comparator. Keberadaan penelitian tidak mengesahkan 12 kutipan master. |
| R4 | I Putu Satwika Putra, I Ketut Gede Darma Putra, I Nyoman Piarsa, 2014, [Aplikasi Peramalan Watak dan Perjodohan…](https://ojs.unud.ac.id/index.php/merpati/article/download/17909/11641), Merpati 2(3), 380–391. | Abstrak/metode aplikasi dan konteks pustaka diperiksa; objeknya perwatakan/perjodohan berbasis aplikasi. | Pengujian algoritma aplikasi bukan pembuktian empiris kepemimpinan; fuzzy/perjodohan tidak dapat dipindah menjadi kekuatan Leader. |
| R5 | [Hull History Centre, katalog U DGM](https://catalogue.hullhistorycentre.org.uk/files/u-dgm.pdf), hlm. 4/20. | U DGM/1/21: I Made Gambar, Watak Manusia Menurut Wuku, tanpa tahun; /1/22: Sri Reshi Anandakusuma, Wariga Dewasa, 1979. | Katalog membuktikan metadata koleksi, bukan isi atau kesamaan edisi dengan R1; bukan sumber aturan perbandingan. |

Pencarian tambahan memakai istilah Wariga/kepemimpinan/perbandingan/Wuku/Wewaran serta alah/hierarki. Hasil pencarian dipakai sebagai lead; cuplikan saja tidak mengesahkan sumber. Tidak ditemukan pembanding leadership yang dapat diverifikasi pada bahan yang diperiksa. Tidak ada klaim pencarian menyeluruh atas semua lontar/buku. Tidak ada data kelahiran pengguna yang dikirim dalam pencarian.

## Jawaban delapan pertanyaan domain

F = fakta implementasi; I = tafsir internal; E = informasi eksternal yang isi/keberadaannya berhasil diperiksa (bukan approval budaya); P = hipotesis produk; U = belum diketahui.

| Pertanyaan | F | I | E | P dan U / keputusan |
| --- | --- | --- | --- | --- |
| 1. Ada aturan membandingkan dua pemimpin? | Tidak ada comparator produksi; sandbox memakai relasi fixture. | Ada deskripsi pemimpin pada Sri/Raja/Sinta, tanpa operator lebih kuat. | R1/R3/R4 tidak membuktikan comparator tersebut; R2 memberi prioritas jenis tafsir. | P: membandingkan calon jabatan; U: aturan tradisional relatif yang sah. **Belum ditemukan.** |
| 2. Ada hierarki Wuku/Wewaran/Sapta/Panca/Lintang leadership? | Urutan record/urip bukan hierarki leadership. | Semua jenis menyumbang narasi berbeda. | R1 hierarki konteks waktu; R2 klaim prioritas Wuku atas Wewaran. | U: legitimasi memindahkan prioritas itu ke leadership dan posisi Lintang. Tidak boleh diasumsikan. |
| 3. Teks X lebih kuat daripada Y untuk memimpin? | Tidak ada field relasi tersebut. | Penyebutan mengatur/memimpin bukan X > Y. | Belum ditemukan teks eksplisit yang demikian dalam sumber yang diperiksa. | P: ordinal comparator perlu sumber langsung; U: dukungan budaya, bukan sekadar sinonim. |
| 4. Aspek berbeda sebanding? | Set support/caution tidak mempunyai intensitas. | Mengatur, merangkai kata, menolong/loyal adalah aspek berbeda. | R3 menyediakan konteks pembacaan, bukan skala bersama. | P: dimensi kualitatif mungkin diteliti; U: arti ordinal/equality. Saat ini UNKNOWN; INCOMPARABLE hanya jika dasar dan ketidakterurutannya dapat dinyatakan sah. |
| 5. Boleh memberi prioritas indikator? | Tidak ada priority rule kepemimpinan. | Tidak ada bobot yang disahkan. | R1/R2 tidak menetapkan prioritas lintas individu untuk jabatan. | P: aturan prioritas harus spesifik konteks dan disetujui; U: legitimasi budaya dan batasnya. Jangan buat default Wuku > semua. |
| 6. Sumber membandingkan individu atau mendeskripsikan? | Snapshot menyalin teks individu; sandbox terpisah. | Teks karakter simbolis, bukan hasil asesmen. | R1 membedakan waktu/deskripsi; R3 objek ilustrasi; R4 aplikasi perwatakan/perjodohan. | U: sumber yang menghubungkan dua profil dengan kekuatan relatif. Tidak infer dari deskripsi individual. |
| 7. Satu master berarti evidence independen? | Alias Sapta/Panca; Lintang berbasis kombinasi; dua field Sinta satu record. | DIR01 juga MAN02 memakai kalimat sama. | R5 metadata saja, tidak mengesahkan independensi asal narasi. | P: deduplikasi identitas perlu, tetapi tetap tidak membuktikan independensi. U: asal dan ketergantungan teks. |
| 8. Bisa tanpa bobot arbitrer? | Belum ada aturan ordinal/equality aktif. | Binary support hanya kelayakan, bukan intensitas. | Sumber yang diperiksa belum memberi urutan yang diperlukan. | P: partial order bersyarat mungkin didesain; U: semantik domain. **STRONGER/WEAKER belum dapat dipertanggungjawabkan.** |

## Inventaris 12 evidence kandidat Leader

Seluruh identitas/field/kutipan di bawah dicocokkan dengan katalog dan Lembar A; validitas kutipan terhadap master berbeda dari provenance terhadap sumber budaya. Total: **9 support + 3 caution**, masing-masing dimensi 3 support/1 caution; 12 asal record/field/kutipan berbeda dalam subset ini, tetapi hanya 11 masterRecordId (dua field Sinta). Tidak satu pun diasumsikan sebagai pengamatan independen. Di seluruh katalog, DIR01 juga menduplikasi kutipan MAN02.

Status agregat subset: **0/12 provenance verified; 12/12 missing; 12/12 review budaya pending; 12/12 approval produk pending; 0/12 mempunyai aturan relatif approved**. `sourceId` dan `sourcePage` tetap null. Lembar A juga tidak mengklaim completeMasterQuoteVerified untuk keduabelasnya. Kelas penelusuran T/S bukan verified; 6 T dan 6 S.

### C-DIR-01 — Sri

- Identitas: `wewaran`; siklus `asatawara`; record `wewaran:asatawara:1`; field `karakter` — [master 437](../lib/data.ts#L437).
- Dimensi/polarity usulan: `directing/support`.

> Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Teks sumber ditemukan dan dapat dibandingkan**; S1 §128 Asthawara, cetak 70 / viewer P:80; S4 Astawara/Sri. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Mengatur dapat bermakna keteraturan pribadi; rapi tidak membuktikan kepemimpinan efektif.
- Independensi: Kalimat yang sama juga dipakai C-MAN-02; satu asal tidak menjadi dua observasi. Semua indikator masih berasal dari kalender, bukan pengukuran perilaku.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak ada pernyataan Sri lebih kuat daripada Raja/Sinta; kecocokan kata memimpin tidak mengukur intensitas.
- Review diperlukan: Rekonsiliasi redaksi dengan S1/S4 pada Lembar A; sepakati directing vs managing dan larangan penghitungan ganda. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-DIR-02 — Raja

- Identitas: `wewaran`; siklus `dasawara`; record `wewaran:dasawara:8`; field `karakter` — [master 467](../lib/data.ts#L467).
- Dimensi/polarity usulan: `directing/support`.

> Berjiwa besar, kharismatik, dan berbakat mengatur orang.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Teks sumber ditemukan dan dapat dibandingkan**; S1 §128 Dasawara/Raja, cetak 72 / P:82; S4 Dasawara/Raja. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Karisma, kebesaran jiwa, atau mengatur orang tidak membuktikan efektivitas, etika, maupun kepemimpinan partisipatif.
- Independensi: Record berbeda dari Sri/Sinta tetapi independensi informasinya belum terbukti; Raja dan Manusa berada pada satu siklus Dasawara dan bukan dua nilai yang serentak dimiliki satu snapshot.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak ada aturan Raja > Sri/Sinta; nama Raja atau urip tidak memberi prioritas.
- Review diperlukan: Verifikasi teks lengkap, terjemahan dan konteks mengatur; ahli menilai batas karisma terhadap directing. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-DIR-03 — Sinta

- Identitas: `wuku`; siklus `null`; record `wuku:1`; field `sifat_umum` — [master 9](../lib/data.ts#L9).
- Dimensi/polarity usulan: `directing/support`.

> Tegas, agak kaku, berjiwa pemimpin.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Sumber sekunder ditemukan**; S6 bagian wuku SINTA. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Ketegasan dan kekakuan tidak boleh dipisahkan dari konteks lengkap Sinta; label pemimpin tidak memberi ukuran kekuatan.
- Independensi: Satu record Wuku Sinta dengan C-DIR-04, walau field berbeda; tidak dianggap bukti independen yang saling menghapus.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Support tidak lebih tinggi karena menyebut pemimpin; caution terkait tidak boleh dikurangkan menjadi nilai.
- Review diperlukan: Periksa sumber Wuku, konteks kekakuan serta hubungan sifat_umum dan kelemahan dengan ahli. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-DIR-04 — Sinta

- Identitas: `wuku`; siklus `null`; record `wuku:1`; field `kelemahan` — [master 11](../lib/data.ts#L11).
- Dimensi/polarity usulan: `directing/caution`.

> Keras kepala, sulit menerima kritik.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Sumber sekunder ditemukan**; S6 bagian wuku SINTA. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Sulit menerima kritik adalah bahan caution situasional, bukan vonis kemampuan manusia lebih rendah.
- Independensi: Record Sinta yang sama dengan C-DIR-03; support dan caution adalah konteks bersama, bukan dua sampel.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Caution bukan skala negatif; konflik eligibility existing harus ditangani sebelum comparator.
- Review diperlukan: Verifikasi frasa lengkap dan apakah caution relevan untuk directing; pertahankan kebijakan konflik existing. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COMM-01 — Menga

- Identitas: `wewaran`; siklus `dwiwara`; record `wewaran:dwiwara:1`; field `karakter` — [master 347](../lib/data.ts#L347).
- Dimensi/polarity usulan: `communicating/support`.

> Terbuka, komunikatif, dan mudah menerima masukan dari luar.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Teks sumber ditemukan dan dapat dibandingkan**; S1 §128 Dwiwara/Menga, cetak 66 / P:76. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Terbuka dan komunikatif tidak membuktikan menyimak, menyelesaikan konflik, atau komunikasi efektif.
- Independensi: Record sendiri, tetapi Dwiwara dihitung dari kombinasi kalender; bukan observasi perilaku independen dari indikator lainnya.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak ada intensitas atau relasi Menga terhadap Kliwon/Tiwa-tiwa.
- Review diperlukan: Verifikasi perluasan makna terbuka menjadi menerima masukan; ahli menilai tafsir komunikasi. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COMM-02 — Kliwon

- Identitas: `pancawara`; siklus `null`; record `pancawara:5`; field `karakter` — [master 370](../lib/data.ts#L370).
- Dimensi/polarity usulan: `communicating/support`.

> Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Teks sumber ditemukan dan dapat dibandingkan**; S1 §128 Pancawara/Keliwon, cetak 68–69 / P:78–79. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Kefasihan berbicara dan spiritualitas tidak dapat disamakan dengan komunikasi tim.
- Independensi: Record Pancawara yang sama bisa tampil melalui alias wewaran:pancawara; Lintang C-COMM-03 memakai komponen Kliwon yang sama. Jangan hitung alias sebagai bukti tambahan.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak ada dasar Kliwon lebih kuat daripada Menga/Tiwa-tiwa; dua kata positif bukan level ordinal.
- Review diperlukan: Cari sumber asal lengkap; review ambiguitas kefasihan/spiritualitas dan batas communicating. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COMM-03 — Tiwa-tiwa

- Identitas: `lintang`; siklus `null`; record `lintang:Buda:Kliwon`; field `penjelasan` — [master 549](../lib/data.ts#L549).
- Dimensi/polarity usulan: `communicating/support`.

> Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Sumber sekunder ditemukan**; S5 daftar nomor 4, Buda–Kliwon / Tiwa-tiwa; S2 konteks hlm. 444–445. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Merangkai kata atau mengarang dapat bersifat ekspresi sastra; sensitivitas harus tetap terbaca, bukan dihapus agar support terlihat bersih.
- Independensi: Lintang diturunkan dari Sapta/Panca (Buda–Kliwon); berkaitan dengan Kliwon C-COMM-02. Record berbeda tidak membuktikan independensi statistik ataupun tekstual.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Detail deskripsi lebih panjang tidak memberi intensitas lebih tinggi; tidak ada aturan perbandingan yang disahkan.
- Review diperlukan: Periksa kalender asli di balik S5 menurut Lembar A; verifikasi konteks penuh dan pemetaan support beserta sensitivitas. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COMM-04 — Begoong

- Identitas: `lintang`; siklus `null`; record `lintang:Saniscara:Umanis`; field `penjelasan` — [master 797](../lib/data.ts#L797).
- Dimensi/polarity usulan: `communicating/caution`.

> Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Sumber sekunder ditemukan**; S5 daftar nomor 35, Saniscara–Umanis / Bgoong. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Tutur tajam dapat berarti lugas/kritis menurut konteks; kalimat juga memuat keterampilan dan keberanian.
- Independensi: Lintang merupakan kombinasi Sapta/Panca; tidak dianggap pengukuran perilaku mandiri atau lawan ordinal Tiwa-tiwa.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Caution tidak otomatis lebih lemah; beda profil komunikasi dapat belum diketahui atau tidak terurut menurut metode yang sah.
- Review diperlukan: Ahli menilai kapan ketajaman tutur menjadi caution; verifikasi sumber primer di balik pembanding sekunder. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COLL-01 — Redite

- Identitas: `saptawara`; siklus `null`; record `saptawara:1`; field `karakter` — [master 427](../lib/data.ts#L427).
- Dimensi/polarity usulan: `collaborating/support`.

> Berjiwa sosial tinggi, berwibawa, dan senang menolong.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Teks sumber ditemukan dan dapat dibandingkan**; S1 §128 Saptawara/Radite, cetak 69 / P:79. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Menolong/prososial tidak membuktikan pembagian tugas, kompromi atau kerja tim timbal balik.
- Independensi: Alias wewaran:saptawara menunjuk record Sapta yang sama; tidak menjadi dua bukti. Kalender lain dapat bergantung pada Sapta/Panca ini.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak ada aturan menolong lebih kuat daripada loyal atau bersosialisasi.
- Review diperlukan: Periksa teks dan konteks pemberian/derma; ahli menentukan batas collaborating. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COLL-02 — Manusa

- Identitas: `wewaran`; siklus `dasawara`; record `wewaran:dasawara:7`; field `karakter` — [master 466](../lib/data.ts#L466).
- Dimensi/polarity usulan: `collaborating/support`.

> Suka bersosialisasi dan sangat mementingkan hubungan manusia.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Teks sumber ditemukan dan dapat dibandingkan**; S1 §128 Dasawara/Manusa, cetak 72 / P:82; S4 Dasawara/Manusa. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Suka bersosialisasi tidak membuktikan kesediaan kompromi atau kemampuan bekerja bersama.
- Independensi: Satu siklus Dasawara dengan Raja; derivasi kalender dan asal narasi belum memberi bukti independensi.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Variasi makna pada S1/S4 belum direkonsiliasi; tidak ada relasi intensitas Manusa terhadap Redite/Pahang.
- Review diperlukan: Rekonsiliasi variasi makna sosial/kesedihan pada laporan provenance; jangan memilih versi yang paling cocok untuk produk. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COLL-03 — Pahang

- Identitas: `wuku`; siklus `null`; record `wuku:16`; field `kelebihan` — [master 145](../lib/data.ts#L145).
- Dimensi/polarity usulan: `collaborating/support`.

> Pendengar yang baik, loyal.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Sumber sekunder ditemukan**; S6 bagian wuku PAHANG. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Loyalitas dapat selektif; pendengar baik tidak otomatis koordinasi atau kolaborasi efektif.
- Independensi: Record Pahang berbeda dari support lain, tetapi bukan bukti pengukuran perilaku independen; asal narasi lengkap belum diketahui.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak ada pembanding loyal vs menolong; tambahan dimensi atau kata tidak memberi kekuatan.
- Review diperlukan: Cari sumber lengkap untuk mendengar/loyal; Lembar A menandai konteks pembanding Wuku belum membuktikan frasa tersebut. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

### C-COLL-04 — Langkir

- Identitas: `wuku`; siklus `null`; record `wuku:13`; field `kelemahan` — [master 119](../lib/data.ts#L119).
- Dimensi/polarity usulan: `collaborating/caution`.

> Keras hati, sulit diajak kompromi.

- Sumber: **asal kalimat lengkap belum terverifikasi**, sourceId/sourcePage tetap null; provenance missing, review budaya pending, approval produk pending. Penelusuran historis Lembar A: **Sumber sekunder ditemukan**; S6 bagian wuku LANGKIR. Ini bukan verifikasi baru atas isi sumber tersebut pada G6A.9.
- Batas makna: Keteguhan prinsip dan konteks kompromi perlu dibedakan; caution tidak menentukan orang bermasalah.
- Independensi: Record Langkir tersendiri, tetapi masih satu sistem tafsir kalender dan belum terlacak asal narasinya.
- Comparability: **belum dapat dipakai untuk STRONGER/WEAKER/EQUIVALENT**. Tidak dapat mengurutkan Langkir di bawah Pahang/Redite; caution bukan penalti ordinal.
- Review diperlukan: Verifikasi frasa sulit kompromi dan situasi penerapannya; ahli membatasi pemetaan caution. Selain itu, metode perbandingan relatif memerlukan aturan dan approval tersendiri; approval evidence saja tidak cukup.

## Perbandingan Model A, B, C

| Model | Cara yang diusulkan | Penilaian domain dan teknis | Keputusan audit |
| --- | --- | --- | --- |
| A — jumlah evidence | Banding jumlah support, support minus caution, panjang teks atau jumlah tag | Coverage master tidak seragam, alias/asal sama dan derivasi kalender saling terkait. Deduplikasi tidak mengubah count menjadi intensitas. Penalti caution sama arbitrernya. Ini skor tersembunyi meskipun tanpa angka 0–100. | **Tidak direkomendasikan** untuk kekuatan; jangan diimplementasikan sebagai fallback. |
| B — dominasi dimensi kualitatif | Partial order pada directing/communicating/collaborating, jika ada relasi ordinal per dimensi yang disetujui | Dapat transparan tanpa penjumlahan, tetapi saat ini hanya ada kehadiran support/caution. Semua Leader yang lolos proposal memiliki tiga support: itu tidak membuktikan kekuatan atau equality. Tanpa comparator per dimensi, dominasi belum dapat dihitung. | **HOLD**, hanya kerangka penelitian bersyarat; bukan rekomendasi aktivasi. |
| C — hierarki budaya | Terapkan prioritas yang dinyatakan eksplisit oleh sumber sesuai konteks | Perlu penulis/otoritas, edisi, halaman, terjemahan, objek perbandingan dan batas penerapan. R2 perlu ditelusuri, bukan langsung dibuang atau dipromosikan; R1 prioritas konteks waktu tidak otomatis leadership. | **HOLD**, belum ada aturan relatif kepemimpinan terverifikasi. |

Untuk B, profil deskriptif dapat mencatat support, caution/konteks, missing basis dan asalnya sebagai **status pengetahuan tanpa urutan**, bukan lemah/sedang/kuat. Tidak ada caution berarti tidak ada caution yang terkurasi, bukan bebas risiko. Satu caution bukan penurunan level. Dominasi hipotetis baru sah apabila setiap perbandingan dimensi yang diperlukan mempunyai aturan ordinal/equality tersendiri yang approved dan tidak menggabungkan aspek berlainan menjadi skala buatan. Tidak boleh mengutamakan directing secara diam-diam. Jika ada trade-off yang sah dan tidak ada prioritas approved: INCOMPARABLE. Bila relasi dasarnya belum diketahui: UNKNOWN.

## Kontrak konseptual comparator dua kandidat

Ini kontrak review, bukan API atau konfigurasi runtime baru. Masukan hanya dua profil simbolis Otonan, metadata eligibility Leader yang sudah benar-benar sah, versi snapshot/master, evidence yang lolos resolver, sumber dan metode relatif yang approved beserta scope. Tidak menerima kategori Samyoga, count Utama, nama, urutan input, kesediaan jabatan atau nilai kompetensi.

Keluaran konseptual: orientasi pasangan A/B, salah satu lima status, alasan, referensi rule/version, basis evidence dan locator sumber, scope kesimpulan, serta readiness/validitas terpisah. Tidak ada skor/intensitas numerik. Field approval bukan boolean bebas yang diberikan pengguna. Bila metode belum tersedia, rule reference tetap null; jangan mengarang sourceId supaya output terlihat lengkap.

| Status A terhadap B | Kondisi yang membolehkan | Yang tidak cukup | Akibat bagi alokasi |
| --- | --- | --- | --- |
| STRONGER | Aturan relatif yang disetujui, sumber/basis sah dan lingkup sama secara eksplisit membuktikan prioritas simbolis A; relasi konsisten terhadap B dan kandidat lain | Lebih banyak support/Utama, kata positif, urip, tidak ada caution, sekadar sama-sama Leader | Baru bisa memberi edge dominasi bersama Samyoga yang sah, bukan langsung jabatan |
| WEAKER | Pembalikan bukti STRONGER B terhadap A, rule/basis/scope sama | Membuat aturan penalti kedua atau menebak kebalikannya dari UNKNOWN | Akibat kebalikan STRONGER |
| EQUIVALENT | Aturan kesetaraan eksplisit yang approved berlaku pada kedua profil, scope jelas, hubungan ke pihak ketiga koheren | Indikator/jumlah/dimensi/eligibility sama, tidak terbukti berbeda | Count Utama boleh membedakan hanya menurut policy alokasi yang kelak approved |
| INCOMPARABLE | Informasi dan dasar interpretasi sah cukup untuk menyatakan tidak ada hubungan urutan pada scope metode, atau trade-off ordinal sah tanpa prioritas | Missing source/approval; dimensi berbeda saja tanpa metode yang sah | Tidak ada edge dominasi pasangan |
| UNKNOWN | Data, provenance, approval, applicability atau aturan relatif/equality belum cukup; alasan wajib | Menganggap ketidaktersediaan sebagai equality atau ketidakterurutan yang sudah terbukti | Tidak ada edge dominasi; metode unavailable membuat alokasi not_evaluated |

Indikator identik dapat dibuktikan identik sebagai data, tetapi **belum boleh dilabel EQUIVALENT kekuatan** tanpa aturan kesetaraan eksplisit yang disetujui. Usulan equality terbatas pada indikator simbolis mungkin diajukan terpisah; tidak menyatakan kompetensi dua manusia sama. Missing data ≠ indikator absent, tidak ada caution ≠ kemampuan tinggi, data lengkap ≠ budaya verified.

Urutan konseptual: validasi snapshot/versi/identity dan eligibility → cek provenance/approval evidence dan rule → cek metode relatif/scope → terapkan hanya aturan yang terbukti → audit koherensi semua pasangan → serahkan relasi ke allocator terpisah. Jangan mengimputasi relasi atau membuat total ranking. Input malformed/missing pair/cycle adalah masalah validitas, bukan hasil INCOMPARABLE yang seolah evaluasi selesai.

Bedakan UNKNOWN karena metode belum approved (**allocation not_evaluated**) dari UNKNOWN eksplisit dalam metode approved yang sudah diterapkan pada pasangan tertentu (**tidak ada edge**, bisa undetermined bila tidak ada dominator universal). Ini mengikuti [G6A.7 §6.1](samyoga-chair-contract-g6a7.md#61-validitas-comparator-dan-pelaporan-unknown), bukan perubahan status existing.

## Integrasi kontrak Ketua/Wakil yang tetap terpisah

[Kontrak G6A.7 §6.2](samyoga-chair-contract-g6a7.md#62-dominasi-setelah-dua-gerbang) dan [decision log](samyoga-chair-decision-log-g6a7.md) tetap otoritatif. Kandidat Q harus lolos **Otonan AND Samyoga**; kriteria mayoritas Utama masih pending, bukan aturan budaya otomatis.

Pada kondisi persetujuan hipotetis lengkap, A mendominasi B hanya bila (Otonan STRONGER dan Utama A ≥ B) atau (EQUIVALENT sah dan Utama A > B). Otonan STRONGER tetapi Utama lebih sedikit menghasilkan konflik prioritas jika tidak ada dominator universal. UNKNOWN/INCOMPARABLE tidak pernah menjadi edge karena Utama lebih tinggi.

Untuk Q≥3 diperlukan satu kandidat yang mendominasi semua lainnya, bukan paling banyak kemenangan, count tertinggi atau satu-satunya yang belum terbukti kalah. UNKNOWN antar dua kandidat lain tidak otomatis membatalkan dominator yang terbukti terhadap keduanya, selama graf koheren. Untuk Q=0/1 tidak perlu perbandingan antarkandidat; readiness/dua gerbang tetap wajib dan tidak dapat disimpulkan dari registry kosong. Wakil tetap tidak dipilih otomatis; kebijakan terpisah masih pending. G6A.8-R1 tidak diubah.

Prinsip produk yang sudah disetujui: **“Jumlah Utama tidak dapat mengalahkan ketidaktersediaan pembanding kekuatan Otonan.”** G6A.9 tidak memperluas approval ini menjadi persetujuan budaya, mayoritas, dominasi produksi atau aktivasi.

## Sumber dan review yang masih diperlukan

1. Periksa scan/edisi/terjemahan R1 secara langsung; telusuri rujukan primer klaim R2 dan apakah benar untuk perwatakan, padewasan atau perbandingan kepemimpinan. Prioritas jenis deskripsi dan kekuatan individu harus dibedakan.
2. Lanjutkan antrean [Lembar A](samyoga-position-cultural-decisions-g6a6.md): verifikasi setiap kalimat lengkap dan pemetaan, termasuk konteks Sinta, variasi Manusa, ambiguitas Kliwon/Pahang, serta sumber kalender Lintang.
3. Baca edisi tepat pustaka About/G6A.6: Pokok-pokok Wariga (Ardhana 2009), Astrologi Hindu (Rini 2012), Tenung Wariga-Kunci Ramalan Astrologi Bali (Aryana 2010), Ramalan Terhadap Hari Kelahiran Manusia (Arwati 2010). Ini daftar verifikasi, bukan isi yang sudah dibaca. R5 hanya jalur metadata untuk buku Gambar/Anandakusuma.
4. Minta ahli mencatat teks, locator, terjemahan, konteks, alasan, batas domain dan penolakan/approval secara nyata untuk aturan **relatif** dan **kesetaraan**. Belum ada identitas reviewer atau tanggal review yang boleh diisi.
5. Pemilik produk memutuskan apakah menerima hasil tanpa Ketua, equality simbolis terbatas, dan bahasa unavailable. Jika tidak ada aturan relatif yang sah, tutup jalur ranking alih-alih menciptakan bobot.

Lihat [matriks sintetis](samyoga-otonan-comparator-test-matrix-g6a9.md) dan [keputusan/pending/validasi](samyoga-otonan-comparator-decisions-g6a9.md). Tidak ada rekomendasi jabatan yang boleh dipromosikan dari audit ini.

