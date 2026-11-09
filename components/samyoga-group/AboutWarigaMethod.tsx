// Public method guide and one synthetic educational example only.
// Never import the private career engine or its 36 profession rules into this component.
export const WARIGA_REFERENCE_URL = "https://id.scribd.com/document/743338223/Tenung-Wariga-Gemet?doc_id=743338223&order=702238034";
export const WARIGA_METHOD_EXAMPLE = {
    date: "2025-07-06",
    day: "Minggu",
    mangsa: "Kaso",
    interval: "23 Juni - 2 Agustus",
    group: "Eka",
    preferred: ["Pengarang", "Wartawan"],
    printedPage: 3,
    pdfPage: 8,
} as const;
export const WARIGA_LOOKUP_PSEUDOCODE = `tanggal = validasi_tanggal_sipil(input)
hari = hari_gregorian(tanggal)
kelompok = kelompok_hari(hari)

jika bulan(tanggal) == 2 dan hari_bulan(tanggal) == 4:
    hasil = { status: ambiguous, profesi: [] }
selain itu:
    mangsa = cari_interval_pranata(tanggal)
    hasil = Tabel36[mangsa][kelompok]`;

const dayGroups = [
    { name: "Eka", days: "Minggu, Rabu, Jumat" },
    { name: "Dwi", days: "Senin" },
    { name: "Tri", days: "Selasa, Kamis, Sabtu" },
];

