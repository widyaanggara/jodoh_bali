import "server-only";
import { requireNetraIdentity } from "@/lib/netra-hasta/account-access.server";
import { createCareerHandler } from "@/lib/samyoga/career-access.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createCareerHandler(requireNetraIdentity);
