import settings from "../settings"
import { checkInDwarven, drawTitle } from "../util/helperFunctions"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

let drawTitleState = 0,
 drawTimestamp = undefined

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
                drawTitleState = 1
            }
        }
    }
}).setDelay(10)

register("renderOverlay", () => {
    if(drawTitleState == 1)
    {
        titleResults = drawTitle(`&2A day has passed and your &bSkymall &2perk has changed!`, drawTimestamp, 3)
        drawTitleState = titleResults.drawTitle
        drawTimestamp = titleResults.drawTimestamp
    }
})