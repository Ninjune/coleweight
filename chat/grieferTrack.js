import axios from "../../axios"
import settings from "../settings"
import Settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
let players = [] // global variable moment


register("step", () => {
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()
    
    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
        checkMMiners()
}).setFps(1)


register("worldLoad", () => {
    players = []
    checkMMiners()
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
            
            if(players.indexOf(player) == -1)
            {
                axios.get(`https://ninjune.dev/api/mminers?username=${player}`)
                .then(res => {
                    if(res.data.found == true && res.data.type == "griefer")
                        ChatLib.chat(`${PREFIX}&e'${res.data.name}' is a griefer!`)
                })
                players.push(player)
            }
        })
    } catch(err) { if(settings.debug) console.log("grieferTrack trycatch: " + err) }

    return players
}

export default ""