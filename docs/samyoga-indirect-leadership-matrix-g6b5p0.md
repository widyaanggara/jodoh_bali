# Matriks data dan kasus desain indirect — G6B.5-P0

**DOCUMENTATION ONLY.** Data aktual 35 Lintang dipisahkan dari graf sintetis dan asumsi profil hipotetis. Tidak ada tanggal lahir atau relasi kalender yang dikarang untuk membuat kandidat. Versi audit 2 November 2026, WITA.

Referensi: [kontrak P0](samyoga-indirect-leadership-contract-g6b5p0.md), [72 assertion dan kutipan G6B.4](samyoga-palintangan-mapping-g6b4.md), [review profil G6B.4](samyoga-position-profile-review-g6b4.md), [fixture draft read-only](../tests/fixtures/samyoga-palintangan-mapping-g6b4.json), [simulator G6B.4 existing](../tests/fixtures/samyoga-palintangan-coverage-g6b4.mjs).

## 1. Audit hitungan assertion

16 DIDUKUNG TEKSTUAL + 21 PERLU INTERPRETASI + 23 AMBIGU + 12 TIDAK DIDUKUNG = **72** assertion audit. Tiga di antaranya merepresentasikan assertion existing: Tiwa-tiwa C-COMM-03, Kukus C-EXEC-04, Begoong C-COMM-04. Jadi jumlah draft baru **69**, bukan 72 + 3.

Dari 16 tekstual, 15 berjenis support dan 1 caution. Dari 21 interpretatif, 13 support dan 8 caution. “Didukung tekstual” hanya tingkat hubungan semantik dalam scope master; semua status sumber tetap missing, cultural review pending, mapping eksperimen draft_pending, active false.

## 2. Irisan communicating AND managing

| Skenario | Support communicating | Support managing | Irisan pada satu Lintang |
| --- | --- | --- | --- |
| Existing G6B.3-R1 | 1: Tiwa-tiwa | 0 | **0** |
| Draft tekstual | 8: Tiwa-tiwa, Pagelangan, Asu, Banyak Angrem, Patrem, Depat, Lawean, Udang | 2: Ru, Puwuh Atarung | **0** |
| Draft tekstual + interpretatif, sensitivitas saja | 8 yang sama | 4: Kukus, Kartika, Ru, Puwuh Atarung | **0** |

Tidak ada identitas irisan untuk ditampilkan; tidak ada pasangan kutipan C/M aktual yang dapat melengkapi profil indirect pada satu anggota. Dukungan dua dimensi dari **dua Lintang berbeda tidak boleh digabung**.

Kasus yang tampak dekat tetapi tidak memenuhi:
- Kartika: managing hanya PERLU INTERPRETASI; frasa bicaranya tegas/janggal berkeputusan AMBIGU. Tidak ada support communicating yang diterima.
- Puwuh Atarung: managing didukung dalam scope rumah tangga. Frasa “Bicaranya tegas” tercatat sebagai hipotesis directing AMBIGU, bukan mapping communicating yang diterima. P0 tidak menambah atau memindahkan mapping untuk membuat irisan.
- Ru: pengurusan rumah tangga/keuangan tidak menyatakan komunikasi. Memakai satu kalimatnya sebagai planning ditolak pada G6B.4.
- Kukus: managing adalah interpretasi keteraturan hidup; tidak ada support komunikasi. C-EXEC-04 tidak boleh dibaca ulang menjadi C atau M.
- Tiwa-tiwa: komunikasi tekstual tidak mengubah “Pandai menimbang sesuatu” menjadi managing/planning.

Pengelolaan rumah tangga dan bahasa/diplomasi tetap perlu scope semantik yang sempit bila kelak diajukan sebagai profil pendukung kepemimpinan. Persetujuan hipotesis produk tidak mengubah konteks tersebut menjadi kompetensi organisasi.

### Kutipan dan jejak semua support target

Semua kutipan berikut persis dari master masing-masing, bukan teks baru. Dua frasa berbeda sekalipun tetap satu sumber Palintangan yang saling bergantung; tidak menjadi bukti independen kepemimpinan. Tidak ada pasangan C/M lengkap yang dapat dibandingkan apakah memakai frasa sama atau berbeda pada data aktual.

### Tiwa-tiwa — communicating

Identitas `lintang:Buda:Kliwon`, mapping `DRAFT-G6B4-L04-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**; tautan existing `C-COMM-03`.

> ahli dalam merangkai kata atau mengarang

Penyusunan kata secara eksplisit mendukung ekspresi verbal/tulis. Batas: Bisa khusus sastra; tidak membuktikan komunikasi organisasi. Sensitivitas tetap konteks. Kelompok dependensi: `DRAFT-G6B4-L04-SOURCE`.

### Pagelangan — communicating

Identitas `lintang:Saniscara:Kliwon`, mapping `DRAFT-G6B4-L14-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> Pandai menyusun kata-kata

Teks eksplisit tentang penyusunan pesan. Batas: Tidak membuktikan kemampuan mendengar atau koordinasi. Kelompok dependensi: `DRAFT-G6B4-L14-SOURCE`.

### Kukus — managing

Identitas `lintang:Soma:Paing`, mapping `DRAFT-G6B4-L16-MAN-03`, keputusan **PERLU INTERPRETASI**.

> Hidupnya cenderung hemat, cermat, dan tertata

Keteraturan hidup bisa ditafsirkan sebagai pengelolaan sumber daya pribadi. Batas: Tidak otomatis berlaku pada organisasi; berbeda dari planning. Kelompok dependensi: `DRAFT-G6B4-L16-SOURCE`.

### Asu — communicating

Identitas `lintang:Anggara:Pon`, mapping `DRAFT-G6B4-L17-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> pandai berbahasa

Kecakapan bahasa secara eksplisit disebut. Batas: Tidak membuktikan transparansi atau kemampuan mediasi. Kelompok dependensi: `DRAFT-G6B4-L17-SOURCE`.

### Kartika — managing

Identitas `lintang:Buda:Wage`, mapping `DRAFT-G6B4-L18-MAN-01`, keputusan **PERLU INTERPRETASI**.

> mengerti nilai uang (ekonomis)

Pemahaman ekonomis memberi hipotesis pengelolaan uang pribadi. Batas: Tidak menyatakan aktivitas mengelola anggaran atau sumber daya. Kelompok dependensi: `DRAFT-G6B4-L18-SOURCE`.

### Banyak Angrem — communicating

Identitas `lintang:Sukra:Umanis`, mapping `DRAFT-G6B4-L20-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> suka berterus terang

