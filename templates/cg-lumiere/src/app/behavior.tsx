"use client"
import { useEffect } from "react"

// Behaviour re-implemented from the Lumière reference (scroll reveal, FAQ accordion, mobile menu);
// the reference had no contact form, so a real POST to /api/leads is added.
export default function Behavior() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduced) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target) } }), { threshold: .1 })
      document.querySelectorAll(".rv").forEach(el => { el.classList.add("rv-pending"); io.observe(el) })
    }
    document.querySelectorAll<HTMLElement>(".faq-item>button").forEach(btn => btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true"; btn.setAttribute("aria-expanded", String(!open))
      document.getElementById(btn.getAttribute("aria-controls")!)!.hidden = open
    }))
    const menu = document.querySelector<HTMLElement>(".menu-button")!, nav = document.querySelector<HTMLElement>(".nav-shell nav")!
    menu.addEventListener("click", () => { const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", String(o)) })
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")))
    document.querySelectorAll<HTMLElement>("[data-service]").forEach(a => a.addEventListener("click", () => { const sel = document.querySelector<HTMLSelectElement>("#svc")!; if ([...sel.options].some(o => o.text === a.dataset.service)) sel.value = a.dataset.service! }))
    const form = document.querySelector<HTMLFormElement>("#consult-form")!
    form.addEventListener("submit", async e => {
      e.preventDefault()
      const f = new FormData(form), ok = document.querySelector<HTMLElement>("#form-ok")!
      const [firstName, ...rest] = String(f.get("name") || "").trim().split(/\s+/)
      ok.hidden = false; ok.textContent = "Sending…"
      try {
        const r = await fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName, lastName: rest.join(" "), phone: f.get("phone"), service: f.get("service"), message: f.get("message") }) })
        ok.textContent = r.ok ? "Thank you — we’ve got your request and will be in touch shortly." : "Something went wrong. Please call us instead."
        if (r.ok) form.reset()
      } catch { ok.textContent = "Something went wrong. Please call us instead." }
    })
  }, [])
  return null
}
