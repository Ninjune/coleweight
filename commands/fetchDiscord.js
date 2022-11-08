import axios from "../../axios"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function fetchDiscord(arg)
{
    if(arg == undefined) { ChatLib.chat(`${PREFIX}&eRequires a username!`); return }

    axios.get(`https://api.ashcon.app/mojang/v2/user/${arg}`)
        .then(res => {
            let uuid = res.data.uuid
            axios.get(`https://api.hypixel.net/player?key=${constants.data.api_key}&uuid=${uuid}`)
            .then(res2 => {
                let discordMessage = new TextComponent(`${PREFIX}&a${res.data.username}'s Discord: `)
                ChatLib.chat(discordMessage);
                ChatLib.chat(`&b${res2.data.player.socialMedia.links.DISCORD}`)
            })
            .catch(err => {
                ChatLib.chat(`${PREFIX}&eNo discord linked :( (or no key linked)`)
            })
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eInvalid name! `)
        })
}

