
import { BalineseDate, SodasaRsi } from "./types";
import { getBalineseDate } from "./balinese-calendar";
import { dataSodasaRsi } from "./data";

export interface LeadershipSynergyResult {
    person1: BalineseDate;
    person2: BalineseDate;
    combinedUrip: number;
    modulo16: number;
    modulo5: number; // Added
    sodasaRsi: SodasaRsi;
    hybridStatus: string; // Added
    synergyTier: {
        tier: string;
        status: string;
        analisis: string;
        rekomendasi: string;
    };
}

/**
 * Calculate leadership synergy between two people based on their birth dates
 * Logic: (Total Urip A + Total Urip B) % 16 and % 5
 */
export function calculateLeadershipSynergy(
    date1: Date,
    time1: string,
    date2: Date,
    time2: string
): LeadershipSynergyResult {
    const person1 = getBalineseDate(date1, time1);
    const person2 = getBalineseDate(date2, time2);

    const combinedUrip = person1.totalUrip + person2.totalUrip;

    // Logika Mod 16
    let modulo16 = combinedUrip % 16;
    if (modulo16 === 0) modulo16 = 16;

    // Logika Mod 5 (Aspek Rezeki)
    let modulo5 = combinedUrip % 5;
    if (modulo5 === 0) modulo5 = 5;

    const m5_map: Record<number, { label: string, desc: string }> = {
        1: { label: "Sri", desc: "Mulia, Murah Rezeki" },
        2: { label: "Dana", desc: "Kaya, Materi Berlimpah" },
        3: { label: "Laba", desc: "Selalu Beruntung, Berhasil" },
        4: { label: "Tiwas", desc: "Kekurangan, Sulit Rezeki" },
        5: { label: "Jaya", desc: "Menang, Berwibawa" }
    };

    // Ambil data Sodasa (Mod 16)
    const sodasaRsi = dataSodasaRsi.find(item => item.sisa === modulo16) || {
        sisa: modulo16,
        label: "Unknown",
        makna: "Unknown",
        penjelasan: "Data tidak ditemukan"
    };

    // Penentuan Status Hybrid (Sesuai diskusi faktorial)
    let hybridStatus = "Madia";
    if (modulo5 === 4 || [2, 3, 6, 8, 14, 15].includes(modulo16)) {
        hybridStatus = "Nista";
    } else if ([1, 2, 3, 5].includes(modulo5) && [5, 10, 11, 12, 16].includes(modulo16)) {
        hybridStatus = "Utama";
    }

    return {
        person1,
        person2,
        combinedUrip,
        modulo16,
        modulo5,
        sodasaRsi,
        hybridStatus,
        synergyTier: {
            tier: hybridStatus,
            status: hybridStatus === "Utama" ? "Sangat Baik" : hybridStatus === "Madia" ? "Cukup Baik" : "Perlu Perhatian",
            analisis: `Wadah ${m5_map[modulo5].label} dengan sifat ${sodasaRsi.makna}`,
            rekomendasi: hybridStatus === "Nista" ? "Disarankan matur piuning/mewayuh" : "Pertahankan keharmonisan"
        }
    };
}
