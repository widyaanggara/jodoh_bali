'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResultCard from '@/components/ResultCard';
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
                    </div>
                </section>

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
                                        >
                                            ✨ Wuku {wuku}
                                        </span>
                                    ))}
                                </div>
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
        </div>
    );
}
