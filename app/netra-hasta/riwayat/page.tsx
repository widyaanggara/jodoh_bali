import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraHistoryPanel from "@/components/netra-hasta/NetraHistoryPanel";
import { getNetraAccountAccess } from "@/lib/netra-hasta/account-access.server";

export const dynamic = "force-dynamic";
export default async function NetraHastaHistoryPage() {
  const account = await getNetraAccountAccess();
  if (account.kind !== "authenticated") redirect("/netra-hasta/akses-detail");
  return <div className="netra-subpage min-h-screen text-stone-800"><Header /><main className="netra-subpage-main"><NetraHistoryPanel /></main><Footer /></div>;
}
