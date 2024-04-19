import settings from "../settings"
import { dwarvenChecker, Title } from "../util/helperFunctions"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
const title = new Title({text: "&2A day has passed and your &bSkymall &2perk has changed!", scale: 3})

register("step", () => {
    if(dwarvenChecker.check() || !settings.dwarvenNotifier) return
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
                title.draw()
            }
        }
    }
}).setDelay(10)