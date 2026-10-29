# Batas Arsitektur Netra-Hasta menuju FastAPI

Status infrastruktur Milestone 3C.2: service internal `palm-api` dan endpoint
`/health` sudah disiapkan, tetapi belum ada endpoint analisis atau pengiriman ROI.
Capture, quality assessment, ROI `adaptive-roi-v1`, preprocessing, dan eksperimen
kandidat garis masih berjalan lokal di browser. URL `PALM_API_INTERNAL_URL` hanya
tersedia untuk kode server-side Next.js dan belum dikonsumsi aplikasi.

Milestone 3C.2B menambahkan `opencv-palm-lines-v1` sebagai detector offline yang
dapat dipanggil melalui modul atau CLI. Keberadaan modul ini tidak mengubah
`analysis_enabled=false`, tidak mendaftarkan endpoint upload, dan bukan promosi
algoritma ke production. Aktivasi jaringan tetap menunggu benchmark ROI/anotasi
yang kompatibel serta persetujuan pengguna.

FastAPI hanya diekspos ke jaringan internal Compose pada port 8000. Tidak ada
published host port dan website tidak memiliki `depends_on` terhadap backend,
sehingga backend yang tidak sehat tidak menjadi syarat startup website.

Modul `dark-ridge-v1`, `evidence-bridge-v1`, dan `palm-interior-v1` dipertahankan
sebagai baseline penelitian dan alat regression comparison development. Ketiganya
bukan algoritma final production dan tidak boleh menjadi fallback diam-diam untuk
integrasi FastAPI.

Sebelum milestone berikutnya mengirim ROI ke PC server, desain dan PRD harus direvisi
secara eksplisit untuk mencakup:

- persetujuan pengguna yang menyebutkan bahwa citra telapak akan meninggalkan
  perangkat dan menjelaskan tujuan, tujuan server, serta masa retensinya;
- kanal terenkripsi dan autentikasi server, pembatasan ukuran/format payload,
  timeout, cancellation, dan perlindungan replay;
- kebijakan tanpa penyimpanan secara default, penghapusan buffer setelah respons,
  larangan logging body/koordinat biometrik, dan audit log yang hanya berisi
  metadata operasional non-biometrik;
- kontrak API berversi yang tidak melakukan fallback otomatis ke baseline lokal;
- perilaku abstain dan error yang transparan ketika server tidak tersedia;
- threat model, pengujian privasi, serta pembaruan kebijakan privasi sebelum fitur
  diaktifkan pada production.

Tidak ada foto, ROI, landmark, anotasi, fingerprint, atau metrik biometrik yang
boleh dikirim ke Firebase, Analytics, API eksternal, atau penyimpanan persisten
melalui implementasi Milestone 3C.1.
