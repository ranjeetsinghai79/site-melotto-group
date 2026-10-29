import type { SiteConfig } from "@core/web/types"
import { pick, seedOf } from "./util"

// Same layout/CSS as the ArcticFlow reference; only the colour tokens rotate.
const PALETTES = [
  { name: "harbor",   navy: "#0b2638", blue: "#bde9fa", ink: "#133245", muted: "#59707d", line: "#d9e3e8", paper: "#f3f7f8", focus: "#1684b1" },
  { name: "pine",     navy: "#17402f", blue: "#f0c79a", ink: "#1b3a2d", muted: "#5d6b62", line: "#dcddd0", paper: "#f3f1e9", focus: "#2f7a55" },
  { name: "graphite", navy: "#22272d", blue: "#f4c4a6", ink: "#1f2328", muted: "#5f666e", line: "#e1deda", paper: "#f3f1ee", focus: "#c2603a" },
  { name: "lagoon",   navy: "#0f3a3f", blue: "#f2d58b", ink: "#123c40", muted: "#566d70", line: "#d8e4e3", paper: "#eff5f4", focus: "#13808a" },
]
export function palette(c: SiteConfig) {
  const p = process.env.CG_PALETTE ? PALETTES[Number(process.env.CG_PALETTE) % 4] : pick(PALETTES, seedOf(c), "palette")
  return { name: p.name, css: { "--navy": p.navy, "--blue": p.blue, "--ink": p.ink, "--muted": p.muted, "--line": p.line, "--paper": p.paper, "--accent-focus": p.focus } as Record<string, string> }
}
