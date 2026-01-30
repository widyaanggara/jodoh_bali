import { Wuku, Pancawara, Saptawara, KategoriJodoh, Zodiak, Sadwara } from './types';

// Wuku data (30 wuku dalam kalender Bali)
export const wukuData: Wuku[] = [
    {
        id_wuku: 1,
        nama_wuku: "Sinta",
        deskripsi: "Naungan Bathara Yamadipati. Karakter sakral dan penuh wibawa.",
        sifat_umum: "Tegas, agak kaku, berjiwa pemimpin.",
        kelebihan: "Cepat memahami ilmu, teliti, mandiri.",
        kelemahan: "Keras kepala, sulit menerima kritik.",
        rekomendasi_pasangan: ["Wariga", "Warigadean"]
    },
    {
        id_wuku: 2,
        nama_wuku: "Landep",
        deskripsi: "Naungan Bathara Mahadewa. Melambangkan ketajaman pikiran.",
        sifat_umum: "Cerdas, visioner, jujur.",
        kelebihan: "Daya tangkap kuat, logis, problem solver.",
        kelemahan: "Suka pamer kepintaran, agak sombong.",
        rekomendasi_pasangan: ["Langkir", "Medangsia"]
    },
    {
        id_wuku: 3,
        nama_wuku: "Ukir",
        deskripsi: "Naungan Bathara Mahayakti. Karakter yang kaya akan perasaan.",
        sifat_umum: "Tenang, rendah hati, tertutup.",
        kelebihan: "Sangat baik hati, penolong, setia.",
        kelemahan: "Sering memendam perasaan, pendendam.",
        rekomendasi_pasangan: ["Klawu", "Dukut"]
    },
    {
        id_wuku: 4,
        nama_wuku: "Kulantir",
        deskripsi: "Naungan Bathara Singajalma. Karakter yang dinamis.",
        sifat_umum: "Lincah, mudah bergaul, aktif.",
        kelebihan: "Pandai bicara, adaptif, komunikatif.",
        kelemahan: "Boros, sulit fokus pada satu tujuan.",
        rekomendasi_pasangan: ["Tolu", "Gumbreg"]
    },
    {
        id_wuku: 5,
        nama_wuku: "Tolu",
        deskripsi: "Naungan Bathara Bayu. Sosok yang kuat dan pelindung.",
        sifat_umum: "Berjiwa pemimpin, sabar, kuat.",
        kelebihan: "Fisik tangguh, pantang menyerah.",
        kelemahan: "Kurang peka terhadap perasaan orang lain.",
        rekomendasi_pasangan: ["Kulantir", "Sungsang"]
    },
    {
        id_wuku: 6,
        nama_wuku: "Gumbreg",
        deskripsi: "Naungan Bathara Candra. Melambangkan kemakmuran.",
        sifat_umum: "Lembut, tenang, religius.",
        kelebihan: "Murah rezeki, dicintai banyak orang.",
        kelemahan: "Terlalu perasa, kurang tegas mengambil sikap.",
        rekomendasi_pasangan: ["Sinta", "Warigadean"]
    },
    {
        id_wuku: 7,
        nama_wuku: "Wariga",
        deskripsi: "Naungan Bathara Asmara. Memiliki daya tarik tinggi.",
        sifat_umum: "Artistik, romantis, teliti.",
        kelebihan: "Rapi dalam bekerja, setia, artistik.",
        kelemahan: "Mudah curiga dan sering cemburu.",
        rekomendasi_pasangan: ["Sinta", "Julungwangi"]
    },
    {
        id_wuku: 8,
        nama_wuku: "Warigadean",
        deskripsi: "Naungan Bathara Maharesi. Sosok pembelajar.",
        sifat_umum: "Cerdas, analitis, logis.",
        kelebihan: "Logika kuat, pandai bernegosiasi.",
        kelemahan: "Terlihat dingin dan kurang empati.",
        rekomendasi_pasangan: ["Sinta", "Gumbreg"]
    },
    {
        id_wuku: 9,
        nama_wuku: "Julungwangi",
        deskripsi: "Naungan Bathara Sambu. Sosok yang populer.",
        sifat_umum: "Rapi, jujur, menjaga reputasi.",
        kelebihan: "Sangat dipercaya, penampilan menarik.",
        kelemahan: "Suka dipuji, agak narsis.",
        rekomendasi_pasangan: ["Wariga", "Sungsang"]
    },
    {
        id_wuku: 10,
        nama_wuku: "Sungsang",
        deskripsi: "Naungan Bathara Gana. Penakluk rintangan.",
        sifat_umum: "Kuat, berani, pantang menyerah.",
        kelebihan: "Solutif, mental baja.",
        kelemahan: "Mudah marah (temperamental).",
        rekomendasi_pasangan: ["Tolu", "Julungwangi"]
    },
    {
        id_wuku: 11,
        nama_wuku: "Dungulan",
        deskripsi: "Naungan Bathara Kamajaya. Sosok pemenang.",
        sifat_umum: "Bijaksana, sabar, tenang.",
        kelebihan: "Selalu menang dalam argumen, berwibawa.",
        kelemahan: "Terlalu santai, sering meremehkan lawan.",
        rekomendasi_pasangan: ["Kuningan", "Langkir"]
    },
    {
        id_wuku: 12,
        nama_wuku: "Kuningan",
        deskripsi: "Naungan Bathara Indera. Berjiwa ningrat.",
        sifat_umum: "Disiplin, perfeksionis, hemat.",
        kelebihan: "Sangat teliti dalam keuangan dan aturan.",
        kelemahan: "Cenderung pelit dan terlalu kaku.",
        rekomendasi_pasangan: ["Dungulan", "Pahang"]
    },
    {
        id_wuku: 13,
        nama_wuku: "Langkir",
        deskripsi: "Naungan Bathara Kala. Sosok yang tangguh.",
        sifat_umum: "Berani, mandiri, nekat.",
        kelebihan: "Tidak takut tantangan, ulet.",
        kelemahan: "Keras hati, sulit diajak kompromi.",
        rekomendasi_pasangan: ["Landep", "Dungulan"]
    },
    {
        id_wuku: 14,
        nama_wuku: "Medangsia",
        deskripsi: "Naungan Bathara Brahma. Semangat membara.",
        sifat_umum: "Ambisius, kompetitif, ceria.",
        kelebihan: "Motivator ulung, energik.",
        kelemahan: "Ceroboh, terburu-buru.",
        rekomendasi_pasangan: ["Landep", "Pujut"]
    },
    {
        id_wuku: 15,
        nama_wuku: "Pujut",
        deskripsi: "Naungan Bathara Guritna. Sosok pemikir.",
        sifat_umum: "Filosofis, introvert, bijak.",
        kelebihan: "Ide orisinal, pemikiran dalam.",
        kelemahan: "Lamban bertindak, suka ragu.",
        rekomendasi_pasangan: ["Medangsia", "Pahang"]
    },
    {
        id_wuku: 16,
        nama_wuku: "Pahang",
        deskripsi: "Naungan Bathara Tantra. Pelindung.",
        sifat_umum: "Setia kawan, protektif.",
        kelebihan: "Pendengar yang baik, loyal.",
        kelemahan: "Suka mencampuri urusan orang.",
        rekomendasi_pasangan: ["Kuningan", "Krulut"]
    },
    {
        id_wuku: 17,
        nama_wuku: "Krulut",
        deskripsi: "Naungan Bathara Wisnu. Penuh kasih sayang.",
        sifat_umum: "Penyayang, lembut, dermawan.",
        kelebihan: "Murah hati, penyabar.",
        kelemahan: "Mudah ditipu/dimanfaatkan.",
        rekomendasi_pasangan: ["Pahang", "Merakih"]
    },
    {
        id_wuku: 18,
        nama_wuku: "Merakih",
        deskripsi: "Naungan Bathara Surenggana. Sosok rupawan.",
        sifat_umum: "Estetik, rapi, diplomatis.",
        kelebihan: "Pandai bicara, penampilan menarik.",
        kelemahan: "Boros demi gaya hidup.",
        rekomendasi_pasangan: ["Krulut", "Tambir"]
    },
    {
        id_wuku: 19,
        nama_wuku: "Tambir",
        deskripsi: "Naungan Bathara Siwa. Wibawa tinggi.",
        sifat_umum: "Religius, serius, berprinsip.",
        kelebihan: "Sangat memegang janji, jujur.",
        kelemahan: "Kaku, kurang humoris.",
        rekomendasi_pasangan: ["Merakih", "Medangkungan"]
    },
    {
        id_wuku: 20,
        nama_wuku: "Medangkungan",
        deskripsi: "Naungan Bathara Basuki. Pembawa damai.",
        sifat_umum: "Tenang, adil, sejuk.",
        kelebihan: "Penengah konflik yang handal.",
        kelemahan: "Sering bimbang (plin-plan).",
        rekomendasi_pasangan: ["Tambir", "Matal"]
    },
    {
        id_wuku: 21,
        nama_wuku: "Matal",
        deskripsi: "Naungan Bathara Sakri. Kuat mental.",
        sifat_umum: "Tangguh, sederhana, jujur.",
        kelebihan: "Tahan banting hadapi cobaan.",
        kelemahan: "Kurang kreatif, kaku.",
        rekomendasi_pasangan: ["Medangkungan", "Uye"]
    },
    {
        id_wuku: 22,
        nama_wuku: "Uye",
        deskripsi: "Naungan Bathara Kuwera. Bakat dagang.",
        sifat_umum: "Hemat, teliti, kalkulatif.",
        kelebihan: "Pandai mencari peluang uang.",
        kelemahan: "Sering cemas soal masa depan.",
        rekomendasi_pasangan: ["Matal", "Menail"]
    },
    {
        id_wuku: 23,
        nama_wuku: "Menail",
        deskripsi: "Naungan Bathara Citragotra. Jiwa seni.",
        sifat_umum: "Kreatif, imajinatif, unik.",
        kelebihan: "Inovatif, cara berpikir berbeda.",
        kelemahan: "Kurang realistis, suka menghayal.",
        rekomendasi_pasangan: ["Uye", "Prangbakat"]
    },
    {
        id_wuku: 24,
        nama_wuku: "Prangbakat",
        deskripsi: "Naungan Bathara Bisma. Pejuang tangguh.",
        sifat_umum: "Disiplin, kuat, kaku.",
        kelebihan: "Fisik sehat, mental pejuang.",
        kelemahan: "Sulit beradaptasi dengan perubahan.",
        rekomendasi_pasangan: ["Menail", "Bala"]
    },
    {
        id_wuku: 25,
        nama_wuku: "Bala",
        deskripsi: "Naungan Bathara Durga. Disegani.",
        sifat_umum: "Misterius, karismatik, dominan.",
        kelebihan: "Pengaruh besar pada kelompok.",
        kelemahan: "Cenderung menekan/otoriter.",
        rekomendasi_pasangan: ["Prangbakat", "Ugu"]
    },
    {
        id_wuku: 26,
        nama_wuku: "Ugu",
        deskripsi: "Naungan Bathara Singajalma. Stabil.",
        sifat_umum: "Konsisten, setia, tenang.",
        kelebihan: "Tidak mudah berubah pendirian.",
        kelemahan: "Sangat keras kepala.",
        rekomendasi_pasangan: ["Bala", "Wayang"]
    },
    {
        id_wuku: 27,
        nama_wuku: "Wayang",
        deskripsi: "Naungan Bathara Sri. Keindahan.",
        sifat_umum: "Lembut, artistik, peka.",
        kelebihan: "Bakat seni halus, perasa.",
        kelemahan: "Sangat sensitif, mudah tersinggung.",
        rekomendasi_pasangan: ["Ugu", "Klawu"]
    },
    {
        id_wuku: 28,
        nama_wuku: "Klawu",
        deskripsi: "Naungan Bathara Sadana. Kemakmuran.",
        sifat_umum: "Beruntung, rajin, hemat.",
        kelebihan: "Rezeki lancar, tekun bekerja.",
        kelemahan: "Terlalu terpaku pada materi.",
        rekomendasi_pasangan: ["Wayang", "Ukir"]
    },
    {
        id_wuku: 29,
        nama_wuku: "Dukut",
        deskripsi: "Naungan Bathara Baruna. Luas dan dalam.",
        sifat_umum: "Tenang, misterius, sabar.",
        kelebihan: "Wawasan luas, bijaksana.",
        kelemahan: "Sulit ditebak, tertutup.",
        rekomendasi_pasangan: ["Ukir", "Watugunung"]
    },
    {
        id_wuku: 30,
        nama_wuku: "Watugunung",
        deskripsi: "Naungan Bathara Anantaboga. Kokoh.",
        sifat_umum: "Stabil, teguh, pelindung.",
        kelebihan: "Menjadi tumpuan banyak orang.",
        kelemahan: "Sulit menerima perubahan mendadak.",
        rekomendasi_pasangan: ["Dukut", "Sinta"]
    }
];

