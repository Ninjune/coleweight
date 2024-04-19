import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { dwarvenChecker, hollowsChecker } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let checkedPlayers = []
let griefers = []


register("step", () => {
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()

    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
        checkMMiners()
}).setFps(1)


register("worldLoad", () => {
    checkedPlayers = []
    setTimeout(() => {
        checkMMiners()
    }, 1500)
})


function checkMMiners()
{
    if (!settings.trackGriefers || (!settings.grieferEverywhere && !(dwarvenChecker.getState() || hollowsChecker.getState()))) return
    try
    {
        const NetHandlerPlayClient = Client.getConnection(),
         PlayerMap = NetHandlerPlayClient.func_175106_d() // getPlayerInfoMap

        PlayerMap.filter(player => player.func_178853_c() > 0 && !player.func_178845_a().name.startsWith("!")).forEach((PlayerMP) => {
            let player = PlayerMP.func_178845_a().name

            if(!checkedPlayers.includes(player))
            {
                let griefer = findGriefer(player)

                if(griefer.found)
                {
                    ChatLib.chat(`${PREFIX}&e'${player}' has griefed before. Their last grief was on ${griefer.dateObj.toString().slice(4, 15)}.`)
                    checkedPlayers.push(player)
                }
            }
        })
    } catch(err) { if(settings.debug) console.log("grieferTrack trycatch: " + err) }

    return checkedPlayers
}


/**
 * Finds if a player is a griefer.
 * @param {string} player
 * @returns
 */
export function findGriefer(player)
{
    let grieferReturnObj = {}
    grieferReturnObj.found = false
    griefers.forEach(griefer => {
        griefer.dateObj = new Date(0)
        griefer.dateObj.setUTCMilliseconds(griefer.timestamp)

        if(griefer.name.toLowerCase() == player.toLowerCase())
        {
            grieferReturnObj = griefer
            grieferReturnObj.found = true
        }
    })
    return grieferReturnObj
}


register("gameLoad", () => {
    axios.get("https://ninjune.dev/api/mminers")
    .then(res => {
        griefers = res.data.griefers
    })
    .catch(err => {
        if(!settings.debug) return
        console.log(new Error(err).lineNumber)
    })
})

export default ""