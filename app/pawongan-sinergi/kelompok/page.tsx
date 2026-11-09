import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NetraAccountProvider from "@/components/netra-hasta/NetraAccountProvider";
import ExperimentalSamyogaGroupClient from "@/components/samyoga-group/ExperimentalSamyogaGroupClient";

export const metadata: Metadata = {
    title: "Sinergi Kelompok | Metemu",
    description: "Interpretasi simbolis Samyoga untuk seluruh pasangan unik dalam kelompok berisi 3–6 anggota.",
};

export default function SamyogaGroupPage() {
    return (
        <div className="min-h-screen bg-background-light font-sans">
            <Header />
            <NetraAccountProvider><ExperimentalSamyogaGroupClient /></NetraAccountProvider>
            <Footer />
        </div>
    );
}
