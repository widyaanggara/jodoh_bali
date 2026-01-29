'use client';

import { useEffect, useState } from 'react';

interface Flower {
    id: number;
    left: string;
    top: string;
    size: number;
    delay: number;
    duration: number;
}

interface Sparkle {
    id: number;
    left: string;
    top: string;
    delay: number;
}

export default function FloatingElements() {
    const [flowers, setFlowers] = useState<Flower[]>([]);
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        // Generate random flowers - fewer and more subtle
        const newFlowers: Flower[] = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 85 + 5}%`,
            top: `${Math.random() * 70 + 15}%`,
            size: Math.random() * 16 + 16,
            delay: Math.random() * 8,
            duration: Math.random() * 15 + 15,
        }));
        setFlowers(newFlowers);

        // Generate gold sparkles
        const newSparkles: Sparkle[] = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: Math.random() * 4,
        }));
        setSparkles(newSparkles);
    }, []);

    return (
        <>
            {/* Subtle Background Pattern */}
            <div className="bali-pattern" />

            {/* Floating Flowers */}
            {flowers.map((flower) => (
                <div
                    key={flower.id}
                    className="floating-flower"
                    style={{
                        left: flower.left,
                        top: flower.top,
                        fontSize: `${flower.size}px`,
                        animationDelay: `${flower.delay}s`,
                        animationDuration: `${flower.duration}s`,
                    }}
                >
                    🌺
                </div>
            ))}

            {/* Gold Sparkles */}
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="gold-sparkle"
                    style={{
                        left: sparkle.left,
                        top: sparkle.top,
                        animationDelay: `${sparkle.delay}s`,
                    }}
                />
            ))}
        </>
    );
}
