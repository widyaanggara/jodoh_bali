'use client';

import Link from 'next/link';
import { useState, useEffect, useId, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const navigationId = useId();
    const headerRef = useRef<HTMLElement>(null);
    const mobileToggleRef = useRef<HTMLButtonElement>(null);
    const submenuId = (variant: string, name: string) => `${navigationId}-${variant}-${name.replaceAll(' ', '-').toLowerCase()}`;
    const closeMenus = () => {
        setActiveDropdown(null);
        setActiveMobileDropdown(null);
        setIsMenuOpen(false);
    };

    // Close dropdown when clicking outside header
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!headerRef.current?.contains(event.target as Node)) {
                setActiveDropdown(null);
                setActiveMobileDropdown(null);
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
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
        {
            name: 'Petunjuk Otonan',
            href: '#',
            children: [
                { name: 'Mencari Otonan', href: '/mencari-otonan' },
                { name: 'Ramalan Otonan', href: '/ramalan-otonan' },
            ]
        },
        {
            name: 'Samyoga',
            href: '#',
            children: [
                { name: 'Sinergi Dua Orang', href: '/pawongan-sinergi' },
                { name: 'Sinergi Kelompok', href: '/pawongan-sinergi/kelompok' },
            ]
        },
        { name: 'Netra Hasta', href: '/netra-hasta' },
        { name: 'Tentang', href: '/about' },
    ];

    const toggleMobileDropdown = (name: string) => {
        setActiveMobileDropdown(prev => prev === name ? null : name);
    };

    return (
        <header ref={headerRef} onKeyDown={(event) => {
            if (event.key === 'Escape' && isMenuOpen) {
                event.preventDefault();
                closeMenus();
                mobileToggleRef.current?.focus();
            }
        }} className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-accent-gold/10">
            <nav aria-label="Navigasi utama" className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <span className="material-icons-outlined text-accent-gold text-3xl">flare</span>
                    <span className="font-display text-2xl font-bold tracking-tight text-primary">
                        Metemu
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div data-desktop-navigation className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        link.children ? (
                            <div key={link.name} className="relative group" onMouseLeave={(event) => {
                                if (!event.currentTarget.contains(document.activeElement)) setActiveDropdown(null);
                            }} onBlur={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget)) setActiveDropdown(null);
                            }} onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    event.preventDefault(); event.stopPropagation();
                                    setActiveDropdown(null);
                                    event.currentTarget.querySelector('button')?.focus();
                                }
                            }}>
                                <button
                                    type="button"
                                    aria-expanded={activeDropdown === link.name}
                                    aria-controls={submenuId('desktop', link.name)}
                                    onClick={(event) => setActiveDropdown(event.detail === 0 && activeDropdown === link.name ? null : link.name)}
                                    onMouseEnter={() => setActiveDropdown(link.name)}
                                    className={`focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer transition-colors h-20 flex items-center gap-1 border-b-2 hover:text-primary ${link.children.some(child => pathname === child.href) ? 'border-primary text-primary' : 'border-transparent text-stone-600'
                                        }`}
                                >
                                    {link.name}
                                    <span aria-hidden="true" className={`material-icons-outlined text-sm transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {activeDropdown === link.name && (
                                    <div
                                        id={submenuId('desktop', link.name)} role="group" aria-label={link.name}
                                        className="absolute top-[80%] left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 transform transition-all duration-200 origin-top-left"
                                        onMouseEnter={() => setActiveDropdown(link.name)}
                                    >
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                aria-current={pathname === child.href ? 'page' : undefined}
                                                onClick={closeMenus}
                                                className={`focus-visible:outline-2 focus-visible:outline-primary cursor-pointer block px-4 py-3 rounded-xl transition-colors text-sm ${pathname === child.href
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
                                aria-current={pathname === link.href ? 'page' : undefined}
                                onClick={closeMenus}
                                className={`focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer transition-colors h-20 flex items-center border-b-2 ${pathname === link.href
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
                        ref={mobileToggleRef}
                        type="button"
                        onClick={() => { setIsMenuOpen(!isMenuOpen); setActiveMobileDropdown(null); }}
                        className="focus-visible:outline-2 focus-visible:outline-primary cursor-pointer lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="metemu-mobile-navigation"
                    >
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div id="metemu-mobile-navigation" role="navigation" aria-label="Navigasi utama seluler" aria-hidden={!isMenuOpen} inert={!isMenuOpen} className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[800px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 flex flex-col gap-2 pt-4 border-t border-accent-gold/10 bg-white/95 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        link.children ? (
                            <div key={link.name} className="flex flex-col bg-stone-50 rounded-xl overflow-hidden transition-all duration-300" onKeyDown={(event) => {
                                if (event.key === 'Escape' && activeMobileDropdown === link.name) {
                                    event.preventDefault(); event.stopPropagation();
                                    setActiveMobileDropdown(null);
                                    event.currentTarget.querySelector('button')?.focus();
                                }
                            }}>
                                <button
                                    type="button"
                                    aria-expanded={activeMobileDropdown === link.name}
                                    aria-controls={submenuId('mobile', link.name)}
                                    onClick={() => toggleMobileDropdown(link.name)}
                                    className={`focus-visible:outline-2 focus-visible:outline-primary cursor-pointer px-4 py-3 font-bold text-primary text-sm flex items-center justify-between w-full hover:bg-stone-100 transition-colors ${link.children.some(child => pathname === child.href) ? 'bg-primary/5' : ''}`}
                                >
                                    {link.name}
                                    <span aria-hidden="true" className={`material-icons-outlined text-xs transition-transform duration-300 ${activeMobileDropdown === link.name ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>
                                <div
                                    id={submenuId('mobile', link.name)} role="group" aria-label={link.name}
                                    inert={activeMobileDropdown !== link.name} aria-hidden={activeMobileDropdown !== link.name}
                                    className={`flex flex-col border-stone-200 transition-all duration-300 w-full overflow-hidden ${activeMobileDropdown === link.name ? 'max-h-48 border-t opacity-100' : 'max-h-0 border-t-0 opacity-0'
                                        }`}
                                >
                                    {link.children.map(child => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            aria-current={pathname === child.href ? 'page' : undefined}
                                            onClick={closeMenus}
                                            className={`focus-visible:outline-2 focus-visible:outline-primary cursor-pointer px-6 py-3 text-sm transition-colors border-l-2 ${pathname === child.href
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
                                aria-current={pathname === link.href ? 'page' : undefined}
                                onClick={closeMenus}
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
