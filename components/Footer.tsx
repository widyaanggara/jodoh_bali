'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-outlined text-primary text-2xl">flare</span>
              <span className="font-display text-xl font-bold text-white">Metemu</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Menghubungkan hati di Pulau Dewata dengan sentuhan modern dan nilai tradisional.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all">
                <span className="material-icons-outlined text-lg">language</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all">
                <span className="material-icons-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>

          <div>
            <h6 className="font-bold text-white mb-6">Fitur Utama</h6>
            <div className="space-y-1">
              {/* Dropdown Peramalan Jodoh */}
              <div
                className="flex flex-col"
                onMouseEnter={() => setActiveDropdown('jodoh')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => toggleDropdown('jodoh')}
                  className="flex items-center justify-between w-full text-left py-2 text-sm text-stone-300 font-medium hover:text-primary transition-colors cursor-pointer"
                >
                  Peramalan Jodoh
                  <span className={`material-icons-outlined text-sm transition-transform duration-300 ${activeDropdown === 'jodoh' ? '-rotate-180 text-primary' : ''}`}>expand_more</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeDropdown === 'jodoh' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <ul className="overflow-hidden text-sm text-stone-400 border-l border-white/10 ml-2">
                    <div className="flex flex-col gap-3 pt-2 pb-3">
                      <Link href="/kecocokan-pasangan" className="hover:text-primary transition-colors block pl-4">Kecocokan Pasangan</Link>
                      <Link href="/mencari-jodoh" className="hover:text-primary transition-colors block pl-4">Mencari Jodoh</Link>
                      <Link href="/ramalan-pernikahan" className="hover:text-primary transition-colors block pl-4">Ramalan Pernikahan</Link>
                    </div>
                  </ul>
                </div>
              </div>

              {/* Dropdown Petunjuk Otonan */}
              <div
                className="flex flex-col"
                onMouseEnter={() => setActiveDropdown('otonan')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => toggleDropdown('otonan')}
                  className="flex items-center justify-between w-full text-left py-2 text-sm text-stone-300 font-medium hover:text-primary transition-colors cursor-pointer"
                >
                  Petunjuk Otonan
                  <span className={`material-icons-outlined text-sm transition-transform duration-300 ${activeDropdown === 'otonan' ? '-rotate-180 text-primary' : ''}`}>expand_more</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${activeDropdown === 'otonan' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <ul className="overflow-hidden text-sm text-stone-400 border-l border-white/10 ml-2">
                    <div className="flex flex-col gap-3 pt-2 pb-3">
                      <Link href="/mencari-otonan" className="hover:text-primary transition-colors block pl-4">Mencari Otonan</Link>
                      <Link href="/ramalan-otonan" className="hover:text-primary transition-colors block pl-4">Ramalan Otonan</Link>
                    </div>
                  </ul>
                </div>
              </div>

              {/* Samyoga (Non Dropdown) */}
              <div className="pt-2">
                <Link href="/pawongan-sinergi" className="text-sm text-stone-300 font-medium hover:text-primary transition-colors block">Samyoga</Link>
              </div>
            </div>
          </div>

          <div>
            <h6 className="font-bold text-white mb-6">Informasi</h6>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">Tentang</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © 2026 Metemu. Dibuat dengan cinta di Pulau Dewata. Seluruh hak cipta dilindungi.
          </p>

        </div>
      </div>
    </footer>
  );
}
