import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { drawCoolWaypoint, drawEspBox, drawLine, trace } from "../util/renderUtil"
import { getWaypoints } from "../util/waypointLoader"
import settings from "../settings"
import { Title } from "../util/helperFunctions"

const clipTitle = new Title({text: "&cClip next", scale: 2, sound: "mob.bat.hurt", yOffset: 50})
const etherTitle = new Title({text: "&5Etherwarp next","scale": 2, "sound": "mob.endermen.portal", "yOffset": 50})

let currentOrderedWaypointIndex = 1,
    orderedWaypoints = [],
    renderWaypoints = [],
    lastCloser = 0,
    res,
    enabled = true

export default registerCommand({
    aliases: ["ordered", "order"],
    description: "Ordered waypoints.",
    category: "waypoints",
    options: ["(load, unload, skipto, skip, unskip)"],
    subcommands: [["load", "unload", "skip", "skipto", "unskip", "clear", "enable", "disable", "delete", "remove", "etherwarp", "paneclip", "add", "insert"]],
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw ordered " to see usages.`)
        switch(args[1].toLowerCase())
        {
            case "import":
            case "load":
                load()
                break
            case "unload":
            case "clear":
                orderedWaypoints = []
                renderWaypoints = []
                currentOrderedWaypointIndex = 0
                lastCloser = 0
                ChatLib.chat(`${constants.PREFIX}&bUnloaded ordered waypoints!`)
                break
            case "skip":
                if(args[2] != undefined && parseInt(args[2]) != args[2])
                    return ChatLib.chat(`${constants.PREFIX}&bNot an integer!`)

                if(args[2] != undefined)
                    currentOrderedWaypointIndex += parseInt(args[2])
                else
                    currentOrderedWaypointIndex++

                while(orderedWaypoints.length > 1 && currentOrderedWaypointIndex > orderedWaypoints.length-1)
                    currentOrderedWaypointIndex -= orderedWaypoints.length

                ChatLib.chat(`${constants.PREFIX}&bSkipped ${args[2] ?? 1} vein(s).`)
                break
            case "skipto":
                if(parseInt(args[2]) > 0 && parseInt(args[2]) < orderedWaypoints.length)
                {
                    if(parseInt(args[2]) == 1) args[2] = 2
                    currentOrderedWaypointIndex = parseInt(args[2])-2
                    ChatLib.chat(`${constants.PREFIX}&bSkipped to ${parseInt(args[2])}`)
                }
                else
                ChatLib.chat(`${constants.PREFIX}&eSkipto must be in range 1 - ${orderedWaypoints.length-1}`)
                break
            case "unskip":
                if(args[2] != undefined && parseInt(args[2]) != args[2])
                    return ChatLib.chat(`${constants.PREFIX}&bNot an integer!`)

                if(args[2] != undefined)
                    currentOrderedWaypointIndex -= parseInt(args[2])
                else
                    currentOrderedWaypointIndex--

                while(orderedWaypoints.length > 1 && currentOrderedWaypointIndex <= 0)
                    currentOrderedWaypointIndex += orderedWaypoints.length-1

                ChatLib.chat(`${constants.PREFIX}&bWent back ${args[2] ?? 1} waypoints.`)
                break
            case "enable":
                enabled = true
                ChatLib.chat(`${constants.PREFIX}&bEnabled ordered waypoints!`)
                break
            case "disable":
                enabled = false
                ChatLib.chat(`${constants.PREFIX}&bDisabled ordered waypoints!`)
                break
            case "delete":
            case "remove":
                if(orderedWaypoints.length < 1) return ChatLib.chat(`${constants.PREFIX}&eWaypoints have not been loaded!`)
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bUsage: '/cw ordered delete (number)'`)
                wNum = parseInt(args[2])
                if(wNum == undefined || wNum < 1 || wNum > orderedWaypoints.length) return ChatLib.chat(`${constants.PREFIX}&eInvalid number! Must be in range (1 - ${orderedWaypoints.length})`)
                for(let i = wNum-1; i < orderedWaypoints.length; i++)
                    orderedWaypoints[i].options.name = (parseInt(orderedWaypoints[i].options.name)-1).toString()
                orderedWaypoints.splice(wNum-1, 1)
                ChatLib.chat(`${constants.PREFIX}&bRemoved waypoint ${wNum}!`)
                break
            case "add":
            case "insert":
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bStand where you want to add a waypoint (will be block under you) and do '/cw waypoint insert (number)'`)
                wX = parseInt(Player.getX())
                wY = parseInt(Player.getY()) - 1
                wZ = parseInt(Player.getZ())
                wNum = parseInt(args[2])
                if(wNum == orderedWaypoints.length + 1)
                {
                    orderedWaypoints.push({x: wX, y: wY, z: wZ, r:0, g:1, b: 0, options: {name: wNum}})
                    return ChatLib.chat(`${constants.PREFIX}&bAdded waypoint ${wNum} at ${wX}, ${wY}, ${wZ}!`)
                }
                if(wNum == undefined || wNum < 1 || wNum > orderedWaypoints.length) return ChatLib.chat(`${constants.PREFIX}&eInvalid number! Must be in range (1 - ${orderedWaypoints.length})`)

                for(let i = wNum-1; i < orderedWaypoints.length; i++)
                    orderedWaypoints[i].options.name = (parseInt(orderedWaypoints[i].options.name)+1).toString()

                orderedWaypoints.splice(wNum-1, 0, {x: wX, y: wY, z: wZ, r:0, g:1, b: 0, options: {name: wNum.toString()}})
                ChatLib.chat(`${constants.PREFIX}&bInserted waypoint ${wNum} at ${wX}, ${wY}, ${wZ}!`)
                break
            case "etherwarp":
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bMarks a vein as etherwarp. Usage: '/cw ordered etherwarp (number)'`)
                wNum = parseInt(args[2])-1
                if(orderedWaypoints[wNum] == undefined) return ChatLib.chat(`${constants.PREFIX}&bVein does not exist.`)

                orderedWaypoints[wNum].options.ether = !(orderedWaypoints[wNum]?.options?.ether ?? false)
                ChatLib.chat(`${constants.PREFIX}&bWaypoint ${wNum+1} is now ${orderedWaypoints[wNum].options.ether ? "enabled" : "disabled"} to etherwarp.`)

                break
            case "paneclip":
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bMarks a vein as paneclip. Usage: '/cw ordered paneclip (number)'`)
                wNum = parseInt(args[2])-1
                if(orderedWaypoints[wNum] == undefined) return ChatLib.chat(`${constants.PREFIX}&bVein does not exist.`)

                orderedWaypoints[wNum].options.clip = !(orderedWaypoints[wNum]?.options?.clip ?? false)
                ChatLib.chat(`${constants.PREFIX}&bWaypoint ${wNum+1} is now ${orderedWaypoints[wNum].options.ether ? "enabled" : "disabled"} to paneclip.`)

                break
            case "export":
                ChatLib.command(`ct copy ${JSON.stringify(orderedWaypoints)}`, true)
                ChatLib.chat(`${constants.PREFIX}&bCopied to clipboard!`)
                break
            case "save":
                if(args[2] == undefined)
                    return ChatLib.chat(`${constants.PREFIX}&bUsage: /cw ordered save (name) [description, can be spaced]`)
                let routes = JSON.parse(FileLib.read("Coleweight", "config/routes.json"))
                routes[args[2]] = {"desc": args.slice(3).join(" ") ?? "", "format": "soopy", "data": JSON.stringify(orderedWaypoints)}
                FileLib.write("Coleweight", "config/routes.json", JSON.stringify(routes))
                ChatLib.chat(`${constants.PREFIX}&bSaved. Do "/cw import" to import.`)

                break
            default:
                return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw ordered " to see usages.`)
        }
    }
})

