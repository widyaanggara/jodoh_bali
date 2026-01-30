'use client';

import { BalineseDate } from '@/lib/types';

interface ResultCardProps {
    title: string;
    balineseDate: BalineseDate;
    delay?: number;
}

export default function ResultCard({ title, balineseDate, delay = 0 }: ResultCardProps) {
    return (
        <div
            className="bg-surface-light p-8 rounded-[2.5rem] border border-accent-gold/10 shadow-xl shadow-stone-200/40 fade-in group hover:border-primary/30 transition-all text-left"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-white transition-colors">
                    <span className="material-icons-outlined text-accent-gold group-hover:text-white text-3xl">flare</span>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-accent-gold mb-1">{title}</p>
                    <h3 className="font-display text-2xl font-bold text-stone-900">Wuku {balineseDate.wuku.nama_wuku}</h3>
                </div>
            </div>

            <p className="text-stone-500 text-sm mb-8 leading-relaxed italic">
                "{balineseDate.wuku.deskripsi}"
            </p>

            {/* Pancawara & Saptawara */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-accent-gold mb-2">Pancawara</p>
                    <p className="text-stone-800 font-bold">{balineseDate.pancawara.nama}</p>
                    <p className="text-stone-400 text-[10px] mt-1">Urip: {balineseDate.pancawara.urip}</p>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-accent-gold mb-2">Saptawara</p>
                    <p className="text-stone-800 font-bold">{balineseDate.saptawara.hari.split('/')[0]}</p>
                    <p className="text-stone-400 text-[10px] mt-1">{balineseDate.saptawara.sifat}</p>
                </div>
            </div>

            {/* Sifat */}
            <div className="bg-stone-50/50 rounded-2xl p-5 mb-6 border border-stone-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-accent-gold mb-2">Sifat Umum</p>
                <p className="text-stone-600 text-sm leading-relaxed">{balineseDate.wuku.sifat_umum}</p>
            </div>

            {/* Kelebihan & Kelemahan */}
            <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-green-500">
                        <span className="material-icons-outlined text-sm">done</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-green-600 mb-1">Kelebihan</p>
                        <p className="text-stone-600 text-sm">{balineseDate.wuku.kelebihan}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-500">
                        <span className="material-icons-outlined text-sm">priority_high</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-1">Kelemahan</p>
                        <p className="text-stone-600 text-sm">{balineseDate.wuku.kelemahan}</p>
                    </div>
                </div>
            </div>

            {/* Rekomendasi Pasangan */}
            <div className="pt-6 border-t border-stone-100">
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-accent-gold mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-xs">favorite</span> Wuku Pasangan Ideal
                </p>
                <div className="flex flex-wrap gap-2">
                    {balineseDate.wuku.rekomendasi_pasangan.map((wuku, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 bg-accent-gold/5 border border-accent-gold/10 rounded-full text-stone-600 text-xs font-bold"
                        >
                            {wuku}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
