import Link from 'next/link';
import Header from '@/components/Header';
import FloatingElements from '@/components/FloatingElements';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingElements />
      <Header />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-24">
          <div className="max-w-4xl mx-auto text-center slide-up">
            {/* Decorative Element */}
            <div className="mb-6">
              <span className="text-6xl sm:text-7xl">🌺</span>
            </div>

            <h1 className="heading-1 text-gold-gradient mb-6">
              Temukan Jodoh Anda<br />Menurut Kalender Bali
            </h1>

            <p className="text-lg sm:text-xl text-bali-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Perhitungan tradisional berdasarkan <span className="text-bali-gold font-semibold">Wuku</span>,
              <span className="text-bali-gold font-semibold"> Pancawara</span>, dan
              <span className="text-bali-gold font-semibold"> Saptawara</span> untuk
              menemukan kecocokan pasangan yang harmonis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kecocokan-pasangan" className="btn-bali w-full sm:w-auto">
                💑 Cek Kecocokan Pasangan
              </Link>
              <Link href="/mencari-jodoh" className="btn-bali-outline w-full sm:w-auto">
                🔮 Temukan Jodoh Ideal
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="heading-2 text-gold-gradient text-center mb-12">
              Fitur Peramalan
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <Link href="/kecocokan-pasangan" className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">💕</div>
                <h3 className="heading-3 text-bali-cream mb-3 group-hover:text-bali-gold transition-colors">
                  Kecocokan Pasangan
                </h3>
                <p className="text-bali-cream/60 leading-relaxed">
                  Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan
                  berdasarkan perhitungan wuku dan nilai urip tradisional Bali.
                </p>
                <div className="mt-4 text-bali-gold font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
                  Cek Sekarang <span>→</span>
                </div>
              </Link>

              {/* Feature 2 */}
              <Link href="/mencari-jodoh" className="glass-card p-8 group hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="heading-3 text-bali-cream mb-3 group-hover:text-bali-gold transition-colors">
                  Mencari Jodoh
                </h3>
                <p className="text-bali-cream/60 leading-relaxed">
                  Temukan tanggal-tanggal kelahiran yang paling cocok dengan Anda.
                  Dapatkan rekomendasi wuku pasangan ideal berdasarkan profil Anda.
                </p>
                <div className="mt-4 text-bali-gold font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
                  Temukan Jodoh <span>→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Wuku Info Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 sm:p-12">
              <h2 className="heading-2 text-gold-gradient mb-6 text-center">
                Apa itu Wuku?
              </h2>
              <p className="text-bali-cream/70 text-center leading-relaxed mb-8">
                Wuku adalah sistem kalender tradisional Bali yang terdiri dari 30 minggu dalam satu siklus 210 hari.
                Setiap wuku memiliki karakteristik unik dan dewa pelindung yang mempengaruhi sifat serta
                keberuntungan seseorang berdasarkan hari kelahirannya.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-3xl mb-2">🌙</div>
                  <h4 className="text-bali-gold font-semibold mb-1">30 Wuku</h4>
                  <p className="text-bali-cream/60 text-sm">Minggu tradisional Bali dengan karakteristik unik</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-3xl mb-2">⭐</div>
                  <h4 className="text-bali-gold font-semibold mb-1">5 Pancawara</h4>
                  <p className="text-bali-cream/60 text-sm">Siklus 5 hari dengan nilai urip masing-masing</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-xl">
                  <div className="text-3xl mb-2">📿</div>
                  <h4 className="text-bali-gold font-semibold mb-1">7 Saptawara</h4>
                  <p className="text-bali-cream/60 text-sm">7 hari dalam seminggu dengan sifat khasnya</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kategori Jodoh Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-gold-gradient text-center mb-12">
              Kategori Kecocokan
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="glass-card p-5 text-center">
                <span className="inline-block px-4 py-1 badge-sri rounded-full text-sm font-bold mb-2">Sri</span>
                <p className="text-bali-cream/70 text-sm">Rejeki melimpah & harmonis</p>
              </div>
              <div className="glass-card p-5 text-center">
                <span className="inline-block px-4 py-1 badge-dana rounded-full text-sm font-bold mb-2">Dana</span>
                <p className="text-bali-cream/70 text-sm">Ekonomi stabil & kaya</p>
              </div>
              <div className="glass-card p-5 text-center">
                <span className="inline-block px-4 py-1 badge-laba rounded-full text-sm font-bold mb-2">Laba</span>
                <p className="text-bali-cream/70 text-sm">Beruntung dalam usaha</p>
              </div>
              <div className="glass-card p-5 text-center">
                <span className="inline-block px-4 py-1 badge-sakti rounded-full text-sm font-bold mb-2">Sakti</span>
                <p className="text-bali-cream/70 text-sm">Kuat menghadapi cobaan</p>
              </div>
              <div className="glass-card p-5 text-center">
                <span className="inline-block px-4 py-1 badge-tiwas rounded-full text-sm font-bold mb-2">Tiwas</span>
                <p className="text-bali-cream/70 text-sm">Banyak rintangan</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-bali-gold/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-3xl mb-4">🌺</div>
            <p className="text-bali-cream/60 mb-2">
              Jodoh Bali - Peramalan Jodoh Berdasarkan Kalender Tradisional Bali
            </p>
            <p className="text-bali-cream/40 text-sm">
              Perhitungan berdasarkan sistem kalender Bali tradisional (Wuku, Pancawara, Saptawara)
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
