import { registerCommand } from "../commandManager"
import constants from "../util/constants"
constants.data.tickStopwatch = false


export default registerCommand({
    aliases: ["stopwatch"],
    description: "Stopwatch.",
    category: "miscellaneous",
    options: ["(set, reset, show, pause, unpause)"],
    subcommands: [["set", "reset", "show", "pause", "unpause"]],
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bOptions are: &3set&b, &3reset&b, &3show&b, &3pause&b.`)
        if(args[1].toLowerCase() == "set")
        {
            if(args[2] == undefined)
                constants.data.stopwatchGui.stopwatch = 0
            else if(args[2].includes("h"))
                constants.data.stopwatchGui.stopwatch = parseInt(args[2])*60*60 ?? 0
            else if(args[2].includes("m"))
                constants.data.stopwatchGui.stopwatch = parseInt(args[2])*60 ?? 0
            else
                constants.data.stopwatchGui.stopwatch = parseInt(args[2]) ?? 0

            constants.data.tickStopwatch = true
            ChatLib.chat(`${constants.PREFIX}&bSet stopwatch to ${Math.floor(constants.data.stopwatchGui.stopwatch/60)}m ${Math.ceil(constants.data.stopwatchGui.stopwatch)}s`)
        }
        else if (args[1].toLowerCase() == "reset")
        {
            constants.data.stopwatchGui.stopwatch = 0
            constants.data.tickStopwatch = true

            ChatLib.chat(`${constants.PREFIX}&bReset stopwatch.`)

        }
        else if (args[1].toLowerCase() == "show")
            ChatLib.chat(`${constants.PREFIX}&b${Math.floor(constants.data.stopwatchGui.stopwatch/60)}m ${Math.ceil(constants.data.stopwatchGui.stopwatch)}s`)
        else if (args[1].toLowerCase() == "pause" || args[1].toLowerCase() == "unpause")
        {
            constants.data.tickStopwatch = !constants.data.tickStopwatch

            ChatLib.chat(`${constants.PREFIX}&bPaused stopwatch.`)
        }

        constants.data.save()
    }
})