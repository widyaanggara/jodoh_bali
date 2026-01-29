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

interface Particle {
    id: number;
    left: string;
    top: string;
    delay: number;
}

export default function FloatingElements() {
    const [flowers, setFlowers] = useState<Flower[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate random flowers
        const newFlowers: Flower[] = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 80 + 10}%`,
            size: Math.random() * 20 + 20,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 10,
        }));
        setFlowers(newFlowers);

        // Generate random particles
        const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: Math.random() * 3,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <>
            {/* Background Pattern */}
            <div className="bali-pattern" />

            {/* Floating Flowers */}
            {flowers.map((flower) => (
                <div
                    key={flower.id}
                    className="floating-flower text-2xl sm:text-3xl"
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

            {/* Gold Particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="gold-particle"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
        </>
    );
}
