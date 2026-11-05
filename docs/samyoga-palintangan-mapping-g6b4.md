# Audit mapping 35 Palintangan — G6B.4

Tanggal: 2 November 2026, WITA. Branch `feat/samyoga-group`, HEAD `3e568b768beb73c445e32db89a9672415e0e7949`. **Dokumen dan simulasi offline; tidak mengaktifkan mapping runtime.**

Source of truth: [getBalineseDate/findLintang](../lib/balinese-calendar.ts), [dataLintang](../lib/data.ts#L518), [adapter bersama Otonan](../lib/otonan-calendar.ts), dan [proyeksi Samyoga](../lib/samyoga-palintangan.ts). Tanggal sipil/waktu/boundary tetap ditangani engine existing; audit ini menggunakan 35 identitas master langsung, tanpa membuat tanggal lahir.

Baseline lokal: 4 tracked modified, 17 untracked, tidak ada staged. G6B.3 dan G6B.3-R1 belum mempunyai checkpoint commit tersendiri; keduanya dipertahankan. Lihat [laporan R1](samyoga-palintangan-integration-g6b3r1.md) dan [inventaris awal](samyoga-palintangan-inventory-g6b3r1.md).

## Kontrak pembacaan

- **DIDUKUNG TEKSTUAL**: hubungan ke dimensi dapat ditunjukkan secara langsung dalam lingkup frasa. Tidak berarti ahli menyetujui, sumber terverifikasi, atau kompetensi empiris terbukti.
- **PERLU INTERPRETASI**: ada konteks terkait, tetapi perlu jembatan konseptual yang dinyatakan, misalnya menolong → hubungan saling membantu atau pengaturan hidup → managing.
- **AMBIGU**: lebih dari satu pembacaan masuk akal, belum layak menjadi support/caution aktif.
- **TIDAK DIDUKUNG**: hipotesis pengaitan ditolak pada audit ini, bukan penilaian negatif terhadap Lintang atau orang.
- Jenis `support/caution/ambiguous` terpisah dari keputusan. Hipotesis yang ditolak memakai jenis `ambiguous` dengan keputusan TIDAK DIDUKUNG; tidak ikut hitungan ambigu yang belum terselesaikan.
- Satu identitas bisa memiliki beberapa keputusan untuk frasa berbeda. Tidak dibuat skor keseluruhan, urutan kualitas Lintang, atau ranking dari jumlah assertion.
- Semua ID baru berawalan `DRAFT-G6B4-`; **bukan evidence produksi**. Hanya tiga tautan ID existing benar-benar berasal dari katalog: C-COMM-03, C-COMM-04, C-EXEC-04. Tiga representasi draft yang tertaut tidak menambah jumlah evidence existing.
- Seluruh mapping per Lintang diberi kelompok dependensi sumber yang sama. Frasa yang digunakan dua kali (misalnya diplomasi Patrem, pengurusan Ru, pengaruh Udang) tidak menjadi dua bukti independen.
- Caution tetap konteks, bukan nilai minus, diskualifikasi, atau konflik otomatis. Frasa “mudah tersinggung” tidak diubah menjadi penalti. Tidak ada keyword classifier; `includes()` pada validator hanya memastikan kutipan utuh terdapat pada master dari **identitas yang tepat**.
- “Ramah” tidak menjadi collaborating; keberanian/keteguhan/derajat/popularitas tidak otomatis menjadi directing; menimbang atau ketelitian tidak otomatis menjadi planning. Label master yang terdengar positif tidak menggantikan bukti pada `penjelasan`.
- Review ahli eksternal **bukan prasyarat baru** untuk menyelesaikan fitur menurut keputusan produk G6B.4. Status sumber/review tetap dicatat apa adanya; tidak ada identitas reviewer atau approval budaya yang dibuat. Keputusan mapping produk untuk G6B.5 dan gate existing tetap terpisah.

Katalog terstruktur: [fixture JSON draft](../tests/fixtures/samyoga-palintangan-mapping-g6b4.json). Ada **72 assertion audit**: 3 tertaut existing + **69 draft baru**. Keputusannya: **16 DIDUKUNG TEKSTUAL, 21 PERLU INTERPRETASI, 23 AMBIGU, 12 TIDAK DIDUKUNG**. Ini jumlah assertion, bukan jumlah orang atau ukuran kekuatan.

## Matriks seluruh identitas

Kolom dimensi mencakup hipotesis support/caution/ambigu yang belum ditolak, bukan aktivasi. Semua 35 nama, identitas, dan teks di bagian berikut diverifikasi terhadap master.

| No. | Lintang | Identifier | Dimensi dibahas | Keputusan per frasa |
| --- | --- | --- | --- | --- |
| 1 | Gajah | `lintang:Redite:Paing` | collaborating | AMBIGU; TIDAK DIDUKUNG |
| 2 | Kiriman | `lintang:Soma:Pon` | communicating, collaborating | AMBIGU |
| 3 | Jongsarat | `lintang:Anggara:Wage` | collaborating | PERLU INTERPRETASI; TIDAK DIDUKUNG |
| 4 | Tiwa-tiwa | `lintang:Buda:Kliwon` | communicating | DIDUKUNG TEKSTUAL; TIDAK DIDUKUNG |
| 5 | Sangka Tikel | `lintang:Wraspati:Umanis` | directing, communicating | AMBIGU |
| 6 | Bubu Bolong | `lintang:Sukra:Paing` | managing | TIDAK DIDUKUNG; PERLU INTERPRETASI |
| 7 | Sungenge | `lintang:Saniscara:Pon` | directing | AMBIGU |
| 8 | Uluku | `lintang:Redite:Wage` | executing, collaborating | DIDUKUNG TEKSTUAL; AMBIGU |
| 9 | Pedati | `lintang:Soma:Kliwon` | collaborating | PERLU INTERPRETASI |
| 10 | Kuda | `lintang:Anggara:Umanis` | executing | DIDUKUNG TEKSTUAL; TIDAK DIDUKUNG |
| 11 | Gajahmina | `lintang:Buda:Paing` | planning | PERLU INTERPRETASI |
| 12 | Bade | `lintang:Wraspati:Pon` | executing | AMBIGU |
| 13 | Maglut | `lintang:Sukra:Wage` | collaborating | AMBIGU |
| 14 | Pagelangan | `lintang:Saniscara:Kliwon` | communicating, executing | DIDUKUNG TEKSTUAL; PERLU INTERPRETASI |
| 15 | Kala Sungsang | `lintang:Redite:Umanis` | communicating, collaborating | AMBIGU |
| 16 | Kukus | `lintang:Soma:Paing` | executing, managing | DIDUKUNG TEKSTUAL; PERLU INTERPRETASI |
| 17 | Asu | `lintang:Anggara:Pon` | communicating, collaborating | DIDUKUNG TEKSTUAL; PERLU INTERPRETASI |
| 18 | Kartika | `lintang:Buda:Wage` | managing, communicating | PERLU INTERPRETASI; TIDAK DIDUKUNG; AMBIGU |
| 19 | Naga | `lintang:Wraspati:Kliwon` | executing, communicating | AMBIGU; PERLU INTERPRETASI |
| 20 | Banyak Angrem | `lintang:Sukra:Umanis` | communicating, collaborating | DIDUKUNG TEKSTUAL; PERLU INTERPRETASI |
| 21 | Ru | `lintang:Saniscara:Paing` | managing | DIDUKUNG TEKSTUAL; TIDAK DIDUKUNG |
| 22 | Patrem | `lintang:Redite:Pon` | communicating, collaborating | DIDUKUNG TEKSTUAL; AMBIGU |
| 23 | Lembu | `lintang:Soma:Wage` | planning, collaborating | PERLU INTERPRETASI; AMBIGU |
| 24 | Depat | `lintang:Anggara:Kliwon` | communicating, collaborating | DIDUKUNG TEKSTUAL; PERLU INTERPRETASI |
| 25 | Tangis | `lintang:Buda:Umanis` | collaborating | PERLU INTERPRETASI |
| 26 | Salah Ukur | `lintang:Wraspati:Paing` | executing, collaborating, communicating | AMBIGU; PERLU INTERPRETASI; DIDUKUNG TEKSTUAL |
| 27 | Prahu Pegat | `lintang:Sukra:Pon` | collaborating, executing | AMBIGU; PERLU INTERPRETASI |
| 28 | Puwuh Atarung | `lintang:Saniscara:Wage` | managing, directing | DIDUKUNG TEKSTUAL; AMBIGU |
| 29 | Lawean | `lintang:Redite:Kliwon` | communicating, collaborating | DIDUKUNG TEKSTUAL; TIDAK DIDUKUNG; AMBIGU |
| 30 | Kelapa | `lintang:Soma:Umanis` | collaborating, communicating | PERLU INTERPRETASI; AMBIGU |
| 31 | Yuyu | `lintang:Anggara:Paing` | collaborating | PERLU INTERPRETASI; TIDAK DIDUKUNG |
| 32 | Lumbung | `lintang:Buda:Pon` | executing, collaborating | DIDUKUNG TEKSTUAL; AMBIGU |
| 33 | Kumba | `lintang:Wraspati:Wage` | planning | PERLU INTERPRETASI; TIDAK DIDUKUNG |
| 34 | Udang | `lintang:Sukra:Kliwon` | communicating, directing, collaborating | DIDUKUNG TEKSTUAL; AMBIGU |
| 35 | Begoong | `lintang:Saniscara:Umanis` | executing, communicating | DIDUKUNG TEKSTUAL; PERLU INTERPRETASI; TIDAK DIDUKUNG |

## 1. Gajah — Redite/Paing

Identitas: `lintang:Redite:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Tenang & Teguh**. Makna asli: **Lakunya Bulan**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Pandai merahasiakan perasaan, meski sedang marah atau menyesal tetap terlihat tenang. Pandai bergaul dan banyak kawan, namun memiliki pendirian yang sangat kuat dan terkadang sulit dikendalikan nafsunya.

**Frasa relevan:** “Pandai bergaul dan banyak kawan”

**Caution asli:** “memiliki pendirian yang sangat kuat dan terkadang sulit dikendalikan nafsunya” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Pandai bergaul dan banyak kawan”; “memiliki pendirian yang sangat kuat”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L01-COLL-01` | Pandai bergaul dan banyak kawan | collaborating / ambiguous | AMBIGU | Pergaulan menunjukkan relasi sosial, belum tindakan berbagi tugas. | Tidak membuktikan kolaborasi tim. | `DRAFT-G6B4-L01-SOURCE` |
| `DRAFT-G6B4-L01-DIR-02` | memiliki pendirian yang sangat kuat | directing / ambiguous | TIDAK DIDUKUNG | Keteguhan pendapat bukan aktivitas mengarahkan orang. | Tidak diterima sebagai support Leader. | `DRAFT-G6B4-L01-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 2. Kiriman — Soma/Pon

Identitas: `lintang:Soma:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Rendah Hati**. Makna asli: **Sumur Sinaba**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Meskipun terlihat suka pamer, aslinya sangat berhati-hati dan suka mengalah. Bicaranya mungkin terdengar keras, namun sebenarnya baik budi, ramah tamah, dan sangat menjunjung tata susila.

**Frasa relevan:** “sangat berhati-hati dan suka mengalah”; “baik budi, ramah tamah, dan sangat menjunjung tata susila”

**Caution asli:** “Meskipun terlihat suka pamer, aslinya sangat berhati-hati dan suka mengalah.”; “Bicaranya mungkin terdengar keras, namun sebenarnya baik budi, ramah tamah, dan sangat menjunjung tata susila.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “suka mengalah”; “ramah tamah”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L02-COMM-01` | Bicaranya mungkin terdengar keras, namun sebenarnya baik budi, ramah tamah, dan sangat menjunjung tata susila. | communicating / ambiguous | AMBIGU | Konteks mengoreksi kesan keras; tidak menyatakan keterampilan menyampaikan pesan. | Tidak memperlakukan kata keras sebagai penalti. | `DRAFT-G6B4-L02-SOURCE` |
| `DRAFT-G6B4-L02-COLL-02` | sangat berhati-hati dan suka mengalah | collaborating / ambiguous | AMBIGU | Mengalah dapat menjaga relasi atau justru menghindari pembahasan. | Bukan bukti kerja bersama atau pembagian tanggung jawab. | `DRAFT-G6B4-L02-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 3. Jongsarat — Anggara/Wage

Identitas: `lintang:Anggara:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Penyelidik Setia**. Makna asli: **Lakunya Bumi**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Suka mengalah dalam pergaulan dan gemar menolong orang yang sedang kesulitan. Sangat mantap dalam menyelidiki hal-hal penting, namun cenderung pencemburu dan mudah tersinggung.

**Frasa relevan:** “gemar menolong orang yang sedang kesulitan”; “Sangat mantap dalam menyelidiki hal-hal penting”

**Caution asli:** “namun cenderung pencemburu dan mudah tersinggung” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Sangat mantap dalam menyelidiki hal-hal penting”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L03-COLL-01` | gemar menolong orang yang sedang kesulitan | collaborating / support | PERLU INTERPRETASI | Menolong memberi tafsir simbolis saling membantu. | Prososial belum menunjukkan kerja tim timbal balik. | `DRAFT-G6B4-L03-SOURCE` |
| `DRAFT-G6B4-L03-PLAN-02` | Sangat mantap dalam menyelidiki hal-hal penting | planning / ambiguous | TIDAK DIDUKUNG | Penyelidikan bukan penyusunan langkah atau rencana. | Tidak dipakai untuk melengkapi Manajemen. | `DRAFT-G6B4-L03-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 4. Tiwa-tiwa — Buda/Kliwon

Identitas: `lintang:Buda:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Penyusun Kata**. Makna asli: **Lakunya Surya**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung.

**Frasa relevan:** “ahli dalam merangkai kata atau mengarang”

**Caution asli:** “namun hatinya sensitif dan mudah tersinggung” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Pandai menimbang sesuatu”; “ramah”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L04-COMM-01` (rujukan existing `C-COMM-03`) | ahli dalam merangkai kata atau mengarang | communicating / support | DIDUKUNG TEKSTUAL | Penyusunan kata secara eksplisit mendukung ekspresi verbal/tulis. | Bisa khusus sastra; tidak membuktikan komunikasi organisasi. Sensitivitas tetap konteks. | `DRAFT-G6B4-L04-SOURCE` |
| `DRAFT-G6B4-L04-PLAN-02` | Pandai menimbang sesuatu | planning / ambiguous | TIDAK DIDUKUNG | Pertimbangan umum tidak menyatakan rencana organisasi. | Tidak dipakai untuk Manajemen. | `DRAFT-G6B4-L04-SOURCE` |
| `DRAFT-G6B4-L04-COLL-03` | ramah | collaborating / ambiguous | TIDAK DIDUKUNG | Keramahan sendiri tidak menyatakan kolaborasi. | Tidak dipakai untuk melengkapi Leader. | `DRAFT-G6B4-L04-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 5. Sangka Tikel — Wraspati/Umanis

Identitas: `lintang:Wraspati:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Visioner Bijak**. Makna asli: **Lakunya Bintang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Memiliki cita-cita setinggi langit, bijaksana, dan pandai bergaul. Bicaranya tegas dan keras, namun terkadang suka mencampuri urusan orang lain dan butuh dorongan agar tidak lekas patah hati.

**Frasa relevan:** “Memiliki cita-cita setinggi langit, bijaksana, dan pandai bergaul”; “Bicaranya tegas dan keras”

**Caution asli:** “namun terkadang suka mencampuri urusan orang lain dan butuh dorongan agar tidak lekas patah hati” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Memiliki cita-cita setinggi langit”; “Bicaranya tegas dan keras”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L05-DIR-01` | Memiliki cita-cita setinggi langit, bijaksana, dan pandai bergaul | directing / ambiguous | AMBIGU | Cita-cita dan kebijaksanaan tidak menjelaskan tindakan mengarahkan. | Tidak menjadi support Leader. | `DRAFT-G6B4-L05-SOURCE` |
| `DRAFT-G6B4-L05-COMM-02` | Bicaranya tegas dan keras | communicating / ambiguous | AMBIGU | Ketegasan bisa jelas atau keras bergantung konteks. | Tidak dinilai otomatis sebagai kelebihan atau kekurangan. | `DRAFT-G6B4-L05-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 6. Bubu Bolong — Sukra/Paing

Identitas: `lintang:Sukra:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Jujur & Dermawan**. Makna asli: **Tunggak Semi**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Pribadi yang ramah, jujur, dan memiliki angan-angan mulia sehingga disukai banyak orang. Namun, perlu waspada terhadap sifat pemboros dan kemauan yang terlalu keras.

**Frasa relevan:** “Pribadi yang ramah, jujur, dan memiliki angan-angan mulia sehingga disukai banyak orang”

**Caution asli:** “Namun, perlu waspada terhadap sifat pemboros dan kemauan yang terlalu keras.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “ramah”; “angan-angan mulia”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L06-COLL-01` | ramah | collaborating / ambiguous | TIDAK DIDUKUNG | Keramahan bukan bukti kerja sama. | Tidak mengaktifkan kolaborasi. | `DRAFT-G6B4-L06-SOURCE` |
| `DRAFT-G6B4-L06-MAN-02` | sifat pemboros | managing / caution | PERLU INTERPRETASI | Pemborosan bisa membatasi tafsir pengelolaan sumber daya. | Konteks ekonomi pribadi; tidak otomatis mengurangi kelayakan jabatan. | `DRAFT-G6B4-L06-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 7. Sungenge — Saniscara/Pon

Identitas: `lintang:Saniscara:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Berwibawa Tinggi**. Makna asli: **Lakunya Air**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Bercita-cita mulia dan senang menunjukkan kepandaian atau kekayaan. Disegani oleh orang banyak dan memiliki sifat pemaaf bagi mereka yang mengakui kesalahan.

**Frasa relevan:** “Disegani oleh orang banyak”

**Caution asli:** “senang menunjukkan kepandaian atau kekayaan” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Disegani oleh orang banyak”; “Bercita-cita mulia”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L07-DIR-01` | Disegani oleh orang banyak | directing / ambiguous | AMBIGU | Wibawa sosial mungkin terkait pengaruh, tetapi bukan pengarahan. | Tidak menjadi indikator kepemimpinan yang disahkan. | `DRAFT-G6B4-L07-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 8. Uluku — Redite/Wage

Identitas: `lintang:Redite:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Pekerja Keras**. Makna asli: **Lakunya Angin**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sangat suka bekerja dan pandai menjaga rahasia penting. Meskipun dermawan, mereka sangat teguh pada pendapatnya jika ditentang dan sering memiliki sifat mudah kaget.

**Frasa relevan:** “Sangat suka bekerja”

**Caution asli:** “sangat teguh pada pendapatnya jika ditentang”; “sering memiliki sifat mudah kaget” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “pandai menjaga rahasia penting”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L08-EXEC-01` | Sangat suka bekerja | executing / support | DIDUKUNG TEKSTUAL | Teks eksplisit mengenai kecenderungan bekerja. | Kesukaan bukan bukti ketuntasan atau kualitas kerja. | `DRAFT-G6B4-L08-SOURCE` |
| `DRAFT-G6B4-L08-COLL-02` | sangat teguh pada pendapatnya jika ditentang | collaborating / ambiguous | AMBIGU | Keteguhan bisa prinsip atau hambatan kompromi. | Tidak otomatis menjadi caution pemblokir. | `DRAFT-G6B4-L08-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 9. Pedati — Soma/Kliwon

Identitas: `lintang:Soma:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Pengorban Tulus**. Makna asli: **Satria Wirang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Lemah lembut dan berkelakuan pantas. Meskipun mudah sakit hati, mereka sangat cepat memaafkan dan melupakan dendam. Rela berkorban demi keadilan bagi orang lain.

**Frasa relevan:** “sangat cepat memaafkan dan melupakan dendam”; “Rela berkorban demi keadilan bagi orang lain”

**Caution asli:** “Meskipun mudah sakit hati, mereka sangat cepat memaafkan dan melupakan dendam.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Rela berkorban demi keadilan bagi orang lain”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L09-COLL-01` | Rela berkorban demi keadilan bagi orang lain | collaborating / support | PERLU INTERPRETASI | Kepedulian untuk orang lain memberi hipotesis tindakan prososial. | Pengorbanan bukan otomatis kolaborasi tim; menjaga batas diri tetap relevan. | `DRAFT-G6B4-L09-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 10. Kuda — Anggara/Umanis

Identitas: `lintang:Anggara:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Tangkas & Maju**. Makna asli: **Lakunya Api**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sangat tangkas dalam bekerja dan selalu mengejar kemajuan. Memiliki cita-cita besar namun sering kali cemburu dan jengkel jika ada yang menentang pendiriannya.

**Frasa relevan:** “Sangat tangkas dalam bekerja”

**Caution asli:** “namun sering kali cemburu dan jengkel jika ada yang menentang pendiriannya” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “selalu mengejar kemajuan”; “Memiliki cita-cita besar”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L10-EXEC-01` | Sangat tangkas dalam bekerja | executing / support | DIDUKUNG TEKSTUAL | Ketangkasan secara eksplisit dikaitkan dengan bekerja. | Tidak menyatakan konsistensi atau kemampuan memimpin. | `DRAFT-G6B4-L10-SOURCE` |
| `DRAFT-G6B4-L10-DIR-02` | Memiliki cita-cita besar | directing / ambiguous | TIDAK DIDUKUNG | Aspirasi bukan bukti mengarahkan kelompok. | Tidak ada support Leader dari kebercita-citaan. | `DRAFT-G6B4-L10-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 11. Gajahmina — Buda/Paing

Identitas: `lintang:Buda:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Waspada & Murah Hati**. Makna asli: **Lakunya Bulan**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sangat berhati-hati dan selalu mempertimbangkan segala hal sebelum bertindak. Tidak suka mencampuri urusan orang lain, namun jika marah bisa sangat hebat.

**Frasa relevan:** “Sangat berhati-hati dan selalu mempertimbangkan segala hal sebelum bertindak”

**Caution asli:** “namun jika marah bisa sangat hebat” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Sangat berhati-hati dan selalu mempertimbangkan segala hal sebelum bertindak”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L11-PLAN-01` | Sangat berhati-hati dan selalu mempertimbangkan segala hal sebelum bertindak | planning / support | PERLU INTERPRETASI | Pertimbangan sebelum tindakan dapat ditafsir sebagai praperencanaan. | Tidak menyebut urutan kegiatan, waktu, atau rencana organisasi. | `DRAFT-G6B4-L11-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 12. Bade — Wraspati/Pon

Identitas: `lintang:Wraspati:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Pencari Pengalaman**. Makna asli: **Lakunya Surya**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Selalu ingin menambah pengalaman dan mencari kemajuan lahir batin. Namun, perlu berhati-hati dengan sifat pamer kepandaian agar tidak mendatangkan bahaya bagi diri sendiri.

**Frasa relevan:** “Selalu ingin menambah pengalaman dan mencari kemajuan lahir batin”

**Caution asli:** “Namun, perlu berhati-hati dengan sifat pamer kepandaian agar tidak mendatangkan bahaya bagi diri sendiri.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Selalu ingin menambah pengalaman dan mencari kemajuan lahir batin”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L12-EXEC-01` | Selalu ingin menambah pengalaman dan mencari kemajuan lahir batin | executing / ambiguous | AMBIGU | Motivasi belajar tidak sama dengan pelaksanaan kerja. | Belum ada aktivitas atau ketuntasan tugas. | `DRAFT-G6B4-L12-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 13. Maglut — Sukra/Wage

Identitas: `lintang:Sukra:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Setia & Pengabdi**. Makna asli: **Pendeta Sakti**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sangat jujur, setia, dan murah hati. Sering menjadi korban demi kepentingan keluarga atau saudaranya, namun tetap teguh dengan pendiriannya meskipun harus menderita.

**Frasa relevan:** “Sangat jujur, setia, dan murah hati”; “Sering menjadi korban demi kepentingan keluarga atau saudaranya”

**Caution asli:** “Sering menjadi korban demi kepentingan keluarga atau saudaranya, namun tetap teguh dengan pendiriannya meskipun harus menderita.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “setia”; “Sering menjadi korban demi kepentingan keluarga atau saudaranya”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L13-COLL-01` | Sering menjadi korban demi kepentingan keluarga atau saudaranya | collaborating / ambiguous | AMBIGU | Pengorbanan keluarga belum menunjukkan tindakan saling membantu yang setara. | Tidak menganggap menjadi korban sebagai kompetensi tim. | `DRAFT-G6B4-L13-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 14. Pagelangan — Saniscara/Kliwon

Identitas: `lintang:Saniscara:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Sopan & Hati-hati**. Makna asli: **Lakunya Bumi**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Ramah tamah dan sangat hati-hati dalam bertindak. Pandai menyusun kata-kata, namun terkadang kurang percaya diri dan mudah putus asa saat menghadapi kesulitan besar.

**Frasa relevan:** “Pandai menyusun kata-kata”

**Caution asli:** “namun terkadang kurang percaya diri dan mudah putus asa saat menghadapi kesulitan besar” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “sangat hati-hati dalam bertindak”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L14-COMM-01` | Pandai menyusun kata-kata | communicating / support | DIDUKUNG TEKSTUAL | Teks eksplisit tentang penyusunan pesan. | Tidak membuktikan kemampuan mendengar atau koordinasi. | `DRAFT-G6B4-L14-SOURCE` |
| `DRAFT-G6B4-L14-EXEC-02` | mudah putus asa saat menghadapi kesulitan besar | executing / caution | PERLU INTERPRETASI | Konteks kesulitan dapat membatasi tafsir kontinuitas tindakan. | Tidak menyebut kegagalan kerja aktual; bukan penalti otomatis. | `DRAFT-G6B4-L14-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 15. Kala Sungsang — Redite/Umanis

Identitas: `lintang:Redite:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Diplomat Tenang**. Makna asli: **Pendeta Sakti**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Pandai menyembunyikan perasaan dan tetap tenang meski sedang marah. Suka berdebat dan terkadang mencampuri urusan orang lain, namun aslinya berhati kaku.

**Frasa relevan:** “tetap tenang meski sedang marah”; “Suka berdebat”

**Caution asli:** “Suka berdebat dan terkadang mencampuri urusan orang lain, namun aslinya berhati kaku.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Suka berdebat”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L15-COMM-01` | Suka berdebat | communicating / ambiguous | AMBIGU | Debat bisa pertukaran gagasan atau pertengkaran. | Tidak langsung dijadikan support/caution kompetensi komunikasi. | `DRAFT-G6B4-L15-SOURCE` |
| `DRAFT-G6B4-L15-COLL-02` | namun aslinya berhati kaku | collaborating / ambiguous | AMBIGU | Kekakuan bisa batas pribadi atau sulit kompromi. | Konteks tidak cukup untuk konflik profil otomatis. | `DRAFT-G6B4-L15-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 16. Kukus — Soma/Paing

Identitas: `lintang:Soma:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Rajin & Setia**. Makna asli: **Lakunya Bintang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Berkelakuan baik, jujur, dan rajin bekerja. Memiliki cita-cita tinggi dan sangat setia pada janjinya. Hidupnya cenderung hemat, cermat, dan tertata.

**Frasa relevan:** “rajin bekerja”; “sangat setia pada janjinya”; “Hidupnya cenderung hemat, cermat, dan tertata”

**Caution asli:** Tidak ada frasa eksplisit yang dicatat; bukan jaminan bebas risiko. Tidak ada caution eksplisit yang dicatat dari teks ini; bukan jaminan bebas risiko.

**Frasa ambigu/kontekstual:** “Memiliki cita-cita tinggi”; “Hidupnya cenderung hemat, cermat, dan tertata”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L16-EXEC-01` (rujukan existing `C-EXEC-04`) | rajin bekerja | executing / support | DIDUKUNG TEKSTUAL | Kecenderungan bekerja eksplisit; janji dan kecermatan tetap dibaca sebagai konteks. | Bukan asesmen produktivitas profesional. | `DRAFT-G6B4-L16-SOURCE` |
| `DRAFT-G6B4-L16-EXEC-02` | sangat setia pada janjinya | executing / support | PERLU INTERPRETASI | Janji memberi hipotesis tindak lanjut yang konsisten. | Kesetiaan pada janji tidak menyebut tugas organisasi. | `DRAFT-G6B4-L16-SOURCE` |
| `DRAFT-G6B4-L16-MAN-03` | Hidupnya cenderung hemat, cermat, dan tertata | managing / support | PERLU INTERPRETASI | Keteraturan hidup bisa ditafsirkan sebagai pengelolaan sumber daya pribadi. | Tidak otomatis berlaku pada organisasi; berbeda dari planning. | `DRAFT-G6B4-L16-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 17. Asu — Anggara/Pon

Identitas: `lintang:Anggara:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Waspada & Mewah**. Makna asli: **Satria Wibawa**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Menyukai kemewahan namun tetap waspada dan pandai berbahasa. Sangat baik terhadap kawan yang loyal, namun sulit percaya pada orang baru dan suka berdebat.

**Frasa relevan:** “pandai berbahasa”

**Caution asli:** “namun sulit percaya pada orang baru dan suka berdebat” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Sangat baik terhadap kawan yang loyal”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L17-COMM-01` | pandai berbahasa | communicating / support | DIDUKUNG TEKSTUAL | Kecakapan bahasa secara eksplisit disebut. | Tidak membuktikan transparansi atau kemampuan mediasi. | `DRAFT-G6B4-L17-SOURCE` |
| `DRAFT-G6B4-L17-COLL-02` | sulit percaya pada orang baru | collaborating / caution | PERLU INTERPRETASI | Keterbatasan kepercayaan pada pihak baru adalah konteks kerja bersama. | Kewaspadaan dapat wajar; bukan diskualifikasi otomatis. | `DRAFT-G6B4-L17-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 18. Kartika — Buda/Wage

Identitas: `lintang:Buda:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Adil & Pantas**. Makna asli: **Aras Tuding**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Umumnya berkelakuan baik dan mengerti nilai uang (ekonomis). Suka menimbang segala hal dengan adil, bicaranya tegas meskipun terkadang terdengar janggal.

**Frasa relevan:** “mengerti nilai uang (ekonomis)”; “Suka menimbang segala hal dengan adil”

**Caution asli:** “bicaranya tegas meskipun terkadang terdengar janggal” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Suka menimbang segala hal dengan adil”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L18-MAN-01` | mengerti nilai uang (ekonomis) | managing / support | PERLU INTERPRETASI | Pemahaman ekonomis memberi hipotesis pengelolaan uang pribadi. | Tidak menyatakan aktivitas mengelola anggaran atau sumber daya. | `DRAFT-G6B4-L18-SOURCE` |
| `DRAFT-G6B4-L18-PLAN-02` | Suka menimbang segala hal dengan adil | planning / ambiguous | TIDAK DIDUKUNG | Menimbang keadilan bukan penyusunan rencana. | Tidak melengkapi profil Manajemen. | `DRAFT-G6B4-L18-SOURCE` |
| `DRAFT-G6B4-L18-COMM-03` | bicaranya tegas meskipun terkadang terdengar janggal | communicating / ambiguous | AMBIGU | Kejelasan/ketegasan dan kejanggalan memerlukan konteks. | Tidak menilai kata janggal sebagai kelemahan terukur. | `DRAFT-G6B4-L18-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 19. Naga — Wraspati/Kliwon

Identitas: `lintang:Wraspati:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Tajam & Ulet**. Makna asli: **Lakunya Air**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Bicaranya tajam dan cita-citanya tinggi. Memiliki pikiran yang ulet dan ramah, namun hatinya sangat sensitif sehingga mudah tersinggung dan jatuh dalam kesedihan.

**Frasa relevan:** “Memiliki pikiran yang ulet”

**Caution asli:** “Bicaranya tajam”; “namun hatinya sangat sensitif sehingga mudah tersinggung dan jatuh dalam kesedihan” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Memiliki pikiran yang ulet”; “ramah”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L19-EXEC-01` | Memiliki pikiran yang ulet | executing / ambiguous | AMBIGU | Keuletan pikiran tidak secara eksplisit dikaitkan dengan pekerjaan. | Tidak otomatis mendukung pelaksanaan tugas. | `DRAFT-G6B4-L19-SOURCE` |
| `DRAFT-G6B4-L19-COMM-02` | Bicaranya tajam | communicating / caution | PERLU INTERPRETASI | Ketajaman bicara mungkin memerlukan kehati-hatian konteks. | Bisa berarti kritis/tepat; bukan penalti atau ukuran komunikasi buruk. | `DRAFT-G6B4-L19-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 20. Banyak Angrem — Sukra/Umanis

Identitas: `lintang:Sukra:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Terus Terang**. Makna asli: **Aras Tuding**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Jujur, suka berterus terang, dan dermawan. Sangat suka menolong, namun jika sudah tidak cocok dengan seseorang, mereka bisa memutus hubungan secara total.

**Frasa relevan:** “suka berterus terang”; “Sangat suka menolong”

**Caution asli:** “namun jika sudah tidak cocok dengan seseorang, mereka bisa memutus hubungan secara total” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Sangat suka menolong”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L20-COMM-01` | suka berterus terang | communicating / support | DIDUKUNG TEKSTUAL | Gaya penyampaian terbuka disebut langsung. | Keterusterangan bukan bukti ketepatan atau efektivitas pesan. | `DRAFT-G6B4-L20-SOURCE` |
| `DRAFT-G6B4-L20-COLL-02` | Sangat suka menolong | collaborating / support | PERLU INTERPRETASI | Menolong adalah dasar tafsir prososial terbatas. | Belum ada konteks tugas bersama. | `DRAFT-G6B4-L20-SOURCE` |
| `DRAFT-G6B4-L20-COLL-03` | mereka bisa memutus hubungan secara total | collaborating / caution | PERLU INTERPRETASI | Pemutusan relasi adalah konteks kontinuitas kerja sama. | Bisa batas relasi yang sah; tidak otomatis menggugurkan orang. | `DRAFT-G6B4-L20-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 21. Ru — Saniscara/Paing

Identitas: `lintang:Saniscara:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Cepat Memaafkan**. Makna asli: **Lakunya Api**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Memiliki nafsu yang besar dan lekas marah, namun sangat mudah sabar dan menyesal. Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan.

**Frasa relevan:** “Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan”

**Caution asli:** “Memiliki nafsu yang besar dan lekas marah, namun sangat mudah sabar dan menyesal.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L21-MAN-01` | Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan | managing / support | DIDUKUNG TEKSTUAL | Aktivitas pengurusan dan urusan keuangan disebut langsung. | Scope rumah tangga/keuangan pribadi; bukan kompetensi manajemen organisasi. | `DRAFT-G6B4-L21-SOURCE` |
| `DRAFT-G6B4-L21-PLAN-02` | Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan | planning / ambiguous | TIDAK DIDUKUNG | Pengurusan dan ketelitian tidak menyebut penyusunan rencana. | Satu frasa tidak boleh digandakan menjadi dua bukti independen. | `DRAFT-G6B4-L21-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 22. Patrem — Redite/Pon

Identitas: `lintang:Redite:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Ahli Diplomasi**. Makna asli: **Aras Kembang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sangat licin dan pandai berdiplomasi. Suka memperlihatkan kekayaan dan kepandaiannya di hadapan orang lain, namun pandai menyimpan perasaan yang sesungguhnya.

**Frasa relevan:** “pandai berdiplomasi”

**Caution asli:** “Sangat licin”; “Suka memperlihatkan kekayaan dan kepandaiannya di hadapan orang lain” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Sangat licin”; “pandai menyimpan perasaan yang sesungguhnya”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L22-COMM-01` | pandai berdiplomasi | communicating / support | DIDUKUNG TEKSTUAL | Diplomasi adalah aktivitas komunikasi yang disebut eksplisit. | Konteks licin/pamer tetap terlihat; bukan bukti ketulusan. | `DRAFT-G6B4-L22-SOURCE` |
| `DRAFT-G6B4-L22-COLL-02` | pandai berdiplomasi | collaborating / ambiguous | AMBIGU | Diplomasi bisa menyelesaikan relasi, tetapi kerja bersama tidak disebut. | Frasa sama dengan komunikasi; tidak menjadi bukti independen. | `DRAFT-G6B4-L22-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 23. Lembu — Soma/Wage

Identitas: `lintang:Soma:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Jujur & Empati**. Makna asli: **Lakunya Api**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Segala urusan ditimbang dengan baik dan tidak terburu nafsu. Memiliki empati yang tinggi terhadap kesulitan orang lain, namun jika marah sangat sulit diredakan.

**Frasa relevan:** “Segala urusan ditimbang dengan baik dan tidak terburu nafsu”; “Memiliki empati yang tinggi terhadap kesulitan orang lain”

**Caution asli:** “namun jika marah sangat sulit diredakan” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Segala urusan ditimbang dengan baik dan tidak terburu nafsu”; “Memiliki empati yang tinggi terhadap kesulitan orang lain”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L23-PLAN-01` | Segala urusan ditimbang dengan baik dan tidak terburu nafsu | planning / support | PERLU INTERPRETASI | Pertimbangan sebelum keputusan memberi hipotesis praperencanaan. | Tidak menyatakan rencana kegiatan atau organisasi. | `DRAFT-G6B4-L23-SOURCE` |
| `DRAFT-G6B4-L23-COLL-02` | Memiliki empati yang tinggi terhadap kesulitan orang lain | collaborating / ambiguous | AMBIGU | Empati belum menyatakan tindakan membantu atau berbagi tugas. | Tidak otomatis menjadi dukungan kolaborasi. | `DRAFT-G6B4-L23-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 24. Depat — Anggara/Kliwon

Identitas: `lintang:Anggara:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Ramah & Menyenangkan**. Makna asli: **Sumur Sinaba**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Pintar menyusun kata-kata sehingga bicaranya menyenangkan pendengar. Murah hati, namun terkadang memiliki pikiran yang keruh dan sulit percaya pada orang lain.

**Frasa relevan:** “Pintar menyusun kata-kata sehingga bicaranya menyenangkan pendengar”

**Caution asli:** “namun terkadang memiliki pikiran yang keruh dan sulit percaya pada orang lain” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Murah hati”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L24-COMM-01` | Pintar menyusun kata-kata sehingga bicaranya menyenangkan pendengar | communicating / support | DIDUKUNG TEKSTUAL | Penyusunan pesan dan respons pendengar disebut langsung. | Tidak menyimpulkan kemampuan koordinasi. | `DRAFT-G6B4-L24-SOURCE` |
| `DRAFT-G6B4-L24-COLL-02` | sulit percaya pada orang lain | collaborating / caution | PERLU INTERPRETASI | Kepercayaan adalah konteks relasi dan kerja bersama. | Tidak berarti orang tidak layak menjadi anggota. | `DRAFT-G6B4-L24-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 25. Tangis — Buda/Umanis

Identitas: `lintang:Buda:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Bijaksana & Peka**. Makna asli: **Aras Kembang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Berkelakuan sopan, adil, dan bijaksana. Suka menolong kawan setia, namun sering dilingkupi rasa bimbang dan kesedihan yang mendalam.

**Frasa relevan:** “Suka menolong kawan setia”

**Caution asli:** “namun sering dilingkupi rasa bimbang dan kesedihan yang mendalam” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Suka menolong kawan setia”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L25-COLL-01` | Suka menolong kawan setia | collaborating / support | PERLU INTERPRETASI | Menolong memberi tafsir prososial dengan lingkup kawan dekat. | Tidak digeneralisasi ke semua rekan atau kolaborasi organisasi. | `DRAFT-G6B4-L25-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 26. Salah Ukur — Wraspati/Paing

Identitas: `lintang:Wraspati:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Giat & Dinamis**. Makna asli: **Lakunya Bumi**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Memiliki kemauan yang tangkas dan giat mencari kemajuan lahir batin. Sangat rukun dengan keluarga, namun bicaranya terkadang menyinggung atau salah terka terhadap orang lain.

**Frasa relevan:** “Memiliki kemauan yang tangkas dan giat mencari kemajuan lahir batin”; “Sangat rukun dengan keluarga”

**Caution asli:** “namun bicaranya terkadang menyinggung atau salah terka terhadap orang lain” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “giat mencari kemajuan lahir batin”; “Sangat rukun dengan keluarga”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L26-EXEC-01` | giat mencari kemajuan lahir batin | executing / ambiguous | AMBIGU | Kemauan maju tidak menyebut bekerja atau tugas. | Tidak dijadikan support hanya karena label Giat. | `DRAFT-G6B4-L26-SOURCE` |
| `DRAFT-G6B4-L26-COLL-02` | Sangat rukun dengan keluarga | collaborating / support | PERLU INTERPRETASI | Kerukunan keluarga mungkin relevan dengan hubungan saling menjaga. | Tidak menyatakan kolaborasi tugas atau berlaku di luar keluarga. | `DRAFT-G6B4-L26-SOURCE` |
| `DRAFT-G6B4-L26-COMM-03` | bicaranya terkadang menyinggung atau salah terka terhadap orang lain | communicating / caution | DIDUKUNG TEKSTUAL | Dampak ucapan pada orang lain dinyatakan eksplisit. | Kata terkadang membatasi generalisasi; tidak menjadi penalti otomatis. | `DRAFT-G6B4-L26-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 27. Prahu Pegat — Sukra/Pon

Identitas: `lintang:Sukra:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Pecinta Keadilan**. Makna asli: **Lakunya Bintang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Suka bergaul, jujur, dan memiliki perikemanusiaan yang tinggi. Namun, sering merasa bimbang dan sedih hati yang membuat kemauannya mudah terputus di tengah jalan.

**Frasa relevan:** “Suka bergaul, jujur, dan memiliki perikemanusiaan yang tinggi”

**Caution asli:** “Namun, sering merasa bimbang dan sedih hati yang membuat kemauannya mudah terputus di tengah jalan.” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Suka bergaul”; “memiliki perikemanusiaan yang tinggi”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L27-COLL-01` | Suka bergaul, jujur, dan memiliki perikemanusiaan yang tinggi | collaborating / ambiguous | AMBIGU | Relasi dan sikap moral belum menyebut tindakan kolaborasi. | Tidak otomatis menjadi support Leader. | `DRAFT-G6B4-L27-SOURCE` |
| `DRAFT-G6B4-L27-EXEC-02` | kemauannya mudah terputus di tengah jalan | executing / caution | PERLU INTERPRETASI | Kontinuitas kemauan memberi konteks tindak lanjut. | Tidak secara eksplisit menyebut pekerjaan; tidak boleh menjadi penalti otomatis. | `DRAFT-G6B4-L27-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 28. Puwuh Atarung — Saniscara/Wage

Identitas: `lintang:Saniscara:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Tegas & Dermawan**. Makna asli: **Lakunya Bintang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Pintar mengatur rumah tangga dan menyukai kemewahan. Bicaranya tegas dan sangat murah hati kepada mereka yang memuji dirinya, namun cenderung pencemburu.

**Frasa relevan:** “Pintar mengatur rumah tangga”

**Caution asli:** “sangat murah hati kepada mereka yang memuji dirinya”; “namun cenderung pencemburu” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Bicaranya tegas”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L28-MAN-01` | Pintar mengatur rumah tangga | managing / support | DIDUKUNG TEKSTUAL | Pengaturan disebut sebagai tindakan langsung. | Hanya konteks rumah tangga; tidak otomatis ke organisasi. | `DRAFT-G6B4-L28-SOURCE` |
| `DRAFT-G6B4-L28-DIR-02` | Bicaranya tegas | directing / ambiguous | AMBIGU | Ketegasan ucapan tidak menjelaskan pengarahan aktivitas. | Tidak cukup untuk Leader. | `DRAFT-G6B4-L28-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 29. Lawean — Redite/Kliwon

Identitas: `lintang:Redite:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Sabar & Sopan**. Makna asli: **Lakunya Bintang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Pribadi yang sabar, sopan, dan pandai berdiplomasi. Memiliki derajat yang tinggi dan pendiam, namun sulit diubah jika sudah memiliki pendapat sendiri.

**Frasa relevan:** “pandai berdiplomasi”

**Caution asli:** “namun sulit diubah jika sudah memiliki pendapat sendiri” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Memiliki derajat yang tinggi”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L29-COMM-01` | pandai berdiplomasi | communicating / support | DIDUKUNG TEKSTUAL | Kecenderungan diplomasi disebut langsung. | Bukan bukti kompromi atau kerja tim. | `DRAFT-G6B4-L29-SOURCE` |
| `DRAFT-G6B4-L29-DIR-02` | Memiliki derajat yang tinggi | directing / ambiguous | TIDAK DIDUKUNG | Kedudukan bukan tindakan kepemimpinan. | Tidak menggunakan status sosial sebagai kompetensi. | `DRAFT-G6B4-L29-SOURCE` |
| `DRAFT-G6B4-L29-COLL-03` | sulit diubah jika sudah memiliki pendapat sendiri | collaborating / ambiguous | AMBIGU | Bisa pendirian kuat atau hambatan kompromi. | Konteks tidak cukup untuk caution pemblokir. | `DRAFT-G6B4-L29-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 30. Kelapa — Soma/Umanis

Identitas: `lintang:Soma:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Sopan & Dermawan**. Makna asli: **Lakunya Angin**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Berperilaku sopan santun dan ingin selalu berbuat baik. Suka membantu orang yang disetujuinya, namun memiliki kegemaran mengembara dan berdebat.

**Frasa relevan:** “Suka membantu orang yang disetujuinya”

**Caution asli:** “namun memiliki kegemaran mengembara dan berdebat” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Suka membantu orang yang disetujuinya”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L30-COLL-01` | Suka membantu orang yang disetujuinya | collaborating / support | PERLU INTERPRETASI | Membantu adalah tindakan prososial dengan syarat persetujuan. | Tidak menganggap dukungan berlaku untuk semua orang. | `DRAFT-G6B4-L30-SOURCE` |
| `DRAFT-G6B4-L30-COMM-02` | berdebat | communicating / ambiguous | AMBIGU | Debat bisa pertukaran gagasan atau perselisihan. | Tidak cukup untuk support/caution komunikasi. | `DRAFT-G6B4-L30-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 31. Yuyu — Anggara/Paing

Identitas: `lintang:Anggara:Paing`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Murah Rezeki**. Makna asli: **Aras Kembang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Murah hati dan suka menolong orang yang disukai. Rezekinya lancar, namun cenderung serakah terhadap apa yang dilihat dan mudah menyesal setelah bertindak emosional.

**Frasa relevan:** “suka menolong orang yang disukai”

**Caution asli:** “namun cenderung serakah terhadap apa yang dilihat dan mudah menyesal setelah bertindak emosional” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Rezekinya lancar”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L31-COLL-01` | suka menolong orang yang disukai | collaborating / support | PERLU INTERPRETASI | Menolong mendukung hipotesis saling membantu yang selektif. | Tidak mengekstrapolasi ke semua rekan. | `DRAFT-G6B4-L31-SOURCE` |
| `DRAFT-G6B4-L31-MAN-02` | Rezekinya lancar | managing / ambiguous | TIDAK DIDUKUNG | Keberuntungan material bukan kemampuan mengelola sumber daya. | Tidak membuat prediksi keberhasilan finansial. | `DRAFT-G6B4-L31-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 32. Lumbung — Buda/Pon

Identitas: `lintang:Buda:Pon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Waspada & Rajin**. Makna asli: **Lakunya Bulan**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sopan santun, waspada, dan memiliki rezeki yang baik. Sangat rajin dalam bekerja dan dicintai banyak orang, namun mudah tersinggung jika merasa tidak dihargai.

**Frasa relevan:** “Sangat rajin dalam bekerja”

**Caution asli:** “namun mudah tersinggung jika merasa tidak dihargai” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “memiliki rezeki yang baik”; “dicintai banyak orang”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L32-EXEC-01` | Sangat rajin dalam bekerja | executing / support | DIDUKUNG TEKSTUAL | Aktivitas bekerja disebut eksplisit. | Bukan bukti ketuntasan/kualitas atau konsistensi yang terukur. | `DRAFT-G6B4-L32-SOURCE` |
| `DRAFT-G6B4-L32-COLL-02` | dicintai banyak orang | collaborating / ambiguous | AMBIGU | Disukai orang lain belum menunjukkan kerja bersama. | Tidak dipakai untuk Leader. | `DRAFT-G6B4-L32-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 33. Kumba — Wraspati/Wage

Identitas: `lintang:Wraspati:Wage`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Adil & Cerdas**. Makna asli: **Aras Kembang**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Memiliki angan-angan tinggi dan suka berlaku adil. Sangat cerdas dalam memikirkan solusi masalah, namun cenderung pendendam jika merasa disalahi.

**Frasa relevan:** “Sangat cerdas dalam memikirkan solusi masalah”

**Caution asli:** “namun cenderung pendendam jika merasa disalahi” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Memiliki angan-angan tinggi”; “Sangat cerdas dalam memikirkan solusi masalah”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L33-PLAN-01` | Sangat cerdas dalam memikirkan solusi masalah | planning / support | PERLU INTERPRETASI | Perumusan solusi memberi hipotesis perencanaan pemecahan masalah. | Tidak menyebut langkah, jadwal, atau organisasi; bisa kecakapan analitis saja. | `DRAFT-G6B4-L33-SOURCE` |
| `DRAFT-G6B4-L33-DIR-02` | Memiliki angan-angan tinggi | directing / ambiguous | TIDAK DIDUKUNG | Aspirasi bukan kegiatan mengarahkan orang. | Tidak menjadi support Leader. | `DRAFT-G6B4-L33-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 34. Udang — Sukra/Kliwon

Identitas: `lintang:Sukra:Kliwon`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Berpengaruh Besar**. Makna asli: **Lakunya Bulan**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Berbudi baik, sabar, dan sangat ahli dalam mengarang atau berdiplomasi. Memiliki pengaruh besar dan dicintai orang, sukses biasanya datang saat usia dewasa.

**Frasa relevan:** “sangat ahli dalam mengarang atau berdiplomasi”; “Memiliki pengaruh besar dan dicintai orang”

**Caution asli:** Tidak ada frasa eksplisit yang dicatat; bukan jaminan bebas risiko. Tidak ada caution eksplisit yang dicatat dari teks ini; bukan jaminan bebas risiko.

**Frasa ambigu/kontekstual:** “Memiliki pengaruh besar dan dicintai orang”; “sukses biasanya datang saat usia dewasa”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L34-COMM-01` | sangat ahli dalam mengarang atau berdiplomasi | communicating / support | DIDUKUNG TEKSTUAL | Mengarang/diplomasi menyebut ekspresi pesan secara eksplisit. | Tidak mengubah tafsir kesuksesan menjadi klaim kemampuan aktual. | `DRAFT-G6B4-L34-SOURCE` |
| `DRAFT-G6B4-L34-DIR-02` | Memiliki pengaruh besar dan dicintai orang | directing / ambiguous | AMBIGU | Pengaruh tidak menjelaskan tindakan mengarahkan aktivitas. | Tidak menaikkan popularitas menjadi Leader. | `DRAFT-G6B4-L34-SOURCE` |
| `DRAFT-G6B4-L34-COLL-03` | Memiliki pengaruh besar dan dicintai orang | collaborating / ambiguous | AMBIGU | Dicintai tidak menyebut kontribusi tim. | Frasa sama dengan usulan directing; saling bergantung. | `DRAFT-G6B4-L34-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## 35. Begoong — Saniscara/Umanis

Identitas: `lintang:Saniscara:Umanis`; master `lib/data.ts::dataLintang.penjelasan`. Label asli: **Pandai & Berani**. Makna asli: **Lakunya Bulan**. Label/makna tidak dipakai sebagai pengganti deskripsi untuk mapping.

> Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain.

**Frasa relevan:** “Sangat terampil dalam segala pekerjaan dan berwawasan luas”

**Caution asli:** “namun bicaranya tajam dan sering mencampuri urusan orang lain” Konteks dipertahankan utuh; tidak dinilai sebagai penalti atau konflik otomatis.

**Frasa ambigu/kontekstual:** “Berani dalam bertindak”

| ID draft / tautan existing | Frasa sumber persis | Dimensi / jenis | Keputusan audit | Alasan | Batas kesimpulan | Kelompok dependensi |
| --- | --- | --- | --- | --- | --- | --- |
| `DRAFT-G6B4-L35-EXEC-01` | Sangat terampil dalam segala pekerjaan dan berwawasan luas | executing / support | DIDUKUNG TEKSTUAL | Teks eksplisit mengaitkan keterampilan dengan pekerjaan. | Ungkapan segala pekerjaan bersifat luas, tidak bukti semua kompetensi. | `DRAFT-G6B4-L35-SOURCE` |
| `DRAFT-G6B4-L35-COMM-02` (rujukan existing `C-COMM-04`) | bicaranya tajam dan sering mencampuri urusan orang lain | communicating / caution | PERLU INTERPRETASI | Konteks ucapan dan intervensi relasi relevan untuk komunikasi. | Tajam dapat berarti kritis; bukan diskualifikasi atau nilai minus otomatis. | `DRAFT-G6B4-L35-SOURCE` |
| `DRAFT-G6B4-L35-DIR-03` | Berani dalam bertindak | directing / ambiguous | TIDAK DIDUKUNG | Keberanian tidak menyebut kemampuan memimpin. | Tidak dipakai sebagai support Leader. | `DRAFT-G6B4-L35-SOURCE` |

Status semua baris: provenance **missing**, cultural review **pending**, persetujuan mapping eksperimen **draft_pending**, `active: false`. Status sumber ini tidak diubah oleh keputusan semantik pada kolom audit.

## Rekap konteks dan batas audit

- **33/35** deskripsi memiliki caution yang dicatat; Kukus dan Udang tidak memiliki caution eksplisit dalam teks karakter ini. Keduanya tetap tidak dinyatakan bebas risiko.
- **35/35** memiliki frasa yang konteksnya ambigu atau tidak boleh diekstrapolasi. Ini berbeda dari **23 assertion** berkeputusan AMBIGU.
- Tidak ada deskripsi baru tentang manusia yang dihasilkan. Frasa dikutip dari master; alasan dan batas merupakan interpretasi audit Metemu.
- Provenance semua draft masih missing; cultural review pending; persetujuan eksperimen draft_pending. Tidak diperlukan klaim approval eksternal untuk melanjutkan keputusan produk internal.
- Lihat [review profil](samyoga-position-profile-review-g6b4.md) dan [simulasi cakupan](samyoga-position-coverage-g6b4.md) sebelum memutuskan implementasi G6B.5.
