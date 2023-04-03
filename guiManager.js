let guis = [],
 guiNames = []


export function registerGui(gui)
{
    guis.push(gui)
    guiNames.push(gui.aliases[0])
}

export default guis

// gui registering (I HATE WRITING THESE)
import "./render/guis/timerGui"
import "./render/guis/collectionGui"
import "./render/guis/cwGui"
import "./render/guis/downtimeGui"
import "./render/guis/powertrackerGui"
//import "./render/miningAbilities"
import "./render/guis/stopwatchGui"
import "./render/guis/miningAbilitiesGui"