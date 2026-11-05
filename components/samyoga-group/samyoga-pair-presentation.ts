import type { SamyogaCategory, SamyogaGroupPairResult } from "@/lib/samyoga-group";

export const SAMYOGA_PAIR_DYNAMICS_TITLE = "Dinamika Relasi Kelompok";

export const SAMYOGA_PAIR_CATEGORY_NARRATIVES: Readonly<Record<SamyogaCategory, string>> = {
    Utama: "Hubungan ini berada pada kategori Utama menurut perhitungan simbolis Samyoga. Kategori ini bukan jaminan kecocokan atau keberhasilan kerja sama.",
    Madia: "Hubungan ini berada pada kategori Madia menurut perhitungan simbolis Samyoga. Kategori ini tidak mengukur kualitas kerja sama antaranggota secara langsung.",
    Nista: "Hubungan ini berada pada kategori Nista menurut perhitungan simbolis Samyoga. Hasil ini merupakan perhatian dalam interpretasi tradisional, bukan bukti adanya masalah pribadi atau ketidakmampuan bekerja sama.",
};

/** Display existing result fields only; never derive new interpretations. */
export function getSamyogaTraditionalReading(reading: SamyogaGroupPairResult["sodasaRsi"] | null | undefined) {
    const available = (value: unknown): string | null => typeof value === "string" && value.trim() &&
        value.trim().toLowerCase() !== "unknown" ? value : null;
    const label = available(reading?.label), meaning = available(reading?.makna);
    return label || meaning ? { label, meaning } : null;
}


