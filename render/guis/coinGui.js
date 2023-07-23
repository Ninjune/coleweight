import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { addCommas, secondsToMessage } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
import request from "../../../requestV2"
// some code from soopy's version
let money = 0
let startTime = -1
let lastMined = -1
let moneyPerHour = -1
const gemstoneCosts = {}


const coinGui = new BaseGui(["coinGui", "coin", "money", "cointracker"], () => {
    if((!coinGui.isOpen() && !settings.coinTracker) || startTime <= 0)
        return

    return `&a$/hr: &b$${addCommas(moneyPerHour)}\n&a$ made: &b$${addCommas(Math.floor(money))}&b\n&aUptime: &b${secondsToMessage((Date.now()-startTime)/1000)}`
}, resetVars)
registerGui(coinGui)


register("chat", (gem, amount, event) => { 
    let id = "FLAWED_" + gem.toUpperCase() + "_GEM"
    lastMined = Date.now()

    if(startTime === 0) return
    if(startTime === -1)
    {
        startTime = 0
        request({
            url: `https://api.hypixel.net/skyblock/bazaar`,
            json: true
        })
        .then(res => {
            startTime = Date.now()
            Object.keys(res.products).forEach(i => {
                if(id.startsWith("FLAWED_"))
                    gemstoneCosts[i] = settings.forceNpc ? 240 : Math.max(240, res.products[id].quick_status.sellPrice)
            })
        })
        .catch(err => {
            if(settings.debug)
                console.log("Coin tracker: " + err)
        })
        return
    }

    money += gemstoneCosts[id] * amount
    moneyPerHour = Math.floor(money / ((Date.now() - startTime) / (1000 * 60 * 60)))
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r&a. &r&aFlawed (.+) Gemstone &r&8x(\d+)&r&f!&r/g)

register("step", () => {
    if (lastMined && Date.now() - lastMined > 2 * 60000) {
        resetVars()
    }
}).setFps(1)


function resetVars()
{
    money = 0
    startTime = -1
    lastMined = -1
}