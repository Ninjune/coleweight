import PogObject from "PogData"
import Promise from "../../PromiseV2"
import settings from "../settings"
import request from "../../requestV2"
import { getWaypoints } from "./WaypointsLoader"

export const PREFIX = "&2[CW] "
export const invalidArgs = `${PREFIX}&cInvalid arguments. '/cw help' for more information.`
export const CALCULATEERRORMESSAGE = `${PREFIX}&cInvalid arguments. '/cw calculate help' for more information.`

export const data = new PogObject("Coleweight", {
    "api_key": "",
    "professional": 0,
    "jungle_amulet": true,
    "first_time": true,
    "tracked": {},
    "itemStringed": "",
    "museum": [],
    "currentPet": "",
    "effMinerEnabled": false,
    "coleweightGui": {
        "x": 0.5,
        "y": 141,
        "alignment": 0,
        "scale": 1.0
    },
    "powdertrackerGui": {
        "chests": 0,
        "gemstonePowder": 0,
        "mithrilPowder": 0,
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "timerGui": {
        "x": 0,
        "y": 0,
        "timer": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "stopwatchGui": {
        "x": 0,
        "y": 0,
        "stopwatch": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "downtimeGui" : {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "collectionGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "abilityGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "gyroGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "coinGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "ffGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "danceGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    }
}, "config/data.json")

export const waypointRender = (waypoints, yellow=false, numbered=false) => {
    if(waypoints.length < 1) return

    waypoints.forEach((waypoint, index) => {
        Tessellator.drawString(numbered
            ? index+1
            : Math.floor((Math.abs(parseInt(Player.getX()) - waypoint[0]) + Math.abs(parseInt(Player.getY()) - waypoint[1]) + Math.abs(parseInt(Player.getZ()) - waypoint[2]))/3) + "m",
            waypoint[0], waypoint[1], waypoint[2], yellow
            ? 0xFAFD01
            : Renderer.WHITE
            )
    })
}

// i am not will to recode these
// [start]

let commands = []
let commandNames = []
let helpCommands = {info: [], settings: [], waypoints: [], miscellaneous: []}
let coleWeightApi = null

// Changed to registerCommands due to:
// org.mozilla.javascript.EcmaError: TypeError: TypeError: redeclaration of var registerCommand.

export const registerCommands = (command) => {
    commands.push(command)
    commandNames.push(command.aliases[0])
    
    if(command.showInHelp ?? true)
        helpCommands[command.category].push({name: command.aliases[0], description: command.description, options: command.options})
}

register("command", (...args) => {
    if (!args || !args[0]) return settings.openGUI()
    
    let stop = false

    commands.forEach(command => {
        if(!((command.cw ?? true) && command.aliases.includes(args[0].toString().toLowerCase()))) return

        command.execute(args)
        stop = true
    })

    if(!stop) ChatLib.chat(`${PREFIX}&bUnknown command. Type "/cw help" to see all commands.`)

}).setTabCompletions((args) => {
    let output = []

    if(args[0].length == 0 || !args[0])
        return commandNames

    if(!args[1])
        output = findTabOutput(args[0], commandNames)

    commands.forEach(command => {
        if(!command.aliases.includes(args[0].toLowerCase()) || !command.subcommands)
            return
        
        for(let i = 0; i < command.subcommands.length && i <= args.length-1; i++)
            output = findTabOutput(args[i+1], command.subcommands[i])
        
    })

    if(output.length == 0)
        output = findTabOutput(args[0], commandNames)

    return output
}).setName("cw").setAliases(["coleweight"])

register("command", (...args) => {
    ChatLib.command(`cw fetchdiscord ${args[0]}`, true)
}).setTabCompletions((args) => {
    return World.getAllPlayers()
        .filter(filterPlayer => !filterPlayer.getName().includes(" ") && filterPlayer.getPing() === 1 && filterPlayer.getName().toLowerCase().startsWith(args.length ? args[0].toLowerCase() : ""))
        .map(playerMap => playerMap.getName())
        .sort()
}).setName("fetchdiscord").setAliases(["fdiscord"])

export const findTabOutput = (input, options) => {
    let output = []

    if(!input || input == "") return options

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

// [end]

// from my beloved Player module (DocilElm)
export const chat = (msg) => ChatLib.chat(msg)
export const chatid = (msg, id) => new Message(msg).setChatLineId(id).chat()
export const hover = (msg, value) => new TextComponent(msg).setHoverValue(value).chat()
export const breakchat = () => ChatLib.chat(ChatLib.getChatBreak(" "))
export const makeRequest = (url) => request({url: url, headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true})
export const printError = (error) => hover(`${PREFIX}&cError Getting Data`, JSON.stringify(error))
export const addCommas = (num) => num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? num

// from my beloved DocAddons module (DocilElm)
export const isInScoreboard = (str) => Scoreboard.getLines(false).some(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")?.includes(str))
export const isInTab = (str) => TabList.getNames()?.find(names => names.removeFormatting()?.match(/^Area|Dungeons: ([\w\d ]+)$/))?.includes(str)
// bloom core probably has this so i'll just credit bloom for it ig
export const getScoreboard = (descending = false) => Scoreboard.getLines(descending)?.map(line => line?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, ""))

export const findColeweight = (name) => {
    ChatLib.chat(`${PREFIX}Finding Coleweight!`)

    const username = !name ?Player.getUUID() :name

    makeRequest(`https://ninjune.dev/api/coleweight?username=${username}`)
    .then(res => {
        if(res.code != undefined)
            return ChatLib.chat(`${PREFIX}&e${res.error} Code: ${res.code}`)

        let griefer = findGriefer(username), coleweightMessage

        if(griefer.found)
            coleweightMessage = new TextComponent(`${PREFIX}&b${res.rank}. ${res.name}&b's Coleweight: ${res.coleweight} (Top &l${res.percentile}&b%) &c&lHas griefed before. &cLast grief: &a${griefer.dateObj.toString().slice(4, 15)}`)
        else
            coleweightMessage = new TextComponent(`${PREFIX}&b${res.rank}. ${res.name}&b's Coleweight: ${res.coleweight} (Top &l${res.percentile}&b%)`)
        coleweightMessage.setHoverValue(`&fExperience&f: &a${Math.round(res.experience.total*100) / 100}\n&fPowder&f: &a${Math.round(res.powder.total*100) / 100}\n&fCollection&f: &a${Math.round(res.collection.total*100) / 100}\n&fMiscellaneous&f: &a${Math.round(res.miscellaneous.total*100) / 100}`)
        ChatLib.chat(coleweightMessage)
    })
    .catch(err => {
        if(settings.debug) ChatLib.chat(`${PREFIX}&eError. (api may be down) ${err}`)
        else ChatLib.chat(`${PREFIX}&eError. (api may be down)`)
    })
}

let griefers = []
/**
 * Finds if a player is a griefer.
 * @param {string} player
 * @returns
 */
export const findGriefer = (player) =>{
    let grieferReturnObj = {}
    grieferReturnObj.found = false
    griefers.forEach(griefer => {
        griefer.dateObj = new Date(0)
        griefer.dateObj.setUTCMilliseconds(griefer.timestamp)

        if(griefer.name.toLowerCase() == player.toLowerCase())
        {
            grieferReturnObj = griefer
            grieferReturnObj.found = true
        }
    })
    return grieferReturnObj
}

/**
Chats a chat message with specified parameters.
@param {string} command - Command
@param {string} desc - Description
@param {string} usage - Usage
*/
export const helpCommand = (command, desc, usage) => ChatLib.chat(new TextComponent(`&a◆ /cw ${command} => &b${desc}`).setHoverValue(`${"/cw " + command + " " + usage}`))

// From BloomCore
// Upper cases the first letter of each word. Eg "hello world" -> "Hello World"
export const capitalizeFirst = (text) => text.split(" ").map(a => a[0].toUpperCase() + a.slice(1)).join(" ")

export const local = (routes) => {
    ChatLib.chat("")
    ChatLib.chat(ChatLib.getCenteredText("&aLocal routes:"))
    Object.keys(routes).forEach(key => {
        ChatLib.chat(`&b${key}: ${routes[key].desc}`)
    })
    ChatLib.chat("")
    ChatLib.chat(ChatLib.getCenteredText("&aOnline routes:"))
}

export const swap = (arr, first, second) => {
    var temp = arr[first]
    arr[first] = arr[second]
    arr[second] = temp
}

export const load = (route) => {
    let res
    if(!route)
        res = getWaypoints(Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j(), "soopy")
    else
        res = getWaypoints(route, "soopy")
    
    if(res.success)
    {
        orderedWaypoints = res.waypoints
        ChatLib.chat(`${PREFIX}&bLoaded ordered waypoints!`)
    }
    else
        ChatLib.chat(`${PREFIX}&eThere was an error parsing waypoints! ${res.message}`)

    for (let i = 0; i < orderedWaypoints.length-1; i++)
    {
        for (let j = 0; j < orderedWaypoints.length-i-1; j++)
        {
            if (parseInt(orderedWaypoints[j].options.name) >
                parseInt(orderedWaypoints[j+1].options.name))
                swap(orderedWaypoints, j, j+1)
        }
    }

    for(let i = 1; i < orderedWaypoints.length; i++)
        if(parseInt(orderedWaypoints[i]?.options?.name) != i+1)
            ChatLib.chat(`${PREFIX}&bNote: Waypoint ${i+1} is not in the right order or is not a number! Current is: ${parseInt(orderedWaypoints[i]?.options?.name)}`)
}

export const infoCommand = () => {
    let values = {"experience" : "", "powder": "", "collection": "", "miscellaneous": ""}

    if(!coleWeightApi) return printError(" ")

    coleWeightApi.forEach(info => {
        values[info.category] += `&b${addCommas(info.cost)} ${info.nameStringed}\n`
    })

    ChatLib.chat(
    `${PREFIX}&bEach of the following are equivalent to one unit of ColeWeight` +
    "\n&4&lExperience\n" + values.experience +
    "\n&4&lPowder\n" + values.powder +
    "\n&4&lCollections\n" + values.collection +
    "\n&4&lMiscellaneous\n" + values.miscellaneous)
}

/**
 * Calculates distance between waypoints.
 * @param {{x: Number, y: Number, z:Number}} waypoint1
 * @param {{x: Number, y: Number, z: Number}} waypoint2
 * @returns
 */
export const distanceCalc = (waypoint1, waypoint2, includeVertical = true) => {
    return includeVertical
        ? Math.hypot(waypoint1.x - waypoint2.x, waypoint1.y - waypoint2.y, waypoint1.z - waypoint2.z)
        : Math.hypot(waypoint1.x - waypoint2.x, waypoint1.z - waypoint2.z)
}

export const getCwApi = () => coleWeightApi

/**
 * Gets a value from an object with a dynamic path to the value.
 * @param {Object} obj
 * @param {String[]} path
 * @returns
 */
export function getObjectValue(obj, path)
{
	let current = obj
    if(path == undefined) return undefined
    for (let i = 0; i < path.length; i++)
        current = current[path[i]]

	return current
}

/**
 * Gets the selected profile.
 * @param {Object} res The response from requesting https://api.hypixel.net/skyblock/profiles
 * @returns Selected profile
 */
export function getSelectedProfile(res)
{
    for(let i=0; i < res.profiles.length; i+=1)
    {
        if(res.profiles[i].selected == true)
            return res.profiles[i]
    }
}

/**
 * Converts seconds to a standard message.
 * @param {Number} seconds
 * @returns String
 */
export function secondsToMessage(seconds)
{
    let hour = Math.floor(seconds/60/60)
    if(hour < 1)
        return `${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`
    else
        return `${hour}h ${Math.floor(seconds/60) - hour*60}m`
}

/**
 * Adds notation based on type to the value.
 * @param {String} type oneLetters, shortScale, commas
 * @param {Number} value
 * @returns The notated value.
 */
export function addNotation(type, value) {
    let returnVal = value
    let notList = []
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ]
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"]
    }

    let checkNum = 1000
    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1]
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift()
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100)
                    returnVal = Math.floor(returnVal)
                    returnVal = (returnVal / Math.pow(10, o)) * 10
                    returnVal = +returnVal.toFixed(o - 1) + notValue
                }
                checkNum *= 10
            }
        }
    } else {
        returnVal = addCommas(value.toFixed(0))
    }

    return returnVal
}

