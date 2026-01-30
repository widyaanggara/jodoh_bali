'use client';

import { useEffect, useState, useCallback } from 'react';
import { KategoriJodoh } from '@/lib/types';

interface HeartMeterProps {
    percentage: number;
    kategori: KategoriJodoh;
    isVisible: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    emoji: string;
    scale: number;
    rotation: number;
    delay: number;
}

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
}

export default function HeartMeter({ percentage, kategori, isVisible }: HeartMeterProps) {
    const [currentFill, setCurrentFill] = useState(100);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const spawnParticles = useCallback(() => {
        const emojis = ['💕', '❤️', '💖', '✨', '💗', '💓', '💘', '♥️'];
        const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
            id: Date.now() + i,
            x: 50 + (Math.random() - 0.5) * 80,
            y: 50 + (Math.random() - 0.5) * 60,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            scale: 0.6 + Math.random() * 0.8,
            rotation: Math.random() * 360,
            delay: Math.random() * 0.5
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 4000);
    }, []);

    const spawnSparkles = useCallback(() => {
        const newSparkles: Sparkle[] = Array.from({ length: 20 }, (_, i) => ({
            id: Date.now() + i + 100,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 4 + Math.random() * 8,
            delay: Math.random() * 1.5
        }));
        setSparkles(newSparkles);
        setTimeout(() => setSparkles([]), 3000);
    }, []);

    useEffect(() => {
        if (isVisible) {
            // Reset to start position first
            setCurrentFill(100);
            setIsAnimating(true);

            const duration = 2500;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 4);
                const current = 100 - (percentage * easeOut);
                setCurrentFill(current);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    spawnParticles();
                    spawnSparkles();
                }
            };

            // Small delay to ensure reset is visible
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, 50);
        } else {
            // Reset when hidden
            setCurrentFill(100);
            setIsAnimating(false);
        }
    }, [isVisible, percentage, spawnParticles, spawnSparkles]);

    const getGradientColors = () => {
        switch (kategori.kategori) {
            case 'Sri': return { start: '#10B981', mid: '#34D399', end: '#059669' };
            case 'Dana': return { start: '#22C55E', mid: '#4ADE80', end: '#16A34A' };
            case 'Laba': return { start: '#3B82F6', mid: '#60A5FA', end: '#2563EB' };
            case 'Sakti': return { start: '#F59E0B', mid: '#FBBF24', end: '#D97706' };
            case 'Tiwas': return { start: '#EF4444', mid: '#F87171', end: '#DC2626' };
            default: return { start: '#EC4899', mid: '#F472B6', end: '#DB2777' };
        }
    };

    const colors = getGradientColors();
    const displayPercentage = Math.round(100 - currentFill);

    return (
        <div className="bg-surface-light p-10 md:p-14 text-center rounded-[3rem] border border-accent-gold/10 shadow-2xl shadow-stone-200/50 slide-up overflow-hidden relative">

            {/* Background Glow */}
            <div
                className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${colors.start}, transparent 70%)`,
                    opacity: isAnimating ? 0.3 : 0
                }}
            />

            <h3 className="font-display text-3xl font-bold text-stone-900 mb-10 relative z-10">
                Hasil Kecocokan
            </h3>

            {/* Animated Heart Container */}
            <div className="heart-container mb-10 relative">

                {/* Sparkles */}
                {sparkles.map((sparkle) => (
                    <div
                        key={sparkle.id}
                        className="absolute rounded-full animate-sparkle"
                        style={{
                            left: `${sparkle.x}%`,
                            top: `${sparkle.y}%`,
                            width: `${sparkle.size}px`,
                            height: `${sparkle.size}px`,
                            background: `linear-gradient(135deg, ${colors.start}, ${colors.mid})`,
                            animationDelay: `${sparkle.delay}s`,
                            boxShadow: `0 0 ${sparkle.size * 2}px ${colors.start}`
                        }}
                    />
                ))}

                {/* Love Particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="love-particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            fontSize: `${24 * particle.scale}px`,
                            animationDelay: `${particle.delay}s`,
                            transform: `rotate(${particle.rotation}deg)`
                        }}
                    >
                        {particle.emoji}
                    </div>
                ))}

                {/* Pulsing Glow Ring */}
                <div
                    className={`absolute inset-0 rounded-full ${isAnimating ? 'animate-pulse-glow' : ''}`}
                    style={{
                        background: `radial-gradient(circle, transparent 40%, ${colors.start}20 60%, transparent 70%)`,
                    }}
                />

                <svg
                    viewBox="0 0 100 100"
                    className={`heart-svg w-full h-full relative z-10 ${isVisible ? 'heart-pulse' : ''}`}
                >
                    <defs>
                        {/* Multi-color gradient */}
                        <linearGradient id="heartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.end} />
                            <stop offset="50%" stopColor={colors.mid} />
                            <stop offset="100%" stopColor={colors.start} />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <clipPath id="heartClip">
                            <path d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88 Z" />
                        </clipPath>
                    </defs>

                    {/* Background Heart */}
                    <path
                        d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88 Z"
                        fill="currentColor"
                        className="text-stone-100"
                    />

                    {/* Animated Fill */}
                    <g clipPath="url(#heartClip)">
                        {/* Wave effect layers */}
                        <rect
                            x="0"
                            y={currentFill - 3}
                            width="100"
                            height={100 - currentFill + 8}
                            fill="url(#heartGradient)"
                            opacity="0.3"
                        />
                        <rect
                            x="0"
                            y={currentFill}
                            width="100"
                            height={100 - currentFill + 5}
                            fill="url(#heartGradient)"
                            filter="url(#glow)"
                        />
                    </g>

                    {/* Heart Outline with glow */}
                    <path
                        d="M50 88 C20 65, 5 45, 10 30 C15 15, 30 10, 50 25 C70 10, 85 15, 90 30 C95 45, 80 65, 50 88 Z"
                        fill="none"
                        stroke={colors.start}
                        strokeWidth="2.5"
                        opacity="0.5"
                        filter="url(#glow)"
                    />
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div
                        className="bg-white/95 backdrop-blur-sm rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-2xl border-2 transition-all duration-300"
                        style={{
                            borderColor: colors.start,
                            boxShadow: `0 0 30px ${colors.start}40`
                        }}
                    >
                        <span
                            className="text-xl font-bold transition-all duration-100"
                            style={{ color: colors.start }}
                        >
                            {displayPercentage}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Kategori Badge with animation */}
            <div className="mb-8 relative z-10">
                <span
                    className="inline-block px-10 py-4 rounded-full text-white font-bold text-xl shadow-xl transition-transform"
                    style={{
                        background: `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`,
                        boxShadow: `0 10px 40px ${colors.start}50`
                    }}
                >
                    ✨ {kategori.kategori} ✨
                </span>
            </div>

            {/* Makna */}
            <p className="font-display text-xl text-stone-700 max-w-md mx-auto leading-relaxed italic relative z-10">
                "{kategori.makna}"
            </p>

            {/* Divider */}
            <div
                className="h-1 rounded-full my-10 mx-auto max-w-xs"
                style={{ background: `linear-gradient(90deg, transparent, ${colors.start}40, transparent)` }}
            />

            {/* Additional Info */}
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400 relative z-10">
                Berdasarkan Nilai Urip Gabungan
            </p>

            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-2xl opacity-10 animate-float-heart"
                        style={{
                            left: `${15 + i * 15}%`,
                            bottom: `-20px`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: `${4 + i * 0.5}s`
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>
        </div>
    );
}
