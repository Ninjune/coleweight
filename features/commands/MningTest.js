import { PREFIX, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["miningtest", "test"],
    description: "Resets guis related to mining tests.",
    options: "",
    category: "miscellaneous",
    execute: (args) => {
        ChatLib.command("cw reload all", true)
        ChatLib.command("soopyclearminingprofit", true)
        ChatLib.chat(`${PREFIX}&bGuis reloaded! Make sure to check your drill fuel!`)
    }
})