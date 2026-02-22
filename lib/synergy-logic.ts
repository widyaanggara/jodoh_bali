
import { BalineseDate, SodasaRsi } from "./types";
import { getBalineseDate } from "./balinese-calendar";
import { dataSodasaRsi } from "./data";

export interface LeadershipSynergyResult {
    person1: BalineseDate;
    person2: BalineseDate;
    combinedUrip: number;
    modulo16: number;
    sodasaRsi: SodasaRsi;
    synergyTier: {
        tier: string;
        status: string;
        analisis: string;
        rekomendasi: string;
    };
}

/**
 * Calculate leadership synergy between two people based on their birth dates
 * Logic: (Total Urip A + Total Urip B) % 16
 * If result is 0, use 16
 */
export function calculateLeadershipSynergy(
    date1: Date,
    time1: string,
    date2: Date,
    time2: string
): LeadershipSynergyResult {
    const person1 = getBalineseDate(date1, time1);
    const person2 = getBalineseDate(date2, time2);

    // Calculate Combined Urip (Using Total Urip from BalineseDate which is usually Sapta + Panca)
    // However, for Sodasa Rsi we usually need Sapta + Panca + Sadwara.
    // Let's verify standard conventions.
    // The user prompt says: "Hitung total Urip gabungan (Urip A + Urip B), lalu lakukan operasi Modulo 16."
    // It doesn't explicitly say which Urip (Sapta+Panca or Sapta+Panca+Sadwara).
    // Usually "Urip" refers to Sapta+Panca.
    // But Sodasa Rsi typically involves Sadwara as per `lib/balinese-calendar.ts` line 95: `totalUripSodasaRsi = totalUrip + sadwara.urip`.
    // Given the context of "Sodasa Rsi" (16), it strongly implies using the 16-based Urip summation if we were following strict Wariga.
    // BUT the prompt is specific: "Urip A + Urip B".
    // Let's check `lib/balinese-calendar.ts` again. `totalUrip` there is Sapta+Panca.
    // I will use `totalUrip` (Sapta+Panca) as it's the standard "Urip".
    // If the user meant the Sodasa Rsi specific Urip, they usually say "Neptu".
    // Wait, let's look at `lib/balinese-calendar.ts`:
    // `const totalUripSodasaRsi = totalUrip + sadwara.urip; // Mod 16: Saptawara + Pancawara + Sadwara`
    // The user's prompt: "Hitung total Urip gabungan (Urip A + Urip B), lalu lakukan operasi Modulo 16."
    // And "Gunakan data master ISodasaRsi".
    // If I use simple Urip (Sapta+Panca), the max value for one person is 18 (9+9). Max combined is 36.
    // If I use Sodasa Urip (Sapta+Panca+Sadwara), max is 18+9 = 27. Max combined is 54.
    // I will use `totalUrip` (Sapta+Panca) as the default interpretation of "Urip" unless specified otherwise.
    // Most general comparisons use the standard 5/7 urip.

    const combinedUrip = person1.totalUrip + person2.totalUrip;
    let modulo16 = combinedUrip % 16;

    // "Jika hasilnya 0, maka gunakan angka 16."
    if (modulo16 === 0) {
        modulo16 = 16;
    }

    // Get Sodasa Rsi meaning from master data
    // Note: dataSodasaRsi in data.ts has entries for sisa 1-16.
    const sodasaRsi = dataSodasaRsi.find(item => item.sisa === modulo16) || {
        sisa: modulo16,
        label: "Unknown",
        makna: "-",
        penjelasan: "-"
    };

    // Get Leadership Synergy Tier
    const synergyTier = getLeadershipSynergy(modulo16);

    return {
        person1,
        person2,
        combinedUrip,
        modulo16,
        sodasaRsi,
        synergyTier
    };
}

/**
 * Determine leadership synergy tier based on remainder (sisa)
 */
export const getLeadershipSynergy = (sisa: number) => {
    switch (sisa) {
        case 10: case 11: case 12: case 13:
            return {
                tier: "Tier 1",
                status: "Integrasi Strategis Tinggi (Emas)",
                analisis: "Komposisi SDM dengan tingkat integrasi strategis dan stabilitas output yang sangat tinggi. Sangat direkomendasikan untuk posisi eksekutif kepemimpinan ganda atau pejabat publik utama.",
                rekomendasi: "Sangat Direkomendasikan untuk kemitraan jangka panjang dan proyek berskala makro."
            };
        case 5: case 14: case 16:
            return {
                tier: "Tier 2",
                status: "Integrasi Operasional Stabil (Positif)",
                analisis: "Interaksi antar komponen SDM menunjukkan efektivitas kerja yang stabil, lancar, dan minim friksi struktural. Kemitraan ini menghasilkan kenyamanan operasional yang konsisten.",
                rekomendasi: "Sangat ideal untuk kolaborasi berbasis proyek manajerial maupun tim strategis."
            };
        case 1: case 7:
            return {
                tier: "Tier 3",
                status: "Integrasi Bertahap (Proses)",
                analisis: "Kemitraan yang mensyaratkan adaptasi dan resiliensi sistemik tingkat tinggi. Puncak efektivitas kerja baru dapat dicapai setelah fase konsolidasi dan penyelesaian hambatan bersama.",
                rekomendasi: "Membutuhkan komitmen manajerial jangka panjang dan prosedur komunikasi yang sangat jelas."
            };
        case 2: case 3: case 4:
            return {
                tier: "Tier 4",
                status: "Integrasi Terbatas (Spesifik)",
                analisis: "Proyeksi efektivitas kerja mengindikasikan perlunya manajemen risiko ketat. Kemitraan ini memunculkan tantangan unik terkait alokasi sumber daya dan regenerasi struktural.",
                rekomendasi: "Wajib dilakukan evaluasi komprehensif pada klausul kontrak dan demarkasi kewenangan."
            };
        case 6: case 8: case 9: case 15:
            return {
                tier: "Tier 5",
                status: "Peringatan Mitigasi (Risiko)",
                analisis: "Indeks integrasi strategis bernilai rendah dan menunjukkan potensi friksi internal maupun hambatan eksternal yang signifikan terhadap tata kelola organisasi.",
                rekomendasi: "Sangat direkomendasikan melakukan reviu struktural, mitigasi risiko proaktif, dan rekonsiliasi emosional (melukat) sebelum inisiasi program strategis."
            };
        default:
            return {
                tier: "N/A",
                status: "Tidak Terdefinisi",
                analisis: "-",
                rekomendasi: "-"
            };
    }
};
