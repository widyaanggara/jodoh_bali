'use client';

import { KategoriJodoh } from '@/lib/types';

interface CompatibilityMeterProps {
    percentage: number;
    kategori: KategoriJodoh;
}

export default function CompatibilityMeter({ percentage, kategori }: CompatibilityMeterProps) {
    // Calculate stroke offset for SVG circle
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;

    const getGradientColors = () => {
        switch (kategori.kategori) {
            case 'Sri': return ['#10B981', '#059669'];
            case 'Dana': return ['#22C55E', '#16A34A'];
            case 'Laba': return ['#3B82F6', '#2563EB'];
            case 'Sakti': return ['#F59E0B', '#D97706'];
            case 'Tiwas': return ['#EF4444', '#DC2626'];
            default: return ['#D4AF37', '#8B4513'];
        }
    };

    const getBadgeClass = () => {
        switch (kategori.kategori) {
            case 'Sri': return 'badge-sri';
            case 'Dana': return 'badge-dana';
            case 'Laba': return 'badge-laba';
            case 'Sakti': return 'badge-sakti';
            case 'Tiwas': return 'badge-tiwas';
            default: return 'badge-laba';
        }
    };

    const colors = getGradientColors();

    return (
        <div className="glass-card p-8 fade-in text-center" style={{ animationDelay: '400ms' }}>
            <h3 className="heading-3 text-gold-gradient mb-6">Hasil Kecocokan</h3>

            {/* Circular Progress */}
            <div className="relative inline-block mb-6">
                <svg width="160" height="160" className="transform -rotate-90">
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={colors[0]} />
                            <stop offset="100%" stopColor={colors[1]} />
                        </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="45"
                        stroke="rgba(255, 248, 220, 0.1)"
                        strokeWidth="10"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="45"
                        stroke="url(#progressGradient)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        className="compatibility-ring"
                        style={{
                            '--ring-offset': offset,
                            strokeDasharray: circumference,
                            strokeDashoffset: circumference
                        } as React.CSSProperties}
                    />
                </svg>
                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                        <p className="text-4xl font-bold text-bali-cream">{percentage}%</p>
                        <p className="text-bali-cream/60 text-sm">Kecocokan</p>
                    </div>
                </div>
            </div>

            {/* Kategori Badge */}
            <div className="mb-4">
                <span className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${getBadgeClass()}`}>
                    {kategori.kategori}
                </span>
            </div>

            {/* Makna */}
            <p className="text-bali-cream/80 text-lg max-w-md mx-auto">
                {kategori.makna}
            </p>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-bali-gold/20">
                <p className="text-bali-cream/60 text-sm">
                    Perhitungan berdasarkan jumlah nilai urip dari kelahiran kedua pasangan menurut kalender Bali.
                </p>
            </div>
        </div>
    );
}
