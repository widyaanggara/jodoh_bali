# About Metemu - metode profesi dan audit izin sementara

9 November 2026, WITA. Worktree `jodoh_bali_samyoga_release`, branch `feat/samyoga-group-release`, HEAD `3ad18e21fb4de132784da790ed26f0b18db12280`.

## Perubahan halaman Tentang

Tab baru **Ramalan Profesi** menambahkan penjelasan interval 12 Mangsa Pranata, hari Eka/Dwi/Tri, lookup 36 aturan, kebijakan 4 Februari, contoh edukasi, dan batas interpretasi. Tipografi serif, warna primer/emas, kartu, navigasi horizontal mobile, serta susunan referensi mengikuti halaman existing. Tidak menambah CSS global atau dependency.

Pseudocode memakai tanggal sipil valid, hari Gregorian, kelompok hari, pemeriksaan 4 Februari, lalu `Tabel36[mangsa][kelompok]`. Tidak ada rumus skor baru. Contoh publik 6 Juli 2025 menghasilkan Kaso, Minggu/Eka, dengan penekanan Pengarang atau Wartawan. Contoh ini diuji terhadap engine dan referensi halaman cetak 3 / PDF 8. Contoh bersifat tetap dan edukatif, bukan data anggota, hasil kelompok, atau jalur kalkulasi privat.

Referensi [7] ditambahkan sekali pada daftar pustaka existing:
https://id.scribd.com/document/743338223/Tenung-Wariga-Gemet?doc_id=743338223&order=702238034

Judul ditulis Tenung Wariga Gemet, dengan atribusi naskah komangputra.com sesuai salinan lokal. Tidak membuat identitas penulis atau tahun publikasi. Alat web tidak dapat membuka halaman Scribd tersebut; isi metode diverifikasi dari TXT/PDF lokal yang sudah diaudit, bukan klaim telah membaca metadata live Scribd.

Sebanyak 14 error lint tanda kutip JSX lama di-escape tanpa mengubah teks render. Golden hash memastikan 11 blok pada tiga tab lama (Jodoh, Otonan, Pal Sri Sedana) mempertahankan isi, rumus dan markup styling setelah normalisasi encoding quote. Perubahan paragraf pembuka referensi mengakomodasi Pranata Mangsa tanpa mengklaim seluruh isi berasal dari lontar atau sudah tervalidasi ilmiah.

## Audit keamanan yang benar-benar diverifikasi

| Aspek | Bukti dan hasil |
| --- | --- |
| Autentikasi server | Endpoint memanggil requireNetraIdentity; browser/emulator menolak anonim dan token palsu/kedaluwarsa dengan 401 |
| Otorisasi konteks kelompok | Grant AES-256-GCM mengikat UID, hash sesi, groupId acak, digest kanonik ID/tanggal, dan expiry; akun lain, ID tebakan, grant rusak dan anggota berubah ditolak 403 |
| Tidak ada hasil privat anonim | SSR kartu terkunci dan API negatif diuji; tabel 36 profesi tetap di graph server, marker privat tidak ada dalam bundle client |
| Dokumentasi publik | Hanya satu contoh sintetis yang sengaja diterbitkan di About; kunjungan/tab About menghasilkan nol request API profesi |
| Batas input/cache | Maksimal 4096 byte, 3-6 anggota, schema/ID/tanggal divalidasi; respons/error private, no-store |
| Minimisasi data | Hanya ID internal/tanggal dikirim saat pengguna meminta; tidak ada nama/jam, foto/ROI, database profesi atau log tanggal pada perubahan ini |
| Batas umur | Maksimal 600 detik, tidak melebihi expiry sesi; grant expired ditolak |
| Isolasi key instance | Dua handler dengan key default independen disimulasikan: A dapat memakai grant A, B menolak grant A tanpa menghitung profesi; otorisasi baru pada B bekerja hanya di B |
| Tidak ada bypass saat key berubah | Restart/key lain menghasilkan 403, bukan fallback atau hasil tanpa izin |

Belum ada grup tersimpan/kolaboratif dalam database. Hak atas input merupakan pernyataan pengguna, sedangkan grant melindungi konteks analisis yang ia buat. Ini tidak membuktikan persetujuan setiap anggota, dan bukan implementasi ACL keanggotaan grup tersimpan. Akun lain dapat membuat konteks perhitungan sendiri dari input yang ia miliki; hal itu berbeda dari membaca konteks/grant milik akun lain.

