import {
    calculateSamyogaGroup,
    parseSamyogaCivilDate,
    SamyogaGroupValidationError,
    validateSamyogaBirthTime,
    type SamyogaGroupMemberInput,
    type SamyogaGroupResult,
} from "./samyoga-group";

export interface SamyogaGroupDraftMember extends SamyogaGroupMemberInput {
    displayName: string;
}

export type SamyogaGroupDraftField = "displayName" | "birthDate" | "birthTime";

export interface SamyogaGroupFormErrors {
    form: string | null;
    fields: Record<string, Partial<Record<SamyogaGroupDraftField, string>>>;
}

export interface SamyogaGroupFormState {
    members: SamyogaGroupDraftMember[];
    result: SamyogaGroupResult | null;
    errors: SamyogaGroupFormErrors;
}

export type SamyogaGroupFormAction =
    | { type: "add-member"; member: SamyogaGroupDraftMember }
    | { type: "remove-member"; memberId: string }
    | {
        type: "update-member";
        memberId: string;
        field: SamyogaGroupDraftField;
        value: string;
    }
    | { type: "analysis-succeeded"; result: SamyogaGroupResult }
    | { type: "analysis-failed"; errors: SamyogaGroupFormErrors }
    | { type: "reset-form" };

export type SamyogaGroupAnalysisOutcome =
    | { ok: true; result: SamyogaGroupResult }
    | { ok: false; errors: SamyogaGroupFormErrors };

export const EMPTY_SAMYOGA_GROUP_FORM_ERRORS: SamyogaGroupFormErrors = {
    form: null,
    fields: {},
};

export function createSamyogaGroupDraftMember(
    id: string,
    displayName = "",
): SamyogaGroupDraftMember {
    return {
        id,
        displayName,
        birthDate: "",
        birthTime: "12:00",
    };
}

export function createInitialSamyogaGroupFormState(): SamyogaGroupFormState {
    return {
        members: [
            createSamyogaGroupDraftMember("member-1"),
            createSamyogaGroupDraftMember("member-2"),
            createSamyogaGroupDraftMember("member-3"),
        ],
        result: null,
        errors: EMPTY_SAMYOGA_GROUP_FORM_ERRORS,
    };
}

function clearAnalysis(): Pick<SamyogaGroupFormState, "result" | "errors"> {
    return {
        result: null,
        errors: EMPTY_SAMYOGA_GROUP_FORM_ERRORS,
    };
}

export function reduceSamyogaGroupFormState(
    state: SamyogaGroupFormState,
    action: SamyogaGroupFormAction,
): SamyogaGroupFormState {
    switch (action.type) {
        case "add-member":
            if (state.members.length >= 6) return state;
            return {
                ...state,
                members: [...state.members, action.member],
                ...clearAnalysis(),
            };
        case "remove-member":
            if (state.members.length <= 3) return state;
            return {
                ...state,
                members: state.members.filter((member) => member.id !== action.memberId),
                ...clearAnalysis(),
            };
        case "update-member":
            return {
                ...state,
                members: state.members.map((member) =>
                    member.id === action.memberId
                        ? { ...member, [action.field]: action.value }
                        : member
                ),
                ...clearAnalysis(),
            };
        case "analysis-succeeded":
            return {
                ...state,
                result: action.result,
                errors: EMPTY_SAMYOGA_GROUP_FORM_ERRORS,
            };
        case "analysis-failed":
            return {
                ...state,
                result: null,
                errors: action.errors,
            };
        case "reset-form":
            return createInitialSamyogaGroupFormState();
    }
}

function appendFieldError(
    errors: SamyogaGroupFormErrors,
    memberId: string,
    field: SamyogaGroupDraftField,
    message: string,
): void {
    errors.fields[memberId] = {
        ...errors.fields[memberId],
        [field]: message,
    };
}

export function validateSamyogaGroupDraft(
    members: readonly SamyogaGroupDraftMember[],
): SamyogaGroupFormErrors {
    const errors: SamyogaGroupFormErrors = { form: null, fields: {} };
    members.forEach((member, memberIndex) => {
        try {
            parseSamyogaCivilDate(member.birthDate, { memberId: member.id, memberIndex });
        } catch (error) {
            appendFieldError(
                errors,
                member.id,
                "birthDate",
                error instanceof Error ? error.message : "Tanggal lahir tidak valid.",
            );
        }
        try {
            validateSamyogaBirthTime(member.birthTime, { memberId: member.id, memberIndex });
        } catch (error) {
            appendFieldError(
                errors,
                member.id,
                "birthTime",
                error instanceof Error ? error.message : "Jam lahir tidak valid.",
            );
        }
    });
    return errors;
}

export function isSamyogaGroupDraftReady(
    members: readonly SamyogaGroupDraftMember[],
): boolean {
    if (members.length < 3 || members.length > 6) return false;
    return Object.keys(validateSamyogaGroupDraft(members).fields).length === 0;
}

export function analyzeSamyogaGroupDraft(
    members: readonly SamyogaGroupDraftMember[],
): SamyogaGroupAnalysisOutcome {
    const fieldValidation = validateSamyogaGroupDraft(members);
    if (Object.keys(fieldValidation.fields).length > 0) {
        return { ok: false, errors: fieldValidation };
    }

    try {
        const result = calculateSamyogaGroup(members.map(({ id, birthDate, birthTime }) => ({
            id,
            birthDate,
            birthTime,
        })));
        return { ok: true, result };
    } catch (error) {
        if (error instanceof SamyogaGroupValidationError) {
            const errors: SamyogaGroupFormErrors = {
                form: error.message,
                fields: {},
            };
            if (
                error.context.memberId &&
                (error.context.field === "birthDate" || error.context.field === "birthTime")
            ) {
                appendFieldError(
                    errors,
                    error.context.memberId,
                    error.context.field,
                    error.message,
                );
            }
            return { ok: false, errors };
        }
        return {
            ok: false,
            errors: {
                form: "Analisis kelompok tidak dapat dijalankan. Periksa kembali seluruh input.",
                fields: {},
            },
        };
    }
}

export function getSamyogaMemberDisplayName(
    members: readonly SamyogaGroupDraftMember[],
    memberId: string,
): string {
    const index = members.findIndex((member) => member.id === memberId);
    if (index < 0) return "Anggota";
    return members[index].displayName.trim() || `Anggota ${index + 1}`;
}
