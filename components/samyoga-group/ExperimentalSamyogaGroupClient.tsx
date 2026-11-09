"use client";

import type { SamyogaGroupDraftMember } from "@/lib/samyoga-group-form";
import type { SamyogaGroupResult } from "@/lib/samyoga-group";
import SamyogaGroupClient from "./SamyogaGroupClient";
import SamyogaGroupCareerResults from "./SamyogaGroupCareerResults";

// Public presentation of the existing experimental evaluator; this grants no evidence approval.
function renderPositions(members: readonly SamyogaGroupDraftMember[], result: SamyogaGroupResult) {
    return <SamyogaGroupCareerResults members={members} result={result} />;
}

export default function ExperimentalSamyogaGroupClient() {
    return <SamyogaGroupClient renderPositions={renderPositions} />;
}
