import {
    EXPERIMENT_POSITION_EVIDENCE as BASELINE_EVIDENCE,
    EXPERIMENT_PROFILE_RULES,
    EXPERIMENT_DIMENSIONS,
    POSITION_EXPERIMENT_DISCLAIMER,
} from "./samyoga-position-experiment-rules";

export { EXPERIMENT_PROFILE_RULES, EXPERIMENT_DIMENSIONS, POSITION_EXPERIMENT_DISCLAIMER };
export type { ExperimentalPositionEvidence, ExperimentalProfileRule } from "./samyoga-position-experiment-rules";
export const POSITION_EXPERIMENT_VERSION = "g6b3r1-palintangan-only-v1";

// Explicit existing catalogue IDs, not automatic activation of the inventory of 35 Lintang.
export const PALINTANGAN_EXPERIMENT_EVIDENCE_IDS: readonly string[] = Object.freeze([
    "C-COMM-03", "C-COMM-04", "C-EXEC-04",
]);
export const EXPERIMENT_POSITION_EVIDENCE = Object.freeze(BASELINE_EVIDENCE.filter((e) =>
    e.indicatorType === "lintang" && PALINTANGAN_EXPERIMENT_EVIDENCE_IDS.includes(e.evidenceId)));

export const PALINTANGAN_PROFILE_COVERAGE = Object.freeze(EXPERIMENT_PROFILE_RULES.map((rule) => {
    const availableDimensions = rule.requiredDimensions.filter((d) =>
        EXPERIMENT_POSITION_EVIDENCE.some((e) => e.dimension === d && e.polarity === "support"));
    const unavailableDimensions = rule.requiredDimensions.filter((d) => !availableDimensions.includes(d));
    return Object.freeze({
        profile: rule.profile, availableDimensions: Object.freeze(availableDimensions),
        unavailableDimensions: Object.freeze(unavailableDimensions),
        canCompleteWithCurrentMappings: unavailableDimensions.length === 0,
    });
}));
