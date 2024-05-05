import { registerGui } from "../../guiManager"
import settings from "../../settings"
import constants from "../../util/constants"
import { BaseGui } from "../BaseGui"


const stopwatchGui = new BaseGui(["stopwatchGui", "stopwatch"], () => {
    let hr = Math.floor(constants.data.stopwatch/60/60), message

    if(hr >= 1)
        message = `&aStopwatch: &b${hr}h ${Math.floor(constants.data.stopwatchGui.stopwatch/60) - hr*60}m`
    else
        message = `&aStopwatch: &b${Math.floor(constants.data.stopwatchGui.stopwatch/60)}m ${Math.floor(constants.data.stopwatchGui.stopwatch%60)}s`

    if(!constants.data.tickStopwatch)
        message += " &c&lPAUSED"

    return message
}, () => { return settings.stopwatchVisible })
registerGui(stopwatchGui)


register("step", () => {
    if(constants.data.tickStopwatch)
        constants.data.stopwatchGui.stopwatch += 1
}).setFps(1)