Gaya penyampaian terbuka disebut langsung. Batas: Keterusterangan bukan bukti ketepatan atau efektivitas pesan. Kelompok dependensi: `DRAFT-G6B4-L20-SOURCE`.

### Ru — managing

Identitas `lintang:Saniscara:Paing`, mapping `DRAFT-G6B4-L21-MAN-01`, keputusan **DIDUKUNG TEKSTUAL**.

> Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan

Aktivitas pengurusan dan urusan keuangan disebut langsung. Batas: Scope rumah tangga/keuangan pribadi; bukan kompetensi manajemen organisasi. Kelompok dependensi: `DRAFT-G6B4-L21-SOURCE`.

### Patrem — communicating

Identitas `lintang:Redite:Pon`, mapping `DRAFT-G6B4-L22-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> pandai berdiplomasi

Diplomasi adalah aktivitas komunikasi yang disebut eksplisit. Batas: Konteks licin/pamer tetap terlihat; bukan bukti ketulusan. Kelompok dependensi: `DRAFT-G6B4-L22-SOURCE`.

### Depat — communicating

Identitas `lintang:Anggara:Kliwon`, mapping `DRAFT-G6B4-L24-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> Pintar menyusun kata-kata sehingga bicaranya menyenangkan pendengar

Penyusunan pesan dan respons pendengar disebut langsung. Batas: Tidak menyimpulkan kemampuan koordinasi. Kelompok dependensi: `DRAFT-G6B4-L24-SOURCE`.

### Puwuh Atarung — managing

Identitas `lintang:Saniscara:Wage`, mapping `DRAFT-G6B4-L28-MAN-01`, keputusan **DIDUKUNG TEKSTUAL**.

> Pintar mengatur rumah tangga

Pengaturan disebut sebagai tindakan langsung. Batas: Hanya konteks rumah tangga; tidak otomatis ke organisasi. Kelompok dependensi: `DRAFT-G6B4-L28-SOURCE`.

### Lawean — communicating

