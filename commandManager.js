import { help } from "./commands/help.js"
import { reload } from "./commands/reload.js"
import { setkey } from "./commands/setkey.js"
import { spiral } from "./commands/spiral.js"
import { throne } from "./commands/throne.js"
import { toggle } from "./commands/toggle.js"
import { leaderboard } from "./commands/leaderboard.js"
import { update } from './commands/update'
import { openCwGui } from './gui/cwGui'
import { fetchDiscord } from './commands/fetchDiscord'
import { findColeweight } from './commands/findColeweight'
import Settings from "./gui/settingsGui"

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
            openCwGui()
            break
        case "toggle":
            toggle()
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
        case "settings":
            Settings.openGUI()
            break
        default:
            findColeweight(arg)
    }
}).setTabCompletions((args) => {
    let output = [],
     commands = ["setkey", "help", "move", "toggle", "throne", "spiral", "reload", "leaderboard", "settings"]
    
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
    .sort(),
     output = players
        
    return output
}).setName("fetchdiscord").setAliases(["fdiscord"]);