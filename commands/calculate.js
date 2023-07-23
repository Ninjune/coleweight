import constants from "../util/constants"
import { hotmCalc } from "./calculate/hotmCalc"
import { calcSpeed } from "./calculate/calcSpeed"
import { tickCommand } from "./calculate/tick"
import { registerCommand } from "../commandManager"
import { helpCommand } from "./help"


registerCommand({
    aliases: ["calc", "calculate"],
    description: "Commands for calculating things. Do '/cw calc help'.",
    options: "[help]",
    category: "info",
    subcommands: [["tick", "hotm", "speed"]],
    execute: (args) => {
        switch((args[1] ?? "").toLowerCase())
        {
            case "hotm":
            case "hotmcalc":
            case "calchotm":
                hotmCalc(args[2], args[3], args[4])
                break
            case "tick":
                tickCommand(args[2], args[3])
                break
            case "calcspeed":
            case "speed":
                calcSpeed(args[2])
                break
            case "help":
                ChatLib.chat("&b--------------[ &a&l/cw calculate &b]------------")
                ChatLib.chat("&7(Hover over command to see usage.)")
                helpCommand("calculate tick", "Calculates tick data.", "(mining speed) (('r','jade', etc) || breaking power of block))")
                helpCommand("calculate speed", "Calculates the ratio of mining speed 2 to professional with a certain amount of powder.", "(powder)")
                helpCommand("calculate hotm", "Calculates powder between two levels of a certain perk.", "(perk) (minlevel) [maxlevel]")
                ChatLib.chat("&b------------------------------------------")
                return
            default:
                return ChatLib.chat(constants.CALCULATEERRORMESSAGE)
       }
    }
})