export const dataZodiak: Zodiak[] = [
    {
        nama: "Capricorn", startMonth: 12, startDate: 22,
        sifat: "Sangat hemat, disiplin, bertanggung jawab, namun agak kaku.",
        elemen: "Tanah", angkaHoki: [4, 8, 13], warnaHoki: "Hitam & Coklat", hariHoki: "Sabtu"
    },
    {
        nama: "Aquarius", startMonth: 1, startDate: 20,
        sifat: "Tenang, objektif, cerdas, tapi terkadang sulit untuk dimengerti.",
        elemen: "Udara", angkaHoki: [2, 3, 9], warnaHoki: "Biru Muda", hariHoki: "Sabtu"
    },
    {
        nama: "Pisces", startMonth: 2, startDate: 19,
        sifat: "Penuh perasaan (emosional), romantis, suka menolong, dan religius.",
        elemen: "Air", angkaHoki: [3, 7, 11], warnaHoki: "Hijau Laut", hariHoki: "Kamis"
    },
    {
        nama: "Aries", startMonth: 3, startDate: 21,
        sifat: "Sangat rajin, jujur, berjiwa pemimpin, namun terkadang keras kepala.",
        elemen: "Api", angkaHoki: [1, 9, 10], warnaHoki: "Merah", hariHoki: "Selasa"
    },
    {
        nama: "Taurus", startMonth: 4, startDate: 20,
        sifat: "Sabar, telaten, suka keindahan, namun agak pencemburu.",
        elemen: "Tanah", angkaHoki: [2, 6, 15], warnaHoki: "Pink & Hijau", hariHoki: "Jumat"
    },
    {
        nama: "Gemini", startMonth: 5, startDate: 21,
        sifat: "Cerdas, pandai bergaul, lincah, tapi terkadang ragu-ragu dalam mengambil keputusan.",
        elemen: "Udara", angkaHoki: [5, 7, 14], warnaHoki: "Kuning", hariHoki: "Rabu"
    },
    {
        nama: "Cancer", startMonth: 6, startDate: 21,
        sifat: "Sangat penyayang, lembut, daya ingat kuat, namun mudah tersinggung.",
        elemen: "Air", angkaHoki: [2, 7, 16], warnaHoki: "Putih & Perak", hariHoki: "Senin"
    },
    {
        nama: "Leo", startMonth: 7, startDate: 23,
        sifat: "Berwibawa, percaya diri tinggi, setia, tapi agak suka memerintah.",
        elemen: "Api", angkaHoki: [1, 4, 9], warnaHoki: "Emas & Oranye", hariHoki: "Minggu"
    },
    {
        nama: "Virgo", startMonth: 8, startDate: 23,
        sifat: "Teliti, rapi, kritis, dan sangat suka membantu orang lain.",
        elemen: "Tanah", angkaHoki: [3, 5, 12], warnaHoki: "Abu-abu & Hijau Tua", hariHoki: "Rabu"
    },
    {
        nama: "Libra", startMonth: 9, startDate: 23,
        sifat: "Suka keadilan, cinta damai, tapi sering sulit menentukan pilihan.",
        elemen: "Udara", angkaHoki: [6, 8, 15], warnaHoki: "Biru Langit", hariHoki: "Jumat"
    },
    {
        nama: "Scorpio", startMonth: 10, startDate: 23,
        sifat: "Pekerja keras, tekun, memiliki intuisi tajam, dan agak pendiam.",
        elemen: "Air", angkaHoki: [1, 8, 13], warnaHoki: "Merah Marun", hariHoki: "Selasa"
    },
    {
        nama: "Sagitarius", startMonth: 11, startDate: 22,
        sifat: "Suka petualangan, optimis, jujur, namun terkadang kurang waspada.",
        elemen: "Api", angkaHoki: [3, 12, 21], warnaHoki: "Ungu", hariHoki: "Kamis"
    }
];

