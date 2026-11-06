# Netra Hasta R7 — local MVP verification

Date: 7 November 2026 (WITA). Branch feat/netra-hasta-web, HEAD 8d154cb.
Decision: READY FOR LOCAL DEMO. Public deployment remains HOLD for the existing
dependency advisories and legacy public-read activity logs described below.

## What works
- Firebase Authentication Email/Password: signup, login, wrong-password handling,
  server-verified identity, logout. No password database or second auth provider.
- Public birth input, camera and basic result remain available without login.
- /netra-hasta/detail, /netra-hasta/riwayat and saved-result pages require a genuine
  Firebase ID token verified by the server. A visitor session ID is not authentication.
- Login within the same tab preserves the memory-only scan summary. Raw camera buffers
  are cleared on leaving the scan component. Refresh/backgrounding can require a rescan;
  this is explained and saved history remains accessible.
- Consent-based save, list/pagination, reopen and deletion of user-owned history.
- Detail uses the unchanged Otonan engine/master text plus available candidate status.
  Heart/Head/Life/Fate remain unsupported by the browser classifier. No Rekha forecast
  or new cultural interpretation was added.

## Provider and server security
Project: daily-logs-a1442 (display name Daily Logs). Default Firestore database.
Initial Auth probes returned CONFIGURATION_NOT_FOUND. After the owner enabled Auth,
configuration returned 200 and real Email/Password tests succeeded.

The Firebase web SDK handles passwords and uses in-memory Auth persistence.
A Firebase ID token is sent to the same-origin session endpoint; server verification
uses the official Firebase accounts:lookup service, with project/issuer/subject/expiry,
disabled-account and validSince revocation checks. Decoding a JWT alone never authorizes.
No service-account key is required for this design.

The server sets a host-only HttpOnly, SameSite=Strict cookie; Secure in production,
bounded by the ID token expiry (at most one hour). Mutations require a same-origin
Origin header and JSON body. Session/personal API responses are private/no-store.
Logout clears the application cookie and browser Auth state. It is a local logout,
not global revocation of every Firebase token/device; issued Firebase tokens have
their normal expiry. Expired sessions require login again.

Official references:
- https://firebase.google.com/docs/reference/rest/auth
- https://firebase.google.com/docs/firestore/use-rest-api
Firestore REST receives the verified user's Firebase ID token, not an Admin token,
so deployed Firestore security rules continue to apply.

## Storage and rules
Path: netraHastaUsers/{verifiedUid}/results/{uuid}.
The API does not accept an owner UID supplied by the client. Records are immutable;
editing means creating a new result, not updating an existing record.

Persisted allowlist: schemaVersion, ownerUid, birthDate, birthTime, saptawara,
pancawara, wuku, lintang, rekhaStatus, rekhaSource, rekhaClasses, algorithmVersion,
calendarVersion, consentVersion, savedAt. Calendar labels are recomputed on the server.
savedAt is a Firestore REQUEST_TIME transform. Inputs require validated civil date,
HH:mm, an allowed candidate status, accepted consent and the exact notice version.
JSON request size is limited; unexpected fields, pictures, coordinates and owner
overrides are rejected. No raw frame, PNG, ROI, landmarks, fingerprint or template
is saved.

Retention: until the owner deletes the record, as disclosed next to an unchecked
consent checkbox. There is no automatic save and no claim of an automatic TTL policy.
Reading old records verifies owner, schema, supported method versions and field allowlist.

The owner supplied the existing rules. firebase/firestore.rules merges them with
the new owner-only block; firebase/netra-hasta.rules.fragment is the scoped block.
Rules were not deployed by the agent. Live tests against the actual project confirmed
owner create/read/delete, anonymous denial, cross-UID GET/PATCH/DELETE denial, and
immutable updates. Local .env.local enables history for this verified project using
only NETRA_HISTORY_ENABLED=true and NETRA_HISTORY_RULES_PROJECT=daily-logs-a1442.
That local file contains no credentials and is ignored by Git.

IMPORTANT EXISTING RISK: the supplied daily_logs policy still permits public reads,
including birth-date fields from legacy features. It was preserved to avoid changing
other features. Netra Hasta R7 never calls the legacy logActivity/saveToDatabase path.
Review legacy logging/analytics consent and public access before an internet release.

## Real test evidence
43 deterministic Node tests passed: 16 account/security tests and 27 prior
product/render/runtime tests. Includes timezone, 05:59/06:00, leap day,
normal/manual quality gates, golden dark-ridge output, stale-result protection,
payload limits, ownership, readback validation and cleanup.

