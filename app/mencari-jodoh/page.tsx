"use client";

import Link from 'next/link';
import { useState } from 'react';
<<<<<<< HEAD
=======
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResultCard from '@/components/ResultCard';
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
import { getBalineseDate, findMatchingDates, formatDate } from '@/lib/balinese-calendar';
import { BalineseDate, MatchingDate } from '@/lib/types';

export default function MencariJodoh() {
    const [birthDate, setBirthDate] = useState('');
    const [searchYear, setSearchYear] = useState(new Date().getFullYear().toString());
    const [userProfile, setUserProfile] = useState<BalineseDate | null>(null);
    const [matches, setMatches] = useState<MatchingDate[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

    const handleSearch = () => {
        if (!birthDate) {
            alert('Mohon masukkan tanggal lahir Anda');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const profile = getBalineseDate(new Date(birthDate));
            const matchingDates = findMatchingDates(
                new Date(birthDate),
                parseInt(searchYear),
                50
            );

            setUserProfile(profile);
            setMatches(matchingDates);
            setIsLoading(false);
        }, 800);
    };

    const handleReset = () => {
        setBirthDate('');
        setSearchYear(currentYear.toString());
        setUserProfile(null);
        setMatches([]);
    };

    const getMatchColor = (kategori: string) => {
        const map: Record<string, string> = {
<<<<<<< HEAD
            'Sri': 'bg-emerald-500/10 text-emerald-700',
            'Dana': 'bg-green-500/10 text-green-700',
            'Laba': 'bg-blue-500/10 text-blue-700'
        };
        return map[kategori] || 'bg-blue-500/10 text-blue-700';
    };

    return (
        <div className="min-h-screen bg-white">
            <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-accent-gold/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-accent-gold text-3xl">flare</span>
                        <span className="font-display text-2xl font-bold tracking-tight text-primary">Jodoh Bali</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-800">
                        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                        <Link href="/kecocokan-pasangan" className="hover:text-primary transition-colors">Kecocokan Pasangan</Link>
                        <Link href="/mencari-jodoh" className="text-primary font-bold border-b-2 border-primary pb-1">Mencari Jodoh</Link>
                        <Link href="/ramalan-otonan" className="hover:text-primary transition-colors">Ramalan Otonan</Link>
                    </div>
                    <div className="flex items-center gap-4">
                    </div>
                </div>
            </nav>

            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <span className="text-6xl mb-6 block">🔮</span>
                        <h1 className="heading-1 mb-4 font-display text-4xl font-bold text-stone-900">
                            Temukan <span className="text-primary italic">Jodoh</span> Ideal
                        </h1>
                        <p className="text-stone-600 max-w-lg mx-auto">
                            Temukan tanggal-tanggal kelahiran yang paling cocok dengan Anda berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="bg-white border border-accent-gold/10 p-8 md:p-10 mb-10 rounded-4xl shadow-xl shadow-stone-200/50">
                        <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tanggal Lahir Anda</label>
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
                                <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tahun Pencarian</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">event</span>
                                    <select
                                        value={searchYear}
                                        onChange={(e) => setSearchYear(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none appearance-none"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 min-w-[200px]"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-lg">refresh</span>
                                        Mencari...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">search</span>
                                        Temukan Jodoh
                                    </>
                                )}
                            </button>

                            {userProfile && (
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">refresh</span>
                                    Reset
                                </button>
                            )}
                        </div>
=======
            'Sri': '#10B981',
            'Dana': '#22C55E',
            'Laba': '#3B82F6',
            'Sakti': '#F59E0B',
            'Tiwas': '#EF4444'
        };
        return map[kategori] || '#C5A059';
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
                            Temukan Jodoh Ideal
                        </h1>
                        <p className="text-lg text-stone-600 dark:text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed slide-up delay-100">
                            Temukan tanggal-tanggal kelahiran yang paling cocok dengan Anda berdasarkan kalender tradisional Bali.
                        </p>
                        
                        <div className="max-w-2xl mx-auto slide-up delay-200">
                            <div className="bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200 dark:shadow-none border border-accent-gold/10">
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-3 text-left group">
                                        <label htmlFor="birthDate" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-500 ml-1">Tanggal Lahir Anda</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">calendar_month</span>
                                            <input 
                                                id="birthDate"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none" 
                                                type="date"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-left group">
                                        <label htmlFor="searchYear" className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 dark:text-stone-500 ml-1">Tahun Pencarian</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-gold transition-colors">event_note</span>
                                            <select
                                                id="searchYear"
                                                value={searchYear}
                                                onChange={(e) => setSearchYear(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all appearance-none outline-none"
                                            >
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                    className="w-full py-5 gradient-button text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <span className="material-symbols-outlined animate-spin">autorenew</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                    )}
                                    {isLoading ? 'Mencari...' : 'Temukan Jodoh'}
                                </button>
                                
                                {userProfile && (
                                    <button
                                        onClick={handleReset}
                                        className="w-full py-3 mt-4 text-stone-400 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        Reset Pencarian
                                    </button>
                                )}
                            </div>
                        </div>
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
                    </div>
                </section>

<<<<<<< HEAD
                    {/* Results */}
                    {userProfile && (
                        <div className="space-y-10 slide-up">
                            {/* User Profile */}
                            <div className="bg-white rounded-4xl shadow-xl p-8 border border-accent-gold/20">
                                <h3 className="font-display text-2xl font-bold text-center text-stone-800 mb-6">Profil Anda</h3>
                                <div className="grid gap-4 text-left">
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                                        <span className="text-stone-600 text-sm">Wuku</span>
                                        <span className="font-bold text-primary text-lg">{userProfile.wuku.nama_wuku}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                                        <span className="text-stone-600 text-sm">Pancawara</span>
                                        <span className="font-bold text-stone-800">{userProfile.pancawara.nama}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                                        <span className="text-stone-600 text-sm">Saptawara</span>
                                        <span className="font-bold text-stone-800">{userProfile.saptawara.hari}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-600 text-sm">Total Urip</span>
                                        <span className="font-bold text-accent-gold text-xl">{userProfile.totalUrip}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Wuku */}
                            <div className="bg-white border border-accent-gold/10 p-8 rounded-4xl text-center">
                                <h3 className="font-display text-xl font-bold mb-6 text-stone-800">
                                    💕 Wuku Pasangan Ideal untuk Anda
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3 mb-4">
                                    {userProfile.wuku.rekomendasi_pasangan.map((wuku: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary font-medium"
=======
                {/* Results Section */}
                {userProfile && (
                    <section className="pb-24 px-6 relative z-10 fade-in">
                        <div className="max-w-5xl mx-auto space-y-12">
                            {/* User Profile Card */}
                            <div className="max-w-xl mx-auto">
                                <ResultCard
                                    title="Profil Anda"
                                    balineseDate={userProfile}
                                    delay={0}
                                />
                            </div>

                            {/* Ideal Wuku Section */}
                            <div className="bg-surface-light dark:bg-surface-dark p-10 md:p-14 rounded-[3rem] border border-accent-gold/10 shadow-xl shadow-stone-200/50 dark:shadow-none text-center slide-up">
                                <h3 className="font-display text-2xl font-bold mb-8">💕 Wuku Pasangan Ideal</h3>
                                <div className="flex flex-wrap justify-center gap-4 mb-6">
                                    {userProfile.wuku.rekomendasi_pasangan.map((wuku, index) => (
                                        <span
                                            key={index}
                                            className="px-6 py-3 bg-accent-gold/5 border border-accent-gold/10 rounded-full text-primary font-bold shadow-sm"
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
                                        >
                                            ✨ Wuku {wuku}
                                        </span>
                                    ))}
                                </div>
<<<<<<< HEAD
                                <p className="text-stone-500 text-sm">
                                    Carilah pasangan yang lahir di wuku-wuku tersebut untuk kecocokan optimal
                                </p>
                            </div>

                            {/* Matching Dates List */}
                            <div className="bg-white rounded-4xl shadow-xl p-8 border border-accent-gold/20">
                                <div className="text-center mb-8">
                                    <h3 className="font-display text-xl font-bold mb-2 text-stone-800">
                                        📅 Tanggal Lahir Jodoh Potensial
                                    </h3>
                                    <p className="text-stone-500 text-sm">
                                        Tahun <span className="text-accent-gold font-semibold">{searchYear}</span> • Ditemukan <span className="text-accent-gold font-bold">{matches.length}</span> tanggal dengan kecocokan tinggi
                                    </p>
                                </div>

                                {matches.length > 0 ? (
                                    <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
                                        {matches.map((match, index) => (
                                            <div
                                                key={index}
                                                className="bg-stone-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent-gold/10 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-stone-800 font-medium">
                                                        {formatDate(match.date)}
                                                    </p>
                                                    <p className="text-stone-500 text-sm">
                                                        Wuku {match.balineseDate.wuku.nama_wuku} • {match.balineseDate.pancawara.nama} • {match.balineseDate.saptawara.hari.split('/')[0]}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(match.kategori.kategori)}`}>
                                                        {match.kategori.kategori}
                                                    </span>
                                                    <span className="text-accent-gold font-bold text-lg">
                                                        {match.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-stone-400 py-8">
                                        Tidak ditemukan tanggal yang cocok di tahun {searchYear}
                                    </p>
                                )}
                            </div>
                        </div>
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
                                <p className="text-stone-500 dark:text-stone-400 text-sm italic">
                                    "Carilah pasangan yang lahir di wuku-wuku tersebut untuk mendapatkan harmoni hidup yang maksimal."
                                </p>
                            </div>

                            {/* Matches List */}
                            <div>
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <h3 className="font-display text-2xl font-bold">Hasil Rekomendasi</h3>
                                    <span className="px-4 py-1.5 bg-accent-gold/10 text-accent-gold text-xs font-bold rounded-full">
                                        {matches.length} Ditemukan
                                    </span>
                                </div>

                                <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {matches.map((match, index) => (
                                        <div
                                            key={index}
                                            className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-accent-gold/10 hover:border-accent-gold transition-all group slide-up shadow-sm hover:shadow-md"
                                            style={{ animationDelay: `${200 + index * 50}ms` }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-stone-50 dark:bg-stone-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <span className="material-icons-outlined text-2xl">favorite</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-stone-900 dark:text-stone-50 font-bold text-lg">
                                                            {formatDate(match.date)}
                                                        </p>
                                                        <p className="text-stone-400 text-xs mt-1">
                                                            Wuku {match.balineseDate.wuku.nama_wuku} • {match.balineseDate.pancawara.nama} • {match.balineseDate.saptawara.hari.split('/')[0]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 self-end sm:self-center">
                                                    <span 
                                                        className="px-4 py-1.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-stone-200/50 dark:shadow-none"
                                                        style={{ backgroundColor: getMatchColor(match.kategori.kategori) }}
                                                    >
                                                        {match.kategori.kategori}
                                                    </span>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-2xl font-bold text-stone-900 dark:text-stone-50" style={{ color: getMatchColor(match.kategori.kategori) }}>
                                                            {match.percentage}%
                                                        </span>
                                                        <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">Kecocokan</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <Footer />
            </main>
>>>>>>> 95d3e8af56596a7f14981803ee9dfbf14fd5222a
        </div>
    );
}
