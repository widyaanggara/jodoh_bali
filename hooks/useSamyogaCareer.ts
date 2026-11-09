"use client";

import { useEffect, useMemo, useState } from "react";
import { useNetraAccount } from "@/components/netra-hasta/NetraAccountProvider";
import { CAREER_METHOD_VERSION, type CareerMemberInput, type CareerResponse } from "@/lib/samyoga/career-contract";

type Access = { binding: string; phase: "loading" | "ready" | "error"; data: CareerResponse | null; error: string; reauthenticate: boolean };
function validResponse(value: CareerResponse, uid: string, groupId: string, members: CareerMemberInput[]) {
    return value && value.verifiedUid === uid && value.groupId === groupId && value.methodVersion === CAREER_METHOD_VERSION &&
        Number.isInteger(value.expiresAt) && Array.isArray(value.members) && value.members.length === members.length &&
        new Set(value.members.map(member => member.memberId)).size === members.length &&
        value.members.every(member => members.some(input => input.id === member.memberId) &&
            member.reading?.methodVersion === CAREER_METHOD_VERSION && ["interpreted", "ambiguous"].includes(member.reading.status) &&
            typeof member.reading.explanation === "string" && Array.isArray(member.reading.professions) &&
            member.reading.professions.every(item => typeof item === "string") &&
            (member.reading.explicitlyPreferred === null || Array.isArray(member.reading.explicitlyPreferred) && member.reading.explicitlyPreferred.every(item => typeof item === "string")) &&
            Array.isArray(member.reading.reference?.printedPages) && Array.isArray(member.reading.reference?.pdfPages));
}
export function useSamyogaCareer(members: readonly (CareerMemberInput & { birthTime: string })[]) {
    const account = useNetraAccount();
    const key = JSON.stringify(members.map(({ id, birthDate, birthTime }) => ({ id, birthDate, birthTime }))
        .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const requestMembers = useMemo(() => (JSON.parse(key) as CareerMemberInput[]).map(({ id, birthDate }) => ({ id, birthDate })), [key]);
    const binding = JSON.stringify([account.uid, key]);
    const [context, setContext] = useState(binding);
    const [requestNumber, setRequestNumber] = useState(0);
    const [activation, setActivation] = useState<string | null>(null);
    const [access, setAccess] = useState<Access | null>(null);
    // A changed member/date or account cannot reuse an earlier permission/grant/result,
    // including when the user later changes inputs back to the previous values.
    if (context !== binding) {
        setContext(binding);
        setActivation(null);
        setAccess(null);
    }
    useEffect(() => {
        if (!account.uid || account.loading || activation !== binding) return;
        const uid = account.uid;
        const controller = new AbortController();
        let active = true;
        let expiryTimer: ReturnType<typeof setTimeout> | undefined;
        const startTimer = setTimeout(() => {
            setAccess({ binding, phase: "loading", data: null, error: "", reauthenticate: false });
            void (async () => {
                let reauthenticate = false;
                async function post(body: unknown) {
                    const response = await fetch("/api/samyoga/career", { method: "POST", cache: "no-store",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
                    reauthenticate = response.status === 401;
                    if (!response.ok) throw new Error("Career access unavailable");
                    return response.json();
                }
                try {
                    const grant = await post({ action: "authorize", members: requestMembers, memberPermissionConfirmed: true });
                    if (!active) return;
                    if (grant.verifiedUid !== uid || typeof grant.groupId !== "string" || typeof grant.grant !== "string") throw new Error("Invalid authorization");
                    const data: CareerResponse = await post({ action: "analyze", members: requestMembers, groupId: grant.groupId, grant: grant.grant });
                    if (!active) return;
                    if (!validResponse(data, uid, grant.groupId, requestMembers)) throw new Error("Invalid career response");
                    const remaining = data.expiresAt * 1000 - Date.now();
                    if (remaining <= 0 || remaining > 600_000) throw new Error("Expired group access");
                    setAccess({ binding, phase: "ready", data, error: "", reauthenticate: false });
                    expiryTimer = setTimeout(() => setAccess({ binding, phase: "error", data: null,
                        error: "Akses sementara berakhir. Verifikasi ulang untuk membuka ramalan profesi.", reauthenticate: false }), remaining);
                } catch {
                    if (active) setAccess({ binding, phase: "error", data: null, reauthenticate,
                        error: reauthenticate ? "Sesi berakhir. Masuk kembali untuk membuka profesi." : "Ramalan profesi belum dapat dimuat. Coba verifikasi ulang kelompok." });
                }
            })();
        }, 0);
        return () => { active = false; controller.abort(); clearTimeout(startTimer); clearTimeout(expiryTimer); };
    }, [account.uid, account.loading, activation, binding, requestNumber, requestMembers]);
    const current = access?.binding === binding && activation === binding && account.uid && !account.loading ? access : null;
    return { data: current?.phase === "ready" ? current.data : null, busy: current?.phase === "loading",
        error: current?.error ?? "", reauthenticate: current?.reauthenticate ?? false,
        load: () => { setActivation(binding); setRequestNumber(value => value + 1); },
        clear: () => { setActivation(null); setAccess(null); } };
}
