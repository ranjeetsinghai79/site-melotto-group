"use client"
import { useEffect } from "react"

// Behaviour copied from the ArcticFlow reference (menu, service shortcuts, scroll reveal, hero parallax);
// the demo-only form handler is replaced with a real POST to /api/leads.
export default function Behavior() {
  useEffect(() => {
    const menu = document.querySelector<HTMLElement>(".menu")!
    const nav = document.querySelector<HTMLElement>("#navlinks")!
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(open)); nav.classList.toggle("open", open) })
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false") }))
    document.querySelectorAll<HTMLElement>("[data-service]").forEach(b => b.addEventListener("click", () => {
      const sel = document.querySelector<HTMLSelectElement>("#service")!
      const v = b.dataset.service!; if ([...sel.options].some(o => o.value === v || o.text === v)) sel.value = v
      document.querySelector("#quote")!.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth" })
    }))
    const form = document.querySelector<HTMLFormElement>("#quote-form")!
    form.addEventListener("submit", async e => {
      e.preventDefault()
      const f = new FormData(form); const out = document.querySelector<HTMLElement>("#form-result")!
      const [firstName, ...rest] = String(f.get("name") || "").trim().split(/\s+/)
      out.hidden = false; out.textContent = "Sending…"
      try {
        const r = await fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName, lastName: rest.join(" "), phone: f.get("phone"), service: f.get("service"), message: f.get("message") }) })
        out.textContent = r.ok ? "Thank you — we’ve got your request and will be in touch shortly." : "Something went wrong. Please call us instead."
        if (r.ok) form.reset()
      } catch { out.textContent = "Something went wrong. Please call us instead." }
    })
    const header = document.querySelector<HTMLElement>(".site-header")!
    const hero = document.querySelector<HTMLElement>(".hero-grid")!
    const image = document.querySelector<HTMLElement>(".hero-photo img")!
    let observer: IntersectionObserver | undefined; const targets = new Set<Element>()
    document.querySelectorAll(".section-head,.service,.urgent,.about>div,.plan,.reviews-grid .review,.quote>div,.quote>form,.faq-layout>div,details,.footer-grid>div,.footer-bottom,.process .eyebrow,.process h2").forEach(el => targets.add(el))
    const resetMotion = () => {
      observer?.disconnect(); document.documentElement.classList.remove("motion-ready")
      targets.forEach(el => el.classList.remove("scroll-reveal", "is-visible")); image.style.transform = ""
      if (reduced.matches || !("IntersectionObserver" in window)) return
      observer = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-visible"); observer!.unobserve(en.target) } }), { threshold: .08, rootMargin: "0px 0px -24px 0px" })
      targets.forEach(el => { if (el.parentElement!.closest(".scroll-reveal")) return; el.classList.add("scroll-reveal"); const sib = [...el.parentElement!.children]; (el as HTMLElement).style.setProperty("--reveal-delay", Math.min(sib.indexOf(el) % 3, 2) * 80 + "ms"); observer!.observe(el) })
      document.documentElement.classList.add("motion-ready")
    }
    let pending = false
    const paint = () => { pending = false; header.classList.toggle("is-scrolled", scrollY > 15); if (!reduced.matches && innerWidth > 740) { const r = hero.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) image.style.transform = `translate3d(0,${Math.max(-35, Math.min(35, -r.top * .065))}px,0) scale(1.09)` } else image.style.transform = "" }
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(paint) } }
    resetMotion(); paint(); addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule, { passive: true })
  }, [])
  return null
}
