'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { calculateLeadershipSynergy, LeadershipSynergyResult } from '@/lib/synergy-logic';
import { useSession } from '@/components/SessionProvider';

export default function Samyoga() {
    const [date1, setDate1] = useState('');
    const [time1, setTime1] = useState('12:00');
    const [date2, setDate2] = useState('');
    const [time2, setTime2] = useState('12:00');
    const [result, setResult] = useState<LeadershipSynergyResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { sessionID, logActivity } = useSession();

    const handleReset = () => {
        setDate1('');
        setDate2('');
        setTime1('12:00');
        setTime2('12:00');
        setResult(null);
    };

    const handleCalculate = () => {
        if (!date1 || !date2) return;

        setIsLoading(true);

        // Simulate calculation delay for effect (Splash screen will show)
        setTimeout(() => {
            const res = calculateLeadershipSynergy(
                new Date(date1),
                time1,
                new Date(date2),
                time2
            );
            setResult(res);

            // Log aktivitas menggunakan session
            logActivity('samyoga', date1, date2, time1, time2);

            setIsLoading(false);
        }, 3000);
    };

    return (
        <div className="bg-background-light font-sans text-stone-800 transition-colors duration-300 min-h-screen">
            <Header />

            <main className="pb-24">
                {/* Hero Section */}
                <section className="pt-20 pb-12 px-6 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="text-6xl mb-6 block animate-pulse">🤝</span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6">
                            Samyoga
                        </h1>
                        <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Samyoga adalah fitur analisis kecocokan strategis yang dirancang untuk memetakan potensi sinergi antara dua individu dalam struktur organisasi atau pemerintahan. Diambil dari istilah Kawi/Sanskerta yang berarti "Penyatuan" atau "Pertautan yang Harmonis", fitur ini melampaui sekadar perjodohan kerja biasa.
                        </p>
                    </div>
                </section>

                {/* Input Section */}
                {!result && !isLoading && (
                    <section className="max-w-4xl mx-auto px-6 mb-16 fade-in">
                        <div className="bg-white border border-accent-gold/20 p-8 md:p-12 rounded-4xl shadow-xl shadow-stone-200/50 relative overflow-hidden">
                            {/* Decorative decorative elements */}
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <span className="material-icons-outlined text-9xl text-primary">handshake</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                {/* Partner A */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">A</div>
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Mitra Kolaborasi A (Lead)</label>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">calendar_today</span>
                                            <input
                                                type="date"
                                                value={date1}
                                                onChange={(e) => setDate1(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">schedule</span>
                                            <input
                                                type="time"
                                                value={time1}
                                                onChange={(e) => setTime1(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Partner B */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center font-bold text-sm">B</div>
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500">Mitra Kolaborasi B (Co-Lead)</label>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">calendar_today</span>
                                            <input
                                                type="date"
                                                value={date2}
                                                onChange={(e) => setDate2(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">schedule</span>
                                            <input
                                                type="time"
                                                value={time2}
                                                onChange={(e) => setTime2(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10">
                                <button
                                    onClick={handleCalculate}
                                    disabled={!date1 || !date2 || isLoading}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Menganalisis...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons-outlined">analytics</span>
                                            Analisis Samyoga
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Splash Screen */}
                {isLoading && <SplashScreen message="Memproses Integrasi Strategis..." />}

                {/* Result Section */}
                {result && !isLoading && (
                    <section className="max-w-5xl mx-auto px-6 fade-in">

                        {/* Executive Summary Badge */}
                        <div className="flex justify-center mb-12">
                            <div className="bg-white border border-stone-200 shadow-sm rounded-full px-8 py-3 flex items-center gap-4">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Tingkat Integrasi</span>
                                <div className="h-4 w-px bg-stone-200"></div>
                                <span className={`font-bold ${result.synergyTier.tier === 'Tier 1' ? 'text-accent-gold' :
                                    result.synergyTier.tier === 'Tier 2' ? 'text-emerald-600' :
                                        result.synergyTier.tier === 'Tier 5' ? 'text-red-600' :
                                            'text-blue-600'
                                    }`}>
                                    {result.synergyTier.tier} - {result.synergyTier.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Left Column: Profile A */}
                            <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-lg">
                                <div className="flex items-center gap-4 mb-6 border-b border-stone-100 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-bold text-lg">A</div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Komponen SDM A</p>
                                        <h3 className="font-display font-bold text-lg text-stone-800">{result.person1.lintang?.lintang || '-'}</h3>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Saptawara</span>
                                        <span className="font-semibold text-stone-700">{result.person1.saptawara.hari}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Pancawara</span>
                                        <span className="font-semibold text-stone-700">{result.person1.pancawara.nama}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Total Urip</span>
                                        <span className="font-bold bg-stone-100 px-2.5 py-1 rounded-lg text-stone-600">{result.person1.totalUrip}</span>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-stone-100">
                                        <p className="text-[10px] text-stone-400 uppercase font-bold mb-2 tracking-wider">Atribut Kompetensi</p>
                                        <p className="text-stone-600 italic leading-relaxed text-sm bg-stone-50 p-3 rounded-xl border border-stone-100">
                                            "{result.person1.lintang?.label}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Profile B */}
                            <div className="bg-white rounded-4xl p-8 border border-stone-100 shadow-lg">
                                <div className="flex items-center gap-4 mb-6 border-b border-stone-100 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 text-accent-gold flex items-center justify-center font-bold text-lg">B</div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Komponen SDM B</p>
                                        <h3 className="font-display font-bold text-lg text-stone-800">{result.person2.lintang?.lintang || '-'}</h3>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Saptawara</span>
                                        <span className="font-semibold text-stone-700">{result.person2.saptawara.hari}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Pancawara</span>
                                        <span className="font-semibold text-stone-700">{result.person2.pancawara.nama}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Total Urip</span>
                                        <span className="font-bold bg-stone-100 px-2.5 py-1 rounded-lg text-stone-600">{result.person2.totalUrip}</span>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-stone-100">
                                        <p className="text-[10px] text-stone-400 uppercase font-bold mb-2 tracking-wider">Atribut Kompetensi</p>
                                        <p className="text-stone-600 italic leading-relaxed text-sm bg-stone-50 p-3 rounded-xl border border-stone-100">
                                            "{result.person2.lintang?.label}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Synergy Analysis (Main Focus) - Full Width */}
                        <div className="bg-primary text-white rounded-4xl p-10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 mb-12">
                            <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] opacity-10 pointer-events-none"></div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-gold rounded-full blur-[60px] opacity-40"></div>

                            <div className="relative z-10 text-center md:text-left md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-10">
                                <p className="text-white text-center font-bold tracking-[0.2em] text-[15px] uppercase mb-2">HASIL KALKULASI</p>

                                <div className="flex items-center justify-center md:justify-center gap-4 mb-8">
                                    <span className="text-7xl font-display font-bold">{result.modulo16}</span>
                                </div>

                                <p className="text-white/60 text-center text-xs font-mono bg-white/10 px-3 py-1 rounded-full">
                                    Total Urip {result.person1.totalUrip} + {result.person2.totalUrip} MOD 16
                                </p>
                            </div>

                            <div className="relative z-10 md:w-2/3 space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">Analisis Strategis</h4>
                                    <p className="text-xl font-medium leading-relaxed text-white">
                                        "{result.synergyTier.analisis}"
                                    </p>
                                </div>

                                <div className="bg-white/40 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-gold mb-2">Rekomendasi</h4>
                                    <p className="text-base text-white/90 leading-relaxed">
                                        {result.synergyTier.rekomendasi}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sodasa Rsi Detail */}
                        <div className="bg-white rounded-4xl border border-stone-200 shadow-lg overflow-hidden mb-12">
                            <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                                    <span className="material-icons-outlined">library_books</span>
                                    Referensi Lontar: Sodasa Rsi
                                </h3>
                                <span className="text-xs font-mono font-bold text-stone-500 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-sm">
                                    Sisa Perhitungan: {result.modulo16}
                                </span>
                            </div>
                            <div className="p-8 md:p-10">
                                <div className="grid md:grid-cols-3 gap-10">
                                    <div className="relative">
                                        <div className="pl-4 border-l-2 border-accent-gold/30">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Label</p>
                                            <p className="font-display font-bold text-2xl text-primary">{result.sodasaRsi.label}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="pl-4 border-l-2 border-stone-200">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Makna Simbolis</p>
                                            <p className="font-medium text-lg text-stone-700">{result.sodasaRsi.makna}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="pl-4 border-l-2 border-stone-200">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Penjelasan Klasik</p>
                                            <p className="text-stone-600 italic leading-relaxed text-sm">"{result.sodasaRsi.penjelasan}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="flex justify-center mt-12 mb-8">
                            <button
                                onClick={handleReset}
                                className="bg-white border border-stone-200 text-stone-600 px-8 py-3 rounded-2xl font-bold hover:bg-stone-50 hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <span className="material-icons-outlined text-sm">refresh</span>
                                Analisis Ulang Samyoga
                            </button>
                        </div>

                    </section>
                )}
            </main>

            <Footer />
        </div >
    );
}
