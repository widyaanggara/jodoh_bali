'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="glass-card mt-4 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bali-gold to-bali-brown flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                                🌺
                            </div>
                            <span className="text-xl font-bold text-gold-gradient hidden sm:block">
                                Jodoh Bali
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                href="/"
                                className="text-bali-cream/80 hover:text-bali-gold transition-colors duration-300 font-medium"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/kecocokan-pasangan"
                                className="text-bali-cream/80 hover:text-bali-gold transition-colors duration-300 font-medium"
                            >
                                Kecocokan Pasangan
                            </Link>
                            <Link
                                href="/mencari-jodoh"
                                className="text-bali-cream/80 hover:text-bali-gold transition-colors duration-300 font-medium"
                            >
                                Mencari Jodoh
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <span className={`w-6 h-0.5 bg-bali-gold transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-6 h-0.5 bg-bali-gold transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-6 h-0.5 bg-bali-gold transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-48 mt-4' : 'max-h-0'}`}>
                        <div className="flex flex-col gap-4 py-4 border-t border-bali-gold/20">
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-bali-cream/80 hover:text-bali-gold transition-colors duration-300 font-medium"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/kecocokan-pasangan"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-bali-cream/80 hover:text-bali-gold transition-colors duration-300 font-medium"
                            >
                                Kecocokan Pasangan
                            </Link>
                            <Link
                                href="/mencari-jodoh"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-bali-cream/80 hover:text-bali-gold transition-colors duration-300 font-medium"
                            >
                                Mencari Jodoh
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
