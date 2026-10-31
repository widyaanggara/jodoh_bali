# Keputusan domain dan produk — G6A.4

Status paket: **READY FOR DOMAIN DECISION**. Aktivasi rekomendasi/G6B tetap HOLD sampai keputusan eksplisit tercatat.

Baseline terverifikasi: branch `feat/samyoga-group`, HEAD `13892cea1603d3a134d6480323adecf419923842` (`feat(samyoga): add audited position recommendation foundation`). Working tree awal bersih. `abba71b` masih ancestor. Commit R1 ada secara lokal; G6A.4 tidak membuat commit.

Tidak ada konvensi dokumentasi domain existing selain README template. Empat artefak ditempatkan pada `docs/`:

- [Katalog evidence](samyoga-position-evidence-catalog.md): 132 identitas record, 311 field; 22 kandidat prioritas dan 3 usulan ditolak.
- [Dimensi](samyoga-position-dimensions.md): definisi, bukti pendukung, batas dan konteks caution.
- [Ruleset review](samyoga-position-ruleset-review.md): empat object kandidat nonaktif, status Co-Leader/Anggota, dan kebijakan konflik.
- Dokumen ini: pemilik keputusan, gap runtime, Pal Sri Sedana, dan penerimaan menuju G6B.

## Register keputusan pemilik produk

Semua baris saat ini **pending**. Usulan dokumen bukan keputusan yang sudah disetujui.

| ID | Keputusan yang diminta | Usulan untuk ditinjau | Konsekuensi jika belum disetujui |
| --- | --- | --- | --- |
| P-01 | Definisi enam dimensi sebagai konstruksi produk | Pakai enam dimensi terbatas di dokumen dimensi; coordinating tetap HOLD | Tidak ada pemetaan posisi aktif |
| P-02 | Fungsi Leader dan Management serta syarat dimensinya | Leader memerlukan directing/collaborating/communicating; Management planning/managing | Dua rule tetap review_only |
| P-03 | Kriteria Operasional | executing dengan qualification consistency atau precision, tanpa hierarki terhadap Leader | HOLD sampai OR/AND aspek diputuskan |
| P-04 | Global vs per-rule conflict | Pertahankan global current; per-rule butuh output eligibility terpisah dan review | Jangan mengubah evaluator diam-diam |
| P-05 | Apakah Koordinator mempunyai fungsi yang berbeda | Nyatakan fungsi penyelarasan aktivitas, lalu cari dukungan yang membedakannya | HOLD; komunikasi+sosial saja belum cukup |
| P-06 | Apakah Co-Leader dibutuhkan sebagai keluaran kalender | Bila hanya delegasi organisasi, kelola pada modul terpisah | Tidak dibuat rule Co-Leader |
| P-07 | Anggota sebagai fallback | Tolak fallback; gunakan insufficient_basis | Tidak ada rule Anggota |
| P-08 | Kandidat sama dan tidak ada kandidat | Izinkan duplikasi; tidak wajib satu Leader; jangan mengisi posisi agar semua berbeda | Tidak ada alokasi unik |
| P-09 | Bahasa penjelasan dan batas penggunaan | Nyatakan interpretasi simbolis Metemu, bukan asesmen kompetensi | Tidak menerbitkan rekomendasi produksi |
| P-10 | Dual approval dan migrasi kontrak runtime | Evidence/domain dan pemetaan produk harus disetujui terpisah, dengan referensi keputusan | G6B perlu kontrak/gate tambahan sebelum aktivasi |
| P-11 | Penggunaan Samyoga | Relasi tetap konteks, tidak memengaruhi eligibility/ranking posisi individu | Tidak ada promosi/demosi dari Utama/Nista |
| P-12 | Privasi saat UI rekomendasi kelak dibangun | Pakai modul murni dan state lokal; jangan panggil logActivity | Tidak menggunakan halaman/provider logging untuk input |

## Register review ahli Wariga

Semua item **pending**; tidak ada nama reviewer, tanggal review, sumber, atau halaman yang diisi seolah sudah ada.

