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
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-3xl mx-auto text-center slide-up">
            {/* Decorative Element */}
            <div className="mb-8">
              <span className="text-7xl sm:text-8xl drop-shadow-lg">🌺</span>
            </div>

            <h1 className="heading-1 mb-6">
              Temukan <span className="text-gold-gradient">Jodoh</span> Anda
              <br />Menurut Kalender Bali
            </h1>

            <p className="text-lg sm:text-xl text-bali-brown/60 max-w-xl mx-auto mb-12 leading-relaxed">
              Perhitungan tradisional berdasarkan <span className="text-bali-gold font-semibold">Wuku</span>,
              <span className="text-bali-gold font-semibold"> Pancawara</span>, dan
              <span className="text-bali-gold font-semibold"> Saptawara</span> untuk
              menemukan kecocokan pasangan yang harmonis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kecocokan-pasangan" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                <span>💕</span> Cek Kecocokan Pasangan
              </Link>
              <Link href="/mencari-jodoh" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                <span>🔮</span> Temukan Jodoh Ideal
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-bali-gold tracking-widest uppercase">Fitur</span>
              <h2 className="heading-2 mt-3">Apa yang Bisa Anda Lakukan?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <Link href="/kecocokan-pasangan" className="clean-card p-8 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-3xl mb-6">
                  💕
                </div>
                <h3 className="heading-3 mb-3 group-hover:text-bali-gold transition-colors">
                  Kecocokan Pasangan
                </h3>
                <p className="text-bali-brown/60 leading-relaxed mb-4">
                  Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan
                  berdasarkan perhitungan wuku dan nilai urip tradisional Bali.
                </p>
                <span className="text-bali-gold font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Cek Sekarang <span>→</span>
                </span>
              </Link>

              {/* Feature 2 */}
              <Link href="/mencari-jodoh" className="clean-card p-8 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-3xl mb-6">
                  📅
                </div>
                <h3 className="heading-3 mb-3 group-hover:text-bali-gold transition-colors">
                  Mencari Jodoh
                </h3>
                <p className="text-bali-brown/60 leading-relaxed mb-4">
                  Temukan tanggal-tanggal kelahiran yang paling cocok dengan Anda.
                  Dapatkan rekomendasi wuku pasangan ideal berdasarkan profil Anda.
                </p>
                <span className="text-bali-gold font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Temukan Jodoh <span>→</span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Wuku Info Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="clean-card p-10 sm:p-14 text-center glow-gold">
              <span className="text-5xl mb-6 block">📿</span>
              <h2 className="heading-2 mb-6">
                Apa itu <span className="text-gold-gradient">Wuku</span>?
              </h2>
              <p className="text-bali-brown/60 leading-relaxed mb-10 max-w-2xl mx-auto">
                Wuku adalah sistem kalender tradisional Bali yang terdiri dari 30 minggu dalam satu siklus 210 hari.
                Setiap wuku memiliki karakteristik unik dan dewa pelindung yang mempengaruhi sifat serta
                keberuntungan seseorang berdasarkan hari kelahirannya.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-6 bg-bali-cream rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-bali-gold/10 flex items-center justify-center text-2xl mx-auto mb-4">
                    🌙
                  </div>
                  <h4 className="text-bali-brown font-semibold mb-2">30 Wuku</h4>
                  <p className="text-bali-brown/50 text-sm">Minggu tradisional Bali dengan karakteristik unik</p>
                </div>
                <div className="p-6 bg-bali-cream rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-bali-gold/10 flex items-center justify-center text-2xl mx-auto mb-4">
                    ⭐
                  </div>
                  <h4 className="text-bali-brown font-semibold mb-2">5 Pancawara</h4>
                  <p className="text-bali-brown/50 text-sm">Siklus 5 hari dengan nilai urip masing-masing</p>
                </div>
                <div className="p-6 bg-bali-cream rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-bali-gold/10 flex items-center justify-center text-2xl mx-auto mb-4">
                    ☀️
                  </div>
                  <h4 className="text-bali-brown font-semibold mb-2">7 Saptawara</h4>
                  <p className="text-bali-brown/50 text-sm">7 hari dalam seminggu dengan sifat khasnya</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kategori Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-sm font-semibold text-bali-gold tracking-widest uppercase">Kategori</span>
            <h2 className="heading-2 mt-3 mb-12">5 Kategori Kecocokan</h2>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="clean-card px-6 py-4 inline-flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-bali-brown">Sri</span>
                <span className="text-bali-brown/50 text-sm">Harmonis</span>
              </div>
              <div className="clean-card px-6 py-4 inline-flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="font-semibold text-bali-brown">Dana</span>
                <span className="text-bali-brown/50 text-sm">Kaya</span>
              </div>
              <div className="clean-card px-6 py-4 inline-flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="font-semibold text-bali-brown">Laba</span>
                <span className="text-bali-brown/50 text-sm">Beruntung</span>
              </div>
              <div className="clean-card px-6 py-4 inline-flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-bali-brown">Sakti</span>
                <span className="text-bali-brown/50 text-sm">Tangguh</span>
              </div>
              <div className="clean-card px-6 py-4 inline-flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="font-semibold text-bali-brown">Tiwas</span>
                <span className="text-bali-brown/50 text-sm">Penuh Rintangan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 border-t border-bali-gold/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl mb-4">🌺</div>
            <p className="text-bali-brown font-semibold mb-2">Jodoh Bali</p>
            <p className="text-bali-brown/50 text-sm">
              Peramalan Jodoh Berdasarkan Kalender Tradisional Bali
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
