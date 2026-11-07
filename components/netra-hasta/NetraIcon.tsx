import type { CSSProperties } from "react";

const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  calendar: "M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 9h2m4 0h2m-8 3h2",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  history: "M4 5v5h5M4.5 9a8 8 0 1 1-.2 6M12 7v5l3 2",
  hand: "M8 21v-2c-3-2-4-5-6-8-1-2 1-3 2-1l3 3-1-8c0-2 2-2 2 0l1 6V3c0-2 2-2 2 0v8l1-9c0-2 2-2 2 0v9l1-7c0-2 2-2 2 0l-1 9 1-4c1-2 3-1 2 1l-1 6-3 4v1",
  camera: "M3 7h4l2-3h6l2 3h4v13H3V7Zm9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  face: "M4 8V4h4m8 0h4v4M4 16v4h4m8 0h4v-4M8 10h.01M16 10h.01M8 15c2 2 6 2 8 0",
  replay: "M4 4v6h6M5 9a8 8 0 1 1-.2 6",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  chevron: "m6 9 6 6 6-6",
  check: "m5 12 4 4L19 6",
  info: "M12 8h.01M12 11v6M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
  stop: "M4 6h12v12H4V6Zm12 4 5-3v10l-5-3M3 3l18 18",
} as const;
export type NetraIconName = keyof typeof paths;

export default function NetraIcon({ name, className = "", style }: { name: NetraIconName; className?: string; style?: CSSProperties }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={"netra-icon " + className} style={style}><path d={paths[name]} /></svg>;
}
