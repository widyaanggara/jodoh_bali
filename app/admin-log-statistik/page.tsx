"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import { ambilDataLog } from '@/firebase/app';

// Definisi tipe data agar tetap aman di TypeScript
type FeatureType = 'kecocokan_pasangan' | 'mencari_jodoh' | 'ramalan_pernikahan' | 'ramalan_otonan';
type FilterType = FeatureType | 'all';

interface InputLog {
    id: string;
    feature_type: FeatureType;
    tanggal_lahir: string;
    tanggal_lahir_2?: string | null;
    created_at: any; // Firebase Timestamp or ServerTimestamp
}

const featureLabels: Record<FeatureType, string> = {
    kecocokan_pasangan: 'Kecocokan Pasangan',
    mencari_jodoh: 'Mencari Jodoh',
    ramalan_pernikahan: 'Ramalan Pernikahan',
    ramalan_otonan: 'Ramalan Otonan'
};

const featureColors: Record<FeatureType, string> = {
    kecocokan_pasangan: 'bg-pink-100 text-pink-700 border-pink-200',
    mencari_jodoh: 'bg-purple-100 text-purple-700 border-purple-200',
    ramalan_pernikahan: 'bg-amber-100 text-amber-700 border-amber-200',
    ramalan_otonan: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

export default function AdminLogPage() {
    const [totalInputs, setTotalInputs] = useState(0);
    const [byFeature, setByFeature] = useState<Record<FeatureType, number>>({
        kecocokan_pasangan: 0,
        mencari_jodoh: 0,
        ramalan_pernikahan: 0,
        ramalan_otonan: 0
    });
    const [logs, setLogs] = useState<InputLog[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                // Ambil data dari Firebase
                const allLogs = await ambilDataLog() as InputLog[];
                
                // Hitung Statistik secara manual dari array Firebase
                const stats = allLogs.reduce((acc, log) => {
                    const type = log.feature_type;
                    if (acc[type] !== undefined) {
                        acc[type]++;
                    }
                    return acc;
                }, {
                    kecocokan_pasangan: 0,
                    mencari_jodoh: 0,
                    ramalan_pernikahan: 0,
                    ramalan_otonan: 0
                } as Record<FeatureType, number>);

                setLogs(allLogs);
                setTotalInputs(allLogs.length);
                setByFeature(stats);
            } catch (error) {
                console.error("Gagal memuat data admin:", error);
            } finally {
                // Beri sedikit delay agar splash screen terlihat mulus
                setTimeout(() => setIsLoading(false), 1500);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        // Reset ke halaman 1 saat filter berubah
        setCurrentPage(1);
    }, [activeFilter]);

    const filteredLogs = activeFilter === 'all' 
        ? logs 
        : logs.filter(log => log.feature_type === activeFilter);

    // Hitung data untuk pagination
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Fungsi untuk menghasilkan daftar nomor halaman dengan titik-titik (ellipsis)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Selalu tampilkan halaman pertama
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Halaman di sekitar halaman saat ini
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Selalu tampilkan halaman terakhir
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (timestamp: any) => {
        if (!timestamp) return '-';
        
        // Handle Firebase Timestamp
        let date: Date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            date = new Date(timestamp);
        }

        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return <SplashScreen message="Memuat Data Statistik..." />;
    }

    return (
        <div className="bg-background-light font-sans text-stone-800 transition-colors duration-300 min-h-screen">
            <Header />

            <section className="py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-5xl mb-4 block">📊</span>
                        <h1 className="font-display text-4xl font-bold text-stone-900 mb-4">
                            Log <span className="text-primary">Statistik</span>
                        </h1>
                        <p className="text-stone-600 max-w-lg mx-auto">
                            Statistik penggunaan dan daftar tanggal lahir yang pernah diinput pengguna.
                        </p>
                    </div>

                    <>
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-5 gap-6 mb-12">
                                {/* Total Card - Hero Style */}
                                <div className="md:col-span-1 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-xl shadow-primary/20 text-white relative overflow-hidden group hover:scale-105 transition-transform">
                                    <div className="absolute top-0 right-0 opacity-10">
                                        <span className="material-symbols-outlined text-8xl">bar_chart</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-white/70">analytics</span>
                                            <p className="text-xs uppercase tracking-widest font-bold text-white/70">Total Input</p>
                                        </div>
                                        <p className="text-4xl font-bold">{totalInputs}</p>
                                        <p className="text-sm text-white/60 mt-2">pengguna</p>
                                    </div>
                                </div>

                                {/* Kecocokan Pasangan */}
                                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-6 shadow-xl shadow-pink-500/20 text-white relative overflow-hidden group hover:scale-105 transition-transform">
                                    <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">favorite</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-white/70 text-lg">favorite</span>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">Kecocokan</p>
                                        </div>
                                        <p className="text-4xl font-bold">{byFeature.kecocokan_pasangan}</p>
                                        <p className="text-sm text-white/60 mt-1">pasangan</p>
                                    </div>
                                </div>

                                {/* Mencari Jodoh */}
                                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-6 shadow-xl shadow-purple-500/20 text-white relative overflow-hidden group hover:scale-105 transition-transform">
                                    <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">search</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-white/70 text-lg">person_search</span>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">Cari Jodoh</p>
                                        </div>
                                        <p className="text-4xl font-bold">{byFeature.mencari_jodoh}</p>
                                        <p className="text-sm text-white/60 mt-1">pencarian</p>
                                    </div>
                                </div>

                                {/* Ramalan Pernikahan */}
                                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 shadow-xl shadow-amber-500/20 text-white relative overflow-hidden group hover:scale-105 transition-transform">
                                    <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">diamond</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-white/70 text-lg">diamond</span>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">Pernikahan</p>
                                        </div>
                                        <p className="text-4xl font-bold">{byFeature.ramalan_pernikahan}</p>
                                        <p className="text-sm text-white/60 mt-1">ramalan</p>
                                    </div>
                                </div>

                                {/* Ramalan Otonan */}
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden group hover:scale-105 transition-transform">
                                    <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">auto_awesome</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-white/70 text-lg">auto_awesome</span>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">Otonan</p>
                                        </div>
                                        <p className="text-4xl font-bold">{byFeature.ramalan_otonan}</p>
                                        <p className="text-sm text-white/60 mt-1">ramalan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Log Table */}
                            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
                                <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h2 className="font-display text-xl font-bold text-stone-800">
                                        📋 Daftar Log Input
                                    </h2>
                                    
                                    {/* Filter Controls */}
                                    <div className="flex flex-wrap gap-2">
                                        {(['all', 'kecocokan_pasangan', 'mencari_jodoh', 'ramalan_pernikahan', 'ramalan_otonan'] as FilterType[]).map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setActiveFilter(filter)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                                                    activeFilter === filter
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                                }`}
                                            >
                                                {filter === 'all' ? 'Semua' : featureLabels[filter as FeatureType]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-stone-50">
                                            <tr>
                                                <th className="text-left py-4 px-6 text-xs uppercase tracking-widest font-bold text-stone-500">No</th>
                                                <th className="text-left py-4 px-6 text-xs uppercase tracking-widest font-bold text-stone-500">Fitur</th>
                                                <th className="text-left py-4 px-6 text-xs uppercase tracking-widest font-bold text-stone-500">Tanggal Lahir 1</th>
                                                <th className="text-left py-4 px-6 text-xs uppercase tracking-widest font-bold text-stone-500">Tanggal Lahir 2</th>
                                                <th className="text-left py-4 px-6 text-xs uppercase tracking-widest font-bold text-stone-500">Waktu Input</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {paginatedLogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-12 text-center text-stone-400">
                                                        Belum ada data log untuk filter ini
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedLogs.map((log, index) => (
                                                    <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                                                        <td className="py-4 px-6 text-stone-600">
                                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${featureColors[log.feature_type]}`}>
                                                                {featureLabels[log.feature_type]}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 font-medium text-stone-800">
                                                            {formatDate(log.tanggal_lahir)}
                                                        </td>
                                                        <td className="py-4 px-6 font-medium text-stone-800">
                                                            {log.tanggal_lahir_2 ? formatDate(log.tanggal_lahir_2) : '-'}
                                                        </td>
                                                        <td className="py-4 px-6 text-stone-500 text-sm">
                                                            {formatDateTime(log.created_at)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="p-6 border-t border-stone-100 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {getPageNumbers().map((page, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                                    disabled={page === '...'}
                                                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                                                        currentPage === page
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                                            : page === '...'
                                                            ? 'text-stone-400 cursor-default'
                                                            : 'bg-white border border-stone-200 text-stone-600 hover:border-primary hover:text-primary cursor-pointer'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                </div>
            </section>

            <Footer />
        </div>
    );
}
