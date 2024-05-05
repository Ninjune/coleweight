//Written by _ryt
import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { BaseGui } from "../BaseGui"
import axios from "../../../axios"
import { secondsToMessage } from "../../util/helperFunctions"


var latestAlloy = -1
var lastUpdate = -1
const alloyGui = new BaseGui(["alloyGui", "alloy", "divanAlloy", "alloytracker"], () => {
    return `&aLast alloy: &b${secondsToMessage((new Date().getTime()-latestAlloy)/1000)} ago`
}, () => { return alloyGui.isOpen() || settings.alloyTracker} , reloadAlloy)
registerGui(alloyGui)

function reloadAlloy()
{
    axios.get("https://ninjune.dev/api/alloy-drop/last")
    .then(res => {
        latestAlloy = parseInt(res.data)
    })
    .catch(err => {
        if(!settings.debug) return
        console.log(new Error(err).lineNumber)
    })
}

register("step", () => {
    if (Date.now() - lastUpdate > 2 * 60000) {
        lastUpdate = Date.now()
        reloadAlloy()
    }
}).setFps(1)

