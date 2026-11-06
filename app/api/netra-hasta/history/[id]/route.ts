import { requireNetraIdentity } from "@/lib/netra-hasta/account-access.server";
import { accountFailure, privateJson, requireSameOrigin } from "@/lib/netra-hasta/account-http.server";
import { AccountError } from "@/lib/netra-hasta/firebase-identity.server";
import { deleteHistory, getHistory } from "@/lib/netra-hasta/history.server";

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  try {
    const record = await getHistory(await requireNetraIdentity(), (await context.params).id);
    if (!record) throw new AccountError(404, "not_found", "Riwayat tidak ditemukan.");
    return privateJson({ record });
  } catch (error) { return accountFailure(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    await deleteHistory(await requireNetraIdentity(), (await context.params).id);
    return privateJson({ deleted: true });
  } catch (error) { return accountFailure(error); }
}