Identitas `lintang:Redite:Kliwon`, mapping `DRAFT-G6B4-L29-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> pandai berdiplomasi

Kecenderungan diplomasi disebut langsung. Batas: Bukan bukti kompromi atau kerja tim. Kelompok dependensi: `DRAFT-G6B4-L29-SOURCE`.

### Udang — communicating

Identitas `lintang:Sukra:Kliwon`, mapping `DRAFT-G6B4-L34-COMM-01`, keputusan **DIDUKUNG TEKSTUAL**.

> sangat ahli dalam mengarang atau berdiplomasi

Mengarang/diplomasi menyebut ekspresi pesan secara eksplisit. Batas: Tidak mengubah tafsir kesuksesan menjadi klaim kemampuan aktual. Kelompok dependensi: `DRAFT-G6B4-L34-SOURCE`.

## 3. Perbandingan cakupan 35 identitas

Existing Leader = directing AND communicating AND collaborating: **0/35** pada mapping existing, draft tekstual, dan sensitivitas interpretatif. Directing tidak mempunyai support yang diterima.

Revisi indirect menguji C AND M. Tabel berikut menggunakan prioritas status dari kontrak P0 secara **bersyarat untuk analisis data**; bukan output runtime. Dalam skenario interpretatif, support PERLU INTERPRETASI diperbolehkan hanya sebagai sensitivitas, tidak menjadi support tekstual yang sah untuk Gerbang 1 sebenarnya.

| Skenario | C | M | Indirect lengkap mungkin | Parsial | Ambigu primer | Review/conflict pada profil lengkap | Insufficient primer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| existing | 1 | 0 | 0 | 1 | 0 | 0 | 34 |
| textual | 8 | 2 | 0 | 10 | 5 | 0 | 20 |
| interpretive | 8 | 4 | 0 | 12 | 4 | 0 | 19 |

Definisi:
- Lengkap + parsial + ambigu primer + review + insufficient primer = 35 pada setiap skenario.
- Parsial berarti tepat satu dimensi yang diterima pada skenario itu. Bila dimensi lain ambigu, flag tetap dicatat meski status utama parsial.
- Ambigu primer berarti tidak ada support target yang diterima dan terdapat AMBIGU pada C/M. PERLU INTERPRETASI tidak disulap menjadi AMBIGU; jika tidak diterima dan tidak ada AMBIGU, reason INTERPRETIVE_MAPPING_NOT_ACCEPTED menyertai insufficient.
- “Tanpa support C/M sama sekali” adalah **34/25/23** untuk existing/tekstual/interpretatif. Ini meliputi ambigu/insufficient; berbeda dari insufficient primer **34/20/19**.
- Flag AMBIGU C/M pada draft adalah **5** identitas: Kiriman, Sangka Tikel, Kala Sungsang, Kartika, Kelapa. Pada sensitivitas interpretatif Kartika menjadi parsial sehingga hanya 4 berstatus ambigu primer; flag ambigu Kartika tidak dihapus.
- Caution pada target C/M tercatat pada **1/1/4** identitas menurut tiga skenario (existing Begoong; tekstual Salah Ukur; interpretatif Bubu Bolong, Naga, Salah Ukur, Begoong). Ini konteks, bukan penalti.
- Konflik/review yang menahan **profil lengkap** = 0 karena profil lengkap = 0. Angka nol ini bukan bukti bahwa semua konteks aman.
- Tidak ada kontradiksi langsung terhadap profil lengkap yang diklaim ditemukan. Seluruh konteks caution 33/35 pada audit sebelumnya tetap dipertahankan di tabel berikut. Kukus/Udang tanpa caution eksplisit bukan sifat positif tambahan.

### Semua identitas dan konteks

C = support communicating; M = support managing; — = tidak ada support target yang diterima. Kolom interpretatif hanya sensitivitas. ID dan nama mengikuti master apa adanya.

| No. | Lintang | ID master | Existing | Tekstual | Termasuk interpretatif | Status primer tekstual | Caution asli yang tetap dicatat |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Gajah | `lintang:Redite:Paing` | — | — | — | INSUFFICIENT_EVIDENCE | memiliki pendirian yang sangat kuat dan terkadang sulit dikendalikan nafsunya |
| 2 | Kiriman | `lintang:Soma:Pon` | — | — | — | AMBIGUOUS_EVIDENCE | Meskipun terlihat suka pamer, aslinya sangat berhati-hati dan suka mengalah.; Bicaranya mungkin terdengar keras, namun sebenarnya baik budi, ramah tamah, dan sangat menjunjung tata susila. |
| 3 | Jongsarat | `lintang:Anggara:Wage` | — | — | — | INSUFFICIENT_EVIDENCE | namun cenderung pencemburu dan mudah tersinggung |
| 4 | Tiwa-tiwa | `lintang:Buda:Kliwon` | C | C | C | SUPPORTING_PARTIAL | namun hatinya sensitif dan mudah tersinggung |
| 5 | Sangka Tikel | `lintang:Wraspati:Umanis` | — | — | — | AMBIGUOUS_EVIDENCE | namun terkadang suka mencampuri urusan orang lain dan butuh dorongan agar tidak lekas patah hati |
| 6 | Bubu Bolong | `lintang:Sukra:Paing` | — | — | — | INSUFFICIENT_EVIDENCE | Namun, perlu waspada terhadap sifat pemboros dan kemauan yang terlalu keras. |
| 7 | Sungenge | `lintang:Saniscara:Pon` | — | — | — | INSUFFICIENT_EVIDENCE | senang menunjukkan kepandaian atau kekayaan |
| 8 | Uluku | `lintang:Redite:Wage` | — | — | — | INSUFFICIENT_EVIDENCE | sangat teguh pada pendapatnya jika ditentang; sering memiliki sifat mudah kaget |
| 9 | Pedati | `lintang:Soma:Kliwon` | — | — | — | INSUFFICIENT_EVIDENCE | Meskipun mudah sakit hati, mereka sangat cepat memaafkan dan melupakan dendam. |
| 10 | Kuda | `lintang:Anggara:Umanis` | — | — | — | INSUFFICIENT_EVIDENCE | namun sering kali cemburu dan jengkel jika ada yang menentang pendiriannya |
| 11 | Gajahmina | `lintang:Buda:Paing` | — | — | — | INSUFFICIENT_EVIDENCE | namun jika marah bisa sangat hebat |
| 12 | Bade | `lintang:Wraspati:Pon` | — | — | — | INSUFFICIENT_EVIDENCE | Namun, perlu berhati-hati dengan sifat pamer kepandaian agar tidak mendatangkan bahaya bagi diri sendiri. |
| 13 | Maglut | `lintang:Sukra:Wage` | — | — | — | INSUFFICIENT_EVIDENCE | Sering menjadi korban demi kepentingan keluarga atau saudaranya, namun tetap teguh dengan pendiriannya meskipun harus menderita. |
| 14 | Pagelangan | `lintang:Saniscara:Kliwon` | — | C | C | SUPPORTING_PARTIAL | namun terkadang kurang percaya diri dan mudah putus asa saat menghadapi kesulitan besar |
| 15 | Kala Sungsang | `lintang:Redite:Umanis` | — | — | — | AMBIGUOUS_EVIDENCE | Suka berdebat dan terkadang mencampuri urusan orang lain, namun aslinya berhati kaku. |
| 16 | Kukus | `lintang:Soma:Paing` | — | — | M | INSUFFICIENT_EVIDENCE | Tidak tercatat; bukan jaminan bebas risiko |
| 17 | Asu | `lintang:Anggara:Pon` | — | C | C | SUPPORTING_PARTIAL | namun sulit percaya pada orang baru dan suka berdebat |
| 18 | Kartika | `lintang:Buda:Wage` | — | — | M | AMBIGUOUS_EVIDENCE | bicaranya tegas meskipun terkadang terdengar janggal |
| 19 | Naga | `lintang:Wraspati:Kliwon` | — | — | — | INSUFFICIENT_EVIDENCE | Bicaranya tajam; namun hatinya sangat sensitif sehingga mudah tersinggung dan jatuh dalam kesedihan |
| 20 | Banyak Angrem | `lintang:Sukra:Umanis` | — | C | C | SUPPORTING_PARTIAL | namun jika sudah tidak cocok dengan seseorang, mereka bisa memutus hubungan secara total |
| 21 | Ru | `lintang:Saniscara:Paing` | — | M | M | SUPPORTING_PARTIAL | Memiliki nafsu yang besar dan lekas marah, namun sangat mudah sabar dan menyesal. |
| 22 | Patrem | `lintang:Redite:Pon` | — | C | C | SUPPORTING_PARTIAL | Sangat licin; Suka memperlihatkan kekayaan dan kepandaiannya di hadapan orang lain |
| 23 | Lembu | `lintang:Soma:Wage` | — | — | — | INSUFFICIENT_EVIDENCE | namun jika marah sangat sulit diredakan |
| 24 | Depat | `lintang:Anggara:Kliwon` | — | C | C | SUPPORTING_PARTIAL | namun terkadang memiliki pikiran yang keruh dan sulit percaya pada orang lain |
| 25 | Tangis | `lintang:Buda:Umanis` | — | — | — | INSUFFICIENT_EVIDENCE | namun sering dilingkupi rasa bimbang dan kesedihan yang mendalam |
| 26 | Salah Ukur | `lintang:Wraspati:Paing` | — | — | — | INSUFFICIENT_EVIDENCE | namun bicaranya terkadang menyinggung atau salah terka terhadap orang lain |
| 27 | Prahu Pegat | `lintang:Sukra:Pon` | — | — | — | INSUFFICIENT_EVIDENCE | Namun, sering merasa bimbang dan sedih hati yang membuat kemauannya mudah terputus di tengah jalan. |
| 28 | Puwuh Atarung | `lintang:Saniscara:Wage` | — | M | M | SUPPORTING_PARTIAL | sangat murah hati kepada mereka yang memuji dirinya; namun cenderung pencemburu |
| 29 | Lawean | `lintang:Redite:Kliwon` | — | C | C | SUPPORTING_PARTIAL | namun sulit diubah jika sudah memiliki pendapat sendiri |
| 30 | Kelapa | `lintang:Soma:Umanis` | — | — | — | AMBIGUOUS_EVIDENCE | namun memiliki kegemaran mengembara dan berdebat |
| 31 | Yuyu | `lintang:Anggara:Paing` | — | — | — | INSUFFICIENT_EVIDENCE | namun cenderung serakah terhadap apa yang dilihat dan mudah menyesal setelah bertindak emosional |
| 32 | Lumbung | `lintang:Buda:Pon` | — | — | — | INSUFFICIENT_EVIDENCE | namun mudah tersinggung jika merasa tidak dihargai |
| 33 | Kumba | `lintang:Wraspati:Wage` | — | — | — | INSUFFICIENT_EVIDENCE | namun cenderung pendendam jika merasa disalahi |
| 34 | Udang | `lintang:Sukra:Kliwon` | — | C | C | SUPPORTING_PARTIAL | Tidak tercatat; bukan jaminan bebas risiko |
| 35 | Begoong | `lintang:Saniscara:Umanis` | — | — | — | INSUFFICIENT_EVIDENCE | namun bicaranya tajam dan sering mencampuri urusan orang lain |

Tidak ada count Ketua aktual: data di atas tidak menyediakan graf relasi Samyoga anggota. Profil indirect lengkap nol membuat Gerbang 1 tertutup pada semua identitas yang diaudit, apa pun jumlah Utama yang mungkin dimiliki anggota nyata.

## 4. Graf sintetis untuk memeriksa kontrak, bukan hasil kalender

Seluruh node a..f hanya token. Status profil pada kasus berikut merupakan asumsi formal yang sengaja dapat memenuhi dua support; **tidak dipetakan ke Lintang, tanggal lahir, atau orang nyata**. Tidak ada kutipan Palintangan sintetis, sumber verified atau approval budaya rekaan.

Profil fixture memakai token `textual/interpretive/ambiguous/absent`; kata textual berarti asumsi kasus tentang syarat semantik, bukan evidence yang benar-benar disetujui. `policyAssumedForDesign` hanya asumsi logika untuk pengujian, tidak diterima gate produksi. `same_explicit` mengasumsikan satu frasa memuat dua makna eksplisit; tidak ada master aktual yang diklaim memenuhi kombinasi itu.

Semua graf dasar lengkap, tanpa self-pair, kategori tunggal per pasangan, canonical key memakai helper G2. Case invalid menghapus/menduplikasi edge atau memasukkan summary yang bertentangan; tidak pernah dipercaya untuk count.

| Graf sintetis | N | Pasangan | Total U/M/N | Utama per node | Minimum Utama |
| --- | --- | --- | --- | --- | --- |
| SYN-G3-ALL-U | 3 | 3 | 3/0/0 | a=2, b=2, c=2 | 2 |
| SYN-G4-MIX | 4 | 6 | 4/1/1 | a=3, b=2, c=2, d=1 | 2 |
| SYN-G4-LOW | 4 | 6 | 2/4/0 | a=2, b=1, c=1, d=0 | 2 |
| SYN-G5-MIX | 5 | 10 | 6/4/0 | a=3, b=3, c=3, d=2, e=1 | 3 |
| SYN-G6-ALL-U | 6 | 15 | 15/0/0 | a=5, b=5, c=5, d=5, e=5, f=5 | 3 |

Counts dihitung dari edge, tidak diisi bebas. SYN-G4-MIX menunjukkan b tetap lolos dengan 2 Utama dan 1 Nista. Nista tidak menjadi veto. Jika a dan b memenuhi profil, perbedaan 3 versus 2 Utama tidak memilih a selama comparator UNKNOWN.

## 5. Matriks 29 kasus desain

Seluruh kelompok mempertahankan comparator UNKNOWN, selectedChair null, deputy null. Daftar kandidat adalah set, bukan ranking. Hasil kasus adalah expected outcome desain P0, bukan keluaran sandbox G6A.8 yang tidak diubah.

| ID | Skenario | Graf | Expected outcome | Reason code | Penjelasan dan batas |
| --- | --- | --- | --- | --- | --- |
| P0-01 | Dua support tekstual yang sah | Tanpa graf | INDIRECT_SUPPORTED | INDIRECT_COMM_MAN_TEXTUAL | Satu frasa formal diasumsikan eksplisit memuat dua makna dengan dua pemetaan sah; bukan dua bukti independen. |
| P0-02 | Satu support tekstual saja | Tanpa graf | SUPPORTING_PARTIAL | INDIRECT_DIMENSION_MISSING | Komunikasi saja tidak melengkapi profil. |
| P0-03 | Salah satu support interpretatif | Tanpa graf | SUPPORTING_PARTIAL | INTERPRETIVE_MAPPING_NOT_ACCEPTED | Managing interpretatif tidak dipromosikan menjadi support tekstual. |
| P0-04 | Dua support dan caution relevan | Tanpa graf | REVIEW_REQUIRED | RELEVANT_CAUTION_REVIEW_REQUIRED | Konteks langsung membatasi inferensi; support tetap dicatat, rekomendasi tegas ditahan. |
| P0-05 | Dua support dan caution tidak terkait | Tanpa graf | INDIRECT_SUPPORTED | CAUTION_CONTEXT_RETAINED | Caution tetap tampil tanpa penalti karena sudah dinyatakan tidak terkait. |
| P0-06 | Dua tafsir dari satu frasa ambigu | Tanpa graf | AMBIGUOUS_EVIDENCE | REQUIRED_MAPPING_AMBIGUOUS | Menggandakan satu frasa ambigu tidak menghasilkan dua dimensi sah. |
| P0-07 | Dua support dari frasa berbeda | Tanpa graf | INDIRECT_SUPPORTED | INDIRECT_COMM_MAN_TEXTUAL | Dua frasa berbeda tetap dari satu sumber, tidak memberi bonus atau kekuatan relatif. |
| P0-08 | Tidak ada irisan aktual pada satu Lintang | Tanpa graf | Irisan 0/0/0 | EMPTY_ACTUAL_INTERSECTION | Irisan 0/0/0; tidak ada aturan yang operasional pada data aktual. |
| P0-09 | Dua kandidat, Utama berbeda | SYN-G4-MIX | CANDIDATES_MULTIPLE; Q={a,b} | MULTIPLE_SYMBOLIC_CANDIDATES; NO_FORCED_WINNER | a=3 dan b=2 Utama pada N=4; keduanya lolos minimum 2. Tidak memilih a. |
| P0-10 | Kandidat tunggal memenuhi dua gerbang | SYN-G3-ALL-U | CANDIDATE_SINGLE; Q={a} | SINGLE_SYMBOLIC_CANDIDATE | Hanya a diasumsikan memiliki profil lengkap; 2 Utama pada N=3 cukup. Bukan Ketua terpilih. |
| P0-11 | Dua kandidat sama-sama lolos | SYN-G3-ALL-U | CANDIDATES_MULTIPLE; Q={a,b} | MULTIPLE_SYMBOLIC_CANDIDATES | a dan b masing-masing 2 Utama. Semua kandidat, tidak ada Wakil. |
| P0-12 | Profil lengkap tetapi Samyoga di bawah ambang | SYN-G4-LOW | NO_CANDIDATE; Q={} | SAMYOGA_THRESHOLD_NOT_MET | b hanya 1 Utama pada N=4; minimum 2. Profil tidak menutupi gerbang relasi. |
| P0-13 | Graf tidak lengkap | SYN-G4-MIX | NOT_EVALUATED; Q={} | INVALID_PAIR_GRAPH | Menghapus satu edge membuat graf tidak lengkap; tidak menampilkan kandidat final. |
| P0-14 | Comparator Otonan UNKNOWN | SYN-G4-MIX | CANDIDATES_MULTIPLE; Q={a,b} | COMPARATOR_UNKNOWN; ALLOCATION_NOT_REQUESTED | Eligibility tidak berarti EQUIVALENT atau dominasi. Peran terpilih dan Wakil tetap null. |
| P0-15 | Nama dan urutan berubah | SYN-G4-MIX | CANDIDATES_MULTIPLE; Q={a,b} | INPUT_ORDER_NOT_PRIORITY | Balik urutan dan ganti label/ID dengan bijeksi; himpunan kandidat ekuivalen setelah pemetaan balik, tanpa ranking. |
| P0-16 | Tidak ada mapping yang dapat digunakan | Tanpa graf | INSUFFICIENT_EVIDENCE | NO_USABLE_SUPPORT | Scope tersedia tetapi tidak ada support C/M yang diterima; bukan vonis terhadap orang. |
| P0-17 | Boundary hari Bali existing | Tanpa graf | Jongsarat → Tiwa-tiwa | EXISTING_BALI_DAY_BOUNDARY | Fixture regresi existing 2005-07-27: 05:59 Jongsarat, 06:00 Tiwa-tiwa. Hanya pengujian boundary, tidak disambungkan ke graf sintetis. |
| P0-18 | Provenance tetap missing | Tanpa graf | INDIRECT_SUPPORTED | PROVENANCE_MISSING; EXPERIMENTAL_ONLY | Profil bersyarat boleh dijelaskan dalam desain internal yang diasumsikan siap; provenance tetap missing. Produksi tidak siap. |
| P0-19 | Zodiak tidak digunakan | Tanpa graf | INDIRECT_SUPPORTED | ZODIAC_NOT_AN_INPUT | Nilai tambahan arbitrer tidak mengubah hasil profil. Tidak dipakai untuk alasan rekomendasi. |
| P0-20 | Wakil tetap null | Tanpa graf | Wakil null | NO_AUTOMATIC_DEPUTY | Seluruh kasus kelompok mempertahankan deputy null. |
| P0-21 | Kontradiksi langsung pada inferensi | Tanpa graf | REVIEW_REQUIRED | DIRECT_CONTRADICTION_REVIEW_REQUIRED | Token kontradiksi formal bukan kutipan master; model menahan inferensi yang bertentangan. |
| P0-22 | Ambigu tanpa support sah | Tanpa graf | AMBIGUOUS_EVIDENCE | REQUIRED_MAPPING_AMBIGUOUS | Tidak ada support sah dan ada hipotesis ambigu; bukan profil parsial yang lengkap. |
| P0-23 | Scope atau policy belum tersedia | Tanpa graf | NOT_EVALUATED | MAPPING_POLICY_UNDECIDED | Walau dua token support tersedia, policy belum dipilih sehingga tidak dievaluasi. |
| P0-24 | Relevansi caution belum terselesaikan | Tanpa graf | REVIEW_REQUIRED | CAUTION_RELEVANCE_UNRESOLVED | Tidak menebak caution yang belum dipahami sebagai aman. |
| P0-25 | Tiga kandidat tanpa hierarki | SYN-G5-MIX | CANDIDATES_MULTIPLE; Q={a,b,c} | MULTIPLE_SYMBOLIC_CANDIDATES | a,b,c masing-masing 3 Utama pada N=5. Tidak memilih dari tiga kandidat. |
| P0-26 | Enam anggota dan minimum tiga Utama | SYN-G6-ALL-U | CANDIDATE_SINGLE; Q={a} | SINGLE_SYMBOLIC_CANDIDATE | N=6 minimum 3; a mempunyai 5 Utama. Tidak memberi skor 5 atau menganggapnya lebih kuat. |
| P0-27 | Summary valid jumlah tetapi salah incidence | SYN-G4-MIX | NOT_EVALUATED; Q={} | RELATION_SUMMARY_MISMATCH | Summary a berjumlah 3 tetapi salah kategori dibanding edge incident; ditolak. |
| P0-28 | Reverse duplicate menggantikan pasangan | SYN-G4-MIX | NOT_EVALUATED; Q={} | INVALID_PAIR_GRAPH | Edge a–b dan b–a tidak menjadi dua pasangan; jumlah edge benar tidak menyelamatkan duplikasi. |
| P0-29 | Satu anggota tertahan review | SYN-G4-MIX | NOT_EVALUATED; Q={} | CANDIDATE_SET_INCOMPLETE | a hanya Q sementara karena b masih review. Kelompok NOT_EVALUATED, bukan klaim satu kandidat final. |

Kasus P0-17 menggunakan fixture tanggal yang **sudah ada** di tes R1 untuk memastikan boundary mesin tidak berubah. Nama Jongsarat/Tiwa-tiwa diambil dari engine aktual; fixture ini tidak digunakan untuk mengarang pasangan, pemimpin, atau cakupan.

### Data terstruktur untuk pemeriksaan ad hoc read-only

Blok berikut adalah data dokumentasi. Tidak diimpor jalur runtime atau ditambahkan ke registry sandbox. Marker sintetis tidak mempunyai authority approval. Bagian actualCoverage/perLintang berasal dari data master dan draft; bagian syntheticGraphs/designCases terpisah secara eksplisit.

```json
{
  "schemaVersion": "g6b5p0-document-design-cases-v1",
  "scope": "documentation-only-no-runtime-approval",
  "actualCoverage": {
    "assertions": 72,
    "linkedExisting": 3,
    "newDraft": 69,
    "decisions": {
      "DIDUKUNG TEKSTUAL": 16,
      "PERLU INTERPRETASI": 21,
      "AMBIGU": 23,
      "TIDAK DIDUKUNG": 12
    },
    "leaderCounts": {
      "existing": 0,
      "draftTextual": 0,
      "draftInterpretive": 0
    },
    "scenarios": {
      "existing": {
        "communicating": [
          "Tiwa-tiwa"
        ],
        "managing": [],
        "intersection": [],
        "states": {
          "INDIRECT_SUPPORTED": 0,
          "SUPPORTING_PARTIAL": 1,
          "AMBIGUOUS_EVIDENCE": 0,
          "REVIEW_REQUIRED": 0,
          "INSUFFICIENT_EVIDENCE": 34
        },
        "withoutAnyTargetSupport": 34,
        "ambiguousFlags": 0,
        "targetCautionFlags": 1
      },
      "textual": {
        "communicating": [
          "Tiwa-tiwa",
          "Pagelangan",
          "Asu",
          "Banyak Angrem",
          "Patrem",
          "Depat",
          "Lawean",
          "Udang"
        ],
        "managing": [
          "Ru",
          "Puwuh Atarung"
        ],
        "intersection": [],
        "states": {
          "INDIRECT_SUPPORTED": 0,
          "SUPPORTING_PARTIAL": 10,
          "AMBIGUOUS_EVIDENCE": 5,
          "REVIEW_REQUIRED": 0,
          "INSUFFICIENT_EVIDENCE": 20
        },
        "withoutAnyTargetSupport": 25,
        "ambiguousFlags": 5,
        "targetCautionFlags": 1
      },
      "interpretive": {
        "communicating": [
          "Tiwa-tiwa",
          "Pagelangan",
          "Asu",
          "Banyak Angrem",
          "Patrem",
          "Depat",
          "Lawean",
          "Udang"
        ],
        "managing": [
          "Kukus",
          "Kartika",
          "Ru",
          "Puwuh Atarung"
        ],
        "intersection": [],
        "states": {
          "INDIRECT_SUPPORTED": 0,
          "SUPPORTING_PARTIAL": 12,
          "AMBIGUOUS_EVIDENCE": 4,
          "REVIEW_REQUIRED": 0,
          "INSUFFICIENT_EVIDENCE": 19
        },
        "withoutAnyTargetSupport": 23,
        "ambiguousFlags": 5,
        "targetCautionFlags": 4
      }
    }
  },
  "perLintang": [
    {
      "id": "lintang:Redite:Paing",
      "name": "Gajah",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Soma:Pon",
      "name": "Kiriman",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "AMBIGUOUS_EVIDENCE"
    },
    {
      "id": "lintang:Anggara:Wage",
      "name": "Jongsarat",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Buda:Kliwon",
      "name": "Tiwa-tiwa",
      "existing": [
        "communicating"
      ],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Wraspati:Umanis",
      "name": "Sangka Tikel",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "AMBIGUOUS_EVIDENCE"
    },
    {
      "id": "lintang:Sukra:Paing",
      "name": "Bubu Bolong",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Saniscara:Pon",
      "name": "Sungenge",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Redite:Wage",
      "name": "Uluku",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Soma:Kliwon",
      "name": "Pedati",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Anggara:Umanis",
      "name": "Kuda",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Buda:Paing",
      "name": "Gajahmina",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Wraspati:Pon",
      "name": "Bade",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Sukra:Wage",
      "name": "Maglut",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Saniscara:Kliwon",
      "name": "Pagelangan",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Redite:Umanis",
      "name": "Kala Sungsang",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "AMBIGUOUS_EVIDENCE"
    },
    {
      "id": "lintang:Soma:Paing",
      "name": "Kukus",
      "existing": [],
      "textual": [],
      "interpretive": [
        "managing"
      ],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Anggara:Pon",
      "name": "Asu",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Buda:Wage",
      "name": "Kartika",
      "existing": [],
      "textual": [],
      "interpretive": [
        "managing"
      ],
      "textualState": "AMBIGUOUS_EVIDENCE"
    },
    {
      "id": "lintang:Wraspati:Kliwon",
      "name": "Naga",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Sukra:Umanis",
      "name": "Banyak Angrem",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Saniscara:Paing",
      "name": "Ru",
      "existing": [],
      "textual": [
        "managing"
      ],
      "interpretive": [
        "managing"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Redite:Pon",
      "name": "Patrem",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Soma:Wage",
      "name": "Lembu",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Anggara:Kliwon",
      "name": "Depat",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Buda:Umanis",
      "name": "Tangis",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Wraspati:Paing",
      "name": "Salah Ukur",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Sukra:Pon",
      "name": "Prahu Pegat",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Saniscara:Wage",
      "name": "Puwuh Atarung",
      "existing": [],
      "textual": [
        "managing"
      ],
      "interpretive": [
        "managing"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Redite:Kliwon",
      "name": "Lawean",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Soma:Umanis",
      "name": "Kelapa",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "AMBIGUOUS_EVIDENCE"
    },
    {
      "id": "lintang:Anggara:Paing",
      "name": "Yuyu",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Buda:Pon",
      "name": "Lumbung",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Wraspati:Wage",
      "name": "Kumba",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    },
    {
      "id": "lintang:Sukra:Kliwon",
      "name": "Udang",
      "existing": [],
      "textual": [
        "communicating"
      ],
      "interpretive": [
        "communicating"
      ],
      "textualState": "SUPPORTING_PARTIAL"
    },
    {
      "id": "lintang:Saniscara:Umanis",
      "name": "Begoong",
      "existing": [],
      "textual": [],
      "interpretive": [],
      "textualState": "INSUFFICIENT_EVIDENCE"
    }
  ],
  "syntheticGraphs": [
    {
      "id": "SYN-G3-ALL-U",
      "origin": "synthetic-design-only",
      "nodes": [
        "a",
        "b",
        "c"
      ],
      "pairs": [
        {
          "a": "a",
          "b": "b",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "c",
          "category": "Utama"
        }
      ]
    },
    {
      "id": "SYN-G4-MIX",
      "origin": "synthetic-design-only",
      "nodes": [
        "a",
        "b",
        "c",
        "d"
      ],
      "pairs": [
        {
          "a": "a",
          "b": "b",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "d",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "d",
          "category": "Nista"
        },
        {
          "a": "c",
          "b": "d",
          "category": "Madia"
        }
      ]
    },
    {
      "id": "SYN-G4-LOW",
      "origin": "synthetic-design-only",
      "nodes": [
        "a",
        "b",
        "c",
        "d"
      ],
      "pairs": [
        {
          "a": "a",
          "b": "b",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "d",
          "category": "Madia"
        },
        {
          "a": "b",
          "b": "c",
          "category": "Madia"
        },
        {
          "a": "b",
          "b": "d",
          "category": "Madia"
        },
        {
          "a": "c",
          "b": "d",
          "category": "Madia"
        }
      ]
    },
    {
      "id": "SYN-G5-MIX",
      "origin": "synthetic-design-only",
      "nodes": [
        "a",
        "b",
        "c",
        "d",
        "e"
      ],
      "pairs": [
        {
          "a": "a",
          "b": "b",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "d",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "e",
          "category": "Madia"
        },
        {
          "a": "b",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "d",
          "category": "Madia"
        },
        {
          "a": "b",
          "b": "e",
          "category": "Utama"
        },
        {
          "a": "c",
          "b": "d",
          "category": "Utama"
        },
        {
          "a": "c",
          "b": "e",
          "category": "Madia"
        },
        {
          "a": "d",
          "b": "e",
          "category": "Madia"
        }
      ]
    },
    {
      "id": "SYN-G6-ALL-U",
      "origin": "synthetic-design-only",
      "nodes": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
      ],
      "pairs": [
        {
          "a": "a",
          "b": "b",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "d",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "e",
          "category": "Utama"
        },
        {
          "a": "a",
          "b": "f",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "c",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "d",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "e",
          "category": "Utama"
        },
        {
          "a": "b",
          "b": "f",
          "category": "Utama"
        },
        {
          "a": "c",
          "b": "d",
          "category": "Utama"
        },
        {
          "a": "c",
          "b": "e",
          "category": "Utama"
        },
        {
          "a": "c",
          "b": "f",
          "category": "Utama"
        },
        {
          "a": "d",
          "b": "e",
          "category": "Utama"
        },
        {
          "a": "d",
          "b": "f",
          "category": "Utama"
        },
        {
          "a": "e",
          "b": "f",
          "category": "Utama"
        }
      ]
    }
  ],
  "designCases": [
    {
      "id": "P0-01",
      "title": "Dua support tekstual yang sah",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "same_explicit",
      "caution": "none_recorded",
      "expected": {
        "status": "INDIRECT_SUPPORTED",
        "eligibleForProfile": true
      }
    },
    {
      "id": "P0-02",
      "title": "Satu support tekstual saja",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "absent",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "expected": {
        "status": "SUPPORTING_PARTIAL",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-03",
      "title": "Salah satu support interpretatif",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "interpretive",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "expected": {
        "status": "SUPPORTING_PARTIAL",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-04",
      "title": "Dua support dan caution relevan",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "related",
      "expected": {
        "status": "REVIEW_REQUIRED",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-05",
      "title": "Dua support dan caution tidak terkait",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "unrelated",
      "expected": {
        "status": "INDIRECT_SUPPORTED",
        "eligibleForProfile": true
      }
    },
    {
      "id": "P0-06",
      "title": "Dua tafsir dari satu frasa ambigu",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "ambiguous",
      "M": "ambiguous",
      "phraseRelation": "same_ambiguous",
      "caution": "none_recorded",
      "expected": {
        "status": "AMBIGUOUS_EVIDENCE",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-07",
      "title": "Dua support dari frasa berbeda",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "expected": {
        "status": "INDIRECT_SUPPORTED",
        "eligibleForProfile": true
      }
    },
    {
      "id": "P0-08",
      "title": "Tidak ada irisan aktual pada satu Lintang",
      "kind": "actual_intersection",
      "expected": {
        "existing": 0,
        "textual": 0,
        "interpretive": 0
      }
    },
    {
      "id": "P0-09",
      "title": "Dua kandidat, Utama berbeda",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED",
        "b": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATES_MULTIPLE",
        "candidateIds": [
          "a",
          "b"
        ],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-10",
      "title": "Kandidat tunggal memenuhi dua gerbang",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G3-ALL-U",
      "profiles": {
        "a": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATE_SINGLE",
        "candidateIds": [
          "a"
        ],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-11",
      "title": "Dua kandidat sama-sama lolos",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G3-ALL-U",
      "profiles": {
        "a": "INDIRECT_SUPPORTED",
        "b": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATES_MULTIPLE",
        "candidateIds": [
          "a",
          "b"
        ],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-12",
      "title": "Profil lengkap tetapi Samyoga di bawah ambang",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-LOW",
      "profiles": {
        "b": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "NO_CANDIDATE",
        "candidateIds": [],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-13",
      "title": "Graf tidak lengkap",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "NOT_EVALUATED",
        "candidateIds": [],
        "selectedChair": null,
        "deputy": null
      },
      "mutation": "missing_pair"
    },
    {
      "id": "P0-14",
      "title": "Comparator Otonan UNKNOWN",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED",
        "b": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATES_MULTIPLE",
        "candidateIds": [
          "a",
          "b"
        ],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-15",
      "title": "Nama dan urutan berubah",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED",
        "b": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATES_MULTIPLE",
        "candidateIds": [
          "a",
          "b"
        ],
        "selectedChair": null,
        "deputy": null
      },
      "verifyReversalAndRename": true
    },
    {
      "id": "P0-16",
      "title": "Tidak ada mapping yang dapat digunakan",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "absent",
      "M": "absent",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "expected": {
        "status": "INSUFFICIENT_EVIDENCE",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-17",
      "title": "Boundary hari Bali existing",
      "kind": "existing_boundary_contract",
      "source": "tests/otonan-palintangan.test.mjs",
      "birthDate": "2005-07-27",
      "times": [
        "05:59",
        "06:00"
      ],
      "expected": {
        "before": "Jongsarat",
        "after": "Tiwa-tiwa"
      }
    },
    {
      "id": "P0-18",
      "title": "Provenance tetap missing",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "provenance": "missing",
      "expected": {
        "status": "INDIRECT_SUPPORTED",
        "eligibleForProfile": true,
        "productionReady": false
      }
    },
    {
      "id": "P0-19",
      "title": "Zodiak tidak digunakan",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "untrustedExtra": {
        "zodiac": "arbitrary-symbol"
      },
      "expected": {
        "status": "INDIRECT_SUPPORTED",
        "eligibleForProfile": true
      }
    },
    {
      "id": "P0-20",
      "title": "Wakil tetap null",
      "kind": "all_groups_deputy_null",
      "expected": {
        "deputy": null
      }
    },
    {
      "id": "P0-21",
      "title": "Kontradiksi langsung pada inferensi",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "direct_contradiction",
      "expected": {
        "status": "REVIEW_REQUIRED",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-22",
      "title": "Ambigu tanpa support sah",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "ambiguous",
      "M": "absent",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "expected": {
        "status": "AMBIGUOUS_EVIDENCE",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-23",
      "title": "Scope atau policy belum tersedia",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": false,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "none_recorded",
      "expected": {
        "status": "NOT_EVALUATED",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-24",
      "title": "Relevansi caution belum terselesaikan",
      "kind": "synthetic_profile",
      "origin": "synthetic-logic-only",
      "policyAssumedForDesign": true,
      "C": "textual",
      "M": "textual",
      "phraseRelation": "different",
      "caution": "unknown_relevance",
      "expected": {
        "status": "REVIEW_REQUIRED",
        "eligibleForProfile": false
      }
    },
    {
      "id": "P0-25",
      "title": "Tiga kandidat tanpa hierarki",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G5-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED",
        "b": "INDIRECT_SUPPORTED",
        "c": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATES_MULTIPLE",
        "candidateIds": [
          "a",
          "b",
          "c"
        ],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-26",
      "title": "Enam anggota dan minimum tiga Utama",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G6-ALL-U",
      "profiles": {
        "a": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "CANDIDATE_SINGLE",
        "candidateIds": [
          "a"
        ],
        "selectedChair": null,
        "deputy": null
      }
    },
    {
      "id": "P0-27",
      "title": "Summary valid jumlah tetapi salah incidence",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "NOT_EVALUATED",
        "candidateIds": [],
        "selectedChair": null,
        "deputy": null
      },
      "summaryOverride": {
        "memberId": "a",
        "counts": {
          "Utama": 0,
          "Madia": 3,
          "Nista": 0
        }
      }
    },
    {
      "id": "P0-28",
      "title": "Reverse duplicate menggantikan pasangan",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "NOT_EVALUATED",
        "candidateIds": [],
        "selectedChair": null,
        "deputy": null
      },
      "mutation": "reverse_duplicate_pair"
    },
    {
      "id": "P0-29",
      "title": "Satu anggota tertahan review",
      "kind": "synthetic_group",
      "origin": "synthetic-design-only",
      "graphId": "SYN-G4-MIX",
      "profiles": {
        "a": "INDIRECT_SUPPORTED",
        "b": "REVIEW_REQUIRED"
      },
      "comparator": "UNKNOWN",
      "expected": {
        "status": "NOT_EVALUATED",
        "candidateIds": [],
        "selectedChair": null,
        "deputy": null
      },
      "expectedProvisionalIds": [
        "a"
      ]
    }
  ]
}
```

## 6. Hasil validasi

Pemeriksaan ad hoc read-only mengekstrak JSON dari dokumen ini, menghitung ulang cakupan dari fixture/master existing, memvalidasi graf dan membandingkan hasil logika desain dengan expected outcome. Tidak ditambahkan evaluator atau tes runtime baru.

| Pemeriksaan yang benar-benar dijalankan | Hasil |
| --- | --- |
| Identitas/nama dan kutipan master | 35/35 identitas, seluruh 72 assertion valid; 12 kutipan support C/M dan seluruh caution yang dicatat sesuai sumber |
| Hitungan assertion/tautan existing | 72 = 3 tertaut existing + 69 baru; kategori 16/21/23/12 cocok |
| Irisan C/M dihitung ulang | 0/0/0 untuk existing/tekstual/interpretatif |
| Cakupan dan baris per-Lintang | 35 baris sesuai master dan seluruh count status sesuai hasil hitung |
| Graf sintetis dasar | 5/5 lengkap, canonical pair unik, incidence dan total kategori konsisten |
| Kasus desain ad hoc | **29/29 konsisten**; bukan tes allocator produksi |
| Transform urutan/identitas | **3/3**: reverse, rename ID bijektif, dan kombinasi keduanya mempertahankan himpunan kandidat |
| Boundary fixture existing | **2/2**, adapter dan engine asli identik pada 05:59/06:00 |
| Tautan lokal | **22/22** valid pada tiga dokumen P0 |
| Registry evidence/rule produksi | Tetap **0/0**, frozen |
| Suite regresi existing | **275/275 lulus**, tanpa fail/skip; tidak dihitung sebagai 29 tes P0 baru |
| Integritas file awal | **131/131 identik SHA-256**, tidak ada perubahan/hilang pada file awal |
| `git diff --check` dan whitespace dokumen baru | Lulus |

TypeScript, ESLint, production build dan browser smoke tidak dijalankan ulang untuk P0 yang hanya menambah Markdown. Kasus sintetis positif menguji kontrak bersyarat; hasil tersebut bukan bukti bahwa profil indirect ditemukan pada master aktual, bukan validasi budaya, dan bukan pengukuran kompetensi.

**HOLD — INDIRECT PROFILE NOT SUPPORTED.** Kasus formal dapat memenuhi kontrak secara hipotetis, tetapi tidak mengubah fakta bahwa irisan C/M aktual kosong.
