"use client"
import { useEffect } from "react"

// Behaviour copied from the Bright Smile reference (menu, service shortcuts, dialog);
// the demo-only submit is replaced with a real POST to /api/leads.
export default function Behavior() {
  useEffect(() => {
    const menu = document.querySelector<HTMLElement>(".menu")!, nav = document.querySelector<HTMLElement>("nav")!
    menu.addEventListener("click", () => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); menu.setAttribute("aria-label", open ? "Close menu" : "Open menu") })
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false") }))
    document.querySelectorAll<HTMLElement>("[data-service]").forEach(a => a.addEventListener("click", () => {
      const sel = document.querySelector<HTMLSelectElement>("#service")!; const v = a.dataset.service!
      if ([...sel.options].some(o => o.value === v || o.text === v)) sel.value = v
    }))
    const dialog = document.querySelector<HTMLDialogElement>("#confirmation")!
    const form = document.querySelector<HTMLFormElement>("#appointment-form")!
    form.addEventListener("submit", async e => {
      e.preventDefault()
      const f = new FormData(form); const [firstName, ...rest] = String(f.get("name") || "").trim().split(/\s+/)
      try { await fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName, lastName: rest.join(" "), phone: f.get("phone"), service: f.get("service"), message: f.get("message") }) }) } catch {}
      dialog.showModal(); form.reset()
    })
    document.querySelectorAll(".close,.closebutton").forEach(b => b.addEventListener("click", () => dialog.close()))
    dialog.addEventListener("click", e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close() } })
  }, [])
  return null
}
