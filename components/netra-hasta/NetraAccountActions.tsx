"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNetraAccount } from "./NetraAccountProvider";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";

export default function NetraAccountActions() {
  const account = useNetraAccount();
  const { dispatch } = useNetraHastaProduct();
  const router = useRouter();
  const [error, setError] = useState("");
  return <div className="netra-account-actions space-y-2"><div className="flex flex-wrap gap-4 text-sm"><Link href="/netra-hasta/riwayat" className="underline">Riwayat saya</Link><button type="button" disabled={account.busy} className="underline disabled:opacity-50" onClick={async () => { try { await account.logout(); dispatch({ type: "reset" }); router.replace("/netra-hasta/akses-detail"); router.refresh(); } catch (failure) { setError((failure as Error).message); } }}>Keluar akun</button></div>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}</div>;
}
