import settings from "../../settings"
import { BaseGui } from "../../utils/BaseGui"
import { registerGui } from "../../utils/GuIManager"
import { Title } from "../../utils/Rendering"
import { data } from "../../utils/Utils"

const title = new Title({text: "&bTimer done"})

const timerGui = new BaseGui(["timerGui", "timer"], () => {
        if (!settings.timerVisible || (data.timerGui.timer <= 0 && !settings.timerEndVisible && !timerGui.isOpen())) return

        let timerHr = Math.floor(data.timerGui.timer/60/60), message

        if(timerHr >= 1)
            message = `&aTimer: &b${timerHr}h ${Math.floor(data.timerGui.timer/60) - timerHr*60}m`
        else
            message = `&aTimer: &b${Math.floor(data.timerGui.timer/60)}m ${Math.floor(data.timerGui.timer%60)}s`

        return message
}, "timerVisible", [
    register("step", () => {
        if(data.timerGui.timer > 0)
            data.timerGui.timer -= 1
        else if (data.timerTitlePlay){
            title.draw()
            data.timerTitlePlay = false
            data.save()
        }
    }).setFps(1)
])

registerGui(timerGui)