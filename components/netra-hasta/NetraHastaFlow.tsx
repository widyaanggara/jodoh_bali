"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import NetraHastaClient from "./NetraHastaClient";
import NetraHastaBasicResult from "./NetraHastaBasicResult";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";
import { getWitaToday, validateBirthInput, type BirthErrors, type PalmProductSnapshot } from "@/lib/netra-hasta/product-flow";

export default function NetraHastaFlow() {
  const { state, dispatch } = useNetraHastaProduct();
  const [errors, setErrors] = useState<BirthErrors>({});
  const onPalmSummaryChange = useCallback((snapshot: PalmProductSnapshot | null) => {
    dispatch({ type: "capture", snapshot });
  }, [dispatch]);
  const reset = () => { dispatch({ type: "reset" }); setErrors({}); };

  return (
    <div className="space-y-6">
      <ol aria-label="Tahapan Netra Hasta" className="grid grid-cols-3 gap-2 text-center text-xs font-bold sm:text-sm">
        {["Data kelahiran", "Pindai telapak", "Hasil dasar"].map((label, index) => (
          <li key={label} aria-current={index === (state.result ? 2 : state.birth ? 1 : 0) ? "step" : undefined} className="rounded-2xl border border-[#c59b3d]/25 bg-white px-2 py-3 text-stone-700">
            <span className="block text-[#9f3e2f]">{index + 1}</span>{label}
          </li>
        ))}
      </ol>

      {!state.birth ? (
        <section className="mx-auto max-w-xl rounded-3xl border border-[#c59b3d]/25 bg-white p-5 shadow-lg shadow-stone-900/5 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Mulai dengan data kelahiran</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">Tanpa login. Data ini dipakai untuk menghitung kalender Bali di perangkat Anda dan tidak disimpan ke akun.</p>
          <form noValidate autoComplete="off" className="mt-6 space-y-5" onSubmit={(event) => {
            event.preventDefault();
            const validation = validateBirthInput(state.draft);
            if (!validation.valid) { setErrors(validation.errors); return; }
            setErrors({});
            dispatch({ type: "start", birth: validation.value });
          }}>
            <div>
              <label htmlFor="netra-birth-date" className="block text-sm font-bold">Tanggal lahir</label>
              <input id="netra-birth-date" type="date" required min="1900-01-01" max={getWitaToday()} value={state.draft.date}
                aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "netra-date-error" : undefined}
                onChange={(event) => { dispatch({ type: "edit", field: "date", value: event.target.value }); setErrors((old) => ({ ...old, date: undefined })); }}
                className="mt-2 block min-w-0 w-full max-w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-3 focus-visible:outline-2 focus-visible:outline-[#9f3e2f]" />
              {errors.date && <p id="netra-date-error" role="alert" className="mt-2 text-sm text-red-800">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="netra-birth-time" className="block text-sm font-bold">Jam lahir (opsional)</label>
              <input id="netra-birth-time" type="time" step="60" value={state.draft.time}
                aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? "netra-time-help netra-time-error" : "netra-time-help"}
                onChange={(event) => { dispatch({ type: "edit", field: "time", value: event.target.value }); setErrors((old) => ({ ...old, time: undefined })); }}
                className="mt-2 block min-w-0 w-full max-w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-3 focus-visible:outline-2 focus-visible:outline-[#9f3e2f]" />
              <p id="netra-time-help" className="mt-2 text-xs leading-relaxed text-stone-600">Boleh dikosongkan jika tidak tahu. Jika diisi, gunakan waktu setempat saat lahir: jam 00:00–05:59 mengikuti hari Bali sebelumnya. Tanpa jam lahir, hasil memakai tanggal yang dipilih dan penyesuaian sebelum pukul 06:00 belum dapat dipastikan.</p>
              {errors.time && <p id="netra-time-error" role="alert" className="mt-2 text-sm text-red-800">{errors.time}</p>}
            </div>
            <button type="submit" className="w-full cursor-pointer rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white hover:bg-[#7f2f24] focus-visible:outline-2 focus-visible:outline-offset-4">Lanjut Pindai Telapak</button>
          </form>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-700">Kelahiran: <strong>{state.birth.date}</strong> · {state.birth.time ? state.birth.time + " waktu setempat" : "Jam lahir tidak diketahui"}</p>
            <button type="button" onClick={reset} className="cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm font-bold">Ubah data / mulai ulang</button>
          </div>
          {state.result && <NetraHastaBasicResult result={state.result} onReset={reset} />}
          <NetraHastaClient productMode onPalmSummaryChange={onPalmSummaryChange} />
        </>
      )}
      <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-stone-600">Interpretasi kalender bersifat simbolis berdasarkan data tradisional existing, bukan asesmen ilmiah tentang kesehatan, nasib, atau karakter. Foto dan hasil sementara dibersihkan saat tab ditinggalkan atau halaman ditutup.</p>
      <p className="text-center text-xs text-stone-500"><Link href="/netra-hasta/akses-detail" className="underline underline-offset-4">Informasi akses detail dan penyimpanan akun</Link></p>
    </div>
  );
}
