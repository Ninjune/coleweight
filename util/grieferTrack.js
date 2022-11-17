import axios from "../../axios"
import Settings from "../settings"
import constants from "./constants"
const PREFIX = constants.PREFIX
let players = [] // global variable moment


function checkMMiners()
{
    if (!Settings.trackGriefers) return
    let tempPlayers = World.getAllPlayers().map((p) => p.getName())

    tempPlayers.forEach((player, index) => {
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

    return players
}


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


export default ""