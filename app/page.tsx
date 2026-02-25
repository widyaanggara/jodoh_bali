"use client";

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-background-light font-sans text-stone-800 transition-colors duration-300 min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32">
          {/* Decorations */}
          <img
            alt="Hibiscus illustration"
            className="lotus-bg absolute -top-10 -left-20 w-80 rotate-12 filter grayscale brightness-150 opacity-20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI_aEU4azrZzqWAUFu0f7UDVVS1WRTjfY-E5JMoMD3yb3SgZ9bEd9ZQVDopTLqvUpo474bGsB9xuVCBukFh85LApcqIvPRkCah0R85illdaRHE1yJqLOIHZFn1DSkVYDh5E3TvVIqwqQE1yEsgje2bmeTEw22bTBoWD6WMA5335yOjghZV0thcyzXcXuljBURdiF56qe-PoATRgtvUPb-5W23BuxFZBK3I1qLUd7L_RocoiNdZWhwxnoCWq6eIh9EtripPBWzgSw"
          />
          <img
            alt="Lotus illustration"
            className="lotus-bg absolute -bottom-10 -right-20 w-96 -rotate-12 filter grayscale brightness-150 opacity-20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5n4xrL-Qx7RTyVysEsBHIJJvfU6SJetYBnQPfypldKnLbunkehldV7RNxo6TW2F2TUEUwL2RtqiqKNgavqvcWcXWSCTdFhx86dfFKRuSZquugLyuk3mbFssZ-3hsGPvoIIiFesRmHrbSNA9xW_97WENH0siqj6wJxdfADG_qKxQGgsbemj-DcAih82CZ7wBrYY4x0ZZYLe1YGfH6qu6ckuehwg6uq5vHucRx9kP97TJxo1KttFsILfpYM-9U_YIH_NcUNVk2K7Q"
          />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest mb-8">
              <span className="material-icons-outlined text-sm">favorite</span>
              Aplikasi Kencan #1 di Bali
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-stone-900 leading-tight mb-6">
              Jodoh Bali <br />
              <span className="italic text-primary font-normal">Cinta Sejati Berdasarkan</span> <br />
              Kalender & Nilai Tradisi
            </h1>

            <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Temukan pasangan yang berbagi nilai spiritual, budaya, dan kecintaan pada warisan leluhur Bali. Mulailah perjalanan cintamu hari ini.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/kecocokan-pasangan"
                className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                Cek Kecocokan Pasangan
              </Link>
              <Link
                href="/mencari-jodoh"
                className="w-full sm:w-auto px-8 py-4 rounded-full gradient-button text-white font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center"
              >
                Temukan Jodoh Ideal
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-3">Kenapa Metemu?</h3>
              <h2 className="font-display text-4xl font-bold text-stone-900">Pengalaman Kencan Tradisional & Modern</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div tabIndex={0} className="block bg-background-light p-10 rounded-4xl border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:-translate-y-1 transition-all group outline-none cursor-default">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white group-focus:bg-accent-gold group-focus:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white group-focus:text-white text-3xl">verified_user</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Kecocokan Pasangan</h4>
                <div className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[75px] group-hover:max-h-[400px] group-focus:max-h-[400px]">
                  <p className="text-stone-500 leading-relaxed">
                    Menghitung titik temu energi antara dua individu melalui penggabungan nilai Neptu Pancawara dan Saptawara untuk mengungkap tingkat keharmonisan serta prediksi dinamika hubungan di masa depan.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#fcfbf9] to-transparent group-hover:opacity-0 group-focus:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Feature 2 */}
              <div tabIndex={0} className="block bg-background-light p-10 rounded-4xl border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:-translate-y-1 transition-all group outline-none cursor-default">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white group-focus:bg-accent-gold group-focus:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white group-focus:text-white text-3xl">synagogue</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Mencari Jodoh</h4>
                <div className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[75px] group-hover:max-h-[400px] group-focus:max-h-[400px]">
                  <p className="text-stone-500 leading-relaxed">
                    Menemukan kriteria profil pasangan yang memiliki keselarasan energi paling seimbang dengan siklus kelahiran Anda berdasarkan perhitungan matematis Wewaran yang presisi.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#fcfbf9] to-transparent group-hover:opacity-0 group-focus:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Feature 3 */}
              <div tabIndex={0} className="block bg-background-light p-10 rounded-4xl border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:-translate-y-1 transition-all group outline-none cursor-default">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white group-focus:bg-accent-gold group-focus:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white group-focus:text-white text-3xl">diversity_1</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Ramalan Pernikahan</h4>
                <div className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[75px] group-hover:max-h-[400px] group-focus:max-h-[400px]">
                  <p className="text-stone-500 leading-relaxed">
                    Menganalisis potensi dan dinamika perjalanan rumah tangga berdasarkan metode perjodohan tradisional Bali (Tenung Urip Panca & Sodasa Rsi) untuk merencanakan masa depan yang bahagia.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#fcfbf9] to-transparent group-hover:opacity-0 group-focus:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Feature 4 */}
              <div tabIndex={0} className="block bg-background-light p-10 rounded-4xl border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:-translate-y-1 transition-all group outline-none cursor-default">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white group-focus:bg-accent-gold group-focus:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white group-focus:text-white text-3xl">calendar_month</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Mencari Otonan</h4>
                <div className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[75px] group-hover:max-h-[400px] group-focus:max-h-[400px]">
                  <p className="text-stone-500 leading-relaxed">
                    Mencari jadwal pasti jatuhnya hari Otonan (Ulang Tahun Bali) Anda di siklus 210 hari pada bulan dan tahun-tahun mendatang dengan perhitungan kalender Pawukon yang terverifikasi.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#fcfbf9] to-transparent group-hover:opacity-0 group-focus:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Feature 5 */}
              <div tabIndex={0} className="block bg-background-light p-10 rounded-4xl border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:-translate-y-1 transition-all group outline-none cursor-default">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white group-focus:bg-accent-gold group-focus:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white group-focus:text-white text-3xl">auto_awesome</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Ramalan Otonan</h4>
                <div className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[75px] group-hover:max-h-[400px] group-focus:max-h-[400px]">
                  <p className="text-stone-500 leading-relaxed">
                    Mengetahui perayaan hari lahir versi Bali (Otonan) beserta kalkulasi komplit struktur wewaran (Ekawara hingga Dasawara) serta makna karakter spiritual di baliknya.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#fcfbf9] to-transparent group-hover:opacity-0 group-focus:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Feature 6 */}
              <div tabIndex={0} className="block bg-background-light p-10 rounded-4xl border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 focus:shadow-xl focus:-translate-y-1 transition-all group outline-none cursor-default">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white group-focus:bg-accent-gold group-focus:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white group-focus:text-white text-3xl">spa</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Samyoga</h4>
                <div className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[75px] group-hover:max-h-[400px] group-focus:max-h-[400px]">
                  <p className="text-stone-500 leading-relaxed">
                    Samyoga adalah fitur analisis kecocokan strategis yang dirancang untuk memetakan potensi sinergi antara dua individu dalam struktur organisasi atau pemerintahan. Diambil dari istilah Kawi/Sanskerta yang berarti "Penyatuan" atau "Pertautan yang Harmonis", fitur ini melampaui sekadar perjodohan kerja biasa.
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#fcfbf9] to-transparent group-hover:opacity-0 group-focus:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
