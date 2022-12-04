import axios from "../../axios"
import settings from "../settings"
import Settings from "../settings"
import constants from "../util/constants"
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
    if (!Settings.trackGriefers) return
    try
    {
        const NetHandlerPlayClient = Client.getConnection(),
        PlayerMap = NetHandlerPlayClient.func_175106_d() // getPlayerInfoMap
        
        PlayerMap.filter(player => player.func_178853_c() > 0 && !player.func_178845_a().name.startsWith("!")).forEach((PlayerMP) => {
            let player = PlayerMP.func_178845_a().name
            
            if(!checkedPlayers.includes(player))
            {
                if(griefers.includes(player))
                    ChatLib.chat(`${PREFIX}&e'${player}' is a griefer!`)
                checkedPlayers.push(player)
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
export default ""