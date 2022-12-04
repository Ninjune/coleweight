import { openTimerGui } from "./render/timerGui.js"
import { openPowderGui } from "./render/powertrackerGui"
import { openCoordsGui } from "./render/coordsGui.js"
import { openDowntimeGui } from "./render/downtimeGui.js"
import { openCwGui, reload } from "./render/cwGui"
import { help } from "./commands/help"
import { setkey } from "./commands/setkey"
import { spiral } from "./commands/spiral"
import { throne } from "./commands/throne"
import { yog } from "./commands/yog"
import { leaderboard } from "./commands/leaderboard"
import { update } from "./commands/update"
import { fetchDiscord } from "./commands/fetchDiscord"
import { findColeweight } from "./commands/findColeweight"
import { claim } from "./commands/claim"
import { tick } from "./commands/tick"
import { time } from "./commands/time"
import { info } from "./commands/info"
import Settings from "./settings"
import constants from "./util/constants"
import { clearLobbies } from "./commands/markingLobbies"
import { divans } from "./commands/divans.js"

register("command", (arg, arg2, arg3) => {
    if (arg == undefined) {findColeweight(arg); return}
    switch(arg.toLowerCase())
    {
        case "setkey":
            setkey(arg2)
            break
        case "help":
            help()
            break
        case "move":
            if (arg2 == undefined) {ChatLib.chat(`${constants.PREFIX}&cNot enough arguments.`); return}
            switch(arg2.toLowerCase())
            {
                case "coleweight":
                    openCwGui()
                    break
                case "powdertracker":
                    openPowderGui()
                    break
                case "time":
                case "timer":
                    openTimerGui()
                    break
                case "downtime":
                    openDowntimeGui()
                    break
                default:
                    ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${arg2}'.`)
            }
            break
        case "throne":
            throne(arg2)
            break
        case "spiral":
            spiral(arg2)
            break
        case "reload":
            reload()
            break
        case "leaderboard":
            leaderboard(arg2, arg3)
            break
        case "update":
            update()
            break
        case "config":
        case "settings":
            Settings.openGUI()
            break
        case "claim":
            claim(arg2)
            break
        case "powdertrackersync":
            updateDisplay()
            break
        case "tick":
            tick(arg2, arg3)
            break
        case "time":
            time()
            break
        case "info":
            info()
            break
        case "clearlobbies":
            clearLobbies()
            break
        case "yog":
            yog(arg2)
            break
        case "divans":
        case "divan":
            divans(arg2)
            break
        case "coord":
        case "coords":
            openCoordsGui()
            break
        default:
            findColeweight(arg)
    }
}).setTabCompletions((args) => {
    let output = [],
     commands = ["setkey", "help", "move", "toggle", "throne", "spiral", "reload", "leaderboard", 
      "settings", "claim", "tick", "time", "info", "clearlobbies", "yog", "divan", "coords"]
    
    if(args[0].length == 0 || args[0] == undefined)
        output = commands
    else
    {
        for(let i = 0; i < commands.length; i++)
        {
            for(let j = 0; j < args[0].length; j++)
            {
                if(commands[i][j] != args[0][j])
                    break
                else if(j == args[0].length - 1)
                    output.push(commands[i])
            }
        }
    }
    return output
}).setName("cw").setAliases(["coleweight"])

register("command", (arg) => {
    fetchDiscord(arg)
}).setTabCompletions((args) => {
    let players = World.getAllPlayers().map((p) => p.getName())
    .filter((n) =>
      n.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : "")
    )
    .sort()
        
    return players
}).setName("fetchdiscord").setAliases(["fdiscord"]);