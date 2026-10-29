"use client"
/**
 * SiteMotion — the shared, selector-driven animation engine for the string-rendered templates (cg-*).
 * Each template passes the selectors for its own markup; everything is optional and silently skipped
 * when a selector matches nothing. Rules (learned the hard way — see CLAUDE.md "Motion layer"):
 *   • never GSAP-animate an element that the template's own reveal system also controls (CSS opacity wins
 *     and the element stays invisible) — animate words/children instead, or take it out of the old list;
 *   • count-ups remember their real value in data-count-to (React dev double-mounts effects);
 *   • everything is off under prefers-reduced-motion and the page stays fully visible.
 */
import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export interface MotionOptions {
  hero?: { h1: string; before?: string[]; after?: string[]; stars?: string; last?: string[] }
  /** Primary calls to action: perimeter shimmer + magnetic hover. */
  cta?: string
  /** Section headings (word-mask reveal). Headings inside `skipIn` are left alone. */
  headings?: string
  counters?: string
  starsBig?: string
  rows?: string
  gallery?: string
  steps?: string
  tilt?: string
  callbar?: string
  callbarHide?: string
  form?: string
}

const all = <T extends HTMLElement = HTMLElement>(sel?: string) => (sel ? Array.from(document.querySelectorAll<T>(sel)) : [])

function splitWords(root: HTMLElement): HTMLElement[] {
  const inner: HTMLElement[] = []
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ""
      if (!text.trim()) return
      const frag = document.createDocumentFragment()
      text.split(/(\s+)/).forEach(part => {
        if (!part) return
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return }
        const w = document.createElement("span"); w.className = "w"
        const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part
        w.appendChild(wi); frag.appendChild(w); inner.push(wi)
      })
      node.parentNode!.replaceChild(frag, node)
    } else if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName !== "BR") {
      Array.from(node.childNodes).forEach(walk)
    }
  }
  Array.from(root.childNodes).forEach(walk)
  return inner
}

function splitStars(el: HTMLElement): HTMLElement[] {
  const n = (el.textContent ?? "").length
  el.textContent = ""
  return Array.from({ length: n }, () => { const s = document.createElement("span"); s.className = "st"; s.textContent = "★"; el.appendChild(s); return s })
}

