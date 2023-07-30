import { findColeweight, registerCommands } from "../../utils/Utils";

registerCommands({
    aliases: ["find"],
    description: "Gets the Coleweight of specified user.",
    options: "[player]",
    category: "info",
    execute: (args) => {
        findColeweight(args[1])
    }
})