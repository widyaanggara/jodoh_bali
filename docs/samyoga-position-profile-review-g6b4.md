# Review profil posisi Palintangan — G6B.4

Tanggal: 2 November 2026, WITA. **Rancangan offline; kriteria runtime, comparator Ketua, dan gate tidak berubah.** Sumber: [35 Lintang dan 72 assertion audit](samyoga-palintangan-mapping-g6b4.md), [kriteria G6B.3 existing](../lib/samyoga-position-experiment-rules.ts), serta [simulasi terukur](samyoga-position-coverage-g6b4.md).

## 1. Makna hasil dan unit analisis

Unit simulasi adalah satu identitas Lintang dari master, bukan tanggal lahir buatan, pengguna, atau kelompok riil. Semua dimensi wajib harus hadir pada **Lintang yang sama**. Dukungan dari Lintang berbeda tidak boleh digabung untuk memenuhi profil seorang anggota.

Dukungan frasa yang sempit bukan bukti kemampuan kerja. “Terampil dalam segala pekerjaan” tetap merupakan ungkapan master, bukan temuan bahwa pemilik kelahiran dapat melakukan semua pekerjaan. Semua usulan belum disetujui untuk runtime, provenance missing dan cultural review pending. Review ahli eksternal bukan syarat baru penyelesaian fitur; status pending tidak disulap menjadi verifikasi.

## 2. Audit kriteria existing

| Profil | Syarat existing yang dipertahankan | Existing 3 mapping | Draft tekstual saja | Draft tekstual + interpretatif |
| --- | --- | --- | --- | --- |
| Leader | directing AND communicating AND collaborating | 0 | 0 | 0 |
| Manajemen | planning AND managing | 0 | 0 | 0 |
| Operasional | executing | 1 | 5 | 5 |
| Beberapa profil sekaligus | Dua/lebih profil lengkap | 0 | 0 | 0 |

Angka adalah jumlah identitas dari 35. Draft interpretatif adalah sensitivitas hipotetis, bukan approval; 23 assertion ambigu dan 12 penolakan tidak dihitung sebagai dukungan. Ketiga skenario bukan penambahan aturan runtime. Tidak ada ambang baru, persentase cocok, atau ranking.

### Leader

Kriteria saat ini memerlukan tiga dimensi. Communicating mempunyai 8 support tekstual draft. Collaborating tidak mempunyai support langsung yang menyebut kerja bersama; 7 identitas hanya mempunyai hipotesis prososial/keluarga yang memerlukan interpretasi. Directing tidak mempunyai support tekstual maupun interpretatif yang cukup: wibawa Sungenge, pengaruh Udang, cita-cita Sangka Tikel, dan ketegasan Puwuh Atarung tidak menyatakan pengarahan kegiatan.

Karena itu, syarat Leader tidak dapat dipenuhi oleh katalog ini bahkan pada skenario interpretatif. Ini gap isi master terhadap konsep profil, bukan alasan untuk memaksa konversi keberanian/popularitas menjadi kepemimpinan.

Counterexample: Tiwa-tiwa mempunyai frasa menyusun kata, tetapi ramah tidak membuktikan kolaborasi dan menimbang sesuatu tidak membuktikan planning. Begoong berani tidak menjadi directing. Udang mempunyai komunikasi dan pengaruh, tetapi pengaruh bukan tindakan mengarahkan.

**Rekomendasi:** pertahankan Leader existing tidak terpenuhi. Jangan melonggarkannya hanya agar muncul Ketua. Jika produk ingin mendefinisikan profil lain dari komunikasi/prososial, beri nama dan kontrak baru terlebih dahulu; jangan menyamakannya dengan kemampuan memimpin.

### Manajemen

Dua identitas mempunyai support tekstual managing yang sempit: Ru (mengurus rumah tangga/ketelitian keuangan) dan Puwuh Atarung (mengatur rumah tangga). Kukus dan Kartika memberi dua hipotesis tambahan yang memerlukan interpretasi, mengenai keteraturan hidup dan pemahaman nilai uang.

