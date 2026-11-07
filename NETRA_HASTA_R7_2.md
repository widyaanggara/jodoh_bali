# Netra Hasta R7.2 — Otonan lengkap dan top-3 Mencari Jodoh

Status: READY FOR LOCAL DEMO. Worktree jodoh_bali_web, branch feat/netra-hasta-web.
Starting HEAD: b7aced52154cb7857e2877bcfaa05df5fcb1b08b (owner's R6/R7 checkpoint).
Working tree was clean at start; no existing staging was replaced.

## Audit and implemented categories
Existing app/ramalan-otonan/page.tsx presents birth identity; Saptawara,
Pancawara, Wuku, nextOtonan; Lintang name/label/makna/penjelasan; Zodiac name,
element, lucky day/color/numbers and character; and Pal Sri Sedana cycle chart
plus current-age/period/value/source label/description/interpretation.
All these categories now appear in the reusable NetraDetailSections component.
Additional engine outputs (Urip, Wewaran, Sadwara, Wuku descriptive fields)
are available under a disclosure. Source texts and master data are not rewritten.

Calendar data: getBalineseDate, unmodified. Zodiac: getZodiak, unmodified.
Pal: getPalSriSedanaData, getCurrentPeriodAnalysis and getLabelRezeki, unmodified.
The 18 displayed cycle periods use the same master cycle as the existing chart;
the new chart/table is presentation only, with source labels and a keyboard-accessible
table. Original chart/component and page are untouched.
Unknown birth time is retained and explains that the before-06:00 adjustment
cannot be confirmed. Numeric local civil Date construction and 05:59/06:00 behavior
remain intact. No new calendar or match formula is present in the adapter.

## Top three: actual engine order
findIdealMatches in lib/jodoh-logic.ts scans years/dates ascending, retains
hybridScore >=95, and returns insertion order. The existing ResultsList maps
this order directly; optional month filtering does not introduce score sorting.
Its existing 40/60 compatibility formula is reused only via the function call,
never copied into Netra Hasta and never confused with Samyoga's engine.

R7.2 calls the unchanged findIdealMatches once per applied birth/range and uses
slice(0,3), without sorting, random dates or a new scoring system.
These are candidate partner BIRTH dates, not marriage dates or ranked people.
The parameter form uses the existing current-year through current-year+5 defaults,
all months; developers/users can enter the same years as the standalone feature.
The adapter limits a request to 1900-2100 and 11 years at a time to bound browser/server
work; this limits a request, not the engine ranking. Fewer than three results are
reported at their real count.

Fixture birth 2005-07-27 06:00, range 2000-2005:
1. 2000-02-07, existing hybrid score 95.
2. 2000-02-16, existing hybrid score 95.
3. 2000-02-25, existing hybrid score 95.
All dates, scores, categories and ordering match direct existing engine calls.
For 05:59 the first results differ (as they should); tests compare the same time/range.

Legacy standalone pages currently parse dates with new Date(dateString).
R7.2 preserves the validated civil-date adapter from R6/R7, avoiding that browser
timezone pitfall. Equivalence is tested at the engine boundary with identical civil
inputs. Neither standalone page nor their algorithms were modified.

## Honest Rekha results
The existing browser dark-ridge-v1 produces unlabelled crease candidates or abstains.
Its metadata summary is shown, with four explicit unsupported semantic classes.
No Heart/Head/Life user classification is claimed as validated; Fate also remains
unsupported by the separate research model. No manual line is presented as automatic.
No AI branch, webcam runtime, model or biological interpretation is integrated.

## Snapshot and backward compatibility
New detail saves send birth/time plus validated matchStartYear/matchEndYear.
Clients cannot supply ownerUid or a prebuilt detailSnapshot.
The authenticated server computes calendar/master/matches, encodes the full bounded
detail snapshot, and writes netra-history-v2 with a detailSnapshot string <=48000 bytes.
The snapshot includes exact search range, top three, source method versions,
calculation timestamp, next Otonan, zodiac and Pal age/period. Server save time
is authoritative for clock-dependent values; the save panel explicitly says it
freezes the result when saving rather than claiming an earlier display timestamp.
No image, ROI, landmark, fingerprint or candidate coordinates are added.

Reads validate UID, field allowlist, engine version, input identity, bounded snapshot
and agreement of stable master/top-three results with the supported engine.
Stored time-dependent nextOtonan and Pal period are retained rather than silently
recomputed for v2. A tampered score or source/master output is rejected.
The existing calendar/jodoh/Pal module revisions remain pinned to the unchanged
8d154cb runtime files; incompatible snapshots are rejected rather than reinterpreted.

v1 remains accepted and readable/deletable, with unchanged legacy request contract.
v1 did not store the match range or time-dependent detailed result. Its page explicitly
labels detail as a fresh calculation using today's defaults, not a reconstruction
of historical top-three results. No data backfill, silent historical claims or mass
migration was performed.

Both local rules files preserve owner-only access, immutable updates, explicit
consent and REQUEST_TIME. The owner confirmed publishing the new rules; the agent
did not deploy them. Real Firestore tests subsequently confirmed v1 and v2 CRUD.
Retention remains until owner deletion. The existing legacy daily_logs policy
and R7 dependency/publication risks are unchanged.

## Verification actually run
- 59 deterministic Node tests passed (46 existing +13 R7.2).
- Otonan/zodiac/Pal source equivalence, exact top-three engine equivalence,
  invalid input/ranges, leap date, 05:59/06:00, unknown time, timezone Makassar/UTC/LA,
  snapshot roundtrip, unsupported/tampered payload rejection, legacy v1 reading,
  server auth boundaries and existing runtime golden output covered.
- TypeScript, targeted ESLint with zero warnings, production build and git diff --check passed.
- Actual Firebase daily-logs-a1442 v2/API/browser test: 17 checks passed.
  Signup/login failure/success, forged token/signature rejection, private detail,
  CSRF denial, UID isolation, exact v2 snapshot readback, consent/save/reopen/delete,
  top-three range UI, logout; all synthetic records/accounts cleaned up.
- Separate actual legacy v1 regression against the same instance: 10 checks passed,
  including owner CRUD and cross-UID denial; fixtures cleaned up.
- Browser viewport 320/390/1440: no horizontal overflow; no rendering exceptions.
  Network test: zero image uploads, zero credential leakage outside Firebase,
  zero birth input leakage outside the explicit save endpoint.
- The browser handoff uses a clearly marked synthetic metadata fixture, not palm inference.
  No new physical camera or physical mobile acceptance is claimed for R7.2.
- Screenshots are explicit synthetic test outputs under ignored coverage/r7.2:
  detail-320.png, detail-390.png, detail-1440.png. External icon styles were blocked
  by the test browser to avoid remote delays; existing site icons may show ligature
  text in these test captures. The site icon/dependency system is unchanged.

## Changed files
New: lib/netra-hasta/detail-result.ts; components/netra-hasta/NetraDetailSections.tsx;
tests/netra-hasta-detail.test.mjs; NETRA_HASTA_R7_2.md.
Modified: components/netra-hasta/NetraHastaDetailView.tsx; NetraSavePanel.tsx;
app/netra-hasta/riwayat/[id]/page.tsx; lib/netra-hasta/product-flow.ts;
history.ts; history.server.ts; firebase/firestore.rules; firebase/netra-hasta.rules.fragment;
scripts/test-netra-account-live.mjs.

No changes to calendar/master, matching algorithm, Samyoga, AI, homepage, dependencies,
Auth provider/session implementation or Docker. R6/R7 remain preserved in b7aced5.
No commit, push, branch switch, automatic deployment or staging was performed.
Local demo remains http://localhost:3027/netra-hasta; sign in, then open detail.
All R7.2 changes are unstaged for review.
