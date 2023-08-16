import { registerCommand } from "../commandManager"
import constants from "../util/constants"

registerCommand({ // should be used to clean up files after version changes
    aliases: ["delete"],
    description: "Deletes a file in Coleweight.",
    options: "(path)",
    category: "miscellaneous",
    showInHelp: false,
    execute: (args) => {
        //deleteFile(args[1])
    }
})