Planning tidak eksplisit dalam master. Gajahmina, Lembu, dan Kumba memberikan hipotesis pertimbangan sebelum tindakan/pemecahan masalah, bukan rencana organisasi. **Ketiganya tidak mempunyai managing**, sedangkan keempat pemilik hipotesis managing tidak mempunyai planning yang diterima. Kehadiran kedua dimensi secara agregat tidak berarti ada profil lengkap.

Counterexample: menggunakan satu kalimat pengurusan/keuangan Ru untuk sekaligus planning dan managing akan menciptakan dukungan ganda yang tidak dinyatakan teks. Usulan planning tersebut ditolak dan kelompok dependensinya dicatat.

**Rekomendasi:** kriteria existing tetap 0. Alternatif managing inti di bawah boleh diputuskan sebagai profil simbolis sempit setelah persetujuan produk, bukan diaktifkan dalam milestone ini.

### Operasional

Executing mempunyai 5 support tekstual: **Uluku, Kuda, Kukus, Lumbung, Begoong**. Ini memperluas variasi frasa dari rajin bekerja ke suka bekerja, tangkas bekerja, dan terampil bekerja. Kelimanya memenuhi aturan executing-only dalam simulasi, tetapi menyatakan aspek yang berbeda, bukan lima ukuran kompetensi sebanding.

- Uluku: kecenderungan suka bekerja; tidak menyatakan ketuntasan.
- Kuda: ketangkasan bekerja; tidak menyatakan ketelitian/konsistensi.
- Kukus: kerajinan, janji dan keteraturan sebagai konteks; bukan produktivitas terukur.
- Lumbung: kerajinan; sensitivitas tetap bagian karakter.
- Begoong: keterampilan kerja; caution komunikasi tetap ditampilkan dan tidak menjadi larangan Operasional otomatis.

Kriteria executing-only sudah diakui G6B.3 sebagai indikator awal yang belum mencakup seluruh facet. Jangan menambahkan syarat konsistensi atau mengubah threshold diam-diam. Kelak facet tindakan/ketelitian/kontinuitas perlu didefinisikan sebagai makna yang berbeda, bukan jumlah evidence.

## 3. Caution, konflik, dan profil parsial

Ada 33 Lintang dengan konteks caution dalam master, tetapi hanya 9 assertion draft yang secara eksplisit diajukan sebagai caution dimensi (1 tekstual dan 8 interpretatif). Tidak semua emosi, sensitivitas atau keraguan ditafsirkan sebagai konflik dimensi. Tidak ada nilai minus.

Simulator mempertahankan policy konflik G6B.3-R1 untuk perbandingan: support dan caution pada dimensi wajib yang sama menghasilkan conflict; konflik profil lengkap dapat menahan profil lain. Ini **bukan persetujuan agar semua draft caution diterapkan sebagai pemblokir runtime**. Simulasi ditandai hipotetis dan terpisah dari runtime. Efek global conflict tidak terpicu oleh data 35 Lintang pada tiga skenario ini.

Kasus nyata inventaris: Banyak Angrem mendukung komunikasi secara tekstual dan mempunyai hipotesis prososial, tetapi juga konteks pemutusan relasi. Skenario interpretatif memberi conflict pada collaborating, sehingga tidak menaikkannya menjadi Leader. Memutus relasi bisa merupakan batas yang sah; keputusan apakah caution harus menahan profil membutuhkan kebijakan eksplisit, bukan asumsi moral.

Profil parsial bukan kegagalan orang:
- Tiwa-tiwa: satu dimensi Leader dari tiga; tetap parsial.
- Ru/Puwuh Atarung: managing tanpa planning; Manajemen parsial.
- Kukus pada skenario interpretatif: Operasional lengkap dan Manajemen parsial; bukan dua profil lengkap.
- Gajahmina/Lembu/Kumba: planning interpretatif tanpa managing.
- Begoong pada runtime existing: caution-only; pada draft memiliki usulan executing tekstual. Perbedaan ini belum mengubah UI aktif.