export function parseNotatedInput(input){
    for(let index = 0; index < input.length; index++)
    {

        switch(input[index])
        {
            case "k":
                return 1000 * parseFloat(input.slice(0, index))
            case "m":
                return 1000000 * parseFloat(input.slice(0, index))
        }
    }
    if(parseFloat(input) == input)
        return parseFloat(input)
    else
        return undefined
}

// Autopet equipped your [Lvl 200] Golden Dragon! VIEW RULE
// Autopet equipped your [Lvl 100] Scatha ✦! VIEW RULE

register("chat", (pet) => {
    data.currentPet = pet.toLowerCase()
    data.save()
}).setCriteria(/^Autopet equipped your \[Lvl [\d]+\] ([\w ]+)( ✦)?! VIEW RULE$/)

// You (summoned|despawned) your Scatha ✦!
// You (summoned|despawned) your Golden Dragon!

register("chat", (msg, pet, skMsg) => {
    if(msg === "summoned")
        data.currentPet = pet.replace(skMsg ?? "", "").toLowerCase()
    else if (msg === "despawned")
        data.currentPet = "N/A"

    data.save()
}).setCriteria(/^You (summoned|despawned) your ([\w ]+)( ✦)?!$/)

register("chat", (state) => {
    data.effMinerEnabled = state === "Enabled"
    data.save()
}).setCriteria(/^(Enabled|Disabled) Efficient Miner$/)

register("gameLoad", () => {
    Promise.all([
        makeRequest("https://ninjune.dev/api/mminers"),
        makeRequest("https://ninjune.dev/api/cwinfo?new=true")
    ])
    .then(response => {
        griefers = response[0].griefers
        coleWeightApi = response[1]

        if(!settings.debug) return
        ChatLib.chat(`${PREFIX}&aApi Loaded!`)
    })
    .catch(error => {
        if(!settings.debug) return
        print(error.message)
        printError(error)
    })
})