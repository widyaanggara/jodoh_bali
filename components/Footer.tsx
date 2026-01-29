import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-50 dark:bg-stone-950 pt-20 pb-10 border-t border-accent-gold/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-outlined text-accent-gold text-2xl">flare</span>
              <span className="font-display text-xl font-bold text-primary">Jodoh Bali</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
              Menghubungkan hati di Pulau Dewata dengan sentuhan modern dan nilai tradisional.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-primary">
                <span className="material-icons-outlined text-lg">language</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-primary">
                <span className="material-icons-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>
          
          <div>
            <h6 className="font-bold text-stone-900 dark:text-stone-100 mb-6">Perusahaan</h6>
            <ul className="space-y-4 text-sm text-stone-500 dark:text-stone-400">
              <li><Link href="#" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-primary">Karir</Link></li>
              <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
              <li><Link href="#" className="hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-bold text-stone-900 dark:text-stone-100 mb-6">Dukungan</h6>
            <ul className="space-y-4 text-sm text-stone-500 dark:text-stone-400">
              <li><Link href="#" className="hover:text-primary">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-primary">Tips Keamanan</Link></li>
              <li><Link href="#" className="hover:text-primary">Aturan Keamanan</Link></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-bold text-stone-900 dark:text-stone-100 mb-6">Legal</h6>
            <ul className="space-y-4 text-sm text-stone-500 dark:text-stone-400">
              <li><Link href="#" className="hover:text-primary">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-primary">Kebijakan Cookie</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-accent-gold/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400 dark:text-stone-600">
            © 2024 Jodoh Bali. Dibuat dengan cinta di Pulau Dewata. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6 text-xs text-stone-400">
            <span className="material-icons-outlined text-sm">verified</span> Verified Secure
          </div>
        </div>
      </div>
    </footer>
  );
}
