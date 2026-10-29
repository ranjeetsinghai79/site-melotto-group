import type { Metadata } from "next"
import "./globals.css"
import { config } from "@/lib/config"
import { palette } from "@/lib/palette"
import { FAQ_SCHEMA, HOWTO_SCHEMA } from "@/lib/aeo"

const { business } = config
export const metadata: Metadata = {
  title: `${business.name} | ${business.address}`,
  description: `${business.name} — ${business.tagline} Serving ${business.serviceAreas.join(", ")}. Call ${business.phone}.`,
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={palette(config).css as React.CSSProperties}>
      <head>
                        {FAQ_SCHEMA && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />}
        {HOWTO_SCHEMA && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: HOWTO_SCHEMA }} />}
      </head>
      <body className="antialiased">
        {children}
        {business.aiConfigId && (
          <script
            src={`${(business.aiHost ?? "https://ai-reception-459352382653.us-central1.run.app").replace(/\/$/, "")}/widget.js`}
            data-config={business.aiConfigId}
            data-name={business.name}
            async
          />
        )}
      </body>
    </html>
  )
}
