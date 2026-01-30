"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeartMeter from '@/components/HeartMeter';
import Disclaimer from '@/components/Disclaimer';
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function KecocokanPasangan() {
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
            // Delay showing results for smooth animation
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
                        <h1 className="font-display text-5xl md:text-6xl font-bold text-accent-gold leading-tight mb-6 slide-up">
                            Cek Kecocokan Pasangan
                        </h1>
                        <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed slide-up delay-100">
                            Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan berdasarkan kalender tradisional Bali.
                        </p>

                        <div className="max-w-xl mx-auto slide-up delay-200">
                            <div className="bg-surface-light p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200 border border-accent-gold/10">
                                <div className="space-y-8">
                                    <div className="space-y-3 text-left group">
                                        <label htmlFor="date1" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-1">Tanggal Lahir Anda</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">calendar_month</span>
                                            <input
                                                id="date1"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-stone-200 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                                                type="date"
                                                value={person1Date}
                                                onChange={(e) => setPerson1Date(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-left group">
                                        <label htmlFor="date2" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-1">Tanggal Lahir Pasangan</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">favorite</span>
                                            <input
                                                id="date2"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-stone-200 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                                                type="date"
                                                value={person2Date}
                                                onChange={(e) => setPerson2Date(e.target.value)}
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

                            {/* Heart Meter - Main Visual Focus */}
                            <HeartMeter
                                percentage={result.percentage}
                                kategori={result.kategori}
                                isVisible={showResults}
                            />

                            {/* Detailed Result Card */}
                            <div className="bg-surface-light p-8 md:p-10 rounded-[2.5rem] border border-accent-gold/10 shadow-xl shadow-stone-200/50 slide-up delay-200">
                                <div className="text-center mb-8">
                                    <h3 className="font-display text-2xl font-bold mb-2">Detail Perhitungan</h3>
                                    <p className="text-stone-500 text-sm">Berdasarkan perhitungan Tenung Urip Panca</p>
                                </div>

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
                                        </p>
                                    </div>
                                </div>

                                <div className="text-left mb-8 px-2">
                                    <p className="text-stone-700 text-sm leading-relaxed">
                                        Anda lahir pada {result.person1.saptawara.hari.split('/')[0]} {result.person1.pancawara.nama} {result.person1.wuku.nama_wuku}, jumlah urip anda adalah {result.person1.totalUrip}.
                                        Sedangkan pasangan anda pada {result.person2.saptawara.hari.split('/')[0]} {result.person2.pancawara.nama} {result.person2.wuku.nama_wuku} dan jumlah uripnya adalah {result.person2.totalUrip}.
                                        Berdasarkan ramalan perjodohan dari Lontar Tri Pramana, pasangan ini akan {result.kategori.makna.toLowerCase()}.
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-block px-8 py-4 bg-accent-gold/10 rounded-2xl">
                                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Kategori</p>
                                        <p className="text-2xl font-bold text-primary">{result.kategori.kategori}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <Disclaimer />
                        </div>
                    </section>
                )}

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
}
