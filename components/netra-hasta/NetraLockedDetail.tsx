"use client";

export default function NetraLockedDetail({ busy, error, signedIn, onRetry }: {
  busy: boolean; error: string; signedIn: boolean; onRetry: () => void;
}) {
  return <div className="netra-locked-detail" aria-label="Akses hasil lengkap" aria-busy={busy}>
    <div className="netra-locked-placeholder" aria-hidden="true" inert>
      {["Rentang tahun lahir pasangan", "Top-3 Mencari Jodoh", "Analisis Rekha dan statusnya"].map(title =>
        <div key={title} className="netra-locked-placeholder-card"><p>{title}</p><span /><span /><span /></div>)}
    </div>
    <div className="netra-locked-overlay">
      <div className="netra-locked-message"><h2 className="font-display text-2xl">{busy ? "Memeriksa akses hasil lengkap" : signedIn ? "Hasil lengkap belum tersedia" : "Masuk untuk melihat hasil lengkap"}</h2>
        <p role={error ? "alert" : "status"} className="mt-3 text-sm">{error || (busy ? "Hasil akan ditampilkan setelah sesi Anda diverifikasi." : "Rentang pasangan, Top-3 Jodoh, dan analisis Rekha tersedia setelah login.")}</p>
        {!busy && (signedIn ? <button type="button" onClick={onRetry} className="netra-button-primary mt-4">Coba muat hasil lagi</button> : <a href="#netra-detail-login" className="netra-button-primary mt-4">Masuk / Daftar</a>)}
      </div>
    </div>
  </div>;
}
