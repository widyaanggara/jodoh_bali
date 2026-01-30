import { getBalineseDate, findLintang } from './balinese-calendar';
import { BalineseDate, Lintang, Zodiak } from './types';
import { dataZodiak } from './data';

export interface IdealMatch {
    date: Date;
    balineseDate: BalineseDate;
    lintang?: Lintang;
    totalUrip: number;
    sisa: number;
}

/**
 * Find ideal match dates based on Tenung Urip Panca (Modulo 5)
 * Only returns dates that result in sisa 1 (SRI - the best category)
 * 
 * @param userBirthDate - User's birth date
 * @param startYear - Starting year to search
 * @param endYear - Ending year to search (inclusive)
 * @returns Array of ideal match dates with SRI status
 */
export function findIdealMatches(
    userBirthDate: Date,
    startYear: number,
    endYear: number
): IdealMatch[] {
    const userBalinese = getBalineseDate(userBirthDate);
    const userUrip = userBalinese.totalUrip;
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

            // Calculate total urip
            const totalUrip = userUrip + candidateUrip;
            const sisa = totalUrip % 5;

            // Only include if sisa is 1 (SRI category)
            if (sisa === 1) {
                // Get Lintang for this date
                const lintang = findLintang(
                    candidateBalinese.saptawara.hari,
                    candidateBalinese.pancawara.nama
                );

                matches.push({
                    date: new Date(currentDate),
                    balineseDate: candidateBalinese,
                    lintang,
                    totalUrip,
                    sisa
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

