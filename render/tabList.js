/*import axios from "../../axios" // implement when im not an idiot
import settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX


register("worldLoad", () => {
    const NetHandlerPlayClient = Client.getConnection(),
     PlayerMap = NetHandlerPlayClient.func_175106_d() // getPlayerInfoMap
    let tag = ""

    axios.get(`https://ninjune.dev/api/mminers`)
    .then((res) => {
        PlayerMap.filter(player => !player.func_178845_a().name.startsWith("!")).forEach((player) => {
            res.data.macroers.forEach((macroer) => {
                if(player == macroer) tag ="[M] "
            })
            res.data.griefers.forEach((griefer) => {
                if(player == griefer) tag ="[G] "
            })
        
            player.func_178859_a(new net.minecraft.util.IChatComponentText("Player"))
        })
    })
    .catch((e) => {console.log(e)})
})*/