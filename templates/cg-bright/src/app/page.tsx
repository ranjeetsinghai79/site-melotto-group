import { config } from "@/lib/config"
import { render } from "@/lib/render"
import Behavior from "./behavior"
import SiteMotion from "@core/web/blocks/motion"

export default function Home() {
  return (<><div dangerouslySetInnerHTML={{ __html: render(config) }} /><Behavior />
      <SiteMotion
        hero={{ h1: ".hero h1", before: [".hero .eyebrow"] }}
        cta=".hero .actions .button, #appointment .button:not(.closebutton)"
        headings="main h2"
        counters=""
        starsBig=".rd-stars-big"
        rows=".rd-mq-row"
        gallery=".rd-grid figure"
        callbar=".mo-callbar"
        callbarHide="#appointment, footer"
      />
    </>)
}
