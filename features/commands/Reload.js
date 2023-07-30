import guis from "../../utils/GuIManager"
import { PREFIX, registerCommands } from "../../utils/Utils"

const subcommands = []

guis.forEach((gui) => {
    if(gui.reloadCallback != undefined)
        subcommands.push(gui.aliases[1])
})

registerCommands({
    aliases: ["reload"],
    description: "Reloads guis.",
    options: "(gui)",
    category: "settings",
    subcommands: [subcommands],
    execute: (args) => {
        if(!args[1]) return ChatLib.chat(`${PREFIX}&cMust specify a gui. Hit tab on '/cw reload ' for options.`)

        let all = false
        let found = false

        if(args[1].toLowerCase() == "all")
            all = true

        guis.forEach(gui => {
            if((gui.aliases.includes(args[1].toLowerCase()) || all) && gui.reloadCallback != undefined) {
                gui.reloadCallback()
                found = true
            }
        })

        if(!found) ChatLib.chat(`${PREFIX}&cNo such gui as '${args[1]}'.`)
    }
})