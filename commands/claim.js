import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
const path = `https://ninjune.dev`
const serverId = java.util.UUID.randomUUID().toString().replace("-", "")
let claimedServers = []


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
    
    axios.get(`${path}/api/claim?type=${structure}&lobby=${constants.serverData.server}&username=${Player.getName()}&serverID=${serverId}`)
    .then(res => {
        if(res.data.success)
        {
            ChatLib.chat(`${PREFIX}&aSuccessfully claimed ${constants.serverData.server} as your server!`)
            claimedServers.push({player: Player.getName(), server: constants.serverData.server, structure: structure})
            return
        }
        else
        {   
            
            if(res.data.code == 501)
            {
                ChatLib.chat(`${PREFIX}&cError: Not logged into the auth server. Try running the command again.`)
                return Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
            }
            else
                return ChatLib.chat(`${PREFIX}&cError: ${res.data.reason}.`)
        }
    })
    .catch(err => {
        return ChatLib.chat(`${PREFIX}&cError: ${err}`)
    })
}


register('gameLoad', (event) => {
    try
    {
        Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
    }
    catch(e) {}
    getClaimed()
})


register('worldLoad', () => {
    if(!settings.claiming) return
    getClaimed()
    setTimeout(() => {
        const NetHandlerPlayClient = Client.getConnection(),
         PlayerMap = NetHandlerPlayClient.func_175106_d()  // getPlayerInfoMap
        let player

        if(settings.debug) console.log(constants.serverData.server)
        
        claimedServers.forEach((claimedServer) => {
            PlayerMap.filter(player => player.func_178853_c() > 0 && !player.func_178845_a().name.startsWith("!")).forEach((PlayerMP) => {
                player = PlayerMP.func_178845_a().name

                if (player == claimedServer.player && claimedServer.server == constants.serverData.server)
                    ChatLib.chat(`${PREFIX}&cThe ${claimedServer.structure} in ${claimedServer.server} is claimed by ${claimedServer.player}.`)
            })

            if (Player.getName() == claimedServer.player)
                {
                    axios.get(`${path}/api/unclaim?username=${Player.getName()}&serverID=${serverId}`)
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
                }
        })
    }, 2000)
})


function getClaimed()
{
    axios.get(`${path}/api/claimed?authServer=${serverId}&passedName=${Player.getName()}`)
    .then(res => {
        if(res.data.code == 501)
        {
            Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
            return
        }
        claimedServers = []
        res.data.forEach(server => {
            claimedServers.push(server)
        })
    })
}