// stolen from soopy (somewhat)
register("renderWorld", () => {
    if(!enabled) return
    let r, g, b, alpha, wpColor
    for(let i = 0; i < renderWaypoints.length; i++)
    {
        wpColor = undefined; 
        r = 0
        g = 0
        b = 0
        alpha = 0.6;
        if(i == 0)
            wpColor = settings.orderedPrevColor;
        else if (i == 1)
            wpColor = settings.orderedCurColor;
        else if(i == 2)
            wpColor = settings.orderedNextColor;
        else if(i >= 3)
        {
            r = 1
            alpha = 0.4
        }

        if(wpColor != undefined)
        {
            r = wpColor.getRed()/255;
            g = wpColor.getGreen()/255;
            b = wpColor.getBlue()/255;
            alpha = wpColor.getAlpha()/255;
        }

        if(orderedWaypoints[renderWaypoints[i]] == undefined)
        {
            if(settings.debug)
                console.log(renderWaypoints[i] + " " + i)
            continue
        }
        drawCoolWaypoint(orderedWaypoints[renderWaypoints[i]].x, orderedWaypoints[renderWaypoints[i]].y,
            orderedWaypoints[renderWaypoints[i]].z, r, g, b, { name: i < 3 && (settings.orderedSetup || settings.orderedShowText) ? orderedWaypoints[renderWaypoints[i]].options.name : "", renderBeacon: false, phase: i < 3, alpha })
    }
    const traceWP = orderedWaypoints[renderWaypoints[2]]
    const lineColor = settings.orderedColor

    if (!settings.orderedSetup && settings.orderedWaypointsLine && traceWP != undefined)
        trace(parseInt(traceWP.x) + 0.5, parseInt(traceWP.y) + 0.25, parseInt(traceWP.z) + 0.5, lineColor.getRed()/255, lineColor.getGreen()/255, lineColor.getBlue()/255, lineColor.getAlpha()/255, settings.orderedLineThickness)

    const currentWP = orderedWaypoints[renderWaypoints[1]]
    if(settings.orderedSetup && currentWP != undefined && traceWP != undefined)
    {
        drawLine(parseInt(currentWP.x) + 0.5, parseInt(currentWP.y) + 2.65, parseInt(currentWP.z) + 0.5,
            parseInt(traceWP.x) + 0.5, parseInt(traceWP.y) + 0.5, parseInt(traceWP.z) + 0.5,
            lineColor.getRed()/255, lineColor.getGreen()/255, lineColor.getBlue()/255, 0.5, settings.orderedSetupThickness
        )
    }

    decideWaypoints()
})


