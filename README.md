# Project Name

**Metemu ? Eksplorasi Kalender Tradisional Bali dan Netra Hasta**

Netra Hasta berstatus **Beta / Dalam Pengembangan**. README ini menjelaskan kode Web yang tersedia di repository, bukan jaminan bahwa seluruh konfigurasi lokal sudah aktif di deployment publik.

## Description

Metemu adalah aplikasi web untuk menjelajahi kalender kelahiran Bali, Otonan, dan perhitungan hubungan tradisional. Netra Hasta menambahkan pemindaian tangan/wajah di browser, pengambilan area telapak, dan peninjauan kandidat lipatan berbantuan pengguna.

Hasil kalender berasal dari engine Metemu existing. Interpretasi bersifat simbolis/tradisional, bukan asesmen ilmiah tentang kesehatan, nasib, kepribadian, kompetensi, atau keberhasilan hubungan.

## Problem & Target User

Informasi kalender Bali dan istilah perhitungan tradisional sering tersebar serta sulit dijelajahi pengguna awam. Metemu menyajikan perhitungan dan penjelasan melalui alur web; Netra Hasta membedakan hasil AI, pemrosesan citra, label pengguna, dan hasil kalender.

Pengguna sasaran: masyarakat yang ingin mempelajari kalender/tradisi Bali serta pengunjung demonstrasi edukasi budaya. Produk ini tidak ditujukan untuk diagnosis medis, identifikasi biometrik, atau penetapan keputusan hidup.

## Key Features

| Fitur | Route / perilaku yang tersedia |
| --- | --- |
| Kecocokan pasangan | `/kecocokan-pasangan`: perhitungan pasangan memakai engine existing. |
| Mencari Jodoh | `/mencari-jodoh`: pencarian kandidat tanggal lahir dalam rentang tahun; bukan pencarian identitas orang. |
| Ramalan Pernikahan | `/ramalan-pernikahan`: perhitungan tradisional dari input pasangan. |
| Mencari Otonan dan Ramalan Otonan | `/mencari-otonan`, `/ramalan-otonan`: kalender kelahiran, Wewaran, Wuku, Lintang, dan hasil terkait. |
| Samyoga pasangan | `/pawongan-sinergi`: perhitungan Samyoga pasangan. UI kelompok dari worktree terpisah tidak termasuk fitur cabang ini. |
| Netra Hasta publik | `/netra-hasta`: tanggal lahir, jam opsional, izin kamera, tracking, quality gate, capture ROI, hasil dasar, retake/reset. |
| Peninjauan empat Rekha | Pengguna dapat mengonfirmasi segmen atau menggambar Heart/Head/Life/Fate pada ROI. Asal dan ketidakpastian hasil dibedakan. |
| Ramalan Detail | `/netra-hasta/detail`: login wajib; hasil Otonan, maksimal tiga kandidat tanggal lahir Jodoh sesuai engine/rentang, dan status Rekha sesi. |
| Akun dan riwayat | `/netra-hasta/akses-detail`, `/netra-hasta/riwayat`: daftar/masuk/keluar, simpan dengan persetujuan, buka kembali, dan hapus hasil milik sendiri, jika layanan/rules telah aktif. |

Tanpa login, pengguna tetap dapat memakai alur hasil dasar. Mode wajah menampilkan landmark/rasio geometris teknis, tanpa tafsir karakter atau kesehatan.

## Tech Stack

- Next.js App Router, React, TypeScript.
- Tailwind CSS dan stylesheet khusus Netra Hasta.
- MediaPipe Tasks Vision `1.1.1`, model Hand/Face Landmarker, serta JS/WASM lokal di `public/mediapipe/`.
- Canvas dan Web Worker untuk ekstraksi kandidat `dark-ridge-v1`.
- Firebase Authentication Email/Password, Firestore, dan REST API Firebase dari server Next.js.
- Recharts untuk grafik Pal Sri Sedana; KaTeX/React KaTeX untuk rumus di halaman Tentang.
- Node.js/npm; Next.js standalone output dan Docker Compose existing untuk deployment Komodo.

