import axios from '../axios'
import { help } from "./commands/help.js"
import { reload } from "./commands/reload.js"
import { setkey } from "./commands/setkey.js"
import { spiral } from "./commands/spiral.js"
import { throne } from "./commands/throne.js"
import { toggle } from "./commands/toggle.js"
import { leaderboard } from "./commands/leaderboard.js"
import { update } from './commands/update'
import constants from './util/constants.js'
import updater from './util/updater'

const PREFIX = constants.PREFIX

register("command", (arg, arg2, arg3) => {
    switch(arg)
    {
        case "setkey": 
            setkey(arg2)
            break
        case "help":
            help()
            break
        case "gui":
            constants.cwGui.open();
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
        default:
            ChatLib.chat(`${constants.PREFIX}Finding Coleweight!`)
            let username = ""
            if(arg == undefined) 
                username = Player.getUUID()
            else 
                username = arg 
            axios.get(`https://ninjune.dev/api/coleweight?username=${username}`)
                .then(res => {
                    let coleweightMessage = new TextComponent(`${constants.PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%)`)
                        .setHoverValue(`&fExperience&f: &a${res.data.exp}\n&fPowder&f: &a${res.data.pow}\n&fCollection&f: &a${res.data.col}\n&fMiscellaneous&f: &a${res.data.bes + res.data.nuc}`)
                    ChatLib.chat(coleweightMessage)
                })
                .catch(err => {
                    ChatLib.chat(`${PREFIX}&eError. (api may be down)`)
                })
    }
}).setTabCompletions((args) => {
    let output = [],
     commands = ["setkey", "help", "gui", "toggle", "throne", "spiral", "reload", "leaderboard"]
    
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
    if(arg == undefined) { ChatLib.chat(`${PREFIX}&eRequires a username!`); return; }
    axios.get(`https://api.ashcon.app/mojang/v2/user/${arg}`)
        .then(res => {
            let uuid = res.data.uuid;
            axios.get(`https://api.hypixel.net/player?key=${constants.data.api_key}&uuid=${uuid}`)
            .then(res2 => {
                let discordMessage = new TextComponent(`${PREFIX}&a${res.data.username}'s Discord: `)
                ChatLib.chat(discordMessage);
                ChatLib.chat(`&b${res2.data.player.socialMedia.links.DISCORD}`)
            })
            .catch(err => {
                ChatLib.chat(`${PREFIX}&eNo discord linked :( (or no key linked)`)
            })
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eInvalid name! `)
        });
}).setTabCompletions((args) => {
    let players = World.getAllPlayers().map((p) => p.getName())
    .filter((n) =>
      n.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : "")
    )
    .sort(),
     output = players
        
    return output
}).setName("fetchdiscord").setAliases(["fdiscord"]);