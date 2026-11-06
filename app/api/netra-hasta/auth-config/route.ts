import { getAuthConfiguration } from "@/lib/netra-hasta/firebase-identity.server";
import { historyEnabled } from "@/lib/netra-hasta/history.server";
import { privateJson } from "@/lib/netra-hasta/account-http.server";

export async function GET() {
  return privateJson({ ...await getAuthConfiguration(), historyEnabled: historyEnabled() });
}
