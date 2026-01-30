"use client";

import Link from 'next/link';
import { useState } from 'react';
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
                    </div>

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
                                        >
                                            ✨ Wuku {wuku}
                                        </span>
                                    ))}
                                </div>
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
        </div>
    );
}
