import constants from "../util/constants"
const PREFIX = constants.PREFIX


module.exports =
{ 
    aliases: ["credits"],
    description: "Credits.",
    options: "",
    category: "miscellaneous",
    showInHelp: false,
    execute: (args) => {
        ChatLib.chat(`${PREFIX}&bCW was made by NinOnCubed (Ninjune#0670).`)
    }
}