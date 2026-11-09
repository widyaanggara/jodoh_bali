import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {loadTypeScriptModule as load} from "./samyoga-test-loader.mjs";
const calendar = load("lib/otonan-calendar.ts");
const pair = load("lib/synergy-logic.ts");
// Dates independently cross-checked against published government calendars.
// They validate calendar labels, not the cultural validity of role recommendations.
for (const [date, wuku] of [["2025-02-12", "Sinta"], ["2025-04-23", "Dungulan"], ["2025-11-19", "Dungulan"]]) {
    test(`release calendar reference ${date}`, () => {
        const value = calendar.calculateOtonanCalendar(date, "12:00");
        assert.equal(value.saptawara.hari, "Buda/Rabu");
        assert.equal(value.pancawara.nama, "Kliwon");
        assert.equal(value.wuku.nama_wuku, wuku);
        assert.equal(value.totalUrip, 15);
    });
}
test("release preserves the existing 06:00 civil-day boundary", () => {
    const before = calendar.calculateOtonanCalendar("2025-02-12", "05:59");
    const after = calendar.calculateOtonanCalendar("2025-02-12", "06:00");
    assert.equal(before.saptawara.hari, "Anggara/Selasa");
    assert.equal(before.pancawara.nama, "Wage");
    assert.equal(before.totalUrip, 7);
    assert.equal(after.totalUrip, 15);
});
test("release records existing Mod16=14 behavior without silently correcting cultural rules", () => {
    const value = pair.calculateLeadershipSynergy(
        calendar.parseOtonanCivilDate("2025-02-12"), "12:00",
        calendar.parseOtonanCivilDate("2025-04-23"), "12:00",
    );
    assert.equal(value.combinedUrip, 30);
    assert.equal(value.modulo5, 5);
    assert.equal(value.modulo16, 14);
    assert.equal(value.hybridStatus, "Nista");
    assert.equal(value.sodasaRsi.label, "Kebahagiaan");
});
test("release keeps production evidence and role approval registries empty", () => {
    assert.equal(load("lib/samyoga-position-evidence.ts").SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY.length, 0);
    assert.equal(load("lib/samyoga-position-recommendation.ts").SAMYOGA_PRODUCTION_POSITION_RULES.length, 0);
});
test("release excludes historical role prototypes and old internal-only gate", () => {
    for (const name of ["lib/samyoga-position-experiment.ts", "lib/samyoga-position-experiment-baseline-g6b3.ts", "lib/samyoga-internal-beta.server.ts", "lib/samyoga-palintangan.ts", "lib/samyoga-palintangan-experiment-rules.ts", "tests/fixtures/samyoga-chair-prototype.mjs"]) {
        assert.equal(fs.existsSync(name), false, name);
    }
});
