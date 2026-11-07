import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Log Statistik | Metemu", robots: { index:false, follow:false } };
export default function AdminLogPage(){
 return <><Header/><main className="mx-auto max-w-3xl px-6 py-16"><h1 className="font-display text-3xl">Log Statistik</h1><p role="status" className="mt-6">Data statistik dan CSV hanya tersedia melalui akses pengelola terotorisasi.</p></main><Footer/></>;
}
