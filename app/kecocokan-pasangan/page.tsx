"use client";

import Link from 'next/link';
import { useState } from 'react';
<<<<<<< HEAD
=======
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResultCard from '@/components/ResultCard';
import HeartMeter from '@/components/HeartMeter';
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function KecocokanPasangan() {
    const [person1Date, setPerson1Date] = useState('');
    const [person2Date, setPerson2Date] = useState('');
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        if (!person1Date || !person2Date) {
            alert('Mohon lengkapi kedua tanggal lahir');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const compatibility = calculateCompatibility(new Date(person1Date), new Date(person2Date));
            setResult(compatibility);
            setIsLoading(false);
        }, 500);
    };

    const handleReset = () => {
        setPerson1Date('');
        setPerson2Date('');
        setResult(null);
    };

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-white">
            <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-accent-gold/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-accent-gold text-3xl">flare</span>
                        <span className="font-display text-2xl font-bold tracking-tight text-primary">Jodoh Bali</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-800">
                        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                        <Link href="/kecocokan-pasangan" className="text-primary font-bold border-b-2 border-primary pb-1">Kecocokan Pasangan</Link>
                        <Link href="/mencari-jodoh" className="hover:text-primary transition-colors">Mencari Jodoh</Link>
                        <Link href="/ramalan-otonan" className="hover:text-primary transition-colors">Ramalan Otonan</Link>
                    </div>
                    <div className="flex items-center gap-4">
                    </div>
                </div>
            </nav>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <span className="text-6xl mb-6 block">💕</span>
                        <h1 className="heading-1 mb-4 font-display text-4xl font-bold text-stone-900">
                            Cek <span className="text-primary italic">Kecocokan</span> Pasangan
                        </h1>
                        <p className="text-stone-600 max-w-lg mx-auto">
                            Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="bg-white border border-accent-gold/10 p-8 md:p-10 mb-10 rounded-4xl shadow-xl shadow-stone-200/50">
                        <div className="grid md:grid-cols-2 gap-8 mb-10 text-left">
                            <div className="space-y-3">
                                <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tanggal Lahir Anda</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">person</span>
                                    <input
                                        type="date"
                                        value={person1Date}
                                        onChange={(e) => setPerson1Date(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tanggal Lahir Pasangan</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">favorite</span>
                                    <input
                                        type="date"
                                        value={person2Date}
                                        onChange={(e) => setPerson2Date(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleCalculate}
                                disabled={isLoading}
                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 min-w-[200px]"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-lg">refresh</span>
                                        Menghitung...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">analytics</span>
                                        Cek Kecocokan
                                    </>
                                )}
                            </button>

                            {result && (
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">refresh</span>
                                    Reset
                                </button>
                            )}
=======
        <div className="bg-background-light dark:bg-background-dark font-sans text-stone-800 dark:text-stone-200 transition-colors duration-300 min-h-screen">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16">
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
                    
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h1 className="font-display text-5xl md:text-6xl font-bold text-accent-gold leading-tight mb-6 slide-up">
                            Cek Kecocokan Pasangan
                        </h1>
                        <p className="text-lg text-stone-600 dark:text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed slide-up delay-100">
                            Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan berdasarkan kalender tradisional Bali.
                        </p>
                        
                        <div className="max-w-xl mx-auto slide-up delay-200">
                            <div className="bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200 dark:shadow-none border border-accent-gold/10">
                                <div className="space-y-8">
                                    <div className="space-y-3 text-left group">
                                        <label htmlFor="date1" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-500 ml-1">Tanggal Lahir Anda</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">calendar_month</span>
                                            <input 
                                                id="date1"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none" 
                                                type="date"
                                                value={date1}
                                                onChange={(e) => setDate1(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-left group">
                                        <label htmlFor="date2" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-500 ml-1">Tanggal Lahir Pasangan</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">favorite</span>
                                            <input 
                                                id="date2"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none" 
                                                type="date"
                                                value={date2}
                                                onChange={(e) => setDate2(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleCalculate}
                                        disabled={isLoading}
                                        className="w-full py-5 gradient-button text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {isLoading ? (
                                            <span className="material-symbols-outlined animate-spin">autorenew</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                        )}
                                        {isLoading ? 'Menghitung...' : 'Cek Kecocokan'}
                                    </button>
                                    
                                    {result && (
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-3 text-stone-400 hover:text-primary transition-colors text-sm font-medium"
                                        >
                                            Reset Pencarian
                                        </button>
                                    )}
                                </div>
                            </div>
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
                        </div>
                    </div>
                </section>

<<<<<<< HEAD
                    {/* Results */}
                    {result && (
                        <div className="max-w-xl mx-auto slide-up">
                            <div className="bg-white rounded-4xl shadow-2xl p-8 relative overflow-hidden border border-accent-gold/20">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-icons-outlined text-accent-gold text-3xl">favorite</span>
                                    </div>

                                    <h3 className="font-display text-2xl font-bold text-stone-800 mb-1">Hasil Kecocokan</h3>
                                    <p className="text-stone-500 text-sm mb-6">Berdasarkan perhitungan Tenung Urip Panca</p>

                                    <div className="bg-stone-50 rounded-2xl p-6 mb-6 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-stone-200">
                                                    <th className="text-left py-2 font-bold text-stone-700">Wewaran</th>
                                                    <th className="text-left py-2 font-bold text-stone-700">Urip Anda</th>
                                                    <th className="text-left py-2 font-bold text-stone-700">Pasangan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-stone-600">
                                                <tr className="border-b border-stone-100">
                                                    <td className="py-2 text-left">Panca Wara</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.pancawara.nama} = {result.person1.pancawara.urip}</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.pancawara.nama} = {result.person2.pancawara.urip}</td>
                                                </tr>
                                                <tr className="border-b border-stone-100">
                                                    <td className="py-2 text-left">Wuku</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.wuku.nama_wuku} = {result.person1.wuku.id_wuku % 10}</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.wuku.nama_wuku} = {result.person2.wuku.id_wuku % 10}</td>
                                                </tr>
                                                <tr className="bg-stone-100 font-bold text-stone-800">
                                                    <td className="py-3 text-left pl-2 rounded-l-lg">Jumlah</td>
                                                    <td className="py-3 text-left">{result.person1.totalUrip}</td>
                                                    <td className="py-3 text-left rounded-r-lg">{result.person2.totalUrip}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="mt-4 pt-4 border-t border-dashed border-stone-200 text-left">
                                            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1">Perhitungan</p>
                                            <p className="text-sm font-medium text-stone-800">
                                                {result.person1.totalUrip} + {result.person2.totalUrip} = {result.totalUrip} <span className="text-stone-400">dibagi 5</span> <span className="text-primary font-bold">sisa {result.kategori.sisa}</span>
