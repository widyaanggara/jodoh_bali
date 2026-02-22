import { Wuku, Pancawara, Saptawara, KategoriJodoh, Zodiak, Sadwara, SodasaRsi, Ekawara, Dwiwara, Triwara, Caturwara, Asatawara, Dasawara, Sangawara } from './types';

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

//wawaran 1 - 10

export const ekawaraData: Ekawara[] = [
    { id: 1, nama: "Luang", urip: 1, karakter: "Mandiri, memiliki pendirian kuat, namun cenderung penyendiri." }
];

export const dwiwaraData: Dwiwara[] = [
    { id: 1, nama: "Menga", urip: 5, karakter: "Terbuka, komunikatif, dan mudah menerima masukan dari luar." },
    { id: 2, nama: "Pepet", urip: 4, karakter: "Pandai menyimpan rahasia, waspada, dan pemikir yang mendalam." }
];

export const triwaraData: Triwara[] = [
    { id: 1, nama: "Pasah", urip: 9, karakter: "Suka kebebasan, tidak suka diatur, dan sangat mandiri." },
    { id: 2, nama: "Beteng", urip: 4, karakter: "Berjiwa pelindung, pandai mengelola sumber daya, dan makmur." },
    { id: 3, nama: "Kajeng", urip: 7, karakter: "Kritis, memiliki intuisi tajam, dan teguh pada prinsip." }
];