export default function SiteMotion(o: MotionOptions) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = document.documentElement
    root.classList.add("motion-js")
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches
    const present = (sels?: string[]) => (sels ?? []).filter(s => document.querySelector(s))

    const ctx = gsap.context(() => {
      // scroll progress
      const bar = document.createElement("div"); bar.className = "scroll-progress"; document.body.appendChild(bar)
      gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.25 } })

      all(o.cta).forEach(b => b.classList.add("shim"))

      // hero entrance
      const h1 = o.hero ? document.querySelector<HTMLElement>(o.hero.h1) : null
      if (o.hero && h1) {
        const words = splitWords(h1)
        const starsEl = o.hero.stars ? document.querySelector<HTMLElement>(o.hero.stars) : null
        const starEls = starsEl ? splitStars(starsEl) : []
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
        present(o.hero.before).forEach((s, i) => tl.from(s, { opacity: 0, y: i ? 10 : -14, duration: 0.5 }, i ? "-=0.3" : undefined))
        tl.from(words, { yPercent: 115, duration: 0.85, stagger: 0.07 }, "-=0.25")
        present(o.hero.after).forEach(s => tl.from(s, { opacity: 0, y: 18, duration: 0.55, stagger: 0.1 }, "-=0.35"))
        if (starEls.length) tl.from(starEls, { scale: 0, rotation: -60, duration: 0.45, ease: "back.out(2.4)", stagger: 0.09 }, "-=0.4")
        present(o.hero.last).forEach(s => tl.from(s, { opacity: 0, y: 14, duration: 0.45, stagger: 0.08 }, "-=0.2"))
      }

      // headings: word-mask reveal (animates the words, never the heading box)
      all(o.headings).forEach(h => {
        if (o.hero && h.closest(o.hero.h1)) return
        const w = splitWords(h)
        gsap.from(w, { yPercent: 115, duration: 0.8, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: h, start: "top 88%", once: true } })
      })

      // count-ups
      const countUp = (el: HTMLElement, to: number, decimals: number) => {
        const node = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE) as Text | undefined
        if (!node) return
        const v = { n: 0 }
        node.textContent = (0).toFixed(decimals)
        gsap.to(v, { n: to, duration: 1.6, ease: "power2.out", onUpdate: () => { node.textContent = v.n.toFixed(decimals) }, scrollTrigger: { trigger: el, start: "top 90%", once: true } })
      }
      all(o.counters).forEach(el => {
        el.dataset.countTo ??= el.firstChild?.textContent ?? ""
        const m = el.dataset.countTo.match(/^\d+(?:\.\d+)?$/)
        if (m) countUp(el, parseFloat(m[0]), (m[0].split(".")[1] ?? "").length)
      })
      all("[data-count]").forEach(el => countUp(el, parseFloat(el.dataset.count!), parseInt(el.dataset.decimals ?? "0", 10)))
      const big = o.starsBig ? document.querySelector<HTMLElement>(o.starsBig) : null
      if (big) gsap.from(splitStars(big), { scale: 0, rotation: -60, duration: 0.5, ease: "back.out(2.4)", stagger: 0.1, scrollTrigger: { trigger: big, start: "top 90%", once: true } })

      all(o.rows).forEach((row, i) => gsap.from(row, { x: i % 2 ? 90 : -90, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 92%", once: true } }))

      all(o.gallery).forEach((f, i) => {
        const img = f.querySelector("img")
        gsap.fromTo(f, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power4.inOut", delay: (i % 3) * 0.12, scrollTrigger: { trigger: f, start: "top 90%", once: true } })
        if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.3, ease: "power3.out", delay: (i % 3) * 0.12, scrollTrigger: { trigger: f, start: "top 90%", once: true } })
      })

      if (o.steps && document.querySelector(o.steps)) {
        gsap.from(o.steps, { y: 36, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.15, scrollTrigger: { trigger: o.steps, start: "top 85%", once: true } })
      }

      if (fine) {
        all(o.tilt).forEach(card => {
          gsap.set(card, { transformPerspective: 900 })
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power2.out" })
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power2.out" })
          card.addEventListener("mousemove", e => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 12); rx(-((e.clientY - r.top) / r.height - 0.5) * 12) })
          card.addEventListener("mouseleave", () => { rx(0); ry(0) })
        })
        all(o.cta).forEach(b => {
          const x = gsap.quickTo(b, "x", { duration: 0.35, ease: "power3.out" })
          const y = gsap.quickTo(b, "y", { duration: 0.35, ease: "power3.out" })
          b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); x((e.clientX - (r.left + r.width / 2)) * 0.22); y((e.clientY - (r.top + r.height / 2)) * 0.28) })
          b.addEventListener("mouseleave", () => { x(0); y(0) })
        })
      }
    })

    // lightbox
    const figs = all(o.gallery)
    let lb: HTMLDivElement | null = null
    if (figs.length) {
      lb = document.createElement("div"); lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "Photo viewer")
      lb.innerHTML = '<img alt=""><button class="x" aria-label="Close">✕</button><button class="p" aria-label="Previous">‹</button><button class="n" aria-label="Next">›</button>'
      document.body.appendChild(lb)
      const img = lb.querySelector("img")!
      let cur = 0
      const show = (i: number) => { cur = (i + figs.length) % figs.length; const s = figs[cur].querySelector("img")!; img.src = s.src; img.alt = s.alt }
      const close = () => lb!.classList.remove("open")
      figs.forEach((f, i) => f.addEventListener("click", () => { show(i); lb!.classList.add("open") }))
      lb.addEventListener("click", e => { if (e.target === lb) close() })
      lb.querySelector(".x")!.addEventListener("click", close)
      lb.querySelector(".p")!.addEventListener("click", () => show(cur - 1))
      lb.querySelector(".n")!.addEventListener("click", () => show(cur + 1))
      addEventListener("keydown", e => { if (!lb!.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1) })
    }

    // mobile call bar: tuck away while the quote form / footer is already on screen
    const callbar = o.callbar ? document.querySelector<HTMLElement>(o.callbar) : null
    let io: IntersectionObserver | undefined
    if (callbar && o.callbarHide && "IntersectionObserver" in window) {
      const seen = new Set<Element>()
      io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)); callbar.classList.toggle("hide", seen.size > 0) }, { threshold: 0.15 })
      all(o.callbarHide).forEach(el => io!.observe(el))
    }

    // form success state
    const res = o.form ? document.querySelector<HTMLElement>(o.form) : null
    const mo = res ? new MutationObserver(() => res.classList.toggle("ok", /^thank you/i.test(res.textContent ?? ""))) : null
    if (res && mo) mo.observe(res, { childList: true, characterData: true, subtree: true })

    return () => {
      io?.disconnect(); ctx.revert(); mo?.disconnect(); lb?.remove()
      all(o.counters).forEach(el => { const n = Array.from(el.childNodes).find(x => x.nodeType === Node.TEXT_NODE); if (n && el.dataset.countTo) n.textContent = el.dataset.countTo })
      document.querySelector(".scroll-progress")?.remove(); root.classList.remove("motion-js")
    }
  }, [])
  return null
}
