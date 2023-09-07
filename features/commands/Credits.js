import { PREFIX, registerCommands } from "../../utils/Utils";

registerCommands({
    aliases: ["credits"],
    description: "Credits.",
    options: "",
    category: "miscellaneous",
    showInHelp: false,
    execute: (args) => {
        ChatLib.chat(`${PREFIX}&bCW was made by NinOnCubed (Ninjune#0670).`)
    }
})