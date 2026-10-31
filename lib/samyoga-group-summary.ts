import {
    MAX_SAMYOGA_GROUP_MEMBERS,
    MIN_SAMYOGA_GROUP_MEMBERS,
    type SamyogaCategory,
    type SamyogaCategoryCounts,
    type SamyogaGroupResult,
} from "./samyoga-group";

export interface SamyogaGroupNetworkNode {
    index: number;
    x: number;
    y: number;
}

export interface SamyogaGroupNetworkConnection {
    from: number;
    to: number;
    perimeter: boolean;
}

export interface SamyogaGroupNetworkGeometry {
    nodes: SamyogaGroupNetworkNode[];
    connections: SamyogaGroupNetworkConnection[];
}

function roundCoordinate(value: number): number {
    return Math.round(value * 1000) / 1000;
}

/**
 * Membentuk simbol jaringan dari jumlah anggota. Setiap node mewakili satu
 * anggota dan setiap garis mewakili satu pasangan unik, tanpa menyatakan skor.
 */
export function createSamyogaGroupNetworkGeometry(
    memberCount: number,
): SamyogaGroupNetworkGeometry {
    if (
        !Number.isInteger(memberCount) ||
        memberCount < MIN_SAMYOGA_GROUP_MEMBERS ||
        memberCount > MAX_SAMYOGA_GROUP_MEMBERS
    ) {
        throw new RangeError(
            `Simbol kelompok hanya mendukung ${MIN_SAMYOGA_GROUP_MEMBERS}-${MAX_SAMYOGA_GROUP_MEMBERS} anggota.`,
        );
    }

    const centerX = 120;
    const centerY = 100;
    const radius = 76;
    const nodes = Array.from({ length: memberCount }, (_, index) => {
        const angle = -Math.PI / 2 + (index * 2 * Math.PI) / memberCount;
        return {
            index,
            x: roundCoordinate(centerX + radius * Math.cos(angle)),
            y: roundCoordinate(centerY + radius * Math.sin(angle)),
        };
    });
    const connections: SamyogaGroupNetworkConnection[] = [];

    for (let from = 0; from < memberCount - 1; from += 1) {
        for (let to = from + 1; to < memberCount; to += 1) {
            connections.push({
                from,
                to,
                perimeter: to === from + 1 || (from === 0 && to === memberCount - 1),
            });
        }
    }

    return { nodes, connections };
}

const CATEGORY_ORDER: readonly SamyogaCategory[] = ["Utama", "Madia", "Nista"];

export const SAMYOGA_PAIR_DETAILS_INITIAL_OPEN = false;

export type SamyogaGroupCompositionLabel =
    | "Dominan Utama"
    | "Dominan Madia"
    | "Dominan Nista"
    | "Komposisi Campuran";

export interface SamyogaGroupPresentationSummary {
    memberCount: number;
    pairCount: number;
    categoryCounts: SamyogaCategoryCounts;
    dominantCategories: SamyogaCategory[];
    hasTie: boolean;
    compositionLabel: SamyogaGroupCompositionLabel;
    compositionExplanation: string;
    overallInterpretation: string;
    symbolicAttentionPairCount: number;
    symbolicAttentionExplanation: string;
}

const GROUP_INTERPRETATIONS: Record<SamyogaGroupCompositionLabel, string> = {
    "Dominan Utama": "Kategori Utama paling banyak muncul dalam hubungan antaranggota kelompok ini. Secara simbolis, komposisi tersebut menggambarkan kecenderungan keselarasan menurut aturan Samyoga yang digunakan Metemu. Kategori lainnya tetap menjadi bagian penting dari hasil keseluruhan.",
    "Dominan Madia": "Kategori Madia paling banyak muncul dalam hubungan antaranggota kelompok ini. Secara simbolis, hasil tersebut menggambarkan kecenderungan komposisi menengah menurut aturan Samyoga yang digunakan Metemu, dengan variasi kategori hubungan yang tetap perlu diperhatikan.",
    "Dominan Nista": "Kategori Nista paling banyak muncul dalam hubungan antaranggota kelompok ini. Dalam interpretasi simbolis Samyoga, komposisi ini menunjukkan lebih banyak hubungan berkategori perhatian. Hasil tersebut tidak berarti kelompok gagal atau anggotanya memiliki sifat buruk.",
    "Komposisi Campuran": "Tidak terdapat satu kategori yang menjadi jumlah terbesar secara tunggal. Kelompok ini memiliki komposisi hasil Samyoga yang beragam, sehingga kesimpulan simbolisnya tidak dapat diwakili oleh satu kategori dominan.",
};

function cloneCategoryCounts(counts: SamyogaCategoryCounts): SamyogaCategoryCounts {
    return {
        Utama: counts.Utama,
        Madia: counts.Madia,
        Nista: counts.Nista,
    };
}

function describeCounts(counts: SamyogaCategoryCounts): string {
    return `${counts.Utama} Utama, ${counts.Madia} Madia, dan ${counts.Nista} Nista`;
}

/**
 * Membentuk aturan presentasi Metemu dari hasil kategorikal G2. Label dominan
 * hanya mendeskripsikan kategori yang paling sering muncul; label ini bukan
 * aturan tradisional Bali baru dan bukan ukuran ilmiah tentang kelompok.
 */
export function summarizeSamyogaGroup(
    result: SamyogaGroupResult,
): SamyogaGroupPresentationSummary {
    const categoryCounts = cloneCategoryCounts(result.categoryCounts);
    const countedPairs = CATEGORY_ORDER.reduce(
        (total, category) => total + categoryCounts[category],
        0,
    );

    if (countedPairs !== result.pairCount || result.pairs.length !== result.pairCount) {
        throw new Error("Jumlah kategori dan rincian pasangan Samyoga tidak konsisten.");
    }

    const maximumCount = Math.max(...CATEGORY_ORDER.map((category) => categoryCounts[category]));
    const dominantCategories = CATEGORY_ORDER.filter(
        (category) => categoryCounts[category] === maximumCount,
    );
    const hasTie = dominantCategories.length !== 1;
    const compositionLabel: SamyogaGroupCompositionLabel = hasTie
        ? "Komposisi Campuran"
        : `Dominan ${dominantCategories[0]}`;
    const countDescription = describeCounts(categoryCounts);
    const compositionExplanation = hasTie
        ? `Tidak ada satu kategori tunggal yang paling banyak. Komposisi ${result.pairCount} pasangan terdiri dari ${countDescription}.`
        : `${dominantCategories[0]} paling sering muncul dalam komposisi ${result.pairCount} pasangan, yang terdiri dari ${countDescription}.`;
    const symbolicAttentionPairCount = categoryCounts.Nista;
    const symbolicAttentionExplanation = symbolicAttentionPairCount === 0
        ? "Tidak ada pasangan berkategori Nista pada komposisi ini."
        : `${symbolicAttentionPairCount} pasangan berkategori Nista ditampilkan sebagai perhatian simbolis, bukan sebagai penilaian negatif terhadap anggota.`;

    return {
        memberCount: result.memberCount,
        pairCount: result.pairCount,
        categoryCounts,
        dominantCategories: [...dominantCategories],
        hasTie,
        compositionLabel,
        compositionExplanation,
        overallInterpretation: GROUP_INTERPRETATIONS[compositionLabel],
        symbolicAttentionPairCount,
        symbolicAttentionExplanation,
    };
}

export function toggleSamyogaPairDetails(currentValue: boolean): boolean {
    return !currentValue;
}
