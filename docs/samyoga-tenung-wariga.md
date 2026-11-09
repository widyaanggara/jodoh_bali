# Ramalan Profesi - Tenung Wariga Gemet

Checkpoint sebelum fitur: `3ad18e21fb4de132784da790ed26f0b18db12280`. Tepat 38 path kandidat rilis sebelumnya sudah committed; worktree bersih saat verifikasi. Tidak membuat ulang commit checkpoint, dan tidak melakukan commit fitur ini.

## Ruang lingkup

Section tersendiri setelah seluruh kartu rekomendasi posisi di `/pawongan-sinergi/kelompok`. Ramalan profesi tidak lagi disisipkan di dalam kartu posisi; setiap anggota mempunyai kartu profesi sendiri dengan urutan, ID, dan nama tampilan yang konsisten. Hasil kelompok, kategori pasangan, rekomendasi posisi, kandidat Ketua, Wakil yang belum didukung, master dan kalender tetap memakai implementasi checkpoint. Istilah profesi seperti Sekretaris dalam buku tidak menjadi penetapan posisi Sekretaris di kelompok.

Ini interpretasi simbolis sumber, bukan asesmen kemampuan, jaminan karier, atau pengganti persyaratan pendidikan/izin profesi. Tidak memberi skor profesi, ranking anggota, approval budaya, atau aturan baru untuk Ketua/Wakil.

## Referensi dan atribusi

Salinan lokal pengguna: `743338223-Tenung-Wariga-Gemet.pdf` dan `.txt`, judul **Horoskop pada Tenung Wariga Gemet**, footer `www.komangputra.com`. Identitas penulis dan tanggal publikasi tidak ditetapkan dari nama pengunduh pada sampul. Dokumen sumber tidak disalin ke repository.

- SHA-256 PDF: `815053390bb523ba0b834f074335098fa4876bf82a1ce338d3d251be599c59e2`.
- SHA-256 TXT: `625936a1cb75f0413878839995e12cdb38a9b24646509cc2a10a9c7bd37a55b5`.
- PDF memiliki 40 halaman termasuk halaman kosong. Halaman cetak 1 adalah halaman PDF 6; referensi memakai halaman paragraf yang sebenarnya, bukan hanya daftar isi. Daftar pekerjaan Kaso berada pada halaman cetak 3; sebagian bagian Saddha berlanjut ke halaman 15.
- Daftar bidang disajikan sebagai istilah profesi faktual. Penjelasan ditulis ulang oleh Metemu, bukan salinan narasi buku. Tidak mengklaim seluruh isi naskah telah diverifikasi ahli atau merupakan aturan Sasih Bali.

## Kontrak metode `twg-gemet-v1`

Dua belas interval mengikuti dokumen ini: Kaso 23Jun-2Agu; Karo 3-25Agu; Katiga 26Agu-18Sep; Kapat 19Sep-13Okt; Kalima 14Okt-9Nov; Kanem 10Nov-22Des; Kapitu 23Des-3Feb; Kawulu 4/5Feb-1Mar; Kasanga 2-26Mar; Kasadasa 27Mar-19Apr; Desta 20Apr-12Mei; Saddha 13Mei-22Jun.

Kelompok hari: Eka=Minggu/Rabu/Jumat, Dwi=Senin, Tri=Selasa/Kamis/Sabtu. Penamaan Katiga/Katelu dan Kawulu/Kawolu diperlakukan sebagai variasi nama dalam sumber yang sama, tanpa membentuk kelas tambahan.

Tanggal dibaca sebagai komponen Gregorian sipil dengan validasi round-trip UTC; tidak memakai parsing string tanggal UTC yang kemudian dibaca melalui timezone lokal. Hari dihitung dari tanggal Gregorian yang diisikan. Jam dan aturan pergantian hari Bali pukul06:00 tidak digunakan karena sumber metode ini tidak memberikan aturan tersebut. Hasil Otonan/Samyoga sebelum06:00 tetap mengikuti engine existing dan dapat menyebut hari tradisional berbeda.

- **4 Februari:** status `ambiguous`, Mangsa null, daftar profesi kosong. Akhir Kapitu tertulis3Feb dan awal Kawulu4/5Feb tanpa penjelasan. Tidak menambahkan4Feb ke Kapitu, tidak memilih awal berdasarkan kabisat, tidak memilih dua ramalan sekaligus.
- **5 Februari:** Kawulu jelas; **29 Februari:** Kawulu jika tanggal kalender valid. Tahun1900/2100 bukan kabisat;2000/2024 kabisat.
- Null pada `explicitlyPreferred` berarti sumber tidak menyebut satu profesi terbaik secara tegas: Kapitu-Dwi, Kasadasa-Dwi, Desta-Dwi, Saddha-Eka.
- Kanem-Dwi memiliki dua penekanan sumber (kemiliteran dan seni lukis); keduanya dicatat bersama catatan, bukan dipaksa menjadi satu pemenang. Karo-Tri menonjolkan beberapa bidang sekaligus.
- Tidak menggunakan35 weton atau rumus40/60 sebagai skor tambahan.

