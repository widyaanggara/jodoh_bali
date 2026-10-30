# Protokol Anotasi Empat Garis Telapak

Versi protokol: `rekha-visual-v1`. Status: development-only dan provisional.

## Tujuan

Menghasilkan anotasi visual yang dapat diaudit pada ROI `adaptive-roi-v1` tanpa
menggunakan output `dark-ridge-v1`, OpenCV, atau ONNX sebagai ground truth.

## Pemilihan sampel pilot

1. Pilih sampel dari beberapa `subject_group` anonim.
2. Bagi development/holdout pada tingkat subjek; semua foto satu subjek harus
   berada pada split yang sama.
3. Seimbangkan tangan kiri/kanan dan kamera depan/belakang bila tersedia.
4. Gunakan ROI yang dinilai benar. Jika ROI kurang tepat, catat penilaian ROI dan
   jangan memperbaiki koordinat anotasi secara diam-diam.
5. Jangan memilih sampel hanya karena detektor otomatis menghasilkan banyak garis.

## Pemeriksaan ROI sebelum menggambar

Pastikan ROI memuat:

- area di bawah pangkal jari untuk HEART;
- area antara ibu jari dan telunjuk serta thenar untuk LIFE;
- bagian tengah telapak untuk HEAD;
- bagian bawah hingga tengah telapak untuk FATE.

`adaptive-roi-v1` memakai wrist dan MCP, rotasi fingers-up, serta padding adaptif.
Ia tidak melakukan canonical mirror kiri→kanan. Anotasi selalu disimpan pada
koordinat piksel ROI yang tampil. Handedness wajib dicatat terpisah.

Jika garis berlanjut melewati batas ROI, gambar hanya bagian dengan bukti piksel,
set `truncated=true`, dan gunakan visibility `obscured` bila kelanjutannya tidak
dapat dinilai. Jangan memperpanjang garis berdasarkan perkiraan.

## Urutan anotasi

1. Sembunyikan kandidat otomatis bila memungkinkan.
2. Isi ID anotator anonim, misalnya `annotator-01`; jangan memakai nama pribadi.
3. Periksa LIFE, HEAD, HEART, dan FATE satu per satu.
4. Atur status kelas:
   - `visible`: garis terlihat dan harus memiliki sedikitnya satu polyline;
   - `obscured`: hanya sebagian/kelanjutannya tertutup atau tidak jelas;
   - `absent`: setelah pemeriksaan, tidak ada bukti visual garis tersebut;
   - `undetermined`: kualitas/ROI tidak memungkinkan keputusan.
5. Untuk garis terlihat, pilih kelas dan tarik polyline tepat mengikuti pusat
   lipatan. Gunakan beberapa polyline bila garis terfragmentasi nyata.
6. Gunakan `other` untuk lipatan nyata di luar empat kelas dan `unknown` jika
   kelasnya belum dapat ditentukan.
7. Tandai `ambiguous` bila lokasi tumpang tindih atau kelas diragukan.
8. Tandai `truncated` bila garis dipotong batas ROI.
9. Ekspor JSON/ZIP secara eksplisit. Tidak ada autosave.

## Status label

- `provisional`: anotasi awal seorang anotator.
- `verified`: bentuk dan kelas telah diperiksa ulang secara visual menurut
  protokol. Status ini **bukan** verifikasi budaya Bali atau ilmiah.
- `ambiguous`: bukti piksel ada, tetapi kelas/geometri belum pasti.

Untuk dataset classifier, status `verified` idealnya memerlukan review anotator
kedua atau adjudikasi. Jika hanya satu anotator tersedia, seluruh hasil harus
dilaporkan sebagai single-annotator dan inter-annotator agreement belum diuji.

## Larangan

- Jangan membuat polyline kosong untuk `absent` atau `undetermined`.
- Jangan menyalin kandidat detektor sebagai anotasi manual.
- Jangan memakai output pretrained sebagai kebenaran.
- Jangan menggambar segmen tanpa dukungan piksel.
- Jangan menafsirkan garis sebagai kesehatan, umur, kecerdasan, nasib, atau karier.
- Jangan mengunggah foto, anotasi, koordinat, atau fingerprint.

## Review pilot menuju 4B

Catat per subjek: jumlah ROI benar, jumlah kelas visible/obscured/absent/
undetermined, jumlah polyline provisional/verified/ambiguous, truncation, dan
alasan disagreement. Jangan menghitung akurasi classifier sebelum ground truth
diverifikasi dan holdout subjek dibekukan.
