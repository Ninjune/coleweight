let guis = [],
 guiNames = []


export function registerGui(gui)
{
    guis.push(gui)
    guiNames.push(gui.aliases[0])
}

export default guis

// gui registering
import "./render/guis/alloyGui"
import "./render/guis/coinGui"
//import "./render/guis/collectionGui"
import "./render/guis/cwGui"
import "./render/guis/danceGui"
import "./render/guis/ffGui"
import "./render/guis/gyroGui"
import "./render/guis/powertrackerGui"
import "./render/guis/scrapGui"
import "./render/guis/miningAbilitiesGui"
//import "./render/miningAbilities"
import "./render/guis/stopwatchGui"
import "./render/guis/timerGui"
import "./render/guis/miningtestGui"