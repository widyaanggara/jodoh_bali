import { getBalineseDate } from './balinese-calendar';
import { wukuData, pancawaraData, saptawaraData } from './data';

// ============================================================
// TYPES
// ============================================================

export interface MasehiMatchResult {
    date: Date;
    formatted: string; // e.g. "Senin, 27 Juli 2005"
}

// ============================================================
// DATA EXPORTS (untuk dropdown di UI)
// ============================================================

/** Daftar nama Saptawara (7 hari) untuk dropdown */
export const saptawaraOptions = saptawaraData.map(s => s.hari.split('/')[0]);

/** Daftar nama Pancawara (5 hari) untuk dropdown */
export const pancawaraOptions = pancawaraData.map(p => p.nama);

/** Daftar nama Wuku (30 wuku) untuk dropdown */
export const wukuOptions = wukuData.map(w => w.nama_wuku);

// ============================================================
// REVERSE LOOKUP: Bali → Masehi
// ============================================================

/**
 * Mencari semua tanggal Masehi dalam rentang tahun tertentu
 * yang memiliki kombinasi Saptawara + Pancawara + Wuku yang cocok.
 * 
 * Catatan: Siklus Wuku = 210 hari, jadi dalam satu tahun (~365 hari)
 * hanya ada sekitar 1-2 tanggal per kombinasi tertentu.
 * 
 * @param saptawaraName Nama Saptawara (e.g. "Redite")
 * @param pancawaraName Nama Pancawara (e.g. "Umanis")
 * @param wukuName      Nama Wuku (e.g. "Sinta")
 * @param startYear     Tahun awal pencarian (default 1945)
 * @param endYear       Tahun akhir pencarian (default 2026)
 * @returns Array tanggal Masehi yang cocok
 */
export function findMasehiDates(
    saptawaraName: string,
    pancawaraName: string,
    wukuName: string,
    startYear: number = 1945,
    endYear: number = 2026
): MasehiMatchResult[] {
    const results: MasehiMatchResult[] = [];

    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    const current = new Date(startDate);

    while (current <= endDate) {
        const baliDate = getBalineseDate(current);

        const saptaMatch = baliDate.saptawara.hari.split('/')[0] === saptawaraName;
        const pancaMatch = baliDate.pancawara.nama === pancawaraName;
        const wukuMatch = baliDate.wuku.nama_wuku === wukuName;

        if (saptaMatch && pancaMatch && wukuMatch) {
            results.push({
                date: new Date(current),
                formatted: current.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            });
        }

        current.setDate(current.getDate() + 1);
    }

    return results;
}
