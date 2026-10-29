import type { SiteConfig } from "@core/web/types"

/**
 * Seeded design rotation. Every business deterministically gets its own
 * combination of skin x palette x hero layout x services layout x font pair,
 * derived from its name (+ city), so two clients never get the same look but
 * a rebuild of one client never changes. No config fields needed — the
 * pipeline's config-generator output (SiteConfig) is all this reads.
 */

export type Skin = "airy" | "noir" | "soft"
export type HeroLayout = "card" | "split" | "bleed"
export type ServicesLayout = "grid" | "list"

export interface Palette {
  name: string
  bg: string
  bgAlt: string
  ink: string
  inkMuted: string
  accent: string
  accentInk: string
  band: string
  bandInk: string
  line: string
}

export interface Design {
  skin: Skin
  palette: Palette
  hero: HeroLayout
  services: ServicesLayout
  display: string
  body: string
  /** Google Fonts css2 query fragment(s) */
  fontsHref: string
  cssVars: Record<string, string>
}

const PALETTES: Record<Skin, Palette[]> = {
  airy: [
    { name: "harbor",   bg: "#ffffff", bgAlt: "#f2f6f7", ink: "#0e2236", inkMuted: "#506070", accent: "#bfe9f7", accentInk: "#0e2236", band: "#0e2236", bandInk: "#ffffff", line: "#dfe6ea" },
    { name: "pine",     bg: "#f6f5ef", bgAlt: "#eceae0", ink: "#1b3a2d", inkMuted: "#5a6a60", accent: "#e0aa7e", accentInk: "#1b2a22", band: "#1d4535", bandInk: "#f6f5ef", line: "#dcdacd" },
    { name: "graphite", bg: "#fbfaf8", bgAlt: "#f0eeea", ink: "#1f2328", inkMuted: "#5d636b", accent: "#e9825a", accentInk: "#ffffff", band: "#23282e", bandInk: "#fbfaf8", line: "#e3e0da" },
    { name: "lagoon",   bg: "#fcfdfd", bgAlt: "#eef5f4", ink: "#0f3a3f", inkMuted: "#52696b", accent: "#f2c14e", accentInk: "#1b2a2c", band: "#0f3a3f", bandInk: "#fcfdfd", line: "#d9e5e4" },
  ],
  noir: [
    { name: "gold",     bg: "#14150f", bgAlt: "#191a13", ink: "#f1ece0", inkMuted: "#a9a595", accent: "#d9bf94", accentInk: "#1a1810", band: "#1d1e15", bandInk: "#f1ece0", line: "#2c2d22" },
    { name: "rosewood", bg: "#17110f", bgAlt: "#1e1613", ink: "#f4e9e4", inkMuted: "#b5a29b", accent: "#e0b0a0", accentInk: "#1d1210", band: "#21171a", bandInk: "#f4e9e4", line: "#33252a" },
    { name: "sage",     bg: "#0f1512", bgAlt: "#141c18", ink: "#e9efe9", inkMuted: "#9aaa9f", accent: "#b9d3a8", accentInk: "#101710", band: "#16201b", bandInk: "#e9efe9", line: "#24322b" },
    { name: "midnight", bg: "#0e1119", bgAlt: "#131724", ink: "#e8eaf2", inkMuted: "#9aa0b4", accent: "#c8b6e8", accentInk: "#12101c", band: "#171b2a", bandInk: "#e8eaf2", line: "#242a3d" },
  ],
  soft: [
    { name: "mint",     bg: "#ffffff", bgAlt: "#edf3ee", ink: "#14403f", inkMuted: "#587070", accent: "#14403f", accentInk: "#ffffff", band: "#14403f", bandInk: "#ffffff", line: "#dce6df" },
    { name: "ocean",    bg: "#fbfdff", bgAlt: "#e9f1f8", ink: "#15324f", inkMuted: "#566a80", accent: "#1c4f82", accentInk: "#ffffff", band: "#15324f", bandInk: "#ffffff", line: "#d6e2ee" },
    { name: "plum",     bg: "#fffdfd", bgAlt: "#f4ecf1", ink: "#4a1f3d", inkMuted: "#76606d", accent: "#7a2e62", accentInk: "#ffffff", band: "#4a1f3d", bandInk: "#fffdfd", line: "#e8dae3" },
    { name: "clay",     bg: "#fffdfa", bgAlt: "#f6eee6", ink: "#3b2a22", inkMuted: "#7a665b", accent: "#b4532a", accentInk: "#ffffff", band: "#3b2a22", bandInk: "#fffdfa", line: "#eadfd3" },
  ],
}

