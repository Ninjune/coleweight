import { addEvent } from "../../FeatureBase"
import settings from "../../settings"
import { data } from "../../utils/Utils"

const txt = "&eYou have armadillo out with efficient miner enabled!"

addEvent("effDilloWarning", register("renderOverlay", () => {
    if(!settings.effDilloWarning || !(data.currentPet == "armadillo" && data.effMinerEnabled)) return

    Renderer.drawStringWithShadow(txt,
        Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2,
        Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/4
    )
}))