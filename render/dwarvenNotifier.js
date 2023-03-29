import settings from "../settings"
import { checkInDwarven, Title } from "../util/helperFunctions"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
const title = new Title(`&2A day has passed and your &bSkymall &2perk has changed!`, 3)

register("step", () => {
    if(checkInDwarven() || !settings.dwarvenNotifier) return
    const scoreboard = Scoreboard.getLines()

    for(let lineIndex = 0; lineIndex < scoreboard.length; lineIndex++) 
    {
        let line = scoreboard[lineIndex].toString()
        if (line.includes("☽") || line.includes("☀"))
        {
            let matches = /§7(\d\d?:\d\d)(am|pm)/g.exec(line)
            if(matches == undefined) return ChatLib.chat("No matches.")
            if(matches[1] == "12:00" && matches[2] == "am")
            {
                ChatLib.chat(`${PREFIX}&aA day has passed and your Skymall perk has changed!`)
                title.drawState = 1
            }
        }
    }
}).setDelay(10)

register("renderOverlay", () => {
    if(title.drawState == 1)
        title.draw()
})