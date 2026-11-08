"use client";

import { cloneElement, isValidElement, type ReactNode } from "react";
import PalmPreviewPanel from "./PalmPreviewPanel";
import NetraHastaDetailView from "./NetraHastaDetailView";

/** Public ROI preview; Rekha review and supporting results require verified detail access. */
export default function NetraCaptureResults({ preview }: { preview: ReactNode }) {
  const renderPreview = (authorized: boolean) => <details id="netra-preview-disclosure" className="group rounded-2xl border border-stone-200 bg-white">
    <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2">
      <span className="group-open:hidden">Lihat pratinjau telapak dan penandaan Rekha</span>
      <span className="hidden group-open:inline">Tutup pratinjau telapak</span>
    </summary>
    <div className="min-w-0 border-t border-stone-100 p-3 sm:p-4">{isValidElement<{ rekhaReviewEnabled?: boolean }>(preview) && preview.type === PalmPreviewPanel ? cloneElement(preview, { rekhaReviewEnabled: authorized }) : preview}</div>
  </details>;
  return <div id="netra-inline-detail"><NetraHastaDetailView inline renderPalmPreview={renderPreview} /></div>;
}
