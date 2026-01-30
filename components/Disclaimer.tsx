'use client';

export default function Disclaimer() {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mt-8">
            <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-amber-600 text-2xl mt-1">
                    info
                </span>
                <div className="flex-1 space-y-3">
                    <div>
                        <h4 className="font-bold text-stone-800 text-sm mb-1">⚠️ Akurasi</h4>
                        <p className="text-stone-600 text-xs leading-relaxed">
                            Hasil perhitungan Wariga, Palelintangan, dan Zodiak tidak dapat dijamin 100% akurat dan tidak boleh dijadikan satu-satunya dasar dalam pengambilan keputusan hidup yang krusial.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-stone-800 text-sm mb-1">📚 Sumber Data</h4>
                        <p className="text-stone-600 text-xs leading-relaxed">
                            Seluruh algoritma dan interpretasi data dalam sistem ini disusun berdasarkan referensi akademis (Jurnal Merpati No. 17909), naskah tradisional Lontar Tripramana, serta pakem Pewarigaan Bali yang diakui.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
