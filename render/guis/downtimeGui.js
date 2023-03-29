import { registerGui } from "../../guiManager"
import settings from "../../settings"
import constants from "../../util/constants"
import { textGui } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
let oldFuel = 0,
 timeAtLastFuel = 0,
 overallDowntime = 0,
 trackingDowntime = false,
 downtime = 0,
 downtimeCount = 0,
 uptime = 0
const downtimeTextGui = new textGui()
const downtimeGui = new BaseGui(["downtimeGui", "downtime"], () => {
    if (downtimeCount == 0 || !trackingDowntime || !settings.downtimeTracker) return
    let avgDowntime = Math.ceil((overallDowntime/downtimeCount)*100) / 100
    downtimeTextGui.guiObject = {leftValues: ["Downtime", "Overall Downtime", "Average Downtime", "Uptime"], rightValues: [downtime, overallDowntime, avgDowntime, uptime]}
    downtimeTextGui.x = constants.data.downtimeGui.x
    downtimeTextGui.y = constants.data.downtimeGui.y
    downtimeTextGui.renderGui()
}, resetVars)
registerGui(downtimeGui)


register("actionbar", (xp) => {
    if(!settings.downtimeTracker) return
    if(Player.getHeldItem() == null) return
    let heldItem = Player.getHeldItem().getNBT().toObject()["tag"]["ExtraAttributes"],
     newFuel = parseInt(heldItem["drill_fuel"]) // credit to DocilElm because I'm lazy.

    if(!newFuel) return
    else if(oldFuel == 0) oldFuel = newFuel
    else if(oldFuel !== newFuel)
    {
        if(timeAtLastFuel == 0)
        {
            timeAtLastFuel = Date.now()
            return
        }
        downtime = (Date.now() - timeAtLastFuel)
        overallDowntime += downtime
        downtimeCount += 1
        timeAtLastFuel = Date.now()
        trackingDowntime = true
        oldFuel = newFuel
    }
}).setCriteria("${*}+${xp} Mining ${*}")


register("step", () => {
    if((Date.now()-timeAtLastFuel)/1000 >= 60)
    {
        resetVars()
    } // over 60 seconds then stop making gui
    else if(trackingDowntime)
        uptime += 1
}).setFps(1)


function resetVars()
{
    uptime = 0
    oldFuel = 0
    overallDowntime = 0
    timeAtLastBreak = 0
    trackingDowntime = false
}