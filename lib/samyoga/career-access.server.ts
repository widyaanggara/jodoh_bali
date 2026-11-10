import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { AccountError, type VerifiedIdentity } from "../netra-hasta/firebase-identity.server";
import { accountFailure, privateJson, readAccountJson, requireSameOrigin } from "../netra-hasta/account-http.server";
import { calculateWarigaCareer, parseCareerCivilDate } from "./tenung-wariga-career";
import { CAREER_METHOD_VERSION, type CareerMemberInput } from "./career-contract";

const GROUP_TTL_SECONDS = 600;
interface GroupAccess {
    version: 1;
    groupId: string;
    uid: string;
    session: string;
    digest: string;
    expiresAt: number;
}
function exactFields(body: Record<string, unknown>, fields: string[]) {
    if (Object.keys(body).length !== fields.length || Object.keys(body).some(key => !fields.includes(key)))
        throw new AccountError(400, "invalid_career_input", "Permintaan profesi tidak valid.");
}
function validateMembers(value: unknown): CareerMemberInput[] {
    if (!Array.isArray(value) || value.length < 3 || value.length > 6)
        throw new AccountError(400, "invalid_career_members", "Kelompok harus berisi 3-6 anggota.");
    const ids = new Set<string>();
    return value.map(member => {
        if (!member || typeof member !== "object" || Array.isArray(member)) throw new AccountError(400, "invalid_career_members", "Data anggota tidak valid.");
        exactFields(member, ["id", "birthDate"]);
        if (typeof member.id !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(member.id) || ids.has(member.id) ||
            typeof member.birthDate !== "string")
            throw new AccountError(400, "invalid_career_members", "ID atau tanggal anggota tidak valid.");
        try { parseCareerCivilDate(member.birthDate); }
        catch { throw new AccountError(400, "invalid_career_members", "Tanggal anggota tidak valid."); }
        ids.add(member.id);
        return { id: member.id, birthDate: member.birthDate };
    });
}
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
function groupDigest(members: CareerMemberInput[]) {
    return hash(JSON.stringify([...members].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)));
}
function equal(left: string, right: string) {
    const a = Buffer.from(left), b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Stateless, process-local grants: no group database, DOB log, session store or new secret configuration.
 * Only an authenticated explicit permission assertion may create a new private analysis context.
 * A sealed grant binds its random group ID, exact members, UID, verified session and expiry.
 * Restart/another process invalidates the grant; the client must authorize a fresh context.
 */
export function createCareerHandler(
    identify: () => Promise<VerifiedIdentity>,
    options: { key?: Uint8Array; now?: () => number; calculate?: typeof calculateWarigaCareer } = {},
) {
    const key = Buffer.from(options.key ?? randomBytes(32));
    if (key.byteLength !== 32) throw new Error("Career grant requires a 256-bit key");
    const now = options.now ?? (() => Math.floor(Date.now() / 1000));
    const calculate = options.calculate ?? calculateWarigaCareer;
    function seal(access: GroupAccess) {
        const nonce = randomBytes(12), cipher = createCipheriv("aes-256-gcm", key, nonce);
        const plain = Buffer.from(JSON.stringify(access));
        try {
            const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
            return Buffer.concat([nonce, encrypted, cipher.getAuthTag()]).toString("base64url");
        } finally { plain.fill(0); }
    }
    function unseal(value: unknown): GroupAccess {
        if (typeof value !== "string" || value.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(value))
            throw new AccountError(403, "group_access_denied", "Akses kelompok tidak valid. Verifikasi ulang kelompok ini.");
        try {
            const bytes = Buffer.from(value, "base64url");
            if (bytes.length < 29) throw new Error("invalid grant");
            const decipher = createDecipheriv("aes-256-gcm", key, bytes.subarray(0, 12));
            decipher.setAuthTag(bytes.subarray(-16));
            const plain = Buffer.concat([decipher.update(bytes.subarray(12, -16)), decipher.final()]);
            try {
                const access = JSON.parse(plain.toString("utf8")) as GroupAccess;
                if (access.version !== 1 || typeof access.uid !== "string" || typeof access.groupId !== "string" ||
                    typeof access.session !== "string" || typeof access.digest !== "string" || !Number.isInteger(access.expiresAt)) throw new Error("invalid grant");
                return access;
            } finally { plain.fill(0); }
        } catch {
            throw new AccountError(403, "group_access_denied", "Akses kelompok tidak valid. Verifikasi ulang kelompok ini.");
        }
    }
    return async (request: Request) => {
        try {
            requireSameOrigin(request);
            const identity = await identify();
            if (!Number.isInteger(identity.expiresAt) || identity.expiresAt <= now())
                throw new AccountError(401, "login_required", "Sesi berakhir. Silakan masuk kembali.");
            const body = await readAccountJson(request, 4096);
            if (body.action === "authorize") {
                exactFields(body, ["action", "members", "memberPermissionConfirmed"]);
                if (body.memberPermissionConfirmed !== true)
                    throw new AccountError(403, "member_permission_required", "Pastikan Anda berhak memproses data anggota terlebih dahulu.");
                const members = validateMembers(body.members);
                const access: GroupAccess = { version: 1, groupId: randomUUID(), uid: identity.uid,
                    session: hash(identity.idToken), digest: groupDigest(members), expiresAt: Math.min(identity.expiresAt, now() + GROUP_TTL_SECONDS) };
                return privateJson({ groupId: access.groupId, grant: seal(access), verifiedUid: identity.uid, expiresAt: access.expiresAt });
            }
            if (body.action !== "analyze") throw new AccountError(400, "invalid_career_action", "Aksi profesi tidak valid.");
            exactFields(body, ["action", "members", "groupId", "grant"]);
            const members = validateMembers(body.members);
            const access = unseal(body.grant);
            if (access.expiresAt <= now()) throw new AccountError(403, "group_access_expired", "Akses kelompok berakhir. Verifikasi ulang kelompok ini.");
            if (access.uid !== identity.uid || access.groupId !== body.groupId || !equal(access.session, hash(identity.idToken)) ||
                !equal(access.digest, groupDigest(members)))
                throw new AccountError(403, "group_access_denied", "Anda tidak memiliki akses ke hasil kelompok ini.");
            return privateJson({ groupId: access.groupId, verifiedUid: identity.uid, expiresAt: access.expiresAt,
                // now() is whole seconds. Subtract one second and the client subtracts
                // the entire request duration, so display never gains time from clock skew/transit.
                validForMs: Math.max(0, (access.expiresAt - now() - 1) * 1000),
                methodVersion: CAREER_METHOD_VERSION, members: members.map(member => ({ memberId: member.id, reading: calculate(member.birthDate) })) });
        } catch (error) { return accountFailure(error); }
    };
}