| Mangsa | Kelompok | Penekanan eksplisit sumber | Halaman cetak |
| --- | --- | --- | --- |
| Kaso | Eka | Pengarang, Wartawan | 3 |
| Kaso | Dwi | Pegawai | 3 |
| Kaso | Tri | Ahli bangunan | 3 |
| Karo | Eka | Wiraswasta perdagangan | 4 |
| Karo | Dwi | Seniman musik dan lagu | 4 |
| Karo | Tri | Aparat pemerintah, Penegak hukum, ABRI, Industri tekstil, Biro jasa, Pegawai atau pemimpin biro bangunan dan real estate | 4 |
| Katiga | Eka | Wartawan, Komunikasi | 5 |
| Katiga | Dwi | Pengacara atau pembela perkara | 5,6 |
| Katiga | Tri | Penerbit, Percetakan | 6 |
| Kapat | Eka | Tata ruang, Dekorasi interior | 6,7 |
| Kapat | Dwi | Pengarang | 7 |
| Kapat | Tri | Polisi, Penegakan hukum | 7 |
| Kalima | Eka | Polisi | 7 |
| Kalima | Dwi | Pembangunan, Kontraktor | 8 |
| Kalima | Tri | Kosmetik, Kapsalon | 8 |
| Kanem | Eka | Penerbit | 8 |
| Kanem | Dwi | Kemiliteran, Seni lukis | 8,9 |
| Kanem | Tri | Pembela perkara, Biro pengacara atau LBH | 9 |
| Kapitu | Eka | Produser film | 9,10 |
| Kapitu | Dwi | Tidak dinyatakan tegas | 10 |
| Kapitu | Tri | Wartawan | 10 |
| Kawulu | Eka | Perdagangan alat elektronik | 10,11 |
| Kawulu | Dwi | Pengarang | 11 |
| Kawulu | Tri | Pegawai negeri | 11 |
| Kasanga | Eka | Wartawan, Koresponden media | 12 |
| Kasanga | Dwi | Psikologi | 12 |
| Kasanga | Tri | Perkapalan | 12 |
| Kasadasa | Eka | Wartawan | 13 |
| Kasadasa | Dwi | Tidak dinyatakan tegas | 13 |
| Kasadasa | Tri | Pengarang | 13 |
| Desta | Eka | Seni | 14 |
| Desta | Dwi | Tidak dinyatakan tegas | 14 |
| Desta | Tri | Wirausaha teknik, Pabrik teknik, Bengkel | 14 |
| Saddha | Eka | Tidak dinyatakan tegas | 14,15 |
| Saddha | Dwi | Pelukis | 15 |
| Saddha | Tri | Penerbit | 15 |

`CareerReading` memuat status, Mangsa, interval sumber, hari, kelompok, daftar profesi, penekanan eksplisit atau null, penjelasan ulang, rujukan halaman cetak/PDF dan versi metode. Data aturan hanya di graph server; kontrak publik terpisah tidak berisi tabel profesi.

## Autentikasi dan otorisasi kelompok

Login memakai **NetraAccountProvider/Firebase Authentication dan API sesi existing** tanpa perubahan implementasi autentikasi Netra. Server `/api/samyoga/career` memanggil `requireNetraIdentity`; UID client tidak menentukan otorisasi. Token palsu, akun lain dan sesi kedaluwarsa ditolak.

Belum ada database atau koleksi kelompok pada produk. Karena itu tidak membuat endpoint pembaca kelompok tersimpan atau menganggap login memberikan akses ke data orang lain. Konteks perhitungan sementara hanya dibuat dari data anggota yang pengguna isikan sendiri, setelah ia menyatakan hak penggunaan data anggota. Pernyataan ini bukan bukti teknis persetujuan setiap orang; jika kelak ada kelompok tersimpan/kolaboratif, ACL keanggotaan server harus dirancang terpisah.

Dua langkah POST pada endpoint yang sama:

1. `authorize`: auth server valid + konfirmasi hak anggota + ID dan tanggal lahir3-6 anggota. Nama dan jam tidak dikirim. Server menerbitkan ID konteks acak dan grant AES-256-GCM berisi UID, hash sesi terverifikasi, digest kanonik ID/tanggal anggota, dan expiry. Respons belum memuat profesi.
2. `analyze`: auth diulang; grant, groupId, UID, hash sesi, digest anggota dan expiry harus cocok sebelum engine dijalankan. Grup akun lain, ID tebakan, data anggota yang diubah dan grant palsu tidak membuka hasil. Permutasi anggota yang sama tidak mengubah izin.

