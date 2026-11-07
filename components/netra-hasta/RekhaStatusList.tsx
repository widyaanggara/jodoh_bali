import type { RekhaClassResult } from "@/lib/netra-hasta/product-flow";
import { REKHA_LABELS } from "@/lib/netra-hasta/rekha-review";

export default function RekhaStatusList({ classes }: { classes: readonly RekhaClassResult[] }) {
  return <ul className="netra-rekha-status" aria-label="Status empat Rekha">{classes.map((row) => <li key={row.name}>
    <strong>{REKHA_LABELS[row.name]}</strong>
    <span>{row.status === "user_drawn" ? "Ditandai pengguna" : row.status === "user_confirmed" ? "Label dikonfirmasi pengguna" : row.status === "uncertain" ? "Belum dapat dipastikan" : row.status === "automatic_candidate" ? "Kandidat otomatis, belum tervalidasi" : "Otomatis belum didukung"}</span>
    <p>{row.reason}</p>
  </li>)}</ul>;
}
