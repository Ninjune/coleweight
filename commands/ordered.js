import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { drawCoolWaypoint, drawLine, trace } from "../util/renderUtil"
import { getWaypoints } from "../util/waypointLoader"
import settings from "../settings"

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
    subcommands: [["load", "unload", "skip", "skipto", "unskip", "clear", "enable", "disable"]],
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw ordered " to see usages.`)

        switch(args[1].toLowerCase())
        {
            case "import":
            case "load":
                res = getWaypoints(Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j(), "soopy")
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
                if(args[2] != undefined)
                    currentOrderedWaypointIndex += parseInt(args[2])
                else
                    currentOrderedWaypointIndex++

                while(orderedWaypoints.length > 1 && currentOrderedWaypointIndex > orderedWaypoints.length-1)
                    currentOrderedWaypointIndex -= orderedWaypoints.length-1

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
                if(args[2] != undefined && currentOrderedWaypointIndex - parseInt(args[2]) > 0)
                {
                    currentOrderedWaypointIndex -= parseInt(args[2])
                    ChatLib.chat(`${constants.PREFIX}&bWent back ${parseInt(args[2])} waypoints.`)
                }
                else if(args[2] == undefined && currentOrderedWaypointIndex > 0)
                {
                    currentOrderedWaypointIndex--
                    ChatLib.chat(`${constants.PREFIX}&bWent back a waypoint.`)
                }
                else
                    ChatLib.chat(`${constants.PREFIX}&eCant go back from 0!`)
                break
            case "enable":
                enabled = true
                ChatLib.chat(`${constants.PREFIX}&bEnabled ordered waypoints!`)
                break
            case "disable":
                enabled = false
                ChatLib.chat(`${constants.PREFIX}&bDisabled ordered waypoints!`)
                break
            default:
                return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw ordered " to see usages.`)
        }
    }
})


// stolen from soopy (somewhat)
register("renderWorld", () => {
    if(!enabled) return
    let r, g, b, alpha
    for(let i = 0; i < renderWaypoints.length; i++)
    {
        r = 0
        g = 0
        b = 0
        alpha = 0.6
        if(i == 0)
            b = 1
        else if (i == 1)
            g = 1
        else if(i == 2)
        {
            r = 1
            g = 1
        }
        else if(i >= 3)
        {
            r = 1
            alpha = 0.4
        }
        drawCoolWaypoint(orderedWaypoints[renderWaypoints[i]].x, orderedWaypoints[renderWaypoints[i]].y,
            orderedWaypoints[renderWaypoints[i]].z, r, g, b, { name: i < 3 ? orderedWaypoints[renderWaypoints[i]].options.name : "", renderBeacon: false, phase: i < 3, alpha })
    }
    const traceWP = orderedWaypoints[renderWaypoints[2]]
    let color = settings.orderedColor

    if (!settings.orderedSetup && settings.orderedWaypointsLine && traceWP != undefined)
        trace(parseInt(traceWP.x) + 0.5, parseInt(traceWP.y), parseInt(traceWP.z) + 0.5, color.getRed()/255, color.getGreen()/255, color.getBlue()/255, color.getAlpha()/255, settings.orderedLineThickness)

    const currentWP = orderedWaypoints[renderWaypoints[1]]
    if(settings.orderedSetup &&currentWP != undefined && traceWP != undefined)
        drawLine(parseInt(currentWP.x) + 0.5, parseInt(currentWP.y) + 2.65, parseInt(currentWP.z) + 0.5, parseInt(traceWP.x) + 0.5, parseInt(traceWP.y) + 0.5, parseInt(traceWP.z) + 0.5,
                 color.getRed()/255, color.getGreen()/255, color.getBlue()/255, 0.5, 100)
    decideWaypoints()
})


function decideWaypoints()
{
    renderWaypoints = []
    if (orderedWaypoints.length < 1) return

    let beforeWaypoint = orderedWaypoints[currentOrderedWaypointIndex - 1]
    if (beforeWaypoint != undefined) {
        renderWaypoints.push(beforeWaypoint.options.name-1)
    }

    let currentWaypoint = orderedWaypoints[currentOrderedWaypointIndex]
    let distanceTo1 = Infinity
    if (currentWaypoint != undefined) {
        distanceTo1 = Math.hypot(Player.getX() - currentWaypoint.x, Player.getY() - currentWaypoint.y, Player.getZ() - currentWaypoint.z)
        renderWaypoints.push(currentWaypoint.options.name-1)
    }

    let nextWaypoint = orderedWaypoints[currentOrderedWaypointIndex + 1]
    if (nextWaypoint == undefined) {
        if (orderedWaypoints[0] != undefined) {
            nextWaypoint = orderedWaypoints[0]
        } else if (orderedWaypoints[1] != undefined) {
            nextWaypoint = orderedWaypoints[1]
        }
    }
    let distanceTo2 = Infinity
    if (nextWaypoint != undefined) {
        distanceTo2 = Math.hypot(Player.getX() - nextWaypoint.x, Player.getY() - nextWaypoint.y, Player.getZ() - nextWaypoint.z)
        renderWaypoints.push(nextWaypoint.options.name-1)
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
        if (!orderedWaypoints[currentOrderedWaypointIndex])
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