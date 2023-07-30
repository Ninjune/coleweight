import settings from "../../settings"
import { PREFIX, findGriefer, isInTab } from "../../utils/Utils"

let checkedPlayers = []

register("step", () => {
    if (!settings.trackGriefers || (!settings.grieferEverywhere && !(isInTab("Crystal Hollows") || isInTab("Dwarven Mines")))) return

    let date_ob = new Date()
    let seconds = date_ob.getSeconds()

    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
        checkMMiners()
}).setFps(1)


register("worldLoad", () => {
    checkedPlayers = []
    setTimeout(() => {
        checkMMiners()
    }, 1500)
})

const checkMMiners = () => {
    try{
        const NetHandlerPlayClient = Client.getConnection()
        const PlayerMap = NetHandlerPlayClient?.func_175106_d() // getPlayerInfoMap
        
        if(!PlayerMap) return

        PlayerMap.filter(player => player.func_178853_c() > 0 && !player.func_178845_a().name.startsWith("!")).forEach((PlayerMP) => {
            let player = PlayerMP.func_178845_a().name

            if(checkedPlayers.includes(player)) return

            let griefer = findGriefer(player)

            if(!griefer.found) return
                
            ChatLib.chat(`${PREFIX}&e'${player}' has griefed before. Their last grief was on ${griefer.dateObj.toString().slice(4, 15)}.`)
            checkedPlayers.push(player)
        })
    } catch(err) { if(settings.debug) console.log("GrieferTrack trycatch: " + err) }

    return checkedPlayers
}