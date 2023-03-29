import { registerCommand } from "../../commandManager"
import constants from "../../util/constants"
import { waypointRender } from "../../util/helperFunctions"

const PREFIX = constants.PREFIX
let waypoints = []


register("renderWorld", () => {
    waypointRender(waypoints)
})


register("worldLoad", () => {
    waypoints = []
})


registerCommand({
    aliases: ["temple"],
    description: "Waypoints for jungle temple armadillo clip.",
    options: "[toggle]",
    category: "waypoints",
    execute: (args) => {
        const WAYPOINTNAME = "Temple"

        if(args[1] != "toggle")
        {
            new TextComponent(`${PREFIX}&bStand on the leftmost key guardian and do /cw ${WAYPOINTNAME} toggle`)
            .chat()
        }
        else
        {
            if(waypoints[0] == undefined)
            {
                let startPos = [Player.getX(), Player.getY(), Player.getZ()],
                x = startPos[0],
                y = startPos[1],
                z = startPos[2]

                waypoints.push([x + 61, y + -44, z + 18])

                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned on!`)
            }
            else
            {
                waypoints = []
                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned off!`)
            }
        }
    }
})