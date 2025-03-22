/* Depreciated
import { registerCommand } from "../commandManager"
import constants from "../util/constants"

registerCommand({
    aliases: ["miningtest"],
    description: "Resets guis related to mining tests.",
    options: "",
    category: "miscellaneous",
    execute: (args) => {
        ChatLib.command("cw reload all", true)
        ChatLib.command("soopyclearminingprofit", true)
        ChatLib.chat(`${constants.PREFIX}&bGuis reloaded! Make sure to check your drill fuel!`)
    }
})*/