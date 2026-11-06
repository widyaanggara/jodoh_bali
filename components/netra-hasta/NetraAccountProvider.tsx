"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } from "firebase/auth";
import { friendlyAuthError, getNetraFirebaseAuth } from "@/lib/netra-hasta/firebase-auth.client";

interface AccountContext {
  uid: string | null; loading: boolean; busy: boolean; historyEnabled: boolean; configured: boolean | null; configurationMessage: string | null;
  login: (email: string, password: string, register: boolean) => Promise<void>;
  logout: () => Promise<void>;
}
const Context = createContext<AccountContext | null>(null);
export default function NetraAccountProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<{ configured: boolean | null; message: string | null; historyEnabled: boolean }>({ configured: null, message: null, historyEnabled: false });
  const operation = useRef(0);
  const inProgress = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    const current = operation.current;
    void Promise.all([
      fetch("/api/netra-hasta/session", { cache: "no-store", signal: controller.signal }).then(async (response) => response.ok ? (await response.json()).uid : null),
      fetch("/api/netra-hasta/auth-config", { cache: "no-store", signal: controller.signal }).then((response) => response.json()),
    ]).then(([accountUid, configuration]) => {
      if (controller.signal.aborted || operation.current !== current) return;
      setUid(accountUid);
      setConfig(configuration);
    }).catch(() => {
      if (!controller.signal.aborted) setConfig({ configured: false, historyEnabled: false, message: "Layanan akun belum dapat dihubungi." });
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [pathname]);
  const login = useCallback(async (email: string, password: string, register: boolean) => {
    if (inProgress.current) throw new Error("Proses akun masih berjalan.");
    inProgress.current = true; operation.current += 1; setBusy(true);
    let auth: ReturnType<typeof getNetraFirebaseAuth> | null = null;
    try {
      auth = getNetraFirebaseAuth();
      await setPersistence(auth, inMemoryPersistence);
      const credential = register ? await createUserWithEmailAndPassword(auth, email, password) : await signInWithEmailAndPassword(auth, email, password);
      const response = await fetch("/api/netra-hasta/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: await credential.user.getIdToken(true) }) });
      const data = await response.json();
      if (!response.ok || data.uid !== credential.user.uid) { await signOut(auth); throw new Error(data.error ?? "Verifikasi akun di server gagal."); }
      setUid(data.uid);
    } catch (error) {
      if (auth) await signOut(auth).catch(() => undefined);
      if (typeof error === "object" && error !== null && "code" in error) throw new Error(friendlyAuthError(error));
      throw error;
    } finally { inProgress.current = false; setBusy(false); setLoading(false); }
  }, []);
  const logout = useCallback(async () => {
    if (inProgress.current) throw new Error("Tunggu proses akun selesai.");
    inProgress.current = true; operation.current += 1; setBusy(true);
    try {
      const response = await fetch("/api/netra-hasta/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Logout belum berhasil. Coba lagi.");
      await signOut(getNetraFirebaseAuth()).finally(() => setUid(null));
    } finally { inProgress.current = false; setBusy(false); }
  }, []);
  return <Context.Provider value={{ uid, loading, busy, historyEnabled: config.historyEnabled, configured: config.configured, configurationMessage: config.message, login, logout }}>{children}</Context.Provider>;
}
export function useNetraAccount() {
  const account = useContext(Context);
  if (!account) throw new Error("Account provider tidak tersedia.");
  return account;
}
