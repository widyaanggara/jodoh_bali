import { CAREER_METHOD_VERSION, type CareerDayGroup, type CareerReading } from "./career-contract";

// Only imported by career-access.server.ts; no client component imports these rules.
// Lists are factual occupational terms; explanations are Metemu paraphrases, not book passages.
export const WARIGA_SOURCE = Object.freeze({
    title: "Horoskop pada Tenung Wariga Gemet",
    attribution: "komangputra.com; salinan referensi yang disediakan proyek",
    pdfSha256: "815053390bb523ba0b834f074335098fa4876bf82a1ce338d3d251be599c59e2",
    txtSha256: "625936a1cb75f0413878839995e12cdb38a9b24646509cc2a10a9c7bd37a55b5",
});
interface MangsaDefinition { name: string; start: number; end: number; sourceInterval: string }
export const WARIGA_MANGSA: readonly MangsaDefinition[] = Object.freeze([
    { name: "Kaso", start: 623, end: 802, sourceInterval: "23 Juni - 2 Agustus" },
    { name: "Karo", start: 803, end: 825, sourceInterval: "3 - 25 Agustus" },
    { name: "Katiga", start: 826, end: 918, sourceInterval: "26 Agustus - 18 September" },
    { name: "Kapat", start: 919, end: 1013, sourceInterval: "19 September - 13 Oktober" },
    { name: "Kalima", start: 1014, end: 1109, sourceInterval: "14 Oktober - 9 November" },
    { name: "Kanem", start: 1110, end: 1222, sourceInterval: "10 November - 22 Desember" },
    { name: "Kapitu", start: 1223, end: 203, sourceInterval: "23 Desember - 3 Februari" },
    { name: "Kawulu", start: 205, end: 301, sourceInterval: "4/5 Februari - 1 Maret (awal ambigu)" },
    { name: "Kasanga", start: 302, end: 326, sourceInterval: "2 - 26 Maret" },
    { name: "Kasadasa", start: 327, end: 419, sourceInterval: "27 Maret - 19 April" },
    { name: "Desta", start: 420, end: 512, sourceInterval: "20 April - 12 Mei" },
    { name: "Saddha", start: 513, end: 622, sourceInterval: "13 Mei - 22 Juni" },
].map(value => Object.freeze(value)));
interface CareerRule {
    professions: readonly string[];
    explicitlyPreferred: readonly string[] | null;
    pages: readonly number[];
    explanation: string;
    preferenceNote: string | null;
}
function rule(professions: string[], preferred: string[] | null, pages: number[], explanation: string, note: string | null = null): CareerRule {
    return Object.freeze({ professions: Object.freeze(professions), explicitlyPreferred: preferred ? Object.freeze(preferred) : null,
        pages: Object.freeze(pages), explanation, preferenceNote: note });
}
export const WARIGA_CAREER_RULES: Readonly<Record<string, Readonly<Record<CareerDayGroup, CareerRule>>>> = Object.freeze({
    Kaso: Object.freeze({
        Eka: rule(["Pengarang", "Wartawan", "Artis film", "Penjual kosmetik", "Pedagang barang antik", "Ahli sejarah", "Pelukis"], ["Pengarang", "Wartawan"], [3], "Sumber mengaitkan kelompok ini dengan bidang tulisan, seni, dan benda bernilai budaya; tulisan diberi penekanan khusus."),
        Dwi: rule(["Pengusaha rumah makan", "Pegawai pemerintahan", "Pedagang barang antik", "Pegawai"], ["Pegawai"], [3], "Bidang makanan, pemerintahan, dan perdagangan barang antik disebut sebagai pilihan. Istilah pegawai menjadi penekanan akhir sumber."),
        Tri: rule(["Ahli bangunan", "Tukang batu", "Tukang kayu", "Tukang besi", "Pengurus museum", "Pengurus perpustakaan", "Wiraswasta", "Perkapalan", "Alat nelayan", "Pemusik", "Toko buku"], ["Ahli bangunan"], [3], "Pekerjaan bangunan ditonjolkan di antara pilihan teknis, usaha, budaya, dan perkapalan."),
    }),
    Karo: Object.freeze({
        Eka: rule(["Wiraswasta perdagangan", "Pengelola klub malam", "Pengelola teater", "Aktor film", "ABRI"], ["Wiraswasta perdagangan"], [4], "Sumber mendahulukan usaha perdagangan, dengan alternatif seni pertunjukan dan istilah kemiliteran yang dipakai dalam naskah."),
        Dwi: rule(["Pedagang emas dan berlian", "Perbankan", "Pedagang hasil bumi", "Pedagang bahan pangan", "Seniman musik dan lagu"], ["Seniman musik dan lagu"], [4], "Perdagangan dan perbankan disebut bersama seni musik. Sumber memberi penekanan akhir pada musik dalam konteks perkembangan jiwa.", "Penekanan akhir pada musik tidak menghapus pilihan perdagangan yang lebih dahulu disebut."),
        Tri: rule(["Aparat pemerintah", "Penegak hukum", "ABRI", "Industri tekstil", "Biro jasa", "Pegawai atau pemimpin biro bangunan dan real estate", "Pelukis", "Pemahat"], ["Aparat pemerintah", "Penegak hukum", "ABRI", "Industri tekstil", "Biro jasa", "Pegawai atau pemimpin biro bangunan dan real estate"], [4], "Naskah menonjolkan beberapa pilihan pemerintahan, hukum, industri, dan jasa sekaligus; seni rupa disebut sebagai alternatif.", "Sumber tidak memilih satu pemenang dari daftar utama ini."),
    }),
    Katiga: Object.freeze({
        Eka: rule(["Wartawan", "Pelukis", "Pemahat", "Pengarang", "Mubalig", "Pendeta", "Penyebar ajaran keagamaan dan spiritual", "Komunikasi"], ["Wartawan", "Komunikasi"], [5], "Bidang pemberitaan dan komunikasi memperoleh penekanan dibanding alternatif seni dan pengajaran rohani."),
        Dwi: rule(["Pedagang elektronik", "Pedagang kendaraan dan traktor", "Pegawai", "Pedagang obat", "Apoteker", "Pengacara atau pembela perkara"], ["Pengacara atau pembela perkara"], [5, 6], "Sesudah menyebut perdagangan dan pekerjaan bergaji, sumber menempatkan pendampingan perkara sebagai pilihan utama."),
        Tri: rule(["Pedagang keliling", "Biro jasa dan perjalanan", "Pegawai perpustakaan", "Pegawai rumah sakit", "Persewaan buku", "Percetakan", "Penerbit"], ["Penerbit", "Percetakan"], [6], "Penerbitan dan percetakan ditekankan di antara pilihan layanan, perjalanan, dan pekerjaan lembaga."),
    }),
    Kapat: Object.freeze({
        Eka: rule(["Tata ruang", "Kapsalon", "Arsitek", "Sekretaris", "Dekorasi interior"], ["Tata ruang", "Dekorasi interior"], [6, 7], "Tata ruang dan dekorasi menjadi penekanan utama dalam kelompok pekerjaan yang berkaitan dengan penataan."),
        Dwi: rule(["Penyanyi", "Pengarang", "Wartawan", "Aktor teater"], ["Pengarang"], [7], "Di antara alternatif suara, pertunjukan, dan pemberitaan, sumber menonjolkan kegiatan mengarang."),
        Tri: rule(["Bangunan rumah", "Lembaga bahasa", "Penerjemah", "Polisi", "Biro angkutan", "Tata pertamanan", "Penerbang"], ["Polisi", "Penegakan hukum"], [7], "Pilihan teknis dan jasa disebut lebih dahulu; penanganan kejahatan serta kepolisian menjadi penekanan akhir."),
    }),
    Kalima: Object.freeze({
        Eka: rule(["Polisi", "Wartawan", "Dokter", "Pengarang", "Badan intelijen", "Pendeta", "Rohaniawan"], ["Polisi"], [7], "Sumber mengutamakan kepolisian di antara alternatif kesehatan, tulisan, dan kerohanian."),
        Dwi: rule(["Artis film dan teater", "Karyawan biro perjalanan", "Pengusaha pelayaran", "Pengusaha biro perjalanan", "Kontraktor", "Kedokteran dan poliklinik"], ["Pembangunan", "Kontraktor"], [8], "Bidang pembangunan dan kontraktor mendapat penekanan dibanding alternatif hiburan, perjalanan, dan layanan kesehatan."),
        Tri: rule(["Obat dan apotek", "Kosmetik", "Nelayan", "Teknik perkapalan", "Kapsalon"], ["Kosmetik", "Kapsalon"], [8], "Dari alternatif perdagangan dan teknis, sumber memberi penekanan pada kosmetik serta usaha salon."),
    }),
    Kanem: Object.freeze({
        Eka: rule(["Pengarang", "Atlet", "Pengusaha percetakan", "Penerbit", "Mubalig"], ["Penerbit"], [8], "Penerbitan ditonjolkan di antara pilihan tulisan, olahraga, percetakan, dan kegiatan rohani."),
        Dwi: rule(["Kemiliteran", "Pegawai penelitian dan pengembangan", "Musik", "Seni lukis"], ["Kemiliteran", "Seni lukis"], [8, 9], "Naskah memberi dua penekanan: kemiliteran untuk bidang kerja serta seni lukis untuk uraian karier berikutnya.", "Ada dua penekanan eksplisit; Metemu tidak menyatukannya menjadi satu pilihan atau skor."),
        Tri: rule(["Kesehatan", "Poliklinik", "Rumah bersalin", "Dokter", "Dokter hewan", "Kontraktor", "Insinyur perancang", "Guru", "Pengelola kursus", "Pedagang umum", "Pembela perkara", "Biro pengacara atau LBH"], ["Pembela perkara", "Biro pengacara atau LBH"], [9], "Pendampingan hukum menjadi penekanan akhir setelah alternatif kesehatan, pembangunan, pendidikan, dan perdagangan."),
    }),
    Kapitu: Object.freeze({
        Eka: rule(["Pengusaha apotek", "Peternak", "Produser film", "Aktor film", "Real estate", "Perkebunan"], ["Produser film"], [9, 10], "Produksi film ditonjolkan di antara alternatif usaha kesehatan, peternakan, properti, dan perkebunan."),
        Dwi: rule(["Kedokteran", "Pedagang alat elektronik", "Pedagang mobil", "Pegawai negeri", "Pengacara", "Bangunan"], null, [10], "Sumber menyebut kedokteran dan beberapa bidang dagang, pemerintahan, hukum, serta bangunan, tanpa menetapkan satu profesi paling cocok."),
        Tri: rule(["Guru", "Aktor", "Pengarang", "Wartawan", "Pedagang"], ["Wartawan"], [10], "Pemberitaan diberi penekanan utama dibanding pilihan pendidikan, seni, tulisan, dan perdagangan."),
    }),
    Kawulu: Object.freeze({
        Eka: rule(["Biro perjalanan dan pariwisata", "Toko elektronik", "Bengkel motor dan mobil", "Perdagangan alat elektronik"], ["Perdagangan alat elektronik"], [10, 11], "Perdagangan elektronik memperoleh penekanan dibanding alternatif perjalanan dan perbengkelan."),
        Dwi: rule(["Karyawan perusahaan", "Pembukuan", "Pelukis", "Penyanyi", "Pemusik", "Pengarang", "Wartawan", "Sekretaris", "Mubalig", "Pendeta", "Guru agama"], ["Pengarang"], [11], "Di antara alternatif administrasi, seni, dan kerohanian, sumber menonjolkan kegiatan mengarang."),
        Tri: rule(["Pegawai negeri", "Pegawai swasta", "Guru", "Dosen", "Politik", "Seniman panggung", "Aktor", "Paranormal atau kebatinan"], ["Pegawai negeri"], [11], "Pekerjaan pegawai negeri menjadi penekanan akhir naskah. Sebutan kebatinan hanya dicatat sebagai istilah sumber, bukan klaim kemampuan."),
    }),
    Kasanga: Object.freeze({
        Eka: rule(["Humas", "Pengarang", "Kolomnis", "Wartawan", "Paragnos atau paragnosa", "Koresponden media"], ["Wartawan", "Koresponden media"], [12], "Pemberitaan dan korespondensi media ditonjolkan. Istilah paragnos dicatat dari sumber tanpa klaim kemampuan khusus."),
        Dwi: rule(["Psikologi", "Biro perjalanan dan pariwisata", "Apotek", "Toko obat dan jamu", "Klub malam", "Pub", "Hiburan", "Hotel"], ["Psikologi"], [12], "Bidang psikologi menjadi penekanan utama dibanding alternatif perjalanan, perdagangan, dan layanan hiburan."),
        Tri: rule(["Perkapalan", "Galangan kapal", "Karyawan perusahaan", "Mandor", "Pergudangan"], ["Perkapalan"], [12], "Naskah menonjolkan perkapalan, disertai alternatif pekerjaan perusahaan, pengawasan, dan gudang."),
    }),
    Kasadasa: Object.freeze({
        Eka: rule(["Wiraswasta pertanian", "Wartawan"], ["Wartawan"], [13], "Wirausaha pertanian disebut bersama pemberitaan; wartawan menjadi penekanan akhir sumber."),
        Dwi: rule(["Pemandu wisata", "Pemasok bahan bangunan", "Bangunan"], null, [13], "Pemanduan wisata serta usaha dan pekerjaan bangunan disebut tanpa penetapan satu profesi paling cocok."),
        Tri: rule(["Pengarang", "Aktor teater dan film", "Pelukis", "Sekretaris", "Mandor bangunan", "Kedokteran", "Arsitektur", "Dosen"], ["Pengarang"], [13], "Mengarang menjadi penekanan awal, dengan alternatif seni, administrasi, bangunan, serta profesi yang memerlukan pendidikan terkait."),
    }),
    Desta: Object.freeze({
        Eka: rule(["Perdagangan", "Wartawan", "Dokter", "Pengobatan", "Seni", "Aktor film dan teater", "Pelukis", "Pemahat", "Pematung", "Interior", "Pertamanan"], ["Seni"], [14], "Bidang seni ditonjolkan secara umum; Metemu tidak memilih satu cabang seni sebagai pemenang."),
        Dwi: rule(["Pengolahan tanah", "Petani", "Pengarang", "Perbankan", "Teknik", "Keramik", "Usaha genting dan bata"], null, [14], "Sumber menyebut tanah, pertanian, tulisan, perbankan, dan teknik tanpa satu profesi paling cocok yang tegas."),
        Tri: rule(["Biro perjalanan", "Perdagangan hasil pertanian", "Wirausaha", "Pabrik teknik", "Bengkel"], ["Wirausaha teknik", "Pabrik teknik", "Bengkel"], [14], "Usaha yang berkaitan dengan teknik, pabrik, atau bengkel menjadi penekanan utama."),
    }),
    Saddha: Object.freeze({
        Eka: rule(["Seni", "Pengarang", "Wartawan", "Penulis skenario film, sinetron, dan teater", "Penggerak massa"], null, [14, 15], "Naskah menyebut seni, tulisan, dan penggerak massa tanpa menetapkan satu profesi terbaik untuk kelompok ini."),
        Dwi: rule(["Pengacara", "Notaris", "Sekretaris", "Guru", "Pelukis"], ["Pelukis"], [15], "Seni lukis menjadi penekanan utama dibanding alternatif hukum, administrasi, dan pendidikan."),
        Tri: rule(["Percetakan surat kabar", "Tata letak", "Kedokteran", "Pemandu wisata", "Pegawai negeri", "Pegawai swasta", "Penerbit"], ["Penerbit"], [15], "Penerbitan ditonjolkan di antara pilihan media, kesehatan, wisata, dan pekerjaan bergaji."),
    }),
});