Versi dependency definitif mengikuti [package.json](package.json) dan [package-lock.json](package-lock.json). Backend Python, FastAPI, OpenCV, dan model ONNX riset tidak digunakan oleh runtime Web ini.

## AI Implementation

1. **Inferensi model pretrained:** MediaPipe Hand Landmarker mendeteksi 21 landmark tangan; Face Landmarker mendeteksi landmark wajah. Frame kamera tetap diproses di browser.
2. **Geometri dan kualitas:** landmark membantu membentuk Palm ROI. Kamera/consent, satu tangan, ROI valid, dan stabilitas menjadi hard gate. Brightness, contrast, dan sharpness adalah soft gate; manual capture tetap memiliki peringatan kualitas.
3. **Kandidat lipatan:** `dark-ridge-v1` memproses piksel ROI dalam Web Worker. Ini pemrosesan citra klasik yang menghasilkan segmen tanpa kelas, bukan classifier empat Rekha. Algoritma dapat abstain atau gagal.
4. **Label berbantuan pengguna:** `automatic_candidate`, `user_confirmed`, `user_drawn`, `uncertain`, dan `unsupported` memiliki arti berbeda. Segmen otomatis tanpa kelas tidak otomatis menjadi Heart/Head/Life/Fate. Fate dapat ditandai pengguna; belum dideteksi otomatis oleh model.
5. **Kalender dan Jodoh:** hasil dihitung terpisah oleh engine kalender/matching existing, bukan oleh model visi.

Klasifikasi otomatis empat Rekha **belum tervalidasi**. Eksperimen auto-Rekha dan N9?N11 tidak diaktifkan pada halaman utama. Model, sumber, lisensi, dan catatan privasi MediaPipe tersedia di [dokumentasi aset](public/mediapipe/README.md).

## Architecture / Data Flow

```text
Tanggal lahir + jam opsional
  -> validasi civil date dan perhitungan kalender existing
  -> persetujuan kamera -> MediaPipe di browser
  -> quality gate -> capture ROI lokal
  -> Web Worker dark-ridge-v1 -> segmen tanpa kelas / abstain
  -> konfirmasi atau penandaan pengguna -> hasil dasar
  -> login Firebase -> verifikasi identitas di server Next.js
  -> Ramalan Detail: Otonan + Top-3 Jodoh + status Rekha sesi
  -> persetujuan simpan -> API riwayat -> Firestore milik UID
```

- Kamera, ROI, landmark, dan koordinat garis bersifat sementara di browser; alur Netra Hasta tidak mengunggahnya ke database. Hasil sementara dapat hilang saat refresh, tab ditinggalkan, reset, atau retake sesuai lifecycle.
- Server memverifikasi ID token Firebase, lalu memakai token pengguna untuk Firestore REST. Security Rules tetap berlaku; UID pemilik tidak dipercaya dari payload client.
- Riwayat berada di `netraHastaUsers/{uid}/results/{recordId}`. Data minimum mencakup tanggal/jam lahir, ringkasan/status/versi metode, waktu simpan, serta snapshot detail v2. Schema v1 tetap dibaca. Penyimpanan memerlukan persetujuan, dan data dipertahankan hingga pemilik menghapusnya.
- **Penandaan manual empat Rekha belum disimpan ke riwayat.** Gambar, koordinat, fingerprint, atau template biometrik tidak termasuk payload simpan.
- Pencatatan aktivitas `daily_logs` terpisah dari riwayat akun. Implementasi lokal memakai opt-in dan validasi payload; penerapan production harus sesuai rules yang dipublikasikan. Ini bukan bukti bahwa setiap input pengguna telah tercatat.
- Login/riwayat memerlukan layanan Firebase; jangan menganggap seluruh produk offline. Potensi telemetri dependency MediaPipe dijelaskan pada dokumentasi aset.

Kode utama: [alur produk](components/netra-hasta/NetraHastaFlow.tsx), [kontrak hasil](lib/netra-hasta/product-flow.ts), [verifikasi identitas](lib/netra-hasta/firebase-identity.server.ts), [API riwayat](app/api/netra-hasta/history/route.ts), dan [repositori riwayat](lib/netra-hasta/history.server.ts).