export default function AboutWarigaMethod() {
    return (
        <section data-wariga-method aria-labelledby="wariga-method-title" className="mt-16 min-w-0">
            <h2 id="wariga-method-title" className="mb-6 flex items-start gap-3 text-2xl font-black text-primary">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">X</span>
                <span className="min-w-0">Metode Perhitungan Ramalan Profesi &mdash; Tenung Wariga Gemet</span>
            </h2>
            <p>
                Ramalan profesi pada Samyoga Group memakai <strong className="text-primary">Mangsa Pranata</strong> dan
                kelompok hari lahir untuk memilih entri dalam tabel sumber. Mangsa di sini merupakan interval tanggal
                tahunan dalam referensi Tenung Wariga Gemet, dengan penjelasan yang ditulis ulang oleh Metemu.
                Rujukan lengkap tersedia pada <a href="#tenung-wariga-gemet-reference" className="font-bold text-primary underline underline-offset-4">daftar pustaka [7]</a>.
            </p>

            <ol className="mt-8 list-none space-y-6 pl-0">
                <li className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="mb-3 text-lg font-bold text-primary">1. Membaca tanggal lahir sipil</h3>
                    <p className="text-sm leading-relaxed">
                        Tanggal harus membentuk tanggal Gregorian yang valid. Komponen tahun, bulan, dan hari dibaca
                        secara deterministik agar pergantian timezone tidak menggeser tanggal. Tanggal 29 Februari
                        hanya diterima pada tahun kabisat. Metode profesi memakai hari pada tanggal sipil tersebut;
                        aturan pergantian hari Bali pukul 06:00 tetap hanya berlaku pada engine yang menggunakannya.
                    </p>
                </li>
                <li className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="mb-3 text-lg font-bold text-primary">2. Menentukan satu dari 12 Mangsa</h3>
                    <p className="text-sm leading-relaxed">
                        Bulan dan tanggal dicocokkan dengan interval Mangsa pada dokumen. Contohnya, Kaso berlangsung
                        pada 23 Juni sampai 2 Agustus, sedangkan Kapitu mencakup 23 Desember sampai 3 Februari dan
                        melintasi pergantian tahun. Interval Mangsa Pranata ini tidak dipertukarkan dengan Sasih Bali.
                    </p>
                </li>
                <li className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="mb-3 text-lg font-bold text-primary">3. Mengelompokkan hari lahir</h3>
                    <p className="mb-4 text-sm leading-relaxed">Hari Gregorian dipetakan ke tiga kelompok sesuai sumber:</p>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {dayGroups.map(group => (
                            <div key={group.name} className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                                <dt className="font-bold text-primary">{group.name}</dt>
                                <dd className="mt-2 text-sm text-stone-600">{group.days}</dd>
                            </div>
                        ))}
                    </dl>
                </li>
                <li className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="mb-3 text-lg font-bold text-primary">4. Mengambil entri dari tabel 36 aturan</h3>
                    <p className="text-sm leading-relaxed">
                        Dua belas Mangsa dikombinasikan dengan tiga kelompok hari sehingga tersedia 36 entri.
                        Pasangan Mangsa dan kelompok menjadi kunci lookup untuk mengambil bidang profesi serta
                        rujukan halamannya. Profesi paling cocok hanya dicatat bila sumber memberi penekanan yang
                        eksplisit. Jika tidak, hasil tetap menyatakan bahwa tidak ada satu profesi terbaik yang tegas.
                        Beberapa penekanan sumber juga dapat ditampilkan bersama tanpa memilih satu pemenang.
                    </p>
                </li>
            </ol>

            <div className="my-8 min-w-0 rounded-2xl border border-primary/10 bg-primary/5 p-5 sm:p-6">
                <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-widest text-primary">Pseudocode lookup yang digunakan</h3>
                <pre data-wariga-pseudocode className="m-0 whitespace-pre-wrap break-words font-mono text-xs leading-loose text-stone-700 sm:text-sm"><code>{WARIGA_LOOKUP_PSEUDOCODE}</code></pre>
                <p className="mt-4 text-xs leading-relaxed text-stone-500">Pencocokan tabel ini tidak menghitung skor profesi, persentase, atau bobot Urip.</p>
            </div>

            <aside className="rounded-2xl border border-accent-gold/20 bg-accent-gold/5 p-5 sm:p-6" aria-labelledby="wariga-ambiguity-title">
                <h3 id="wariga-ambiguity-title" className="mb-3 text-lg font-bold text-primary">5. Menahan hasil untuk 4 Februari</h3>
                <p className="text-sm leading-relaxed">
                    Sumber menulis akhir Kapitu pada 3 Februari dan awal Kawulu pada 4/5 Februari, tanpa menjelaskan
                    cara memilih tanggal awalnya. Karena itu, 4 Februari diberi status <code>ambiguous</code> dan tidak
                    menghasilkan profesi. Metemu tidak menambahkannya ke Kapitu maupun membuat aturan awal Kawulu
                    berdasarkan kabisat. Mulai 5 Februari, interval Kawulu jelas.
                </p>
            </aside>

            <div data-wariga-example className="my-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-200 bg-stone-50 p-4 text-xs font-bold uppercase tracking-widest text-stone-500">Contoh edukasi yang diuji terhadap engine</div>
                <div className="p-5 sm:p-6">
                    <p className="mb-5 text-sm leading-relaxed">Tanggal contoh <strong>6 Juli 2025</strong> (<code>{WARIGA_METHOD_EXAMPLE.date}</code>), bukan data anggota atau hasil kelompok pengguna.</p>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div><dt className="text-xs text-stone-500">Interval Mangsa</dt><dd className="mt-1 font-bold text-primary">{WARIGA_METHOD_EXAMPLE.mangsa} &middot; {WARIGA_METHOD_EXAMPLE.interval}</dd></div>
                        <div><dt className="text-xs text-stone-500">Hari dan kelompok</dt><dd className="mt-1 font-bold text-primary">{WARIGA_METHOD_EXAMPLE.day} &rarr; {WARIGA_METHOD_EXAMPLE.group}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-xs text-stone-500">Lookup</dt><dd className="mt-1 break-words font-mono text-sm text-stone-700">Tabel36[&quot;Kaso&quot;][&quot;Eka&quot;]</dd></div>
                    </dl>
                    <p className="mt-5 text-sm leading-relaxed">Entri tersebut menyebut beberapa bidang, dengan penekanan eksplisit pada <strong>{WARIGA_METHOD_EXAMPLE.preferred.join(" atau ")}</strong>. Ini pembacaan entri sumber, bukan hasil pemeringkatan kemampuan.</p>
                    <p className="mt-4 text-xs leading-relaxed text-stone-500">Rujukan contoh: halaman cetak {WARIGA_METHOD_EXAMPLE.printedPage}, halaman PDF {WARIGA_METHOD_EXAMPLE.pdfPage}. Contoh ini diverifikasi dengan metode <code>twg-gemet-v1</code>.</p>
                </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6">
                <h3 className="mb-3 text-lg font-bold text-primary">Batas interpretasi dan hubungannya dengan Samyoga</h3>
                <p className="text-sm leading-relaxed">
                    Tafsir profesi bersifat tradisional dan belum divalidasi ahli sebagai asesmen bakat atau kemampuan.
                    Hasilnya tidak menjamin karier dan tidak menggantikan pendidikan maupun izin profesi. Lookup ini
                    berjalan terpisah dari perhitungan posisi kelompok: hasil Ketua/Wakil, kategori pasangan, dan
                    perhitungan Samyoga tetap menggunakan engine existing tanpa tambahan skor atau bobot profesi.
                </p>
            </div>
        </section>
    );
}
