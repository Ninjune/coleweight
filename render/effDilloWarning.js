import settings from "../settings"
import constants from "../util/constants"
const txt = "&eYou have armadillo out with efficient miner enabled!"

register("renderOverlay", () => {
    if(!(constants.data.currentPet == "armadillo" && constants.data.effMinerEnabled) || !settings.effDilloWarning) return

    Renderer.drawStringWithShadow(txt,
        Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2,
        Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/4
    )
})

