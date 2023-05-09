import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { drawCoolWaypoint, drawLine, trace } from "../util/renderUtil"
import { getWaypoints } from "../util/waypointLoader"
import settings from "../settings"

let waypoints = [],
    res,
    enabled = true,
    wX, wY, wZ, range = -1

export default registerCommand({
    aliases: ["waypoint", "waypoints"],
    description: "Waypoints for route creation.",
    category: "waypoints",
    options: ["(load, unload, skipto, skip, unskip)"],
    subcommands: [["load", "unload", "clear", "enable", "disable", "insert", "export", "range", "import", "length", "paneclip", "etherwarp"]],
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw waypoint " to see usages.`)

        switch(args[1].toLowerCase())
        {
            case "import":
            case "load":
                res = getWaypoints(Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j(), "soopy")
                if(res.success)
                {
                    waypoints = res.waypoints
                    ChatLib.chat(`${constants.PREFIX}&bLoaded ordered waypoints!`)
                }
                else
                    ChatLib.chat(`${constants.PREFIX}&eThere was an error parsing waypoints! ${res.message}`)

                for (let i = 0; i < waypoints.length-1; i++)
                {
                    for (let j = 0; j < waypoints.length-i-1; j++)
                    {
                        if (parseInt(waypoints[j].options.name) >
                            parseInt(waypoints[j+1].options.name))
                            swap(waypoints, j, j+1)
                    }
                }
                break
            case "unload":
            case "clear":
                waypoints = []
                range = -1
                ChatLib.chat(`${constants.PREFIX}&bUnloaded waypoints!`)
                break
            case "enable":
                enabled = true
                ChatLib.chat(`${constants.PREFIX}&bEnabled waypoints!`)
                break
            case "disable":
                enabled = false
                ChatLib.chat(`${constants.PREFIX}&bDisabled waypoints!`)
                break
            case "add":
            case "insert":
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bStand where you want to add a waypoint (will be block under you) and do '/cw waypoint insert (number)'`)
                wX = parseInt(Player.getX())
                wY = parseInt(Player.getY())-1
                wZ = parseInt(Player.getZ())
                wNum = parseInt(args[2])
                if(wNum == waypoints.length + 1)
                {
                    waypoints.push({x: wX, y: wY, z: wZ, r:0, g:1, b: 0, options: {name: wNum}})
                    return ChatLib.chat(`${constants.PREFIX}&bAdded waypoint ${wNum} at ${wX}, ${wY}, ${wZ}!`)
                }
                if(wNum == undefined || wNum < 1 || wNum > waypoints.length) return ChatLib.chat(`${constants.PREFIX}&eInvalid number! Must be in range (1 - ${waypoints.length})`)

                for(let i = wNum-1; i < waypoints.length; i++)
                    waypoints[i].options.name = (parseInt(waypoints[i].options.name)+1).toString()

                waypoints.splice(wNum-1, 0, {x: wX, y: wY, z: wZ, r:0, g:1, b: 0, options: {name: wNum.toString()}})
                ChatLib.chat(`${constants.PREFIX}&bInserted waypoint ${wNum} at ${wX}, ${wY}, ${wZ}!`)
                break
            case "remove":
            case "delete":
                if(waypoints.length < 1) return ChatLib.chat(`${constants.PREFIX}&eWaypoints have not been loaded!`)
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bUsage: '/cw waypoint delete (number)'`)
                wNum = parseInt(args[2])
                if(wNum == undefined || wNum < 1 || wNum > waypoints.length) return ChatLib.chat(`${constants.PREFIX}&eInvalid number! Must be in range (1 - ${waypoints.length})`)

                for(let i = wNum-1; i < waypoints.length; i++)
                    waypoints[i].options.name = (parseInt(waypoints[i].options.name)-1).toString()

                waypoints.splice(wNum-1, 1)
                ChatLib.chat(`${constants.PREFIX}&bRemoved waypoint ${wNum}!`)
                break
            case "range":
                if(parseInt(args[2]) == undefined) return ChatLib.chat(`${constants.PREFIX}&bInvalid whole number! This command will set the radius around the player that waypoints render in (default = -1 = no range).`)
                range = parseInt(args[2])
                break
            case "export":
                ChatLib.command(`ct copy ${JSON.stringify(waypoints)}`, true)
                ChatLib.chat(`${constants.PREFIX}&bCopied to clipboard!`)
                break
            case "length":
                ChatLib.chat(`${constants.PREFIX}&bCurrent length is: ${waypoints.length}`)
                break
            case "etherwarp":
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bMarks a vein as etherwarp. Usage: '/cw waypoint etherwarp (number)'`)
                wNum = parseInt(args[2])-1
                if(waypoints[wNum] == undefined) return ChatLib.chat(`${constants.PREFIX}&bVein does not exist.`)

                waypoints[wNum].options.ether = !(waypoints[wNum]?.options?.ether ?? false)
                ChatLib.chat(`${constants.PREFIX}&bWaypoint ${wNum+1} is now ${waypoints[wNum]?.options?.ether ? "enabled" : "disabled"} to etherwarp.`)

                break
            case "paneclip":
                if(args[2] == undefined) return ChatLib.chat(`${constants.PREFIX}&bMarks a vein as paneclip. Usage: '/cw waypoint paneclip (number)'`)
                wNum = parseInt(args[2])-1
                if(waypoints[wNum] == undefined) return ChatLib.chat(`${constants.PREFIX}&bVein does not exist.`)

                waypoints[wNum].options.clip = !(waypoints[wNum]?.options?.clip ?? false)
                ChatLib.chat(`${constants.PREFIX}&bWaypoint ${wNum+1} is now ${waypoints[wNum].options.ether ? "enabled" : "disabled"} to paneclip.`)

                break
            default:
                return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw ordered " to see usages.`)
        }
    }
})


register("renderWorld", () => {
    if(!enabled || waypoints.length < 1) return
    let r, g, b, alpha
    for(let i = 0; i < waypoints.length; i++)
    {
        let draw = false
        let options = { name: waypoints[i].options.name, renderBeacon: false, alpha, drawBox: false, showDist: settings.waypointShowDistance}
        r = 0
        g = 0
        b = 0
        alpha = 0.6
        if(range > 0)
        {
            if(Math.hypot(Player.getX() - waypoints[i].x, Player.getY() - waypoints[i].y, Player.getZ() - waypoints[i].z) < range)
                draw = true
        }
        else
            draw = true

        if(waypoints[i].options.ether)
            options.nameColor = "5"
        else if(waypoints[i].options.clip)
            options.nameColor = "c"

        if(draw)
            drawCoolWaypoint(waypoints[i].x, waypoints[i].y,
                waypoints[i].z, r, g, b, options)
    }
})


function swap(arr, first, second)
{
    var temp = arr[first]
    arr[first] = arr[second]
    arr[second] = temp
}