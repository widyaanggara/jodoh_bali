"use client";

import Link from 'next/link';
import { useState } from 'react';
import { getBalineseDate } from '@/lib/balinese-calendar';
import { BalineseDate } from '@/lib/types';
import Header from '@/components/Header';

export default function RamalanOtonan() {
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState<BalineseDate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        if (!birthDate) {
            alert('Mohon lengkapi tanggal lahir');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const balineseDate = getBalineseDate(new Date(birthDate));
            setResult(balineseDate);
            setIsLoading(false);
        }, 500);
    };

    const handleReset = () => {
        setBirthDate('');
        setResult(null);
    };

    return (
        <div className="min-h-screen">
            <Header />

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-6xl mb-6 block">🌟</span>
                        <h1 className="heading-1 mb-4 font-display text-4xl font-bold text-stone-900">
                            Ramalan <span className="text-primary italic">Otonan & Lintang</span>
                        </h1>
                        <p className="text-stone-600 max-w-lg mx-auto">
                            Cek hari Otonan berikutnya dan peruntungan berdasarkan Bintang (Lintang) kelahiran Anda.
                        </p>
                    </div>

                    <div className="bg-white border border-accent-gold/10 p-8 md:p-10 mb-10 rounded-4xl shadow-xl shadow-stone-200/50">
                        <div className="max-w-md mx-auto space-y-4">
                            <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Pilih Tanggal Lahir</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">calendar_month</span>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleCalculate}
                                    disabled={isLoading}
                                    className="flex-1 px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin material-symbols-outlined text-lg">refresh</span>
                                            Menghitung...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                                            Lihat Ramalan
                                        </>
                                    )}
                                </button>
                                {result && (
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">refresh</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="grid md:grid-cols-2 gap-8 slide-up">
                            {/* Balinese Birth Info */}
                            <div className="bg-white rounded-4xl shadow-xl p-8 border border-accent-gold/20">
                                <h3 className="font-display text-2xl font-bold mb-6 text-stone-800">Kelahiran Bali</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                        <span className="text-stone-500">Saptawara</span>
                                        <span className="font-bold text-stone-800">{result.saptawara.hari}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                        <span className="text-stone-500">Pancawara</span>
                                        <span className="font-bold text-stone-800">{result.pancawara.nama}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                        <span className="text-stone-500">Wuku</span>
                                        <span className="font-bold text-primary">{result.wuku.nama_wuku}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-500">Next Otonan</span>
                                        <span className="font-bold text-accent-gold">{result.nextOtonan}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lintang / Star Info */}
                            {result.lintang && (
                                <div className="bg-stone-900 rounded-4xl shadow-xl p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <span className="material-icons-outlined text-9xl">auto_awesome</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold mb-2">Bintang (Lintang)</h3>
                                    <p className="text-accent-gold font-bold text-3xl mb-6">Lintang {result.lintang.nama}</p>

                                    <div className="space-y-6 relative z-10">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Sifat Karakter</h4>
                                            <p className="text-stone-200 leading-relaxed">{result.lintang.sifat}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">Nasib & Keberuntungan</h4>
                                            <p className="text-stone-200 leading-relaxed">{result.lintang.nasib}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <footer className="bg-stone-50 pt-20 pb-10 border-t border-accent-gold/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs text-stone-500">
                        © 2024 Jodoh Bali. Berdasarkan Lontar Tri Pramana & Wariga.
                    </p>
                </div>
            </footer>
        </div>
    );
}
