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
            className="glass-card p-6 fade-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            <h3 className="heading-3 text-gold-gradient mb-4">{title}</h3>

            <div className="space-y-4">
                {/* Wuku Info */}
                <div className="bg-black/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🌸</span>
                        <h4 className="text-bali-gold font-semibold text-lg">Wuku {balineseDate.wuku.nama_wuku}</h4>
                    </div>
                    <p className="text-bali-cream/70 text-sm mb-2">{balineseDate.wuku.deskripsi}</p>
                    <p className="text-bali-cream/60 text-sm">
                        <span className="text-bali-gold">Sifat:</span> {balineseDate.wuku.sifat_umum}
                    </p>
                </div>

                {/* Pancawara & Saptawara */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/30 rounded-xl p-3">
                        <p className="text-bali-gold text-xs mb-1">Pancawara</p>
                        <p className="text-bali-cream font-semibold">{balineseDate.pancawara.nama}</p>
                        <p className="text-bali-cream/60 text-xs">Urip: {balineseDate.pancawara.urip}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3">
                        <p className="text-bali-gold text-xs mb-1">Saptawara</p>
                        <p className="text-bali-cream font-semibold">{balineseDate.saptawara.hari.split('/')[0]}</p>
                        <p className="text-bali-cream/60 text-xs">{balineseDate.saptawara.sifat}</p>
                    </div>
                </div>

                {/* Kelebihan & Kelemahan */}
                <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <div>
                            <p className="text-green-400 text-xs font-medium">Kelebihan</p>
                            <p className="text-bali-cream/70 text-sm">{balineseDate.wuku.kelebihan}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">!</span>
                        <div>
                            <p className="text-amber-400 text-xs font-medium">Kelemahan</p>
                            <p className="text-bali-cream/70 text-sm">{balineseDate.wuku.kelemahan}</p>
                        </div>
                    </div>
                </div>

                {/* Rekomendasi Pasangan */}
                <div className="bg-gradient-to-r from-bali-gold/10 to-bali-brown/10 rounded-xl p-3">
                    <p className="text-bali-gold text-xs mb-2">💕 Wuku Pasangan Ideal</p>
                    <div className="flex flex-wrap gap-2">
                        {balineseDate.wuku.rekomendasi_pasangan.map((wuku, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-bali-gold/20 rounded-full text-bali-cream text-sm"
                            >
                                {wuku}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
