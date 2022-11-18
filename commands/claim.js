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
        if(settings.debug) console.log(constants.serverData.server)
        axios.get(`https://ninjune.dev/api/claim?claimedlobby=${constants.serverData.server}`)
        .then(res => {
            if(res.data.claimed)
            {
                ChatLib.chat("here")
                World.getAllPlayers().forEach((player) => {
                    res.data.structures.forEach((structure) => {
                        if (player.getName() == structure.player)
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

register('worldUnload', () => {
    axios.get(`https://ninjune.dev/api/unclaim?claimedlobby=${constants.serverData.server}&key=${constants.data.api_key}`) 
    // unclaims the lobby, isn't needed but will allow another player to claim lobby after claimer leaves. key used to verify identity of unclaimer.
})