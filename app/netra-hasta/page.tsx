import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraHastaFlow from "@/components/netra-hasta/NetraHastaFlow";
import NetraIcon from "@/components/netra-hasta/NetraIcon";

export const metadata: Metadata = {
  title: "Netra-Hasta — Beta | Metemu",
  description: "Jelajahi kalender kelahiran Bali dan pindai telapak secara lokal. Hasil dasar tanpa akun, ramalan detail dengan login.",
};

export default function NetraHastaPage() {
  return (
    <div className="netra-page min-h-screen text-stone-800">
      <Header />
      <main>
        <section className="netra-hero">
          <div className="netra-hero-copy">
            <span className="netra-beta"><span aria-hidden="true" />Beta · Dalam Pengembangan</span>
            <h1>Netra Hasta</h1>
            <p className="netra-hero-lead">Kalender kelahiran Bali.<br />Cerita di balik telapak Anda.</p>
            <p className="netra-hero-description">Mulai dari hari kelahiran, lalu pindai telapak untuk melihat kandidat lipatan. Jelajahi hasil dasar tanpa akun, atau masuk untuk membuka Ramalan Detail.</p>
            <div className="netra-hero-actions">
              <a href="#mulai-netra" className="netra-button-primary">Mulai Netra Hasta<NetraIcon name="arrow" /></a>
              <Link href="/netra-hasta/riwayat" prefetch={false} className="netra-text-link"><NetraIcon name="history" />Riwayat saya</Link>
            </div>
            <p className="netra-hero-note"><NetraIcon name="shield" />Foto telapak diproses di perangkat Anda.</p>
          </div>
          <figure className="netra-hero-art">
            <div className="netra-art-disc">
              <svg viewBox="0 0 320 360" fill="none" aria-hidden="true" className="netra-palm-art">
                <circle cx="160" cy="180" r="146" stroke="currentColor" strokeOpacity=".12" />
                <circle cx="160" cy="180" r="125" stroke="currentColor" strokeOpacity=".1" strokeDasharray="2 9" />
                <path d="M114 306v-26c-22-17-35-39-44-59l-22-43c-6-13 8-24 18-14l32 34-15-94c-3-19 19-23 23-5l14 66-6-111c-1-19 22-20 23-1l8 105 5-128c1-19 24-17 23 2l-2 125 15-105c3-19 26-15 23 4l-12 119 13-70c3-18 26-14 23 5l-12 91c-3 35-12 58-30 78v27" fill="white" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                <path d="M96 194v-14h14M211 194v-14h-14M96 247v14h14M211 247v14h-14" stroke="#A62C21" strokeWidth="3" strokeLinecap="round" />
                <path d="M103 219h101" stroke="#A62C21" strokeOpacity=".22" strokeDasharray="3 5" />
                <path d="M126 308h53" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="netra-art-label netra-art-calendar"><NetraIcon name="calendar" />Kalender Bali</span>
              <span className="netra-art-label netra-art-palm"><NetraIcon name="hand" />Pindai telapak</span>
            </div>
            <figcaption>Ilustrasi panduan, bukan hasil deteksi garis.</figcaption>
          </figure>
        </section>

        <section id="mulai-netra" className="netra-workspace">
          <NetraHastaFlow />
        </section>

        <section className="netra-principles" aria-label="Tentang pemindaian">
          <Feature icon="shield" title="Kendali ada pada Anda" text="Kamera memerlukan izin. Foto dan video tidak diunggah atau disimpan ke akun." />
          <Feature icon="calendar" title="Berakar pada kalender Bali" text="Hasil Otonan memakai perhitungan Metemu yang sudah tersedia, dengan interpretasi simbolis." />
          <Feature icon="hand" title="Eksplorasi, bukan kepastian" text="Kandidat lipatan masih eksperimental. Heart, Head, Life, dan Fate belum dikenali otomatis." />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: "shield" | "calendar" | "hand"; title: string; text: string }) {
  return <div className="netra-principle"><NetraIcon name={icon} /><div><h2>{title}</h2><p>{text}</p></div></div>;
}
