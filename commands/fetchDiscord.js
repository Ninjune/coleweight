import axios from "../../axios"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

module.exports =
{ 
    aliases: ["fetchdiscord"],
    description: "Finds the discord of a Hypixel player. (if linked to Hypixel)",
    options: "(IGN)",
    category: "miscellaneous",
    cw: false,
    execute: (args) => {
        if(args[0] == undefined) { ChatLib.chat(`${PREFIX}&eRequires a username!`); return }

        axios.get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
        .then(mojangRes => {
            let uuid = mojangRes.data.id
            axios.get(`https://api.hypixel.net/player?key=${constants.data.api_key}&uuid=${uuid}`)
            .then(hypixelRes => {
                let discordMessage = new TextComponent(`${PREFIX}&a${mojangRes.data.name}'s Discord: `)
                ChatLib.chat(discordMessage);
                ChatLib.chat(`&b${hypixelRes.data.player.socialMedia.links.DISCORD}`)
            })
            .catch(err => {
                ChatLib.chat(`${PREFIX}&eNo discord linked :( (or no key linked)`)
            })
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eInvalid name! `)
        })
    }
}