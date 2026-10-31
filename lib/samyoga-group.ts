import {
    calculateLeadershipSynergy,
    type LeadershipSynergyResult,
} from "./synergy-logic";

export const MIN_SAMYOGA_GROUP_MEMBERS = 3;
export const MAX_SAMYOGA_GROUP_MEMBERS = 6;

export type SamyogaCategory = "Utama" | "Madia" | "Nista";

export type SamyogaGroupValidationCode =
    | "INVALID_GROUP_INPUT"
    | "GROUP_SIZE_OUT_OF_RANGE"
    | "INVALID_MEMBER_ID"
    | "DUPLICATE_MEMBER_ID"
    | "INVALID_BIRTH_DATE"
    | "INVALID_BIRTH_TIME"
    | "UNSUPPORTED_PAIR_CATEGORY";

export interface SamyogaGroupValidationContext {
    memberId?: string;
    memberIndex?: number;
    field?: "id" | "birthDate" | "birthTime";
    value?: unknown;
}

export class SamyogaGroupValidationError extends Error {
    readonly code: SamyogaGroupValidationCode;
    readonly context: SamyogaGroupValidationContext;

    constructor(
        code: SamyogaGroupValidationCode,
        message: string,
        context: SamyogaGroupValidationContext = {},
    ) {
        super(message);
        this.name = "SamyogaGroupValidationError";
        this.code = code;
        this.context = context;
    }
}

export interface SamyogaGroupMemberInput {
    id: string;
    birthDate: string;
    birthTime: string;
}

export interface SamyogaCategoryCounts {
    Utama: number;
    Madia: number;
    Nista: number;
}

export interface SamyogaGroupPairResult {
    pairKey: string;
    memberAId: string;
    memberBId: string;
    category: SamyogaCategory;
    combinedUrip: number;
    modulo5: number;
    modulo16: number;
    sodasaRsi: {
        sisa: number;
        label: string;
        makna: string;
    };
    symbolicAttention: boolean;
    symbolicAttentionNote: string | null;
}

export interface SamyogaGroupMemberSummary {
    memberId: string;
    pairCount: number;
    categoryCounts: SamyogaCategoryCounts;
    symbolicAttentionPairKeys: string[];
}

export interface SamyogaGroupResult {
    memberCount: number;
    pairCount: number;
    pairs: SamyogaGroupPairResult[];
    categoryCounts: SamyogaCategoryCounts;
    memberSummaries: SamyogaGroupMemberSummary[];
    symbolicAttentionPairKeys: string[];
    interpretationScope: "traditional-symbolic";
}

const CIVIL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const BIRTH_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const SYMBOLIC_ATTENTION_NOTE =
    "Kandidat perhatian simbolis berdasarkan kategori tradisional Samyoga; bukan kegagalan interpersonal.";

function emptyCategoryCounts(): SamyogaCategoryCounts {
    return { Utama: 0, Madia: 0, Nista: 0 };
}

function compareIdentifiers(left: string, right: string): number {
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
}

/**
 * Parses a calendar date as local civil components instead of parsing an ISO
 * date string as a UTC instant. Noon is used to match the existing calendar
 * engine's normalization and to avoid accidental date shifts across timezones.
 */
