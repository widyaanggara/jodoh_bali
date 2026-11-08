"use client";

import { useCallback, useEffect, useState } from "react";
import { decodeDetailSnapshot, type DetailSnapshot, type MatchRange } from "@/lib/netra-hasta/detail-result";
import type { BirthInput } from "@/lib/netra-hasta/product-flow";
import { useNetraAccount } from "@/components/netra-hasta/NetraAccountProvider";

type AccessState = { key: string; uid: string; phase: "loading" | "ready" | "error"; detail: DetailSnapshot | null; error: string; reauthenticate: boolean };

/** A client UID cannot unlock results: every load must pass the server session boundary. */
export function useProtectedNetraDetail(birth: BirthInput, range: MatchRange, captureId: number) {
  const account = useNetraAccount();
  const [attempt, setAttempt] = useState(0);
  const [access, setAccess] = useState<AccessState | null>(null);
  const uid = account.uid;
  const key = JSON.stringify([captureId, birth.date, birth.time, range.startYear, range.endYear, attempt]);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    if (!uid || account.loading) return;
    const controller = new AbortController();
    let active = true;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;
    const startTimer = setTimeout(() => {
      setAccess({ key, uid, phase: "loading", detail: null, error: "", reauthenticate: false });
      void (async () => {
        let reauthenticate = false;
        try {
          const response = await fetch("/api/netra-hasta/detail", { method: "POST", cache: "no-store",
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ birthDate: birth.date, birthTime: birth.time, matchStartYear: range.startYear, matchEndYear: range.endYear }) });
          reauthenticate = response.status === 401;
          if (!response.ok) throw new Error("Detail unavailable");
          const data = await response.json();
          if (data.verifiedUid !== uid || !Number.isInteger(data.expiresAt)) throw new Error("Identity mismatch");
          const remaining = data.expiresAt * 1000 - Date.now();
          if (remaining <= 0 || remaining > 3600_000) { reauthenticate = true; throw new Error("Session expired"); }
          const detail = decodeDetailSnapshot(JSON.stringify(data.detail), { date: birth.date, time: birth.time });
          if (!active) return;
          setAccess({ key, uid, phase: "ready", detail, error: "", reauthenticate: false });
          expiryTimer = setTimeout(() => {
            setAccess({ key, uid, phase: "error", detail: null, error: "Sesi berakhir. Masuk kembali untuk melihat hasil lengkap.", reauthenticate: true });
          }, remaining);
        } catch {
          if (active) setAccess({ key, uid, phase: "error", detail: null,
            error: reauthenticate ? "Masuk kembali untuk melihat hasil lengkap." : "Hasil lengkap belum dapat dimuat. Silakan coba lagi.", reauthenticate });
        }
      })();
    }, 0);
    return () => { active = false; controller.abort(); clearTimeout(startTimer); clearTimeout(expiryTimer); };
  }, [uid, account.loading, key, birth.date, birth.time, range.startYear, range.endYear]);
  const current = access?.key === key && access.uid === uid ? access : null;
  return { detail: !account.loading && uid && current?.phase === "ready" ? current.detail : null,
    busy: account.loading || Boolean(uid && (!current || current.phase === "loading")),
    error: current?.error ?? "", reauthenticate: current?.reauthenticate ?? false, retry };
}
