import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { checkInDwarven, checkInHollows } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let checkedPlayers = [],
 griefers = []


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
    if (!settings.trackGriefers || (!settings.grieferEverywhere && !(checkInDwarven() || checkInHollows()))) return
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
                    ChatLib.chat(`${PREFIX}&e'${player}' has griefed &e&l${griefer.offences} &etime(s). Their last grief was on ${griefer.dateObj.toString().slice(4, 15)}.`)
                    checkedPlayers.push(player)
                }
            }
        })
    } catch(err) { if(settings.debug) console.log("grieferTrack trycatch: " + err) }

    return checkedPlayers
}


register("gameLoad", () => {
    axios.get(`https://ninjune.dev/api/mminers`)
    .then(res => {
        griefers = res.data.griefers
    })
    .catch(err => {
        if(!settings.debug) return
        ChatLib.chat(err)
    })
})


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
export default ""