function decideWaypoints()
{
    renderWaypoints = []
    if (orderedWaypoints.length < 1) return

    let beforeWaypoint = orderedWaypoints[currentOrderedWaypointIndex - 1]
    if (beforeWaypoint != undefined)
        renderWaypoints.push(beforeWaypoint.options.name-1)
    else
        renderWaypoints.push(orderedWaypoints[orderedWaypoints.length-1].options.name-1)

    let currentWaypoint = orderedWaypoints[currentOrderedWaypointIndex]
    let distanceTo1 = Infinity
    if (currentWaypoint != undefined) {
        distanceTo1 = Math.hypot(Player.getX() - currentWaypoint.x, Player.getY() - currentWaypoint.y, Player.getZ() - currentWaypoint.z)
        renderWaypoints.push(currentWaypoint.options.name-1)
    }

    let nextWaypoint = orderedWaypoints[currentOrderedWaypointIndex + 1]
    if (nextWaypoint == undefined)
    {
        if (orderedWaypoints[0] != undefined)
            nextWaypoint = orderedWaypoints[0]
        else if (orderedWaypoints[1] != undefined)
            nextWaypoint = orderedWaypoints[1]
        else if (orderedWaypoints[2] != undefined)
            nextWaypoint = orderedWaypoints[2]
    }
    let distanceTo2 = Infinity
    if (nextWaypoint != undefined) {
        distanceTo2 = Math.hypot(Player.getX() - nextWaypoint.x, Player.getY() - nextWaypoint.y, Player.getZ() - nextWaypoint.z)
        renderWaypoints.push(nextWaypoint.options.name-1)
        if (nextWaypoint.options.clip === true)
            clipTitle.draw()
        else if (nextWaypoint.options.ether === true)
            etherTitle.draw()
    }

    if (lastCloser === currentOrderedWaypointIndex && distanceTo1 > distanceTo2 && distanceTo2 < settings.nextWaypointRange) {
        currentOrderedWaypointIndex++
        if (orderedWaypoints[currentOrderedWaypointIndex] == undefined)
            currentOrderedWaypointIndex = 0
        return
    }

    if (distanceTo1 < settings.nextWaypointRange)
        lastCloser = currentOrderedWaypointIndex

    if (distanceTo2 < settings.nextWaypointRange) {
        currentOrderedWaypointIndex++
        if (orderedWaypoints[currentOrderedWaypointIndex] == undefined)
            currentOrderedWaypointIndex = 0
    }

    orderedWaypoints.forEach(waypoint => {
        if(settings.orderedSetup &&
            !renderWaypoints.includes(waypoint.options.name-1) &&
            Math.hypot(Player.getX() - waypoint.x, Player.getY() - waypoint.y, Player.getZ() - waypoint.z) < 16
        )
            renderWaypoints.push(waypoint.options.name-1)
    })
}


register("worldLoad", () => {
    if (currentOrderedWaypointIndex >= 0) currentOrderedWaypointIndex = 1
})


function swap(arr, first, second)
{
    var temp = arr[first]
    arr[first] = arr[second]
    arr[second] = temp
}


export function load(route = "")
{
    let res
    if(route == "")
        res = getWaypoints(Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j(), "soopy")
    else
        res = getWaypoints(route, "soopy")

    if(res.success)
    {
        orderedWaypoints = res.waypoints
        ChatLib.chat(`${constants.PREFIX}&bLoaded ordered waypoints!`)
    }
    else
        ChatLib.chat(`${constants.PREFIX}&eThere was an error parsing waypoints! ${res.message}`)

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
            ChatLib.chat(`${constants.PREFIX}&bNote: Waypoint ${i+1} is not in the right order or is not a number! Current is: ${parseInt(orderedWaypoints[i]?.options?.name)}`)
}