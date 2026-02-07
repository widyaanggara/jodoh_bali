'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '/' },
        {
            name: 'Peramalan Jodoh',
            href: '#',
            children: [
                { name: 'Kecocokan Pasangan', href: '/kecocokan-pasangan' },
                { name: 'Mencari Jodoh', href: '/mencari-jodoh' },
                { name: 'Ramalan Pernikahan', href: '/ramalan-pernikahan' },
            ]
        },
        { name: 'Ramalan Otonan', href: '/ramalan-otonan' },
        { name: 'Tentang', href: '/about' },
    ];

    const toggleMobileDropdown = (name: string) => {
        setActiveMobileDropdown(prev => prev === name ? null : name);
    };

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
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        link.children ? (
                            <div key={link.name} className="relative group" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    className={`cursor-pointer transition-colors h-20 flex items-center gap-1 border-b-2 border-transparent text-stone-600 hover:text-primary ${link.children.some(child => pathname === child.href) ? 'text-primary' : ''
                                        }`}
                                >
                                    {link.name}
                                    <span className={`material-icons-outlined text-sm transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div
                                        className="absolute top-[80%] left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 transform transition-all duration-200 origin-top-left"
                                        onMouseLeave={() => setIsDropdownOpen(false)}
                                    >
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className={`cursor-pointer block px-4 py-3 rounded-xl transition-colors text-sm ${pathname === child.href
                                                        ? 'bg-primary/5 text-primary font-bold'
                                                        : 'text-stone-600 hover:bg-stone-50 hover:text-primary'
                                                    }`}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`cursor-pointer transition-colors h-20 flex items-center border-b-2 ${pathname === link.href
                                        ? 'text-primary border-primary'
                                        : 'text-stone-600 hover:text-primary border-transparent'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="cursor-pointer md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 flex flex-col gap-2 pt-4 border-t border-accent-gold/10 bg-white/95 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        link.children ? (
                            <div key={link.name} className="flex flex-col bg-stone-50 rounded-xl overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => toggleMobileDropdown(link.name)}
                                    className="cursor-pointer px-4 py-3 font-bold text-primary text-sm flex items-center justify-between w-full hover:bg-stone-100 transition-colors"
                                >
                                    {link.name}
                                    <span className={`material-icons-outlined text-xs transition-transform duration-300 ${activeMobileDropdown === link.name ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>
                                <div 
                                    className={`flex flex-col border-stone-200 transition-all duration-300 w-full overflow-hidden ${
                                        activeMobileDropdown === link.name ? 'max-h-48 border-t opacity-100' : 'max-h-0 border-t-0 opacity-0'
                                    }`}
                                >
                                    {link.children.map(child => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`cursor-pointer px-6 py-3 text-sm transition-colors border-l-2 ${pathname === child.href
                                                    ? 'text-primary border-primary bg-white font-medium'
                                                    : 'text-stone-600 hover:text-primary border-transparent'
                                                }`}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`transition-colors font-medium px-4 py-3 rounded-xl w-full ${pathname === link.href
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-stone-600 hover:bg-stone-50 hover:text-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </header>
    );
}
