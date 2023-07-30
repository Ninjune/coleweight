import { PREFIX, registerCommands, waypointRender } from "../../../utils/Utils"

const WAYPOINTNAME = "Automatons"
let waypoints = []

const renderer = register("renderWorld", () => {
    waypointRender(waypoints)
}).unregister()

register("worldLoad", () => {
    waypoints = []
})

registerCommands({
    aliases: ["automatons", "automaton"],
    description: "Automaton waypoints for precursor city.",
    options: "[toggle]",
    category: "waypoints",
    execute: (args) => {
        if(args[1] != "toggle") {
            new TextComponent(`${PREFIX}&bStand in the pot in &3this&b picture and do /cw ${WAYPOINTNAME} toggle`)
            .setClickAction("open_url")
            .setClickValue("https://media.discordapp.net/attachments/1049475464667856926/1052749218055475210/image.png")
            .chat()
        }
        else {
            if(!waypoints[0]) {
                let startPos = [Player.getX(), Player.getY(), Player.getZ()],
                x = startPos[0],
                y = startPos[1],
                z = startPos[2]

                let coordsRows = FileLib.read("Coleweight", "data/automatons.txt").split("\n")
                coordsRows.forEach(unsplitRow => {
                    let row = unsplitRow.split(" ")
                    waypoints.push([x + parseInt(row[0]), y + parseInt(row[1]), z + parseInt(row[2])])
                })

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