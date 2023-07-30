import settings from "../../settings"
import { drawCoolWaypoint, drawLine, Title } from "../../utils/Rendering"
import { distanceCalc, load, PREFIX, registerCommands } from "../../utils/Utils"

const maxDistanceTitle = new Title({text: "&cYou're out of range of a waypoint.", scale: 2, sound: "mob.bat.hurt", yOffset: 50, })

let waypoints = []
let enabled = true
let wX
let wY
let wZ
let range = -1
let routes
let oldWP
let temp

registerCommands({
    aliases: ["waypoint", "waypoints"],
    description: "Waypoints for route creation.",
    category: "waypoints",
    options: ["(load, unload, skipto, skip, unskip)"],
    subcommands: [["load", "unload", "clear", "enable", "disable", "insert", "export", "range", "import", "length", "paneclip", "etherwarp", "replace", "swap"]],
    execute: (args) => {
        if(!args[1])
            return ChatLib.chat(`${PREFIX}&eUnknown usage! Hit tab on "/cw waypoint " to see usages.`)

        switch(args[1].toLowerCase()) {
            case "import":
            case "load":
                load()
                break
            case "unload":
            case "clear":
                waypoints = []
                range = -1
                ChatLib.chat(`${PREFIX}&bUnloaded waypoints!`)
                break
            case "enable":
                enabled = true
                ChatLib.chat(`${PREFIX}&bEnabled waypoints!`)
                renderer.register()
                break
            case "disable":
                enabled = false
                ChatLib.chat(`${PREFIX}&bDisabled waypoints!`)
                renderer.unregister()
                break
            case "add":
            case "insert":
                if(!args[2]) return ChatLib.chat(`${PREFIX}&bStand where you want to add a waypoint (will be block under you) and do '/cw waypoint insert (number)'`)

                wX = parseInt(Player.getX())
                wY = parseInt(Player.getY())-1
                wZ = parseInt(Player.getZ())
                wNum = parseInt(args[2])
                if(wNum == waypoints.length + 1)
                {
                    waypoints.push({x: wX, y: wY, z: wZ, r:0, g:1, b: 0, options: {name: wNum}})
                    return ChatLib.chat(`${PREFIX}&bAdded waypoint ${wNum} at ${wX}, ${wY}, ${wZ}!`)
                }
                if(!wNum || wNum < 1 || wNum > waypoints.length) return ChatLib.chat(`${PREFIX}&eInvalid number! Must be in range (1 - ${waypoints.length})`)

                for(let i = wNum-1; i < waypoints.length; i++)
                    waypoints[i].options.name = (parseInt(waypoints[i].options.name)+1).toString()

                waypoints.splice(wNum-1, 0, {x: wX, y: wY, z: wZ, r:0, g:1, b: 0, options: {name: wNum.toString()}})
                ChatLib.chat(`${PREFIX}&bInserted waypoint ${wNum} at ${wX}, ${wY}, ${wZ}!`)
                break
            case "remove":
            case "delete":
                if(waypoints.length < 1) return ChatLib.chat(`${PREFIX}&eWaypoints have not been loaded!`)
                if(!args[2]) return ChatLib.chat(`${PREFIX}&bUsage: '/cw waypoint delete (number)'`)

                wNum = parseInt(args[2])
                if(!wNum || wNum < 1 || wNum > waypoints.length) return ChatLib.chat(`${PREFIX}&eInvalid number! Must be in range (1 - ${waypoints.length})`)

                for(let i = wNum-1; i < waypoints.length; i++)
                    waypoints[i].options.name = (parseInt(waypoints[i].options.name)-1).toString()

                waypoints.splice(wNum-1, 1)
                ChatLib.chat(`${PREFIX}&bRemoved waypoint ${wNum}!`)
                break
            case "range":
                if(!parseInt(args[2])) return ChatLib.chat(`${PREFIX}&bInvalid whole number! This command will set the radius around the player that waypoints render in (default = -1 = no range).`)
                range = parseInt(args[2])
                break
            case "export":
                ChatLib.command(`ct copy ${JSON.stringify(waypoints)}`, true)
                ChatLib.chat(`${PREFIX}&bCopied to clipboard!`)
                break
            case "length":
                ChatLib.chat(`${PREFIX}&bCurrent length is: ${waypoints.length}`)
                break
            case "etherwarp":
                if(!args[2]) return ChatLib.chat(`${PREFIX}&bMarks a vein as etherwarp. Usage: '/cw waypoint etherwarp (number)'`)
                wNum = parseInt(args[2])-1
                if(!waypoints[wNum]) return ChatLib.chat(`${PREFIX}&bVein does not exist.`)

                waypoints[wNum].options.ether = !(waypoints[wNum]?.options?.ether ?? false)
                ChatLib.chat(`${PREFIX}&bWaypoint ${wNum+1} is now ${waypoints[wNum]?.options?.ether ? "enabled" : "disabled"} to etherwarp.`)

                break
            case "paneclip":
                if(!args[2]) return ChatLib.chat(`${PREFIX}&bMarks a vein as paneclip. Usage: '/cw waypoint paneclip (number)'`)
                wNum = parseInt(args[2])-1

                if(!waypoints[wNum]) return ChatLib.chat(`${PREFIX}&bVein does not exist.`)

                waypoints[wNum].options.clip = !(waypoints[wNum]?.options?.clip ?? false)
                ChatLib.chat(`${PREFIX}&bWaypoint ${wNum+1} is now ${waypoints[wNum].options.ether ? "enabled" : "disabled"} to paneclip.`)

                break
            case "save":
                if(!args[2])
                    return ChatLib.chat(`${PREFIX}&bUsage: /cw waypoint save (name) [description, can be spaced]`)
                routes = JSON.parse(FileLib.read("Coleweight", "config/routes.json"))
                routes[args[2]] = {"desc": args.slice(3).join(" ") ?? "", "format": "soopy", "data": JSON.stringify(waypoints)}
                FileLib.write("Coleweight", "config/routes.json", JSON.stringify(routes))
                ChatLib.chat(`${PREFIX}&bSaved. Do "/cw import" to import.`)
                break
            case "swap":
                if(parseInt(args[2]) != args[2] || parseInt(args[3]) != args[3])
                    return ChatLib.chat(`${PREFIX}&bBoth numbers must be integers!`)

                if(!args[2] || args[2] < 1 || args[2] > waypoints.length-1 ||
                    !args[3] || args[3] < 1 || args[3] > waypoints.length-1
                )
                    return ChatLib.chat(`${PREFIX}&eInvalid number! Must be in range (1 - ${waypoints.length-1})`)
                args[2] = parseInt(args[2])-1
                args[3] = parseInt(args[3])-1
                waypoints[args[2]].options.name = args[3]+1
                waypoints[args[3]].options.name = args[2]+1
                swap(waypoints, args[2], args[3])

                ChatLib.chat(`${PREFIX}&bSwapped ${args[2]+1} and ${args[3]+1}!`)
                break
            case "replace":
                if(parseInt(args[2]) != args[2] || parseInt(args[3]) != args[3])
                    return ChatLib.chat(`${PREFIX}&bBoth numbers must be integers!`)

                if(!args[2] || args[2] < 1 || args[2] > waypoints.length-1 ||
                    !args[3] || args[3] < 1 || args[3] > waypoints.length-1
                )
                    return ChatLib.chat(`${PREFIX}&eInvalid number! Must be in range (1 - ${waypoints.length-1})`)
                args[2] = parseInt(args[2])-1
                args[3] = parseInt(args[3])-1
                oldWP = waypoints[args[2]]

                for(let i = args[2]; i < waypoints.length; i++)
                    waypoints[i].options.name = (parseInt(waypoints[i].options.name)-1).toString()
                waypoints.splice(args[2], 1)

                for(let i = args[3]; i < waypoints.length; i++)
                    waypoints[i].options.name = (parseInt(waypoints[i].options.name)+1).toString()
                waypoints.splice(args[3], 0, {x: oldWP.x, y: oldWP.y, z: oldWP.z, r:0, g:1, b: 0, options: {name: (args[3]+1).toString()}})

                ChatLib.chat(`${PREFIX}&bReplaced ${args[2]+1} and ${args[3]+1}!`)
                break
            default:
                return ChatLib.chat(`${PREFIX}&eUnknown usage! Hit tab on "/cw ordered " to see usages.`)
        }
    }
})


