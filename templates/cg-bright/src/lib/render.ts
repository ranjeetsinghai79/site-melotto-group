import type { SiteConfig } from "@core/web/types"
import { realDataCss, galleryBlock, reviewsBlock, callbarBlock } from "@core/web/blocks"
import { esc, splitTagline, firstSentences, nicheLabel, hasRating, stateOf } from "./util"

const SYMS = ["◎", "✧", "⌁", "⊕", "◇", "+"]
const DEFAULT_PROCESS = [
  { title: "Tell us what you need.", desc: "Call, or send a quick request. A sentence or two is plenty." },
  { title: "We make a clear plan.", desc: "We talk it through so you know what to expect before anything starts." },
  { title: "We take care of it.", desc: "Then we follow through, and you can reach us if anything comes up." },
]
const STEP_LABELS = ["01 / REACH OUT", "02 / WHEN WE TALK", "03 / YOUR NEXT STEP"]

const RD_THEME = { ink: "var(--ink)", muted: "var(--muted)", line: "var(--line)", surface: "var(--pale)", accent: "var(--teal)", bg: "#fff", btnBg: "var(--teal)", shim: "var(--mint)" }

export function render(c: SiteConfig): string {
  const b = c.business
  const areas = b.serviceAreas ?? []
  const t = splitTagline(b.tagline)
  const lede = firstSentences(c.about?.body, 2) || firstSentences(c.services?.[0]?.desc, 1)
  const services = (c.services ?? []).slice(0, 6)
  const badges = (c.trustBadges ?? []).slice(0, 3)
  const reasons = (c.reasons ?? []).slice(0, 3)
  const steps = (c.process?.length ? c.process : DEFAULT_PROCESS).slice(0, 3)
  const faq = c.faq ?? []
  const options = c.formServiceOptions?.length ? c.formServiceOptions : services.map(s => s.title)
  const letter = esc(b.name.trim().charAt(0).toLowerCase())
  const brand = b.logoUrl
    ? `<a class="brand" href="#home" aria-label="${esc(b.name)} home"><img src="${esc(b.logoUrl)}" alt="${esc(b.name)}" style="height:44px;width:auto"></a>`
    : `<a class="brand" href="#home" aria-label="${esc(b.name)} home"><span class="brandmark">${letter}<span>✦</span></span><span>${esc(b.name)}<small>${esc(nicheLabel(b.niche).toUpperCase().split("").join(" "))}</small></span></a>`
  const h1 = [t.a, t.b].filter(Boolean).map(esc).join("<br>") + (t.a || t.b ? "<br>" : "") + `<em>${esc(t.em)}</em>`

  return `
<header>${brand}<nav aria-label="Main navigation"><a href="#care">Our services</a><a href="#approach">Our approach</a><a href="#visit">How it works</a>${faq.length ? `<a href="#questions">FAQs</a>` : ""}</nav><a class="button small" href="#appointment">Get in touch <span>↗</span></a><button class="menu" aria-label="Open menu" aria-expanded="false">☰</button></header>
<main id="home"><section class="hero wrap"><div class="herocopy"><div class="eyebrow"><span></span> YOUR NEIGHBORHOOD ${esc(nicheLabel(b.niche).toUpperCase())} · ${esc(b.city.toUpperCase())}${stateOf(c) ? ", " + esc(stateOf(c).toUpperCase()) : ""}</div><h1>${h1}</h1>${lede ? `<p>${esc(lede)}</p>` : ""}<div class="actions"><a class="button" href="#appointment">Let’s get in touch <span>↗</span></a><a class="textlink" href="#care">Explore our services <span>↓</span></a></div><div class="herobottom"><span class="roundicon">♡</span><p>${esc(badges[0] ?? b.name)}${badges[1] || hasRating(c) ? `<small>${esc(badges[1] ?? `${b.google_rating} on Google · ${b.review_count}+ reviews`)}</small>` : ""}</p></div></div><div class="herovisual"><img src="/hero-1.jpg" alt="${esc(b.name)} — ${esc(b.city)}" fetchpriority="high"><div class="imagecap"><span>${esc(nicheLabel(b.niche).toUpperCase())} IN ${esc(b.city.toUpperCase())}</span><strong>${esc(c.about?.heading ?? b.name)}</strong><a href="#visit" aria-label="How it works">↗</a></div><span class="image-note">Illustrative image</span></div></section>
${badges.length ? `<div class="carestrip"><div class="wrap"><span>${esc(b.name)}.</span>${badges.map((x, i) => `${i ? "<b>✦</b>" : ""}<p>${esc(x)}</p>`).join("")}</div></div>` : ""}
${services.length ? `<section class="wrap section" id="care"><div class="sectionhead"><div><div class="eyebrow">A LITTLE CARE. A BIG DIFFERENCE.</div><h2>What brings you in?</h2></div><p>Start with what matters to you.<br>We’ll help you find the next step.</p></div><div class="services">${services.map((s, i) => `<a class="service${i === 5 ? " emergency" : ""}" href="#appointment" data-service="${esc(s.title)}"><span class="serviceicon">${SYMS[i % 6]}</span><span class="number">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><span class="servicefoot">Ask about this <b>↗</b></span></a>`).join("")}</div></section>` : ""}
<section class="approach" id="approach"><div class="wrap approachgrid"><div class="approachimg"><img src="/hero-3.jpg" loading="lazy" alt="${esc(b.name)}"><span>Illustrative image</span></div><div class="approachcopy"><div class="eyebrow">MORE HUMAN. LESS FORMAL.</div><h2>${esc(c.about?.heading ?? "You’re a person, not a ticket number.")}</h2>${c.about?.body ? `<p>${esc(c.about.body)}</p>` : ""}${reasons.map((r, i) => `<div class="principle"><span>0${i + 1}</span><div><h3>${esc(r.title)}</h3><p>${esc(r.desc)}</p></div></div>`).join("")}<a class="textlink" href="#appointment">Tell us what’s on your mind <span>↗</span></a></div></div></section>
<section class="wrap section" id="visit"><div class="sectionhead"><div><div class="eyebrow">NEW HERE? YOU’RE IN THE RIGHT PLACE.</div><h2>Getting started, simplified.</h2></div><a class="textlink" href="#appointment">Get in touch ↗</a></div><div class="steps">${steps.map((s, i) => `<article><span>${STEP_LABELS[i]}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></article>`).join("")}</div></section>
${realDataCss(RD_THEME)}${galleryBlock(c)}${reviewsBlock(c)}
${faq.length ? `<section class="faq wrap section" id="questions"><div><div class="eyebrow">A LITTLE REASSURANCE</div><h2>Good questions.<br>Clear answers.</h2><p>Still have something on your mind?<br>Bring it to your first conversation.</p></div><div class="faqlist">${faq.map(f => `<details><summary>${esc(f.q)}<span>+</span></summary><p>${esc(f.a)}</p></details>`).join("")}</div></section>` : ""}
<section class="booking" id="appointment"><div class="wrap bookinggrid"><div><div class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>Let’s talk about<br>what you <em>need.</em></h2><p>Tell us a little about what brings you in.<br>The first step is a conversation.</p><div class="location"><span>↗</span><div><strong>${esc(b.name)}</strong><p>${esc(b.address)}</p>${areas.length ? `<small>Serving ${esc(areas.slice(0, 4).join(", "))}.</small>` : ""}</div></div><div class="contactnote"><a href="${esc(b.phoneHref)}"><strong>${esc(b.phone)}</strong></a>${b.hours ? ` · ${esc(b.hours)}` : ""}</div></div><form id="appointment-form"><h3>Let’s plan your visit</h3><p class="formintro">A few details and we’ll be in touch.</p><div class="fields"><label>Your name<input name="name" autocomplete="name" required placeholder="First and last name" maxlength="100"></label><label>Phone number<input name="phone" autocomplete="tel" type="tel" required placeholder="(000) 000-0000" maxlength="30"></label></div><label>What can we help with?<select name="service" id="service" required><option value="">Select a reason</option>${options.map(o => `<option>${esc(o)}</option>`).join("")}<option>Something else</option></select></label><label>Anything you’d like us to know? <span>(optional)</span><textarea name="message" rows="3" placeholder="Keep it brief. Please don’t include sensitive information." maxlength="500"></textarea></label><button class="button" type="submit">Send my request <span>↗</span></button></form></div></section>
</main>${callbarBlock(c, { quoteHref: "#appointment" })}
<footer class="wrap">${brand}<p>${esc(b.tagline)}</p><span>© ${new Date().getFullYear()} ${esc(b.name)}</span></footer><div class="mobilebar"><a href="${esc(b.phoneHref)}">Call us</a><a href="#appointment">Get in touch ↗</a></div>
<dialog id="confirmation"><button class="close" aria-label="Close dialog">×</button><span class="dialogicon">✓</span><h2>That’s the first step.</h2><p>We’ve received your request and will be in touch shortly.</p><button class="button closebutton">Back to the website ↗</button></dialog>`
}
