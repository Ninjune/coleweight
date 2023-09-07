import { PREFIX, data, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["stopwatch"],
    description: "Stopwatch.",
    category: "miscellaneous",
    options: ["(set, reset, show, pause, unpause)"],
    subcommands: [["set", "reset", "show", "pause", "unpause"]],
    execute: (args) => {
        if(!args[1])
            return ChatLib.chat(`${PREFIX}&bOptions are: &3set&b, &3reset&b, &3show&b, &3pause&b.`)
        if(args[1].toLowerCase() == "set")
        {
            if(!args[2])
                data.stopwatchGui.stopwatch = 0
            else if(args[2].includes("h"))
                data.stopwatchGui.stopwatch = parseInt(args[2])*60*60 ?? 0
            else if(args[2].includes("m"))
                data.stopwatchGui.stopwatch = parseInt(args[2])*60 ?? 0
            else
                data.stopwatchGui.stopwatch = parseInt(args[2]) ?? 0

            data.tickStopwatch = true
            ChatLib.chat(`${PREFIX}&bSet stopwatch to ${Math.floor(data.stopwatchGui.stopwatch/60)}m ${Math.ceil(data.stopwatchGui.stopwatch)}s`)
        }
        else if (args[1].toLowerCase() == "reset")
        {
            data.stopwatchGui.stopwatch = 0
            data.tickStopwatch = true

            ChatLib.chat(`${PREFIX}&bReset stopwatch.`)

        }
        else if (args[1].toLowerCase() == "show")
            ChatLib.chat(`${PREFIX}&b${Math.floor(data.stopwatchGui.stopwatch/60)}m ${Math.ceil(data.stopwatchGui.stopwatch)}s`)
        else if (args[1].toLowerCase() == "pause" || args[1].toLowerCase() == "unpause")
        {
            data.tickStopwatch = !data.tickStopwatch

            ChatLib.chat(`${PREFIX}&bPaused stopwatch.`)
        }

        data.save()
    }
})