Production build, TypeScript and targeted ESLint passed.
Live Firebase Auth/Firestore integration: 15 checks passed on the real project.
- Temporary synthetic accounts were created, authenticated and deleted.
- Wrong password and forged JWT signatures were rejected.
- Anonymous detail redirected; verified detail returned 200.
- Cross-origin session mutation returned 403.
- Real Firestore owner create succeeded; cross-UID read/update/delete returned 403.
- Real API save/read/delete succeeded; another user received 404 for foreign record IDs.
- Forged owner fields and missing consent returned 400.
- Browser login failure/success, HttpOnly cookie, synthetic result handoff, explicit
  consent, real save/reopen/delete and logout passed.
- Responsive detail at 320/390/1440, no runtime exceptions.
- Network inspection found zero image/landmark uploads, zero credential deliveries
  outside Firebase, and zero birth-data deliveries outside the consent-save endpoint.
- Every synthetic record and account created by the test harness was cleaned up.

The browser handoff fixture was metadata-only and synthetic; it is not evidence of
palm inference. Actual physical camera checks were separate:
- Agent: ACER HD User Facing webcam permission/stream worked; application stream
  1280x720 played; reset stopped all tracks and emptied date/time. No photos saved.
- Owner reported PASS for hand detection, capture, basic result, camera auto-stop,
  retake and reset. This physical acceptance is owner-reported.
- Physical mobile hardware was not tested; browser viewport checks are not that claim.

## Existing publication blockers
npm audit --omit=dev reported 13 vulnerable dependency entries: 3 critical, 6 high,
2 moderate, 2 low, including the installed Next.js dependency. These were already
in the repository; no dependency versions were changed or audit-fix applied.
This local demo sign-off is not a production security sign-off. Resolve/review
dependency advisories and the legacy daily_logs public-read policy before public
deployment. Add infrastructure rate limiting and review session/global-revocation
requirements for a wider production rollout.

## Run and repeat
The current local production demo is at http://localhost:3027/netra-hasta.
To start later from this worktree: npm.cmd run dev (default localhost:3000).
.env.local keeps the reviewed local history setting active. No deployment settings
or Docker ports were changed.

Deterministic tests:
node --test tests/netra-hasta-account.test.mjs tests/netra-hasta-product.test.mjs tests/netra-hasta-product-render.test.mjs tests/netra-hasta-runtime.test.mjs

Explicit live tests (creates/deletes synthetic test accounts and records):
Set METEMU_RUN_FIREBASE_LIVE_TESTS=1 and METEMU_LIVE_BASE_URL to the local app URL,
then run node scripts/test-netra-account-live.mjs --database.
Add --browser only when the isolated CDP test browser on port 9327 is running.
No real user email, password or birth input is required by the test harness.

No commit, push, merge or automatic deploy was performed. Samyoga, calendar/master,
AI worktree, models, webcam algorithms, package versions and Docker are unchanged.
A byte-identical R6 backup was made before R7 under the OS temporary directory:
metemu-r6-before-r7-hf4cg7io. No work was discarded.

## Final Git state
3 tracked modified, 36 untracked, 0 staged (combined R6 + R7), HEAD 8d154cb.
.env.local is ignored. No package/lockfile, calendar/master/Samyoga, camera hooks,
worker algorithm, AI worktree or Docker changes. The isolated test browser was
closed; the localhost demo server remains available on port 3027.

## Checkpoint R6 + R7 (7 November 2026)

This document records R7 verification; NETRA_HASTA_R6.md is the historical R6
snapshot, whose account-availability statements were superseded by R7.

The final checkpoint also includes the owner's subsequent optional-birth-time change:
- Empty birth time is accepted and preserved as unknown; no replacement time is invented.
- The calendar adapter uses the supplied civil date without the before-06:00 adjustment
  when time is unknown. Basic, detail and saved-result views disclose this uncertainty.
- Local merged rules and fragment both permit an empty birthTime string. Publication
  of this optional-time rules revision has not been reconfirmed in this checkpoint audit.
- Unknown-time behavior is covered by three additional tests. Current deterministic
  suite: 46 passed; TypeScript passed again during checkpoint preparation.
- Auth/Firestore integration and production-build results above were retained from
  the preceding implementation work. No live account/database mutations, deployment,
  camera capture or production rebuild were performed for staging.

Checkpoint review found all 39 changed files in the R6/R7 allowlist, resolved local
imports, identical public Firebase web configuration values to HEAD, and matching
scoped/merged Netra Hasta rules. No embedded private key, service-account credential
or real bearer/session token was found. Tests contain explicit synthetic fixtures;
the live-test script generates temporary credentials at execution time and requires
an explicit opt-in. It is source code, not a stored test artifact.

.env.local, node_modules, .next, coverage and temporary screenshots/reports remain
outside the checkpoint. A different checkout needs its own reviewed non-secret
history enablement settings; they are not implicitly activated by this checkpoint.
Existing dependency advisories and legacy daily_logs public-read risk remain open.
This checkpoint is for preserving local implementation, not production approval.
