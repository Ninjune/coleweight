import { PREFIX, registerCommands, waypointRender } from "../../../utils/Utils"

const WAYPOINTNAME = "Temple"
let waypoints = []

const renderer = register("renderWorld", () => {
    waypointRender(waypoints)
}).unregister()

register("worldLoad", () => {
    waypoints = []
})

registerCommands({
    aliases: ["temple"],
    description: "Waypoints for jungle temple armadillo clip.",
    options: "[toggle]",
    category: "waypoints",
    execute: (args) => {
        if(args[1] != "toggle") {
            new TextComponent(`${PREFIX}&bStand on the leftmost key guardian and do /cw ${WAYPOINTNAME} toggle`)
            .chat()
        }
        else {
            if(!waypoints[0]) {
                let startPos = [Player.getX(), Player.getY(), Player.getZ()],
                x = startPos[0],
                y = startPos[1],
                z = startPos[2]

                waypoints.push([x + 61, y + -44, z + 18])

                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned on!`)
                renderer.register()
            }
            else {
                waypoints = []
                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned off!`)
                renderer.unregister()
            }
        }
    }
})