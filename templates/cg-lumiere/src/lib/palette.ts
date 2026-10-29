import type { SiteConfig } from "@core/web/types"
import { pick, seedOf } from "./util"
// Same layout/CSS as the Lumière reference; only the accent tone rotates (the reference hard-codes
// its dark olive surfaces, so we vary the accent, not the base).
const ACCENTS = [
  { name: "gold",     gold: "#d7c2a0" },
  { name: "rosegold", gold: "#e0b4a4" },
  { name: "sage",     gold: "#bcd2a8" },
  { name: "pearl",    gold: "#d8d6cf" },
]
export function palette(c: SiteConfig) {
  const p = process.env.CG_PALETTE ? ACCENTS[Number(process.env.CG_PALETTE) % 4] : pick(ACCENTS, seedOf(c), "palette")
  return { name: p.name, css: { "--gold": p.gold, "--primary": p.gold, "--accent": p.gold, "--ring": p.gold } as Record<string, string> }
}
