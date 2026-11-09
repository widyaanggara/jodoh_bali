/** Public shapes only. Career rules and interpretation data stay in the server graph. */
export const CAREER_METHOD_VERSION = "twg-gemet-v1";
export interface CareerMemberInput { id: string; birthDate: string }
export type CareerDayGroup = "Eka" | "Dwi" | "Tri";
export interface CareerReference {
    title: string;
    attribution: string;
    printedPages: number[];
    pdfPages: number[];
}
export interface CareerReading {
    methodVersion: typeof CAREER_METHOD_VERSION;
    status: "interpreted" | "ambiguous";
    day: string;
    dayGroup: CareerDayGroup;
    mangsa: string | null;
    sourceInterval: string;
    professions: string[];
    explicitlyPreferred: string[] | null;
    preferenceNote: string | null;
    explanation: string;
    reference: CareerReference;
}
export interface CareerMemberReading { memberId: string; reading: CareerReading }
export interface CareerGrant { grant: string; groupId: string; verifiedUid: string; expiresAt: number }
export interface CareerResponse {
    groupId: string;
    verifiedUid: string;
    expiresAt: number;
    methodVersion: typeof CAREER_METHOD_VERSION;
    members: CareerMemberReading[];
}
