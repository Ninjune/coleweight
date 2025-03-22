import settings from "./settings"
import constants from "./util/constants"

let commands = [],
 commandNames = [],
 helpCommands = {info: [], settings: [], waypoints: [], miscellaneous: []}


export function registerCommand(command)
{
    commands.push(command)
    commandNames.push(command.aliases[0])
    if(command.showInHelp ?? true)
        helpCommands[command.category].push({name: command.aliases[0], description: command.description, options: command.options})
}

export default helpCommands

register("command", (...args) => {
    let stop = false
    if (args == undefined || args[0] == undefined) { settings.openGUI(); return }

    commands.forEach(command => {
        if((command.cw ?? true) && command.aliases.includes(args[0].toString().toLowerCase()))
        {
            command.execute(args)
            stop = true
        }
    })

    if(!stop) ChatLib.chat(`${constants.PREFIX}&bUnknown command. Type "/cw help" to see all commands.`)
}).setTabCompletions((args) => {
    let output = []

    if(args[0].length == 0 || args[0] == undefined)
        return commandNames

    if(args[1] == undefined)
        output = findTabOutput(args[0], commandNames)

    commands.forEach(command => {
        if(command.aliases.includes(args[0].toLowerCase()) && command.subcommands != undefined)
        {
            for(let i = 0; i < command.subcommands.length && i <= args.length-1; i++)
                output = findTabOutput(args[i+1], command.subcommands[i])
        }
    })

    if(output.length == 0)
        output = findTabOutput(args[0], commandNames)

    return output
}).setName("cw").setAliases(["coleweight"])


register("command", (...args) => {
   ChatLib.command(`cw fetchdiscord ${args[0]}`, true)
}).setTabCompletions((args) => {
    let players = World.getAllPlayers().map((p) => p.getName())
    .filter((n) =>
        n.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : "")
    )
    .sort()

    return players
}).setName("fetchdiscord").setAliases(["fdiscord"])


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

// command registering
import "./commands/coords/automatons"
import "./commands/coords/divans"
import "./commands/coords/spiral"
import "./commands/coords/temple"
import "./commands/coords/throne"
import "./commands/coords/yog"

import "./commands/calculate.js"
import "./commands/config"
import "./commands/coords.js"
import "./commands/credits"
import "./commands/cw"
import "./commands/deleteroute"
import "./commands/drawLine"
import "./commands/fetchDiscord"
import "./commands/gemstone"
import "./commands/help"
import "./commands/import"
import "./commands/info"
import "./commands/leaderboard"
import "./commands/markingLobbies"
//import "./commands/miningtest"
import "./commands/move"
import "./commands/optimize"
import "./commands/ordered"
import "./commands/quickswitch"
import "./commands/rankcolor"
import "./commands/reload"
import "./commands/resetabilities"
import "./commands/setkey"
import "./commands/stopwatch"
import "./commands/structure"
import "./commands/timer"
//import "./commands/track"
import "./commands/waypoints"
import "./commands/test.js"