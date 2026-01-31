import {
    BalineseDate,
    KategoriJodoh,
    SodasaRsi,
    CompatibilityResult,
    MarriageCycle,
    Lintang,
    MatchingDate
} from "./types";
import { wukuData, pancawaraData, saptawaraData, kategoriJodohData, dataLintang, sadwaraData, dataSodasaRsi } from './data';

// Reference date for Balinese calendar calculation
// Using verified date: 27 Juli 2005 adalah Rabu (Buda), Kliwon, Wuku Sinta
// This is a VERIFIED anchor point that we can trust
const REFERENCE_DATE = new Date(2005, 6, 27, 12, 0, 0); // 27 July 2005, noon to avoid timezone issues
const REFERENCE_WUKU_OFFSET = 1; // 27 July 2005 is Wuku Sinta (index 1)
const REFERENCE_PANCAWARA_OFFSET = 4; // 27 July 2005 is Kliwon (index 4: Umanis=0, Paing=1, Pon=2, Wage=3, Kliwon=4)

/**
 * Calculate the number of days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    // Set to noon to avoid DST and timezone edge cases
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), 12, 0, 0);
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 12, 0, 0);
    return Math.round((d2.getTime() - d1.getTime()) / oneDay);
}

/**
 * Map JavaScript getDay() (0=Sunday) to Saptawara index
 * Saptawara: 0=Redite(Minggu), 1=Soma(Senin), 2=Anggara(Selasa), 3=Buda(Rabu), 
 *            4=Wraspati(Kamis), 5=Sukra(Jumat), 6=Saniscara(Sabtu)
 */
function getSaptawaraIndex(date: Date): number {
    const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Map: Sunday(0) -> Redite(0), Monday(1) -> Soma(1), ..., Saturday(6) -> Saniscara(6)
    return jsDay;
}

/**
 * Get Sadwara based on date calculation
 * Sadwara cycles every 6 days
 */
function getSadwaraIndex(date: Date): number {
    const days = daysBetween(REFERENCE_DATE, date);
    // Sadwara cycles every 6 days (Tungleh, Aryang, Urukung, Paniron, Was, Maulu)
    return ((days % 6) + 6) % 6;
}

/**
 * Convert Gregorian date to Balinese calendar date
 */
export function getBalineseDate(date: Date): BalineseDate {
    const days = daysBetween(REFERENCE_DATE, date);

    // Wuku cycles every 210 days (30 wuku × 7 days each)
    const wukuTotalDays = ((days + REFERENCE_WUKU_OFFSET) % 210 + 210) % 210;
    const wukuIndex = Math.floor(wukuTotalDays / 7);

    // Pancawara cycles every 5 days
    const pancawaraIndex = ((days + REFERENCE_PANCAWARA_OFFSET) % 5 + 5) % 5;

    // Saptawara - use native JavaScript getDay() for accuracy
    const saptawaraIndex = getSaptawaraIndex(date);

    // Sadwara - cycles every 6 days
    const sadwaraIndex = getSadwaraIndex(date);

    const wuku = wukuData[wukuIndex % 30];
    const pancawara = pancawaraData[pancawaraIndex % 5];
    const saptawara = saptawaraData[saptawaraIndex];
    const sadwara = sadwaraData[sadwaraIndex % 6];

    // Total urip for Mod 5 (Rezeki) is Saptawara + Pancawara ONLY (without Wuku & Sadwara)
    const totalUrip = saptawara.urip + pancawara.urip;

    // Total urip for Mod 16 (Sodasa Rsi) includes Sadwara (without Wuku)
    const totalUripSodasaRsi = totalUrip + sadwara.urip;

    // Find Lintang (Star)
    const lintang = findLintang(saptawara.hari, pancawara.nama);

    // Calculate next Otonan
    const nextOtonan = getNextOtonan(date);

    return {
        wuku,
        pancawara,
        saptawara,
        sadwara,
        totalUrip,
        totalUripSodasaRsi,
        lintang,
        nextOtonan
    };
}

/**
 * Find Lintang based on Saptawara and Pancawara
 */
export function findLintang(saptawara: string, pancawara: string): Lintang | undefined {
    const sDay = saptawara.split('/')[0];
    return dataLintang.find(l => l.saptawara === sDay && l.pancawara === pancawara);
}

/**
 * Calculate the next Otonan date (every 210 days from birth)
 */
export function getNextOtonan(birthDate: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const birth = new Date(birthDate);
    birth.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

    // Calculate how many periods of 210 days have passed
    // If born today, the next one is in 210 days
    const periods = Math.max(0, Math.floor(diffDays / 210)) + 1;
    const nextOtonanDate = new Date(birth.getTime() + periods * 210 * 24 * 60 * 60 * 1000);

    return formatDate(nextOtonanDate);
}

/**
 * Get kategori jodoh based on total urip sum (Mod 5)
 */
