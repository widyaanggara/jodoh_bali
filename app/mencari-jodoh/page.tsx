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
        }, 800);
    };

    const handleReset = () => {
        setBirthDate('');
        setSearchYear(currentYear.toString());
        setUserProfile(null);
        setMatches([]);
    };

    const getBadgeClass = (kategori: string) => {
        const map: Record<string, string> = {
            'Sri': 'badge-soft-sri',
            'Dana': 'badge-soft-dana',
            'Laba': 'badge-soft-laba'
        };
        return map[kategori] || 'badge-soft-laba';
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <FloatingElements />
            <Header />

            <main className="relative z-10 pt-28 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12 slide-up">
                        <span className="text-6xl mb-6 block">🔮</span>
                        <h1 className="heading-1 mb-4">
                            Temukan <span className="text-gold-gradient">Jodoh</span> Ideal
                        </h1>
                        <p className="text-bali-brown/60 max-w-lg mx-auto">
                            Temukan tanggal-tanggal kelahiran yang paling cocok dengan Anda
                            berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="clean-card p-8 md:p-10 mb-10 fade-in glow-gold" style={{ animationDelay: '200ms' }}>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <DateInput
                                id="birthDate"
                                label="📅 Tanggal Lahir Anda"
                                value={birthDate}
                                onChange={setBirthDate}
                            />
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="searchYear"
                                    className="text-bali-brown font-medium text-sm tracking-wide"
                                >
                                    📆 Tahun Pencarian
                                </label>
                                <select
                                    id="searchYear"
                                    value={searchYear}
                                    onChange={(e) => setSearchYear(e.target.value)}
                                    className="input-clean"
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
                                className="btn-primary flex items-center justify-center gap-2 min-w-[200px]"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin">💫</span>
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
                                    className="btn-secondary"
                                >
                                    🔄 Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {userProfile && (
                        <div className="space-y-10">
                            {/* User Profile */}
                            <div className="max-w-xl mx-auto">
                                <ResultCard
                                    title="Profil Anda"
                                    balineseDate={userProfile}
                                    delay={0}
                                />
                            </div>

                            {/* Recommended Wuku */}
                            <div className="clean-card p-8 fade-in text-center glow-gold" style={{ animationDelay: '200ms' }}>
                                <h3 className="heading-3 mb-6">
                                    💕 Wuku Pasangan Ideal untuk Anda
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3 mb-4">
                                    {userProfile.wuku.rekomendasi_pasangan.map((wuku, index) => (
                                        <span
                                            key={index}
                                            className="px-6 py-3 bg-gradient-to-r from-bali-gold/10 to-bali-gold-light/20 border border-bali-gold/20 rounded-full text-bali-brown font-medium"
                                        >
                                            ✨ Wuku {wuku}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-bali-brown/50 text-sm">
                                    Carilah pasangan yang lahir di wuku-wuku tersebut untuk kecocokan optimal
                                </p>
                            </div>

                            {/* Matching Dates List */}
                            <div className="clean-card p-8 fade-in" style={{ animationDelay: '400ms' }}>
                                <div className="text-center mb-8">
                                    <h3 className="heading-3 mb-2">
                                        📅 Tanggal Lahir Jodoh Potensial
                                    </h3>
                                    <p className="text-bali-brown/50 text-sm">
                                        Tahun <span className="text-bali-gold font-semibold">{searchYear}</span> • Ditemukan <span className="text-bali-gold font-bold">{matches.length}</span> tanggal dengan kecocokan tinggi
                                    </p>
                                </div>

                                {matches.length > 0 ? (
                                    <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
                                        {matches.map((match, index) => (
                                            <div
                                                key={index}
                                                className="bg-bali-cream rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bali-gold/10 transition-colors fade-in"
                                                style={{ animationDelay: `${500 + index * 50}ms` }}
                                            >
                                                <div className="flex-1">
                                                    <p className="text-bali-brown font-medium">
                                                        {formatDate(match.date)}
                                                    </p>
                                                    <p className="text-bali-brown/50 text-sm">
                                                        Wuku {match.balineseDate.wuku.nama_wuku} • {match.balineseDate.pancawara.nama} • {match.balineseDate.saptawara.hari.split('/')[0]}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`badge-soft ${getBadgeClass(match.kategori.kategori)}`}>
                                                        {match.kategori.kategori}
                                                    </span>
                                                    <span className="text-bali-gold font-bold text-lg">
                                                        {match.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-bali-brown/40 py-8">
                                        Tidak ditemukan tanggal yang cocok di tahun {searchYear}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
