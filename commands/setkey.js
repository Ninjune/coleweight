import constants from "../util/constants"
import axios from "../../axios"
import { registerCommand } from "../commandManager"
const PREFIX = constants.PREFIX

registerCommand({
    aliases: ["setkey"],
    description: "Sets Hypixel API key.",
    options: "(key)",
    category: "settings",
    execute: (args) => {
        if(args[1] == undefined) { ChatLib.chat(`${PREFIX}&eRequires an argument!`); return; }
        else key = args[1]

        constants.data.api_key = key
        constants.data.save()
        axios.get(`https://api.hypixel.net/key?key=${constants.data.api_key}`)
        .then(res => {
            if(res.data.success == true)
                ChatLib.chat(`${PREFIX}&aSuccsessfully set api key!`)
            else
                ChatLib.chat(`${PREFIX}&eKey is not valid!`)
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eHypixel API is down (or key is wrong). if this is a mistake report: ${err}`)
        })
    }
})