import { config } from "@/lib/config"
import { pickDesign } from "@/lib/design"
import { Nav, Hero, Ticker, Services, Process, About, Stats, Reviews, FAQ, Contact, Footer } from "@/components/sections"

export default function Home() {
  const design = pickDesign(config)
  const p = { config, design }
  return (
    <>
      <Nav {...p} />
      <main>
        <Hero {...p} />
        <Ticker {...p} />
        <Services {...p} />
        <Process {...p} />
        <About {...p} />
        <Stats {...p} />
        <Reviews {...p} />
        <FAQ {...p} />
        <Contact {...p} />
      </main>
      <Footer {...p} />
    </>
  )
}
