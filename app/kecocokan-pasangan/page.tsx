'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FloatingElements from '@/components/FloatingElements';
import DateInput from '@/components/DateInput';
import ResultCard from '@/components/ResultCard';
import CompatibilityMeter from '@/components/CompatibilityMeter';
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function KecocokanPasangan() {
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        if (!date1 || !date2) {
            alert('Mohon masukkan kedua tanggal lahir');
            return;
        }

        setIsLoading(true);

        // Simulate loading for smooth animation
        setTimeout(() => {
            const compatibility = calculateCompatibility(
                new Date(date1),
                new Date(date2)
            );
            setResult(compatibility);
            setIsLoading(false);
        }, 500);
    };

    const handleReset = () => {
        setDate1('');
        setDate2('');
        setResult(null);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <FloatingElements />
            <Header />

            <main className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12 slide-up">
                        <span className="text-5xl mb-4 block">💕</span>
                        <h1 className="heading-1 text-gold-gradient mb-4">
                            Kecocokan Pasangan
                        </h1>
                        <p className="text-bali-cream/70 max-w-xl mx-auto">
                            Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan
                            berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="glass-card p-8 mb-8 fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <DateInput
                                id="date1"
                                label="Tanggal Lahir Anda"
                                value={date1}
                                onChange={setDate1}
                            />
                            <DateInput
                                id="date2"
                                label="Tanggal Lahir Pasangan"
                                value={date2}
                                onChange={setDate2}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleCalculate}
                                disabled={isLoading}
                                className="btn-bali flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
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
                                    className="btn-bali-outline"
                                >
                                    🔄 Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="space-y-8">
                            {/* Profile Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <ResultCard
                                    title="Profil Anda"
                                    balineseDate={result.person1}
                                    delay={0}
                                />
                                <ResultCard
                                    title="Profil Pasangan"
                                    balineseDate={result.person2}
                                    delay={200}
                                />
                            </div>

                            {/* Compatibility Meter */}
                            <CompatibilityMeter
                                percentage={result.percentage}
                                kategori={result.kategori}
                            />

                            {/* Additional Insights */}
                            <div className="glass-card p-6 fade-in" style={{ animationDelay: '600ms' }}>
                                <h3 className="heading-3 text-gold-gradient mb-4 text-center">💡 Insight</h3>
                                <div className="space-y-4">
                                    {result.person1.wuku.rekomendasi_pasangan.includes(result.person2.wuku.nama_wuku) && (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                            <p className="text-green-400 text-center">
                                                ✨ Wuku <strong>{result.person2.wuku.nama_wuku}</strong> adalah salah satu wuku yang direkomendasikan untuk pasangan wuku <strong>{result.person1.wuku.nama_wuku}</strong>!
                                            </p>
                                        </div>
                                    )}

                                    {result.person2.wuku.rekomendasi_pasangan.includes(result.person1.wuku.nama_wuku) && (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                            <p className="text-green-400 text-center">
                                                ✨ Wuku <strong>{result.person1.wuku.nama_wuku}</strong> adalah salah satu wuku yang direkomendasikan untuk pasangan wuku <strong>{result.person2.wuku.nama_wuku}</strong>!
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-black/30 rounded-xl p-4">
                                        <p className="text-bali-cream/70 text-center text-sm">
                                            Total nilai urip gabungan: <span className="text-bali-gold font-bold">{result.totalUrip}</span>
                                            <br />
                                            <span className="text-bali-cream/50">({result.person1.totalUrip} + {result.person2.totalUrip})</span>
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
