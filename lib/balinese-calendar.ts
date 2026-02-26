import {
    BalineseDate,
    KategoriJodoh,
    SodasaRsi,
    KombinasiTenung,
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
const REFERENCE_WUKU_OFFSET = 3; // 27 July 2005 is Wednesday of Wuku Sinta (Day 4, index 3 if Sunday=0)
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
    // The reference date 27 July 2005 is Paniron (index 3 in sadwaraData)
    return (((days + 3) % 6) + 6) % 6;
}

/**
 * Convert Gregorian date to Balinese calendar date
 * @param date The date to convert
 * @param birthTime Optional birth time in "HH:mm" format. 
 *                  If provided and before 06:00, the Balinese day is considered the previous Gregorian day.
 */
export function getBalineseDate(date: Date, birthTime?: string): BalineseDate {
    // Clone the date to avoid modifying the original
    let adjustedDate = new Date(date.getTime());

    // [NEW] Logic Penyesuaian Waktu Kelahiran (Dina Bali)
    // Berdasarkan Dina Bali, hari berganti saat matahari terbit (pk 06.00).
    // Jika lahir sebelum jam 06.00, maka secara tradisi dianggap masih hari sebelumnya.
    if (birthTime) {
        const [hours, minutes] = birthTime.split(':').map(Number);
        if (hours < 6) {
            adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
    }

    const days = daysBetween(REFERENCE_DATE, adjustedDate);

    // Wuku cycles every 210 days (30 wuku × 7 days each)
    const wukuTotalDays = ((days + REFERENCE_WUKU_OFFSET) % 210 + 210) % 210;
    const wukuIndex = Math.floor(wukuTotalDays / 7);

    // Pancawara cycles every 5 days
    const pancawaraIndex = ((days + REFERENCE_PANCAWARA_OFFSET) % 5 + 5) % 5;

    // Saptawara - use native JavaScript getDay() for accuracy
    const saptawaraIndex = getSaptawaraIndex(adjustedDate);

    // Sadwara - cycles every 6 days
    const sadwaraIndex = getSadwaraIndex(adjustedDate);

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
    const nextOtonan = getNextOtonan(adjustedDate);

    // Calculate Wewaran Lengkap (Ekawara - Dasawara)
    const wewaran = calculateWewaran(wukuTotalDays, wukuIndex, saptawara, pancawara);

    return {
        wuku,
        pancawara,
        saptawara,
        sadwara,
        wewaran,
        totalUrip,
        totalUripSodasaRsi,
        lintang,
        nextOtonan
    };
}

// ============================================================
// Wewaran Lengkap: Ekawara – Dasawara (G-Formula)
// ============================================================

const TRIWARA_MAP = ['Kajeng', 'Pasah', 'Beteng'];
const CATURWARA_MAP = ['Menala', 'Sri', 'Laba', 'Jaya'];
const SADWARA_MAP = ['Maulu', 'Tungleh', 'Aryang', 'Urukung', 'Paniron', 'Was'];
const ASATAWARA_MAP = ['Uma', 'Sri', 'Indra', 'Guru', 'Yama', 'Ludra', 'Brahma', 'Kala'];
const SANGAWARA_MAP = ['Dadi', 'Dangu', 'Jangur', 'Gigis', 'Nohan', 'Ogan', 'Erangan', 'Urungan', 'Tulus'];
const DASAWARA_MAP = ['Pandita', 'Pati', 'Suka', 'Duka', 'Sri', 'Manuh', 'Manusa', 'Raja', 'Dewa', 'Raksasa'];

/**
 * Hitung 10 Wewaran menggunakan rumus G-formula.
 * G = wukuTotalDays + 1 (equivalent to (WukuIndex-1)*7 + SaptawaraIndex, 1-based)
 *
 * Pengecualian Jaya Tiga (Wuku Dungulan):
 *   Redite Dungulan: G += 2
 *   Soma Dungulan:   G += 1
 *
 * Pengalantaka Sangawara:
 *   Hari 0-3 (Redite–Buda Sinta) = 'Dangu'
 */
import type { Saptawara, Pancawara, WewaranLengkap } from './types';

function calculateWewaran(
    wukuTotalDays: number,
    wukuIndex: number,
    saptawara: Saptawara,
    pancawara: Pancawara
): WewaranLengkap {
    const dayInWuku = wukuTotalDays % 7; // 0=Redite .. 6=Saniscara

    // G = wukuTotalDays + 1
    let G = wukuTotalDays + 1;

    // Pengecualian Jaya Tiga: Wuku Dungulan (index 10)
    if (wukuIndex === 10 && dayInWuku === 0) G += 2; // Redite Dungulan
    if (wukuIndex === 10 && dayInWuku === 1) G += 1; // Soma Dungulan

    // JumlahUrip = UripSaptawara + UripPancawara
    const jumlahUrip = saptawara.urip + pancawara.urip;

    // Ekawara: ganjil → Luang, genap → '-'
    const ekawara = jumlahUrip % 2 !== 0 ? 'Luang' : '-';

    // Dwiwara: ganjil → Pepet, genap → Menga
    const dwiwara = jumlahUrip % 2 !== 0 ? 'Pepet' : 'Menga';

    // Triwara, Sadwara: G % n
    const triwara = TRIWARA_MAP[G % 3];
    const sadwaraW = SADWARA_MAP[G % 6];

    // Caturwara, Asatawara, Dasawara from EXACT ARRAYS (by wukuTotalDays index)
    const EXACT_CATURWARA = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 2, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
    const EXACT_ASTAWARA = [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 6, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7];

    const caturIndex = EXACT_CATURWARA[wukuTotalDays];
    const astaIndex = EXACT_ASTAWARA[wukuTotalDays];

    // For Caturwara: 0=Sri, 1=Laba, 2=Jaya, 3=Menala. Our map: ['Menala', 'Sri', 'Laba', 'Jaya']
    // So 0=Sri(1), 1=Laba(2), 2=Jaya(3), 3=Menala(0)
    const CATUR_ID_MAP = [1, 2, 3, 0];
    const caturwara = CATURWARA_MAP[CATUR_ID_MAP[caturIndex]];

    // For Asatawara: 0=Sri .. 7=Uma. Our map: ['Uma', 'Sri', 'Indra', 'Guru', 'Yama', 'Ludra', 'Brahma', 'Kala']
    // So 0=Sri(1), 1=Indra(2), ..., 6=Kala(7), 7=Uma(0)
    const ASTA_ID_MAP = [1, 2, 3, 4, 5, 6, 7, 0];
    const asatawara = ASATAWARA_MAP[ASTA_ID_MAP[astaIndex]];

    // Dasawara mapping replaced with user formula

    // Sangawara: pengalantaka → 4 hari pertama Sinta = 'Dangu'
    let sangawara: string;
    if (wukuTotalDays < 4) {
        sangawara = 'Dangu';
    } else {
        sangawara = SANGAWARA_MAP[((wukuTotalDays - 2) % 9 + 9) % 9];
    }

    // Dasawara: Explicit mapping based on Total Urip (Saptawara + Pancawara) 
    // to match exactly with balinese-date-js-lib distribution
    const dasawaraMapUrip: Record<number, string> = {
        7: 'Raja', 8: 'Dewa', 9: 'Raksasa', 10: 'Pandita',
        11: 'Pati', 12: 'Suka', 13: 'Duka', 14: 'Sri',
        15: 'Manuh', 16: 'Manusa', 17: 'Raja', 18: 'Dewa'
    };
    const dasawara = dasawaraMapUrip[jumlahUrip];

    return {
        ekawara,
        dwiwara,
        triwara,
        caturwara,
        pancawara: pancawara.nama,
        sadwara: sadwaraW,
        saptawara: saptawara.hari.split('/')[0],
        asatawara,
        sangawara,
        dasawara
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
export function getKategoriJodoh(totalUrip: number): KategoriJodoh {
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
    return kategori.score;
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
 * @param date1 Date for person 1
 * @param date2 Date for person 2
 * @param time1 Optional birth time for person 1
 * @param time2 Optional birth time for person 2
 */
export function calculateCompatibility(date1: Date, date2: Date, time1?: string, time2?: string): CompatibilityResult {
    const person1 = getBalineseDate(date1, time1);
    const person2 = getBalineseDate(date2, time2);

    // Mod 5 calculation (original - for Rezeki/Fortune)
    const totalUrip = person1.totalUrip + person2.totalUrip;
    const kategori = getKategoriJodoh(totalUrip);
    const mod5Score = kategori.score;

    // Mod 16 calculation (new - for Karakter & Wibawa) using comprehensive Urip
    const combinedTotalUrip = person1.totalUripSodasaRsi + person2.totalUripSodasaRsi;
    const mod16Result = getSodasaRsi(combinedTotalUrip);
    const mod16Score = mod16Result.score ?? 0;

    // Generate conclusion narrative
    const matchConclusion = generateMatchConclusion(kategori, mod16Result);

    // Calculate Marriage Cycles (using Mod 5 Combined Total Urip: Sapta + Panca)
    const marriageCycles = calculateMarriageCycles(totalUrip);

    // Bonus if wuku is recommended partner
    const isRecommended = person1.wuku.rekomendasi_pasangan.includes(person2.wuku.nama_wuku) ||
        person2.wuku.rekomendasi_pasangan.includes(person1.wuku.nama_wuku);

    // Combination Matrix lookup (Tenung Panca Sodasa)
    const mod16Sisa = mod16Result.sisa === 0 ? 16 : mod16Result.sisa;
    const kombinasi = getKombinasiTenung(kategori, mod16Result, mod5Score, mod16Score);

    // Final percentage = hybrid score + wuku bonus
    const finalPercentage = isRecommended ? Math.min(kombinasi.hybridScore + 10, 100) : kombinasi.hybridScore;

    return {
        person1,
        person2,
        totalUrip,
        kategori,
        percentage: finalPercentage,
        mod16Result,
        combinedTotalUrip,
        kombinasi,
        matchConclusion,
        marriageCycles
    };
}

/**
 * Generate combination result with narrative based on Mod 5 + Mod 16 scores
 * Hybrid Score = (Mod5_Score * 0.4) + (Mod16_Score * 0.6)
 */
function getKombinasiTenung(
    kategori: KategoriJodoh,
    mod16Result: SodasaRsi,
    mod5Score: number,
    mod16Score: number
): KombinasiTenung {
    // Hybrid Score: 40% Mod 5 + 60% Mod 16
    const hybridScore = Math.round((mod5Score * 0.4) + (mod16Score * 0.6));

    // Determine hybrid status based on score
    let hybridStatus: 'Utama' | 'Madia' | 'Nista';
    if (hybridScore >= 70) {
        hybridStatus = 'Utama';
    } else if (hybridScore >= 40) {
        hybridStatus = 'Madia';
    } else {
        hybridStatus = 'Nista';
    }

    const hybridDescMap = {
        'Utama': 'Sangat Baik',
        'Madia': 'Cukup / Seimbang',
        'Nista': 'Perlu Upacara / Pebayuhan'
    };

    // Threshold: score >= 60 = Tinggi, < 60 = Rendah
    const isMod5High = mod5Score >= 60;
    const isMod16High = mod16Score >= 60;

    // Generate narrative with score-based connectors
    const narasi = generateKombinasiNarrative(kategori, mod16Result, isMod5High, isMod16High);

    return {
        mod5Label: kategori.kategori,
        mod16Label: mod16Result.label,
        hybridStatus,
        hybridDesc: hybridDescMap[hybridStatus],
        hybridScore,
        narasi
    };
}

/**
 * Generate narrative with Wisdom Logic connectors based on high/low scores
 */
function generateKombinasiNarrative(
    mod5: KategoriJodoh,
    mod16: SodasaRsi,
    isMod5High: boolean,
    isMod16High: boolean
): string {
    const mod5Desc = mod5.deskripsi || mod5.makna;
    const mod16Desc = mod16.penjelasan || mod16.deskripsi || "";

    if (isMod5High && isMod16High) {
        // Keduanya Tinggi: " yang disempurnakan dengan "
        return `${mod5Desc} (${mod5.kategori}) yang disempurnakan dengan ${mod16Desc.charAt(0).toLowerCase() + mod16Desc.slice(1)} (${mod16.makna}).`;
    }
    if (isMod5High && !isMod16High) {
        // Mod 5 Tinggi, Mod 16 Rendah: ", tetapi perlu diwaspadai..."
        return `${mod5Desc} (${mod5.kategori}), tetapi perlu diwaspadai ${mod16Desc.charAt(0).toLowerCase() + mod16Desc.slice(1)} (${mod16.makna}).`;
    }
    if (!isMod5High && isMod16High) {
        // Mod 5 Rendah, Mod 16 Tinggi: ", namun luar biasanya..."
        return `Kehidupan mungkin diuji dengan ${mod5Desc.charAt(0).toLowerCase() + mod5Desc.slice(1)} (${mod5.kategori}), namun luar biasanya ${mod16Desc.charAt(0).toLowerCase() + mod16Desc.slice(1)} (${mod16.makna}).`;
    }
    // Keduanya Rendah: " serta perlu perjuangan ekstra menghadapi "
    return `${mod5Desc} (${mod5.kategori}) serta perlu perjuangan ekstra menghadapi ${mod16Desc.charAt(0).toLowerCase() + mod16Desc.slice(1)} (${mod16.makna}). Disarankan untuk melakukan upacara Pebayuhan.`;
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
