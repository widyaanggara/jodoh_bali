import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraLoginPanel from "@/components/netra-hasta/NetraLoginPanel";

export default function NetraHastaLoginPage() {
  return <div className="min-h-screen bg-[#fbf6ea] text-stone-800"><Header /><main className="mx-auto max-w-2xl px-4 py-10"><NetraLoginPanel /></main><Footer /></div>;
}
