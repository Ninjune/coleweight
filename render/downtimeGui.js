import settings from "../settings"
import { createGui } from "./textGuiCreator"
import constants from "../util/constants"

const downtimeGui = new Gui()
let oldFuel = 0,
 timeAtLastFuel = 0,
 overallDowntime = 0,
 trackingDowntime = false,
 downtime = 0,
 downtimeCount = 0,
 uptime = 0


export function openDowntimeGui()
{
    downtimeGui.open()
}
 

register("dragged", (dx, dy, x, y) => {
    if (!downtimeGui.isOpen()) return
    constants.downtimedata.x = x
    constants.downtimedata.y = y
    constants.downtimedata.save()
})

register('actionbar', (xp) => {
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
        downtime = Date.now() - timeAtLastFuel
        overallDowntime += downtime
        downtimeCount += 1
        timeAtLastFuel = Date.now()
        trackingDowntime = true
        oldFuel = newFuel
    }
}).setCriteria('${*}+${xp} Mining ${*}')


register("renderOverlay", () => {
    if (downtimeGui.isOpen()) 
    {
        let txt = "Drag to move."
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        createGui(
            {leftValues: ["Downtime", "Overall Downtime", "Average Downtime", "Uptime"], rightValues: [0, 0, 0, 0]}, 
            constants.downtimedata.x, 
            constants.downtimedata.y
        )
        return
    }
    if (downtimeCount == 0 || !trackingDowntime) return
    let avgDowntime = Math.ceil((overallDowntime/downtimeCount)*100) / 100
    createGui(
        {leftValues: ["Downtime", "Overall Downtime", "Average Downtime", "Uptime"], rightValues: [downtime, overallDowntime, avgDowntime, uptime]}, 
        constants.downtimedata.x, 
        constants.downtimedata.y
    )
})


register("step", () => {
    if((Date.now()-timeAtLastFuel)/1000 >= 60)
    {
        uptime = 0
        oldFuel = 0
        overallDowntime = 0
        timeAtLastFuel = 0
        trackingDowntime = false
    } // over 60 seconds then stop making gui
    else if(trackingDowntime)
        uptime += 1
}).setFps(1)