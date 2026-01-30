'use client';

import { IdealMatch } from '@/lib/jodoh-logic';
import { formatDate } from '@/lib/balinese-calendar';

interface MatchCardProps {
    match: IdealMatch;
    index: number;
}

export default function IdealMatchCard({ match, index }: MatchCardProps) {
    return (
        <div
            className="bg-surface-light p-6 rounded-3xl border border-accent-gold/10 hover:border-accent-gold transition-all group slide-up shadow-sm hover:shadow-md"
            style={{ animationDelay: `${200 + index * 50}ms` }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Date and Info */}
                <div className="flex items-center gap-5 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <span className="material-icons-outlined text-2xl text-emerald-500 group-hover:text-white">
                            favorite
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="text-stone-900 font-bold text-lg">
                            {formatDate(match.date)}
                        </p>
                        <p className="text-stone-400 text-xs mt-1">
                            Wuku {match.balineseDate.wuku.nama_wuku} • {match.balineseDate.pancawara.nama} • {match.balineseDate.saptawara.hari.split('/')[0]}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-emerald-200/50">
                        ✨ SRI
                    </span>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-emerald-500">
                            95%
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">
                            Kecocokan
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
