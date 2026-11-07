import NetraIcon from "./NetraIcon";

interface ConsentPanelProps {
  isRequesting: boolean;
  onConsent: () => void;
}

export default function ConsentPanel({ isRequesting, onConsent }: ConsentPanelProps) {
  return (
    <section className="netra-consent bg-white p-6 md:p-9">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#9f3e2f]/10 text-[#9f3e2f]">
          <NetraIcon name="shield" />
        </div>
        <div>
          <p className="netra-section-kicker mb-2">
            Privasi sebelum memulai
          </p>
          <h2 className="font-display text-2xl font-bold text-stone-900 md:text-3xl">
            Kamera hanya bekerja setelah persetujuan Anda
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-3 text-sm leading-relaxed text-stone-600 md:grid-cols-2">
        <div className="rounded-2xl bg-[#fbf6ea] p-4">
          <p className="font-bold text-stone-800">Pemrosesan lokal</p>
          <p className="mt-1">Frame video serta landmark tangan atau wajah diproses langsung di browser dan tidak disimpan oleh Metemu.</p>
        </div>
        <div className="rounded-2xl bg-[#fbf6ea] p-4">
          <p className="font-bold text-stone-800">Tanpa rekaman</p>
          <p className="mt-1">Audio dimatikan. Tidak ada foto atau video yang direkam, diunggah, atau dikirim ke Firebase.</p>
        </div>
      </div>

      <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
        MediaPipe menyatakan input gambar tetap di perangkat, tetapi library dapat mengirim metrik performa dan penggunaan API kepada Google. Jangan lanjutkan jika Anda tidak menyetujuinya.
      </p>

      <button
        type="button"
        onClick={onConsent}
        disabled={isRequesting}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f3e2f] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#9f3e2f]/20 transition hover:bg-[#7f2f24] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        <NetraIcon name="camera" />
        {isRequesting ? "Meminta izin kamera..." : "Saya Setuju & Aktifkan Kamera"}
      </button>
    </section>
  );
}