Grant paling lama10menit dan tidak melewati expiry sesi. Key hanya acak di memori proses; tidak ada secret baru dalam konfigurasi. Restart atau perpindahan proses membuat grant gagal tertutup; pengguna dapat melakukan verifikasi ulang. Docker existing menjalankan satu `node server.js`. Jangan menganggap skema proses-lokal ini cukup untuk load balancing banyak proses/server; sebelum skala itu, tentukan strategi shared key/rotasi tepercaya atau store izin yang sesuai, tanpa fallback tidak aman.

Semua permintaan dibatasi4096byte, schema ketat, ID unik1-64karakter, jumlah3-6, tanggal sipil valid, same-origin dan auth server. Respons/error memakai `Cache-Control: private, no-store`. Body, tanggal, nama, grant, token dan hasil tidak dicetak ke log/analytics atau URL. Tidak menulis database/riwayat. Grant hanya memuat digest, bukan tanggal lahir plaintext.

Browser tidak menghitung profesi sendiri. Data hasil hanya diterima sesudah verifikasi server, dan tidak ada hasil di HTML/props/state awal anonim. Nama tetap lokal; DOB hanya dikirim lewat body setelah tindakan eksplisit. Izin dibatalkan, tanggal/anggota berubah, analisis ulang/reset, login/logout, sesi kedaluwarsa, request dibatalkan atau hasil usang akan menutup/membuang hasil profesi. Hasil Samyoga publik tetap tersedia.

## Pengujian dan batas bukti

Jalankan `node --test tests/*.test.mjs`, TypeScript, ESLint delta dan production build. Tes baru memeriksa36 aturan, interval dan pergantian tahun, kabisat/4-5Feb, dua timezone, keputusan null/ganda, grant UID/sesi/data, expiry, schema/payload, rendering anonim dan golden output posisi.

Smoke test eksplisit: `node scripts/test-samyoga-career-browser.mjs --screenshots`, hanya terhadap loopback dengan Chrome CDP9327 dan Auth Emulator9097. Uji input sintetis, login nyata emulator, hak anggota, server grant, akun lain, perubahan tanggal, expiry response fixture, logout/reset,320/390/1440 dan tidak ada storage/URL data lahir. Screenshot disimpan hanya atas flag tersebut di coverage ignored.

Pengujian emulator bukan bukti pengujian akun production. Tidak memublikasikan rules, mengubah deployment atau menyimpan input nyata. Tidak ada dependency baru atau migrasi data. Semua kode Netra, Firebase Rules, logging statistik, kalender dan evaluator posisi tetap utuh.

## Hasil verifikasi final lokal

- 232/232 tes gabungan lulus, juga232/232 pada Asia/Makassar dan232/232 pada America/Los_Angeles.
- TypeScript noEmit, ESLint delta, production build dan release gate lulus.
- Browser production profesi:10 pemeriksaan lulus;viewport320/390/1440. Kasus expiry memakai fixture respons expiry singkat yang dinyatakan eksplisit.
- Browser Samyoga existing:8 alur lulus,3-6 anggota, distribusi/pasangan/posisi identik, disclosure, keyboard, reset dan parity Otonan Los_Angeles.
- Netra Hasta:9 UI,14 lifecycle/capture sintetis,15 login/riwayat emulator, serta editor Rekha berbantuan lulus.
- Snapshot9 kelompok posisi/Ketua sebelum dan sesudah identik SHA-256 `92a7522dd7e567ca001e6d592840f8c9f76ff978d2791517cc7d6212e50348c7`.
- 94 file protected tetap identik dengan checkpoint, termasuk engine budaya/posisi, Netra, rules, dependency dan deployment. Tabel profesi tidak ditemukan di bundle JS client.
- Tidak ada data production yang dibaca/diubah. Screenshot hanya data sintetis pada coverage ignored.
- Java21 existing dipakai untuk emulator; tidak ada instalasi dependency. Token palsu dengan bentuk klaim Firebase lengkap ditolak401. Fixture awal tanpa field firebase memicu bug500 pada emulator yang dipetakan503/fail-closed; fixture diperbaiki tanpa mengubah verifier autentikasi.
- Warning Recharts Otonan existing mengenai ukuran -1 masih ada. Tidak ada kegagalan tes final atau exception rendering baru. Docker CLI tidak tersedia; kamera fisik, akun production dan HTTPS Komodo tidak diuji ulang.

Fitur siap untuk review lokal. Belum melakukan commit fitur, push, PR, merge, deploy, atau publish rules.


