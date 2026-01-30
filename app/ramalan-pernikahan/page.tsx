"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Disclaimer from '@/components/Disclaimer';
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function RamalanPernikahan() {
    const [person1Date, setPerson1Date] = useState('');
    const [person2Date, setPerson2Date] = useState('');
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleCalculate = () => {
        if (!person1Date || !person2Date) {
            alert('Mohon lengkapi kedua tanggal lahir');
            return;
        }

        setIsLoading(true);
        setShowResults(false);
        setTimeout(() => {
            const compatibility = calculateCompatibility(new Date(person1Date), new Date(person2Date));
            setResult(compatibility);
            setIsLoading(false);
            setTimeout(() => setShowResults(true), 100);
        }, 800);
    };

    const handleReset = () => {
        setPerson1Date('');
        setPerson2Date('');
        setResult(null);
        setShowResults(false);
    };

    return (
        <div className="bg-background-light font-sans text-stone-800 transition-colors duration-300 min-h-screen">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16">
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

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="material-icons-outlined text-sm">hourglass_bottom</span>
                            Ramalan Jangka Panjang
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-6">
                            Prediksi 5 Tahun Pernikahan
                        </h1>
                        <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Ketahui siklus pasang surut kehidupan rumah tangga Anda berdasarkan perhitungan Neptu estafet warisan leluhur.
                        </p>
                    </div>
                </section>

                {/* Input Section */}
                <section className="pb-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-white/50 backdrop-blur-sm relative overflow-hidden mb-12">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/80 to-accent-gold/80"></div>
                            <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">Tanggal Lahir Anda</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-stone-400 group-focus-within:text-primary transition-colors">calendar_today</span>
                                        </div>
                                        <input
                                            type="date"
                                            value={person1Date}
                                            onChange={(e) => setPerson1Date(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-xl bg-stone-50 border-2 border-transparent focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-stone-800 placeholder-stone-400"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-stone-700 uppercase tracking-wide">Tanggal Lahir Pasangan</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-outlined text-stone-400 group-focus-within:text-accent-gold transition-colors">event</span>
                                        </div>
                                        <input
                                            type="date"
                                            value={person2Date}
                                            onChange={(e) => setPerson2Date(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 rounded-xl bg-stone-50 border-2 border-transparent focus:border-accent-gold/30 focus:bg-white focus:ring-4 focus:ring-accent-gold/10 transition-all outline-none font-medium text-stone-800 placeholder-stone-400"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 text-center">
                                <button
                                    onClick={handleCalculate}
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-xl shadow-stone-900/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="material-icons-outlined animate-spin">refresh</span>
                                            Menghitung...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons-outlined">insights</span>
                                            Lihat Prediksi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {result && (
                            <div id="result-section" className="space-y-8 animate-fade-in-up scroll-mt-24">
                                {result.marriageCycles && (
                                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-stone-100">
                                        <div className="text-center mb-8">
                                            <h3 className="font-display text-2xl font-bold mb-2 text-stone-800">⏳ Ramalan 5 Tahun Pernikahan</h3>
                                            <p className="text-stone-500 text-sm">Peta perjalanan rumah tangga berdasarkan siklus penurunan Neptu</p>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-stone-50 text-stone-600">
                                                        <th className="py-3 px-4 text-left rounded-l-xl">Rentang Tahun</th>
                                                        <th className="py-3 px-4 text-center">Nilai</th>
                                                        <th className="py-3 px-4 text-center">Posisi</th>
                                                        <th className="py-3 px-4 text-left rounded-r-xl">Makna</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-stone-100">
                                                    {result.marriageCycles.map((cycle, idx) => {
                                                        const isGood = ['Sri', 'Gedong', 'Sama'].includes(cycle.result);
                                                        const isBad = ['Pati', 'Pete'].includes(cycle.result);

                                                        return (
                                                            <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                                                                <td className="py-3 px-4 font-medium text-stone-700 whitespace-nowrap">
                                                                    Tahun ke {cycle.startYear}-{cycle.endYear}
                                                                </td>
                                                                <td className="py-3 px-4 text-center text-stone-500">
                                                                    {cycle.value}
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold w-20
                                                                        ${isGood ? 'bg-green-100 text-green-700' : ''}
                                                                        ${isBad ? 'bg-red-100 text-red-700' : ''}
                                                                    `}>
                                                                        {cycle.result}
                                                                    </span>
                                                                </td>
                                                                <td className={`py-3 px-4 font-medium
                                                                    ${isGood ? 'text-green-800' : ''}
                                                                    ${isBad ? 'text-red-800' : ''}
                                                                `}>
                                                                    {cycle.meaning}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-6 text-center">
                                            <p className="text-xs text-stone-400 italic">
                                                *Perhitungan ini menggunakan metode penurunan estafet: Nilai Tahun Berikutnya = Nilai Sekarang - (Nilai Sekarang div 5).
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <Disclaimer />
                            </div>
                        )}
                    </div>
                </section>
                <Footer />
            </main>
        </div>
    );
}
