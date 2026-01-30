"use client";

import Link from 'next/link';
import { useState } from 'react';
import { calculateCompatibility } from '@/lib/balinese-calendar';
import { CompatibilityResult } from '@/lib/types';

export default function KecocokanPasangan() {
    const [person1Date, setPerson1Date] = useState('');
    const [person2Date, setPerson2Date] = useState('');
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        if (!person1Date || !person2Date) {
            alert('Mohon lengkapi kedua tanggal lahir');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const compatibility = calculateCompatibility(new Date(person1Date), new Date(person2Date));
            setResult(compatibility);
            setIsLoading(false);
        }, 500);
    };

    const handleReset = () => {
        setPerson1Date('');
        setPerson2Date('');
        setResult(null);
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
                        <Link href="/kecocokan-pasangan" className="text-primary font-bold border-b-2 border-primary pb-1">Kecocokan Pasangan</Link>
                        <Link href="/mencari-jodoh" className="hover:text-primary transition-colors">Mencari Jodoh</Link>
                        <Link href="/ramalan-otonan" className="hover:text-primary transition-colors">Ramalan Otonan</Link>
                    </div>
                    <div className="flex items-center gap-4">
                    </div>
                </div>
            </nav>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-12">
                        <span className="text-6xl mb-6 block">💕</span>
                        <h1 className="heading-1 mb-4 font-display text-4xl font-bold text-stone-900">
                            Cek <span className="text-primary italic">Kecocokan</span> Pasangan
                        </h1>
                        <p className="text-stone-600 max-w-lg mx-auto">
                            Masukkan tanggal lahir Anda dan pasangan untuk mengetahui tingkat kecocokan berdasarkan kalender tradisional Bali.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="bg-white border border-accent-gold/10 p-8 md:p-10 mb-10 rounded-4xl shadow-xl shadow-stone-200/50">
                        <div className="grid md:grid-cols-2 gap-8 mb-10 text-left">
                            <div className="space-y-3">
                                <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tanggal Lahir Anda</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">person</span>
                                    <input
                                        type="date"
                                        value={person1Date}
                                        onChange={(e) => setPerson1Date(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs uppercase tracking-widest font-bold text-stone-500 ml-1">Tanggal Lahir Pasangan</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">favorite</span>
                                    <input
                                        type="date"
                                        value={person2Date}
                                        onChange={(e) => setPerson2Date(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleCalculate}
                                disabled={isLoading}
                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 min-w-[200px]"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-lg">refresh</span>
                                        Menghitung...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">analytics</span>
                                        Cek Kecocokan
                                    </>
                                )}
                            </button>

                            {result && (
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
                    {result && (
                        <div className="max-w-xl mx-auto slide-up">
                            <div className="bg-white rounded-4xl shadow-2xl p-8 relative overflow-hidden border border-accent-gold/20">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-icons-outlined text-accent-gold text-3xl">favorite</span>
                                    </div>

                                    <h3 className="font-display text-2xl font-bold text-stone-800 mb-1">Hasil Kecocokan</h3>
                                    <p className="text-stone-500 text-sm mb-6">Berdasarkan perhitungan Tenung Urip Panca</p>

                                    <div className="bg-stone-50 rounded-2xl p-6 mb-6 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-stone-200">
                                                    <th className="text-left py-2 font-bold text-stone-700">Wewaran</th>
                                                    <th className="text-left py-2 font-bold text-stone-700">Urip Anda</th>
                                                    <th className="text-left py-2 font-bold text-stone-700">Pasangan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-stone-600">
                                                <tr className="border-b border-stone-100">
                                                    <td className="py-2 text-left">Panca Wara</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.pancawara.nama} = {result.person1.pancawara.urip}</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.pancawara.nama} = {result.person2.pancawara.urip}</td>
                                                </tr>
                                                <tr className="border-b border-stone-100">
                                                    <td className="py-2 text-left">Wuku</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person1.wuku.nama_wuku} = {result.person1.wuku.id_wuku % 10}</td>
                                                    <td className="py-2 text-left text-xs whitespace-nowrap">{result.person2.wuku.nama_wuku} = {result.person2.wuku.id_wuku % 10}</td>
                                                </tr>
                                                <tr className="bg-stone-100 font-bold text-stone-800">
                                                    <td className="py-3 text-left pl-2 rounded-l-lg">Jumlah</td>
                                                    <td className="py-3 text-left">{result.person1.totalUrip}</td>
                                                    <td className="py-3 text-left rounded-r-lg">{result.person2.totalUrip}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="mt-4 pt-4 border-t border-dashed border-stone-200 text-left">
                                            <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-1">Perhitungan</p>
                                            <p className="text-sm font-medium text-stone-800">
                                                {result.person1.totalUrip} + {result.person2.totalUrip} = {result.totalUrip} <span className="text-stone-400">dibagi 5</span> <span className="text-primary font-bold">sisa {result.kategori.sisa}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-left mb-8 px-2">
                                        <p className="text-stone-700 text-sm leading-relaxed">
                                            Anda lahir pada {result.person1.saptawara.hari.split('/')[0]} {result.person1.pancawara.nama} {result.person1.wuku.nama_wuku}, jumlah urip anda adalah {result.person1.totalUrip}.
                                            Sedangkan pasangan anda pada {result.person2.saptawara.hari.split('/')[0]} {result.person2.pancawara.nama} {result.person2.wuku.nama_wuku} dan jumlah uripnya adalah {result.person2.totalUrip}.
                                            Berdasarkan ramalan perjodohan dari Lontar Tri Pramana, pasangan ini akan {result.kategori.makna.toLowerCase()}.
                                        </p>
                                    </div>
                                </div>
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