const SERIFS = [
  { name: "Fraunces",           q: "Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500" },
  { name: "Newsreader",         q: "Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500" },
  { name: "Cormorant Garamond", q: "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500" },
  { name: "Playfair Display",   q: "Playfair+Display:ital,wght@0,400;0,500;1,400;1,500" },
]

const NOIR_AFFINITY = new Set(["medspa", "skin-clinic", "iv-therapy", "salon", "nail-studio", "barbershop", "luxury-realestate", "cosmetic-surgeon", "lawfirm", "financial-advisor"])
const SOFT_AFFINITY = new Set(["dentist", "daycare", "cleaning"])

export function hash(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// Independent sub-seeds so palette choice doesn't correlate with hero choice.
function pick<T>(arr: T[], seed: number, salt: string): T {
  return arr[hash(`${seed}:${salt}`) % arr.length]
}

export function pickDesign(config: SiteConfig): Design {
  const o = (process.env.STUDIO_DESIGN ?? "").split(",") // QA only: skin,paletteIdx,hero,services
  const b = config.business
  const seed = hash(`${b.name}|${b.city}`)

  // Niche affinity gets double weight; the other skins still appear so neighbours differ.
  const affinity: Skin = NOIR_AFFINITY.has(b.niche) ? "noir" : SOFT_AFFINITY.has(b.niche) ? "soft" : "airy"
  const others = (["airy", "noir", "soft"] as Skin[]).filter(s => s !== affinity)
  const skin = (o[0] as Skin) || pick<Skin>([affinity, affinity, ...others], seed, "skin")

  const palette = o[1] ? PALETTES[skin][Number(o[1]) % 4] : pick(PALETTES[skin], seed, "palette")
  const hero = (o[2] as HeroLayout) || pick<HeroLayout>(skin === "noir" ? ["bleed", "bleed", "split"] : skin === "soft" ? ["split", "split", "card"] : ["card", "bleed", "split"], seed, "hero")
  const services = (o[3] as ServicesLayout) || pick<ServicesLayout>(["grid", "grid", "list"], seed, "services")

  const serif = pick(SERIFS, seed, "serif")
  const display = skin === "airy" ? "DM Sans" : serif.name
  const body = skin === "noir" ? "Inter" : "DM Sans"
  const families = [
    skin === "airy" ? "DM+Sans:wght@400;500;600;700" : serif.q,
    skin === "airy" ? "" : body === "Inter" ? "Inter:wght@400;500;600" : "DM+Sans:wght@400;500;600;700",
  ].filter(Boolean)
  const fontsHref = `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join("&")}&display=swap`

  return {
    skin, palette, hero, services, display, body, fontsHref,
    cssVars: {
      "--bg": palette.bg, "--bg-alt": palette.bgAlt, "--ink": palette.ink, "--ink-muted": palette.inkMuted,
      "--accent": palette.accent, "--accent-ink": palette.accentInk, "--band": palette.band, "--band-ink": palette.bandInk,
      "--line": palette.line,
      "--font-display": `'${display}', ${skin === "airy" ? "system-ui, sans-serif" : "Georgia, serif"}`,
      "--font-body": `'${body}', system-ui, sans-serif`,
    },
  }
}

/** Split a headline so its last 1-2 words can be styled as the italic accent. */
export function splitHeadline(text: string): { lead: string; accent: string } {
  const clean = text.trim().replace(/[.!]+$/, "")
  const words = clean.split(/\s+/)
  if (words.length <= 2) return { lead: "", accent: clean + "." }
  const n = words.length >= 6 ? 2 : 1
  return { lead: words.slice(0, -n).join(" "), accent: words.slice(-n).join(" ") + "." }
}

export function firstSentence(text: string | undefined, max = 160): string {
  if (!text) return ""
  const m = text.match(/^.*?[.!?](\s|$)/)
  const s = (m ? m[0] : text).trim()
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s
}
