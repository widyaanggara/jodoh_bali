import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-stone-800 dark:text-stone-200 transition-colors duration-300 min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32">
          {/* Decorations */}
          <img 
            alt="Hibiscus illustration" 
            className="lotus-bg absolute -top-10 -left-20 w-80 rotate-12 filter grayscale brightness-150 opacity-20 dark:opacity-5" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI_aEU4azrZzqWAUFu0f7UDVVS1WRTjfY-E5JMoMD3yb3SgZ9bEd9ZQVDopTLqvUpo474bGsB9xuVCBukFh85LApcqIvPRkCah0R85illdaRHE1yJqLOIHZFn1DSkVYDh5E3TvVIqwqQE1yEsgje2bmeTEw22bTBoWD6WMA5335yOjghZV0thcyzXcXuljBURdiF56qe-PoATRgtvUPb-5W23BuxFZBK3I1qLUd7L_RocoiNdZWhwxnoCWq6eIh9EtripPBWzgSw" 
          />
          <img 
            alt="Lotus illustration" 
            className="lotus-bg absolute -bottom-10 -right-20 w-96 -rotate-12 filter grayscale brightness-150 opacity-20 dark:opacity-5" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5n4xrL-Qx7RTyVysEsBHIJJvfU6SJetYBnQPfypldKnLbunkehldV7RNxo6TW2F2TUEUwL2RtqiqKNgavqvcWcXWSCTdFhx86dfFKRuSZquugLyuk3mbFssZ-3hsGPvoIIiFesRmHrbSNA9xW_97WENH0siqj6wJxdfADG_qKxQGgsbemj-DcAih82CZ7wBrYY4x0ZZYLe1YGfH6qu6ckuehwg6uq5vHucRx9kP97TJxo1KttFsILfpYM-9U_YIH_NcUNVk2K7Q" 
          />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest mb-8">
              <span className="material-icons-outlined text-sm">favorite</span>
              Aplikasi Kencan #1 di Bali
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-50 leading-tight mb-6">
              Jodoh Bali <br/>
              <span className="italic text-primary font-normal">Cinta Sejati Berdasarkan</span> <br/>
              Kalender & Nilai Tradisi
            </h1>
            
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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

          {/* Search/Input Card */}
          {/* <div className="max-w-4xl mx-auto px-6 mt-20 slide-up delay-200">
            <div className="bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-stone-200 dark:shadow-none border border-accent-gold/10">
              <h3 className="text-center font-display text-xl font-bold text-stone-800 dark:text-stone-100 mb-6">Masukkan Tanggal Lahir Pasangan</h3>
              <div className="flex flex-col md:flex-row items-end gap-6">
                <div className="flex-1 w-full space-y-2 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-500 ml-1">Tanggal Lahir Anda</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold/60 group-focus-within:text-accent-gold transition-colors">calendar_month</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none" type="date"/>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-2 group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-500 ml-1">Tanggal Lahir Pasangan</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold/60 group-focus-within:text-accent-gold transition-colors">calendar_month</span>
                    <input className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none" type="date"/>
                  </div>
                </div>
                <Link 
                  href="/kecocokan-pasangan"
                  className="w-full md:w-auto px-10 py-4 gradient-button text-white rounded-2xl font-bold flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined">analytics</span>
                  Cek Sekarang
                </Link>
              </div>
            </div>
          </div> */}
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-stone-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-3">Kenapa Bali Love?</h3>
              <h2 className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50">Pengalaman Kencan Tradisional & Modern</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background-light dark:bg-surface-dark p-10 rounded-[2rem] border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white text-3xl">verified_user</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Kecocokan Pasangan</h4>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
                  Keamanan adalah prioritas kami. Semua profil melalui proses verifikasi ketat untuk memastikan keaslian.
                </p>
              </div>
              
              <div className="bg-background-light dark:bg-surface-dark p-10 rounded-[2rem] border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white text-3xl">synagogue</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Mencari Jodoh</h4>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
                  Algoritma kami mempertimbangkan nilai-nilai tradisional Bali dan aspirasi spiritual dalam memberikan rekomendasi.
                </p>
              </div>
              
              <div className="bg-background-light dark:bg-surface-dark p-10 rounded-[2rem] border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                  <span className="material-icons-outlined text-accent-gold group-hover:text-white text-3xl">lock</span>
                </div>
                <h4 className="font-display text-2xl font-bold mb-4">Apa itu Wuku?</h4>
                <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
                  Berkomunikasi dengan tenang melalui platform terenkripsi kami yang menjaga privasi percakapan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h3 className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-3">Match Categories</h3>
                <h2 className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50">Temukan Bali Categoria</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { name: 'Sri', sub: '(Kesejahteraan)', icon: 'spa' },
                { name: 'Dana', sub: '(Kekayaan)', icon: 'savings' },
                { name: 'Laba', sub: '(Keuntungan)', icon: 'trending_up' },
                { name: 'Sakti', sub: '(Kekuatan)', icon: 'fitness_center' },
                { name: 'Tiwas', sub: '(Kematian)', icon: 'self_improvement' },
              ].map((item) => (
                <div key={item.name} className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-accent-gold/20 text-center hover:border-primary transition-colors cursor-pointer group">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform">
                    <span className="material-icons-outlined text-primary text-5xl">{item.icon}</span>
                  </div>
                  <h5 className="font-display text-xl font-bold mb-1">{item.name}</h5>
                  <p className="text-stone-400 text-sm">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