export const caturwaraData: Caturwara[] = [
    { id: 1, nama: "Sri", urip: 6, karakter: "Dermawan, pembawa kebahagiaan, dan senang berbagi rezeki." },
    { id: 2, nama: "Laba", urip: 5, karakter: "Pandai mencari peluang dan sering berhasil dalam usaha." },
    { id: 3, nama: "Jaya", urip: 2, karakter: "Pantang menyerah, kompetitif, dan memiliki mental pemenang." },
    { id: 4, nama: "Menala", urip: 8, karakter: "Berwibawa, kharismatik, dan dihormati di lingkungannya." }
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
        id: 1,
        nama: "Tungleh",
        urip: 7,
        arti: "Tidak kekal",
        sifat: "Hari penuh kebohongan dan ingkar janji.",
        pesan: "Waspadalah terhadap fitnah dan kebohongan. Jangan paksa orang jujur, tapi buatlah ia menyesali akibat kebohongannya."
    },
    {
        id: 2,
        nama: "Aryang",
        urip: 6,
        arti: "Kurus",
        sifat: "Harinya orang lupa (kepikunan).",
        pesan: "Buatlah catatan pribadi agar tidak mengandalkan ingatan. Tulisan akan abadi, sementara ucapan akan terlupakan."
    },
    {
        id: 3,
        nama: "Urukung",
        urip: 5,
        arti: "Punah",
        sifat: "Hari kecerobohan dan kealpaan.",
        pesan: "Waspadalah terhadap kesalahan tidak sengaja. Kurangi tindakan berbahaya dan berhati-hatilah di jalan."
    },
    {
        id: 4,
        nama: "Paniron",
        urip: 8,
        arti: "Gemuk",
        sifat: "Hari kepura-puraan atau fatamorgana.",
        pesan: "Waspadalah terhadap kepalsuan. Teliti segalanya sebelum bertindak, karena hal yang tampak baik mungkin tidak demikian."
    },
    {
        id: 5,
        nama: "Was",
        urip: 9,
        arti: "Kuat",
        sifat: "Hari gembira.",
        pesan: "Jangan mengumbar kegembiraan berlebih. Gunakan hari ini untuk membahagiakan orang lain dan berderma."
    },
    {
        id: 6,
        nama: "Maulu",
        urip: 3,
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

export const asatawaraData: Asatawara[] = [
    { id: 1, nama: "Sri", urip: 6, karakter: "Pandai mengatur, rapi dalam bekerja, dan berjiwa pemimpin." },
    { id: 2, nama: "Indra", urip: 5, karakter: "Visioner, berbakat dalam perencanaan, dan sangat tekun." },
    { id: 3, nama: "Guru", urip: 8, karakter: "Suka membimbing, bijaksana, dan sabar dalam mengajar." },
    { id: 4, nama: "Yama", urip: 9, karakter: "Sangat disiplin, menjunjung tinggi keadilan, dan tegas." },
    { id: 5, nama: "Ludra", urip: 3, karakter: "Memiliki semangat yang meluap-luap dan tekad yang kuat." },
    { id: 6, nama: "Brahma", urip: 7, karakter: "Kreatif, penuh inovasi, dan memiliki energi yang besar." },
    { id: 7, nama: "Kala", urip: 1, karakter: "Sangat waspada terhadap perubahan dan peka pada situasi." },
    { id: 8, nama: "Uma", urip: 4, karakter: "Penyayang, lembut hati, dan memiliki jiwa pengasuh." }
];

export const sangawaraData: Sangawara[] = [
    { id: 1, nama: "Dangu", urip: 5, karakter: "Tenang, konsisten, dan tidak suka terburu-buru." },
    { id: 2, nama: "Jangur", urip: 8, karakter: "Kokoh, sulit dipengaruhi, dan memiliki pendirian baja." },
    { id: 3, nama: "Gigis", urip: 9, karakter: "Berwawasan luas, pemaaf, dan mudah beradaptasi." },
    { id: 4, nama: "Nohan", urip: 3, karakter: "Ceria, optimis, dan selalu membawa suasana positif." },
    { id: 5, nama: "Ogan", urip: 7, karakter: "Aktif, dinamis, dan senang dengan hal-hal baru." },
    { id: 6, nama: "Erangan", urip: 1, karakter: "Intuitif, sensitif terhadap perasaan orang lain, dan halus." },
    { id: 7, nama: "Urungan", urip: 4, karakter: "Penuh pertimbangan dan sangat hati-hati dalam melangkah." },
    { id: 8, nama: "Tulus", urip: 6, karakter: "Jujur, apa adanya, dan sangat dapat dipercaya." },
    { id: 9, nama: "Dadi", urip: 8, karakter: "Memiliki tujuan hidup yang pasti dan jarang ragu-ragu." }
];

export const dasawaraData: Dasawara[] = [
    { id: 1, nama: "Pandita", urip: 5, karakter: "Bijaksana, tenang, dan memiliki kedalaman ilmu." },
    { id: 2, nama: "Pati", urip: 7, karakter: "Tegas, memiliki otoritas, dan berani mengambil risiko." },
    { id: 3, nama: "Suka", urip: 10, karakter: "Optimis, ceria, dan pandai menghibur orang lain." },
    { id: 4, nama: "Duka", urip: 4, karakter: "Mudah berempati dan memiliki kepekaan sosial tinggi." },
    { id: 5, nama: "Sri", urip: 2, karakter: "Menyukai keindahan, rapi, dan memiliki cita rasa tinggi." },
    { id: 6, nama: "Manuh", urip: 3, karakter: "Disiplin, patuh pada aturan, dan rendah hati." },
    { id: 7, nama: "Manusa", urip: 8, karakter: "Suka bersosialisasi dan sangat mementingkan hubungan manusia." },
    { id: 8, nama: "Raja", urip: 1, karakter: "Berjiwa besar, kharismatik, dan berbakat mengatur orang." },
    { id: 9, nama: "Dewa", urip: 9, karakter: "Memiliki spiritualitas tinggi dan fokus pada kebajikan." },
    { id: 10, nama: "Raksasa", urip: 6, karakter: "Memiliki energi besar, kuat fisik, dan mental yang tangguh." }
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
    {
        "saptawara": "Redite",
        "pancawara": "Paing",
        "lintang": "Gajah",
        "label": "Tenang & Teguh",
        "makna": "Lakunya Bulan",
        "penjelasan": "Pandai merahasiakan perasaan, meski sedang marah atau menyesal tetap terlihat tenang. Pandai bergaul dan banyak kawan, namun memiliki pendirian yang sangat kuat dan terkadang sulit dikendalikan nafsunya."
    },
    {
        "saptawara": "Soma",
        "pancawara": "Pon",
        "lintang": "Kiriman",
        "label": "Rendah Hati",
        "makna": "Sumur Sinaba",
        "penjelasan": "Meskipun terlihat suka pamer, aslinya sangat berhati-hati dan suka mengalah. Bicaranya mungkin terdengar keras, namun sebenarnya baik budi, ramah tamah, dan sangat menjunjung tata susila."
    },
    {
        "saptawara": "Anggara",
        "pancawara": "Wage",
        "lintang": "Jongsarat",
        "label": "Penyelidik Setia",
        "makna": "Lakunya Bumi",
        "penjelasan": "Suka mengalah dalam pergaulan dan gemar menolong orang yang sedang kesulitan. Sangat mantap dalam menyelidiki hal-hal penting, namun cenderung pencemburu dan mudah tersinggung."
    },
    {
        "saptawara": "Buda",
        "pancawara": "Kliwon",
        "lintang": "Tiwa-tiwa",
        "label": "Penyusun Kata",
        "makna": "Lakunya Surya",
        "penjelasan": "Memiliki sopan santun yang tinggi, ramah, dan lemah lembut. Pandai menimbang sesuatu dan ahli dalam merangkai kata atau mengarang, namun hatinya sensitif dan mudah tersinggung."
    },
    {
        "saptawara": "Wraspati",
        "pancawara": "Umanis",
        "lintang": "Sangka Tikel",
        "label": "Visioner Bijak",
        "makna": "Lakunya Bintang",
        "penjelasan": "Memiliki cita-cita setinggi langit, bijaksana, dan pandai bergaul. Bicaranya tegas dan keras, namun terkadang suka mencampuri urusan orang lain dan butuh dorongan agar tidak lekas patah hati."
    },
    {
        "saptawara": "Sukra",
        "pancawara": "Paing",
        "lintang": "Bubu Bolong",
        "label": "Jujur & Dermawan",
        "makna": "Tunggak Semi",
        "penjelasan": "Pribadi yang ramah, jujur, dan memiliki angan-angan mulia sehingga disukai banyak orang. Namun, perlu waspada terhadap sifat pemboros dan kemauan yang terlalu keras."
    },
    {
        "saptawara": "Saniscara",
        "pancawara": "Pon",
        "lintang": "Sungenge",
        "label": "Berwibawa Tinggi",
        "makna": "Lakunya Air",
        "penjelasan": "Bercita-cita mulia dan senang menunjukkan kepandaian atau kekayaan. Disegani oleh orang banyak dan memiliki sifat pemaaf bagi mereka yang mengakui kesalahan."
    },
    {
        "saptawara": "Redite",
        "pancawara": "Wage",
        "lintang": "Uluku",
        "label": "Pekerja Keras",
        "makna": "Lakunya Angin",
        "penjelasan": "Sangat suka bekerja dan pandai menjaga rahasia penting. Meskipun dermawan, mereka sangat teguh pada pendapatnya jika ditentang dan sering memiliki sifat mudah kaget."
    },
    {
        "saptawara": "Soma",
        "pancawara": "Kliwon",
        "lintang": "Pedati",
        "label": "Pengorban Tulus",
        "makna": "Satria Wirang",
        "penjelasan": "Lemah lembut dan berkelakuan pantas. Meskipun mudah sakit hati, mereka sangat cepat memaafkan dan melupakan dendam. Rela berkorban demi keadilan bagi orang lain."
    },
    {
        "saptawara": "Anggara",
        "pancawara": "Umanis",
        "lintang": "Kuda",
        "label": "Tangkas & Maju",
        "makna": "Lakunya Api",
        "penjelasan": "Sangat tangkas dalam bekerja dan selalu mengejar kemajuan. Memiliki cita-cita besar namun sering kali cemburu dan jengkel jika ada yang menentang pendiriannya."
    },
    {
        "saptawara": "Buda",
        "pancawara": "Paing",
        "lintang": "Gajahmina",
        "label": "Waspada & Murah Hati",
        "makna": "Lakunya Bulan",
        "penjelasan": "Sangat berhati-hati dan selalu mempertimbangkan segala hal sebelum bertindak. Tidak suka mencampuri urusan orang lain, namun jika marah bisa sangat hebat."
    },
    {
        "saptawara": "Wraspati",
        "pancawara": "Pon",
        "lintang": "Bade",
        "label": "Pencari Pengalaman",
        "makna": "Lakunya Surya",
        "penjelasan": "Selalu ingin menambah pengalaman dan mencari kemajuan lahir batin. Namun, perlu berhati-hati dengan sifat pamer kepandaian agar tidak mendatangkan bahaya bagi diri sendiri."
    },
    {
        "saptawara": "Sukra",
        "pancawara": "Wage",
        "lintang": "Maglut",
        "label": "Setia & Pengabdi",
        "makna": "Pendeta Sakti",
        "penjelasan": "Sangat jujur, setia, dan murah hati. Sering menjadi korban demi kepentingan keluarga atau saudaranya, namun tetap teguh dengan pendiriannya meskipun harus menderita."
    },
    {
        "saptawara": "Saniscara",
        "pancawara": "Kliwon",
        "lintang": "Pagelangan",
        "label": "Sopan & Hati-hati",
        "makna": "Lakunya Bumi",
        "penjelasan": "Ramah tamah dan sangat hati-hati dalam bertindak. Pandai menyusun kata-kata, namun terkadang kurang percaya diri dan mudah putus asa saat menghadapi kesulitan besar."
    },
    {
        "saptawara": "Redite",
        "pancawara": "Umanis",
        "lintang": "Kala Sungsang",
        "label": "Diplomat Tenang",
        "makna": "Pendeta Sakti",
        "penjelasan": "Pandai menyembunyikan perasaan dan tetap tenang meski sedang marah. Suka berdebat dan terkadang mencampuri urusan orang lain, namun aslinya berhati kaku."
    },
    {
        "saptawara": "Soma",
        "pancawara": "Paing",
        "lintang": "Kukus",
        "label": "Rajin & Setia",
        "makna": "Lakunya Bintang",
        "penjelasan": "Berkelakuan baik, jujur, dan rajin bekerja. Memiliki cita-cita tinggi dan sangat setia pada janjinya. Hidupnya cenderung hemat, cermat, dan tertata."
    },
    {
        "saptawara": "Anggara",
        "pancawara": "Pon",
        "lintang": "Asu",
        "label": "Waspada & Mewah",
        "makna": "Satria Wibawa",
        "penjelasan": "Menyukai kemewahan namun tetap waspada dan pandai berbahasa. Sangat baik terhadap kawan yang loyal, namun sulit percaya pada orang baru dan suka berdebat."
    },
    {
        "saptawara": "Buda",
        "pancawara": "Wage",
        "lintang": "Kartika",
        "label": "Adil & Pantas",
        "makna": "Aras Tuding",
        "penjelasan": "Umumnya berkelakuan baik dan mengerti nilai uang (ekonomis). Suka menimbang segala hal dengan adil, bicaranya tegas meskipun terkadang terdengar janggal."
    },
    {
        "saptawara": "Wraspati",
        "pancawara": "Kliwon",
        "lintang": "Naga",
        "label": "Tajam & Ulet",
        "makna": "Lakunya Air",
        "penjelasan": "Bicaranya tajam dan cita-citanya tinggi. Memiliki pikiran yang ulet dan ramah, namun hatinya sangat sensitif sehingga mudah tersinggung dan jatuh dalam kesedihan."
    },
    {
        "saptawara": "Sukra",
        "pancawara": "Umanis",
        "lintang": "Banyak Angrem",
        "label": "Terus Terang",
        "makna": "Aras Tuding",
        "penjelasan": "Jujur, suka berterus terang, dan dermawan. Sangat suka menolong, namun jika sudah tidak cocok dengan seseorang, mereka bisa memutus hubungan secara total."
    },
    {
        "saptawara": "Saniscara",
        "pancawara": "Paing",
        "lintang": "Ru",
        "label": "Cepat Memaafkan",
        "makna": "Lakunya Api",
        "penjelasan": "Memiliki nafsu yang besar dan lekas marah, namun sangat mudah sabar dan menyesal. Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan."
    },
    {
        "saptawara": "Redite",
        "pancawara": "Pon",
        "lintang": "Patrem",
        "label": "Ahli Diplomasi",
        "makna": "Aras Kembang",
        "penjelasan": "Sangat licin dan pandai berdiplomasi. Suka memperlihatkan kekayaan dan kepandaiannya di hadapan orang lain, namun pandai menyimpan perasaan yang sesungguhnya."
    },
    {
        "saptawara": "Soma",
        "pancawara": "Wage",
        "lintang": "Lembu",
        "label": "Jujur & Empati",
        "makna": "Lakunya Api",
        "penjelasan": "Segala urusan ditimbang dengan baik dan tidak terburu nafsu. Memiliki empati yang tinggi terhadap kesulitan orang lain, namun jika marah sangat sulit diredakan."
    },
    {
        "saptawara": "Anggara",
        "pancawara": "Kliwon",
        "lintang": "Depat",
        "label": "Ramah & Menyenangkan",
        "makna": "Sumur Sinaba",
        "penjelasan": "Pintar menyusun kata-kata sehingga bicaranya menyenangkan pendengar. Murah hati, namun terkadang memiliki pikiran yang keruh dan sulit percaya pada orang lain."
    },
    {
        "saptawara": "Buda",
        "pancawara": "Umanis",
        "lintang": "Tangis",
        "label": "Bijaksana & Peka",
        "makna": "Aras Kembang",
        "penjelasan": "Berkelakuan sopan, adil, dan bijaksana. Suka menolong kawan setia, namun sering dilingkupi rasa bimbang dan kesedihan yang mendalam."
    },
    {
        "saptawara": "Wraspati",
        "pancawara": "Paing",
        "lintang": "Salah Ukur",
        "label": "Giat & Dinamis",
        "makna": "Lakunya Bumi",
        "penjelasan": "Memiliki kemauan yang tangkas dan giat mencari kemajuan lahir batin. Sangat rukun dengan keluarga, namun bicaranya terkadang menyinggung atau salah terka terhadap orang lain."
    },
    {
        "saptawara": "Sukra",
        "pancawara": "Pon",
        "lintang": "Prahu Pegat",
        "label": "Pecinta Keadilan",
        "makna": "Lakunya Bintang",
        "penjelasan": "Suka bergaul, jujur, dan memiliki perikemanusiaan yang tinggi. Namun, sering merasa bimbang dan sedih hati yang membuat kemauannya mudah terputus di tengah jalan."
    },
    {
        "saptawara": "Saniscara",
        "pancawara": "Wage",
        "lintang": "Puwuh Atarung",
        "label": "Tegas & Dermawan",
        "makna": "Lakunya Bintang",
        "penjelasan": "Pintar mengatur rumah tangga dan menyukai kemewahan. Bicaranya tegas dan sangat murah hati kepada mereka yang memuji dirinya, namun cenderung pencemburu."
    },
    {
        "saptawara": "Redite",
        "pancawara": "Kliwon",
        "lintang": "Lawean",
        "label": "Sabar & Sopan",
        "makna": "Lakunya Bintang",
        "penjelasan": "Pribadi yang sabar, sopan, dan pandai berdiplomasi. Memiliki derajat yang tinggi dan pendiam, namun sulit diubah jika sudah memiliki pendapat sendiri."
    },
    {
        "saptawara": "Soma",
        "pancawara": "Umanis",
        "lintang": "Kelapa",
        "label": "Sopan & Dermawan",
        "makna": "Lakunya Angin",
        "penjelasan": "Berperilaku sopan santun dan ingin selalu berbuat baik. Suka membantu orang yang disetujuinya, namun memiliki kegemaran mengembara dan berdebat."
    },
    {
        "saptawara": "Anggara",
        "pancawara": "Paing",
        "lintang": "Yuyu",
        "label": "Murah Rezeki",
        "makna": "Aras Kembang",
        "penjelasan": "Murah hati dan suka menolong orang yang disukai. Rezekinya lancar, namun cenderung serakah terhadap apa yang dilihat dan mudah menyesal setelah bertindak emosional."
    },
    {
        "saptawara": "Buda",
        "pancawara": "Pon",
        "lintang": "Lumbung",
        "label": "Waspada & Rajin",
        "makna": "Lakunya Bulan",
        "penjelasan": "Sopan santun, waspada, dan memiliki rezeki yang baik. Sangat rajin dalam bekerja dan dicintai banyak orang, namun mudah tersinggung jika merasa tidak dihargai."
    },
    {
        "saptawara": "Wraspati",
        "pancawara": "Wage",
        "lintang": "Kumba",
        "label": "Adil & Cerdas",
        "makna": "Aras Kembang",
        "penjelasan": "Memiliki angan-angan tinggi dan suka berlaku adil. Sangat cerdas dalam memikirkan solusi masalah, namun cenderung pendendam jika merasa disalahi."
    },
    {
        "saptawara": "Sukra",
        "pancawara": "Kliwon",
        "lintang": "Udang",
        "label": "Berpengaruh Besar",
        "makna": "Lakunya Bulan",
        "penjelasan": "Berbudi baik, sabar, dan sangat ahli dalam mengarang atau berdiplomasi. Memiliki pengaruh besar dan dicintai orang, sukses biasanya datang saat usia dewasa."
    },
    {
        "saptawara": "Saniscara",
        "pancawara": "Umanis",
        "lintang": "Begoong",
        "label": "Pandai & Berani",
        "makna": "Lakunya Bulan",
        "penjelasan": "Sangat terampil dalam segala pekerjaan dan berwawasan luas. Berani dalam bertindak, namun bicaranya tajam dan sering mencampuri urusan orang lain."
    }
];



// data/masterMod16.ts
export const dataSodasaRsi: SodasaRsi[] =
    [
        {
            "sisa": 1,
            "label": "Ujian Kesabaran",
            "makna": "Ketabahan",
            "penjelasan": "Diliputi kebimbangan, dalam keadaan suka dan duka, baik buruk, sering dituntut ketabahan."
        },
        {
            "sisa": 2,
            "label": "Petualang Minim Rezeki",
            "makna": "Durlaba",
            "penjelasan": "Durlaba, rezeki seret tapi suka melancong."
        },
        {
            "sisa": 3,
            "label": "Sering Tertekan",
            "makna": "Kekecewaan",
            "penjelasan": "Sering mendapat malu dan kecewa."
        },
        {
            "sisa": 4,
            "label": "Sulit Keturunan",
            "makna": "Keturunan",
            "penjelasan": "Susah mendapatkan sentana (keturunan)."
        },
        {
            "sisa": 5,
            "label": "Rezeki Lancar",
            "makna": "Dirgahayu",
            "penjelasan": "Dirgahayu, rezekinya lancar dan menanjak."
        },
        {
            "sisa": 6,
            "label": "Rentan Sakit",
            "makna": "Merana",
            "penjelasan": "Merana, sering sakit."
        },
        {
            "sisa": 7,
            "label": "Proses Menuju Bahagia",
            "makna": "Suka Duka",
            "penjelasan": "Mengalami suka duka, baik buruk dalam perjalanan hidupnya, menuju bahagia."
        },
        {
            "sisa": 8,
            "label": "Kesulitan Ekonomi",
            "makna": "Terak",
            "penjelasan": "Sukar untuk memenuhi hajat hidup sehari-hari, bahkan sampai kekurangan (terak)."
        },
        {
            "sisa": 9,
            "label": "Penuh Penyesalan",
            "makna": "Penyesalan",
            "penjelasan": "Kurang hati-hati, kesakitan tak henti-hentinya mewarnai kehidupannya, sampai menimbulkan kekecewaan dan penyesalan hidup."
        },
        {
            "sisa": 10,
            "label": "Wibawa Pemimpin",
            "makna": "Wibawa",
            "penjelasan": "Mendapatkan wibawa serta disegani bagai raja/ratu yang berkuasa, sehingga dapat mengayomi keluarga."
        },
        {
            "sisa": 11,
            "label": "Sukses Sempurna",
            "makna": "Sidha serta Sabita",
            "penjelasan": "Mendapat sukses dalam perjalanan hidup, tercapainya cita-citanya dengan penuh kepuasan (sidha serta sabita)."
        },
        {
            "sisa": 12,
            "label": "Magnet Rezeki",
            "makna": "Sedana Nulus",
            "penjelasan": "Sedana nulus, rezeki lancar/gampang."
        },
        {
            "sisa": 13,
            "label": "Panjang Umur & Berkah",
            "makna": "Dirgayusa",
            "penjelasan": "Dirgayusa, panjang umur, rezekinya berkepanjangan."
        },
        {
            "sisa": 14,
            "label": "Selalu Bahagia",
            "makna": "Kebahagiaan",
            "penjelasan": "Mendapatkan kebahagiaan/kesenangan selalu."
        },
        {
            "sisa": 15,
            "label": "Banyak Masalah",
            "makna": "Bermasalah",
            "penjelasan": "Sering mengalami kesusahan, keadaan buruk serta banyak problem."
        },
        {
            "sisa": 16,
            "label": "Penuh Kesenangan",
            "makna": "Kesenangan",
            "penjelasan": "Memperoleh kebahagiaan/kesenangan."
        }
    ];


