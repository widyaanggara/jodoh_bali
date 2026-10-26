import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraHastaClient from "@/components/netra-hasta/NetraHastaClient";

export const metadata: Metadata = {
  title: "Netra-Hasta AI | Metemu",
  description: "Prototipe pemindaian landmark tangan dan wajah secara lokal di browser dengan MediaPipe.",
};

export default function NetraHastaPage() {
  return (
    <div className="min-h-screen bg-[#fbf6ea] text-stone-800">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-[#c59b3d]/15 bg-[radial-gradient(circle_at_top_left,_rgba(197,155,61,0.18),_transparent_38%),linear-gradient(180deg,#fffdf8_0%,#fbf6ea_100%)] px-5 py-14 md:py-20">
          <div className="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full border border-[#9f3e2f]/10" />
          <div className="pointer-events-none absolute -right-10 top-22 h-40 w-40 rounded-full border border-[#c59b3d]/25" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c59b3d]/30 bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9f3e2f] backdrop-blur-sm">
              <span className="material-symbols-outlined text-base" aria-hidden="true">motion_photos_on</span>
              Hand & Face Tracking
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-stone-950 md:text-6xl">
              Metemu <span className="italic font-normal text-[#9f3e2f]">Netra-Hasta AI</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
              Pilih Hasta Rekha untuk melihat 21 titik tangan atau Rupa Lakshana untuk memetakan 478 landmark dan geometri wajah secara real-time.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-12">
          <NetraHastaClient />
        </section>

        <section className="border-t border-[#c59b3d]/15 bg-white px-5 py-10">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            <Feature icon="lock" title="Privasi lokal" text="Frame tidak disimpan atau diunggah oleh Metemu." />
            <Feature icon="gesture" title="Dua mode vision" text="Landmark tangan dan mesh wajah berjalan bergantian, bukan bersamaan." />
            <Feature icon="science" title="Data teknis" text="Tanpa ramalan, identifikasi, atau penilaian karakter dari bentuk wajah." />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#c59b3d]/15 bg-[#fffdf8] p-5">
      <span className="material-symbols-outlined text-3xl text-[#9f3e2f]" aria-hidden="true">{icon}</span>
      <h2 className="mt-3 font-display text-xl font-bold text-stone-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
    </div>
  );
}
