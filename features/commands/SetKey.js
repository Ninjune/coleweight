import { PREFIX, data, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["setkey"],
    description: "Sets Hypixel API key.",
    options: "(key)",
    category: "settings",
    execute: (args) => {
        if(!args[1]) return ChatLib.chat(`${PREFIX}&eRequires an argument!`)
        
        let key = args[1]

        ChatLib.chat(`${PREFIX}&aSuccsessfully set api key!`)
        data.api_key = key
        data.save()
    }
})