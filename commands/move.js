import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import guis from "../guiManager"
const subcommands = []
guis.forEach((gui) => {
    subcommands.push(gui.aliases[0])
})

registerCommand({
    aliases: ["move"],
    description: "Move guis.",
    options: "(gui)",
    category: "miscellaneous",
    showInHelp: false,
    subcommands: [subcommands],
    execute: (args) => {
        if (args[1] == undefined) {ChatLib.chat(`${constants.PREFIX}&cNot enough arguments.`); return}
        let found = false

        guis.forEach(gui => {
            if(gui.aliases.map(alias => alias.toLowerCase()).includes(args[1].toLowerCase()))
            {
                gui.open()
                found = true
            }
        })

        if(!found)
            ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${args[1]}'.`)
    }
})