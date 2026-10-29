import type { SiteConfig } from "@core/web/types"
import { pick, seedOf } from "./util"
// Same layout/CSS as the Bright Smile reference; colour tokens rotate.
const PALETTES = [
  { name: "mint",  ink: "#183d40", teal: "#175b56", mint: "#d6eece", line: "#dce5e2", muted: "#627271", pale: "#f1f6f3" },
  { name: "ocean", ink: "#15324f", teal: "#1c4f82", mint: "#d3e6f7", line: "#d9e3ee", muted: "#5d7086", pale: "#eef4fa" },
  { name: "plum",  ink: "#3e1b35", teal: "#7a2e62", mint: "#f1d6e8", line: "#e8dae3", muted: "#76606d", pale: "#f7eff4" },
  { name: "clay",  ink: "#3b2a22", teal: "#9b4a24", mint: "#f4dcc6", line: "#eadfd3", muted: "#7a665b", pale: "#f8f1ea" },
]
export function palette(c: SiteConfig) {
  const p = process.env.CG_PALETTE ? PALETTES[Number(process.env.CG_PALETTE) % 4] : pick(PALETTES, seedOf(c), "palette")
  return { name: p.name, css: { "--ink": p.ink, "--teal": p.teal, "--mint": p.mint, "--line": p.line, "--muted": p.muted, "--pale": p.pale } as Record<string, string> }
}
