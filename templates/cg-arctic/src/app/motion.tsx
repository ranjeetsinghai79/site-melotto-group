"use client"
import SiteMotion from "@core/web/blocks/motion"

// cg-arctic's selectors for the shared motion engine (packages/core/src/blocks/motion.tsx).
export default function Motion() {
  return (
    <SiteMotion
      hero={{
        h1: ".hero h1",
        before: [".hero .eyebrow", ".hero .live-chip"],
        after: [".hero-copy > p", ".hero .actions .btn", ".hero .hero-promise, .hero .rating"],
        stars: ".hero .rating .stars",
        last: [".trust > div"],
      }}
      cta=".hero .actions .btn:not(.outline), .urgent .btn, .quote form .btn, .site-header .btn"
      headings=".section h2, .process h2, .faq h2"
      counters=".stat strong"
      starsBig=".reviews .stars.big"
      rows=".mq-row"
      gallery=".work-grid figure"
      steps=".steps > article"
      tilt=".service"
      callbar=".callbar"
      callbarHide="#quote, .footer"
      form="#form-result"
    />
  )
}
