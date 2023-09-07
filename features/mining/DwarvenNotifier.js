import { addEvent } from "../../FeatureBase"
import settings from "../../settings"
import { Title } from "../../utils/Rendering"
import { PREFIX, getScoreboard, isInTab } from "../../utils/Utils"
const title = new Title({text: "&2A day has passed and your &bSkymall &2perk has changed!", scale: 3})

addEvent("dwarvenNotifier", register("step", () => {
    if(!settings.dwarvenNotifier || !isInTab("Dwarven Mines")) return

    getScoreboard().forEach(line => {
        if (!/(\d\d?:\d\d)(am|pm)/.test(line)) return

        let matches = /(\d\d?:\d\d)(am|pm)/g.exec(line)

        if(matches[1] == "12:00" && matches[2] == "am"){
            ChatLib.chat(`${PREFIX}&aA day has passed and your Skymall perk has changed!`)
            title.draw()
        }
    })
}).setDelay(10), [], "Mines")