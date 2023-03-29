import { registerCommand } from "../../commandManager"
import constants from "../../util/constants"
import { waypointRender } from "../../util/helperFunctions"

const PREFIX = constants.PREFIX
let throneWaypoints = []


register("renderWorld", () => {
    waypointRender(throneWaypoints, true, true)
})


register("worldLoad", () => {
    throneWaypoints = []
})


registerCommand({
    aliases: ["throne"],
    description: "Throne waypoints.",
    options: "[toggle]",
    category: "waypoints",
    execute: (args) => {
        if(args[1] != "toggle")
        {
            ChatLib.chat(`${PREFIX}&bGo to the throne and sit on the back block then run /cw throne toggle.`)
        }
        else
        {
            if(throneWaypoints[0] == undefined)
            {
                let startPos = [Player.getX()-24, Player.getY()+6, Player.getZ()-59] // calculated below values at a weird start so adjusting them
                throneWaypoints.push([startPos[0]+8, startPos[1]+2, startPos[2]-5])
                throneWaypoints.push([startPos[0]+11, startPos[1]-35, startPos[2]-3])
                throneWaypoints.push([startPos[0]+2, startPos[1]-34, startPos[2]-4])
                throneWaypoints.push([startPos[0]+-2, startPos[1]-1, startPos[2]+49])
                throneWaypoints.push([startPos[0]+2, startPos[1]-13, startPos[2]+52])
                throneWaypoints.push([startPos[0]+27, startPos[1]-9, startPos[2]+51])
                throneWaypoints.push([startPos[0]+38, startPos[1]-15, startPos[2]+47])
                throneWaypoints.push([startPos[0]+41, startPos[1]-44, startPos[2]+46])
                throneWaypoints.push([startPos[0]+50, startPos[1]-28, startPos[2]+38])
                throneWaypoints.push([startPos[0]+55, startPos[1]-36, startPos[2]+29])
                throneWaypoints.push([startPos[0]+49, startPos[1]-31, startPos[2]+1])
                throneWaypoints.push([startPos[0]+50, startPos[1]-1, startPos[2]+10])
                throneWaypoints.push([startPos[0]+45, startPos[1]-3, startPos[2]-4])
                ChatLib.chat(`${PREFIX}&bThrone waypoints turned on!`)
            }
            else
            {
                throneWaypoints = []
                ChatLib.chat(`${PREFIX}&bThrone waypoints turned off!`)
            }
        }
    }
})