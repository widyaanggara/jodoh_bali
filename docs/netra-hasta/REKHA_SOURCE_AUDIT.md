# Audit Sumber Visual Rekha — Milestone 4A

Tanggal audit: 30 Oktober 2026. Ruang lingkup dokumen ini hanya geometri visual
untuk anotasi eksperimen, bukan interpretasi kesehatan, karakter, usia, nasib,
rezeki, kecerdasan, relasi, atau karier.

## Tingkat sumber

### 1. PRD Metemu — definisi produk

PRD internal 26 Oktober 2026 meminta empat keluaran bernama Rekha Hayu, Jnana,
Hredaya, dan Bhaga. PRD tidak menyertakan kutipan naskah primer, edisi kritis,
nomor lontar, transliterasi, atau justifikasi bahwa empat istilah tersebut tepat
dipetakan satu-ke-satu ke life/head/heart/fate dalam palmistri umum.

Karena itu, Milestone 4A memakai label komputer `life`, `head`, `heart`, dan
`fate`. Padanan LIFE→Hayu, HEAD→Jnana, HEART→Hredaya, dan FATE→Bhaga adalah
**hipotesis provisional dari PRD**, bukan fakta budaya Bali yang terverifikasi.

### 2. Paramarsh — referensi palmistri umum

URL: https://paramarsh.app/patrika/palmistry/palmistry-complete-guide

Halaman dapat diakses pada audit 30 Oktober 2026. Deskripsi visualnya mendukung:

- life line bermula di antara ibu jari dan telunjuk, melengkung mengitari pangkal
  ibu jari menuju pergelangan;
- heart line melintang pada bagian atas telapak;
- life, head, dan heart diperlakukan sebagai tiga lipatan utama;
- fate line dapat samar atau tidak terlihat pada setiap telapak.

Halaman juga menyatakan panjang life line tidak membuktikan panjang umur dan
interpretasi tradisional bukan kepastian peristiwa. Metemu hanya menggunakan
lokasi visualnya, bukan klaim interpretatifnya.

### 3. PengajarPedia — referensi palmistri umum sekunder

URL: https://www.pengajarpedia.com/2025/10/begini-cara-mudah-membaca-garis-tangan.html

Halaman dapat diakses pada audit 30 Oktober 2026 dan menyajikan palmistri sebagai
bahan refleksi, bukan fakta ramalan. Sumber ini bersifat artikel web sekunder dan
tidak dipakai sebagai bukti ilmiah atau sumber primer budaya Bali.

## Definisi visual operasional

- **LIFE**: lipatan melengkung di sekitar pangkal ibu jari, dari area celah
  telunjuk–ibu jari menuju sisi pergelangan.
- **HEAD**: lipatan melintang bagian tengah telapak, dari sisi ibu jari menuju
  sisi luar telapak.
- **HEART**: lipatan melintang bagian atas telapak, di bawah pangkal jari.
- **FATE**: lipatan cenderung vertikal dari bagian bawah/tengah telapak menuju
  area jari tengah; boleh samar, terhalang, atau tidak tampak.

Definisi tersebut adalah pedoman anotasi palmistri umum. Bentuk yang tidak cocok
atau belum dapat ditentukan harus dilabeli `other` atau `unknown`, bukan dipaksa
menjadi salah satu dari empat kelas.

## Kesenjangan sumber

- Belum ada verifikasi filologis terhadap naskah primer Bali.
- Belum ada ahli budaya/aksara yang menyetujui pemetaan terminologi.
- Belum ada protokol adjudikasi dua anotator.
- Tidak ada gambar dari kedua website yang disalin ke repository.
- Lisensi halaman web tidak dianggap sebagai izin dataset atau training.

Sebelum klaim budaya atau classifier production dibuat, diperlukan sumber primer
yang dapat dirujuk, review ahli, dan dokumentasi keputusan pemetaan istilah.