=======
                {/* Results Section */}
                {result && (
                    <section className="pb-24 px-6 relative z-10 fade-in">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Heart Meter */}
                            <HeartMeter
                                percentage={result.percentage}
                                kategori={result.kategori}
                                isVisible={showResults}
                            />

                            {/* Profile Cards */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <ResultCard
                                    title="Profil Anda"
                                    balineseDate={result.person1}
                                    delay={600}
                                />
                                <ResultCard
                                    title="Profil Pasangan"
                                    balineseDate={result.person2}
                                    delay={800}
                                />
                            </div>

                            {/* Insights */}
                            <div className="bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-[2.5rem] border border-accent-gold/10 shadow-xl shadow-stone-200/50 dark:shadow-none delay-1000 slide-up">
                                <h3 className="font-display text-2xl font-bold text-center mb-8">💡 Insight Tambahan</h3>
                                <div className="space-y-6">
                                    {(result.person1.wuku.rekomendasi_pasangan.includes(result.person2.wuku.nama_wuku) || 
                                      result.person2.wuku.rekomendasi_pasangan.includes(result.person1.wuku.nama_wuku)) && (
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                                            <p className="text-green-600 dark:text-green-400 text-center font-medium">
                                                ✨ Wuku kalian saling merekomendasikan! Ini adalah pertanda kecocokan yang sangat harmonis menurut tradisi.
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
                                            </p>
                                        </div>
                                    </div>

<<<<<<< HEAD
                                    <div className="text-left mb-8 px-2">
                                        <p className="text-stone-700 text-sm leading-relaxed">
                                            Anda lahir pada {result.person1.saptawara.hari.split('/')[0]} {result.person1.pancawara.nama} {result.person1.wuku.nama_wuku}, jumlah urip anda adalah {result.person1.totalUrip}.
                                            Sedangkan pasangan anda pada {result.person2.saptawara.hari.split('/')[0]} {result.person2.pancawara.nama} {result.person2.wuku.nama_wuku} dan jumlah uripnya adalah {result.person2.totalUrip}.
                                            Berdasarkan ramalan perjodohan dari Lontar Tri Pramana, pasangan ini akan {result.kategori.makna.toLowerCase()}.
=======
                                    <div className="bg-accent-gold/5 rounded-2xl p-6 text-center border border-accent-gold/10">
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">
                                            Total nilai urip gabungan: <span className="text-primary font-bold text-xl ml-2">{result.totalUrip}</span>
                                            <br />
                                            <span className="text-[10px] uppercase tracking-widest opacity-50">({result.person1.totalUrip} + {result.person2.totalUrip})</span>
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
<<<<<<< HEAD
                    )}
                </div>
            </section>

            <footer className="bg-stone-50 pt-20 pb-10 border-t border-accent-gold/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs text-stone-500">
                        © 2024 Jodoh Bali. Dibuat dengan cinta di Pulau Dewata. Seluruh hak cipta dilindungi.
                    </p>
                </div>
            </footer>
=======
                    </section>
                )}


                {/* Footer */}
                <Footer />
            </main>
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
        </div>
    );
}