function getKategoriJodoh(totalUrip: number): KategoriJodoh {
    const sisa = totalUrip % 5;
    return kategoriJodohData.find(k => k.sisa === sisa) || kategoriJodohData[0];
}

/**
 * Get Sodasa Rsi (Mod 16) result
 */
function getSodasaRsi(combinedTotalUrip: number): SodasaRsi {
    const sisa = combinedTotalUrip % 16;
    return dataSodasaRsi.find(s => s.sisa === sisa) || dataSodasaRsi[0];
}

/**
 * Calculate compatibility percentage based on kategori
 */
function calculatePercentage(kategori: KategoriJodoh): number {
    switch (kategori.kategori) {
        case 'Sri': return 95;
        case 'Dana': return 85;
        case 'Laba': return 75;
        case 'Sakti': return 60;
        case 'Tiwas': return 45;
        default: return 50;
    }
}

const POSITIVE_MOD5 = ['Sri', 'Dana', 'Laba', 'Lungguh'];
// Pati is considered negative/challenging

const POSITIVE_MOD16_LABELS = [
    'Sri Emas', 'Siddha Karya Hayu', 'Hala Hayu Gung Pahalniya',
    'Werdi Wekasan', 'Hayu Pasukarma', 'Nari Utama', 'Singa Gatan'
];
// Others like Tiwas, Tukaran, Pati, etc. are considered challenging

/**
 * Calculate 5-year marriage cycles based on diminishing Total Urip logic
 */
function calculateMarriageCycles(initialTotalUrip: number): MarriageCycle[] {
    let currentValue = initialTotalUrip;
    const cycles: MarriageCycle[] = [];
    const maxCycles = 10; // Prediksi sampai 50 tahun (10 * 5)

    for (let i = 0; i < maxCycles; i++) {
        const startYear = i * 5 + 1;
        const endYear = (i + 1) * 5;

        // Safety check if value becomes too small
        if (currentValue <= 0) break;

        const hasilBagi = Math.floor(currentValue / 5);
        const sisa = currentValue % 5;

        let result: 'Sri' | 'Gedong' | 'Pete' | 'Pati' | 'Sama';
        let meaning: string;

        switch (sisa) {
            case 1:
                result = 'Sri';
                meaning = "Selalu Sejahtera & Bahagia";
                break;
            case 2:
                result = 'Gedong';
                meaning = "Berkecukupan & Harta Melimpah";
                break;
            case 3:
                result = 'Pete';
                meaning = "Sering Berselisih / Sakit Hati";
                break;
            case 4:
                result = 'Pati';
                meaning = "Banyak Masalah & Musibah";
                break;
            case 0:
            default:
                result = 'Sama';
                meaning = "Sejahtera & Berkecukupan";
                break;
        }

        cycles.push({
            startYear,
            endYear,
            value: currentValue,
            result,
            meaning
        });

        // Update for next cycle: currentValue - hasilBagi
        currentValue = currentValue - hasilBagi;
    }

    return cycles;
}

/**
 * Generate match conclusion narrative based on user request
 */
function generateMatchConclusion(mod5: KategoriJodoh, mod16: SodasaRsi): { title: string, content: string, sentiment: 'positive' | 'neutral' | 'challenge' } {
    const isMod5Good = POSITIVE_MOD5.includes(mod5.kategori);
    const isMod16Good = POSITIVE_MOD16_LABELS.includes(mod16.label);

    // Case 1: Both Good
    if (isMod5Good && isMod16Good) {
        return {
            title: "Harmoni Sejahtera Lahir Batin",
            content: `Selamat! Pasangan ini diprediksi memiliki kombinasi yang sangat ideal. Secara ekonomi memiliki potensi rezeki yang lancar (${mod5.kategori}), dan secara batin memiliki kecocokan karakter yang kuat (${mod16.label}). Pertahankan komunikasi yang baik dan saling mengisi, rumah tangga kalian berpotensi menjadi teladan kebahagiaan.`,
            sentiment: 'positive'
        };
    }

    // Case 2: Mod 5 Good (Wealth) & Mod 16 Challenging (Character)
    if (isMod5Good && !isMod16Good) {
        return {
            title: "Rezeki Kuat, Perlu Kelembutan Hati",
            content: `Pasangan ini diprediksi memiliki fondasi ekonomi yang kuat dan rezeki yang baik (${mod5.kategori}). Namun, secara batin perlu waspada karena ada potensi gesekan karakter atau ujian perasaan (${mod16.label}). Kuncinya adalah menjaga keharmonisan komunikasi dan saling mengalah agar harta yang melimpah tidak menjadi beban pikiran, melainkan sarana kebahagiaan.`,
            sentiment: 'neutral'
        };
    }

    // Case 3: Mod 5 Challenging (Wealth) & Mod 16 Good (Character)
    if (!isMod5Good && isMod16Good) {
        return {
            title: "Kekayaan Hati & Kebahagiaan Batin",
            content: `Secara finansial mungkin pasangan ini akan menghadapi dinamika naik turun atau hidup dalam kesederhanaan. Namun, kekuatan sesungguhnya ada pada kerukunan batin dan kasih sayang yang luar biasa (${mod16.label}). Segala rintangan ekonomi akan terasa ringan karena kalian menghadapinya dengan gembira bersama. Kebahagiaan kalian bersumber dari ketenangan hati.`,
            sentiment: 'neutral'
        };
    }

    // Case 4: Both Challenging
    return {
        title: "Perlu Kesabaran & Doa Bersama",
        content: `Perjalanan hubungan ini mungkin membutuhkan usaha ekstra. Baik dari sisi ekonomi maupun penyatuan karakter memerlukan kesabaran yang luas. Jadikan setiap ujian sebagai penguat cinta kalian. Disarankan untuk lebih sering mendekatkan diri pada Tuhan, melakukan sedekah, atau melukat untuk menetralisir energi kurang baik. Cinta sejati teruji dalam masa sulit.`,
        sentiment: 'challenge'
    };
}

