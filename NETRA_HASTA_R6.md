# Netra Hasta R6 — public product flow

Worktree: jodoh_bali_web; branch feat/netra-hasta-web; baseline 8d154cb.
Status: public flow ready for physical camera acceptance; account/detail access and saving HOLD.

## Implemented
- /netra-hasta: birth civil date + mandatory local birth time, existing camera consent,
  palm capture, basic calendar/candidate result, retake/reset and detail CTA.
- Existing getBalineseDate is called with validated numeric local-noon Date construction,
  never new Date(dateString). Birth times before 06:00 retain the existing previous-day rule.
  Supported birth years start at 1900; future dates are rejected against WITA civil today.
- Product camera stops after successful capture. Retake restarts the existing camera hook.
  ROI, quality thresholds, models, worker algorithm, overlays and Face Tracking are unchanged.
- Calendar master output is reused directly. No new cultural interpretation is generated.
- Versioned CombinedNetraResult carries calendar source/version, baseline ROI method/version,
  metadata-only candidate summary, status/origin per class, and memory-only storage policy.
- Status union reserves automatic_candidate, user_confirmed, user_drawn, uncertain,
  unsupported. R6 does not fabricate user confirmation or drawing: all four semantic classes
  are unsupported by the browser detector, and automatic unlabelled segments are experimental.
- State stays in React memory across internal Netra Hasta routes. Refresh, reset, leaving the
  feature, pagehide or backgrounding the tab discards it. Raw image buffers are owned only by
  the existing camera component and wiped on unmount/retake/reset/stop.
- No dates, results, images, coordinates or fingerprints are placed in route URLs or storage.

## Auth / database audit
- No account AuthProvider, getAuth/onAuthStateChanged, login/register route, server session
  verification, security rules or account-result repository is present in this branch.
- components/SessionProvider.tsx generates anonymous visitor IDs, not authenticated identities.
  Its logActivity writes dates/times through lib/session.ts to daily_logs in Firestore.
- firebase/firebase.js initializes Firestore and global browser Analytics. Root app/layout.tsx
  loads SessionProvider. These existing modules were not changed.
- R6 does not call useSession/logActivity or import a database/analytics module. Browser testing
  with synthetic birth input found no matching birth date/time or image payload in requests.
  This is not a claim that all site analytics/network traffic is disabled. Review existing
  global analytics consent/enhanced measurement before a broader public privacy sign-off.
- getNetraAccountAccess currently returns unavailable unconditionally. It does not trust visitor
  IDs, client flags, query parameters, or cookie presence. /netra-hasta/detail is dynamic and
  redirects on the server to /netra-hasta/akses-detail. The detail view structure exists but
  is never unlocked without a future genuine server-verified account integration.
- There is no second login system, dummy login, save endpoint, database migration or active
  persistence. Missing account support is shown clearly rather than linking to a nonexistent login.

## R7 / R8 boundary
1. Confirm the actual account provider/project and use it consistently. Add login/register plus
   genuine server verification, expiry/revocation/logout and safe fixed return destination.
   Authenticate before loading any private result. Test direct HTTP/RSC access, forged cookies,
   unauthenticated requests, expired sessions and cross-account access.
2. Review deployed Firestore rules; none were supplied in this repository. Never reuse daily_logs
   as an account-results store. Proposed future path: users/{verifiedUid}/netraHastaResults/{id},
   owner-only reads/deletes and server-derived owner identity. Validate a strict payload allowlist.
3. Decide data minimization and approved retention period before enabling writes. Prefer derived
   calendar summary, method versions and limited result metadata; do not persist raw birth input
   unless the approved purpose requires it. Exclude video, PNG/ROI, landmark/polyline coordinates,
   fingerprints and embedding/model biometrics. Do not silently persist the whole in-memory contract.
4. Provide explicit optional consent, notice version, deletion controls and a tested retention
   deletion mechanism. Saving remains disabled until ownership rules, retention and deletion are
   reviewed. Refusing storage must retain the public basic-result experience.
5. Freeze and validate the visual Rekha data/method before introducing semantic Rekha results.
   AI R4/R5 remain research references only and were not imported into the Web runtime.

## Verification
- 27 Node tests pass: 17 product/validation/privacy/gates, 3 rendered-basic-result cases,
  7 existing runtime tests including golden output, stale-result rejection and buffer cleanup.
- Timezone checks: Makassar, UTC, Los Angeles; leap day, pre-anchor, 05:59 and 06:00.
- TypeScript, targeted ESLint and production build pass.
- Actual headless Chrome, development and production: keyboard form validation, valid synthetic
  date/time input, consent-before-camera, handled missing/denied camera, reset, 320/390/1440
  form layouts without overflow, zero rendering exceptions. Basic result layout also checked at
  those widths using the actual component rendered with synthetic metadata.
- HTTP: /netra-hasta 200; /netra-hasta/detail 307 to /netra-hasta/akses-detail, also with forged
  authenticated query/cookies; access-info route 200; /dev/palm-evaluation 404 in production.
- Actual capture/retake/overlay and the auto-stop-after-capture transition require physical camera
  acceptance. The browser test environment had no usable camera; do not call it a camera pass.
- External Google icon/font styles were blocked in the headless test to avoid remote stylesheet
  delays; local build fonts/CSS loaded. Screenshots under OS temporary storage are synthetic only.

## Try locally
Run npm.cmd run dev in this worktree, then open /netra-hasta. Enter date/time, consent to camera,
hold one palm until hard gates pass, capture, inspect the basic result and ROI, retake, and try
Buka Ramalan Detail. It should show the unavailable-account information page. Return internally
to keep the memory-only basic summary; starting a new scan/reset discards it.

Physical checklist: normal capture; sharpness warning/manual capture; hard-gate refusal; camera
stops after capture; retake restarts; overlay coordinates; Face Tracking; detail navigation and
return; reset; hide tab; close page; camera indicator off; no private payload in network requests.
No commit, push, merge, dependency or deployment configuration changes were made.

## Changed files
Modified:
- app/netra-hasta/page.tsx
- components/netra-hasta/NetraHastaClient.tsx

Added:
- app/netra-hasta/layout.tsx
- app/netra-hasta/detail/page.tsx
- app/netra-hasta/akses-detail/page.tsx
- components/netra-hasta/NetraHastaProductProvider.tsx
- components/netra-hasta/NetraHastaFlow.tsx
- components/netra-hasta/NetraHastaBasicResult.tsx
- components/netra-hasta/NetraHastaDetailView.tsx
- lib/netra-hasta/product-flow.ts
- lib/netra-hasta/account-access.server.ts
- tests/helpers/load-netra-typescript.mjs
- tests/netra-hasta-product.test.mjs
- tests/netra-hasta-product-render.test.mjs
- NETRA_HASTA_R6.md

Git checkpoint was not created. Final working tree: 2 modified, 13 untracked, 0 staged.
AI worktree retained its pre-existing 10 untracked R4/R5 files with no edits from R6.
