import { PREFIX, data, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["timer", "time"],
    description: "Sets timer.",
    category: "miscellaneous",
    options: ["(set, show)"],
    subcommands: [["set", "show"]],
    execute: (args) => {
        let timer = data.timerGui.timer
        if(!args[1]) return ChatLib.chat(`${PREFIX}&bOptions are: &3set&b, &3show&b.`)

        if(args[1].toLowerCase() == "set")
        {
            if(!args[2] == undefined) timer = 0

            else if(args[2].includes("h"))
                timer = parseInt(args[2])*60*60 ?? 0
            else if(args[2].includes("m"))
                timer = parseInt(args[2])*60 ?? 0
            else
                timer = parseInt(args[2]) ?? 0

            data.timerTitlePlay = true
            ChatLib.chat(`${PREFIX}&bSet timer to ${Math.floor(timer/60)}m ${Math.ceil(timer%60)}s`)
        }
        else if (args[1].toLowerCase() == "show")
            ChatLib.chat(`${PREFIX}&b${Math.floor(timer/60)}m ${Math.ceil(timer%60)}s`)
        else
            return ChatLib.chat(`${PREFIX}&bOptions are: &3set&b, &3show&b`)


        data.timerGui.timer = timer
        data.save()
    }
})