## 4. Alternatif eksplisit untuk keputusan produk, tidak aktif

### Alternatif A — profil Pengelolaan Simbolis dengan managing inti

- Minimum: support managing yang diterima untuk lingkup yang dinyatakan; planning sebagai konteks pendukung opsional, bukan klaim sudah ada.
- Konsep: mengakui teks pengurusan rumah tangga tanpa mengarang perencanaan organisasi.
- Risiko false positive simbolis: kemampuan domestik digeneralisasi ke organisasi, atau sikap ekonomis disamakan dengan pengelolaan.
- Risiko false negative simbolis: pemilik deskripsi yang tidak menyebut pengurusan tidak terjangkau meskipun kemampuan riilnya ada.
- Dampak terukur: **2 identitas** pada draft tekstual (Ru, Puwuh Atarung); **4** jika interpretasi tambahan diterima (tambah Kukus, Kartika). Kukus lalu mempunyai dua profil hipotetis: Operasional dan profil alternatif ini; bukan beberapa profil existing.
- Dampak Ketua: **tidak ada**; tidak menggantikan gerbang Leader. Dilarang menerapkan alternatif ini di bawah nama Manajemen existing tanpa perubahan kontrak yang disetujui.

### Alternatif B — profil Komunikasi–Prososial yang terpisah dari Leader

- Minimum: communicating AND collaborating dengan lingkup prososial yang disepakati; caution kontekstual perlu keputusan tersendiri. Tidak membutuhkan atau mengklaim directing.
- Konsep: menjelaskan pasangan indikator pesan dan tindakan membantu tanpa mengarang pengarahan.
- Risiko false positive simbolis: menolong orang dekat disamakan dengan kerja tim timbal balik; keramahan/popularitas tidak boleh menjadi pengganti.
- Risiko false negative simbolis: teks sempit menghilangkan peluang orang yang sebenarnya dapat membantu atau berkomunikasi.
- Dampak terukur: **0** pada draft tekstual. Pada draft interpretatif hanya **Banyak Angrem** mempunyai kedua support sebelum review caution; ia memerlukan review konteks pemutusan relasi. Jika policy konflik existing direplikasi, **0** hasil tanpa konflik.
- Dampak Ketua: **tidak ada**. Ini profil lain, bukan Leader yang dipermudah. Menjadikannya gerbang Ketua memerlukan perubahan kontrak produk tersendiri dan tidak direkomendasikan dalam G6B.4.

Alternatif A lebih mudah dijelaskan daripada memaksa planning. Alternatif B belum cukup untuk membenarkan alokasi posisi. Tidak ada alternatif yang diaktifkan, tidak ada skor jumlah sifat, dan tidak dibuat comparator kekuatan.

## 5. Kontrak Ketua, posisi kosong, dan keputusan

- Leader tetap berbasis Palintangan; Samyoga tetap gerbang kedua.
- Mayoritas Utama tetap kebijakan percobaan existing, bukan aturan budaya baru.
- Jumlah Utama tidak dapat menggantikan UNKNOWN/INCOMPARABLE Otonan. Tidak dibuat tie-break dari nama, ID, urutan, tag, atau evidence count.
- Beberapa kandidat boleh ditampilkan jika suatu ruleset yang disetujui kelak mendukungnya; audit ini tidak menyimulasikan graf Samyoga atau mengklaim ada kandidat Ketua.
- Koordinator belum mempunyai aturan; Wakil Ketua tetap tanpa kebijakan alokasi dan null pada runtime.
- Anggota bukan fallback otomatis. Teks tidak cukup berarti belum cukup dasar rekomendasi, bukan orang tidak kompeten.

**Keputusan review:** aturan Leader dan Manajemen existing belum terjangkau oleh isi master yang diaudit. Jangan direvisi secara diam-diam. Siapkan keputusan eksplisit untuk menerima/menolak mapping per ID draft dan, bila perlu, alternatif A sebagai profil berbeda. **READY FOR MAPPING DECISION**, dengan Leader/Ketua dan revisi profil masih belum disetujui.
