import { registerCommand } from "../commandManager"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
const File = Java.type("java.io.File")


registerCommand({ // should be used to clean up files after version changes
    aliases: ["delete"],
    description: "Deletes a file in Coleweight.",
    options: "(path)",
    category: "miscellaneous",
    showInHelp: false,
    execute: (args) => {
        const file = new File(Config.modulesFolder + "/Coleweight/" + args[1])
        const chat = args[2] ?? "1"

        if(file.exists())
        {
            if(file.delete() && chat == "1")
                ChatLib.chat(`${PREFIX}&bDeleted '${args[1]}'!`)
            else if (chat)
                ChatLib.chat(`${PREFIX}&cWas unable to delete ${args[1]}! (but the file exists)`)
        }
    }
})