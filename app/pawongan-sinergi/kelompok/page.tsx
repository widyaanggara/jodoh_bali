import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SamyogaGroupClient from "@/components/samyoga-group/SamyogaGroupClient";

export const metadata: Metadata = {
    title: "Samyoga Kelompok | Metemu",
    description: "Interpretasi simbolis Samyoga untuk seluruh pasangan unik dalam kelompok berisi 3–6 anggota.",
};

export default function SamyogaGroupPage() {
    return (
        <div className="min-h-screen bg-background-light font-sans">
            <Header />
            <SamyogaGroupClient />
            <Footer />
        </div>
    );
}
