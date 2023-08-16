import { registerCommand } from "../commandManager"
import axios from "../../axios"
import constants from "../util/constants"

registerCommand({
    aliases: ["mf", "miningfortune", "mfbreakdown"],
    options: "",
    description: "Shows a detailed breakdown of your mining fortune.",
    category: "info",
    execute: (args) => {
        //ChatLib.chat(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${Player.getUUID()}`)
        axios.get(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${Player.getUUID()}`, { headers: {"User-Agent": "Coleweight-requests"} })
        .then(res => {
            res["data"]["profiles"].forEach(profile => {
                if (profile.selected) {
                    ChatLib.chat(profile["cute_name"])
                }
            })
        }).catch(error => {
            console.log(JSON.stringify(error))
            ChatLib.chat(`${constants.PREFIX}&e${error["response"]["data"]["cause"]}`)
        })
    }
})