import { IPalSriSedana, PalSriSedanaLabel } from './types';

/**
 * Master data Pal Sri Sedana - Mapping Total Urip ke siklus rezeki 6 tahunan
 * Setiap urip memiliki panjang siklus yang berbeda
 * Nilai: 0 (Pati) - 8 (Sukses Besar)
 */
export const masterPalSriSedana: IPalSriSedana[] = [
    { urip: 7, siklus: [4, 1, 4, 1, 0, 2, 0] },
    { urip: 8, siklus: [4, 1, 0, 1, 0, 3, 0, 7] },
    { urip: 9, siklus: [2, 2, 1, 0, 4, 1, 4, 0, 7] },
    { urip: 10, siklus: [1, 0, 4, 1, 1, 3, 0, 0, 4, 4] },
    { urip: 11, siklus: [2, 4, 1, 1, 8, 1, 0, 1, 2, 0, 2] },
    { urip: 12, siklus: [0, 5, 1, 0, 4, 0, 1, 0, 1, 4, 4, 0] },
    { urip: 13, siklus: [0, 1, 0, 5, 0, 1, 1, 5, 2, 0, 1, 2, 5] },
    { urip: 14, siklus: [1, 0, 1, 4, 4, 0, 1, 4, 1, 4, 4, 1, 1, 0] },
    { urip: 15, siklus: [2, 0, 1, 1, 5, 2, 0, 1, 2, 5, 5, 1, 0, 4, 4] },
    { urip: 16, siklus: [0, 3, 1, 2, 0, 1, 3, 1, 2, 1, 2, 0, 1, 1, 0, 2] },
    { urip: 17, siklus: [1, 1, 0, 5, 0, 1, 1, 5, 2, 0, 1, 2, 5, 5, 1, 0, 4] },
    { urip: 18, siklus: [2, 5, 1, 0, 5, 1, 4, 0, 1, 4, 4, 0, 0, 2, 1, 4, 0, 0] }
];

/**
 * Helper untuk mendapatkan label, warna, dan deskripsi berdasarkan nilai rezeki
 * @param nilai - Nilai rezeki (0-8)
 * @returns Object dengan label, color, dan desc
 */
export const getLabelRezeki = (nilai: number): PalSriSedanaLabel => {
    switch (nilai) {
        case 8:
            return {
                label: "Puncak Cahaya (Maha Utama)",
                color: "#1B813E", // Deep Green
                desc: "Masa kemuning di mana segala niat baik bertemu dengan semesta. Waktu terbaik untuk berbagi dan menebar manfaat."
            };
        case 7:
            return {
                label: "Kelimpahan Budhi",
                color: "#2E9E4B", // Green
                desc: "Kehidupan terasa penuh dan bermakna. Keselarasan antara batin dan materi berada pada titik tertinggi."
            };
        case 6:
            return {
                label: "Ketenangan Paripurna",
                color: "#5BB55C", // Light Green
                desc: "Energi kehidupan mengalir dengan stabil dan menyejukkan. Masa yang sangat kondusif untuk kedamaian keluarga."
            };
        case 5:
            return {
                label: "Keselarasan Hidup",
                color: "#8BC34A", // Yellow-Green
                desc: "Berada dalam ritme yang seimbang. Segala sesuatu berjalan semestinya tanpa hambatan yang berarti."
            };
        case 4:
            return {
                label: "Langkah Terang",
                color: "#CDDC39", // Yellow-Lime
                desc: "Jalan di depan tampak jelas. Peluang mulai terbuka lebar bagi mereka yang mau berusaha dengan tulus."
            };
        case 3:
            return {
                label: "Tumbuh Berkembang",
                color: "#FFC107", // Amber
                desc: "Awal dari pergerakan positif. Waktu yang baik untuk belajar hal baru dan memperluas relasi."
            };
        case 2:
            return {
                label: "Ujian Ketekunan",
                color: "#FF7043", // Orange-Red
                desc: "Energi cukup untuk bertahan, namun menuntut ketelitian. Tetaplah fokus pada tujuan meski langkah terasa pelan."
            };
        case 1:
            return {
                label: "Masa Perjuangan",
                color: "#E53935", // Red
                desc: "Tantangan hadir untuk mendewasakan diri. Diperlukan kesabaran ekstra dan penghematan energi fisik maupun mental."
            };
        case 0:
        default:
            return {
                label: "Hening (Penyucian)",
                color: "#B71C1C", // Deep Red
                desc: "Titik balik kehidupan. Waktunya untuk jeda sejenak, memperbaiki diri secara spiritual, dan menjaga keharmonisan tubuh."
            };
    }
};

/**
 * Mendapatkan data siklus Pal Sri Sedana berdasarkan total Urip
 * @param urip - Total Urip (Saptawara + Pancawara)
 * @returns Data siklus atau undefined jika tidak ditemukan
 */
export const getPalSriSedanaData = (urip: number): IPalSriSedana | undefined => {
    return masterPalSriSedana.find(item => item.urip === urip);
};

/**
 * Mendapatkan interpretasi periode saat ini berdasarkan usia
 * @param birthDate - Tanggal lahir
 * @param palData - Data Pal Sri Sedana
 * @returns Object dengan usia, periode, nilai, dan interpretasi
 */
export const getCurrentPeriodAnalysis = (
    birthDate: Date,
    palData: IPalSriSedana
): {
    currentAge: number;
    periodIndex: number;
    value: number;
    interpretation: string;
} => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    const birthdayThisYear = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );
    const adjustedAge = today < birthdayThisYear ? age - 1 : age;

    // Determine which 6-year period (0-6, 6-12, 12-18, etc.)
    const periodIndex = Math.floor(adjustedAge / 6);

    // Get value for current period (clamp to available data)
    const value = periodIndex < palData.siklus.length
        ? palData.siklus[periodIndex]
        : palData.siklus[palData.siklus.length - 1];

    // Generate interpretation based on value
    let interpretation = "";
    if (value >= 7) {
        interpretation = "Puncak Kejayaan (Masa emas untuk ekspansi dan keberuntungan besar).";
    } else if (value >= 3) {
        interpretation = "Masa Stabil & Produktif (Waktu yang baik untuk memelihara usaha).";
    } else {
        interpretation = "Masa Waspada & Spiritual (Fokus pada kesehatan dan kesabaran).";
    }

    return {
        currentAge: adjustedAge,
        periodIndex,
        value,
        interpretation
    };
};
