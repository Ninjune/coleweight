import { registerCommand } from "../commandManager"
import constants from "../util/constants"


export default registerCommand({
    aliases: ["timer", "time"],
    description: "Sets timer.",
    category: "miscellaneous",
    options: ["(set, show)"],
    subcommands: [["set", "show"]],
    execute: (args) => {
        let timer = constants.data.timerGui.timer
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bOptions are: &3set&b, &3show&b.`)
        if(args[1].toLowerCase() == "set")
        {
            if(args[2] == undefined)
                timer = 0
            else if(args[2].includes("h"))
                timer = parseInt(args[2])*60*60 ?? 0
            else if(args[2].includes("m"))
                timer = parseInt(args[2])*60 ?? 0
            else
                timer = parseInt(args[2]) ?? 0

            constants.data.timerTitlePlay = true
            ChatLib.chat(`${constants.PREFIX}&bSet timer to ${Math.floor(timer/60)}m ${Math.ceil(timer%60)}s`)
        }
        else if (args[1].toLowerCase() == "show")
            ChatLib.chat(`${constants.PREFIX}&b${Math.floor(timer/60)}m ${Math.ceil(timer%60)}s`)
        else
            return ChatLib.chat(`${constants.PREFIX}&bOptions are: &3set&b, &3show&b`)


        constants.data.timerGui.timer = timer
        constants.data.save()
    }
})