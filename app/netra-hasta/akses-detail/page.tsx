import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraLoginPanel from "@/components/netra-hasta/NetraLoginPanel";

export default function NetraHastaLoginPage() {
  return <div className="netra-subpage min-h-screen text-stone-800"><Header /><main className="netra-subpage-main netra-auth-main"><NetraLoginPanel /></main><Footer /></div>;
}
