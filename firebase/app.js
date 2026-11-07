// Release gate: no browser reads/writes of birth-data activity logs.
export async function simpanLog() { return false; }
export async function ambilDataLog() { throw new Error("Statistik hanya tersedia melalui akses pengelola terotorisasi."); }
export function listenTotalLog() { return () => {}; }
