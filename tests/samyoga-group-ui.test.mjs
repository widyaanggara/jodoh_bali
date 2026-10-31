import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadTypeScriptModule, projectRoot } from "./samyoga-test-loader.mjs";

const form = loadTypeScriptModule("lib/samyoga-group-form.ts");
const group = loadTypeScriptModule("lib/samyoga-group.ts");

function completedMembers(count = 3) {
  return Array.from({ length: count }, (_, index) => ({
    id: `member-${index + 1}`,
    displayName: `Anggota Uji ${index + 1}`,
    birthDate: ["1990-01-15", "1992-07-08", "2000-02-29", "2005-07-27", "1988-12-31", "2012-02-29"][index],
    birthTime: index === 2 ? "05:59" : "12:00",
  }));
}

test("state awal memiliki tiga ID internal stabil dan unik", () => {
  const state = form.createInitialSamyogaGroupFormState();
  assert.equal(state.members.length, 3);
  assert.equal(new Set(state.members.map((member) => member.id)).size, 3);
  assert.deepEqual(state.members.map((member) => member.id), ["member-1", "member-2", "member-3"]);
});

test("tambah hingga enam dan hapus anggota mempertahankan data lainnya", () => {
  let state = { ...form.createInitialSamyogaGroupFormState(), members: completedMembers(3) };
  const firstSnapshot = structuredClone(state.members[0]);
  for (let index = 4; index <= 6; index += 1) {
    state = form.reduceSamyogaGroupFormState(state, {
      type: "add-member",
      member: completedMembers(6)[index - 1],
    });
  }
  assert.equal(state.members.length, 6);
  assert.deepEqual(state.members[0], firstSnapshot);
  const unchangedAtMaximum = form.reduceSamyogaGroupFormState(state, {
    type: "add-member",
    member: form.createSamyogaGroupDraftMember("member-7"),
  });
  assert.equal(unchangedAtMaximum, state);

  state = form.reduceSamyogaGroupFormState(state, { type: "remove-member", memberId: "member-4" });
  assert.equal(state.members.length, 5);
  assert.deepEqual(state.members[0], firstSnapshot);
});

test("hapus anggota berhenti pada minimum tiga", () => {
  const state = { ...form.createInitialSamyogaGroupFormState(), members: completedMembers(3) };
  assert.equal(
    form.reduceSamyogaGroupFormState(state, { type: "remove-member", memberId: "member-1" }),
    state,
  );
});

test("validasi tanggal dan waktu berasal dari validator G2", () => {
  const members = completedMembers(3);
  members[0].birthDate = "2023-02-29";
  members[1].birthTime = "24:00";
  const outcome = form.analyzeSamyogaGroupDraft(members);
  assert.equal(outcome.ok, false);
  assert.match(outcome.errors.fields["member-1"].birthDate, /tanggal/i);
  assert.match(outcome.errors.fields["member-2"].birthTime, /jam lahir/i);
});

test("duplicate ID internal menghasilkan error terstruktur", () => {
  const members = completedMembers(3);
  members[2].id = members[0].id;
  const outcome = form.analyzeSamyogaGroupDraft(members);
  assert.equal(outcome.ok, false);
  assert.match(outcome.errors.form, /unik/i);
});

test("hasil adapter identik dengan pemanggilan publik engine G2", () => {
  const members = completedMembers(6);
  const outcome = form.analyzeSamyogaGroupDraft(members);
  assert.equal(outcome.ok, true);
  const direct = group.calculateSamyogaGroup(
    members.map(({ id, birthDate, birthTime }) => ({ id, birthDate, birthTime })),
  );
  assert.deepEqual(outcome.result, direct);
  assert.equal(outcome.result.pairCount, 15);
  assert.equal(
    Object.values(outcome.result.categoryCounts).reduce((total, value) => total + value, 0),
    15,
  );
});

test("perubahan input setelah analisis menghapus hasil lama", () => {
  const members = completedMembers(3);
  const outcome = form.analyzeSamyogaGroupDraft(members);
  assert.equal(outcome.ok, true);
  let state = {
    members,
    result: outcome.result,
    errors: form.EMPTY_SAMYOGA_GROUP_FORM_ERRORS,
  };
  state = form.reduceSamyogaGroupFormState(state, {
    type: "update-member",
    memberId: "member-1",
    field: "birthTime",
    value: "06:00",
  });
  assert.equal(state.result, null);
  assert.equal(state.members[0].birthTime, "06:00");
});

test("analisis ulang mereset hasil dan seluruh input ke kondisi awal", () => {
  const members = completedMembers(3);
  const outcome = form.analyzeSamyogaGroupDraft(members);
  assert.equal(outcome.ok, true);
  const state = {
    members,
    result: outcome.result,
    errors: form.EMPTY_SAMYOGA_GROUP_FORM_ERRORS,
  };
  const nextState = form.reduceSamyogaGroupFormState(state, { type: "reset-form" });
  assert.equal(nextState.result, null);
  assert.deepEqual(nextState, form.createInitialSamyogaGroupFormState());
  assert.ok(nextState.members.every((member) => member.displayName === ""));
  assert.ok(nextState.members.every((member) => member.birthDate === ""));
  assert.ok(nextState.members.every((member) => member.birthTime === "12:00"));
  assert.notEqual(nextState, state);
});

