import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import guis from "../guiManager"
const subcommands = []
guis.forEach((gui) => {
    if(gui.reloadCallback != undefined)
        subcommands.push(gui.aliases[1])
})

registerCommand({
    aliases: ["reload"],
    description: "Reloads guis.",
    options: "(gui)",
    category: "settings",
    subcommands: [subcommands],
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&cMust specify a gui. Hit tab on '/cw reload ' for options.`)
        let all = false,
            found = false
        if(args[1].toLowerCase() == "all")
            all = true

        guis.forEach(gui => {
            if((gui.aliases.includes(args[1].toLowerCase()) || all) && gui.reloadCallback != undefined)
            {
                gui.reloadCallback()
                found = true
            }
        })

        if(!found)
            ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${args[1]}'.`)
    }
})