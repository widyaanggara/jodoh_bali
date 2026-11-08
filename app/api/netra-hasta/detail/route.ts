import { requireNetraIdentity } from "@/lib/netra-hasta/account-access.server";
import { createProtectedDetailHandler } from "@/lib/netra-hasta/detail-access.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createProtectedDetailHandler(requireNetraIdentity);