/**
 * Calculate compatibility between two people based on their birth dates
 * Includes both Mod 5 (Rezeki) and Mod 16 (Karakter & Wibawa)
 */
export function calculateCompatibility(date1: Date, date2: Date): CompatibilityResult {
    const person1 = getBalineseDate(date1);
    const person2 = getBalineseDate(date2);

    // Mod 5 calculation (original - for Rezeki/Fortune)
    const totalUrip = person1.totalUrip + person2.totalUrip;
    const kategori = getKategoriJodoh(totalUrip);
    const percentage = calculatePercentage(kategori);

    // Mod 16 calculation (new - for Karakter & Wibawa) using comprehensive Urip
    const combinedTotalUrip = person1.totalUripSodasaRsi + person2.totalUripSodasaRsi;
    const mod16Result = getSodasaRsi(combinedTotalUrip);

    // Generate conclusion narrative
    const matchConclusion = generateMatchConclusion(kategori, mod16Result);

    // Calculate Marriage Cycles (using Mod 5 Combined Total Urip: Sapta + Panca)
    // The previous `totalUrip` variable is sum of both person's Mod 5 Urip
    const marriageCycles = calculateMarriageCycles(totalUrip);

    // Bonus if wuku is recommended partner
    const isRecommended = person1.wuku.rekomendasi_pasangan.includes(person2.wuku.nama_wuku) ||
        person2.wuku.rekomendasi_pasangan.includes(person1.wuku.nama_wuku);

    return {
        person1,
        person2,
        totalUrip,
        kategori,
        percentage: isRecommended ? Math.min(percentage + 10, 100) : percentage,
        mod16Result,
        combinedTotalUrip,
        matchConclusion,
        marriageCycles
    };
}

/**
 * Find matching dates in a given year for a person
 * Returns dates that have good compatibility (Sri, Dana, or Laba)
 */
export function findMatchingDates(birthDate: Date, year: number, limit: number = 30): MatchingDate[] {
    const person = getBalineseDate(birthDate);
    const matches: MatchingDate[] = [];

    // Start from January 1st of the given year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const currentDate = new Date(startDate);

    while (currentDate <= endDate && matches.length < limit) {
        const candidateDate = getBalineseDate(currentDate);
        const totalUrip = person.totalUrip + candidateDate.totalUrip;
        const kategori = getKategoriJodoh(totalUrip);

        // Only include good matches (Sri, Dana, Laba)
        if (['Sri', 'Dana', 'Laba'].includes(kategori.kategori)) {
            const isRecommended = person.wuku.rekomendasi_pasangan.includes(candidateDate.wuku.nama_wuku);
            const basePercentage = calculatePercentage(kategori);

            matches.push({
                date: new Date(currentDate),
                balineseDate: candidateDate,
                kategori,
                percentage: isRecommended ? Math.min(basePercentage + 10, 100) : basePercentage
            });
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sort by percentage descending
    matches.sort((a, b) => b.percentage - a.percentage);

    return matches;
}

/**
 * Format date to Indonesian locale string
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get color class based on kategori
 */
export function getKategoriColor(kategori: string): string {
    switch (kategori) {
        case 'Sri': return 'text-emerald-500';
        case 'Dana': return 'text-green-500';
        case 'Laba': return 'text-blue-500';
        case 'Sakti': return 'text-amber-500';
        case 'Tiwas': return 'text-red-500';
        default: return 'text-gray-500';
    }
}

/**
 * Get background color class based on kategori
 */
export function getKategoriBgColor(kategori: string): string {
    switch (kategori) {
        case 'Sri': return 'bg-emerald-500';
        case 'Dana': return 'bg-green-500';
        case 'Laba': return 'bg-blue-500';
        case 'Sakti': return 'bg-amber-500';
        case 'Tiwas': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}
