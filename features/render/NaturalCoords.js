import { addEvent } from "../../FeatureBase"
import settings from "../../settings"
import { waypointRender } from "../../utils/Utils"
let coords = JSON.parse(FileLib.read("Coleweight", "data/naturalCoords.json")) ?? []
let visibleCoords = []

addEvent("showNaturals", register("step", () => {
    if(!settings.showNaturals || coords.length < 1) return
    
    visibleCoords = []

    coords.forEach(coord => {
        if (!(((-1 * settings.naturalRange)/2 < (parseInt(Player.getX()) - coord.x)) && ((parseInt(Player.getX()) - coord.x) < settings.naturalRange/2)
        && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getY()) - coord.y)) && ((parseInt(Player.getY()) - coord.y) < settings.naturalRange/2)
        && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getZ()) - coord.z)) && ((parseInt(Player.getZ()) - coord.z) < settings.naturalRange/2)))
            return

        visibleCoords.push([coord.x, coord.y, coord.z])
    })
}).setFps(1), [
    register("renderWorld", () => {
        if(!settings.showNaturals || visibleCoords.length < 1) return
        waypointRender(visibleCoords)
    })
], "Mines", null)

register("worldUnload", () => {
    visibleCoords = []
})