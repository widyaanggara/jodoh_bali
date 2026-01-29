'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResultCard from '@/components/ResultCard';
import HeartMeter from '@/components/HeartMeter';
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function KecocokanPasangan() {
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleCalculate = () => {
        if (!date1 || !date2) {
            alert('Mohon masukkan kedua tanggal lahir');
            return;
        }

        setIsLoading(true);
        setShowResults(false);

        setTimeout(() => {
            const compatibility = calculateCompatibility(
                new Date(date1),
                new Date(date2)
            );
            setResult(compatibility);
            setIsLoading(false);

            // Delay showing results for smooth animation
            setTimeout(() => setShowResults(true), 100);
        }, 800);
    };

    const handleReset = () => {
        setDate1('');
        setDate2('');
        setResult(null);
        setShowResults(false);
    };

    return (
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
                        </div>
                    </div>
                </section>

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
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-accent-gold/5 rounded-2xl p-6 text-center border border-accent-gold/10">
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">
                                            Total nilai urip gabungan: <span className="text-primary font-bold text-xl ml-2">{result.totalUrip}</span>
                                            <br />
                                            <span className="text-[10px] uppercase tracking-widest opacity-50">({result.person1.totalUrip} + {result.person2.totalUrip})</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}


                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
}
