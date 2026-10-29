import type { SiteConfig } from "@core/web/types"
import type { Design } from "@/lib/design"
import { splitHeadline, firstSentence } from "@/lib/design"
import { Reveal, ContactForm } from "./client"

type P = { config: SiteConfig; design: Design }
const eyebrow = (n: number, label: string) => `${String(n).padStart(2, "0")} / ${label}`
const SYMBOLS = ["◎", "✦", "⌁", "⊕", "◇", "✧", "♡", "+"]

export function Nav({ config }: P) {
  const b = config.business
  const links = [["#services", "Services"], ["#about", "About"], ["#reviews", "Reviews"], ["#faq", "FAQ"]]
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a href="#top" className="brand">
          {b.logoUrl ? <img src={b.logoUrl} alt={b.name} height={36} /> : <span className="brand-mark">{b.name.trim().charAt(0)}</span>}
          <span className="brand-name">{b.name}</span>
        </a>
        <nav className="nav-links" aria-label="Primary">{links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}</nav>
        <div className="nav-cta">
          <a className="nav-phone" href={b.phoneHref}>{b.phone}</a>
          <a className="btn btn-primary btn-sm" href="#contact">Get in touch <span aria-hidden>↗</span></a>
        </div>
      </div>
    </header>
  )
}

export function Hero({ config, design }: P) {
  const b = config.business
  const { lead, accent } = splitHeadline(b.tagline)
  const sub = firstSentence(config.about?.body) || firstSentence(config.services?.[0]?.desc)
  const rating = parseFloat(b.google_rating)
  const hasRating = !isNaN(rating) && rating > 0
  return (
    <section id="top" className={`hero hero--${design.hero}`}>
      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="eyebrow">{b.city} · {b.niche.replace(/-/g, " ")}</p>
          <h1>{lead} <em>{accent}</em></h1>
          {sub && <p className="lede">{sub}</p>}
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">{b.emergency ? "Book same-day service" : "Get in touch"} <span aria-hidden>↗</span></a>
            <a className="btn btn-ghost" href={b.phoneHref}>Call {b.phone}</a>
          </div>
          {hasRating && <p className="hero-proof"><span className="stars">★★★★★</span> <strong>{b.google_rating}</strong> on Google · {b.review_count}+ reviews</p>}
        </div>
        <div className="hero-media">
          <img src="/hero-1.jpg" alt={`${b.name} — ${b.city}`} fetchPriority="high" />
          <div className="hero-chip">
            <span className="hero-chip-k">{hasRating ? "On Google" : "Based in"}</span>
            <strong>{hasRating ? `★ ${b.google_rating} · ${b.review_count}+ reviews` : `${b.city}, ${b.address.split(",").pop()?.trim() ?? ""}`}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Marquee derived ONLY from real fields — nothing invented. */
export function Ticker({ config }: P) {
  const b = config.business
  const items = [
    b.license ? `License ${b.license}` : null,
    parseFloat(b.google_rating) > 0 ? `${b.google_rating}★ on Google` : null,
    ...(config.trustBadges ?? []),
    b.since && !/day one/i.test(b.since) ? `Since ${b.since}` : null,
    ...b.serviceAreas.slice(0, 4).map(a => `Serving ${a}`),
  ].filter(Boolean) as string[]
  if (items.length < 3) return null
  const row = [...items, ...items]
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">{row.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}</div>
    </div>
  )
}

export function Services({ config, design }: P) {
  const services = config.services ?? []
  if (!services.length) return null
  const shown = services.slice(0, 6)
  const n = shown.length
  // Tall image card only when it tiles perfectly (1 tall = 2 cells + 4 others = 6 cells)
  const tall = design.skin === "noir" && design.services === "grid" && n === 5
  const cols = n % 3 === 0 || n === 5 ? 3 : 2
  return (
    <section id="services" className="sec">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">{eyebrow(1, "Services")}</p>
          <h2>What brings <em>you in?</em></h2>
          <p className="sec-sub">Start with what matters to you — we’ll help you find the right next step.</p>
        </Reveal>
        <div className={`svc svc--${design.services} svc-c${cols}`}>
          {shown.map((s, i) => (
            <Reveal key={s.title} delay={i * 60} className={`svc-card ${i === 0 && tall ? "svc-card--tall" : ""}`}>
              {i === 0 && tall && <img className="svc-img" src="/hero-2.jpg" alt="" />}
              <span className="svc-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="svc-sym" aria-hidden>{SYMBOLS[i % SYMBOLS.length]}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="#contact" className="svc-link">Ask about this <span aria-hidden>↗</span></a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}


const DEFAULT_PROCESS = [
  { title: "Tell us what you need", desc: "Call, or send a quick request — a sentence or two is plenty." },
  { title: "We make a clear plan", desc: "We talk it through with you so you know what to expect before anything starts." },
  { title: "We take care of it", desc: "Then we follow through, and you can reach us if anything comes up." },
]

export function Process({ config }: P) {
  const steps = (config.process?.length ? config.process : DEFAULT_PROCESS).slice(0, 4)
  return (
    <section id="process" className="sec sec--alt">
      <div className="wrap">
        <Reveal className="sec-head"><p className="eyebrow">{eyebrow(2, "How it works")}</p><h2>Simple from the <em>first call.</em></h2></Reveal>
        <ol className="proc">{steps.map((st, i) => (
          <Reveal as="li" key={i} delay={i * 90} className="proc-step"><span>{String(i + 1).padStart(2, "0")}</span><h3>{st.title}</h3><p>{st.desc}</p></Reveal>))}</ol>
      </div>
    </section>
  )
}

export function About({ config }: P) {
  const a = config.about
  const reasons = (config.reasons ?? []).slice(0, 3)
  if (!a && !reasons.length) return null
  return (
    <section id="about" className="band">
      <div className="wrap band-in">
        <Reveal className="band-media"><img src="/hero-3.jpg" alt="" loading="lazy" /></Reveal>
        <Reveal className="band-copy">
          <p className="eyebrow">{eyebrow(3, "Why us")}</p>
          <h2>{a?.heading ?? "Care that feels personal."}</h2>
          {a?.body && <p className="lede">{a.body}</p>}
          <ol className="steps">
            {(reasons.length ? reasons : (a?.highlights ?? []).slice(0, 3).map(h => ({ title: h.text, desc: "" }))).map((r, i) => (
              <li key={i}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{r.title}</strong>{r.desc && <p>{r.desc}</p>}</div></li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

export function Stats({ config }: P) {
  const stats = (config.stats ?? []).slice(0, 3)
  if (!stats.length) return null
  return (
    <section className="stats"><div className="wrap stats-in">
      {stats.map((s, i) => <Reveal key={i} delay={i * 80} className="stat"><strong>{s.value}{s.suffix ?? ""}</strong><span>{s.label}</span></Reveal>)}
    </div></section>
  )
}

export function Reviews({ config }: P) {
  const b = config.business
  const t = (config.testimonials ?? []).slice(0, 3)
  const rating = parseFloat(b.google_rating)
  return (
    <section id="reviews" className="sec sec--alt">
      <div className="wrap">
        <Reveal className="sec-head"><p className="eyebrow">{eyebrow(4, "Reviews")}</p><h2>What neighbours <em>say.</em></h2></Reveal>
        {t.length ? (
          <div className="rev">{t.map((r, i) => (
            <Reveal key={i} delay={i * 80} className="rev-card">
              <div className="stars">{"★".repeat(Math.max(1, Math.min(5, r.stars)))}</div>
              <p>“{r.text}”</p>
              <footer><strong>{r.name}</strong>{r.location && <span> · {r.location}</span>}</footer>
            </Reveal>))}</div>
        ) : (
          <Reveal className="rev-fallback">
            {rating > 0 && <><strong className="big">{b.google_rating}★</strong><span>from {b.review_count}+ Google reviews</span></>}
            {b.googleMapsUri && <a className="btn btn-ghost" href={b.googleMapsUri} target="_blank" rel="noopener noreferrer">Read our reviews on Google <span aria-hidden>↗</span></a>}
          </Reveal>
        )}
      </div>
    </section>
  )
}

export function FAQ({ config }: P) {
  const faq = config.faq ?? []
  if (!faq.length) return null
  return (
    <section id="faq" className="sec">
      <div className="wrap faq-grid">
        <Reveal className="sec-head"><p className="eyebrow">{eyebrow(5, "Questions")}</p><h2>Good questions. <em>Clear answers.</em></h2></Reveal>
        <div className="faq">{faq.map((f, i) => (
          <details key={i}><summary>{f.q}<span aria-hidden>+</span></summary><p>{f.a}</p></details>))}</div>
      </div>
    </section>
  )
}

export function Contact({ config }: P) {
  const b = config.business
  return (
    <section id="contact" className="sec sec--tint">
      <div className="wrap contact-grid">
        <Reveal>
          <p className="eyebrow">{eyebrow(6, "Contact")}</p>
          <h2>Let’s talk about <em>your needs.</em></h2>
          <p className="lede">Tell us a little about what you need — we’ll get back to you with a straight answer.</p>
          <ul className="contact-list">
            <li><a href={b.phoneHref}>{b.phone}</a></li>
            {b.email && <li><a href={`mailto:${b.email}`}>{b.email}</a></li>}
            <li>{b.address}</li>
            {b.hours && <li>{b.hours}</li>}
          </ul>
        </Reveal>
        <Reveal delay={100}><ContactForm options={config.formServiceOptions?.length ? config.formServiceOptions : (config.services ?? []).map(x => x.title).concat(["Something else"])} submitText="Send request" /></Reveal>
      </div>
    </section>
  )
}

export function Footer({ config }: P) {
  const b = config.business
  return (
    <footer className="foot"><div className="foot-mark" aria-hidden>{b.name}</div><div className="wrap foot-in">
      <div><strong>{b.name}</strong><p>{b.address}{b.license ? ` · License ${b.license}` : ""}</p></div>
      <div className="foot-areas">{b.serviceAreas.slice(0, 6).join(" · ")}</div>
      <div className="foot-copy">© {new Date().getFullYear()} {b.name}</div>
    </div></footer>
  )
}
