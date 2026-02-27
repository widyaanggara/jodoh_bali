import { getBalineseDate, findLintang, getKategoriJodoh, getSodasaRsi } from './balinese-calendar';
import { BalineseDate, Lintang, Zodiak, KategoriJodoh, SodasaRsi, HybridStatus } from './types';
import { dataZodiak, kategoriJodohData } from './data';

export interface IdealMatch {
    date: Date;
    balineseDate: BalineseDate;
    lintang?: Lintang;
    totalUrip: number;
    sisa: number;
    kategori: KategoriJodoh;
    // Hybrid fields
    totalUripSodasaRsi: number;
    mod5Score: number;
    mod16Score: number;
    hybridScore: number;
    hybridStatus: HybridStatus;
    mod16Result: SodasaRsi;
}

/**
 * Find ideal match dates based on Hybrid Calculation (Mod 5 + Mod 16)
 * Only returns dates where the hybrid score >= 95%
 * 
 * Hybrid Score = (Mod5_Score * 0.4) + (Mod16_Score * 0.6)
 * 
 * @param userBirthDate - User's birth date
 * @param birthTime - User's birth time
 * @param startYear - Starting year to search
 * @param endYear - Ending year to search (inclusive)
 * @returns Array of ideal match dates with hybrid score >= 95%
 */
export function findIdealMatches(
    userBirthDate: Date,
    birthTime: string,
    startYear: number,
    endYear: number
): IdealMatch[] {
    const userBalinese = getBalineseDate(userBirthDate, birthTime);
    const userUrip = userBalinese.totalUrip;
    const userUripSodasaRsi = userBalinese.totalUripSodasaRsi;
    const matches: IdealMatch[] = [];

    // Loop through each year in the range
    for (let year = startYear; year <= endYear; year++) {
        const startDate = new Date(year, 0, 1); // January 1st
        const endDate = new Date(year, 11, 31); // December 31st

        const currentDate = new Date(startDate);

        // Loop through each day in the year
        while (currentDate <= endDate) {
            const candidateBalinese = getBalineseDate(currentDate);
            const candidateUrip = candidateBalinese.totalUrip;
            const candidateUripSodasaRsi = candidateBalinese.totalUripSodasaRsi;

            // Mod 5 calculation
            const totalUrip = userUrip + candidateUrip;
            const sisa = totalUrip % 5;
            const kategori = getKategoriJodoh(totalUrip);
            const mod5Score = kategori.score;

            // Mod 16 calculation
            const combinedSodasaRsi = userUripSodasaRsi + candidateUripSodasaRsi;
            const mod16Result = getSodasaRsi(combinedSodasaRsi);
            const mod16Score = mod16Result.score ?? 0;

            // Hybrid Score: 40% Mod 5 + 60% Mod 16
            const hybridScore = Math.round((mod5Score * 0.4) + (mod16Score * 0.6));

            // Only include if hybrid score >= 95
            if (hybridScore >= 95) {
                // Get Lintang for this date
                const lintang = findLintang(
                    candidateBalinese.saptawara.hari,
                    candidateBalinese.pancawara.nama
                );

                // Determine hybrid status
                let hybridStatus: HybridStatus;
                if (hybridScore >= 70) {
                    hybridStatus = 'Utama';
                } else if (hybridScore >= 40) {
                    hybridStatus = 'Madia';
                } else {
                    hybridStatus = 'Nista';
                }

                matches.push({
                    date: new Date(currentDate),
                    balineseDate: candidateBalinese,
                    lintang,
                    totalUrip,
                    sisa,
                    kategori,
                    totalUripSodasaRsi: combinedSodasaRsi,
                    mod5Score,
                    mod16Score,
                    hybridScore,
                    hybridStatus,
                    mod16Result
                });
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return matches;
}

/**
 * Filter ideal matches by specific month (1-12)
 * @param matches - Array of ideal matches
 * @param month - Month number (1-12)
 * @returns Filtered array of matches
 */
export function filterByMonth(matches: IdealMatch[], month: number): IdealMatch[] {
    return matches.filter(match => match.date.getMonth() + 1 === month);
}

/**
 * Group matches by month for easier display
 * @param matches - Array of ideal matches
 * @returns Object with month numbers as keys and matches as values
 */
export function groupByMonth(matches: IdealMatch[]): Record<number, IdealMatch[]> {
    const grouped: Record<number, IdealMatch[]> = {};

    matches.forEach(match => {
        const month = match.date.getMonth() + 1;
        if (!grouped[month]) {
            grouped[month] = [];
        }
        grouped[month].push(match);
    });

    return grouped;
}

/**
 * Get zodiac sign information based on birth date
 * Handles year transitions correctly for Capricorn (Dec 22 - Jan 19)
 * 
 * @param date - Birth date
 * @returns Zodiak object containing nama, sifat, elemen, angkaHoki, warnaHoki, hariHoki
 */
export function getZodiak(date: Date): Zodiak {
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    // Find the appropriate zodiac sign
    for (let i = 0; i < dataZodiak.length; i++) {
        const currentZodiak = dataZodiak[i];
        const nextZodiak = dataZodiak[(i + 1) % dataZodiak.length];

        // Check if the date falls within this zodiac's range
        if (month === currentZodiak.startMonth && day >= currentZodiak.startDate) {
            return currentZodiak;
        }

        // Special case: check if date is before the next zodiac starts
        // This handles dates in the same month but before transition
        if (month === currentZodiak.startMonth && day < currentZodiak.startDate) {
            // Return previous zodiac
            const prevIndex = i === 0 ? dataZodiak.length - 1 : i - 1;
            return dataZodiak[prevIndex];
        }

        // Handle month transitions (e.g., Capricorn Dec-Jan)
        if (month === nextZodiak.startMonth && day < nextZodiak.startDate) {
            return currentZodiak;
        }
    }

    // Fallback: return the first zodiac if no match found
    return dataZodiak[0];
}
