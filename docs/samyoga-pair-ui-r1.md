# Samyoga Kelompok — UI-R1 Dinamika Relasi Kelompok

## Revisi tampilan — 2 November 2026

Sesuai permintaan terbaru pengguna, bagian **Lihat Tafsir Tradisional** beserta seluruh isi panelnya dihapus dari kartu pasangan. Narasi kategori, Mod5/Mod16 dan perhatian Nista tetap ditampilkan. Data tafsir di hasil/engine/master tetap utuh; helper khusus disclosure yang tidak lagi digunakan dibersihkan dan tes presentasi disesuaikan.

Uraian disclosure dan smoke test di bawah merupakan catatan implementasi UI-R1 sebelumnya, bukan perilaku tampilan terbaru.

Status: **READY FOR UI REVIEW**. Route: /pawongan-sinergi/kelompok. Ini perubahan presentasi; kategori, hitungan, master dan algoritma tidak diubah.

## Baseline Git

Worktree C:\Project-Trispark\jodoh_bali_samyoga, branch feat/samyoga-group. HEAD awal/akhir 05d9a9227a5c93179776b275409f5493db80cb44. Working tree awal bersih, staged/unstaged/untracked kosong.

Checkpoint G6A.7-R1 tersedia pada c3eae7f, prototipe dan review G6A.8-R1 pada 05d9a92. Seluruh arsip milestone tersebut dipertahankan.

## Asal label dan kontrak data aktual