Grant stateless dapat dipakai ulang oleh UID/sesi yang sama sebelum expiry; bukan token sekali pakai. Membatalkan checkbox menutup hasil di client. Logout menghapus sesi browser melalui mekanisme existing, tetapi tidak menambahkan revokasi individual grant atau pencabutan global token Firebase. Jika seluruh credential sesi yang masih valid dicuri, grant tetap merupakan bearer capability sampai expiry atau identitas ditolak Firebase. Tidak mengklaim revokasi server seketika. Kebutuhan revokasi individual memerlukan rancangan baru di luar perubahan About.

Route belum menambahkan rate-limit aplikasi sendiri. Batas input/auth mengurangi ruang penyalahgunaan, tetapi tidak menjadi pembatas frekuensi permintaan dari akun yang valid. Proteksi reverse proxy dan batas layanan production belum diverifikasi.

## Kompatibilitas Komodo

Bukti repository: Dockerfile Node 24 Alpine menjalankan satu `node server.js`. Compose mendefinisikan nextjs pada 3010 dan nextjs_dev pada 3011, masing-masing satu container, tanpa konfigurasi replicas/PM2/cluster atau afinitas proxy yang ditemukan.

- **Satu proses, satu instance untuk origin production:** cocok dengan skema key proses lokal. Grant yang melewati restart harus diotorisasi ulang; tidak ada fallback tanpa izin. Standalone production lokal diuji, bukan image Linux yang benar-benar berjalan di Komodo.
- **Beberapa proses/replica, atau proxy menyeimbangkan production dan preview:** belum kompatibel tanpa desain tambahan. Permintaan authorize pada A lalu analyze pada B akan ditolak. Ini masalah ketersediaan, bukan alasan membuka akses atau menurunkan pemeriksaan grant.
- **Rolling deployment:** key baru membuat grant lama gagal pada request berikutnya; pengguna perlu verifikasi ulang. Tidak menjanjikan hasil client yang sudah diterima akan ditarik kembali oleh restart server.

Pilihan berikutnya harus direview terpisah: tetap satu instance dengan routing yang jelas; atau merancang key bersama yang disimpan sebagai secret tepercaya, rotasi/versioning dan strategi revoke. Alternatif store otorisasi juga membutuhkan desain akses/retensi. Tidak menerapkan opsi tersebut, tidak menambah environment variable, dan tidak mengubah Compose/Docker/rules.

Topologi aktual Komodo/reverse proxy tidak tersedia pada audit ini. Jangan menganggap dua service Compose merupakan dua replica production yang bisa dicampur. Sebelum deployment, operator harus memeriksa jumlah proses, upstream/proxy, HTTPS dan aturan cache. Docker CLI tidak tersedia untuk pengujian container.

## Verifikasi

- 239/239 tes regresi lulus, termasuk release gate, Samyoga, Otonan, Netra, contoh About, isolasi grant dan golden output posisi.
- 239/239 juga lulus masing-masing pada Asia/Makassar dan America/Los_Angeles.
- TypeScript, ESLint delta dan production build lulus.
- Browser About: 6 pemeriksaan lulus pada 320/390/1440, Enter/Space, referensi tunggal, nol request profesi privat dan nol exception render.
- Browser profesi: 10 pemeriksaan lulus menggunakan Auth Emulator, termasuk cross-UID, data berubah, expiry, logout dan reset.
- Regresi browser Netra: 9 UI, 14 kamera/lifecycle sintetis, 15 auth/riwayat emulator, serta editor Rekha berbantuan lulus.
- Regresi browser Samyoga existing: 8 alur, 3-6 anggota, pasangan/kategori/posisi, disclosure, keyboard/reset dan parity Otonan Los_Angeles.

Tes emulator memakai akun dan input sintetis; tidak membaca/menulis data production. Skenario expiry UI memakai fixture respons singkat yang eksplisit. Kamera fisik dan HTTPS Komodo tidak diuji ulang. Warning ukuran -1 pada Recharts Otonan tetap merupakan temuan baseline. Tidak ada kegagalan final atau pengecualian render baru.

## Keputusan review

**Halaman About dan perilaku lokal: READY FOR REVIEW. Deployment multi-instance: HOLD.** Single-instance tetap membutuhkan verifikasi operator atas topologi Komodo sebenarnya. Tidak menyatakan tafsir profesi sebagai asesmen ilmiah atau mengubah posisi Ketua/Wakil.

Seluruh 16 file perubahan profesi yang sudah ada saat awal pekerjaan dipertahankan. Engine profesi/posisi, autentikasi, Firebase Rules, logging, dependency, kalender dan konfigurasi deployment tidak diubah. Belum ada staging, commit, push, PR, merge, publish rules atau deploy.