// Pancawara data (5 hari siklus)
export const pancawaraData: Pancawara[] = [
    { id: 1, nama: "Umanis", urip: 5, karakter: "Penggerak, memiliki kemauan kuat, dan pemurah." },
    { id: 2, nama: "Paing", urip: 9, karakter: "Berani, tegas, namun terkadang emosional." },
    { id: 3, nama: "Pon", urip: 7, karakter: "Tenang, bijaksana, dan pandai menyimpan rahasia." },
    { id: 4, nama: "Wage", urip: 4, karakter: "Teguh pada pendirian, pekerja keras, namun kaku." },
    { id: 5, nama: "Kliwon", urip: 8, karakter: "Pemaaf, pandai berbicara, dan memiliki spiritualitas tinggi." }
];

// Sadwara data (6 hari siklus)
export const sadwaraData: Sadwara[] = [
  { 
    nama: "Tungleh", 
    arti: "Tidak kekal", 
    sifat: "Hari penuh kebohongan dan ingkar janji.", 
    pesan: "Waspadalah terhadap fitnah dan kebohongan. Jangan paksa orang jujur, tapi buatlah ia menyesali akibat kebohongannya." 
  },
  { 
    nama: "Aryang", 
    arti: "Kurus", 
    sifat: "Harinya orang lupa (kepikunan).", 
    pesan: "Buatlah catatan pribadi agar tidak mengandalkan ingatan. Tulisan akan abadi, sementara ucapan akan terlupakan." 
  },
  { 
    nama: "Urukung", 
    arti: "Punah", 
    sifat: "Hari kecerobohan dan kealpaan.", 
    pesan: "Waspadalah terhadap kesalahan tidak sengaja. Kurangi tindakan berbahaya dan berhati-hatilah di jalan." 
  },
  { 
    nama: "Paniron", 
    arti: "Gemuk", 
    sifat: "Hari kepura-puraan atau fatamorgana.", 
    pesan: "Waspadalah terhadap kepalsuan. Teliti segalanya sebelum bertindak, karena hal yang tampak baik mungkin tidak demikian." 
  },
  { 
    nama: "Was", 
    arti: "Kuat", 
    sifat: "Hari gembira.", 
    pesan: "Jangan mengumbar kegembiraan berlebih. Gunakan hari ini untuk membahagiakan orang lain dan berderma." 
  },
  { 
    nama: "Maulu", 
    arti: "Membiak", 
    sifat: "Hari pitam (kemarahan).", 
    pesan: "Kemurkaan ada di mana-mana. Tahan diri dari menyinggung perasaan orang lain. Diam adalah emas saat menghadapi amarah." 
  }
];

