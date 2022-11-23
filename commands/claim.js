import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
const serverId = java.util.UUID.randomUUID().toString().replace("-", "")

export function claim(structure)
{
    if(!settings.claiming) 
    {
        ChatLib.chat(`${PREFIX}&cPlease turn on the &3Claiming&c setting in /cw settings!`)
        return
    }

    if (constants.serverData.map != "Crystal Hollows")
    {
        ChatLib.chat(`${PREFIX}&cThis command is only available in the crystal hollows!`)
        return
    }

    if (structure == undefined || !(structure.toLowerCase() == "throne" || structure.toLowerCase() == "spiral"))
    {
        ChatLib.chat(`${PREFIX}&cPlease enter the structure you wish to claim! (&3throne&c or &3spiral&c)`)
        return
    }
    
    axios.get(`https://ninjune.dev/api/claim?type=${structure}&lobby=${constants.serverData.server}&method=auth&username=${Player.getName()}&serverID=${serverId}`)
    .then(res => {
        if(res.data.success)
            ChatLib.chat(`${PREFIX}&aSuccessfully claimed ${constants.serverData.server} as your server!`)
        else
        {   
            ChatLib.chat(`${PREFIX}&cError: ${res.data.reason}.`)
            if(res.data.code == 501)
            {
                ChatLib.chat(`${PREFIX}&cError: Not logged into the auth server. Try running the command again.`)
                Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
            }
        }
    })
    .catch(err => {
        ChatLib.chat(`${PREFIX}&cError: ${err}`)
    })
    
}

register('gameLoad', (event) => {
    Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
})

register('worldLoad', () => {
    if(!settings.claiming) return
    axios.get(`https://ninjune.dev/api/unclaim?method=auth&username=${Player.getName()}&serverID=${serverId}`)
    .then(res => {
        if(settings.debug && !res.data.success)
            ChatLib.chat("Unclaim: " + res.data.reason)
            if(res.data.code == 501)
                Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
    })
    .catch(err => {
        if(settings.debug)
            ChatLib.chat(`${PREFIX}&cError: ${err}`)
    })
    // unclaims the lobby, isn't needed but will allow another player to claim lobby after claimer leaves.
    setTimeout(() => {
        const NetHandlerPlayClient = Client.getConnection(),
         PlayerMap = NetHandlerPlayClient.func_175106_d()  // getPlayerInfoMap
        
        if(settings.debug) console.log(constants.serverData.server)
        axios.get(`https://ninjune.dev/api/claim?claimedlobby=${constants.serverData.server}`)
        .then(res => {
            if(res.data.claimed)
            {
                PlayerMap.filter(player => player.func_178853_c() /* getResponseTime */ > 0 && !player.func_178845_a()/* getGameProfile */.name.startsWith("!")).forEach((PlayerMP) => {
                    let player = PlayerMP.func_178845_a()/* getGameProfile */.name

                    res.data.structures.forEach((structure) => {
                        if (player == structure.player)
                            ChatLib.chat(`${PREFIX}&cThe ${structure.structure} in ${structure.server} is claimed by ${structure.player}.`) 
                            //holy im so good at naming things, structure.structure I must be a genius.
                    })
                })
            }
        })
        .catch(err => {
            if(!settings.debug) return
            ChatLib.chat(`${PREFIX}&cError: ${err}`)
        })
    }, 2000)
})