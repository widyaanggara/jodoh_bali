# Samyoga Group release candidate

Audit date: 9 November 2026 (WITA).

- Main baseline: `869472e8b87bee1d62ed0a853c8caca21910202b` (includes the released Netra Hasta UI).
- Source checkpoint: `b0d66e7e563a981eed7099c737bbda76c518da14`, branch `feat/samyoga-group`.
- Integration branch: `feat/samyoga-group-release`.
- Route: `/pawongan-sinergi/kelompok`, linked from the existing pair page.

## Scope and behavior

Three to six members generate all 3/6/10/15 unique pairs using the existing `calculateLeadershipSynergy` function. Results remain categorical: Utama, Madia, Nista. No numerical group score, leader ranking, or new cultural formula is introduced. The original master data, anchor, pair engine, and calendar engine are unchanged.

The UI provides optional display names, validated civil dates and HH:mm times, stable internal IDs, analysis splash, category distribution, pair details, original Lintang text, concise evidence-based role explanations, and a reset to three blank date/name rows. Birth time retains the existing default 12:00 and is required; it is not an inferred birth time.

Positions are the existing publicly enabled **experimental symbolic interpretation**. Management, operational, communication and collaboration contributions may be shown. A symbolic chair candidate requires a matched leadership profile AND `2 * Utama > memberCount - 1`. UNKNOWN Otonan comparison never selects a chair or deputy. No deputy/coordinator assignment is supported. Master excerpts matching internal data are not proof of cultural provenance or scientific validity.

## Source approvals and research boundary

Production evidence and role-rule registries remain empty. The experimental UI does not grant approval to another evaluator. All 36 mappings retain their existing provenance/domain/product statuses. Source review responses remain pending; no expert endorsement has been created.

Historical chair/deputy prototypes, baseline experimental evaluators, internal-only UI gate, old Palintangan wrappers, research reports and simulation exports stay in the source worktree. Two files whose names include experiment (`samyoga-position-experiment-rules.ts` and `SamyogaGroupPositionExperiment.tsx`) are required by the already-enabled feature; they are not a new activation of the historical prototypes.

The source audit and provenance archive remains available at the immutable checkpoint:
https://github.com/widyaanggara/jodoh_bali/tree/b0d66e7e563a981eed7099c737bbda76c518da14/docs

## Calendar and business-rule evidence

Independently dated references used by the release regression tests:

- Pagerwesi, 12 February 2025, Buda Kliwon Sinta: https://disdagperinkopukm.bulelengkab.go.id/informasi/detail/infografis/38_rahajeng-rahina-pagerwesi
- Galungan, 23 April and 19 November 2025: https://content.bmkg.go.id/wp-content/uploads/Almanak_2025_web1.pdf
- Galungan's Buda Kliwon Dungulan designation: https://kemenag.go.id/hindu/galungan-merawat-spirit-memenangkan-dharma-setiap-hari-soNsN

These references confirm selected calendar cases, not every Wewaran value, the 06:00 policy, the Samyoga hybrid matrix, or role mapping. The 06:00 rule and category matrix are preserved project contracts.

Known existing ambiguity: pair total 30 yields Mod5=5 and Mod16=14, category Nista, although the Mod16 master label is Kebahagiaan. This is explicitly tested, not silently changed. Domain review must determine whether this deliberate hybrid override is appropriate.

The group parser accepts valid four-digit civil years including 0000 and future dates. A birth-date range/future-date policy is not implemented; obtain an explicit product decision before changing this behavior. The raw pair engine still throws on Invalid Date and accepts invalid time strings; the group validator protects its callers. These are existing behaviors, not repaired in this release.

## Integration and deployment

The only change outside group UI is the existing source civil-date adapter in Ramalan Otonan, to avoid UTC-string parsing shifting the date in America/Los_Angeles. Its formulas and original Lintang output are preserved. It imports the group parser; any future extraction to a neutral module is a separate refactor.

Keep main's package-lock, pinned Next/Firebase versions, MediaPipe dependency, worker build scripts, Docker/Compose, rules, session/auth/history, and Netra Hasta code. The package.json change only adds `test:samyoga` and includes the shared Otonan tests in that script.

No API, database, rules, dependency, environment variable, Firebase deployment, migration, or data backfill is required. Group calculation does not upload or persist names or birth dates. Existing application authentication/history remains unchanged.

Run `npm run test:samyoga`, `node --test tests/*.test.mjs`, TypeScript, delta ESLint, and `npm run build`. Run the same regressions in Asia/Makassar and America/Los_Angeles. Explicit browser smoke runner: `node tests/fixtures/samyoga-position-browser-smoke.mjs production`. Screenshots are opt-in under ignored coverage.

Do not publish as validated role assignment or empirical compatibility. A PR review and operator approval remain required before commit, push, merge, or deployment. Physical camera/HTTPS production and live-account history have not been retested merely by passing local group tests.

## Validation of the selective release candidate

Executed locally on 9 November 2026: 176/176 combined runtime/release tests and 92/92 Samyoga/Otonan tests passed. All 176 also passed explicitly in Asia/Makassar and America/Los_Angeles. TypeScript, delta ESLint and production build passed.

Production browser tests passed eight Samyoga flows at 320/390/1440 px, nine Netra UI checks, fourteen synthetic camera/lifecycle checks, fifteen Auth/Firestore Emulator checks and assisted Rekha editor regression. Cross-UID reads/deletes and anonymous protected-detail/history API access were denied. Synthetic-only testing made no production data changes.

The original source suite passed 310/310; a complete 93-path source/main compatibility snapshot passed 394/394. The smaller release intentionally retains only the tests and modules needed for its production scope. Historical research tests remain in source.

Main's 88 protected runtime/deployment/engine/rules/assets files checked identical. No dependency or lockfile changed. The final candidate has 38 changed paths, zero staged files and no new commit. Recharts' existing Otonan width/height warning remains. Docker CLI is unavailable; physical camera, live production Firebase and Komodo HTTPS acceptance are not claimed.
