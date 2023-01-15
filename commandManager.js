import { openTimerGui } from "./render/guis/timerGui.js"
import { openPowderGui } from "./render/guis/powertrackerGui"
import { openCoordsGui } from "./render/guis/coordsGui.js"
import { openDowntimeGui } from "./render/guis/downtimeGui.js"
import { openCwGui, reloadColeweight } from "./render/guis/cwGui"
import { openCollectionGui, reloadCollection, trackCollection } from "./render/guis/collectionGui"
import { help } from "./commands/help"
import { setkey } from "./commands/setkey"
import { leaderboard } from "./commands/leaderboard"
import { update } from "./commands/update"
import { fetchDiscord } from "./commands/fetchDiscord"
import { findColeweight } from "./commands/findColeweight"
import { time } from "./commands/time"
import { info } from "./commands/info"
import { credits } from "./commands/credits"
import Settings from "./settings"
import constants from "./util/constants"
import { clearLobbies } from "./commands/markingLobbies"
import { calculate } from "./commands/calculate/calculate.js"
import { openMiningAbilitiesGui } from "./render/miningAbilities.js"
import { spiral } from "./commands/coords/spiral"
import { throne } from "./commands/coords/throne"
import { divans } from "./commands/coords/divans"
import { yog } from "./commands/coords/yog"
import { automatons } from "./commands/coords/automatons"
import { temple } from "./commands/coords/temple.js"
import { drawLine } from "./commands/drawLine.js"


register("command", (...args) => {
    if (args[0] == undefined) {Settings.openGUI(); return}
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
            if(args[1] == undefined)
                return ChatLib.chat(`${constants.PREFIX}&cMust specify a gui. Hit tab on '/cw reload ' for options.`)
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
        case "lb":
        case "top":
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
        case "automaton":
        case "automatons":
            automatons(args[1])
            break
        case "temple":
            temple(args[1])
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
        case "drawline":
            drawLine(args)
            break
        default:
            findColeweight(args[0])
    }
}).setTabCompletions((args) => {
    let output = [],
     reloadOptions = ["coleweight", "collection"],
     calculateOptions = ["tick", "ms2toprofessional", "hotm", "calchotm"],
     commands = ["setkey", "help", "move", "toggle", "throne", "spiral", "reload", "leaderboard", 
        "settings", "time", "info", "clearlobbies", "yog", "divan", "automatons", "temple", "coords", "credits", "track", "calculate", "drawline"]
    
    if(args[0].length == 0 || args[0] == undefined)
        return output = commands

    switch(args[0])
    {
        case "reload":
            output = findTabOutput(args[1], reloadOptions)
            break
        case "calculate":
        case "calc":
            output = findTabOutput(args[1], calculateOptions)
            break
        default:
            output = findTabOutput(args[0], commands)
            break
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

function findTabOutput(input, options)
{
    let output = []

    if(input == undefined || input == "") return options
    options.forEach(option => {
        for(let char = 0; char < input.length; char++)
        {
            if(option[char] != input[char])
                break
            else if(char == input.length - 1)
                output.push(option)
        }
    })

    return output
}