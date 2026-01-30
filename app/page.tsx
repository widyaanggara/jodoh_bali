"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { calculateCompatibility, getKategoriColor, getKategoriBgColor } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function Home() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = () => {
    if (!date1 || !date2) {
      alert('Mohon lengkapi kedua tanggal lahir');
      return;
    }

    setIsLoading(true);
    // Simulate calculation delay for effect
    setTimeout(() => {
      const compatibility = calculateCompatibility(new Date(date1), new Date(date2));
      setResult(compatibility);
      setShowPopup(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-accent-gold/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-accent-gold text-3xl">flare</span>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">Jodoh Bali</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-800">
            <Link href="/" className="text-primary font-bold border-b-2 border-primary pb-1">Beranda</Link>
            <Link href="/kecocokan-pasangan" className="hover:text-primary transition-colors">Kecocokan Pasangan</Link>
            <Link href="/mencari-jodoh" className="hover:text-primary transition-colors">Mencari Jodoh</Link>
            <Link href="/ramalan-otonan" className="hover:text-primary transition-colors">Ramalan Otonan</Link>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute -top-10 -left-20 w-80 h-80 rotate-12 filter grayscale brightness-150 opacity-20 dark:opacity-5 lotus-bg">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI_aEU4azrZzqWAUFu0f7UDVVS1WRTjfY-E5JMoMD3yb3SgZ9bEd9ZQVDopTLqvUpo474bGsB9xuVCBukFh85LApcqIvPRkCah0R85illdaRHE1yJqLOIHZFn1DSkVYDh5E3TvVIqwqQE1yEsgje2bmeTEw22bTBoWD6WMA5335yOjghZV0thcyzXcXuljBURdiF56qe-PoATRgtvUPb-5W23BuxFZBK3I1qLUd7L_RocoiNdZWhwxnoCWq6eIh9EtripPBWzgSw"
            alt="Hibiscus illustration"
            width={320}
            height={320}
            className="object-contain"
          />
        </div>
        <div className="absolute -bottom-10 -right-20 w-96 h-96 -rotate-12 filter grayscale brightness-150 opacity-20 dark:opacity-5 lotus-bg">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5n4xrL-Qx7RTyVysEsBHIJJvfU6SJetYBnQPfypldKnLbunkehldV7RNxo6TW2F2TUEUwL2RtqiqKNgavqvcWcXWSCTdFhx86dfFKRuSZquugLyuk3mbFssZ-3hsGPvoIIiFesRmHrbSNA9xW_97WENH0siqj6wJxdfADG_qKxQGgsbemj-DcAih82CZ7wBrYY4x0ZZYLe1YGfH6qu6ckuehwg6uq5vHucRx9kP97TJxo1KttFsILfpYM-9U_YIH_NcUNVk2K7Q"
            alt="Lotus illustration"
            width={384}
            height={384}
            className="object-contain"
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest mb-8">
            <span className="material-icons-outlined text-sm">favorite</span>
            Aplikasi Kencan #1 di Bali
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-black  leading-tight mb-6">
            Jodoh Bali <br />
            <span className="italic text-primary">Cinta Sejati Berdasarkan</span> <br />
            Kalender & Nilai Tradisi
          </h1>
          <p className="text-lg text-stone-700  mb-10 max-w-2xl mx-auto leading-relaxed">
            Temukan pasangan yang berbagi nilai spiritual, budaya, dan kecintaan pada warisan leluhur Bali. Mulailah perjalanan cintamu hari ini.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/kecocokan-pasangan" className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300">
              Cek Kecocokan Pasangan
            </Link>
            <Link href="/mencari-jodoh" className="w-full sm:w-auto px-8 py-4 rounded-full gradient-button text-white font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
              Temukan Jodoh Ideal
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-20">
          <div className="bg-surface-light  p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-stone-200 dark:shadow-none border border-accent-gold/10">
            <h3 className="text-center font-display text-xl font-bold text-primary  mb-6">Masukkan Tanggal Lahir Pasangan</h3>
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="flex-1 w-full space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 dark:text-stone-400 ml-1">Tanggal Lahir Anda</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-accent-gold transition-colors">calendar_month</span>
                  <input
                    type="date"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl text-stone-800 dark:text-stone-200 focus:ring-primary focus:border-primary text-sm transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 w-full space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 dark:text-stone-400 ml-1">Tanggal Lahir Pasangan</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-accent-gold transition-colors">calendar_month</span>
                  <input
                    type="date"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl text-stone-800 dark:text-stone-200 focus:ring-primary focus:border-primary text-sm transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full md:w-auto px-10 py-4 gradient-button text-white rounded-2xl font-bold flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined">analytics</span>
                )}
                {isLoading ? 'Menghitung...' : 'Cek Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-3">Kenapa Bali Love?</h3>
            <h2 className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50">Pengalaman Kencan Tradisional & Modern</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background-light dark:bg-surface-dark p-10 rounded-[2rem] border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-icons-outlined text-accent-gold text-3xl">verified_user</span>
              </div>
              <h4 className="font-display text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Kecocokan Pasangan</h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Keamanan adalah prioritas kami. Semua profil melalui proses verifikasi ketat untuk memastikan keaslian.
              </p>
            </div>
            <div className="bg-background-light dark:bg-surface-dark p-10 rounded-[2rem] border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-icons-outlined text-accent-gold text-3xl">synagogue</span>
              </div>
              <h4 className="font-display text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Mencari Jodoh</h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Algoritma kami mempertimbangkan nilai-nilai tradisional Bali dan aspirasi spiritual dalam memberikan rekomendasi.
              </p>
            </div>
            <div className="bg-background-light dark:bg-surface-dark p-10 rounded-[2rem] border border-accent-gold/10 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8">
                <span className="material-icons-outlined text-accent-gold text-3xl">lock</span>
              </div>
              <h4 className="font-display text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">Apa itu Wuku?</h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Berkomunikasi dengan tenang melalui platform terenkripsi kami yang menjaga privasi percakapan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h3 className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-3">Kategori Kecocokan</h3>
              <h2 className="font-display text-4xl font-bold text-stone-900 dark:text-stone-50">Temukan Bali Categoria</h2>
            </div>
            <Link href="#" className="text-accent-gold font-bold flex items-center gap-2 group">
              Lihat Semua
              <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-accent-gold/20 text-center hover:border-primary transition-colors cursor-pointer group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-primary text-5xl">spa</span>
              </div>
              <h5 className="font-display text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Sri</h5>
              <p className="text-stone-500 dark:text-stone-400 text-sm">(Kesejahteraan)</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-accent-gold/20 text-center hover:border-primary transition-colors cursor-pointer group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-primary text-5xl">savings</span>
              </div>
              <h5 className="font-display text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Dana</h5>
              <p className="text-stone-500 dark:text-stone-400 text-sm">(Kekayaan)</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-accent-gold/20 text-center hover:border-primary transition-colors cursor-pointer group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-primary text-5xl">trending_up</span>
              </div>
              <h5 className="font-display text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Laba</h5>
              <p className="text-stone-500 dark:text-stone-400 text-sm">(Keuntungan)</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-accent-gold/20 text-center hover:border-primary transition-colors cursor-pointer group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-primary text-5xl">fitness_center</span>
              </div>
              <h5 className="font-display text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Sakti</h5>
              <p className="text-stone-500 dark:text-stone-400 text-sm">(Kekuatan)</p>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] border border-accent-gold/20 text-center hover:border-primary transition-colors cursor-pointer group">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-primary text-5xl">self_improvement</span>
              </div>
              <h5 className="font-display text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Tiwas</h5>
              <p className="text-stone-500 dark:text-stone-400 text-sm">(Kematian)</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-stone-50 dark:bg-stone-950 pt-20 pb-10 border-t border-accent-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-icons-outlined text-accent-gold text-2xl">flare</span>
                <span className="font-display text-xl font-bold text-primary">Jodoh Bali</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">
                Menghubungkan hati di Pulau Dewata dengan sentuhan modern dan nilai tradisional.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <span className="material-icons-outlined text-lg">language</span>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <span className="material-icons-outlined text-lg">alternate_email</span>
                </Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold text-stone-900 dark:text-stone-100 mb-6">Perusahaan</h6>
              <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400">
                <li><Link href="#" className="hover:text-primary">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-primary">Karir</Link></li>
                <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-stone-900 dark:text-stone-100 mb-6">Dukungan</h6>
              <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400">
                <li><Link href="#" className="hover:text-primary">Pusat Bantuan</Link></li>
                <li><Link href="#" className="hover:text-primary">Tips Keamanan</Link></li>
                <li><Link href="#" className="hover:text-primary">Aturan Keamanan</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-stone-900 dark:text-stone-100 mb-6">Legal</h6>
              <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-400">
                <li><Link href="#" className="hover:text-primary">Kebijakan Privasi</Link></li>
                <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="hover:text-primary">Kebijakan Cookie</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-accent-gold/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-500 dark:text-stone-600">
              © 2024 Jodoh Bali. Dibuat dengan cinta di Pulau Dewata. Seluruh hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-6 text-xs text-stone-400">
              <span className="material-icons-outlined text-sm">verified</span> Terverifikasi Aman
            </div>
          </div>

        </div>
      </footer>

      {/* Result Popup */}
      {showPopup && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-[2rem] shadow-2xl max-w-lg w-full p-8 relative overflow-hidden border border-accent-gold/20">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <span className="material-icons-outlined text-stone-500">close</span>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-accent-gold text-3xl">favorite</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-stone-800 dark:text-stone-100 mb-1">Hasil Kecocokan</h3>
              <p className="text-stone-500 text-sm mb-6">Berdasarkan perhitungan Tenung Urip Panca</p>

              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-6 mb-6 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-700">
                      <th className="text-left py-2 font-bold text-stone-700 dark:text-stone-300">Wewaran</th>
                      <th className="text-left py-2 font-bold text-stone-700 dark:text-stone-300">Urip Anda</th>
                      <th className="text-left py-2 font-bold text-stone-700 dark:text-stone-300">Pasangan</th>
                    </tr>
                  </thead>
                  <tbody className="text-stone-600 dark:text-stone-400">
                    <tr className="border-b border-stone-100 dark:border-stone-800">
                      <td className="py-2 text-left">Panca Wara</td>
                      <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.pancawara.nama} = {result.person1.pancawara.urip}</td>
                      <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.pancawara.nama} = {result.person2.pancawara.urip}</td>
                    </tr>
                    <tr className="border-b border-stone-100 dark:border-stone-800">
                      <td className="py-2 text-left">Wuku</td>
                      <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.wuku.nama_wuku} = {result.person1.wuku.id_wuku % 10}</td>
                      <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.wuku.nama_wuku} = {result.person2.wuku.id_wuku % 10}</td>
                    </tr>
                    <tr className="bg-stone-100 dark:bg-stone-800 font-bold text-stone-800 dark:text-stone-200">
                      <td className="py-3 text-left pl-2 rounded-l-lg">Jumlah</td>
                      <td className="py-3 text-left">{result.person1.totalUrip}</td>
                      <td className="py-3 text-left rounded-r-lg">{result.person2.totalUrip}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4 pt-4 border-t border-dashed border-stone-200 dark:border-stone-700 text-left">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1">Perhitungan</p>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                    {result.person1.totalUrip} + {result.person2.totalUrip} = {result.totalUrip} <span className="text-stone-400">dibagi 5</span> <span className="text-primary font-bold">sisa {result.kategori.sisa}</span>
                  </p>
                </div>
              </div>

              <div className="text-left mb-8 px-2">
                <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                  Anda lahir pada {result.person1.saptawara.hari.split('/')[0]} {result.person1.pancawara.nama} {result.person1.wuku.nama_wuku}, jumlah urip anda adalah {result.person1.totalUrip}.
                  Sedangkan pasangan anda pada {result.person2.saptawara.hari.split('/')[0]} {result.person2.pancawara.nama} {result.person2.wuku.nama_wuku} dan jumlah uripnya adalah {result.person2.totalUrip}.
                  Berdasarkan ramalan perjodohan dari Lontar Tri Pramana, pasangan ini akan {result.kategori.makna.toLowerCase()}.
                </p>
              </div>

              <Link
                href="/kecocokan-pasangan"
                className="block w-full py-4 rounded-xl gradient-button text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Lihat Detail Lengkap
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
