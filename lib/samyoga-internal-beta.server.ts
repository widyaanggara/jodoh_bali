import "server-only";

/** Historical internal-only gate. The public group page no longer uses this helper. */
export function isSamyogaPositionExperimentEnabled(): boolean {
    return process.env.NODE_ENV === "development" &&
        process.env.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT === "1";
}
