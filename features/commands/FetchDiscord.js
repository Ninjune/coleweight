import settings from "../../settings";
import request from "../../../requestV2"
import { PREFIX, data, registerCommands } from "../../utils/Utils";

registerCommands({
    aliases: ["fetchdiscord"],
    description: "Finds the discord of a Hypixel player. (if linked to Hypixel)",
    options: "(IGN)",
    category: "miscellaneous",
    execute: (args) => {
        let username = args[1]

        if(!username) return ChatLib.chat(`${PREFIX}&eRequires a username!`)

        request({
            url: `https://api.mojang.com/users/profiles/minecraft/${username}`,
            json: true
        })
        .then((mojangRes) => {
            request({
                url: `https://api.hypixel.net/player?key=${data.api_key}&uuid=${mojangRes.id}`,
                json: true
            })
            .then((hypixelRes) => {
                let discordMessage = new TextComponent(`${PREFIX}&a${mojangRes.name}'s Discord: `)
                ChatLib.chat(discordMessage)
                ChatLib.chat(`&b${hypixelRes.player.socialMedia.links.DISCORD}`)
            })
            .catch(err => {
                ChatLib.chat(`${PREFIX}&eNo discord linked :( (or no key linked)${settings.debug ? " " + err : ""}`)
            })
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eInvalid name! ${err}`)
        })
    }
})