| ID | Review yang diminta | Bukti yang perlu diberikan | Dampak |
| --- | --- | --- | --- |
| W-01 | Autentisitas dan konteks teks master | Edisi naskah/buku, halaman atau locator tepat, kecocokan kalimat/terjemahan | Provenance tetap missing sebelum bukti tersedia |
| W-02 | Makna tiap assertion dimensi | Review 22 kandidat secara individual; boleh menyetujui teks tetapi menolak dimensi | DomainReviewStatus evidence tetap pending |
| W-03 | Caution serta penanganan konteks | Fokus C-DIR-04, C-PLAN-03, C-COMM-04, C-COLL-04; tentukan konteks dan apakah polarity layak | Caution tidak diaktifkan lewat sentimen otomatis |
| W-04 | Pemisahan jenis indikator | Bedakan sifat hari Sadwara, makna simbolis, ramalan rezeki, dan perilaku personal | RJ-02/03 tetap ditolak |
| W-05 | Dependency antarindikator | Tandai alias Saptawara/Pancawara serta tag ganda pada satu kalimat | Jangan memakai duplikasi sebagai penguat |
| W-06 | Batas inferensi jabatan | Tinjau apakah istilah fungsi produk tidak mengklaim kategori Wariga asli | Approval evidence tidak mengesahkan pemetaan produk |
| W-07 | Indikator coordinating/Co-Leader | Bila mengusulkan, berikan teks yang membedakan fungsi, bukan sinonim belaka | Keduanya tetap HOLD |
| W-08 | Ketidaksepakatan antartradisi/penafsir | Catat variasi dan sumber alternatif, jangan gabung otomatis | conflicting_indicators/insufficient_basis dapat dipertahankan |

### Apa yang dimaksud persetujuan

Persetujuan sebaiknya berbentuk catatan yang dapat ditelusuri: ID keputusan/evidence/rule, versi, reviewer yang berwenang, konteks sumber, keputusan, alasan, dan batas penggunaan. Belum ada record persetujuan tersebut pada G6A.4. Tidak dibuat tanda tangan atau identitas reviewer rekaan.

Persetujuan pemilik produk atas penggunaan simbolis **tidak** menggantikan verifikasi teks budaya. Sebaliknya, verifikasi kutipan budaya **tidak** otomatis menyetujui relasinya dengan Leader/Management. Kemampuan profesional tidak dibuktikan oleh salah satu approval tersebut.

## Gap fondasi runtime yang perlu diputuskan sebelum aktivasi

