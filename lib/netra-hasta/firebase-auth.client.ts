import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, inMemoryPersistence, type Auth } from "firebase/auth";
import { firebaseConfig } from "../../firebase/config";

let auth: Auth | null = null;
export function getNetraFirebaseAuth(): Auth {
  if (auth) return auth;
  const app = getApps().some((entry) => entry.name === "[DEFAULT]") ? getApp() : initializeApp(firebaseConfig);
  try { auth = initializeAuth(app, { persistence: inMemoryPersistence }); }
  catch { auth = getAuth(app); }
  return auth;
}
export function friendlyAuthError(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"].includes(code)) return "Email atau password tidak sesuai.";
  if (code === "auth/email-already-in-use") return "Email telah terdaftar. Gunakan pilihan masuk.";
  if (code === "auth/weak-password") return "Password belum memenuhi kebijakan Firebase. Gunakan minimal 6 karakter.";
  if (code === "auth/operation-not-allowed" || code === "auth/configuration-not-found") return "Aktifkan Email/Password pada Firebase Authentication proyek Metemu.";
  if (code === "auth/too-many-requests") return "Terlalu banyak percobaan. Tunggu sebelum mencoba lagi.";
  return "Login belum berhasil. Periksa koneksi atau konfigurasi akun.";
}
