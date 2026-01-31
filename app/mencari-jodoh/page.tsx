"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IdealMatchSearchForm from '@/components/IdealMatch/SearchForm';
import IdealMatchResultsList from '@/components/IdealMatch/ResultsList';
import Disclaimer from '@/components/Disclaimer';
import SplashScreen from '@/components/SplashScreen';
import { getBalineseDate } from '@/lib/balinese-calendar';
import { findIdealMatches, IdealMatch } from '@/lib/jodoh-logic';
import { BalineseDate } from '@/lib/types';

export default function MencariJodoh() {
    const [userProfile, setUserProfile] = useState<BalineseDate | null>(null);
    const [matches, setMatches] = useState<IdealMatch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (birthDate: string, startYear: number, endYear: number) => {
        setIsLoading(true);

        setTimeout(() => {
            const profile = getBalineseDate(new Date(birthDate));
            const idealMatches = findIdealMatches(
                new Date(birthDate),
                startYear,
                endYear
            );

            setUserProfile(profile);
            setMatches(idealMatches);
            setIsLoading(false);
        }, 3000);
    };

    const handleReset = () => {
        setUserProfile(null);
        setMatches([]);
    };

    return (
        <div className="bg-background-light font-sans text-stone-800 transition-colors duration-300 min-h-screen">
            <Header />

            <main>
                {/* Hero Section */}
                {!userProfile && !isLoading && (
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
                                Temukan Tanggal Jodoh Ideal
                            </h1>
                            <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed slide-up delay-100">
                                Cari tanggal kelahiran yang menghasilkan status <span className="text-emerald-500 font-bold">SRI</span> (rejeki melimpah & harmonis) berdasarkan perhitungan Tenung Urip Panca.
                            </p>

                            <IdealMatchSearchForm onSearch={handleSearch} isLoading={isLoading} />
                        </div>
                    </section>
                )}

                {/* Splash Screen */}
                {isLoading && <SplashScreen message="Menghitung hari baik untuk jodoh..." />}

                {/* Results Section */}
                {userProfile && (
                    <section className="pb-24 px-6 relative z-10 fade-in">
                        <div className="max-w-5xl mx-auto space-y-12">
                            {/* Reset Button */}
                            <div className="flex justify-center mt-12 mb-8">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 rounded-full bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 hover:text-primary transition-colors shadow-sm flex items-center gap-2 text-sm"
                                >
                                    <span className="material-symbols-outlined text-lg">restart_alt</span>
                                    Cari Lagi
                                </button>
                            </div>
                            {/* User Profile Card */}
                            <div className="max-w-xl mx-auto bg-surface-light p-8 rounded-4xl border border-accent-gold/10 shadow-xl">
                                <h3 className="font-display text-2xl font-bold text-center mb-6">Profil Anda</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                                        <span className="text-stone-500">Wuku</span>
                                        <span className="font-bold text-primary">{userProfile.wuku.nama_wuku}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                                        <span className="text-stone-500">Pancawara</span>
                                        <span className="font-bold">{userProfile.pancawara.nama}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                                        <span className="text-stone-500">Saptawara</span>
                                        <span className="font-bold">{userProfile.saptawara.hari}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Total Urip</span>
                                        <span className="font-bold text-accent-gold text-xl">{userProfile.totalUrip}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ideal Wuku Section */}
                            <div className="bg-surface-light p-10 md:p-14 rounded-[3rem] border border-accent-gold/10 shadow-xl shadow-stone-200/50 text-center slide-up">
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
                                <p className="text-stone-500 text-sm italic">
                                    "Carilah pasangan yang lahir di wuku-wuku tersebut untuk mendapatkan harmoni hidup yang maksimal."
                                </p>
                            </div>

                            {/* Results List */}
                            <IdealMatchResultsList matches={matches} />

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