1. Registry evidence produksi di [evidence:63](../lib/samyoga-position-evidence.ts#L63) dan rule produksi di [recommendation:64](../lib/samyoga-position-recommendation.ts#L64) kosong dan dibekukan.
2. Resolver [evidence:85](../lib/samyoga-position-evidence.ts#L85) memerlukan exact identity/quote, sourceId nonkosong, provenance verified, dan review approved; duplikasi ID gagal tertutup. Output yang melewati resolver dibekukan dan dikenali dalam proses yang sama.
3. Evaluator [recommendation:104](../lib/samyoga-position-recommendation.ts#L104) menolak rule pending/rejected, persyaratan kosong, dan Anggota. Namun interface [recommendation:40](../lib/samyoga-position-recommendation.ts#L40) **belum** memisahkan productApprovalStatus. Field dokumen tidak dapat dianggap ditegakkan runtime. G6B harus menambahkan kontrak dan tes gate secara eksplisit setelah P-10.
4. Runtime hanya memeriksa requiredDimensions, belum sourceEvidenceIds allowlist, aspek consistency/precision, optionalDimensions atau activationStatus dokumen. Jangan membuang field-field itu saat mengonversi proposal.
5. Belum ada kontrak agregasi per kandidat untuk kebijakan konflik per-rule. Default current dijelaskan dalam ruleset review dan tidak diubah.
6. Calendar snapshot tidak mengeluarkan rekomendasi. [Adapter:322](../lib/samyoga-calendar-snapshot.ts#L322) memakai civil date/jam tervalidasi dan nilai engine existing; interpretasi master terpisah. Next Otonan yang bergantung waktu sistem tidak dimasukkan dalam snapshot.
7. Generic evaluator dengan fixture sintetis bukan engine budaya yang disetujui. Semua fixture approved hanya untuk tes dan tidak diimpor produksi.

## Pal Sri Sedana: HOLD terpisah

Pal Sri Sedana dikecualikan dari seluruh kandidat posisi, termasuk sebagai optional bonus atau tie-break. Peruntungan tidak menjadi kecakapan Management/Leader.

Fakta kode yang perlu domain policy:

- [pal-sri-sedana.ts:112](../lib/pal-sri-sedana.ts#L112) mengambil tanggal sistem langsung.
- [pal-sri-sedana.ts:116](../lib/pal-sri-sedana.ts#L116) membuat ulang ulang tahun, memerlukan keputusan 29 Februari di tahun nonkabisat.
- [pal-sri-sedana.ts:124](../lib/pal-sri-sedana.ts#L124) memakai floor(age/6).
- [pal-sri-sedana.ts:126](../lib/pal-sri-sedana.ts#L126) menahan nilai terakhir bila indeks melewati panjang tabel.
- [PalSriSedanaChart.tsx:39](../components/PalSriSedanaChart.tsx#L39) justru mengulang tabel melalui modulo.
- [About:571](../app/about/page.tsx#L571) dan [About:572](../app/about/page.tsx#L572) menampilkan rentang 0–6, kemudian 7–12.
- [About:578](../app/about/page.tsx#L578) mulai memuat sel kosong pada sebagian jumlah urip.

### Keputusan Pal Sri Sedana yang belum selesai

| ID | Pertanyaan domain | Usulan teknis untuk dibahas, belum diterapkan |
| --- | --- | --- |
| PAL-01 | Apakah usia 6 masih dalam periode pertama? | Tetapkan rentang inklusif atau half-open secara eksplisit; jangan memakai label dan rumus berbeda |
| PAL-02 | Bagaimana sel kosong dibaca? | unavailable daripada clamp/modulo tanpa dasar; ahli perlu memutuskan |
| PAL-03 | Apakah tabel boleh berulang? | Jangan mengulang sampai ada sumber yang mendukung |
| PAL-04 | Acuan waktu saat analisis | asOfDate civil wajib, tanpa default tersembunyi ke tanggal sistem |
| PAL-05 | Ulang tahun 29 Februari pada tahun biasa | Putuskan 28 Februari atau 1 Maret secara eksplisit |
| PAL-06 | Tanggal masa depan/usia negatif/di luar tabel | Error validasi atau unavailable dengan alasan yang disepakati |
| PAL-07 | Usia sipil atau umur tradisional? | Jangan mengasumsikan keduanya sama |
| PAL-08 | Narasi label Metemu | Pisahkan angka tabel, makna sumber, dan parafrasa produk |

Usulan kontrak informasi kontekstual (belum diimplementasikan):

```json
{
  "input": {
    "birthDate": "YYYY-MM-DD",
    "asOfDate": "YYYY-MM-DD",
    "policyVersion": "pending-domain-policy"
  },
  "output": {
    "status": "pending_domain_policy",
    "periodIndex": null,
    "value": null,
    "interpretation": null
  }
}
```

Ini contoh bentuk data, bukan hasil kalender nyata. Ketika policy disetujui, label status dapat mencakup available/unavailable; hasilnya tetap berada pada konteks periode yang terpisah dari posisi.

Rencana tes: usia sebelum/tepat/setelah 6, 7, 12, 13, 18, 19 tahun; ulang tahun yang belum/sudah lewat pada asOfDate; 29 Februari pada tahun kabisat/nonkabisat; sel terakhir/sel kosong/out-of-range; tanggal masa depan; timezone Makassar/Los_Angeles dengan asOfDate sama; input sama pada waktu sistem berbeda. Tidak ada rumus existing yang diperbaiki pada milestone ini.

## Privasi dan bukti sumber

Dokumen hanya berisi master umum dan proposal produk. Tidak ada data anggota, tanggal lahir pengguna, foto, anotasi biometrik, network, atau persistence baru.

Temuan R1 tetap berlaku: layout memuat provider global yang menginisialisasi Firebase Analytics. Fitur kelompok tidak memanggil logActivity, tetapi tidak boleh mengklaim seluruh aplikasi bebas telemetry. P-12 mengharuskan jalur rekomendasi kelak tidak mengirim snapshot/evidence ke provider tersebut. G6A.4 tidak mengubah Firebase atau logging existing.

Bibliografi global About bukan provenance per field. Semua sourceId/sourcePage kandidat null dan provenance missing. Verifikasi sumber primer, edisi, dan konteks masih pekerjaan W-01; milestone ini tidak mengklaim telah membaca atau memvalidasi semua buku tersebut.

## Validasi G6A.4

Pemeriksaan ringan yang digunakan:

1. Parse AST lib/data.ts; cocokkan inventaris 132 identitas/311 field, 22 kutipan evidence, dan 3 kutipan usulan penolakan.
2. Cocokkan indicatorType, cycle, masterRecordId, nilai dan sourceField; cek record alias dan C-DIR-01/C-MAN-02.
3. Validasi referensi lokal file+baris, status JSON pending/nonaktif, sourceId/sourcePage null, serta semua sourceEvidenceIds rule merujuk katalog.
4. Jalankan resolver terhadap seluruh siklus 210 hari menggunakan katalog dokumen sebagai draft: tidak ada evidence yang boleh aktif karena approval belum tersedia.
5. Verifikasi kedua registry produksi tetap kosong; evaluasi snapshot dengan jalur produksi tetap insufficient_basis.
6. git diff --check dan pemeriksaan scope terhadap baseline; protected engine dan kode runtime tidak berubah.

Ini pemeriksaan konsistensi teknis, bukan review budaya. Karena tidak ada perubahan TypeScript, dependency, atau runtime, TypeScript/ESLint/production build tidak perlu dijalankan ulang hanya untuk dokumentasi.

Hasil pemeriksaan nyata G6A.4:

| Pemeriksaan | Hasil |
| --- | --- |
| Artefak Markdown | 4 |
| Konteks indikator/siklus | 14 |
| Identitas record / record master fisik | 132 / 120 |
| Kutipan field inventaris cocok persis dengan AST | 311 / 311 |
| Kutipan evidence kandidat cocok persis | 22 / 22 |
| Kutipan usulan ditolak cocok persis | 3 / 3 |
| Referensi lokal file dan batas nomor baris | 374 valid |
| Object rule kandidat dengan field lengkap dan approval pending | 4 / 4 |
| Kandidat ditemukan pada snapshot dalam satu siklus 210 hari | 22 / 22 |
| Draft evidence aktif selama pemeriksaan | 0 |
| Evaluasi produksi tetap insufficient_basis | 210 / 210 |

Pemeriksaan AST juga mencocokkan nomor baris setiap field, bukan hanya keberadaan tautan. Pemeriksaan sumber tidak mengisi sourceId atau halaman rekaan. Verifikasi Git akhir menemukan empat file baru di docs/ yang belum tracked; tracked/staged changes kosong, HEAD tetap baseline, dan tidak ada perubahan runtime maupun protected engine. Whitespace file baru diperiksa terpisah karena git diff normal belum memasukkan untracked files.

## Kriteria selesai dan langkah berikut

Paket ini lengkap sebagai bahan keputusan, meskipun approval belum ada. READY FOR DOMAIN DECISION tidak mengizinkan aktivasi G6B atau mengesahkan rekomendasi posisi. Pemilik produk perlu menjawab P-01 sampai P-12; ahli meninjau W-01 sampai W-08. Isu Pal Sri Sedana tetap di jalur domain terpisah.

Sebelum G6B implementasi: keputusan evidence dan pemetaan produk harus eksplisit, kontrak gap harus diselesaikan, serta suite approval harus diperluas untuk gate yang disetujui. Setelah itu diperlukan instruksi implementasi tersendiri. Tidak ada commit/push/merge/reset/clean/switch branch pada G6A.4.
