'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { wukuData, dataSodasaRsi, dataLintang, dataZodiak } from '@/lib/data';
import { getLabelRezeki } from '@/lib/pal-sri-sedana';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('jodoh');

    const tabs = [
        { id: 'jodoh', label: 'Peramalan Jodoh', icon: 'favorite' },
        { id: 'otonan', label: 'Otonan & Astro', icon: 'auto_awesome' },
        { id: 'pal-sri', label: 'Pal Sri Sedana', icon: 'trending_up' },
    ];

    return (
        <div className="bg-background-light font-sans text-stone-800 min-h-screen selection:bg-accent-gold/30">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
                {/* Journal Header Area */}
                <div className="text-center border-b border-stone-200 pb-12">
                    <p className="text-accent-gold font-bold tracking-[0.3em] uppercase text-xs mb-4">Edisi Literasi Wariga & Lontar Bali</p>
                    <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight">
                        Menilik Kedalaman <span className="italic">Tenung Jodoh</span>: <br />
                        Sains Tradisional dalam Harmoni Perkawinan
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 text-xs mt-4">
                        <span className="px-3 py-1 rounded-full text-stone-500 font-medium italic text-[15px]">Oleh: Cultural Research Team Metemu</span>
                        <span className="w-1 h-1 bg-stone-300 rounded-full hidden md:block" />
                        <span className="px-3 py-1 rounded-full text-stone-500 font-medium italic text-[15px]">Pembaharuan Terakhir: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* Sticky Tab Navigation */}
                <div className="sticky top-[80px] z-40  backdrop-blur-md border-b border-stone-200 -mx-6 px-6 mb-12 transition-all duration-300">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex overflow-x-auto no-scrollbar gap-2 py-4 justify-start md:justify-center">
                            <div className="flex p-1.5 gap-1.5 bg-stone-100/50 rounded-2xl backdrop-blur-sm">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-white text-primary shadow-md ring-1 ring-stone-200'
                                            : 'text-stone-500 hover:text-primary hover:bg-stone-50'
                                            }`}
                                    >
                                        <span className={`material-icons-outlined text-lg ${activeTab === tab.id ? 'text-accent-gold' : 'text-stone-400'}`}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Introduction Section */}
                <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-8">
                    {activeTab === 'jodoh' && (
                        <p className="text-xl font-medium text-stone-800 italic border-l-4 border-accent-gold pl-6">
                            "Perkawinan dalam tradisi Bali bukanlah sekadar pertemuan dua insan, melainkan sinkronisasi energi semesta (Tri Hita Karana) yang tertuang dalam perhitungan Wariga."
                        </p>
                    )}

                    {activeTab === 'jodoh' && (
                        <p>
                            Dalam pandangan hidup masyarakat Hindu Bali, setiap individu lahir dengan membawa "bekal" energi yang disebut <span className="font-bold text-primary">Urip</span> atau <span className="font-bold text-primary">Neptu</span>. Energi ini bukanlah angka acak, melainkan representasi dari posisi kosmik saat seseorang menghirup napas pertama di dunia. Aplikasi Jodoh Bali hadir untuk mentransparansi perhitungan sakral ini ke dalam algoritma modern tanpa mengurangi esensi spiritualnya.
                        </p>
                    )}

                    {/* Section 1: Fondasi Energi (Saptawara & Pancawara) */}
                    {activeTab === 'jodoh' && (
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
                    )}

                    {/* Section 2: Sodasa Rsi - 16 Gerbang Pertemuan */}
                    {activeTab === 'jodoh' && (
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
                                {dataSodasaRsi.map((item) => (
                                    <div key={item.sisa} className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-accent-gold/40 transition-colors shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-stone-500">{item.sisa}</span>
                                            <h4 className="font-bold text-primary">{item.label}</h4>
                                        </div>
                                        <p className="text-xs text-stone-600 italic leading-relaxed">{item.deskripsi}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Section 3: Siklus 5 Tahunan - Dinamika yang Berproses */}
                    {activeTab === 'jodoh' && (
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
                    )}

                    {/* Section 4: Otonan - Siklus Kelahiran Pawukon */}
                    {activeTab === 'otonan' && (
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
                    )}

                    {/* Section 5: Lintang - Navigasi Bintang Bali */}
                    {activeTab === 'otonan' && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">V</span>
                                Lintang: Sistem Astrologi Tradisional Bali
                            </h2>
                            <p className="mb-4">
                                Palintangan, adalah sistem astrologi tradisional yang digunakan untuk memahami karakter dan nasib seseorang berdasarkan pada pertemuan waktu tertentu. Secara harfiah, "palintangan" berasal dari bahasa Bali yang dapat diartikan sebagai <span className="font-bold text-primary">penjelmaan</span> atau <span className="font-bold text-primary">penafsiran</span>. Dalam praktiknya, palintangan menggambarkan hubungan antara hari kelahiran seseorang dengan serangkaian hari dalam kalender Bali, baik <span className="font-bold text-primary">Saptawara</span> maupun <span className="font-bold text-primary">Pancawara</span>.
                            </p>
                            <p className="mb-4">
                                Dalam Wariga, setiap orang lahir di bawah naungan <span className="font-bold text-primary">Lintang</span> (Bintang) tertentu yang ditentukan oleh pertemuan antara <span className="font-bold text-primary">Saptawara</span> and <span className="font-bold text-primary">Pancawara</span>. Lintang ini memberikan rincian karakter yang lebih spesifik daripada zodiak barat.
                            </p>

                            <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm my-8">
                                <h4 className="font-bold text-primary mb-4 text-sm flex items-center gap-2">
                                    <span className="material-icons-outlined text-xs">auto_awesome</span>
                                    Logika Pencocokan Lintang
                                </h4>
                                <p className="text-sm mb-6">Sistem memproses "Matrix Pertemuan" (7x5) untuk menemukan 1 dari 35 Lintang unik. Berikut adalah daftar lengkap kombinasi Saptawara dan Pancawara beserta Lintang yang dihasilkan:</p>

                                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mt-6 border-y border-stone-100 py-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {dataLintang.map((item, idx) => (
                                            <div key={idx} className="p-5 bg-stone-50 border border-stone-200 rounded-3xl hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest bg-stone-200/50 px-2 py-0.5 rounded-full">Label</span>
                                                        <span className="text-sm font-black text-primary uppercase">Lintang {item.lintang}</span>
                                                    </div>
                                                    <div className="pt-3 border-t border-stone-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-sm text-stone-900 font-bold">
                                                                {item.saptawara} + {item.pancawara}
                                                            </p>
                                                            <span className="text-[11px] font-bold text-accent-gold italic">"{item.label}"</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Interpretasi Tradisional</p>
                                                            <p className="text-[12px] text-stone-600 leading-relaxed italic border-l-2 border-accent-gold/30 pl-3">
                                                                {item.penjelasan}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section 6: Zodiak - Sinkronisasi Horoskop Barat */}
                    {activeTab === 'otonan' && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">VI</span>
                                Zodiak: Sinkronisasi Horoskop Barat
                            </h2>
                            <p>
                                Sebagai pelengkap wawasan, sistem kami juga menyertakan perhitungan <span className="font-bold text-primary">Zodiak</span> berbasis kalender Gregorian. Ini membantu pengguna melihat irisan antara karakter tradisional Bali dengan kepribadian berdasarkan perlintasan matahari secara universal.
                            </p>

                            <p className="text-sm mb-6 mt-6">Berikut adalah tabel lengkap 12 rasi bintang (Zodiak) beserta karakteristik dan atribut keberuntungannya:</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {dataZodiak.map((item, idx) => {
                                    const zodiacSymbols: { [key: string]: string } = {
                                        "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓", "Aries": "♈",
                                        "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌",
                                        "Virgo": "♍", "Libra": "♎", "Scorpio": "♏", "Sagitarius": "♐"
                                    };
                                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                                    const nextZodiac = dataZodiak[(idx + 1) % dataZodiak.length];
                                    const endDate = nextZodiac.startDate - 1;
                                    const endMonth = nextZodiac.startMonth;
                                    const dateRange = `${item.startDate} ${monthNames[item.startMonth - 1]} - ${endDate} ${monthNames[endMonth - 1]}`;

                                    return (
                                        <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl hover:border-primary/30 transition-colors group">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Label</span>
                                                    <span className="text-sm font-black text-primary uppercase">{item.nama} {zodiacSymbols[item.nama]}</span>
                                                </div>

                                                <div className="pt-2 border-t border-stone-200">
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter block mb-2">Deskripsi</span>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-stone-700 font-medium">
                                                                {dateRange}
                                                            </p>
                                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.elemen === 'Api' ? 'bg-red-100 text-red-700' :
                                                                item.elemen === 'Tanah' ? 'bg-yellow-100 text-yellow-700' :
                                                                    item.elemen === 'Udara' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-cyan-100 text-cyan-700'
                                                                }`}>
                                                                {item.elemen}
                                                            </span>
                                                        </div>

                                                        <p className="text-xs text-stone-500 italic leading-relaxed">
                                                            {item.sifat}
                                                        </p>

                                                        <div className="pt-2 grid grid-cols-2 gap-2 border-t border-stone-100">
                                                            <div>
                                                                <span className="text-[10px] text-stone-400 uppercase font-bold">Angka Hoki</span>
                                                                <p className="text-xs font-mono text-stone-700">{item.angkaHoki.join(", ")}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] text-stone-400 uppercase font-bold">Hari Hoki</span>
                                                                <p className="text-xs text-stone-700">{item.hariHoki}</p>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-[10px] text-stone-400 uppercase font-bold">Warna Hoki</span>
                                                                <p className="text-xs text-stone-700">{item.warnaHoki}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 my-8">
                                <p className="text-sm italic leading-relaxed">
                                    "Sistem memetakan tanggal lahir Anda ke dalam 12 rasi bintang (Aries hingga Pisces) berdasarkan standar rentang tanggal astrologi modern, untuk memberikan gambaran psikologis yang lebih komprehensif."
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Section 7: Pawukon - 30 Siklus Wuku */}
                    {activeTab === 'otonan' && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">VII</span>
                                Pawukon: 30 Siklus Wuku & Karakter
                            </h2>
                            <p className="mb-8">
                                Wuku merupakan siklus 30 mingguan dalam kalender Pawukon Bali. Setiap Wuku berada di bawah naungan Dewa tertentu yang memberikan pengaruh energi dan karakter unik pada individu yang lahir di bawahnya. Berikut adalah tabel referensi 30 Wuku beserta naungan dan sifat utamanya:
                            </p>

                            <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-white">
                                <div className="bg-stone-50 p-3 text-xs font-bold uppercase tracking-widest text-stone-500 border-b text-center">Tabel Referensi Pawukon (Siklus 30)</div>
                                <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead className="bg-stone-50/50 sticky top-0 z-10 backdrop-blur-sm">
                                            <tr className="border-b border-stone-100">
                                                <th className="p-3 pl-6 text-xs font-bold text-stone-500 uppercase">No</th>
                                                <th className="p-3 text-xs font-bold text-stone-500 uppercase">Wuku</th>
                                                <th className="p-3 text-xs font-bold text-stone-500 uppercase">Naungan Dewa</th>
                                                <th className="p-3 text-xs font-bold text-stone-500 uppercase">Sifat Utama</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {wukuData.map((wuku, idx) => (
                                                <tr key={wuku.nama_wuku} className={`border-b border-stone-100 ${idx % 2 === 0 ? '' : 'bg-stone-50/30'} hover:bg-accent-gold/5 transition-colors`}>
                                                    <td className="p-3 pl-6 font-mono text-stone-400">{wuku.id_wuku}</td>
                                                    <td className="p-3 font-bold text-primary">{wuku.nama_wuku}</td>
                                                    <td className="p-3 text-stone-600">{wuku.deskripsi.replace("Naungan ", "")}</td>
                                                    <td className="p-3 text-stone-500 italic">{wuku.sifat_umum}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Section 8: Heart Meter - Logika Skoring Akhir */}
                    {activeTab === 'jodoh' && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">VIII</span>
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
                    )}

                    {/* Section 9: Pal Sri Sedana - Siklus Nasib 6 Tahunan */}
                    {activeTab === 'pal-sri' && (
                        <section className="mt-20">
                            <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">IX</span>
                                Pal Sri Sedana: Menelusuri Nasib Lewat Urip dan Umur
                            </h2>
                            <p>
                                Konsep <span className="font-bold text-primary">Pal Sri Sedana</span> bertumpu pada penjumlahan urip saptawara dan urip pancawara dari hari lahir seseorang. Hasilnya kemudian dicocokkan dengan tabel Pal Sri Sedana, yang memberikan gambaran tentang fase-fase kehidupan seseorang dari masa kanak-kanak hingga lanjut usia.
                            </p>

                            <p className="mt-6">
                                Mengutip <span className="font-bold">Ida Bagus Rai Putra</span> dalam tulisannya di buku <span className="italic">Prabhājñana</span> yang diterbitkan Universitas Udayana, siklus kehidupan manusia diyakini memiliki pola tertentu setiap enam tahun. Dalam rentang waktu tersebut, seseorang bisa mengalami perubahan nasib—dari kekurangan hingga kemakmuran—yang semuanya bisa dianalisis lewat Pal Sri Sedana.
                            </p>

                            <div className="bg-primary/5 p-8 rounded-3xl my-8 border border-primary/10">
                                <BlockMath math={"\\text{Total Urip} = \\text{Urip Saptawara} + \\text{Urip Pancawara}"} />
                            </div>

                            {/* Tabel Pal Sri Sedana */}
                            <div className="mt-10 overflow-hidden rounded-2xl border border-stone-200 shadow-sm bg-white">
                                <div className="bg-stone-50 p-3 text-xs font-bold uppercase tracking-widest text-stone-500 border-b text-center">
                                    Tabel Pal Sri Sedana (Siklus 6 Tahunan)
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-center border-collapse text-sm min-w-[780px]">
                                        <thead className="bg-stone-50/50 sticky top-0">
                                            <tr className="border-b border-stone-200">
                                                <th className="p-2 px-3 text-xs font-bold text-stone-700 uppercase border-r border-stone-200 bg-blue-50 w-16">
                                                    Umur
                                                </th>
                                                <th colSpan={12} className="p-3 text-center text-xs font-bold text-stone-700 uppercase bg-yellow-50/50">
                                                    Jumlah Urip Pancawara dan Saptawara
                                                </th>
                                            </tr>
                                            <tr className="border-b border-stone-200 bg-yellow-50/30">
                                                <th className="p-1 px-2 text-xs text-stone-500 border-r border-stone-200"></th>
                                                {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((num) => (
                                                    <th key={num} className="p-2 text-center font-bold text-primary text-sm">
                                                        {num}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-center font-mono">
                                            {[
                                                { range: "0-6", values: [4, 4, 2, 1, 2, 0, 0, 1, 2, 0, 1, 2] },
                                                { range: "7-12", values: [1, 1, 2, 0, 4, 5, 1, 0, 0, 3, 1, 5] },
                                                { range: "13-18", values: [4, 0, 1, 4, 1, 1, 0, 1, 1, 1, 0, 1] },
                                                { range: "19-24", values: [1, 1, 0, 1, 1, 0, 5, 4, 1, 2, 5, 0] },
                                                { range: "25-30", values: [0, 0, 4, 1, 8, 4, 0, 4, 5, 0, 0, 5] },
                                                { range: "31-36", values: [2, 3, 1, 3, 1, 0, 1, 0, 2, 1, 1, 1] },
                                                { range: "37-42", values: [0, 0, 4, 0, 0, 1, 1, 1, 0, 3, 1, 4] },
                                                { range: "43-48", values: [null, 7, 0, 0, 1, 0, 5, 4, 1, 1, 5, 0] },
                                                { range: "49-54", values: [null, null, 7, 4, 2, 1, 2, 1, 2, 2, 2, 1] },
                                                { range: "55-60", values: [null, null, null, 4, 0, 4, 0, 4, 5, 1, 0, 4] },
                                                { range: "61-66", values: [null, null, null, null, 2, 4, 1, 4, 5, 2, 1, 4] },
                                                { range: "67-72", values: [null, null, null, null, null, 0, 2, 1, 1, 0, 2, 0] },
                                                { range: "73-78", values: [null, null, null, null, null, null, 5, 1, 0, 1, 5, 0] },
                                                { range: "79-84", values: [null, null, null, null, null, null, null, 0, 4, 1, 5, 2] },
                                                { range: "85-90", values: [null, null, null, null, null, null, null, null, 4, 0, 1, 1] },
                                                { range: "91-96", values: [null, null, null, null, null, null, null, null, null, 2, 0, 4] },
                                                { range: "97-102", values: [null, null, null, null, null, null, null, null, null, null, 4, 0] },
                                                { range: "103-108", values: [null, null, null, null, null, null, null, null, null, null, null, 0] },
                                            ].map((row, rowIdx) => (
                                                <tr key={rowIdx} className={`border-b border-stone-100 ${rowIdx % 2 === 0 ? 'bg-blue-50/20' : 'bg-white'}`}>
                                                    <td className="p-2 px-3 font-bold text-stone-700 text-xs border-r border-stone-200 bg-blue-50/50 whitespace-nowrap">
                                                        {row.range}
                                                    </td>
                                                    {row.values.map((val, colIdx) => (
                                                        <td
                                                            key={colIdx}
                                                            className={`p-3 font-bold ${val === null ? 'bg-stone-100' :
                                                                val >= 7 ? 'text-yellow-600 bg-yellow-50' :
                                                                    val >= 4 ? 'text-blue-600 bg-blue-50' :
                                                                        val >= 2 ? 'text-orange-600 bg-orange-50' :
                                                                            val === 0 ? 'text-red-600 bg-red-50' :
                                                                                'text-stone-600'
                                                                }`}
                                                        >
                                                            {val === null ? '' : val}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Legend / Makna Angka */}
                            <div className="mt-10 p-8 bg-white border border-stone-200 rounded-3xl shadow-sm">
                                <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-icons-outlined text-xs">info</span>
                                    Tiap angka pada tabel memiliki makna tersendiri
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => {
                                        const item = getLabelRezeki(val);
                                        return (
                                            <div key={val} className="p-5 rounded-3xl border border-stone-100 bg-stone-50/30 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 group">
                                                <div className="flex items-start gap-4 mb-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 text-white shadow-lg"
                                                        style={{ backgroundColor: item.color }}
                                                    >
                                                        {val}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-primary text-[16px] leading-tight mb-1">
                                                            {item.label}
                                                        </div>
                                                        <p className="text-[13px] text-stone-500 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl mt-8">
                                <p className="text-xs leading-relaxed text-stone-600 italic">
                                    Grafik Pal Sri Sedana tersedia pada fitur <span className="font-bold text-primary">Ramalan Otonan</span>, yang secara otomatis memvisualisasikan perjalanan nasib Anda dalam bentuk chart interaktif berdasarkan tanggal lahir.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Reference Section */}
                    <section className="mt-24 pt-12 border-t border-stone-200">
                        <h3 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                            <span className="material-icons-outlined text-stone-400">menu_book</span>
                            Sumber Literasi & Otoritas Dasar
                        </h3>
                        <p className="text-sm text-stone-500 mb-6">Seluruh algoritma dan narasi dalam sistem ini bersumber dari kajian literatur Lontar Wariga yang telah didigitalkan untuk keberlanjutan tradisi.</p>

                        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-8">
                            <h4 className="font-bold text-stone-700 text-sm uppercase tracking-wide mb-4">Daftar Pustaka</h4>
                            <ul className="space-y-3 text-sm text-stone-600 font-mono">
                                <li className="pl-4 -indent-4">[1] Kusuma, Sri Rsi Ananda. <i>Wariga Dewasa.</i> Morodadi: Denpasar. 1979.</li>
                                <li className="pl-4 -indent-4">[2] Ardhana, I.B.Suparta. <i>Pokok-pokok Wariga.</i> Surabaya: Paramitha. 2009.</li>
                                <li className="pl-4 -indent-4">[3] Rini, Ayu. <i>Astrologi Hindu.</i> Denpasar: Burat Wangi. 2012.</li>
                                <li className="pl-4 -indent-4">[4] Aryana, I.B.Putra Manik. <i>Tenung Wariga-Kunci Ramalan Astrologi Bali.</i> Surabaya: Paramitha. 2010.</li>
                                <li className="pl-4 -indent-4">[5] Arwati, Ni Made Sri. <i>Ramalan Terhadap Hari Kelahiran Manusia.</i> Denpasar. 2010.</li>
                                <li className="pl-4 -indent-4">[6] Saelan, Athia. <i>Logika Fuzzy.</i> Bandung: Institut Teknologi Bandung. 2009.</li>
                            </ul>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 not-prose mt-8">
                            <a
                                href="https://ortibali.com/ramalan-petemon-suami-istri-dalam-tradisi-hindu-bali-menilik-kecocokan-dari-neptu-kelahiran/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-primary hover:border-accent-gold hover:bg-stone-50 transition-all shadow-sm group"
                            >
                                <span className="material-icons-outlined text-stone-400 group-hover:text-accent-gold transition-colors">link</span>
                                <span className="flex-1">Ortibali.com: Ramalan Petemon Suami Istri</span>
                            </a>
                            <a
                                href="https://www.sayahindu.com/2024/03/palintangan.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-primary hover:border-accent-gold hover:bg-stone-50 transition-all shadow-sm group"
                            >
                                <span className="material-icons-outlined text-stone-400 group-hover:text-accent-gold transition-colors">link</span>
                                <span className="flex-1">sayahindu.com: Palintangan, Zodiak bali</span>
                            </a>
                            <a
                                href="https://ojs.unud.ac.id/index.php/merpati/article/view/17909"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-primary hover:border-accent-gold hover:bg-stone-50 transition-all shadow-sm group"
                            >
                                <span className="material-icons-outlined text-stone-400 group-hover:text-accent-gold transition-colors">link</span>
                                <span className="flex-1">Jurnal Merpati: Aplikasi Peramalan Wariga & Fuzzy Logic</span>
                            </a>
                            <a
                                href="https://ortibali.com/mengenal-ramalan-nasib-lewat-tabel-pal-sri-sedana-warisan-kearifan-lokal-bali/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-primary hover:border-accent-gold hover:bg-stone-50 transition-all shadow-sm group"
                            >
                                <span className="material-icons-outlined text-stone-400 group-hover:text-accent-gold transition-colors">link</span>
                                <span className="flex-1">Ortibali.com: Tabel Pal Sri Sedana</span>
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
