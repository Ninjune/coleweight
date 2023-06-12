import { registerGui } from "../../guiManager"
import settings from "../../settings"
import constants from "../../util/constants"
import { Title } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"


const timerGui = new BaseGui(["timerGui", "timer"], () => {
        if (!settings.timerVisible || (constants.data.timerGui.timer <= 0 && !settings.timerEndVisible && !timerGui.isOpen())) return

        let timerHr = Math.floor(constants.data.timerGui.timer/60/60), message

        if(timerHr >= 1)
            message = `&aTimer: &b${timerHr}h ${Math.floor(constants.data.timerGui.timer/60) - timerHr*60}m`
        else
            message = `&aTimer: &b${Math.floor(constants.data.timerGui.timer/60)}m ${Math.floor(constants.data.timerGui.timer%60)}s`

        return message
    }
)
const title = new Title("&bTimer done")
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