## Installation / Run Instructions

Prasyarat: Node.js dan npm yang kompatibel dengan dependency lockfile. Worktree ini diuji lokal dengan Node.js `22.23.4`. Kamera membutuhkan browser yang mendukung `getUserMedia`, izin pengguna, serta HTTPS atau localhost.

```bash
npm ci
npm run dev
```

Buka `http://localhost:3000/netra-hasta`. `predev` dan `prebuild` otomatis menjalankan generator worker; model `.task` dan WASM sudah tersedia di `public/mediapipe/`.

Untuk akun, aktifkan Email/Password dan authorized domain pada Firebase project yang sesuai [konfigurasi aplikasi](firebase/config.ts). Riwayat hanya boleh diaktifkan **setelah rules owner-only dipublikasikan, diperiksa, dan diuji**. Tambahkan konfigurasi server berikut ke `.env.local` untuk lokal, atau environment runtime container untuk deployment:

```dotenv
NETRA_HISTORY_ENABLED=true
NETRA_HISTORY_RULES_PROJECT=daily-logs-a1442
```

Jika variable belum tersedia atau project tidak cocok, API mengembalikan `history_disabled`. `.env.local` diabaikan Git; jangan memasukkan password, token, service-account key, atau rahasia ke repository. Desain akun saat ini tidak membutuhkan Firebase Admin private key. Restart proses setelah mengubah konfigurasi. Jangan membuka read publik Firestore untuk mengatasi error riwayat.

Pemeriksaan dan build:

```bash
node --test tests/*.test.mjs
npx tsc --noEmit
npx eslint components/Header.tsx
npm run build
npx next start --hostname 0.0.0.0 --port 3000
```

Perintah langsung `next start` di atas juga dapat dipakai di PowerShell; script `npm start` existing memakai ekspansi `${PORT:-3000}` dari shell POSIX. Tes integrasi emulator dan skrip browser dijalankan terpisah dengan layanan lokal yang disyaratkan masing-masing; jangan menjalankan tes Firebase live dengan akun/data pengguna nyata.

Dockerfile menggunakan standalone output. Compose existing memetakan layanan utama `3010:3010` dan preview `3011:3010`. Gunakan konfigurasi Komodo existing, HTTPS, dan environment runtime yang sesuai. File deployment/dependency cabang ini belum mengikuti seluruh hardening di `origin/main`; baca Known Limitations sebelum rilis.

## Deployment URL

