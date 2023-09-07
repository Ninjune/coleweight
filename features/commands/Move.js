import guis from "../../utils/GuIManager"
import { PREFIX, registerCommands } from "../../utils/Utils"

const subcommands = []

guis.forEach((gui) => {
    subcommands.push(gui.aliases[0])
})

registerCommands({
    aliases: ["move"],
    description: "Move guis.",
    options: "(gui)",
    category: "miscellaneous",
    showInHelp: false,
    subcommands: [subcommands],
    execute: (args) => {
        if(!args[1]) return ChatLib.chat(`${PREFIX}&cNot enough arguments.`)
        
        let found = false

        guis.forEach(gui => {
            if(gui.aliases.map(alias => alias.toLowerCase()).includes(args[1].toLowerCase())){
                gui.open()
                found = true
            }
        })

        if(!found) ChatLib.chat(`${PREFIX}&cNo such gui as '${args[1]}'.`)
    }
})