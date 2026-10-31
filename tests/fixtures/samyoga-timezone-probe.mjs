import { loadTypeScriptModule } from "../samyoga-test-loader.mjs";

const { calculateSamyogaGroup } = loadTypeScriptModule("lib/samyoga-group.ts");

const members = [
  { id: "anggota-c", birthDate: "2000-02-29", birthTime: "05:59" },
  { id: "anggota-a", birthDate: "1990-01-15", birthTime: "06:00" },
  { id: "anggota-b", birthDate: "2005-07-27", birthTime: "12:00" },
  { id: "anggota-d", birthDate: "1988-12-31", birthTime: "23:59" },
];

process.stdout.write(JSON.stringify(calculateSamyogaGroup(members)));
