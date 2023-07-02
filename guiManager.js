let guis = [],
 guiNames = []


export function registerGui(gui)
{
    guis.push(gui)
    guiNames.push(gui.aliases[0])
}

export default guis

// gui registering (I HATE WRITING THESE)
import "./render/guis/coinGui"
import "./render/guis/timerGui"
import "./render/guis/collectionGui"
import "./render/guis/cwGui"
import "./render/guis/danceGui"
import "./render/guis/ffGui"
import "./render/guis/gyroGui"
import "./render/guis/powertrackerGui"
//import "./render/miningAbilities"
import "./render/guis/stopwatchGui"
import "./render/guis/miningAbilitiesGui"
import { deleteFile } from "./util/helperFunctions"

// clean up from some time ago (added v1.10.8)
deleteFile("render/miningAbilities.js")