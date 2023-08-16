/*import axios from "../../axios" // ♒
import settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
const ChatComponentText = Java.type("net.minecraft.util.ChatComponentText")

register("worldLoad", () => {
    const NetHandlerPlayClient = Client.getMinecraft().func_147114_u(),
     PlayerMap = NetHandlerPlayClient.func_175106_d() 
    let tag = ""

    //axios.get(`https://ninjune.dev/api/mminers`)
    //.then((res) => {
    PlayerMap.filter(player => player.func_178853_c() > 0 && !player.func_178845_a().name.startsWith("!")).forEach((PlayerMP, index) => {
        let player = PlayerMP.func_178845_a().name // getGameProfile
        console.dir(PlayerMP) 
        PlayerMP.func_178859_a(new ChatComponentText("Hello World")) // setDisplayName; takes an IChatComponent; doesn't do anything.
        PlayerMP.func_178850_i().func_96662_c("Hello World") // getPlayerTeam; setNameSuffix; doesn't do anything
    })
    //.catch((e) => {console.log(e)})
    //})
})
/*res.data.macroers.forEach((macroer) => {
    if(player == macroer) tag ="[M] "
})
res.data.griefers.forEach((griefer) => {
    if(player == griefer) tag ="[G] "
})
*/