export function parseSamyogaCivilDate(
    value: string,
    context: SamyogaGroupValidationContext = {},
): Date {
    const match = CIVIL_DATE_PATTERN.exec(value);
    if (!match) {
        throw new SamyogaGroupValidationError(
            "INVALID_BIRTH_DATE",
            "Tanggal lahir harus menggunakan format YYYY-MM-DD yang valid.",
            { ...context, field: "birthDate", value },
        );
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(0);
    date.setHours(12, 0, 0, 0);
    date.setFullYear(year, month - 1, day);

    if (
        !Number.isFinite(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        throw new SamyogaGroupValidationError(
            "INVALID_BIRTH_DATE",
            "Tanggal lahir tidak membentuk tanggal kalender yang valid.",
            { ...context, field: "birthDate", value },
        );
    }

    return date;
}

export function validateSamyogaBirthTime(
    value: string,
    context: SamyogaGroupValidationContext = {},
): string {
    if (!BIRTH_TIME_PATTERN.test(value)) {
        throw new SamyogaGroupValidationError(
            "INVALID_BIRTH_TIME",
            "Jam lahir harus menggunakan format HH:mm dalam rentang 00:00–23:59.",
            { ...context, field: "birthTime", value },
        );
    }
    return value;
}

export function createCanonicalSamyogaPairKey(leftId: string, rightId: string): string {
    const identifiers = [leftId, rightId].sort(compareIdentifiers);
    return JSON.stringify(identifiers);
}

function categoryFromPair(result: LeadershipSynergyResult): SamyogaCategory {
    if (
        result.hybridStatus === "Utama" ||
        result.hybridStatus === "Madia" ||
        result.hybridStatus === "Nista"
    ) {
        return result.hybridStatus;
    }
    throw new SamyogaGroupValidationError(
        "UNSUPPORTED_PAIR_CATEGORY",
        `Engine Samyoga pasangan mengembalikan kategori yang tidak didukung: ${result.hybridStatus}.`,
    );
}

function validateMembers(
    members: readonly SamyogaGroupMemberInput[],
): Array<SamyogaGroupMemberInput & { civilDate: Date }> {
    if (!Array.isArray(members)) {
        throw new SamyogaGroupValidationError(
            "INVALID_GROUP_INPUT",
            "Input kelompok harus berupa daftar anggota.",
        );
    }
    if (
        members.length < MIN_SAMYOGA_GROUP_MEMBERS ||
        members.length > MAX_SAMYOGA_GROUP_MEMBERS
    ) {
        throw new SamyogaGroupValidationError(
            "GROUP_SIZE_OUT_OF_RANGE",
            `Kelompok Samyoga harus berisi ${MIN_SAMYOGA_GROUP_MEMBERS}–${MAX_SAMYOGA_GROUP_MEMBERS} anggota.`,
            { value: members.length },
        );
    }

    const identifiers = new Set<string>();
    return members.map((member, memberIndex) => {
        if (
            !member ||
            typeof member.id !== "string" ||
            member.id.length === 0 ||
            member.id !== member.id.trim()
        ) {
            throw new SamyogaGroupValidationError(
                "INVALID_MEMBER_ID",
                "ID anggota harus berupa string non-kosong tanpa spasi di awal atau akhir.",
                { memberIndex, field: "id", value: member?.id },
            );
        }
        if (identifiers.has(member.id)) {
            throw new SamyogaGroupValidationError(
                "DUPLICATE_MEMBER_ID",
                `ID anggota harus unik: ${member.id}.`,
                { memberId: member.id, memberIndex, field: "id", value: member.id },
            );
        }
        identifiers.add(member.id);

        if (typeof member.birthDate !== "string") {
            throw new SamyogaGroupValidationError(
                "INVALID_BIRTH_DATE",
                "Tanggal lahir harus menggunakan format YYYY-MM-DD yang valid.",
                { memberId: member.id, memberIndex, field: "birthDate", value: member.birthDate },
            );
        }
        if (typeof member.birthTime !== "string") {
            throw new SamyogaGroupValidationError(
                "INVALID_BIRTH_TIME",
                "Jam lahir harus menggunakan format HH:mm dalam rentang 00:00–23:59.",
                { memberId: member.id, memberIndex, field: "birthTime", value: member.birthTime },
            );
        }

        const context = { memberId: member.id, memberIndex };
        return {
            ...member,
            civilDate: parseSamyogaCivilDate(member.birthDate, context),
            birthTime: validateSamyogaBirthTime(member.birthTime, context),
        };
    });
}

export function calculateSamyogaGroup(
    members: readonly SamyogaGroupMemberInput[],
): SamyogaGroupResult {
    const validatedMembers = validateMembers(members);
    const pairs: SamyogaGroupPairResult[] = [];

    for (let leftIndex = 0; leftIndex < validatedMembers.length - 1; leftIndex += 1) {
        for (
            let rightIndex = leftIndex + 1;
            rightIndex < validatedMembers.length;
            rightIndex += 1
        ) {
            const inputLeft = validatedMembers[leftIndex];
            const inputRight = validatedMembers[rightIndex];
            const [memberA, memberB] = compareIdentifiers(inputLeft.id, inputRight.id) <= 0
                ? [inputLeft, inputRight]
                : [inputRight, inputLeft];
            const traditionalResult = calculateLeadershipSynergy(
                memberA.civilDate,
                memberA.birthTime,
                memberB.civilDate,
                memberB.birthTime,
            );
            const category = categoryFromPair(traditionalResult);
            const pairKey = createCanonicalSamyogaPairKey(memberA.id, memberB.id);
            const symbolicAttention = category === "Nista";

            pairs.push({
                pairKey,
                memberAId: memberA.id,
                memberBId: memberB.id,
                category,
                combinedUrip: traditionalResult.combinedUrip,
                modulo5: traditionalResult.modulo5,
                modulo16: traditionalResult.modulo16,
                sodasaRsi: {
                    sisa: traditionalResult.sodasaRsi.sisa,
                    label: traditionalResult.sodasaRsi.label,
                    makna: traditionalResult.sodasaRsi.makna,
                },
                symbolicAttention,
                symbolicAttentionNote: symbolicAttention ? SYMBOLIC_ATTENTION_NOTE : null,
            });
        }
    }

    pairs.sort((left, right) => compareIdentifiers(left.pairKey, right.pairKey));
    const categoryCounts = emptyCategoryCounts();
    const summaryByMember = new Map<string, SamyogaGroupMemberSummary>();
    validatedMembers.forEach(({ id }) => {
        summaryByMember.set(id, {
            memberId: id,
            pairCount: 0,
            categoryCounts: emptyCategoryCounts(),
            symbolicAttentionPairKeys: [],
        });
    });

    pairs.forEach((pair) => {
        categoryCounts[pair.category] += 1;
        [pair.memberAId, pair.memberBId].forEach((memberId) => {
            const summary = summaryByMember.get(memberId);
            if (!summary) return;
            summary.pairCount += 1;
            summary.categoryCounts[pair.category] += 1;
            if (pair.symbolicAttention) {
                summary.symbolicAttentionPairKeys.push(pair.pairKey);
            }
        });
    });

    const memberSummaries = [...summaryByMember.values()].sort((left, right) =>
        compareIdentifiers(left.memberId, right.memberId)
    );
    const symbolicAttentionPairKeys = pairs
        .filter((pair) => pair.symbolicAttention)
        .map((pair) => pair.pairKey);

    return {
        memberCount: validatedMembers.length,
        pairCount: pairs.length,
        pairs,
        categoryCounts,
        memberSummaries,
        symbolicAttentionPairKeys,
        interpretationScope: "traditional-symbolic",
    };
}
