'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FloatingElements from '@/components/FloatingElements';
import DateInput from '@/components/DateInput';
import ResultCard from '@/components/ResultCard';
import HeartMeter from '@/components/HeartMeter';
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function KecocokanPasangan() {
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleCalculate = () => {
        if (!date1 || !date2) {
            alert('Mohon masukkan kedua tanggal lahir');
            return;
        }

        setIsLoading(true);
        setShowResults(false);

        setTimeout(() => {
            const compatibility = calculateCompatibility(
                new Date(date1),
                new Date(date2)
            );
            setResult(compatibility);
            setIsLoading(false);

            // Delay showing results for smooth animation
            setTimeout(() => setShowResults(true), 100);
        }, 800);
    };

    const handleReset = () => {
        setDate1('');
        setDate2('');
        setResult(null);
        setShowResults(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <FloatingElements />
            <Header />

            <main className="relative z-10 pt-28 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12 slide-up">
                        <span className="text-6xl mb-6 block">💕</span>
                        <h1 className="heading-1 mb-4">
                            Cek <span className="text-gold-gradient">Kecocokan</span> Pasangan
                        </h1>
                        <p className="text-bali-brown/60 max-w-lg mx-auto">
                            Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan
                            berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="clean-card p-8 md:p-10 mb-10 fade-in glow-gold" style={{ animationDelay: '200ms' }}>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <DateInput
                                id="date1"
                                label="📅 Tanggal Lahir Anda"
                                value={date1}
                                onChange={setDate1}
                            />
                            <DateInput
                                id="date2"
                                label="💝 Tanggal Lahir Pasangan"
                                value={date2}
                                onChange={setDate2}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleCalculate}
                                disabled={isLoading}
                                className="btn-primary flex items-center justify-center gap-2 min-w-[200px]"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin">💫</span>
                                        Menghitung...
                                    </>
                                ) : (
                                    <>
                                        ✨ Cek Kecocokan
                                    </>
                                )}
                            </button>

                            {result && (
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
                    {result && (
                        <div className="space-y-10">
                            {/* Heart Meter - Main Focus */}
                            <HeartMeter
                                percentage={result.percentage}
                                kategori={result.kategori}
                                isVisible={showResults}
                            />

                            {/* Profile Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <ResultCard
                                    title="Profil Anda"
                                    balineseDate={result.person1}
                                    delay={600}
                                />
                                <ResultCard
                                    title="Profil Pasangan"
                                    balineseDate={result.person2}
                                    delay={800}
                                />
                            </div>

                            {/* Insights */}
                            <div className="clean-card p-8 fade-in" style={{ animationDelay: '1000ms' }}>
                                <h3 className="heading-3 text-center mb-6">💡 Insight Tambahan</h3>
                                <div className="space-y-4">
                                    {result.person1.wuku.rekomendasi_pasangan.includes(result.person2.wuku.nama_wuku) && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <p className="text-green-700 text-center text-sm">
                                                ✨ Wuku <strong>{result.person2.wuku.nama_wuku}</strong> adalah salah satu wuku yang direkomendasikan untuk pasangan wuku <strong>{result.person1.wuku.nama_wuku}</strong>!
                                            </p>
                                        </div>
                                    )}

                                    {result.person2.wuku.rekomendasi_pasangan.includes(result.person1.wuku.nama_wuku) && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <p className="text-green-700 text-center text-sm">
                                                ✨ Wuku <strong>{result.person1.wuku.nama_wuku}</strong> adalah salah satu wuku yang direkomendasikan untuk pasangan wuku <strong>{result.person2.wuku.nama_wuku}</strong>!
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-bali-cream rounded-xl p-4 text-center">
                                        <p className="text-bali-brown/70 text-sm">
                                            Total nilai urip gabungan: <span className="text-bali-gold font-bold text-lg">{result.totalUrip}</span>
                                            <br />
                                            <span className="text-bali-brown/40 text-xs">({result.person1.totalUrip} + {result.person2.totalUrip})</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