- Website: [https://metemu.nusaheritage.id/](https://metemu.nusaheritage.id/)
- Netra Hasta: [https://metemu.nusaheritage.id/netra-hasta](https://metemu.nusaheritage.id/netra-hasta)

URL tersebut merupakan alamat deployment proyek. Versi yang dinilai lomba harus dicatat sebagai commit hash atau tag submission, dan deployment harus cocok dengan versi tersebut. README ini tidak membuktikan commit yang sedang berjalan pada server atau status rules Published terkini.

## Demo Account

Hasil dasar tidak memerlukan akun. Untuk detail/riwayat, gunakan registrasi Email/Password jika layanan telah diaktifkan, atau akun uji yang disediakan penanggung jawab melalui kanal privat kepada juri.

- Kontak penanggung jawab demo: **[BELUM DIISI ? isi kontak resmi tim]**.
- Tidak ada password, token, private key, atau credential akun demo yang dipublikasikan di README.
- Gunakan data contoh untuk demonstrasi; jangan memasukkan data pribadi pihak lain.

## Known Limitations

- Empat kelas Rekha belum dikenali otomatis secara andal. Kandidat dapat mengikuti tepi tangan, bayangan, noise, atau tekstur kulit. Label/garis manual juga dapat keliru; tidak ada klaim validitas ilmiah atau budaya baru.
- Jam lahir kosong dipertahankan sebagai tidak diketahui. Penyesuaian hari sebelum 06:00 tidak dapat dipastikan tanpa jam lahir.
- Hasil kamera bergantung pada perangkat, pencahayaan, posisi, izin browser, dan kualitas ROI. Uji fisik diperlukan pada perangkat demo; fixture otomatis tidak menggantikannya.
- Detail/riwayat bergantung pada Firebase Auth, rules owner-only, konfigurasi runtime, dan ketersediaan layanan. Error kuota, permission, dan query perlu dibedakan; keberhasilan emulator tidak membuktikan production sudah pulih.
- `daily_logs` lokal masih merupakan jalur terpisah yang perlu peninjauan aktivasi, retensi, anti-spam/biaya, dan akses pengelola. Dashboard/CSV client bukan akses pengelola yang aman hanya karena alamatnya tidak diumumkan. Jangan membuka pembacaan dokumen pribadi kepada publik.
- `origin/main` lokal memiliki hardening release yang belum masuk HEAD cabang ini, termasuk dependency, Node/Docker, logging, dan pembatasan statistik. Perubahan README/navbar/footer tidak menggantikan pekerjaan integrasi tersebut. Jangan mengembalikan versi lama saat menyiapkan rilis.
- Eksperimen di `/dev/*` adalah development-only. Python/ONNX dan riset AI pada worktree terpisah tidak termasuk fitur produksi atau persyaratan menjalankan Web.
- Sumber/lisensi beberapa gambar `googleusercontent.com/aida-public` dan referensi tekstur `batik-fractal.png` belum terverifikasi lengkap. Kredit tidak menggantikan izin penggunaan.

## Third-party Resources / Credits

| Resource | Penggunaan | Lisensi / sumber yang tercatat |
| --- | --- | --- |
| Google MediaPipe Tasks Vision, Hand/Face Landmarker, JS/WASM | Tracking tangan/wajah | Apache-2.0 sesuai catatan sumber/model card pada [dokumentasi aset](public/mediapipe/README.md); [salinan lisensi](public/mediapipe/LICENSE-APACHE-2.0.txt). |
| Next.js, React, Tailwind CSS | Framework dan UI | MIT, menurut manifest paket terpasang. |
| Firebase JavaScript SDK | Autentikasi/database | Apache-2.0 untuk SDK; layanan Firebase memiliki ketentuan layanan tersendiri. |
| Recharts | Grafik Pal Sri Sedana | MIT; digunakan di [PalSriSedanaChart](components/PalSriSedanaChart.tsx). |
| KaTeX / React KaTeX | Render rumus halaman Tentang | MIT. |
| Material Icons / Material Symbols | Ikon UI | [Google Material Design Icons](https://github.com/google/material-design-icons), Apache-2.0. |
| Playfair Display, Plus Jakarta Sans; Crimson Pro dan Inter pada halaman Tentang | Font | SIL Open Font License 1.1; sumber Google Fonts. |
| Gambar dekoratif dan tekstur eksternal | Tampilan beberapa halaman existing | Provenance/lisensi belum seluruhnya diverifikasi; lihat Known Limitations. |

Dependency langsung dan transitif lainnya tercatat pada lockfile; daftar ini bukan audit lisensi transitif lengkap. Pertahankan copyright, lisensi, dan notice dependency yang didistribusikan.

Halaman [Tentang](app/about/page.tsx) sudah mencantumkan daftar pustaka dan tautan Ortibali, Sayahindu, serta Jurnal Merpati untuk konteks budaya. Pencantuman referensi tidak berarti semua klaim telah mendapat verifikasi ahli. Teknologi pihak ketiga tidak boleh diklaim sebagai model yang dilatih sendiri oleh tim Metemu.

## Team Members

Identitas dan pembagian peran tim belum tersedia sebagai informasi terverifikasi untuk README ini. Lengkapi sebelum submission:

| Nama | Peran / kontribusi |
| --- | --- |
| **[BELUM DIISI ? nama anggota tim]** | **[BELUM DIISI ? kontribusi aktual]** |

Tambahkan anggota sesuai komposisi tim sebenarnya; jangan menganggap nama akun Git sebagai bukti identitas atau peran.
