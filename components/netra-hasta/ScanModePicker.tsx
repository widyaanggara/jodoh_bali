import type { ScanMode } from "@/lib/netra-hasta/types";

interface ScanModePickerProps {
  mode: ScanMode;
  disabled?: boolean;
  onChange: (mode: ScanMode) => void;
}

const MODES: Array<{
  id: ScanMode;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    id: "hand",
    icon: "back_hand",
    title: "Hasta Rekha",
    description: "Landmark struktur tangan",
  },
  {
    id: "face",
    icon: "face",
    title: "Rupa Lakshana",
    description: "Mesh dan geometri wajah",
  },
];

export default function ScanModePicker({
  mode,
  disabled = false,
  onChange,
}: ScanModePickerProps) {
  return (
    <section className="rounded-[2rem] border border-[#c59b3d]/20 bg-white p-3 shadow-lg shadow-[#6f2f24]/5">
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Pilih mode pemindaian">
        {MODES.map((item) => {
          const isActive = item.id === mode;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(item.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-left transition disabled:cursor-wait disabled:opacity-60 ${
                isActive
                  ? "border-[#9f3e2f] bg-[#9f3e2f] text-white shadow-md shadow-[#9f3e2f]/15"
                  : "border-transparent bg-[#fbf6ea] text-stone-700 hover:border-[#c59b3d]/40"
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${isActive ? "text-[#f7db91]" : "text-[#9f3e2f]"}`} aria-hidden="true">
                {item.icon}
              </span>
              <span>
                <span className="block font-display text-lg font-bold">{item.title}</span>
                <span className={`block text-xs ${isActive ? "text-white/75" : "text-stone-500"}`}>
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
