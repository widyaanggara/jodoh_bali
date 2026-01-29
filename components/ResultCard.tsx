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
            className="clean-card p-6 fade-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bali-gold-light to-bali-gold/30 flex items-center justify-center">
                    <span className="text-2xl">🌸</span>
                </div>
                <div>
                    <p className="text-sm text-bali-brown/50">{title}</p>
                    <h3 className="heading-3 text-bali-brown">Wuku {balineseDate.wuku.nama_wuku}</h3>
                </div>
            </div>

            <p className="text-bali-brown/70 text-sm mb-4 leading-relaxed">
                {balineseDate.wuku.deskripsi}
            </p>

            {/* Pancawara & Saptawara */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-bali-cream rounded-xl p-3">
                    <p className="text-bali-gold text-xs font-medium mb-1">Pancawara</p>
                    <p className="text-bali-brown font-semibold">{balineseDate.pancawara.nama}</p>
                    <p className="text-bali-brown/50 text-xs">Urip: {balineseDate.pancawara.urip}</p>
                </div>
                <div className="bg-bali-cream rounded-xl p-3">
                    <p className="text-bali-gold text-xs font-medium mb-1">Saptawara</p>
                    <p className="text-bali-brown font-semibold">{balineseDate.saptawara.hari.split('/')[0]}</p>
                    <p className="text-bali-brown/50 text-xs">{balineseDate.saptawara.sifat}</p>
                </div>
            </div>

            {/* Sifat */}
            <div className="bg-bali-cream rounded-xl p-4 mb-4">
                <p className="text-bali-gold text-xs font-medium mb-1">Sifat Umum</p>
                <p className="text-bali-brown/80 text-sm">{balineseDate.wuku.sifat_umum}</p>
            </div>

            {/* Kelebihan & Kelemahan */}
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <div>
                        <p className="text-green-700 text-xs font-medium">Kelebihan</p>
                        <p className="text-bali-brown/70 text-sm">{balineseDate.wuku.kelebihan}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-600 text-xs">!</span>
                    </div>
                    <div>
                        <p className="text-amber-700 text-xs font-medium">Kelemahan</p>
                        <p className="text-bali-brown/70 text-sm">{balineseDate.wuku.kelemahan}</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="divider-gold my-5" />

            {/* Rekomendasi Pasangan */}
            <div>
                <p className="text-bali-gold text-xs font-medium mb-2 flex items-center gap-2">
                    <span>💕</span> Wuku Pasangan Ideal
                </p>
                <div className="flex flex-wrap gap-2">
                    {balineseDate.wuku.rekomendasi_pasangan.map((wuku, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 bg-bali-gold/10 border border-bali-gold/20 rounded-full text-bali-brown text-sm font-medium"
                        >
                            {wuku}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
