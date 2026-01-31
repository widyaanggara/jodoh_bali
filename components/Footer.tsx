import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-outlined text-primary text-2xl">flare</span>
              <span className="font-display text-xl font-bold text-white">Jodoh Bali</span>
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
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link href="/kecocokan-pasangan" className="hover:text-primary">Kecocokan Pasangan</Link></li>
              <li><Link href="/mencari-jodoh" className="hover:text-primary">Mencari Jodoh</Link></li>
              <li><Link href="/ramalan-pernikahan" className="hover:text-primary">Ramalan Pernikahan</Link></li>
              <li><Link href="/ramalan-otonan" className="hover:text-primary">Ramalan Otonan</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-white mb-6">Informasi</h6>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link href="/about" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
              <li><Link href="#" className="hover:text-primary">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
            </ul>
          </div>


        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © 2024 Jodoh Bali. Dibuat dengan cinta di Pulau Dewata. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6 text-xs text-stone-500">
            <span className="material-icons-outlined text-sm">verified</span> Verified Secure
          </div>
        </div>
      </div>
    </footer>
  );
}