const renderer = register("renderWorld", () => {
    if(!enabled || waypoints.length < 1) return

    let r
    let g
    let b
    let alpha

    for(let i = 0; i < waypoints.length; i++) {
        let draw = false
        let options = { name: waypoints[i].options.name, renderBeacon: false, alpha, drawBox: false, showDist: settings.waypointShowDistance}
        let playerY = Player.getRenderY()+Player.getPlayer()["func_70047_e"]()
        let distanceToWp = distanceCalc({x: Player.getX(), y: playerY, z: Player.getZ()}, waypoints[i])

        r = 0
        g = 1
        b = 0
        alpha = 0.7

        if(range > 0) {
            if(distanceToWp < range)
                draw = true
        }
        else
            draw = true

        if(waypoints[i].options.ether)
            options.nameColor = "5"
        else if(waypoints[i].options.clip)
            options.nameColor = "c"

        if(settings.waypointShowBox && distanceToWp <= 64)
            options.drawBox = true
        const color = settings.orderedColor

        if(settings.waypointShowLine) {
            let currentWP = waypoints[i],
                traceWP = waypoints[i+1]
            if(!traceWP)
                traceWP = waypoints[0]
            if(distanceToWp <= 64) {
                drawLine(parseInt(currentWP.x) + 0.5, parseInt(currentWP.y) + 2.65, parseInt(currentWP.z) + 0.5,
                    parseInt(traceWP.x) + 0.5, parseInt(traceWP.y) + 0.5, parseInt(traceWP.z) + 0.5,
                    color.getRed()/255, color.getGreen()/255, color.getBlue()/255, 0.3, settings.orderedSetupThickness
                )
            }

            if(distanceCalc({x: Player.getX(), y: playerY, z: Player.getZ()}, waypoints[i], false) >= 128) {
                maxDistanceTitle.text = `&cYou are out of range of waypoint ${i+1}.`
                maxDistanceTitle.draw()
            }
        }

        if(settings.waypointShowHorizontal)
            options.includeVerticalDistance = false

        if(draw)
            drawCoolWaypoint(waypoints[i].x, waypoints[i].y,
                waypoints[i].z, r, g, b, options)
    }
}).unregister()