// Saptawara data (7 hari minggu)
export const saptawaraData: Saptawara[] = [
    { id: 1, hari: "Redite/Minggu", urip: 5, sifat: "Kasih", karakter: "Berjiwa sosial tinggi, berwibawa, dan senang menolong." },
    { id: 2, hari: "Soma/Senin", urip: 4, sifat: "Luwes", karakter: "Fleksibel, mudah beradaptasi, namun terkadang mudah berubah pikiran." },
    { id: 3, hari: "Anggara/Selasa", urip: 3, sifat: "Berani", karakter: "Penuh semangat, pemberani, tapi terkadang emosional." },
    { id: 4, hari: "Buda/Rabu", urip: 7, sifat: "Bijak", karakter: "Cerdas, teliti dalam bekerja, dan sangat menghargai aturan." },
    { id: 5, hari: "Wraspati/Kamis", urip: 8, sifat: "Mulia", karakter: "Sabar, taat pada agama/prinsip, dan dihormati banyak orang." },
    { id: 6, hari: "Sukra/Jumat", urip: 6, sifat: "Suci", karakter: "Cenderung religius, menyukai kebersihan, dan memiliki cita rasa seni." },
    { id: 7, hari: "Saniscara/Sabtu", urip: 9, sifat: "Tangguh", karakter: "Pekerja keras, kuat menghadapi cobaan, namun agak tertutup." }
];

