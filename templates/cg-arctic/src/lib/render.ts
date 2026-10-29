import type { SiteConfig } from "@core/web/types"
import { esc, splitTagline, firstSentences, nicheLabel, hasRating, realSince, stateOf } from "./util"

const ICONS = ["❄", "▤", "♨", "▥", "◷", "≋"]
const TRUST_ICONS = ["✓", "◷", "◇", "✓"]
const DEFAULT_PROCESS = [
  { title: "Tell us what's going on.", desc: "Call, or send a quick request. A sentence or two is plenty." },
  { title: "We make a clear plan.", desc: "We talk it through with you so you know what to expect before anything starts." },
  { title: "We take care of it.", desc: "Then we follow through, and you can reach us if anything comes up." },
]

export function render(c: SiteConfig): string {
  const b = c.business
  const areas = b.serviceAreas ?? []
  const areaLine = areas.slice(0, 4).join(" · ")
  const since = realSince(c)
  const t = splitTagline(b.tagline)
  const lede = firstSentences(c.about?.body, 2) || firstSentences(c.services?.[0]?.desc, 1)
  const services = (c.services ?? []).slice(0, 6)
  const badges = (c.trustBadges ?? []).slice(0, 4)
  const steps = (c.process?.length ? c.process : DEFAULT_PROCESS).slice(0, 3)
  const checks = (c.about?.highlights?.map(h => h.text) ?? (c.reasons ?? []).map(r => r.title)).slice(0, 4)
  const faq = c.faq ?? []
  const options = c.formServiceOptions?.length ? c.formServiceOptions : services.map(s => s.title)
  const stats: Array<[string, string]> = []
  if (hasRating(c)) stats.push([`${esc(b.google_rating)}<span style="display:inline;font-size:28px">★</span>`, "Google rating"])
  if (parseInt(b.review_count) > 0) stats.push([`${esc(b.review_count)}`, "Google reviews"])
  if (areas.length) stats.push([String(areas.length), areas.length === 1 ? "area served" : "areas served"])
  if (/24 hours/i.test(b.hours ?? "")) stats.push(["24/7", "Open every day"])
  if (since) stats.push([String(new Date().getFullYear() - parseInt(since) || ""), "years in business"].filter(Boolean) as [string, string])
  const tFirst = (t.a || t.b) ? true : false
  const mark = esc(b.name.trim().charAt(0).toUpperCase())
  const logo = b.logoUrl
    ? `<img src="${esc(b.logoUrl)}" alt="${esc(b.name)}" style="height:34px;width:auto">`
    : `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="var(--navy)"/><text x="20" y="27" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="22" fill="var(--blue)">${mark}</text></svg>`

  // Real Google hours only: the pulsing "open now" dot is shown only when the listing is open 24 hours.
  const liveChip = b.hours
    ? /24 hours/i.test(b.hours)
      ? `<div class="live-chip"><i aria-hidden="true"></i>Open now · 24 hours, 7 days a week</div>`
      : `<div class="live-chip plain">Hours · ${esc(b.hours)}</div>`
    : ""
  const reviews = (c.testimonials ?? []).slice(0, 6)
  const reviewCard = (r: (typeof reviews)[number], hidden = false) =>
    `<article class="review"${hidden ? ' aria-hidden="true"' : ""}><div class="stars">${"★".repeat(Math.max(1, Math.min(5, r.stars)))}</div><blockquote>${r.text ? `“${esc(r.text)}”` : `Left a ${Math.max(1, Math.min(5, r.stars))}-star rating on Google.`}</blockquote><div class="person"><div class="avatar">${esc(r.name.charAt(0))}</div><div><strong>${esc(r.name)}</strong><small>${esc(r.location ?? b.city)}</small></div></div></article>`
  // Two rows moving in opposite directions (21st.dev "Testimonials Marquee", ported to CSS). Each half of a
  // track must be wider than the viewport or the loop shows a gap, so short rows are repeated first.
  const marqueeRow = (list: typeof reviews, reverse: boolean) => {
    const copies = Math.max(1, Math.ceil(1900 / (list.length * 380)))
    const half = Array.from({ length: copies }, () => list.map(r => reviewCard(r)).join("")).join("")
    const dup = Array.from({ length: copies }, () => list.map(r => reviewCard(r, true)).join("")).join("")
    return `<div class="mq-row${reverse ? " rev" : ""}"><div class="mq-track" style="--dur:${Math.round(copies * list.length * 11)}s">${half}${dup}</div></div>`
  }
  const marquee = reviews.length >= 3
    ? `<div class="marquee" aria-label="Customer reviews">${marqueeRow(reviews.filter((_, i) => i % 2 === 0), false)}${marqueeRow(reviews.filter((_, i) => i % 2 === 1), true)}</div>`
    : ""
  const reviewCards = reviews.length
    ? reviews.map(r => `<article class="review"><div class="stars">${"★".repeat(Math.max(1, Math.min(5, r.stars)))}</div><blockquote>${r.text ? `“${esc(r.text)}”` : `Left a ${Math.max(1, Math.min(5, r.stars))}-star rating on Google.`}</blockquote><div class="person"><div class="avatar">${esc(r.name.charAt(0))}</div><div><strong>${esc(r.name)}</strong><small>${esc(r.location ?? b.city)}</small></div></div></article>`).join("")
    : `<article class="review" style="grid-column:1/-1"><div class="stars">★★★★★</div><blockquote>${hasRating(c) ? `Rated ${esc(b.google_rating)} out of 5 by ${esc(b.review_count)} neighbours on Google.` : "Read what neighbours say about us on Google."}</blockquote>${b.googleMapsUri ? `<div class="person"><div><a class="btn outline" href="${esc(b.googleMapsUri)}" target="_blank" rel="noopener noreferrer">Read our reviews on Google</a></div></div>` : ""}</article>`

  const gallery = Array.from({ length: Math.min(b.galleryCount ?? 0, 8) }, (_, i) => `/gallery-${i + 1}.jpg`)
  const galleryHtml = gallery.length
    ? `<section id="work" class="section wrap"><div class="section-head"><div><div class="eyebrow">REAL JOBS. REAL PHOTOS.</div><h2>Recent work<br>around ${esc(b.city)}.</h2></div><p>${b.googleMapsUri ? "Photos from our Google Business listing." : "A look at our recent work."}</p></div><div class="work-grid">${gallery.map((src, i) => `<figure><img src="${src}" alt="${esc(b.name)} job photo ${i + 1}" loading="lazy"></figure>`).join("")}</div></section>`
    : ""

  return `
<div class="topbar">${esc((b.city + (areas[1] ? " & " + areas[1] : "")).toUpperCase())} · ${esc(nicheLabel(b.niche).toUpperCase())}${since ? ` · SERVING YOU SINCE ${esc(since)}` : ""}</div>
<header class="wrap site-header"><nav class="nav" aria-label="Main navigation"><a class="logo" href="#" aria-label="${esc(b.name)} home">${logo}<div>${esc(b.name)}<small>${esc(nicheLabel(b.niche).toUpperCase())}</small></div></a><div class="navlinks" id="navlinks"><a href="#services">Our services</a><a href="#about">Why us</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a></div><div class="navright"><a href="${esc(b.phoneHref)}">${esc(b.phone)}</a><a class="btn" href="#quote">${b.emergency ? "Book a service" : "Get in touch"}</a></div><button class="menu" aria-label="Open navigation" aria-expanded="false" aria-controls="navlinks">☰</button></nav></header>
<main><section class="hero wrap"><div class="hero-grid"><div class="hero-copy"><div class="eyebrow">${esc(b.city.toUpperCase())}${areas[1] ? " &amp; " + esc(areas[1].toUpperCase()) : ""}</div>${liveChip}<h1>${tFirst ? `<span>${esc(t.a || t.b)}</span>` : ""}<span>${t.a && t.b ? esc(t.b) + " " : ""}<em>${esc(t.em)}</em></span></h1>${lede ? `<p>${esc(lede)}</p>` : ""}<div class="actions"><a href="#quote" class="btn">${b.emergency ? "Request service" : "Get in touch"}</a><a href="${esc(b.phoneHref)}" class="btn outline">Call our team</a></div>${badges.length >= 2 ? `<div class="mini hero-promise">✓ &nbsp; ${esc(badges[0])} &nbsp; · &nbsp; ${esc(badges[1])}</div>` : ""}${hasRating(c) ? `<div class="rating"><span class="stars">★★★★★</span><span><strong>${esc(b.google_rating)} / 5</strong> from ${esc(b.review_count)} Google reviews</span></div>` : ""}</div><div class="hero-photo"><img src="/hero-1.jpg" alt="${esc(b.name)} — ${esc(b.city)}" fetchpriority="high"><div class="photo-note"><span class="note-icon" aria-hidden="true">✦</span><div><small>${esc((areas[0] ?? b.city).toUpperCase())}</small><strong>${esc(b.name)}</strong></div></div></div></div>${badges.length ? `<div class="trust">${badges.map((x, i) => `<div><span>${TRUST_ICONS[i % 4]}</span> ${esc(x)}</div>`).join("")}</div>` : ""}</section>
${services.length ? `<section id="services" class="section wrap"><div class="section-head"><div><div class="eyebrow">GOOD PEOPLE. GREAT SERVICE.</div><h2>Whatever you need,<br>we’ve got it covered.</h2></div><p>${esc(firstSentences(c.about?.body, 1, 160) || "Tell us what you need and we’ll help with the next step.")}</p></div><div class="services">${services.map((s, i) => `<article class="service${i === 0 ? " featured" : ""}"><span class="service-icon" aria-hidden="true">${ICONS[i % 6]}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><button data-service="${esc(s.title)}">Ask about this</button></article>`).join("")}</div>${b.emergency ? `<div class="urgent"><div><h3>Need help fast?</h3><p>Call us now${areas.length ? ` — serving ${esc(areas.slice(0, 4).join(", "))}` : ""}.</p></div><a href="${esc(b.phoneHref)}" class="btn light">Call ${esc(b.phone)}</a></div>` : ""}</section>` : ""}
<section class="process section"><div class="wrap"><div class="eyebrow">FROM “OH NO” TO ALL GOOD</div><h2>Simple from the first call.</h2><div class="steps">${steps.map((s, i) => `<article><div class="step-no">0${i + 1} / ${["REACH OUT", "PLAN", "RELAX"][i]}</div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></article>`).join("")}</div></div></section>
${galleryHtml}
<section id="about" class="section wrap"><div class="about"><div><div class="eyebrow">YOUR NEIGHBORS. YOUR ${esc(nicheLabel(b.niche).toUpperCase())} TEAM.</div><h2>${esc(c.about?.heading ?? "Big on expertise. Even bigger on care.")}</h2>${c.about?.body ? `<p>${esc(c.about.body)}</p>` : ""}${checks.length ? `<ul class="checks">${checks.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}<a class="btn outline" href="#quote">Talk to us</a></div>${stats.length ? `<div class="stats">${stats.slice(0, 4).map(([v, l], i, arr) => `<div class="stat"${arr.length % 2 === 1 && i === arr.length - 1 ? ' style="grid-column:1/-1"' : ""}><strong>${v}</strong><span>${esc(l)}</span></div>`).join("")}</div>` : ""}</div></section>
<section id="reviews" class="section reviews"><div class="wrap"><div class="section-head"><div><div class="eyebrow">GOOD WORDS FROM GOOD NEIGHBORS</div><h2>What neighbours say.</h2></div>${hasRating(c) ? `<div class="score"><strong class="score-num" data-count="${esc(b.google_rating)}" data-decimals="${(String(b.google_rating).split(".")[1] ?? "").length || 1}">${esc(Number(b.google_rating).toFixed((String(b.google_rating).split(".")[1] ?? "").length || 1))}</strong><div><div class="stars big" aria-label="${esc(b.google_rating)} out of 5 stars">★★★★★</div><p>from ${esc(b.review_count)} Google review${b.review_count === "1" ? "" : "s"}</p><div class="score-links">${b.googleMapsUri ? `<a class="score-link" href="${esc(b.googleMapsUri)}" target="_blank" rel="noopener noreferrer">Read them on Google →</a>` : ""}${b.googlePlaceId ? `<a class="score-link leave" href="https://search.google.com/local/writereview?placeid=${encodeURIComponent(b.googlePlaceId)}" target="_blank" rel="noopener noreferrer">★ Leave a review</a>` : ""}</div></div></div>` : ""}</div></div>${marquee || `<div class="wrap"><div class="reviews-grid">${reviewCards}</div></div>`}</section>
<section id="quote" class="section wrap"><div class="quote"><div><div class="eyebrow">LET’S GET STARTED</div><h2>A better day<br>starts right here.</h2><p>Tell us what you need. Our team will get back to you with next steps.</p>${badges.length ? `<ul class="checks">${badges.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}<p style="margin-bottom:5px;font-size:13px">Prefer a real conversation?</p><a class="phone" href="${esc(b.phoneHref)}">${esc(b.phone)}</a>${areas.length ? `<div class="areas"><strong>Right around the corner.</strong><br>${esc(areaLine)}</div>` : ""}</div><form id="quote-form"><h3>Request a quote</h3><div class="mini">A few details. A little less worry.</div><div class="fields"><div class="field"><label for="name">Your name</label><input id="name" name="name" placeholder="Full name" autocomplete="name" required></div><div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" placeholder="(555) 000-0000" autocomplete="tel" required minlength="7"></div></div><div class="field"><label for="service">How can we help?</label><select id="service" name="service" required><option value="">Select a service</option>${options.map(o => `<option>${esc(o)}</option>`).join("")}</select></div><div class="field"><label for="message">Tell us more <span style="color:#6c7f89">(optional)</span></label><textarea id="message" name="message" placeholder="A few details help us prepare..."></textarea></div><button type="submit" class="btn">Send my request</button><div id="form-result" role="status" hidden></div></form></div></section>
${faq.length ? `<section id="faq" class="faq wrap"><div class="faq-layout"><div><div class="eyebrow">A FEW HELPFUL ANSWERS</div><h2>Good questions.<br>Straight answers.</h2></div><div>${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div></div></section>` : ""}
</main>
<div class="callbar" role="region" aria-label="Quick contact"><a class="callbar-call" href="${esc(b.phoneHref)}"><span aria-hidden="true">✆</span> Call now</a><a class="callbar-quote" href="#quote">Get a quote</a></div>
<footer class="footer"><div class="wrap"><div class="footer-grid"><div class="footer-brand"><a class="logo" href="#">${esc(b.name)}</a><p>${esc(b.tagline)}</p></div><div><h4>SERVICES</h4>${services.slice(0, 4).map(s => `<a href="#services">${esc(s.title)}</a>`).join("")}</div><div><h4>GET IN TOUCH</h4><a href="${esc(b.phoneHref)}">${esc(b.phone)}</a>${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ""}<span>${esc(b.address)}</span>${b.license ? `<span>License ${esc(b.license)}</span>` : ""}</div>${b.hours ? `<div><h4>HOURS</h4><span>${esc(b.hours)}</span></div>` : ""}</div><div class="footer-bottom"><div>© ${new Date().getFullYear()} ${esc(b.name)}. All rights reserved.</div><div>${esc(stateOf(c))}</div></div></div></footer><div class="mobile-call"><a class="btn outline" href="${esc(b.phoneHref)}">Call our team</a><a class="btn" href="#quote">Get in touch</a></div>`
}
