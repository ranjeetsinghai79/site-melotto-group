"use client"
import { useEffect, useRef, useState } from "react"

/** Scroll reveal. Content is fully visible without JS; JS adds the hidden→shown transition. */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: { children: React.ReactNode; delay?: number; as?: any; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    el.classList.add("rv-pending")
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("rv-in"), delay); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

export function ContactForm({ options, submitText }: { options: string[]; submitText: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [service, setService] = useState<string>("")
  const [timing, setTiming] = useState<string>("")
  const timings = ["As soon as possible", "This week", "Just exploring"]
  const chips = options.slice(0, 8)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("sending")
    const f = new FormData(e.currentTarget)
    const [firstName, ...rest] = String(f.get("name") || "").trim().split(/\s+/)
    const note = String(f.get("message") || "")
    try {
      const res = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName: rest.join(" "), phone: f.get("phone"), email: f.get("email"), service: service || chips[0], message: [timing && `Timing: ${timing}`, note].filter(Boolean).join(" — ") }),
      })
      setState(res.ok ? "done" : "error")
    } catch { setState("error") }
  }
  if (state === "done") return <div className="form-card"><h3>Thank you — we’ve got it.</h3><p>We’ll be in touch shortly.</p></div>
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <fieldset className="chips"><legend>What do you need help with?</legend>
        <div>{chips.map(o => <button type="button" key={o} className={`chip${service === o ? " on" : ""}`} aria-pressed={service === o} onClick={() => setService(o)}>{o}</button>)}</div>
      </fieldset>
      <fieldset className="chips"><legend>When?</legend>
        <div>{timings.map(o => <button type="button" key={o} className={`chip${timing === o ? " on" : ""}`} aria-pressed={timing === o} onClick={() => setTiming(o)}>{o}</button>)}</div>
      </fieldset>
      <label>Your name<input name="name" required placeholder="First and last name" /></label>
      <div className="row2">
        <label>Phone<input name="phone" type="tel" required placeholder="(000) 000-0000" /></label>
        <label>Email <span>(optional)</span><input name="email" type="email" placeholder="you@email.com" /></label>
      </div>
      <label>Anything else? <span>(optional)</span><textarea name="message" rows={2} placeholder="A few details help us prepare." /></label>
      <button className="btn btn-primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : submitText} <span aria-hidden>↗</span></button>
      {state === "error" && <p className="form-err">Something went wrong — please call us instead.</p>}
    </form>
  )
}
