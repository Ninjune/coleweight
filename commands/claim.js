import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX


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

    axios.get(`https://ninjune.dev/api/claim?type=${structure}&id=${constants.serverData.server}&key=${constants.data.api_key}`)
    .then(res => {
        if(res.data.success)
            ChatLib.chat(`${PREFIX}&aSuccessfully claimed ${constants.serverData.server} as your server!`)
        else
            ChatLib.chat(`${PREFIX}&cError: ${res.data.reason}`)
    })
    .catch(err => {
        ChatLib.chat(`${PREFIX}&cError: ${err}`)
    })
    // key is used above to verify that the player trying to claim the lobby is the intended player, don't know a better way of doing this.
}


register('worldLoad', () => {
    if(!settings.claiming) return
    setTimeout(() => {
        console.log(constants.serverData.server)
        axios.get(`https://ninjune.dev/api/claim?claimedlobby=${constants.serverData.server}`)
        .then(res => {
            if(res.data.claimed)
            {
                World.getAllPlayers().forEach((player) => {
                    if (player.getName() == res.data.player)
                    ChatLib.chat(`${PREFIX}&cThe ${res.data.structure} in this lobby is claimed by ${res.data.player}.`)
                })
            }
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}Error: ${err}`)
        })
    }, 2000)
})