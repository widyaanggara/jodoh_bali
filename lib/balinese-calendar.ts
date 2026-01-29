import { BalineseDate, CompatibilityResult, MatchingDate, KategoriJodoh } from './types';
import { wukuData, pancawaraData, saptawaraData, kategoriJodohData } from './data';

// Reference date for Balinese calendar calculation
// 1 Januari 2000 adalah Redite (Minggu), Umanis, Wuku Sinta
const REFERENCE_DATE = new Date(2000, 0, 1);
const REFERENCE_WUKU_INDEX = 0; // Sinta
const REFERENCE_PANCAWARA_INDEX = 0; // Umanis
const REFERENCE_SAPTAWARA_INDEX = 0; // Redite/Minggu

/**
 * Calculate the number of days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.round((d2.getTime() - d1.getTime()) / oneDay);
}

/**
 * Convert Gregorian date to Balinese calendar date
 */
export function getBalineseDate(date: Date): BalineseDate {
    const days = daysBetween(REFERENCE_DATE, date);

    // Wuku cycles every 210 days (30 wuku × 7 days each)
    const wukuDays = ((days % 210) + 210) % 210;
    const wukuIndex = Math.floor(wukuDays / 7);

    // Pancawara cycles every 5 days
    const pancawaraIndex = ((days % 5) + 5) % 5;

    // Saptawara cycles every 7 days (same as day of week)
    const saptawaraIndex = ((days % 7) + 7) % 7;

    const wuku = wukuData[(REFERENCE_WUKU_INDEX + wukuIndex) % 30];
    const pancawara = pancawaraData[(REFERENCE_PANCAWARA_INDEX + pancawaraIndex) % 5];
    const saptawara = saptawaraData[(REFERENCE_SAPTAWARA_INDEX + saptawaraIndex) % 7];

    // Total urip is sum of pancawara urip and wuku position value
    const totalUrip = pancawara.urip + (wuku.id_wuku % 10);

    return {
        wuku,
        pancawara,
        saptawara,
        totalUrip
    };
}

/**
 * Get kategori jodoh based on total urip sum
 */
function getKategoriJodoh(totalUrip: number): KategoriJodoh {
    const sisa = totalUrip % 5;
    return kategoriJodohData.find(k => k.sisa === sisa) || kategoriJodohData[0];
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

/**
 * Calculate compatibility between two people based on their birth dates
 */
export function calculateCompatibility(date1: Date, date2: Date): CompatibilityResult {
    const person1 = getBalineseDate(date1);
    const person2 = getBalineseDate(date2);

    const totalUrip = person1.totalUrip + person2.totalUrip;
    const kategori = getKategoriJodoh(totalUrip);
    const percentage = calculatePercentage(kategori);

    // Bonus if wuku is recommended partner
    const isRecommended = person1.wuku.rekomendasi_pasangan.includes(person2.wuku.nama_wuku) ||
        person2.wuku.rekomendasi_pasangan.includes(person1.wuku.nama_wuku);

    return {
        person1,
        person2,
        totalUrip,
        kategori,
        percentage: isRecommended ? Math.min(percentage + 10, 100) : percentage
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
