'use client';

import { useEffect, useState } from 'react';
import { KategoriJodoh } from '@/lib/types';

interface HeartMeterProps {
    percentage: number;
    kategori: KategoriJodoh;
    isVisible: boolean;
}

export default function HeartMeter({ percentage, kategori, isVisible }: HeartMeterProps) {
    const [currentFill, setCurrentFill] = useState(100);
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

    useEffect(() => {
        if (isVisible) {
            // Animate fill from 0
            const targetFill = 100 - percentage;
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = 100 - (percentage * easeOut);
                setCurrentFill(current);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Spawn love particles when animation completes
                    spawnParticles();
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isVisible, percentage]);

    const spawnParticles = () => {
        const emojis = ['💕', '❤️', '💖', '✨', '💗'];
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x: 50 + (Math.random() - 0.5) * 60,
            y: 50 + (Math.random() - 0.5) * 40,
            emoji: emojis[Math.floor(Math.random() * emojis.length)]
        }));
        setParticles(newParticles);

        // Clear particles after animation
        setTimeout(() => setParticles([]), 3000);
    };

    const getGradientColors = () => {
        switch (kategori.kategori) {
            case 'Sri': return { start: '#10B981', end: '#059669' };
            case 'Dana': return { start: '#22C55E', end: '#16A34A' };
            case 'Laba': return { start: '#3B82F6', end: '#2563EB' };
            case 'Sakti': return { start: '#F59E0B', end: '#D97706' };
            case 'Tiwas': return { start: '#EF4444', end: '#DC2626' };
            default: return { start: '#C9A227', end: '#8B6914' };
        }
    };

    const getBadgeClass = () => {
        const map: Record<string, string> = {
            'Sri': 'badge-soft-sri',
            'Dana': 'badge-soft-dana',
            'Laba': 'badge-soft-laba',
            'Sakti': 'badge-soft-sakti',
            'Tiwas': 'badge-soft-tiwas'
        };
        return map[kategori.kategori] || 'badge-soft-laba';
    };

    const colors = getGradientColors();

    return (
        <div className="clean-card p-8 md:p-12 text-center fade-in glow-gold" style={{ animationDelay: '400ms' }}>
            <h3 className="heading-2 text-gold-gradient mb-8">Hasil Kecocokan</h3>

            {/* Animated Heart */}
            <div className="heart-container mb-8 relative">
                {/* Love Particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="love-particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                    >
                        {particle.emoji}
                    </div>
                ))}

                <svg
                    viewBox="0 0 100 100"
                    className={`heart-svg ${isVisible ? 'heart-pulse' : ''}`}
                >
                    <defs>
                        <linearGradient id="heartGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor={colors.start} />
                            <stop offset="100%" stopColor={colors.end} />
                        </linearGradient>
                        <clipPath id="heartClip">
                            <path d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88 Z" />
                        </clipPath>
                    </defs>

                    {/* Background Heart */}
                    <path
                        d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88 Z"
                        fill="#F3F0EA"
                        stroke="#E8D59C"
                        strokeWidth="2"
                    />

                    {/* Filled Heart with clip */}
                    <g clipPath="url(#heartClip)">
                        <rect
                            x="0"
                            y={currentFill}
                            width="100"
                            height={100 - currentFill + 5}
                            fill="url(#heartGradient)"
                            style={{ transition: 'y 0.1s ease-out' }}
                        />
                    </g>

                    {/* Heart Outline */}
                    <path
                        d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88 Z"
                        fill="none"
                        stroke={colors.start}
                        strokeWidth="2.5"
                        opacity="0.6"
                    />
                </svg>

                {/* Percentage Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
                        <span
                            className="text-3xl font-bold"
                            style={{ color: colors.start }}
                        >
                            {Math.round(100 - currentFill)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Kategori Badge */}
            <div className="mb-6">
                <span className={`badge-soft ${getBadgeClass()} text-lg px-8 py-3`}>
                    {kategori.kategori}
                </span>
            </div>

            {/* Makna */}
            <p className="text-lg text-bali-brown/70 max-w-md mx-auto leading-relaxed">
                {kategori.makna}
            </p>

            {/* Divider */}
            <div className="divider-gold my-8" />

            {/* Additional Info */}
            <p className="text-sm text-bali-brown/50">
                Perhitungan berdasarkan jumlah nilai urip dari kelahiran kedua pasangan menurut kalender Bali
            </p>
        </div>
    );
}
