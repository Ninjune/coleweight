import { registerGui } from "../../guiManager"
import settings from "../../settings"
import constants from "../../util/constants"
import { Title } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"


const timerGui = new BaseGui(["timerGui", "timer"], () => {
    if (!timerGui.isOpen() && constants.data.timerGui.timer <= 0 && !settings.timerEndVisible) return

    let timerHr = Math.floor(constants.data.timerGui.timer/60/60), message

    if(timerHr >= 1)
        message = `&aTimer: &b${timerHr}h ${Math.floor(constants.data.timerGui.timer/60) - timerHr*60}m`
    else
        message = `&aTimer: &b${Math.floor(constants.data.timerGui.timer/60)}m ${Math.floor(constants.data.timerGui.timer%60)}s`

    return message
}, () => { return settings.timerVisible || timerGui.isOpen()})
const title = new Title({text: "&bTimer done"})

registerGui(timerGui)


register("step", () => {
    if(constants.data.timerGui.timer > 0)
        constants.data.timerGui.timer -= 1
    else if (constants.data.timerTitlePlay)
    {
        title.draw()
        constants.data.timerTitlePlay = false
        constants.data.save()
    }
}).setFps(1)