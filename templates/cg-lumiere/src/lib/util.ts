import type { SiteConfig } from "@core/web/types"

export const esc = (s: unknown): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

export function hash(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}
export const pick = <T,>(arr: T[], seed: number, salt: string): T => arr[hash(`${seed}:${salt}`) % arr.length]
export const seedOf = (c: SiteConfig) => hash(`${c.business.name}|${c.business.city}`)

/** "Come home to comfortable." -> two display lines with the payoff words isolated for <em>. */
export function splitTagline(t: string): { a: string; b: string; em: string } {
  const clean = t.trim().replace(/\s+/g, " ")
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean)
  if (sentences.length >= 2) {
    const last = sentences.pop()!.replace(/[.!]+$/, "")
    const w = last.split(" ")
    const n = w.length > 2 ? 1 : w.length > 1 ? 1 : 0
    return { a: sentences.join(" "), b: n ? w.slice(0, -n).join(" ") : "", em: w.slice(-n || w.length).join(" ") + "." }
  }
  const w = clean.replace(/[.!]+$/, "").split(" ")
  if (w.length <= 2) return { a: "", b: "", em: clean.replace(/[.!]+$/, "") + "." }
  const cut = Math.ceil(w.length / 2)
  const emN = Math.min(2, Math.max(1, Math.floor(w.length / 4)))
  return { a: w.slice(0, cut).join(" "), b: w.slice(cut, w.length - emN).join(" "), em: w.slice(-emN).join(" ") + "." }
}

export function firstSentences(text: string | undefined, n = 1, max = 220): string {
  if (!text) return ""
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g)
  const s = (parts ? parts.slice(0, n).join("").trim() : text.trim())
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s
}

export const nicheLabel = (n: string) => n.replace(/-/g, " ")
export const hasRating = (c: SiteConfig) => parseFloat(c.business.google_rating) > 0
export const realSince = (c: SiteConfig) => (c.business.since && !/day one/i.test(c.business.since) ? c.business.since : "")
export const stateOf = (c: SiteConfig) => c.business.address.split(",").pop()?.trim() ?? ""
