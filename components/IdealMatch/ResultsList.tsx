'use client';

import { useState } from 'react';
import { IdealMatch, filterByMonth } from '@/lib/jodoh-logic';
import IdealMatchCard from './MatchCard';

interface ResultsListProps {
    matches: IdealMatch[];
}

const MONTHS = [
    'Semua Bulan',
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function IdealMatchResultsList({ matches }: ResultsListProps) {
    const [selectedMonth, setSelectedMonth] = useState(0); // 0 = All months

    const filteredMatches = selectedMonth === 0
        ? matches
        : filterByMonth(matches, selectedMonth);

    if (matches.length === 0) {
        return (
            <div className="text-center py-16">
                <span className="material-icons-outlined text-6xl text-stone-300 mb-4 block">
                    search_off
                </span>
                <p className="text-stone-400 text-lg">
                    Belum ada hasil pencarian
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 px-2">
                <div>
                    <h3 className="font-display text-2xl font-bold mb-1">
                        Tanggal Jodoh Ideal
                    </h3>
                    <p className="text-stone-500 text-sm">
                        Status <span className="text-emerald-500 font-bold">SRI</span> - Rejeki melimpah & harmonis
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full">
                        {filteredMatches.length} Ditemukan
                    </span>
                </div>
            </div>

            {/* Month Filter */}
            <div className="mb-6">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-1 mb-2 block">
                    Filter Bulan
                </label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full sm:w-auto px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-primary focus:border-primary text-sm transition-all outline-none"
                >
                    {MONTHS.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results Grid */}
            <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map((match, index) => (
                        <IdealMatchCard key={index} match={match} index={index} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-stone-400">
                            Tidak ada hasil untuk bulan {MONTHS[selectedMonth]}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
