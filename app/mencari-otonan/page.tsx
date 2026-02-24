'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import Disclaimer from '@/components/Disclaimer';
import { getBalineseDate } from '@/lib/balinese-calendar';
import { BalineseDate } from '@/lib/types';
import {
    findMasehiDates,
    MasehiMatchResult,
    saptawaraOptions,
    pancawaraOptions,
    wukuOptions
} from '@/lib/otonan-logic';

type Mode = 'otonan' | 'tanggal';

export default function MencariOtonan() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>('otonan');

    // Mode 1 — Mencari Otonan (Masehi → Bali)
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('12:00');
    const [otonanResult, setOtonanResult] = useState<BalineseDate | null>(null);

    // Mode 2 — Mencari Tanggal Lahir (Bali → Masehi)
    const [selSaptawara, setSelSaptawara] = useState('');
    const [selPancawara, setSelPancawara] = useState('');
    const [selWuku, setSelWuku] = useState('');
    const [startYear, setStartYear] = useState(1945);
    const [endYear, setEndYear] = useState(2026);
    const [tanggalResults, setTanggalResults] = useState<MasehiMatchResult[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // ─── Handlers ────────────────────────────────────────────

    const handleSwitchMode = (newMode: Mode) => {
        if (newMode === mode) return;
        setMode(newMode);
        // Reset all state
        setBirthDate('');
        setBirthTime('12:00');
        setOtonanResult(null);
        setSelSaptawara('');
        setSelPancawara('');
        setSelWuku('');
        setStartYear(1945);
        setEndYear(2026);
        setTanggalResults([]);
        setHasSearched(false);
    };

    const handleSelectTanggal = (dateObj: Date) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        router.push(`/ramalan-otonan?date=${year}-${month}-${day}`);
    };

    const handleCariOtonan = () => {
        if (!birthDate) return;
        setIsLoading(true);
        setTimeout(() => {
            const result = getBalineseDate(new Date(birthDate), birthTime);
            setOtonanResult(result);
            setIsLoading(false);
        }, 2500);
    };

    const handleCariTanggal = () => {
        if (!selSaptawara || !selPancawara || !selWuku) return;
        setIsLoading(true);
        setTimeout(() => {
            const results = findMasehiDates(selSaptawara, selPancawara, selWuku, startYear, endYear);
            setTanggalResults(results);
            setHasSearched(true);
            setIsLoading(false);
        }, 2500);
    };

    const handleReset = () => {
        if (mode === 'otonan') {
            setBirthDate('');
            setBirthTime('12:00');
            setOtonanResult(null);
        } else {
            setSelSaptawara('');
            setSelPancawara('');
            setSelWuku('');
            setStartYear(1945);
            setEndYear(2026);
            setTanggalResults([]);
            setHasSearched(false);
        }
    };

    const showForm = mode === 'otonan' ? !otonanResult && !isLoading : !hasSearched && !isLoading;
    const showResult = mode === 'otonan' ? !!otonanResult && !isLoading : hasSearched && !isLoading;

    return (
        <div className="bg-background-light font-sans text-stone-800 min-h-screen">
            <Header />

            <main className="pb-24">
                {/* ── Hero Section ── */}
                <section className="pt-20 pb-8 px-6 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="text-6xl mb-6 block">🔍</span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                            Mencari <span className="text-primary italic">Otonan</span>
                        </h1>
                        <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Konversi dua arah antara kalender Masehi dan kalender Bali.
                            Temukan hari kelahiran Bali dari tanggal Masehi, atau cari tanggal Masehi dari kombinasi Wewaran dan Wuku.
                        </p>
                    </div>
                </section>

                {/* ── Mode Toggle ── */}
                <section className="max-w-md mx-auto px-6 mb-10">
                    <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-stone-100 flex gap-1.5">
                        <button
                            onClick={() => handleSwitchMode('otonan')}
                            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'otonan'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-stone-500 hover:bg-stone-50'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            Mencari Otonan
                        </button>
                        <button
                            onClick={() => handleSwitchMode('tanggal')}
                            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'tanggal'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-stone-500 hover:bg-stone-50'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">search</span>
                            Mencari Tanggal Lahir
                        </button>
                    </div>
                </section>

                {/* ── Form Section ── */}
                {showForm && (
                    <section className="max-w-xl mx-auto px-6 mb-16 fade-in">
                        <div className="bg-white border border-accent-gold/10 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-stone-200/50">

                            {/* Mode 1 — Masehi ke Bali */}
                            {mode === 'otonan' && (
                                <div className="space-y-6">
                                    <div className="text-center mb-2">
                                        <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Mode: Masehi → Bali</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tanggal Lahir Masehi</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">calendar_month</span>
                                            <input
                                                type="date"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Jam Lahir</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">schedule</span>
                                            <input
                                                type="time"
                                                value={birthTime}
                                                onChange={(e) => setBirthTime(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-stone-500 ml-1 italic">*Kelahiran subuh (00:00–06:00) otomatis menyesuaikan Dina Bali ke hari sebelumnya.</p>
                                    </div>

                                    <button
                                        onClick={handleCariOtonan}
                                        disabled={!birthDate || isLoading}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                        Cari Otonan
                                    </button>
                                </div>
                            )}

                            {/* Mode 2 — Bali ke Masehi */}
                            {mode === 'tanggal' && (
                                <div className="space-y-6">
                                    <div className="text-center mb-2">
                                        <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Mode: Bali → Masehi</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Saptawara</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg">today</span>
                                            <select
                                                value={selSaptawara}
                                                onChange={(e) => setSelSaptawara(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="">— Pilih Saptawara —</option>
                                                {saptawaraOptions.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Pancawara</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg">star</span>
                                            <select
                                                value={selPancawara}
                                                onChange={(e) => setSelPancawara(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="">— Pilih Pancawara —</option>
                                                {pancawaraOptions.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Wuku</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg">temple_buddhist</span>
                                            <select
                                                value={selWuku}
                                                onChange={(e) => setSelWuku(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="">— Pilih Wuku —</option>
                                                {wukuOptions.map(w => (
                                                    <option key={w} value={w}>{w}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Rentang Tahun */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tahun Mulai</label>
                                            <input
                                                type="number"
                                                value={startYear}
                                                onChange={(e) => setStartYear(Number(e.target.value))}
                                                min={1900}
                                                max={2100}
                                                className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none text-center"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tahun Akhir</label>
                                            <input
                                                type="number"
                                                value={endYear}
                                                onChange={(e) => setEndYear(Number(e.target.value))}
                                                min={1900}
                                                max={2100}
                                                className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none text-center"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCariTanggal}
                                        disabled={!selSaptawara || !selPancawara || !selWuku || isLoading}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-lg">manage_search</span>
                                        Cari Tanggal Masehi
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── Splash Screen ── */}
                {isLoading && <SplashScreen message={mode === 'otonan' ? 'Membaca peta kelahiran Anda...' : 'Mencari tanggal yang cocok...'} />}

                {/* ── Results ── */}
                {showResult && (
                    <section className="max-w-4xl mx-auto px-6 fade-in">

                        {/* Action buttons */}
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 rounded-full bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 hover:text-primary transition-colors shadow-sm flex items-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">restart_alt</span>
                                {mode === 'otonan' ? 'Cek Tanggal Lain' : 'Cari Ulang'}
                            </button>
                        </div>

                        {/* Mode 1 Result — Otonan */}
                        {mode === 'otonan' && otonanResult && (
                            <div className="space-y-8 slide-up max-w-2xl mx-auto">
                                <div className="space-y-8">
                                    {/* Kelahiran Bali Card */}
                                    <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-accent-gold/20">
                                        <h3 className="font-display text-2xl font-bold mb-6 text-stone-800">Kelahiran Bali</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                                <span className="text-stone-500">Saptawara</span>
                                                <span className="font-bold text-stone-800">{otonanResult.saptawara.hari}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                                <span className="text-stone-500">Pancawara</span>
                                                <span className="font-bold text-stone-800">{otonanResult.pancawara.nama}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                                <span className="text-stone-500">Wuku</span>
                                                <span className="font-bold text-primary">{otonanResult.wuku.nama_wuku}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                                <span className="text-stone-500">Total Urip</span>
                                                <span className="font-bold text-accent-gold text-lg">{otonanResult.totalUrip}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-stone-500">Next Otonan</span>
                                                <span className="font-bold text-emerald-600">{otonanResult.nextOtonan}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Wewaran Lengkap Card */}
                                {otonanResult.wewaran && (
                                    <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-accent-gold/20 slide-up">
                                        <h3 className="font-display text-2xl font-bold mb-6 text-stone-800 text-center">Wewaran Lengkap</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {[
                                                { label: 'Eka Wara', value: otonanResult.wewaran.ekawara },
                                                { label: 'Dwi Wara', value: otonanResult.wewaran.dwiwara },
                                                { label: 'Tri Wara', value: otonanResult.wewaran.triwara },
                                                { label: 'Catur Wara', value: otonanResult.wewaran.caturwara },
                                                { label: 'Panca Wara', value: otonanResult.wewaran.pancawara },
                                                { label: 'Sad Wara', value: otonanResult.wewaran.sadwara },
                                                { label: 'Sapta Wara', value: otonanResult.wewaran.saptawara },
                                                { label: 'Asta Wara', value: otonanResult.wewaran.asatawara },
                                                { label: 'Sanga Wara', value: otonanResult.wewaran.sangawara },
                                                { label: 'Dasa Wara', value: otonanResult.wewaran.dasawara },
                                            ].map((item, idx) => (
                                                <div key={idx} className="bg-stone-50 rounded-xl p-3 text-center border border-stone-100 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
                                                    <span className="block text-[10px] md:text-xs uppercase tracking-wider font-bold text-stone-400 mb-1">{item.label}</span>
                                                    <span className="block font-bold text-stone-800 text-sm md:text-base">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Wuku Detail Card */}
                                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-accent-gold/20 slide-up">
                                    <h3 className="font-display text-2xl font-bold mb-6 text-stone-800">Detail Wuku {otonanResult.wuku.nama_wuku}</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Deskripsi</h4>
                                            <p className="text-stone-700 text-sm leading-relaxed">{otonanResult.wuku.deskripsi}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Sifat Umum</h4>
                                            <p className="text-stone-700 text-sm leading-relaxed">{otonanResult.wuku.sifat_umum}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Kelebihan</h4>
                                            <p className="text-emerald-700 text-sm leading-relaxed">{otonanResult.wuku.kelebihan}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Kelemahan</h4>
                                            <p className="text-red-700 text-sm leading-relaxed">{otonanResult.wuku.kelemahan}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigate to Ramalan Otonan */}
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => router.push(`/ramalan-otonan?date=${birthDate}`)}
                                        className="px-8 py-4 w-full md:w-auto rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                        Cek Ramalan Otonan
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mode 2 Result — Tanggal Lahir */}
                        {mode === 'tanggal' && hasSearched && (
                            <div className="space-y-6 slide-up">
                                {/* Summary */}
                                <div className="text-center mb-4">
                                    <p className="text-stone-500 text-sm">
                                        Menampilkan hasil untuk <span className="font-bold text-stone-800">{selSaptawara} {selPancawara} Wuku {selWuku}</span>
                                    </p>
                                    <p className="text-stone-400 text-xs mt-1">
                                        Rentang: {startYear} – {endYear} &middot; Ditemukan <span className="font-bold text-primary">{tanggalResults.length}</span> tanggal
                                    </p>
                                </div>

                                {tanggalResults.length === 0 ? (
                                    <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center border border-stone-100">
                                        <span className="material-symbols-outlined text-6xl text-stone-300 mb-4 block">event_busy</span>
                                        <h3 className="font-display text-xl font-bold text-stone-700 mb-2">Tidak Ditemukan</h3>
                                        <p className="text-stone-500 text-sm max-w-md mx-auto">
                                            Tidak ada tanggal Masehi dengan kombinasi {selSaptawara} {selPancawara} Wuku {selWuku} dalam rentang {startYear}–{endYear}.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden">
                                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                                            <h3 className="font-display text-lg font-bold text-stone-800 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">date_range</span>
                                                Daftar Tanggal Masehi
                                            </h3>
                                        </div>
                                        <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
                                            {tanggalResults.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelectTanggal(item.date)}
                                                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <span className="text-primary font-bold text-sm">{idx + 1}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-stone-800">{item.formatted}</p>
                                                        </div>
                                                    </div>
                                                    <span className="material-symbols-outlined text-stone-300 text-sm">chevron_right</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-12">
                            <Disclaimer />
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
