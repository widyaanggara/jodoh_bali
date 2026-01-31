'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function AboutPage() {
    return (
        <div className="bg-background-light font-sans text-stone-800 min-h-screen selection:bg-accent-gold/30">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
                {/* Journal Header Area */}
                <div className="text-center mb-20 border-b border-stone-200 pb-12">
                    <p className="text-accent-gold font-bold tracking-[0.3em] uppercase text-xs mb-4">Edisi Literasi Wariga & Lontar Bali</p>
                    <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight">
                        Menilik Kedalaman <span className="italic">Tenung Jodoh</span>: <br />
                        Sains Tradisional dalam Harmoni Perkawinan
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-stone-900/60 text-sm italic">
                        <span>Oleh: Cultural Research Team Jodoh Bali</span>
                        <span className="w-1 h-1 bg-stone-300 rounded-full" />
                        <span>Pembaharuan Terakhir: Januari 2026</span>
                    </div>
                </div>

                {/* Introduction Section */}
                <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-8">
                    <p className="text-xl font-medium text-stone-800 italic border-l-4 border-accent-gold pl-6">
                        "Perkawinan dalam tradisi Bali bukanlah sekadar pertemuan dua insan, melainkan sinkronisasi energi semesta (Tri Hita Karana) yang tertuang dalam perhitungan Wariga."
                    </p>

                    <p>
                        Dalam pandangan hidup masyarakat Hindu Bali, setiap individu lahir dengan membawa "bekal" energi yang disebut <span className="font-bold text-primary">Urip</span> atau <span className="font-bold text-primary">Neptu</span>. Energi ini bukanlah angka acak, melainkan representasi dari posisi kosmik saat seseorang menghirup napas pertama di dunia. Aplikasi Jodoh Bali hadir untuk mentransparansi perhitungan sakral ini ke dalam algoritma modern tanpa mengurangi esensi spiritualnya.
                    </p>

                    {/* Section 1: Fondasi Energi (Saptawara & Pancawara) */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">I</span>
                            Fondasi Energi: Saptawara & Pancawara
                        </h2>
                        <p>
                            Sebelum melangkah pada ramalan, sistem kami terlebih dahulu mengidentifikasi dua pilar utama kelahiran: <span className="font-bold text-primary">Saptawara</span> (siklus 7 hari) dan <span className="font-bold text-primary">Pancawara</span> (siklus 5 hari). Gabungan keduanya menghasilkan total nilai energi yang menjadi basis seluruh perhitungan.
                        </p>

                        <div className="bg-primary/5 p-6 rounded-2xl my-6 border border-primary/10 text-center">
                            <p className="text-xs font-bold text-primary uppercase mb-2">Rumus Neptu Personal</p>
                            <InlineMath math={"Total\\ Neptu = Urip\\ Saptawara + Urip\\ Pancawara"} />
                        </div>

                        <div className="my-10 space-y-8">
                            {/* Saptawara Table */}
                            <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-white">
                                <div className="bg-stone-50 p-3 text-xs font-bold uppercase tracking-widest text-stone-500 border-b text-center">Tabel Urip Saptawara (Siklus 7)</div>
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {[
                                            { h: "Redite (Minggu)", u: 5 }, { h: "Soma (Senin)", u: 4 }, { h: "Anggara (Selasa)", u: 3 },
                                            { h: "Buda (Rabu)", u: 7 }, { h: "Wraspati (Kamis)", u: 8 }, { h: "Sukra (Jumat)", u: 6 },
                                            { h: "Saniscara (Sabtu)", u: 9 }
                                        ].map((item, idx) => (
                                            <tr key={item.h} className={`border-b border-stone-100 ${idx % 2 === 0 ? '' : 'bg-stone-50/30'}`}>
                                                <td className="p-3 pl-6 font-bold text-primary text-sm">{item.h}</td>
                                                <td className="p-3 text-center font-mono font-bold text-accent-gold">{item.u}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Pancawara Table */}
                                <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-white">
                                    <div className="bg-stone-50 p-3 text-xs font-bold uppercase tracking-widest text-stone-500 border-b text-center">Tabel Urip Pancawara (Siklus 5)</div>
                                    <table className="w-full text-left border-collapse">
                                        <tbody>
                                            {[
                                                { h: "Umanis", u: 5 }, { h: "Paing", u: 9 }, { h: "Pon", u: 7 },
                                                { h: "Wage", u: 4 }, { h: "Kliwon", u: 8 }
                                            ].map((item, idx) => (
                                                <tr key={item.h} className={`border-b border-stone-100 ${idx % 2 === 0 ? '' : 'bg-stone-50/30'}`}>
                                                    <td className="p-3 pl-6 font-bold text-primary text-sm">{item.h}</td>
                                                    <td className="p-3 text-center font-mono font-bold text-accent-gold">{item.u}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Sadwara Table */}
                                <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-white">
                                    <div className="bg-stone-50 p-3 text-xs font-bold uppercase tracking-widest text-stone-500 border-b text-center">Tabel Urip Sadwara (Siklus 6)</div>
                                    <table className="w-full text-left border-collapse">
                                        <tbody>
                                            {[
                                                { h: "Tungleh", u: 7 }, { h: "Aryang", u: 8 }, { h: "Urukung", u: 5 },
                                                { h: "Paniron", u: 4 }, { h: "Was", u: 9 }, { h: "Maulu", u: 6 }
                                            ].map((item, idx) => (
                                                <tr key={item.h} className={`border-b border-stone-100 ${idx % 2 === 0 ? '' : 'bg-stone-50/30'}`}>
                                                    <td className="p-3 pl-6 font-bold text-primary text-sm">{item.h}</td>
                                                    <td className="p-3 text-center font-mono font-bold text-accent-gold">{item.u}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modulo 5 Classification Plate */}
                        <div className="mt-12">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="material-icons-outlined text-stone-400">format_list_numbered</span>
                                Klasifikasi Panca Sudha (Modulo 5)
                            </h3>
                            <p className="text-sm mb-6">Metode Panca Sudha digunakan untuk menentukan kategori dasar keharmonisan pasangan berdasarkan sisa pembagian 5 dari total Neptu:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {[
                                    { sisa: 1, nama: "Sri", warna: "bg-emerald-50", text: "text-emerald-700", makna: "Sejahtera" },
                                    { sisa: 2, nama: "Dana", warna: "bg-green-50", text: "text-green-700", makna: "Kaya" },
                                    { sisa: 3, nama: "Laba", warna: "bg-blue-50", text: "text-blue-700", makna: "Berhasil" },
                                    { sisa: 4, nama: "Sakti", warna: "bg-orange-50", text: "text-orange-700", makna: "Ada Halangan" },
                                    { sisa: 0, nama: "Tiwas", warna: "bg-red-50", text: "text-red-700", makna: "Kekurangan" },
                                ].map((cat) => (
                                    <div key={cat.nama} className={`${cat.warna} p-4 rounded-2xl border border-stone-100 text-center`}>
                                        <div className={`text-xs font-bold ${cat.text} uppercase mb-1`}>{cat.nama}</div>
                                        <div className="text-[10px] text-stone-500 uppercase tracking-tighter">Sisa {cat.sisa}</div>
                                        <div className="text-[10px] font-bold text-stone-400 mt-1">{cat.makna}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl mt-8">
                            <h4 className="font-bold text-primary mb-2 flex items-center gap-2 text-sm">
                                <span className="material-icons-outlined text-xs">stars</span> Penyesuaian Wuku (Siklus 30)
                            </h4>
                            <p className="text-xs leading-relaxed text-stone-600">
                                Selain Neptu, sistem kami juga mempertimbangkan kecocokan antar <span className="font-bold text-primary">Wuku</span> (30 siklus mingguan). Jika kedua individu memiliki Wuku yang saling mendukung (seperti Sinta dengan Wariga), sistem akan memberikan <span className="italic font-medium text-emerald-600">Skor Bonus Harmoni</span> sebesar 10% pada hasil akhir Heart Meter.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Sodasa Rsi - 16 Gerbang Pertemuan */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">II</span>
                            Sodasa Rsi: 16 Gerbang Dinamika Spiritual
                        </h2>
                        <p>
                            Sodasa Rsi atau <span className="italic">Tri Pramana</span> adalah metode yang paling mendalam. Metode ini melibatkan variabel <span className="font-bold text-primary">Sadwara</span> (siklus 6 hari) untuk melihat sisi spiritualitas dan konflik internal pasangan. Berikut adalah jabaran lengkap 16 kriteria sisa berdasarkan Lontar Wariga:
                        </p>

                        <div className="bg-primary/5 p-8 rounded-3xl my-8 border border-primary/10">
                            <BlockMath math={"Sisa = (Urip\\ Saptawara + Pancawara + Sadwara\\ Pasangan) \\pmod {16}"} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {[
                                { sisa: 1, nama: "Bergejolak", makna: "Penuh dengan dinamika ujian yang mengasah kedewasaan." },
                                { sisa: 2, nama: "Banyak Pengeluaran", makna: "Tantangan pada manajemen materi dan kestabilan emosi." },
                                { sisa: 3, nama: "Selalu Bertentangan", makna: "Ujian kesabaran melalui perbedaan pandangan yang tajam." },
                                { sisa: 4, nama: "Dominasi Istri", makna: "Pola kepemimpinan rumah tangga yang berpusat pada istri." },
                                { sisa: 5, nama: "Harmonis", makna: "Tingkat kesepahaman tinggi dan rejeki yang mengalir sehat." },
                                { sisa: 6, nama: "Menderita", makna: "Memerlukan keteguhan spiritual ekstra untuk menghadapi cobaan." },
                                { sisa: 7, nama: "Lambat Berkembang", makna: "Kesuksesan datang bertahap melalui ketekunan luar biasa." },
                                { sisa: 8, nama: "Kekurangan", makna: "Banyak momen ujian duka, memerlukan saling menguatkan." },
                                { sisa: 9, nama: "Kaya tapi Ricuh", makna: "Anugerah rezeki besar namun dibarengi dinamika konflik." },
                                { sisa: 10, nama: "Berwibawa", makna: "Pasangan yang disegani lingkungan sosialnya." },
                                { sisa: 11, nama: "Selalu Puas", makna: "Kehidupan penuh rasa syukur dan keharmonisan keluarga." },
                                { sisa: 12, nama: "Rezeki Lancar", makna: "Kesetiaan dan cinta yang dibarengi kemudahan mencari nafkah." },
                                { sisa: 13, nama: "Langgeng", makna: "Kekayaan dan sukacita yang bertahan lama." },
                                { sisa: 14, nama: "Sering Berselisih", makna: "Kerawanan pada energi ekonomi dan perdebatan energi." },
                                { sisa: 15, nama: "Tidak Rukun", makna: "Kesulitan dalam menyatukan visi besar keputusan hidup." },
                                { sisa: 0, nama: "Semakin Sukses", makna: "Puncak kebahagiaan melalui keberhasilan anak-anak." },
                            ].map((item) => (
                                <div key={item.sisa} className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-accent-gold/40 transition-colors shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-stone-500">{item.sisa === 0 ? 16 : item.sisa}</span>
                                        <h4 className="font-bold text-primary">{item.nama}</h4>
                                    </div>
                                    <p className="text-xs text-stone-600 italic leading-relaxed">{item.makna}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Siklus 5 Tahunan - Dinamika yang Berproses */}
                    <section className="mt-20">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">III</span>
                            Siklus 5 Tahunan: Memahami Bahwa Hubungan Ber-Evolusi
                        </h2>
                        <blockquote className="bg-stone-50 p-8 rounded-3xl border-l-4 border-stone-300 text-stone-600 italic">
                            "Hubungan perkawinan seperti lautan; ada pasang dan ada surut. Tradisi Bali memetakan pasang surut ini setiap 5 tahun melalui metode pengurangan bertahap (Recursive Reduction)."
                        </blockquote>
                        <p className="mt-8">
                            Mengapa sistem kami memberikan prediksi yang berubah setiap 5 tahun? Karena energi rumah tangga tidak bersifat statis. Metode <span className="font-bold text-primary">Recursive Reduction</span> mencerminkan bagaimana pengalaman masa lalu (hasil bagi sebelumnya) mempengaruhi masa depan (nilai urip baru).
                        </p>

                        <div className="bg-primary/5 p-8 rounded-3xl my-8 border border-primary/10 overflow-x-auto">
                            <p className="text-xs font-bold text-primary uppercase text-center mb-6 font-sans">Algoritma Evolusi Dinamis</p>
                            <div className="flex flex-col gap-4 text-center">
                                <BlockMath math={"Total\\ Urip_{Baru} = Total\\ Urip_{Lama} - \\lfloor Total\\ Urip_{Lama} / 5 \\rfloor"} />
                                <BlockMath math={"Prediksi = Total\\ Urip_{Baru} \\pmod 5"} />
                            </div>
                        </div>
                        <p className="text-sm">
                            Hadirnya fase <span className="font-bold text-red-600">Pati</span> (Ujian) atau <span className="font-bold text-orange-600">Pete</span> (Cekcok) dalam siklus bukanlah sebuah vonis kegagalan, melainkan penanda waktu untuk melakukan introspeksi, perbanyak ibadah, atau ritual <span className="italic">Pebanyuhan Jodoh</span> guna menetralisir energi negatif.
                        </p>

                        <div className="mt-10 p-6 bg-white border border-stone-200 rounded-3xl shadow-sm">
                            <h4 className="font-bold text-primary mb-6 text-sm flex items-center gap-2 border-b border-stone-100 pb-4">
                                <span className="material-icons-outlined text-xs">calculate</span>
                                Simulasi Kasus Nyata
                            </h4>

                            <div className="bg-stone-50 rounded-xl p-5 mb-8 text-sm font-mono space-y-2 text-stone-600">
                                <p><span className="font-bold">Suami:</span> Minggu Wage (5 + 4) = 9</p>
                                <p><span className="font-bold">Istri:</span> Senin Kliwon (4 + 8) = 12</p>
                                <p className="border-t border-stone-300 pt-2 mt-2"><span className="font-bold text-primary">Total Urip Awal = 21</span></p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-primary/5 text-primary text-xs uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="p-3 rounded-l-lg">Umur Pernikahan</th>
                                            <th className="p-3">Proses</th>
                                            <th className="p-3">Hitungan</th>
                                            <th className="p-3 text-center">Sisa</th>
                                            <th className="p-3">Posisi</th>
                                            <th className="p-3 rounded-r-lg">Artinya</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 font-medium text-stone-600">
                                        {[
                                            { range: "0 - 5 tahun", process: "-", calc: "21 : 5 = 4", sisa: 1, pos: "Sri", arti: "Selalu Sejahtera", color: "text-emerald-600" },
                                            { range: "5 - 10 tahun", process: "21 - 4 = 17", calc: "17 : 5 = 3", sisa: 2, pos: "Gedong", arti: "Berkecukupan", color: "text-emerald-600" },
                                            { range: "10 - 15 tahun", process: "17 - 3 = 14", calc: "14 : 5 = 2", sisa: 4, pos: "Pati", arti: "Banyak Masalah", color: "text-red-600" },
                                            { range: "15 - 20 tahun", process: "14 - 2 = 12", calc: "12 : 5 = 2", sisa: 2, pos: "Gedong", arti: "Berkecukupan", color: "text-emerald-600" },
                                            { range: "20 - 25 tahun", process: "12 - 2 = 10", calc: "10 : 5 = 2", sisa: 0, pos: "Sama", arti: "Berkecukupan", color: "text-blue-600" },
                                            { range: "25 - 30 tahun", process: "10 - 2 = 8", calc: "8 : 5 = 1", sisa: 3, pos: "Pete", arti: "Sering Berselisih", color: "text-orange-600" },
                                            { range: "30 - 35 tahun", process: "8 - 1 = 7", calc: "7 : 5 = 1", sisa: 2, pos: "Gedong", arti: "Berkecukupan", color: "text-emerald-600" },
                                            { range: "35 - 40 tahun", process: "7 - 1 = 6", calc: "6 : 5 = 1", sisa: 1, pos: "Sri", arti: "Selalu Sejahtera", color: "text-emerald-600" },
                                            { range: "40 - 45 tahun", process: "6 - 1 = 5", calc: "5 : 5 = 1", sisa: 0, pos: "Sama", arti: "Selalu Sejahtera", color: "text-blue-600" },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="hover:bg-stone-50 transition-colors">
                                                <td className="p-3 text-stone-800">{row.range}</td>
                                                <td className="p-3 font-mono text-xs text-stone-500">{row.process}</td>
                                                <td className="p-3 font-mono text-xs font-bold">{row.calc}</td>
                                                <td className="p-3 text-center">{row.sisa}</td>
                                                <td className={`p-3 font-bold uppercase text-xs ${row.color}`}>{row.pos}</td>
                                                <td className={`p-3 ${row.color}`}>{row.arti}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-xs text-stone-400 italic text-center">
                                *Dst (Dan seterusnya mengikuti pola perhitungan yang sama)
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Otonan - Siklus Kelahiran Pawukon */}
                    <section className="mt-20">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">IV</span>
                            Otonan: Penjadwalan Siklus Ruwat Diri
                        </h2>
                        <p>
                            Berbeda dengan ulang tahun kalender Masehi yang berbasis revolusi bumi terhadap matahari (365 hari), <span className="font-bold text-primary">Otonan</span> berbasis pada siklus <span className="font-bold text-primary">Pawukon</span> yang berulang setiap <span className="font-bold text-primary">210 hari</span> sekali. Ini adalah titik temu kembalinya energi kelahiran seseorang.
                        </p>

                        <div className="bg-primary/5 p-8 rounded-3xl my-8 border border-primary/10 overflow-x-auto text-center">
                            <p className="text-xs font-bold text-primary uppercase mb-6 font-sans">Persamaan Prediksi Otonan</p>
                            <BlockMath math={"Otonan_{N} = Tgl\\ Lahir + (\\lfloor \\frac{Hari\\ Berlalu}{210} \\rfloor + 1) \\times 210"} />
                            <p className="text-xs text-stone-500 mt-4 italic">Sistem memproyeksikan periode ke-N untuk menemukan tanggal terdekat di masa depan.</p>
                        </div>
                    </section>

                    {/* Section 5: Lintang - Navigasi Bintang Bali */}
                    <section className="mt-20">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">V</span>
                            Lintang: Navigasi Bintang dalam Karakter
                        </h2>
                        <p>
                            Dalam Wariga, setiap orang lahir di bawah naungan <span className="font-bold text-primary">Lintang</span> (Bintang) tertentu yang ditentukan oleh pertemuan antara <span className="font-bold text-primary">Saptawara</span> dan <span className="font-bold text-primary">Pancawara</span>. Lintang ini memberikan rincian karakter yang lebih spesifik daripada zodiak barat.
                        </p>

                        <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm my-8">
                            <h4 className="font-bold text-primary mb-4 text-sm flex items-center gap-2">
                                <span className="material-icons-outlined text-xs">auto_awesome</span>
                                Logika Pencocokan Lintang
                            </h4>
                            <div className="space-y-4 text-sm text-stone-600">
                                <p>Sistem memproses "Matrix Pertemuan" (7x5) untuk menemukan 1 dari 35 Lintang unik. Contohnya:</p>
                                <ul className="list-disc list-inside space-y-2 italic">
                                    <li>Redite + Umanis &rarr; <span className="font-bold text-primary text-normal">Lintang Gajah</span> (Pemaaf & Jujur)</li>
                                    <li>Saniscara + Paing &rarr; <span className="font-bold text-primary text-normal">Lintang Ayam</span> (Berani & Vokal)</li>
                                    <li>Buda + Kliwon &rarr; <span className="font-bold text-primary text-normal">Lintang Tiwa-tiwa</span> (Spiritualis)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Zodiak - Sinkronisasi Horoskop Barat */}
                    <section className="mt-20">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">VI</span>
                            Zodiak: Sinkronisasi Horoskop Barat
                        </h2>
                        <p>
                            Sebagai pelengkap wawasan, sistem kami juga menyertakan perhitungan <span className="font-bold text-primary">Zodiak</span> berbasis kalender Gregorian. Ini membantu pengguna melihat irisan antara karakter tradisional Bali dengan kepribadian berdasarkan perlintasan matahari secara universal.
                        </p>

                        <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 my-8">
                            <p className="text-sm italic leading-relaxed">
                                "Sistem memetakan tanggal lahir Anda ke dalam 12 rasi bintang (Aries hingga Pisces) berdasarkan standar rentang tanggal astrologi modern, untuk memberikan gambaran psikologis yang lebih komprehensif."
                            </p>
                        </div>
                    </section>

                    {/* Section 7: Heart Meter - Logika Skoring Akhir */}
                    <section className="mt-20">
                        <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">VII</span>
                            Heart Meter: Logika Skoring Akhir
                        </h2>
                        <p>
                            <span className="font-bold text-primary">Heart Meter</span> adalah representasi visual akhir dari seluruh variabel yang telah dihitung. Skor ini merupakan gabungan dari bobot kategori Panca Sudha dan variabel bonus Wuku.
                        </p>

                        <div className="bg-white border border-stone-200 rounded-3xl p-8 my-8 shadow-sm">
                            <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">Bobot Persentase Kategori</h4>
                            <div className="space-y-4">
                                {[
                                    { label: "Sri (Sejahtera)", val: "95%" },
                                    { label: "Dana (Kaya)", val: "85%" },
                                    { label: "Laba (Berhasil)", val: "75%" },
                                    { label: "Sakti (Rintangan)", val: "60%" },
                                    { label: "Tiwas (Ujian)", val: "45%" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between text-sm border-b border-stone-100 pb-2">
                                        <span className="text-stone-600">{item.label}</span>
                                        <span className="font-mono font-bold text-primary">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 italic text-xs text-emerald-800">
                                <strong>Bonus Harmoni:</strong> Jika Wuku pasangan saling mendukung secara tradisional, sistem akan menambahkan bonus 10% (maksimal 100%) sebagai faktor keberuntungan tambahan.
                            </div>
                        </div>
                    </section>

                    {/* Reference Section */}
                    <section className="mt-24 pt-12 border-t border-stone-200">
                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-icons-outlined text-stone-400">menu_book</span>
                            Sumber Literasi & Otoritas Dasar
                        </h3>
                        <p className="text-sm text-stone-500 mb-6">Seluruh algoritma dan narasi dalam sistem ini bersumber dari kajian literatur Lontar Wariga yang telah didigitalkan untuk keberlanjutan tradisi.</p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://ortibali.com/ramalan-petemon-suami-istri-dalam-tradisi-hindu-bali-menilik-kecocokan-dari-neptu-kelahiran/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-primary hover:border-accent-gold transition-colors shadow-sm"
                            >
                                <span className="material-icons-outlined text-xs">link</span>
                                Ortibali.com: Ramalan Petemon Suami Istri
                            </a>
                        </div>
                    </section>
                </article>

                {/* Closing Banner */}
                <div className="mt-24 text-center p-12 bg-primary rounded-[3rem] text-white shadow-2xl relative overflow-hidden font-sans">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/batik-fractal.png')] opacity-10 pointer-events-none" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 italic">Laku Melarapan Wariga</h2>
                    <p className="max-w-2xl mx-auto opacity-80 leading-relaxed relative z-10 text-sm">
                        Gunakanlah hasil perhitungan ini sebagai kompas spiritual, bukan sebagai pembatas takdir. Karena di atas segala perhitungan, ada ketulusan hati dan doa yang mampu merubah garis nasib.
                    </p>
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;700;900&display=swap');
                
                font-serif {
                    font-family: 'Crimson Pro', serif;
                }
                font-sans {
                    font-family: 'Inter', sans-serif;
                }
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                }
            `}</style>
        </div>
    );
}
