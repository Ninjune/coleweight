import { openTimerGui } from "./render/timerGui.js"
import { openPowderGui } from "./render/powertrackerGui"
import { openCoordsGui } from "./render/coordsGui.js"
import { openDowntimeGui } from "./render/downtimeGui.js"
import { openCwGui, reloadColeweight } from "./render/cwGui"
import { openCollectionGui, reloadCollection, trackCollection } from "./render/collectionGui"
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
import { time } from "./commands/time"
import { info } from "./commands/info"
import { credits } from "./commands/credits"
import Settings from "./settings"
import constants from "./util/constants"
import { clearLobbies } from "./commands/markingLobbies"
import { divans } from "./commands/divans.js"
import { calculate } from "./commands/calculate/calculate.js"
import { openMiningAbilitiesGui } from "./render/miningAbilities.js"

register("command", (...args) => {
    console.log(args[0])
    if (args[0] == undefined) {findColeweight(args[0]); return}
    switch(args[0].toString().toLowerCase())
    {
        case "setkey":
            setkey(args[1])
            break
        case "help":
            help()
            break
        case "move":
            if (args[1] == undefined) {ChatLib.chat(`${constants.PREFIX}&cNot enough arguments.`); return}
            switch(args[1].toLowerCase())
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
                case "collection":
                    openCollectionGui()
                    break
                case "miningabilities":
                    openMiningAbilitiesGui()
                    break
                default:
                    ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${arg2}'.`)
            }
            break
        case "throne":
            throne(args[1])
            break
        case "spiral":
            spiral(args[1])
            break
        case "reload":
            switch(args[1].toLowerCase())
            {
                case "coleweight":
                    reloadColeweight()
                    break
                case "collection":
                    reloadCollection()
                    break
                default:
                    ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${args[1]}'.`)
            }
            break
        case "leaderboard":
            leaderboard(args[1], args[2])
            break
        case "update":
            update()
            break
        case "config":
        case "settings":
            Settings.openGUI()
            break
        case "claim":
            claim(args[1])
            break
        case "powdertrackersync":
            updateDisplay()
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
            yog(args[1])
            break
        case "divans":
        case "divan":
            divans(args[1])
            break
        case "coord":
        case "coords":
            openCoordsGui()
            break
        case "credits":
            credits()
            break
        case "track":
            trackCollection(args[1])
            break
        case "calc":
        case "calculate":
            calculate(args.slice(1))
            break
        default:
            findColeweight(args[0])
    }
}).setTabCompletions((args) => {
    let output = [],
     calculateOptions = ["tick", "ms2toprofessional", "hotmcalc", "calchotm"],
     commands = ["setkey", "help", "move", "toggle", "throne", "spiral", "reload", "leaderboard", 
        "settings", "claim", "time", "info", "clearlobbies", "yog", "divan", "coords", "credits", "track", "calculate"]
    
    if(args[0].length == 0 || args[0] == undefined)
        return output = commands

    if(args[0] == "calc" || args[0] == "calculate")
    {
        if(args[1] == undefined) output = calculateOptions

        else
        {
            calculateOptions.forEach(calculateOption => {
                for(let char = 0; char < args[1].length; char++)
                {
                    if(calculateOption[char] != args[1][char])
                        break
                    else if(char == args[1].length - 1)
                        output.push(calculateOption)
                }
            })
        }
    }
    else
    {
        
        if(args[0] == undefined) output = commands

        else
        {
            commands.forEach(command => {
                for(let char = 0; char < args[0].length; char++)
                {
                    if(command[char] != args[0][char])
                        break
                    else if(char == args[0].length - 1)
                        output.push(command)
                }
            })
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