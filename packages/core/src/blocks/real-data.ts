/**
 * Shared "real data" blocks for the string-rendered templates (cg-*): the single source of truth for
 * how Google-Maps DNA (photos, reviews, rating, call-to-action) is shown, plus the generic motion CSS
 * that pairs with `SiteMotion` (./motion.tsx). Rules — never relax these in a template:
 *   • only real data: no fabricated quotes; a rating-only review renders as a plain star card
 *   • photos come from /gallery-N.jpg (Business.galleryCount = how many were really uploaded)
 *   • review text is shown verbatim (long ones may be excerpted upstream, never rewritten)
 * Colors come from the host template's CSS vars via `theme` so one block fits light and dark skins.
 */
import type { SiteConfig } from "./../types"

export interface BlockTheme {
  /** CSS color expressions, e.g. "var(--ink)" — mapped per template. */
  ink: string; muted: string; line: string; surface: string; accent: string; bg: string
  /** Background of the template's primary button + the color of the shimmer that travels its edge. */
  btnBg: string; shim: string
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

export const realDataCss = (t: BlockTheme) => `<style>
.rd-sec{max-width:1200px;margin:0 auto;padding:88px 32px;color:${t.ink}}
.rd-eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${t.accent};margin-bottom:12px}
.rd-sec h2{font-size:clamp(30px,3.4vw,46px);line-height:1.15;margin:0 0 10px;font-weight:600;letter-spacing:-1px}
.rd-sub{color:${t.muted};margin:0 0 34px;max-width:620px}
.rd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.rd-grid figure{margin:0;aspect-ratio:4/5;border-radius:12px;overflow:hidden;background:${t.surface};border:1px solid ${t.line};cursor:zoom-in}
.rd-grid img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.rd-grid figure:hover img{transform:scale(1.04)}
.rd-review{padding:26px;border:1px solid ${t.line};border-radius:12px;background:${t.surface}}
.rd-stars{color:${t.accent};letter-spacing:2px;font-size:16px}
.rd-stars .st{display:inline-block}
.rd-review blockquote{margin:14px 0 20px;line-height:1.7;font-size:15px}
.rd-person{font-size:13px}.rd-person strong{display:block}.rd-person span{color:${t.muted}}
.rd-link{display:inline-block;margin-top:26px;padding:12px 20px;border:1px solid ${t.line};border-radius:8px;color:${t.ink};text-decoration:none;font-size:14px}
.rd-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.rd-score{display:flex;align-items:center;gap:18px}
.rd-score-num{font-size:72px;line-height:.9;font-weight:600;letter-spacing:-4px}
.rd-score p{margin:4px 0 0;font-size:14px;color:${t.muted}}
.rd-score-links{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:6px}
.rd-score-links a{font-size:13px;font-weight:700;color:${t.ink};text-underline-offset:4px}
.rd-score-links a.leave{padding:6px 12px;border-radius:999px;background:${t.btnBg};color:#fff;text-decoration:none}
/* two-row marquee (opposite directions, pause on hover, edge fade) */
.rd-mq{margin-top:36px;display:grid;gap:18px;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent);mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)}
.rd-mq-row{overflow:hidden}
.rd-mq-track{display:flex;width:max-content;animation:rd-slide var(--dur,40s) linear infinite}
.rd-mq-row.rev .rd-mq-track{animation-direction:reverse}
.rd-mq-row:hover .rd-mq-track{animation-play-state:paused}
.rd-mq-track .rd-review{flex:0 0 380px;margin-right:18px;display:flex;flex-direction:column;justify-content:space-between}
.rd-mq-track .rd-review blockquote{display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden}
.rd-reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:34px}
@keyframes rd-slide{to{transform:translateX(-50%)}}
/* motion (pairs with SiteMotion) */
.scroll-progress{position:fixed;inset:0 0 auto 0;height:3px;z-index:2147482000;transform-origin:0 50%;transform:scaleX(0);background:${t.accent};box-shadow:0 0 12px ${t.accent};pointer-events:none}
.motion-js h1 .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}
.motion-js .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}
.motion-js .wi{display:inline-block;will-change:transform}
.shim{position:relative;isolation:isolate;overflow:hidden;--shim-bg:${t.btnBg};--shim-c:${t.shim}}
.shim::before{content:"";position:absolute;left:50%;top:50%;width:240%;aspect-ratio:1;translate:-50% -50%;z-index:-2;background:conic-gradient(from 0deg,transparent 0 62%,var(--shim-c) 82%,transparent 100%);animation:shim-spin 3.4s linear infinite}
.shim::after{content:"";position:absolute;inset:2px;border-radius:inherit;background:var(--shim-bg);z-index:-1}
@keyframes shim-spin{to{transform:rotate(360deg)}}
.lb{position:fixed;inset:0;z-index:2147483100;display:grid;place-items:center;background:#06141ecc;backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .3s}
.lb.open{opacity:1;pointer-events:auto}
.lb img{max-width:min(92vw,720px);max-height:88vh;border-radius:12px;box-shadow:0 30px 80px #000a}
.lb button{position:absolute;border:0;background:#ffffff26;color:#fff;width:46px;height:46px;border-radius:50%;font-size:20px;cursor:pointer}
.lb .x{top:22px;right:22px}.lb .p{left:22px;top:50%}.lb .n{right:22px;top:50%}
.mo-callbar{display:none}
@media(max-width:860px){.rd-grid,.rd-reviews{grid-template-columns:repeat(2,1fr)}.rd-sec{padding:64px 20px}}
@media(max-width:740px){
  .rd-score-num{font-size:56px}
  .rd-mq-track .rd-review{flex-basis:300px}
  .mo-callbar{display:flex;gap:8px;position:fixed;left:12px;right:84px;bottom:14px;z-index:2147482500;padding:8px;border-radius:14px;background:${t.bg};border:1px solid ${t.line};box-shadow:0 12px 34px #0006;transition:transform .35s,opacity .3s}
  .mo-callbar.hide{transform:translateY(130%);opacity:0;pointer-events:none}
  .mo-callbar a{display:flex;align-items:center;justify-content:center;gap:8px;min-height:46px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;white-space:nowrap}
  .mo-call{flex:1.5;background:${t.btnBg};color:#fff}
  .mo-quote{flex:1;color:${t.ink};border:1px solid ${t.line}}
  .lb .p,.lb .n{top:auto;bottom:22px}
  body{padding-bottom:84px}
}
@media(max-width:520px){.rd-reviews{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){
  .scroll-progress{display:none}.shim::before{display:none}
  .rd-mq{-webkit-mask-image:none;mask-image:none}
  .rd-mq-track{animation:none;flex-wrap:wrap;width:auto}.rd-mq-track .rd-review[aria-hidden="true"]{display:none}.rd-mq-row{overflow:visible}
}
</style>`

export function galleryBlock(c: SiteConfig, opts: { id?: string } = {}): string {
  const b = c.business
  const n = Math.min(b.galleryCount ?? 0, 8)
  if (n <= 0) return ""
  const figs = Array.from({ length: n }, (_, i) =>
    `<figure><img src="/gallery-${i + 1}.jpg" alt="${esc(b.name)} job photo ${i + 1}" loading="lazy"></figure>`).join("")
  return `<section class="rd-sec"${opts.id ? ` id="${opts.id}"` : ""}><div class="rd-eyebrow">Real jobs. Real photos.</div><h2>Recent work around ${esc(b.city)}.</h2><p class="rd-sub">${b.googleMapsUri ? "Photos from our Google Business listing." : "A look at our recent work."}</p><div class="rd-grid">${figs}</div></section>`
}

type Review = NonNullable<SiteConfig["testimonials"]>[number]

export function reviewsBlock(c: SiteConfig, opts: { id?: string; max?: number } = {}): string {
  const b = c.business
  const list = (c.testimonials ?? []).slice(0, opts.max ?? 6)
  const rated = parseFloat(b.google_rating) > 0
  if (!list.length && !rated) return ""
  const card = (r: Review, hidden = false) => {
    const stars = Math.max(1, Math.min(5, r.stars))
    const quote = r.text ? `“${esc(r.text)}”` : `Left a ${stars}-star rating on Google.`
    return `<article class="rd-review"${hidden ? ' aria-hidden="true"' : ""}><div class="rd-stars">${"★".repeat(stars)}</div><blockquote>${quote}</blockquote><div class="rd-person"><strong>${esc(r.name)}</strong><span>${esc(r.location ?? b.city)}</span></div></article>`
  }
  const row = (rows: Review[], reverse: boolean) => {
    // each half of a track must be wider than the viewport or the loop shows a gap — repeat short rows first
    const copies = Math.max(1, Math.ceil(1900 / (rows.length * 380)))
    const half = Array.from({ length: copies }, () => rows.map(r => card(r)).join("")).join("")
    const dup = Array.from({ length: copies }, () => rows.map(r => card(r, true)).join("")).join("")
    return `<div class="rd-mq-row${reverse ? " rev" : ""}"><div class="rd-mq-track" style="--dur:${Math.round(copies * rows.length * 11)}s">${half}${dup}</div></div>`
  }
  const dec = (String(b.google_rating).split(".")[1] ?? "").length || 1
  const maps = b.googleMapsUri ? `<a href="${esc(b.googleMapsUri)}" target="_blank" rel="noopener noreferrer">Read them on Google →</a>` : ""
  const leave = b.googlePlaceId ? `<a class="leave" href="https://search.google.com/local/writereview?placeid=${encodeURIComponent(b.googlePlaceId)}" target="_blank" rel="noopener noreferrer">★ Leave a review</a>` : ""
  const score = rated
    ? `<div class="rd-score"><strong class="rd-score-num" data-count="${esc(b.google_rating)}" data-decimals="${dec}">${esc(Number(b.google_rating).toFixed(dec))}</strong><div><div class="rd-stars rd-stars-big" aria-label="${esc(b.google_rating)} out of 5 stars">★★★★★</div><p>from ${esc(b.review_count)} Google review${b.review_count === "1" ? "" : "s"}</p><div class="rd-score-links">${maps}${leave}</div></div></div>`
    : ""
  const body = list.length >= 3
    ? `<div class="rd-mq" aria-label="Customer reviews">${row(list.filter((_, i) => i % 2 === 0), false)}${row(list.filter((_, i) => i % 2 === 1), true)}</div>`
    : list.length ? `<div class="rd-reviews">${list.map(r => card(r)).join("")}</div>` : ""
  return `<section class="rd-sec"${opts.id ? ` id="${opts.id}"` : ""}><div class="rd-head"><div><div class="rd-eyebrow">Good words from good neighbours</div><h2>What neighbours say.</h2></div>${score}</div>${body}</section>`
}

/** Mobile-only sticky bar: tap-to-call + jump to the quote form. Leaves 84px on the right for the chat launcher. */
export function callbarBlock(c: SiteConfig, opts: { quoteHref: string }): string {
  const b = c.business
  if (!b.phoneHref) return ""
  return `<div class="mo-callbar" role="region" aria-label="Quick contact"><a class="mo-call" href="${esc(b.phoneHref)}"><span aria-hidden="true">✆</span> Call now</a><a class="mo-quote" href="${esc(opts.quoteHref)}">Get a quote</a></div>`
}