Sebelumnya [kartu di Results](../components/samyoga-group/SamyogaGroupResults.tsx#L276) menampilkan pair.sodasaRsi.label dan pair.sodasaRsi.makna langsung setelah remainder. Keturunan/Sulit Keturunan, Kekecewaan/Sering Tertekan, Rezeki dan Bermasalah/Banyak Masalah berasal dari master [dataSodasaRsi](../lib/data.ts#L804).

[calculateLeadershipSynergy](../lib/synergy-logic.ts#L26) mengambil record Sodasa Rsi berdasarkan Mod16. Kategori hybrid Utama/Madia/Nista merupakan hasil aturan gabungan Mod5 dan Mod16. [G2](../lib/samyoga-group.ts#L245) memanggil engine pasangan dan membawa modulo5, modulo16, category serta sodasaRsi berisi sisa/label/makna.

G2 **tidak** membawa deskripsi/penjelasan panjang master atau narasi m5_map/synergyTier ke hasil pasangan kelompok. Karena UI lama hanya menampilkan label dan makna, dua field itulah yang dipertahankan utuh. Tidak ada pengambilan master tambahan, duplikasi formula, tafsir Mod5 buatan, atau penggantian istilah perjodohan menjadi istilah organisasi.

Engine existing menyediakan sentinel Unknown saat record tidak ditemukan. Sebelumnya UI menampilkannya langsung; sekarang helper presentasi menganggap sentinel/kosong sebagai tidak tersedianya tafsir, sehingga tidak membuat disclosure kosong atau deskripsi pengganti. Data hasil aslinya tidak dimutasi.

## File yang berubah/dibuat

- Diubah: [SamyogaGroupResults.tsx](../components/samyoga-group/SamyogaGroupResults.tsx) — delegasi kartu pasangan dan dua kelas pembungkus label panjang di ringkasan anggota.
- Baru: [SamyogaGroupPairCard.tsx](../components/samyoga-group/SamyogaGroupPairCard.tsx) — header, kategori, dinamika relasi, remainder, disclosure dan perhatian Nista.
- Baru: [samyoga-pair-presentation.ts](../components/samyoga-group/samyoga-pair-presentation.ts) — teks kategori sesuai requirement dan pembacaan field presentasi tanpa kalkulasi budaya.
- Baru: [samyoga-pair-presentation.test.mjs](../tests/samyoga-pair-presentation.test.mjs) — sembilan tes unit/render SSR.
- Baru: laporan ini.

SamyogaGroupClient, form, splash, reset, hero, aura, jaringan anggota dan helper summary tidak diubah.

## Struktur dan narasi kartu

Header tetap memuat Pasangan, dua label anggota dan badge/icon/warna kategori existing. Judul utama menjadi **Dinamika Relasi Kelompok**.

- Utama: “Hubungan ini berada pada kategori Utama menurut perhitungan simbolis Samyoga. Kategori ini bukan jaminan kecocokan atau keberhasilan kerja sama.”
- Madia: “Hubungan ini berada pada kategori Madia menurut perhitungan simbolis Samyoga. Kategori ini tidak mengukur kualitas kerja sama antaranggota secara langsung.”
- Nista: “Hubungan ini berada pada kategori Nista menurut perhitungan simbolis Samyoga. Hasil ini merupakan perhatian dalam interpretasi tradisional, bukan bukti adanya masalah pribadi atau ketidakmampuan bekerja sama.”

Remainder Mod5 dan Mod16 tetap diambil langsung dari hasil G2. Perhatian simbolis Nista tetap terlihat, terpisah dari disclosure tradisional. Tidak ada kategori/skor baru, penilaian kompetensi, penentuan Ketua/Wakil atau tafsir organisasi turunan dari label tradisional.

## Disclosure dan aksesibilitas

Setiap kartu menggunakan details/summary native dengan teks **Lihat Tafsir Tradisional**, default tertutup. Tidak memakai attribute name yang mengikat beberapa details menjadi satu accordion; membuka satu kartu tidak membuka kartu lain.

Panel mempertahankan label/makna asli dengan sumber **Sodasa Rsi · Mod16**, ditambah keterangan persis:

“Tafsir ini berasal dari konteks pembacaan pasangan tradisional dan tidak digunakan sebagai penilaian kemampuan organisasi.”

Jika hanya satu field tafsir tersedia, field itu ditampilkan tanpa paragraf pengganti. Jika keduanya kosong/tidak tersedia/Unknown, seluruh disclosure dihilangkan.

useId memberi target panel unik dan stabil selama instance kartu terpasang; summary memiliki aria-controls ke target tersebut. Native browser menyediakan semantics expanded/collapsed, sehingga tidak menambahkan aria-expanded manual yang berpotensi tidak sinkron. Keyboard Enter/Space dan focus ring diuji nyata. Tidak ada nested button. Ketika seluruh Rincian Pasangan ditutup, kartu di-unmount sesuai perilaku existing; saat dibuka lagi tafsir default tertutup.

## Temuan responsivitas dan perbaikan terbatas

Pada smoke test dengan label sintetis panjang tanpa spasi, kartu pasangan baru tidak overflow. Namun ringkasan anggota existing membuat halaman 390 px melebar menjadi 668 px karena minimum intrinsik grid dan judul anggota tanpa pembungkusan.

Dua kelas CSS ditambahkan pada ringkasan anggota: min-w-0 pada article dan break-words pada nama. Isi, count, urutan dan struktur ringkasan tidak berubah. Setelah perbaikan, document scrollWidth sama dengan clientWidth pada viewport 390 dan 320 px; kartu pasangan juga tidak overflow.

## Hasil pengujian nyata

| Pemeriksaan | Hasil |
| --- | --- |
| Tes baru presentasi/SSR | **9/9 lulus** |
| Seluruh regression Samyoga | **214/214 lulus**, termasuk tes engine, kalender dan sandbox existing |
| Narasi tiga kategori | Cocok persis requirement |
| Tafsir asli | Seluruh 16 pasangan label/makna master tetap tersedia dan berasosiasi |
| Hasil G2 | Remainder identik, tidak ada mutasi input/output; jumlah pasangan 3/6/10/15 diuji |
| TypeScript | npx.cmd tsc --noEmit --incremental false — lulus |
| ESLint file terkait | Lulus |
| Production build final | npm.cmd run build — lulus Next.js 16.1.6 Turbopack; route kelompok tercantum |
| HTTP route | GET localhost:3127/pawongan-sinergi/kelompok — **200** |
| git diff --check | Lulus |
| Integritas kode protected | 94 dari 95 file baseline tracked identik SHA-256; satu perubahan hanya Results |

Build membutuhkan izin menulis .next pada worktree di luar writable root sesi; build final berhasil setelah eksekusi berizin. Tidak ada perubahan konfigurasi untuk mengatasinya. Verifikasi lokal memakai server Next produksi; deployment Docker/Komodo/packaging standalone tidak diubah atau diklaim diuji.

## Smoke test Chrome headless nyata

Dijalankan pada Chrome 156 melalui CDP, menggunakan profil sementara terpisah dan tanggal/label sintetis. Tidak menginstal Playwright, Puppeteer atau dependency lain.

- Desktop 1440 px: isi tiga anggota → splash → hasil; form menghilang, detail pasangan keseluruhan masih tertutup.
- Buka detail: tiga kartu muncul, semua tafsir tertutup. Label/makna asli ada di panel tetapi tidak terlihat pada kartu tertutup.
- Klik panel pertama: hanya panel itu terbuka. Panel kedua dapat dibuka/ditutup independen.
- Enter menutup dan Space membuka summary yang terfokus; aria-controls tetap menunjuk ID yang sama selama kartu terpasang.
- Viewport 1440/390/320 px: tidak ada overflow halaman maupun kartu, termasuk label panjang.
- Mobile 390 px: analisis ulang mereset label/tanggal; tambah sampai enam anggota, analisis dan tampilkan **15 kartu**. Semua remainder dan tafsir cocok dengan hasil G2.
- Toggle detail keseluruhan tetap bekerja; saat dibuka kembali seluruh tafsir tertutup.
- Accessibility tree menyediakan DisclosureTriangle dengan expanded state native. Tidak ada nested button.
- Nol uncaught exception pada alur desktop; pemeriksaan console setelah reload terhidrasi tidak menemukan error hydration.
- Nol POST selama alur desktop yang dimonitor; tidak ada pengiriman tanggal dalam payload. Domain telemetry Firebase/Analytics diblok pada browser pengujian. Ini tidak diklaim sebagai penghapusan telemetry global existing; kode fitur sendiri tidak menambah transport.
- Server localhost dan Chrome headless milik pengujian dihentikan setelah verifikasi. Tidak ada deployment publik.

Screenshot lokal sementara, tidak masuk Git:

- Desktop: C:\Users\wisnu\AppData\Local\Temp\metemu-ui-r1-desktop.png
- Mobile enam anggota: C:\Users\wisnu\AppData\Local\Temp\metemu-ui-r1-mobile-six.png
- Mobile 320 px dengan label panjang: C:\Users\wisnu\AppData\Local\Temp\metemu-ui-r1-mobile.png

Browser mobile adalah emulasi viewport, bukan pengujian perangkat smartphone fisik atau sertifikasi screen reader menyeluruh.

## Privasi, protected scope dan Git akhir

Tidak ada fetch/network, localStorage, IndexedDB, Firebase, analytics atau persistence baru pada komponen/helper. Disclosure native hanya state DOM sementara. Rekomendasi posisi dan prototipe Ketua/Wakil tidak diimpor atau diaktifkan.

SHA-256 membuktikan tidak ada perubahan pada synergy-logic, samyoga-group, samyoga-group-summary, balinese-calendar, data, Pal Sri Sedana, registry evidence, gate/evaluator posisi, seluruh prototipe/fixture Ketua/Wakil, package/lockfile, Firebase dan konfigurasi deployment.

Git akhir:

- Branch feat/samyoga-group, HEAD tetap 05d9a9227a5c93179776b275409f5493db80cb44.
- Satu tracked modified: components/samyoga-group/SamyogaGroupResults.tsx.
- Empat untracked baru: dua file komponen/helper, satu tes, satu laporan.
- Staged kosong. Tidak ada commit, push, merge, reset, clean atau switch branch.

**READY FOR UI REVIEW.** Seluruh kategori, formula dan data budaya identik; perubahan hanya lapisan tampilan dan pembungkusan teks.

