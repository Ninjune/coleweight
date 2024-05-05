import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { BaseGui } from "../BaseGui"

let ffCountdownTo = 0


const ffGui = new BaseGui(["ffGui", "ff", "firefreeze"], () => {
    let message = ""

    if (ffCountdownTo && ffCountdownTo > 0)
        message = ("&aFire freeze in: &b" + (Math.max(0, ffCountdownTo - Date.now()) / 1000).toFixed(2) + "s")

    return message
}, () => { return settings.m3timer })
registerGui(ffGui)


register("chat", () => {
    ffCountdownTo = Date.now() + 5000

    setTimeout(() => {
        ffCountdownTo = 0
    }, 5000)
}).setChatCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?")