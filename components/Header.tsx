'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();



    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Kecocokan Pasangan', href: '/kecocokan-pasangan' },
        { name: 'Mencari Jodoh', href: '/mencari-jodoh' },
        { name: 'Ramalan Otonan', href: '/ramalan-otonan' },
        { name: 'Ramalan Pernikahan', href: '/ramalan-pernikahan' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-accent-gold/10">
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="material-icons-outlined text-accent-gold text-3xl">flare</span>
                    <span className="font-display text-2xl font-bold tracking-tight text-primary">
                        Metemu
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-10 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors h-20 flex items-center border-b-2 ${pathname === link.href
                                ? 'text-primary border-primary'
                                : 'text-stone-600 hover:text-primary border-transparent'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 pb-6 px-6' : 'max-h-0'}`}>
                <div className="flex flex-col gap-4 pt-4 border-t border-accent-gold/10 items-center text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`transition-colors font-medium py-2 w-full ${pathname === link.href
                                ? 'text-primary'
                                : 'text-stone-600 hover:text-primary'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
