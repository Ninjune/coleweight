import { PREFIX, registerCommands, waypointRender } from "../../../utils/Utils"

const WAYPOINTNAME = "Divan"
let divanWaypoints = []

const renderer = register("renderWorld", () => {
    waypointRender(divanWaypoints)
}).unregister()

register("worldLoad", () => {
    divanWaypoints = []
})

registerCommands({
    aliases: ["divans", "divan"],
    description: "Divan treasure waypoints for Mines of Divan.",
    options: "[toggle]",
    category: "waypoints",
    execute: (args) => {
        if(args[1] != "toggle") {
            new TextComponent(`${PREFIX}&bGo to the middle of jade crystal then do /cw coords divans toggle.`)
            .chat()
        }
        else {
            if(!divanWaypoints[0]) {
                let startPos = [Player.getX(), Player.getY(), Player.getZ()],
                x = startPos[0],
                y = startPos[1],
                z = startPos[2]

                console.log(x + " " + y + " " + z)
                divanWaypoints.push([x + 1, y + -40, z + -20])
                divanWaypoints.push([x + 30, y + -39, z + -25])
                divanWaypoints.push([x + -31, y + -39, z + -12])
                divanWaypoints.push([x + 1, y + -39, z + 20])
                divanWaypoints.push([x + -14, y + -39, z + 43])
                divanWaypoints.push([x + -12, y + -39, z + -44])
                divanWaypoints.push([x + -20, y + -40, z + 0])
                divanWaypoints.push([x + 22, y + -39, z + -14])
                divanWaypoints.push([x + 29, y + -39, z + -44])
                divanWaypoints.push([x + 12, y + -39, z + 7])
                divanWaypoints.push([x + 23, y + -40, z + -39])
                divanWaypoints.push([x + -37, y + -39, z + 11])
                divanWaypoints.push([x + 7, y + -39, z + 11])
                divanWaypoints.push([x + 6, y + -39, z + 11])
                divanWaypoints.push([x + -38, y + -40, z + 26])
                divanWaypoints.push([x + 12, y + -40, z + -22])
                divanWaypoints.push([x + -5, y + -39, z + 16])
                divanWaypoints.push([x + 40, y + -40, z + -30])
                divanWaypoints.push([x + 42, y + -37, z + -41])
                divanWaypoints.push([x + -23, y + -40, z + 40])
                divanWaypoints.push([x + 20, y + -40, z + 0])
                divanWaypoints.push([x + -24, y + -40, z + 12])
                divanWaypoints.push([x + 38, y + -40, z + -26])
                divanWaypoints.push([x + 43, y + -39, z + -16])
                divanWaypoints.push([x + -40, y + -40, z + 18])
                divanWaypoints.push([x + -17, y + -39, z + 20])
                divanWaypoints.push([x + 19, y + -40, z + 29])
                divanWaypoints.push([x + -37, y + -39, z + -14])
                divanWaypoints.push([x + -14, y + -39, z + 22])
                divanWaypoints.push([x + -42, y + -38, z + -28])
                divanWaypoints.push([x + -43, y + -40, z + -40])
                divanWaypoints.push([x + 25, y + -40, z + 17])
                divanWaypoints.push([x + 12, y + -40, z + 31])
                divanWaypoints.push([x + -31, y + -39, z + -40])
                divanWaypoints.push([x + -36, y + -38, z + 42])
                divanWaypoints.push([x + 7, y + -39, z + 22])
                divanWaypoints.push([x + 20, y + -39, z + -26])
                divanWaypoints.push([x + 12, y + -39, z + -43])
                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned on!`)
                renderer.register()
            }
            else {
                divanWaypoints = []
                ChatLib.chat(`${PREFIX}&b${WAYPOINTNAME} waypoints turned off!`)
                renderer.unregister()
            }
        }
    }
})