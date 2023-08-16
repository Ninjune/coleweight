import constants from "../util/constants"
import { registerCommand } from "../commandManager"

registerCommand({
    aliases: ["setkey"],
    description: "Sets Hypixel API key.",
    options: "(key)",
    category: "settings",
    execute: (args) => {
        if(args[1] == undefined) { ChatLib.chat(`${constants.PREFIX}&eRequires an argument!`); return; }
        let key = args[1]

        ChatLib.chat(`${constants.PREFIX}&aSuccsessfully set api key!`)
        constants.data.api_key = key
        constants.data.save()
    }
})