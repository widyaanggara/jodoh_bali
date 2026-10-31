import { getBalineseDate } from "./balinese-calendar";
import {
    asatawaraData,
    caturwaraData,
    dasawaraData,
    dwiwaraData,
    ekawaraData,
    pancawaraData,
    sadwaraData,
    sangawaraData,
    saptawaraData,
    triwaraData,
} from "./data";
import {
    MAX_SAMYOGA_GROUP_MEMBERS,
    MIN_SAMYOGA_GROUP_MEMBERS,
    parseSamyogaCivilDate,
    SamyogaGroupValidationError,
    validateSamyogaBirthTime,
    type SamyogaGroupMemberInput,
} from "./samyoga-group";

export type SamyogaCalendarIndicatorType =
    | "saptawara"
    | "pancawara"
    | "wuku"
    | "wewaran"
    | "lintang";

export type SamyogaWewaranCycle =
    | "ekawara"
    | "dwiwara"
    | "triwara"
    | "caturwara"
    | "pancawara"
    | "sadwara"
    | "saptawara"
    | "asatawara"
    | "sangawara"
    | "dasawara";

export interface SamyogaCalculatedIndicator {
    indicatorType: SamyogaCalendarIndicatorType;
    wewaranCycle: SamyogaWewaranCycle | null;
    value: string;
    urip: number | null;
}

export interface SamyogaCalendarMasterInterpretation {
    indicatorType: SamyogaCalendarIndicatorType;
    wewaranCycle: SamyogaWewaranCycle | null;
    indicatorValue: string;
    masterRecordId: string;
    sourceField: string;
    text: string;
}

export interface SamyogaMemberCalendarSnapshot {
    memberId: string;
    birthDate: string;
    birthTime: string;
    baliDayBoundaryApplied: boolean;
    calculatedIndicators: SamyogaCalculatedIndicator[];
    masterInterpretations: SamyogaCalendarMasterInterpretation[];
}

interface WewaranMasterRecord {
    id: number;
    nama: string;
    urip: number;
    karakter: string;
}

const WEWARAN_MASTER: Partial<Record<SamyogaWewaranCycle, readonly WewaranMasterRecord[]>> = {
    ekawara: ekawaraData,
    dwiwara: dwiwaraData,
    triwara: triwaraData,
    caturwara: caturwaraData,
    pancawara: pancawaraData,
    saptawara: saptawaraData.map((record) => ({
        id: record.id,
        nama: record.hari.split("/")[0],
        urip: record.urip,
        karakter: record.karakter,
    })),
    asatawara: asatawaraData,
    sangawara: sangawaraData,
    dasawara: dasawaraData,
};

function addInterpretation(
    target: SamyogaCalendarMasterInterpretation[],
    interpretation: SamyogaCalendarMasterInterpretation,
): void {
    if (interpretation.text.trim().length > 0) target.push(interpretation);
}

function validateSnapshotMembers(
    members: readonly SamyogaGroupMemberInput[],
): Array<SamyogaGroupMemberInput & { civilDate: Date }> {
    if (!Array.isArray(members)) {
        throw new SamyogaGroupValidationError(
            "INVALID_GROUP_INPUT",
            "Input snapshot kalender harus berupa daftar anggota.",
        );
    }
    if (
        members.length < MIN_SAMYOGA_GROUP_MEMBERS ||
        members.length > MAX_SAMYOGA_GROUP_MEMBERS
    ) {
        throw new SamyogaGroupValidationError(
            "GROUP_SIZE_OUT_OF_RANGE",
            `Snapshot kalender membutuhkan ${MIN_SAMYOGA_GROUP_MEMBERS}-${MAX_SAMYOGA_GROUP_MEMBERS} anggota.`,
            { value: members.length },
        );
    }

    const memberIds = new Set<string>();
    return members.map((member, memberIndex) => {
        if (
            !member ||
            typeof member.id !== "string" ||
            member.id.length === 0 ||
            member.id !== member.id.trim()
        ) {
            throw new SamyogaGroupValidationError(
                "INVALID_MEMBER_ID",
                "ID anggota snapshot harus berupa string non-kosong tanpa spasi di awal atau akhir.",
                { memberIndex, field: "id", value: member?.id },
            );
        }
        if (memberIds.has(member.id)) {
            throw new SamyogaGroupValidationError(
                "DUPLICATE_MEMBER_ID",
                `ID anggota snapshot harus unik: ${member.id}.`,
                { memberId: member.id, memberIndex, field: "id", value: member.id },
            );
        }
        memberIds.add(member.id);

        const context = { memberId: member.id, memberIndex };
        if (typeof member.birthDate !== "string" || member.birthDate.length !== 10) {
            throw new SamyogaGroupValidationError(
                "INVALID_BIRTH_DATE",
                "Tanggal lahir snapshot harus berupa string YYYY-MM-DD.",
                { ...context, field: "birthDate", value: member.birthDate },
            );
        }
        if (typeof member.birthTime !== "string" || member.birthTime.length !== 5) {
            throw new SamyogaGroupValidationError(
                "INVALID_BIRTH_TIME",
                "Jam lahir snapshot harus berupa string HH:mm.",
                { ...context, field: "birthTime", value: member.birthTime },
            );
        }
        return {
            ...member,
            civilDate: parseSamyogaCivilDate(member.birthDate, context),
            birthTime: validateSamyogaBirthTime(member.birthTime, context),
        };
    });
}

