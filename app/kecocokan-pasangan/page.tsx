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


                            {/* Detailed Result Card - Mod 5 (Aspek Rezeki) */}
                            <div className="bg-surface-light p-8 md:p-10 rounded-[2.5rem] border border-accent-gold/10 shadow-xl shadow-stone-200/50 slide-up delay-200">
                                <div className="text-center mb-8">
                                    <h3 className="font-display text-2xl font-bold mb-2">📊 Aspek Rezeki (Mod 5)</h3>
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
                                                <td className="py-2 text-left">Sapta Wara</td>
                                                <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.saptawara.hari.split('/')[0]} = {result.person1.saptawara.urip}</td>
                                                <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.saptawara.hari.split('/')[0]} = {result.person2.saptawara.urip}</td>
                                            </tr>
                                            <tr className="border-b border-stone-100">
                                                <td className="py-2 text-left">Panca Wara</td>
                                                <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.pancawara.nama} = {result.person1.pancawara.urip}</td>
                                                <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.pancawara.nama} = {result.person2.pancawara.urip}</td>
                                            </tr>
                                            {/* Wuku EXCLUDED for Mod 5 */}
                                            <tr className="bg-stone-100 font-bold text-stone-800">
                                                <td className="py-3 text-left pl-2 rounded-l-lg">Jumlah</td>
                                                <td className="py-3 text-left">{result.person1.totalUrip}</td>
                                                <td className="py-3 text-left rounded-r-lg">{result.person2.totalUrip}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="mt-4 pt-4 border-t border-dashed border-stone-200 text-left">
                                        <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1">Perhitungan Mod 5 (Sapta + Panca)</p>
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

                            {/* Mod 16 Result Card - Aspek Karakter & Wibawa */}
                            {result.mod16Result && (
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 md:p-10 rounded-[2.5rem] border border-purple-200/50 shadow-xl shadow-purple-100 slide-up delay-300">
                                    <div className="text-center mb-8">
                                        <h3 className="font-display text-2xl font-bold mb-2 text-purple-900">✨ Aspek Karakter & Wibawa (Mod 16)</h3>
                                        <p className="text-purple-600 text-sm">Berdasarkan Lontar Tripramana & Sodasa Rsi</p>
                                    </div>

                                    {/* Detail Calculation Table */}
                                    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-6">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-purple-200">
                                                    <th className="text-left py-2 font-bold text-purple-700">Wewaran</th>
                                                    <th className="text-left py-2 font-bold text-purple-700">Urip Anda</th>
                                                    <th className="text-left py-2 font-bold text-purple-700">Pasangan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-purple-900">
                                                <tr className="border-b border-purple-100">
                                                    <td className="py-2 text-left">Sapta Wara</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.saptawara.hari.split('/')[0]} = {result.person1.saptawara.urip}</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.saptawara.hari.split('/')[0]} = {result.person2.saptawara.urip}</td>
                                                </tr>
                                                <tr className="border-b border-purple-100">
                                                    <td className="py-2 text-left">Panca Wara</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.pancawara.nama} = {result.person1.pancawara.urip}</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.pancawara.nama} = {result.person2.pancawara.urip}</td>
                                                </tr>
                                                {result.person1.sadwara && result.person2.sadwara && (
                                                    <tr className="border-b border-purple-100">
                                                        <td className="py-2 text-left">Sad Wara</td>
                                                        <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.sadwara.nama} = {result.person1.sadwara.urip}</td>
                                                        <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.sadwara.nama} = {result.person2.sadwara.urip}</td>
                                                    </tr>
                                                )}
                                                {/* Wuku EXCLUDED for Mod 16 as well */}
                                                <tr className="bg-purple-100 font-bold text-purple-900">
                                                    <td className="py-3 text-left pl-2 rounded-l-lg">Jumlah</td>
                                                    <td className="py-3 text-left">{result.person1.totalUripSodasaRsi}</td>
                                                    <td className="py-3 text-left rounded-r-lg">{result.person2.totalUripSodasaRsi}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="mt-4 pt-4 border-t border-dashed border-purple-200 text-left">
                                            <p className="text-xs font-medium text-purple-600 uppercase tracking-widest mb-1">Perhitungan Mod 16</p>
                                            <p className="text-sm font-medium text-purple-900">
                                                {result.person1.totalUripSodasaRsi} + {result.person2.totalUripSodasaRsi} = {result.combinedTotalUrip} <span className="text-purple-500">dibagi 16</span> <span className="text-purple-700 font-bold">sisa {result.mod16Result.sisa === 0 ? 16 : result.mod16Result.sisa}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Result Section */}
                                    <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                                        <div className="text-center mb-4">
                                            <div className="inline-block px-6 py-3 bg-purple-500 text-white rounded-xl mb-3">
                                                <p className="text-xs uppercase tracking-widest mb-1">Hasil Sodasa Rsi</p>
                                                <p className="text-3xl font-bold">{result.mod16Result.label}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-purple-50/50 rounded-xl p-4">
                                                <h4 className="text-xs uppercase tracking-widest font-bold text-purple-700 mb-2">📖 Makna</h4>
                                                <p className="text-purple-900 font-medium">{result.mod16Result.makna}</p>
                                            </div>

                                            <div className="bg-indigo-50/50 rounded-xl p-4">
                                                <h4 className="text-xs uppercase tracking-widest font-bold text-indigo-700 mb-2">💫 Penjelasan Lengkap</h4>
                                                <p className="text-indigo-900 leading-relaxed text-sm">{result.mod16Result.penjelasan}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-center">
                                            <p className="text-xs text-stone-400 italic">
                                                *Perhitungan ini menggunakan metode penurunan estafet: Nilai Tahun Berikutnya = Nilai Sekarang - (Nilai Sekarang div 5).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Match Conclusion Card - REQUESTED FEATURE */}
                            {result.matchConclusion && (
                                <div className={`relative overflow-hidden p-8 md:p-10 rounded-[2.5rem] slide-up delay-500 mb-20 shadow-xl
                                    ${result.matchConclusion.sentiment === 'positive' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 text-emerald-900' :
                                        result.matchConclusion.sentiment === 'neutral' ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/50 text-indigo-900' :
                                            'bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/50 text-rose-900'}
                                `}>
                                    <div className="text-center relative z-10">
                                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/60 mb-6 shadow-sm">
                                            <span className="text-3xl">🕊️</span>
                                        </div>
                                        <h3 className="font-display text-2xl font-bold mb-2">Kesimpulan Harmoni Pasangan</h3>
                                        <div className="h-1 w-20 bg-current opacity-20 mx-auto mb-6 rounded-full"></div>

                                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm ring-1 ring-black/5">
                                            <h4 className="font-bold text-xl mb-4">{result.matchConclusion.title}</h4>
                                            <p className="text-lg leading-relaxed opacity-90 font-serif italic">
                                                "{result.matchConclusion.content}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

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