test("source UI memuat disclaimer, responsivitas, navigasi, dan tanpa transport biometrik", () => {
  const files = [
    "app/pawongan-sinergi/kelompok/page.tsx",
    "components/samyoga-group/SamyogaGroupClient.tsx",
    "components/samyoga-group/SamyogaGroupMemberCard.tsx",
    "components/samyoga-group/SamyogaGroupResults.tsx",
  ];
  const source = files.map((file) => fs.readFileSync(path.resolve(projectRoot, file), "utf8")).join("\n");
  const pairPage = fs.readFileSync(path.resolve(projectRoot, "app/pawongan-sinergi/page.tsx"), "utf8");

  assert.match(source, /Interpretasi simbolis berdasarkan perhitungan kalender tradisional Bali/);
  assert.match(source, /Bukan asesmen ilmiah tentang kepribadian, kompetensi, kesehatan, atau kinerja kelompok/);
  assert.match(source, /sm:grid-cols-2|md:grid-cols-2/);
  assert.match(source, /lg:grid-cols-2|lg:grid-cols-5/);
  assert.match(source, /aria-invalid|aria-labelledby|role="alert"/);
  assert.match(pairPage, /href="\/pawongan-sinergi\/kelompok"/);
  assert.equal(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|indexedDB|firebase|useSession/.test(source), false);
});

test("source UI tidak membuat skor, persentase, ranking, atau formula 40\/60", () => {
  const source = [
    "lib/samyoga-group-form.ts",
    "components/samyoga-group/SamyogaGroupClient.tsx",
    "components/samyoga-group/SamyogaGroupResults.tsx",
  ].map((file) => fs.readFileSync(path.resolve(projectRoot, file), "utf8")).join("\n");
  assert.equal(
    /hybridScore|riskAdjusted|\b0\.4\b|\b0\.6\b|40\s*%\s*(?:\+|\/|dan).*60\s*%|ranking anggota terbaik|anggota terburuk/i.test(source),
    false,
  );
});

test("detail pasangan tertutup di awal, lengkap, dan memakai tombol native yang aksesibel", () => {
  const source = fs.readFileSync(
    path.resolve(projectRoot, "components/samyoga-group/SamyogaGroupResults.tsx"),
    "utf8",
  );
  const summarySource = fs.readFileSync(
    path.resolve(projectRoot, "lib/samyoga-group-summary.ts"),
    "utf8",
  );

  assert.match(summarySource, /SAMYOGA_PAIR_DETAILS_INITIAL_OPEN = false/);
  assert.match(source, /Hasil Keseluruhan Samyoga Kelompok/);
  assert.match(source, /Lihat Detail Per Pasangan/);
  assert.match(source, /aria-expanded=\{showPairDetails\}/);
  assert.match(source, /aria-controls="rincian-samyoga-kelompok"/);
  assert.match(source, /<button\s+[\s\S]*?type="button"/);
  assert.match(source, /showPairDetails &&/);
  assert.match(source, /result\.pairs\.map/);
  assert.match(source, /result\.memberSummaries\.map/);
  assert.match(source, /Sembunyikan Detail Per Pasangan/);
});

test("hero hasil memakai gaya card pasangan dengan simbol jaringan dekoratif tanpa hati", () => {
  const source = fs.readFileSync(
    path.resolve(projectRoot, "components/samyoga-group/SamyogaGroupResults.tsx"),
    "utf8",
  );

  assert.match(source, /Analisis Dinamika Kelompok/);
  assert.match(source, /Berdasarkan komposisi pasangan unik dalam Samyoga kelompok/);
  assert.match(source, /Komposisi Kelompok/);
  assert.match(source, /rounded-\[3rem\]/);
  assert.match(source, /radial-gradient/);
  assert.match(source, /function GroupNetworkSymbol/);
  assert.match(source, /GroupNetworkSymbol memberCount=\{summary\.memberCount\}/);
  assert.match(source, /geometry\.connections\.map/);
  assert.match(source, /geometry\.nodes\.map/);
  assert.match(source, /data-member-profile-icon="true"/);
  assert.match(source, /groupNetworkGradient/);
  assert.match(source, /gradientUnits="userSpaceOnUse"/);
  assert.match(source, /<svg[\s\S]*?aria-hidden="true"[\s\S]*?focusable="false"/);
  assert.equal(/favorite|heart/i.test(source), false);
  assert.ok(source.indexOf("Analisis Dinamika Kelompok") < source.indexOf("Lihat Detail Per Pasangan"));
});

test("submit valid menampilkan splash dan memakai label Analisis Samyoga Group", () => {
  const source = fs.readFileSync(
    path.resolve(projectRoot, "components/samyoga-group/SamyogaGroupClient.tsx"),
    "utf8",
  );

  assert.match(source, /import SplashScreen from "@\/components\/SplashScreen"/);
  assert.match(source, /Analisis Samyoga Group/);
  assert.match(source, /disabled=\{!canAnalyze \|\| isAnalyzing\}/);
  assert.match(source, /aria-busy=\{isAnalyzing\}/);
  assert.match(source, /isAnalyzing && \(/);
  assert.match(source, /Menganalisis komposisi Samyoga kelompok/);
  assert.match(source, /clearTimeout\(analysisTimer\.current\)/);
  assert.ok(source.indexOf("if (!outcome.ok)") < source.indexOf("setIsAnalyzing(true)"));
});

test("form input tersembunyi setelah hasil tersedia dan dapat dibuka untuk analisis ulang", () => {
  const clientSource = fs.readFileSync(
    path.resolve(projectRoot, "components/samyoga-group/SamyogaGroupClient.tsx"),
    "utf8",
  );
  const resultSource = fs.readFileSync(
    path.resolve(projectRoot, "components/samyoga-group/SamyogaGroupResults.tsx"),
    "utf8",
  );

  assert.match(clientSource, /!state\.result && !isAnalyzing && \(/);
  assert.match(clientSource, /nextMemberId\.current = 4/);
  assert.match(clientSource, /dispatch\(\{ type: "reset-form" \}\)/);
  assert.match(clientSource, /onAnalyzeAgain=\{analyzeAgain\}/);
  assert.match(resultSource, /Analisis Ulang Samyoga Group/);
});
