"use client";

import { useEffect, useRef, useState } from "react";
import type { PalmCapture } from "@/lib/netra-hasta/palm-preprocessing";
import type { PalmLineLiveState } from "@/lib/netra-hasta/palm-line-live";
import type { RekhaClass, RekhaClassResult } from "@/lib/netra-hasta/product-flow";
import { REKHA_NAMES, REKHA_LABELS, REKHA_COLORS, confirmRekha, drawRekha, roiPoint, summarizeRekha, validateRekhaPoints, wipeRekhaMarks, type RekhaMarks } from "@/lib/netra-hasta/rekha-review";
import type { PalmLineRuntimePoint } from "@/lib/netra-hasta/palm-line-runtime";
import RekhaStatusList from "./RekhaStatusList";

export default function RekhaCaptureEditor({ capture, extraction, onReview }: {
  capture: PalmCapture; extraction: PalmLineLiveState;
  onReview: (captureId: number, classes: RekhaClassResult[]) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marksRef = useRef<RekhaMarks>({});
  const draftRef = useRef<PalmLineRuntimePoint[]>([]);
  const [marks, setMarks] = useState<RekhaMarks>({});
  const [active, setActive] = useState<RekhaClass>("heart");
  const [candidateId, setCandidateId] = useState("");
  const [draft, setDraft] = useState<PalmLineRuntimePoint[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [showCandidates, setShowCandidates] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [xy, setXy] = useState({ x: "", y: "" });
  const { width, height } = capture.original;
  const candidates = extraction.phase === "ready" && extraction.result.captureId === capture.capturedAt && extraction.result.baseline.status === "detected" ? extraction.result.baseline.candidates : [];
  const selected = candidates.find((c) => c.id === candidateId);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = width; canvas.height = height;
    const pixels = new Uint8ClampedArray(capture.original.data);
    context.putImageData(new ImageData(pixels, width, height), 0, 0);
    pixels.fill(0);
    return () => { context.clearRect(0, 0, canvas.width, canvas.height); canvas.width = 0; canvas.height = 0; wipeRekhaMarks(marksRef.current); draftRef.current.forEach((p) => { p.x = 0; p.y = 0; }); draftRef.current.length = 0; };
  }, [capture, width, height]);

  function changeDraft(points: PalmLineRuntimePoint[]) {
    draftRef.current = points; setDraft(points);
  }
  function commit(next: RekhaMarks) {
    marksRef.current = next; setMarks(next); changeDraft([]); setDrawing(false); setError("");
    setMessage(REKHA_LABELS[active] + ": status pengguna diperbarui. Penandaan hanya berlaku pada sesi ini.");
    onReview(capture.capturedAt, summarizeRekha(next));
  }
  function addPoint(point: PalmLineRuntimePoint | null) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.y < 0 || point.x > width - 1 || point.y > height - 1) { setError("Titik harus berada di dalam ROI."); return; }
    if (draft.length >= 512) { setError("Maksimal 512 titik. Hapus titik terakhir atau mulai ulang."); return; }
    changeDraft([...draft, { ...point }]); setDrawing(true); setError("");
  }
  function chooseClass(name: RekhaClass) { setActive(name); changeDraft([]); setDrawing(false); setMessage(""); setError(""); }

  return <section className="netra-rekha-editor" aria-labelledby="rekha-editor-heading">
    <header><span className="netra-beta">Eksperimental / penilaian pengguna</span><h3 id="rekha-editor-heading" className="mt-3 font-display text-2xl">Tinjau empat Rekha pada telapak Anda</h3>
      <p>Detektor hanya menemukan segmen lipatan tanpa label. Pilih kandidat yang sesuai lalu konfirmasi labelnya, atau tandai sendiri garis yang benar-benar terlihat. Tidak ada garis awal yang dibuat otomatis.</p>
      <p>Identitas Heart, Head, Life, dan Fate tetap merupakan penilaian Anda, bukan hasil model atau tafsir budaya. Jika ragu, pilih “Belum dapat dipastikan”.</p>
    </header>
    <div className="netra-rekha-workbench">
      <div className="min-w-0">
        <div className="netra-rekha-photo" style={{ aspectRatio: width + " / " + height }}>
          <canvas ref={canvasRef} aria-label="ROI asli, orientasi capture tanpa pembalikan tambahan" />
          <svg className={drawing ? "is-drawing" : ""} viewBox={"0 0 " + width + " " + height} aria-label={"Overlay " + width + " kali " + height + " piksel. Gunakan tombol dan input koordinat untuk menandai dengan keyboard."} role="img"
            onPointerDown={(event) => { if (!drawing || event.button !== 0 || !event.isPrimary) return; addPoint(roiPoint(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect(), width, height)); }}>
            {showCandidates && candidates.map((c) => <polyline key={c.id} points={c.points.map((p) => p.x + "," + p.y).join(" ")} fill="none" stroke={c.id === candidateId ? "#facc15" : "#22d3ee"} strokeWidth={c.id === candidateId ? 3.5 : 1.5} vectorEffect="non-scaling-stroke" opacity={c.id === candidateId ? 1 : 0.65} />)}
            {REKHA_NAMES.map((name) => marks[name]?.points.length ? <polyline key={name} points={marks[name]!.points.map((p) => p.x + "," + p.y).join(" ")} fill="none" stroke={REKHA_COLORS[name]} strokeWidth="3" strokeDasharray={marks[name]?.status === "user_drawn" ? "7 4" : undefined} vectorEffect="non-scaling-stroke" /> : null)}
            <polyline points={draft.map((p) => p.x + "," + p.y).join(" ")} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
            {draft.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={Math.max(width, height) / 100} fill="white" stroke="#292522" />)}
          </svg>
        </div>
        <p className="mt-2 text-xs text-stone-600">ROI asli {width} × {height} px. Cyan: kandidat otomatis; kuning: pilihan; warna kelas: konfirmasi (utuh) atau gambar pengguna (putus-putus).</p>
        <ul className="netra-rekha-legend" aria-label="Warna kelas">{REKHA_NAMES.map((name) => <li key={name}><span style={{ background: REKHA_COLORS[name] }} />{REKHA_LABELS[name]}</li>)}</ul>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={showCandidates} onChange={(e) => setShowCandidates(e.target.checked)} />Tampilkan kandidat otomatis</label>
      </div>
      <div className="netra-rekha-controls">
        <label htmlFor="rekha-class">Rekha yang ditinjau</label>
        <select id="rekha-class" value={active} onChange={(e) => chooseClass(e.target.value as RekhaClass)}>{REKHA_NAMES.map((name) => <option key={name} value={name}>{REKHA_LABELS[name]}</option>)}</select>
        <label htmlFor="rekha-candidate">Segmen kandidat otomatis</label>
        <select id="rekha-candidate" value={selected ? candidateId : ""} onChange={(e) => { setCandidateId(e.target.value); changeDraft([]); setDrawing(false); setError(""); }}>
          <option value="">Pilih segmen pada foto</option>{candidates.map((c, i) => <option key={c.id} value={c.id}>Segmen {i + 1} · {c.lengthPixels.toFixed(0)} px</option>)}
        </select>
        <button type="button" disabled={!selected} onClick={() => {
          try {
            if (Object.values(marks).some((mark) => mark.name !== active && mark.candidateId === candidateId)) throw new Error("Segmen ini sudah dipakai kelas lain. Hapus label sebelumnya atau pilih segmen berbeda.");
            commit({ ...marks, [active]: confirmRekha(active, candidateId, candidates, width, height) });
          } catch (failure) { setError((failure as Error).message); }
        }}>Konfirmasi segmen sebagai {REKHA_LABELS[active]}</button>
        {!candidates.length && <p role="status" className="text-xs text-stone-600">{extraction.phase === "processing" ? "Menunggu kandidat. Penandaan manual tetap tersedia." : "Tidak ada kandidat yang dapat dipilih. Anda dapat menandai garis yang terlihat atau menyatakan belum pasti."}</p>}
        <div className="netra-rekha-drawing">
          <button type="button" aria-pressed={drawing} onClick={() => { changeDraft([]); setDrawing(!drawing); setError(""); }}> {drawing ? "Batalkan penandaan" : "Tandai garis sendiri"}</button>
          {drawing && <>
            <p id="rekha-draw-help" className="text-xs">Ketuk titik berurutan pada foto mengikuti lipatan yang terlihat. Titik tidak dihubungkan ke garis buatan atau diperpanjang otomatis.</p>
            <div className="grid grid-cols-2 gap-2">{(["x", "y"] as const).map((axis) => <div key={axis}><label htmlFor={"rekha-" + axis}>Koordinat {axis.toUpperCase()} (px)</label><input id={"rekha-" + axis} type="number" min="0" max={axis === "x" ? width - 1 : height - 1} step="any" value={xy[axis]} onChange={(e) => setXy((old) => ({ ...old, [axis]: e.target.value }))} aria-describedby="rekha-draw-help" /></div>)}</div>
            <button type="button" onClick={() => { if (!xy.x.trim() || !xy.y.trim()) { setError("Isi koordinat X dan Y."); return; } addPoint({ x: Number(xy.x), y: Number(xy.y) }); }}>Tambah titik dari koordinat</button>
            <div className="flex flex-wrap gap-2"><button type="button" disabled={!draft.length} onClick={() => changeDraft(draft.slice(0, -1))}>Hapus titik terakhir</button><span role="status" className="self-center text-xs">{draft.length} titik</span></div>
            <button type="button" disabled={!validateRekhaPoints(draft, width, height)} onClick={() => { try { commit({ ...marks, [active]: drawRekha(active, draft, width, height) }); } catch (failure) { setError((failure as Error).message); } }}>Gunakan penandaan {REKHA_LABELS[active]}</button>
          </>}
        </div>
        <button type="button" onClick={() => commit({ ...marks, [active]: { name: active, status: "uncertain", points: [] } })}>Belum dapat dipastikan</button>
        <button type="button" disabled={!marks[active]} onClick={() => { const next = { ...marks }; delete next[active]; commit(next); }}>Hapus label {REKHA_LABELS[active]}</button>
        {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
        <p role="status" aria-live="polite" className="text-xs text-stone-600">{message}</p>
      </div>
    </div>
    <RekhaStatusList classes={summarizeRekha(marks)} />
    <p className="mt-4 text-xs text-stone-600">Foto dan koordinat hanya ada selama pratinjau ini. Ke Ramalan Detail hanya diteruskan status dan asal penandaan. Penandaan tidak disimpan ke riwayat; ambil ulang, reset, atau meninggalkan tab akan menghapusnya.</p>
  </section>;
}