/** Gregorian civil components, never UTC-string parsing or the Bali 06:00 boundary. */
export function parseCareerCivilDate(value: string) {
    const match = typeof value === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) throw new Error("INVALID_CAREER_BIRTH_DATE");
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const date = new Date(0);
    date.setUTCHours(12, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);
    if (!Number.isFinite(date.getTime()) || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new Error("INVALID_CAREER_BIRTH_DATE");
    return { year, month, day, weekday: date.getUTCDay() };
}
export function calculateWarigaCareer(birthDate: string): CareerReading {
    const civil = parseCareerCivilDate(birthDate);
    const day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][civil.weekday];
    const dayGroup: CareerDayGroup = [0, 3, 5].includes(civil.weekday) ? "Eka" : civil.weekday === 1 ? "Dwi" : "Tri";
    const reference = (pages: readonly number[]) => ({ title: WARIGA_SOURCE.title, attribution: WARIGA_SOURCE.attribution,
        printedPages: [...pages], pdfPages: pages.map(page => page + 5) });
    if (civil.month === 2 && civil.day === 4) return {
        methodVersion: CAREER_METHOD_VERSION, status: "ambiguous", day, dayGroup, mangsa: null,
        sourceInterval: "Awal Kawulu: 4/5 Februari; akhir Kapitu: 3 Februari",
        professions: [], explicitlyPreferred: null, preferenceNote: null,
        explanation: "Sumber tidak menjelaskan kapan awal Kawulu memakai 4 atau 5 Februari. Tanggal ini tidak dipaksakan ke Kawulu maupun Kapitu; ramalan profesi ditahan.", reference: reference([9, 10]),
    };
    const ordinal = civil.month * 100 + civil.day;
    const mangsa = WARIGA_MANGSA.find(value => value.start > value.end
        ? ordinal >= value.start || ordinal <= value.end : ordinal >= value.start && ordinal <= value.end);
    if (!mangsa) throw new Error("CAREER_SOURCE_INTERVAL_UNRESOLVED");
    const result = WARIGA_CAREER_RULES[mangsa.name][dayGroup];
    return { methodVersion: CAREER_METHOD_VERSION, status: "interpreted", day, dayGroup, mangsa: mangsa.name,
        sourceInterval: mangsa.sourceInterval, professions: [...result.professions],
        explicitlyPreferred: result.explicitlyPreferred ? [...result.explicitlyPreferred] : null,
        preferenceNote: result.preferenceNote, explanation: result.explanation, reference: reference(result.pages) };
}
