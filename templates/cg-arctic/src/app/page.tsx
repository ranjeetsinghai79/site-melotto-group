import { config } from "@/lib/config"
import { render } from "@/lib/render"
import Behavior from "./behavior"
import Motion from "./motion"

export default function Home() {
  return (<><div dangerouslySetInnerHTML={{ __html: render(config) }} /><Behavior /><Motion /></>)
}
