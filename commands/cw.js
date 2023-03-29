import { registerCommand } from "../commandManager"
import { findColeweight } from "../util/helperFunctions"


registerCommand({
    aliases: ["find"],
    description: "Gets the Coleweight of specified user.",
    options: "[player]",
    category: "info",
    execute: (args) => {
        findColeweight(args[1])
    }
})