function createMemberSnapshot(
    member: SamyogaGroupMemberInput & { civilDate: Date },
): SamyogaMemberCalendarSnapshot {
    const balineseDate = getBalineseDate(member.civilDate, member.birthTime);
    const calculatedIndicators: SamyogaCalculatedIndicator[] = [
        {
            indicatorType: "saptawara",
            wewaranCycle: null,
            value: balineseDate.saptawara.hari.split("/")[0],
            urip: balineseDate.saptawara.urip,
        },
        {
            indicatorType: "pancawara",
            wewaranCycle: null,
            value: balineseDate.pancawara.nama,
            urip: balineseDate.pancawara.urip,
        },
        {
            indicatorType: "wuku",
            wewaranCycle: null,
            value: balineseDate.wuku.nama_wuku,
            urip: null,
        },
    ];
    const masterInterpretations: SamyogaCalendarMasterInterpretation[] = [];

    addInterpretation(masterInterpretations, {
        indicatorType: "saptawara",
        wewaranCycle: null,
        indicatorValue: balineseDate.saptawara.hari.split("/")[0],
        masterRecordId: `saptawara:${balineseDate.saptawara.id}`,
        sourceField: "sifat",
        text: balineseDate.saptawara.sifat,
    });
    addInterpretation(masterInterpretations, {
        indicatorType: "saptawara",
        wewaranCycle: null,
        indicatorValue: balineseDate.saptawara.hari.split("/")[0],
        masterRecordId: `saptawara:${balineseDate.saptawara.id}`,
        sourceField: "karakter",
        text: balineseDate.saptawara.karakter,
    });
    addInterpretation(masterInterpretations, {
        indicatorType: "pancawara",
        wewaranCycle: null,
        indicatorValue: balineseDate.pancawara.nama,
        masterRecordId: `pancawara:${balineseDate.pancawara.id}`,
        sourceField: "karakter",
        text: balineseDate.pancawara.karakter,
    });
    for (const [sourceField, text] of Object.entries({
        deskripsi: balineseDate.wuku.deskripsi,
        sifat_umum: balineseDate.wuku.sifat_umum,
        kelebihan: balineseDate.wuku.kelebihan,
        kelemahan: balineseDate.wuku.kelemahan,
    })) {
        addInterpretation(masterInterpretations, {
            indicatorType: "wuku",
            wewaranCycle: null,
            indicatorValue: balineseDate.wuku.nama_wuku,
            masterRecordId: `wuku:${balineseDate.wuku.id_wuku}`,
            sourceField,
            text,
        });
    }

    if (balineseDate.wewaran) {
        const wewaranValues: Record<SamyogaWewaranCycle, string> = {
            ekawara: balineseDate.wewaran.ekawara,
            dwiwara: balineseDate.wewaran.dwiwara,
            triwara: balineseDate.wewaran.triwara,
            caturwara: balineseDate.wewaran.caturwara,
            pancawara: balineseDate.wewaran.pancawara,
            sadwara: balineseDate.wewaran.sadwara,
            saptawara: balineseDate.wewaran.saptawara,
            asatawara: balineseDate.wewaran.asatawara,
            sangawara: balineseDate.wewaran.sangawara,
            dasawara: balineseDate.wewaran.dasawara,
        };

        for (const [cycle, value] of Object.entries(wewaranValues) as Array<[
            SamyogaWewaranCycle,
            string,
        ]>) {
            const ordinaryRecord = WEWARAN_MASTER[cycle]?.find((record) => record.nama === value);
            const sadwaraRecord = cycle === "sadwara"
                ? sadwaraData.find((record) => record.nama === value)
                : undefined;
            calculatedIndicators.push({
                indicatorType: "wewaran",
                wewaranCycle: cycle,
                value,
                urip: ordinaryRecord?.urip ?? sadwaraRecord?.urip ?? null,
            });

            if (ordinaryRecord) {
                addInterpretation(masterInterpretations, {
                    indicatorType: "wewaran",
                    wewaranCycle: cycle,
                    indicatorValue: value,
                    masterRecordId: `wewaran:${cycle}:${ordinaryRecord.id}`,
                    sourceField: "karakter",
                    text: ordinaryRecord.karakter,
                });
            }
            if (sadwaraRecord) {
                for (const [sourceField, text] of Object.entries({
                    arti: sadwaraRecord.arti,
                    sifat: sadwaraRecord.sifat,
                    pesan: sadwaraRecord.pesan,
                })) {
                    addInterpretation(masterInterpretations, {
                        indicatorType: "wewaran",
                        wewaranCycle: cycle,
                        indicatorValue: value,
                        masterRecordId: `wewaran:${cycle}:${sadwaraRecord.id}`,
                        sourceField,
                        text,
                    });
                }
            }
        }
    }

    if (balineseDate.lintang) {
        calculatedIndicators.push({
            indicatorType: "lintang",
            wewaranCycle: null,
            value: balineseDate.lintang.lintang,
            urip: null,
        });
        const masterRecordId = `lintang:${balineseDate.lintang.saptawara}:${balineseDate.lintang.pancawara}`;
        for (const [sourceField, text] of Object.entries({
            label: balineseDate.lintang.label,
            makna: balineseDate.lintang.makna,
            penjelasan: balineseDate.lintang.penjelasan,
        })) {
            addInterpretation(masterInterpretations, {
                indicatorType: "lintang",
                wewaranCycle: null,
                indicatorValue: balineseDate.lintang.lintang,
                masterRecordId,
                sourceField,
                text,
            });
        }
    }

    return {
        memberId: member.id,
        birthDate: member.birthDate,
        birthTime: member.birthTime,
        baliDayBoundaryApplied: Number(member.birthTime.slice(0, 2)) < 6,
        calculatedIndicators,
        masterInterpretations,
    };
}

export function createSamyogaGroupCalendarSnapshots(
    members: readonly SamyogaGroupMemberInput[],
): SamyogaMemberCalendarSnapshot[] {
    return validateSnapshotMembers(members).map(createMemberSnapshot);
}