// Kategori Jodoh data
export const kategoriJodohData: KategoriJodoh[] = [
    { sisa: 1, kategori: "Sri", makna: "Rejeki melimpah, hidup makmur, dan harmonis." },
    { sisa: 2, kategori: "Dana", makna: "Kehidupan ekonomi stabil, berkecukupan (Kaya)." },
    { sisa: 3, kategori: "Laba", makna: "Selalu beruntung dalam usaha dan pekerjaan." },
    { sisa: 4, kategori: "Tiwas", makna: "Banyak rintangan, kesulitan ekonomi, atau sering sakit." },
    { sisa: 0, kategori: "Sakti", makna: "Sering mendapat cobaan tapi memiliki kekuatan untuk bangkit." }
];


// data/masterLintang.ts
import { Lintang } from './types';

// data/masterLintang.ts
export const dataLintang: Lintang[] = [
    { nama: "Gajah", saptawara: "Redite", pancawara: "Umanis", sifat: "Pemaaf dan jujur.", nasib: "Rezeki lancar dan tenang." },
    { nama: "Patrem", saptawara: "Redite", pancawara: "Paing", sifat: "Cerdas dan lincah.", nasib: "Sukses dalam karier." },
    { nama: "Sungsang", saptawara: "Redite", pancawara: "Pon", sifat: "Waspada dan teliti.", nasib: "Banyak tantangan namun kuat." },
    { nama: "Lembu", saptawara: "Redite", pancawara: "Wage", sifat: "Sabar dan penolong.", nasib: "Hidup sederhana namun bahagia." },
    { nama: "Depat", saptawara: "Redite", pancawara: "Kliwon", sifat: "Berwibawa.", nasib: "Sering dihormati orang lain." },
    { nama: "Waluku", saptawara: "Soma", pancawara: "Umanis", sifat: "Rajin bekerja.", nasib: "Ekonomi stabil di masa tua." },
    { nama: "Dupa", saptawara: "Soma", pancawara: "Paing", sifat: "Ramah dan ceria.", nasib: "Mudah mencari teman." },
    { nama: "Lumbung", saptawara: "Soma", pancawara: "Pon", sifat: "Hemat dan kalkulatif.", nasib: "Pintar mengelola harta." },
    { nama: "Lembu", saptawara: "Soma", pancawara: "Wage", sifat: "Tenang.", nasib: "Hidup damai." },
    { nama: "Pedati", saptawara: "Soma", pancawara: "Kliwon", sifat: "Fokus pada tujuan.", nasib: "Pemimpin yang baik." },
    { nama: "Asu", saptawara: "Anggara", pancawara: "Umanis", sifat: "Setia dan pemberani.", nasib: "Pelindung keluarga." },
    { nama: "Yuyu", saptawara: "Anggara", pancawara: "Paing", sifat: "Gigih.", nasib: "Mampu mengatasi kesulitan." },
    { nama: "Asu", saptawara: "Anggara", pancawara: "Pon", sifat: "Waspada.", nasib: "Sering terhindar dari bahaya." },
    { nama: "Kartika", saptawara: "Anggara", pancawara: "Wage", sifat: "Populer.", nasib: "Banyak dikenal masyarakat." },
    { nama: "Sidamalung", saptawara: "Anggara", pancawara: "Kliwon", sifat: "Religius.", nasib: "Mendapat ketenangan batin." },
    { nama: "Gajah Minantraya", saptawara: "Buda", pancawara: "Umanis", sifat: "Bijaksana.", nasib: "Guru atau penasihat." },
    { nama: "Gajah", saptawara: "Buda", pancawara: "Paing", sifat: "Kuat fisik dan mental.", nasib: "Tahan banting." },
    { nama: "Lumbung", saptawara: "Buda", pancawara: "Pon", sifat: "Suka berbagi.", nasib: "Rezeki yang berkah." },
    { nama: "Kartika", saptawara: "Buda", pancawara: "Wage", sifat: "Kreatif.", nasib: "Cocok di bidang seni." },
    { nama: "Tiwa-tiwa", saptawara: "Buda", pancawara: "Kliwon", sifat: "Spiritualis.", nasib: "Memiliki intuisi tajam." },
    { nama: "Sangkat Tikel", saptawara: "Wraspati", pancawara: "Umanis", sifat: "Tegas.", nasib: "Pembuat keputusan yang baik." },
    { nama: "Salah Ukur", saptawara: "Wraspati", pancawara: "Paing", sifat: "Ambisius.", nasib: "Pekerja keras." },
    { nama: "Bade", saptawara: "Wraspati", pancawara: "Pon", sifat: "Sabar menanti.", nasib: "Kesuksesan yang bertahap." },
    { nama: "Kuda", saptawara: "Wraspati", pancawara: "Wage", sifat: "Cepat bertindak.", nasib: "Sering mendapat peluang emas." },
    { nama: "Naga", saptawara: "Wraspati", pancawara: "Kliwon", sifat: "Misterius.", nasib: "Disegani kawan maupun lawan." },
    { nama: "Angsa Angrem", saptawara: "Sukra", pancawara: "Umanis", sifat: "Lembut hati.", nasib: "Hidup penuh cinta." },
    { nama: "Taru", saptawara: "Sukra", pancawara: "Paing", sifat: "Mandiri.", nasib: "Berdiri di atas kaki sendiri." },
    { nama: "Perahu Sarat", saptawara: "Sukra", pancawara: "Pon", sifat: "Ulet.", nasib: "Sanggup memikul tanggung jawab besar." },
    { nama: "Banyak Angrem", saptawara: "Sukra", pancawara: "Wage", sifat: "Penyayang.", nasib: "Keluarga yang harmonis." },
    { nama: "Gajah Minantraya", saptawara: "Sukra", pancawara: "Kliwon", sifat: "Sabar dan berwibawa.", nasib: "Rezeki stabil." },
    { nama: "Puputon", saptawara: "Saniscara", pancawara: "Umanis", sifat: "Pantang menyerah.", nasib: "Akhir yang manis." },
    { nama: "Ayam", saptawara: "Saniscara", pancawara: "Paing", sifat: "Berani bersuara.", nasib: "Pekerja yang vokal." },
    { nama: "Perahu Sarat", saptawara: "Saniscara", pancawara: "Pon", sifat: "Pekerja keras.", nasib: "Sukses setelah berjuang." },
    { nama: "Bubu Bolong", saptawara: "Saniscara", pancawara: "Wage", sifat: "Sederhana.", nasib: "Tulus dalam bergaul." },
    { nama: "Pagelongan", saptawara: "Saniscara", pancawara: "Kliwon", sifat: "Introspektif.", nasib: "Belajar dari pengalaman." }
];
