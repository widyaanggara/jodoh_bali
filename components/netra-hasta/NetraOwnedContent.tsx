"use client";

import Link from "next/link";
import { useNetraAccount } from "./NetraAccountProvider";
import type { ReactNode } from "react";

/** Secondary UI protection for cached navigation; server identity remains mandatory. */
export default function NetraOwnedContent({ ownerUid, children }: { ownerUid: string; children: ReactNode }) {
  const account = useNetraAccount();
  if (account.loading) return <p role="status" className="text-sm">Memeriksa sesi akun...</p>;
  if (account.uid !== ownerUid) return <p className="text-sm">Sesi akun berubah. <Link href="/netra-hasta/akses-detail" className="underline">Masuk kembali</Link> untuk membuka hasil Anda.</p>;
  return <>{children}</>;
}
