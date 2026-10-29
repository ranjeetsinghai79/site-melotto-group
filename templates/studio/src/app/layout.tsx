import type { Metadata } from "next"
import "./globals.css"
import { config } from "@/lib/config"
import { pickDesign } from "@/lib/design"
import { FAQ_SCHEMA, HOWTO_SCHEMA } from "@/lib/aeo"

const { business } = config
const design = pickDesign(config)

export const metadata: Metadata = {
  title: `${business.name} | ${business.address}`,
  description: `${business.name} — ${business.tagline} Serving ${business.serviceAreas.join(", ")}. Call ${business.phone}.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={design.cssVars as React.CSSProperties}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={design.fontsHref} />
        {FAQ_SCHEMA && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />}
        {HOWTO_SCHEMA && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: HOWTO_SCHEMA }} />}
      </head>
      <body className={`skin-${design.skin} hero-${design.hero} svc-${design.services}`}>{children}</body>
    </html>
  )
}
