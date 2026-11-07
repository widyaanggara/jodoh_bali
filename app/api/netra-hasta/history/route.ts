import { requireNetraIdentity } from "@/lib/netra-hasta/account-access.server";
import { accountFailure, privateJson, readAccountJson, requireSameOrigin } from "@/lib/netra-hasta/account-http.server";
import { listHistory, saveHistory } from "@/lib/netra-hasta/history.server";

export async function GET(request: Request) {
  try { return privateJson(await listHistory(await requireNetraIdentity(), new URL(request.url).searchParams.get("cursor") ?? "")); }
  catch (error) { return accountFailure(error); }
}
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const identity = await requireNetraIdentity();
    return privateJson({ record: await saveHistory(identity, await readAccountJson(request)) }, 201);
  } catch (error) { return accountFailure(error); }
}
