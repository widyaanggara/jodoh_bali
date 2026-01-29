'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FloatingElements from '@/components/FloatingElements';
import DateInput from '@/components/DateInput';
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
        }, 500);
    };

    const handleReset = () => {
        setBirthDate('');
        setSearchYear(currentYear.toString());
        setUserProfile(null);
        setMatches([]);
    };

    const getBadgeClass = (kategori: string) => {
        switch (kategori) {
            case 'Sri': return 'badge-sri';
            case 'Dana': return 'badge-dana';
            case 'Laba': return 'badge-laba';
            default: return 'badge-laba';
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <FloatingElements />
            <Header />

            <main className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12 slide-up">
                        <span className="text-5xl mb-4 block">🔮</span>
                        <h1 className="heading-1 text-gold-gradient mb-4">
                            Mencari Jodoh
                        </h1>
                        <p className="text-bali-cream/70 max-w-xl mx-auto">
                            Temukan tanggal-tanggal kelahiran yang paling cocok dengan Anda
                            berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="glass-card p-8 mb-8 fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <DateInput
                                id="birthDate"
                                label="Tanggal Lahir Anda"
                                value={birthDate}
                                onChange={setBirthDate}
                            />
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="searchYear"
                                    className="text-bali-gold font-medium text-sm tracking-wide"
                                >
                                    Tahun Pencarian
                                </label>
                                <select
                                    id="searchYear"
                                    value={searchYear}
                                    onChange={(e) => setSearchYear(e.target.value)}
                                    className="input-bali"
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="btn-bali flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Mencari...
                                    </>
                                ) : (
                                    <>
                                        🔍 Temukan Jodoh
                                    </>
                                )}
                            </button>

                            {userProfile && (
                                <button
                                    onClick={handleReset}
                                    className="btn-bali-outline"
                                >
                                    🔄 Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {userProfile && (
                        <div className="space-y-8">
                            {/* User Profile */}
                            <div className="max-w-xl mx-auto">
                                <ResultCard
                                    title="Profil Anda"
                                    balineseDate={userProfile}
                                    delay={0}
                                />
                            </div>

                            {/* Matching Dates List */}
                            <div className="glass-card p-6 sm:p-8 fade-in" style={{ animationDelay: '200ms' }}>
                                <h3 className="heading-3 text-gold-gradient mb-6 text-center">
                                    📅 Tanggal Lahir Jodoh Potensial ({searchYear})
                                </h3>

                                <p className="text-center text-bali-cream/60 mb-6 text-sm">
                                    Ditemukan <span className="text-bali-gold font-bold">{matches.length}</span> tanggal dengan kecocokan tinggi (Sri, Dana, atau Laba)
                                </p>

                                {matches.length > 0 ? (
                                    <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                                        {matches.map((match, index) => (
                                            <div
                                                key={index}
                                                className="bg-black/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/40 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-bali-cream font-medium">
                                                        {formatDate(match.date)}
                                                    </p>
                                                    <p className="text-bali-cream/60 text-sm">
                                                        Wuku {match.balineseDate.wuku.nama_wuku} • {match.balineseDate.pancawara.nama} • {match.balineseDate.saptawara.hari.split('/')[0]}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getBadgeClass(match.kategori.kategori)}`}>
                                                        {match.kategori.kategori}
                                                    </span>
                                                    <span className="text-bali-gold font-bold">
                                                        {match.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-bali-cream/50">
                                        Tidak ditemukan tanggal yang cocok di tahun {searchYear}
                                    </p>
                                )}
                            </div>

                            {/* Recommended Wuku */}
                            <div className="glass-card p-6 fade-in" style={{ animationDelay: '400ms' }}>
                                <h3 className="heading-3 text-gold-gradient mb-4 text-center">
                                    💕 Wuku Pasangan Ideal untuk Anda
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {userProfile.wuku.rekomendasi_pasangan.map((wuku, index) => (
                                        <span
                                            key={index}
                                            className="px-6 py-3 bg-gradient-to-r from-bali-gold/20 to-bali-brown/20 border border-bali-gold/30 rounded-full text-bali-cream font-medium"
                                        >
                                            ✨ Wuku {wuku}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-center text-bali-cream/50 text-sm mt-4">
                                    Carilah pasangan yang lahir di wuku-wuku tersebut untuk kecocokan terbaik
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
