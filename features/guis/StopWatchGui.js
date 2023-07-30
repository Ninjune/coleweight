import { addEvent } from "../../FeatureBase"
import settings from "../../settings"
import { BaseGui } from "../../utils/BaseGui"
import { registerGui } from "../../utils/GuIManager"
import { data } from "../../utils/Utils"

const stopwatchGui = new BaseGui(["stopwatchGui", "stopwatch"], () => {
    if(!settings.stopwatchVisible) return
    
    let hr = Math.floor(data.stopwatch/60/60)
    let message

    if(hr >= 1)
        message = `&aStopwatch: &b${hr}h ${Math.floor(data.stopwatchGui.stopwatch/60) - hr*60}m`
    else
        message = `&aStopwatch: &b${Math.floor(data.stopwatchGui.stopwatch/60)}m ${Math.floor(data.stopwatchGui.stopwatch%60)}s`

    if(!data.tickStopwatch)
        message += " &c&lPAUSED"

    return message
}, "stopwatchVisible")

registerGui(stopwatchGui)

addEvent("tickStopwatch", register("step", () => {
    if(!data.tickStopwatch) return

    data.stopwatchGui.stopwatch += 1
}).setFps(1), [], null, null, true)