// basis: https://github.com/Skytils/SkytilsMod/blob/293ebf80522daf105da19ddb8ad27fa4fc5f9af9/src/main/kotlin/gg/skytils/skytilsmod/features/impl/mining/MiningFeatures.kt#L364 & nwjn esps: matcho + corpse
import settings from "../settings";
import { gunpowderCheck, registerWhen } from "../util/helperFunctions";
import { drawEspBox } from "../util/renderUtil"

let waypoints = []
let coordsRows = FileLib.read("Coleweight", "data/creepers.txt").split("\n")
coordsRows.forEach(unsplitRow => {
    let row = unsplitRow.split(" ")
    waypoints.push([parseInt(row[0]) + 0.5, parseInt(row[1]), parseInt(row[2]) + 0.5])
})

registerWhen(register("renderWorld", () => {
    waypoints.forEach(wp => {
        drawEspBox(wp[0], wp[1], wp[2], 1, 1, 0, 0.7, 0.7, 1, true)
    })
}), () => { return settings.creeperWaypoints && gunpowderCheck.check() })