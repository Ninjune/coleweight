import constants from "../../util/constants"
import { hotmCalc } from "./hotmCalc"
import { calcSpeed } from "./calcSpeed"
import { tickCommand } from "./tick"
import { helpCommand } from "../help"
const PREFIX = constants.PREFIX


export function calculate(args)
{
    switch(args[0].toLowerCase())
    {
        case "hotm":
        case "hotmcalc":
        case "calchotm":
            hotmCalc(args[1], args[2], args[3])
            break
        case "tick":
            tickCommand(args[1], args[2])
            break
        case "calcspeed":
        case "speed":
            calcSpeed(args[1])
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