## Refactor layout hasil - 9 November 2026

- Semua hasil posisi/Ketua, kontribusi, Lintang dan disclosure alasan tetap gratis serta identik. Slot renderCareer dilepas dari komponen posisi; tidak ada perubahan evaluator atau mapping.
- Section Ramalan Profesi memakai kartu putih, judul serif, warna primary, radius dan spacing Metemu. Desain kunci per kartu pada refactor awal digantikan oleh satu locked-result kelompok (lihat pembaruan berikut). Yang diburamkan bukan hasil aktual.
- Hook, dua langkah authorize/analyze, autentikasi dan grant tetap memakai implementasi existing. Hasil dipetakan berdasarkan memberId lalu dirender sesuai urutan input; respons yang urutannya berbeda tidak menukar anggota. Tombol verifikasi dinonaktifkan saat hasil masih terbuka untuk menghindari perhitungan ulang tanpa kebutuhan.
- Logout, pembatalan izin, expiry, analisis ulang/perubahan anggota atau tanggal mengembalikan kartu ke skeleton. Tidak ada profesi/tabel privat pada HTML anonim atau bundle client. Contoh edukasi tetap di halaman Tentang merupakan konten publik yang disengaja.
- Verifikasi refactor: 244/244 tes gabungan lulus, TypeScript, ESLint delta dan production build lulus. Browser profesi: 13 pemeriksaan lulus pada 320/390/768/1440, termasuk Enter/Space, login emulator, izin, grant, penolakan UID lain, expiry fixture, perubahan input dan logout. Screenshot eksplisit hanya data sintetis di coverage/samyoga-career-layout-browser.
- Regresi browser Netra pada build yang sama: 9 UI, 14 lifecycle kamera sintetis, 15 auth/riwayat emulator serta editor Rekha berbantuan lulus. Tidak mengklaim uji kamera fisik atau akun production baru.
- Batas key proses lokal dan deployment multi-instance tetap seperti audit sebelumnya; refactor ini tidak mengubah keamanan backend, rules atau konfigurasi deployment.


## Locked-result kelompok mengikuti Netra Hasta - 9 November 2026

Judul dan deskripsi berada di luar blur. Setelah deskripsi ada satu container min-height 390px, radius 18px, latar #faf9f6 dan border #ded7cf. Satu grid skeleton kosong memakai blur 5px; overlay merupakan elemen sibling sehingga teks dan CTA tidak ikut terfilter. Jumlah skeleton mengikuti jumlah anggota tanpa memuat identitas atau hasil profesi. Tidak ada ikon kunci, CTA atau kartu profesi individual sebelum akses dibuka.

Overlay anonim bertuliskan Masuk untuk melihat ramalan profesi dengan satu tombol Masuk / Daftar. Klik/Enter membuka form akun existing dan memfokuskan email. Setelah login, persetujuan dan verifikasi existing tersedia di overlay. Hasil semua anggota baru dirender setelah grant valid; akun lain/konteks berubah tetap ditolak di server. Checkbox batal, logout, expiry dan reset mengembalikan satu locked-result. Loading/error tidak memuat hasil privat. Respons 401 memerlukan login ulang; pengujian expiry/401 browser memakai fixture respons yang eksplisit, sedangkan penolakan token/grant server juga diuji terpisah.

Kartu profesi kini khusus untuk reading terverifikasi dan mengembalikan null jika reading tidak tersedia. Seluruh isi hasil terbuka dipertahankan, urutan/nama tetap konsisten dan heading bidang memakai h4 setelah nama anggota h3. Implementasi posisi, hook, endpoint/grant, 36 aturan, halaman Tentang, Netra Hasta, rules dan konfigurasi deployment tidak diubah.

Verifikasi: 245/245 tes regresi gabungan lulus; TypeScript, ESLint delta dan production build lulus. Browser profesi lulus 15 pemeriksaan: satu overlay/CTA, filter blur terpisah dari judul/overlay, keyboard Enter/Space, login gagal/berhasil, izin dan grant, cross-UID, tanggal berubah, expiry, 401/login ulang, logout/reset dan jumlah anggota berubah. Viewport 320/390/768/1440 tanpa overflow. Browser Samyoga 3-6 anggota dan parity Otonan Los_Angeles lulus; golden hasil posisi/Ketua tetap identik.

Screenshot eksplisit memakai data/akun sintetis di coverage/samyoga-career-lock-browser. Emulator dan kamera sintetis bukan bukti pengujian ulang kamera fisik atau layanan Komodo production. Keterbatasan key per proses dan kebutuhan review deployment multi-instance tetap berlaku; tidak ada commit/push/deploy/publish rules.
