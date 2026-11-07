import type { ReactNode } from "react";
import "./netra-hasta.css";
import NetraHastaProductProvider from "@/components/netra-hasta/NetraHastaProductProvider";
import NetraAccountProvider from "@/components/netra-hasta/NetraAccountProvider";

export default function NetraHastaLayout({ children }: { children: ReactNode }) {
  return <NetraAccountProvider><NetraHastaProductProvider><div className="netra-theme">{children}</div></NetraHastaProductProvider></NetraAccountProvider>;
}
