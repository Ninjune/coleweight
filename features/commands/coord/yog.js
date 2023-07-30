import { PREFIX, registerCommands, waypointRender } from "../../../utils/Utils"

const WAYPOINTNAME = "Yog"
let yogWaypoints = []

const renderer = register("renderWorld", () => {
    if(yogWaypoints.length < 1) return
    waypointRender(yogWaypoints)
}).unregister()


register("worldLoad", () => {
    yogWaypoints = []
})

registerCommands({
    aliases: ["yog"],
    description: "Yog waypoints for bal.",
    options: "[toggle]",
    category: "waypoints",
    execute: (args) => {
        if(args[1] != "toggle"){
            new TextComponent(`${PREFIX}&bGo to the leftmost corner of the topaz crystal facing bal close to bal then do /cw coords yog toggle.`)
            .chat()
        }
        else {
            if(!yogWaypoints[0]) {
                let startPos = [Player.getX(), Player.getY(), Player.getZ()],
                x = startPos[0],
                y = startPos[1],
                z = startPos[2]

                yogWaypoints.push([x + 10, y - 7, z - 27])
                yogWaypoints.push([x + 10, y - 7, z - 27])
                yogWaypoints.push([x + 28, y - 8, z + 15])
                yogWaypoints.push([x - 41, y - 3, z + 26])
                yogWaypoints.push([x - 32, y - 3, z + 45])
                yogWaypoints.push([x - 22, y - 3, z - 34])
                yogWaypoints.push([x + 28, y - 8, z + 36])
                yogWaypoints.push([x - 47, y - 3, z + 32])
                yogWaypoints.push([x - 43, y - 1, z + 4])
                yogWaypoints.push([x - 47, y + 2, z - 20])
                yogWaypoints.push([x + 11, y - 13, z + 40])
                yogWaypoints.push([x + 15, y - 13, z + 43])
                yogWaypoints.push([x - 44, y + 2, z - 29])
                yogWaypoints.push([x + 33, y - 4, z - 15])
                yogWaypoints.push([x - 6, y - 4, z - 34])
                yogWaypoints.push([x + 19, y - 12, z + 35])
                yogWaypoints.push([x + 16, y - 9, z - 15])
                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned on!`)
                renderer.register()
            }
            else
            {
                yogWaypoints = []
                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned off!`)
                renderer.unregister()
            }
        }
    }
})