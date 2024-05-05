import settings from "../settings"
import { hollowsChecker, registerWhen, waypointRender } from "../util/helperFunctions"
let coords = [],
 visibleCoords = []


register("gameLoad", res => {
    coords = JSON.parse(FileLib.read("Coleweight", "data/naturalCoords.json"))
})


registerWhen(register("step", () => {
    if(coords.length < 1) return
    visibleCoords = []
    coords.filter(coord =>
        (((-1 * settings.naturalRange)/2 < (parseInt(Player.getX()) - coord.x)) && ((parseInt(Player.getX()) - coord.x) < settings.naturalRange/2)
        && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getY()) - coord.y)) && ((parseInt(Player.getY()) - coord.y) < settings.naturalRange/2)
        && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getZ()) - coord.z)) && ((parseInt(Player.getZ()) - coord.z) < settings.naturalRange/2))
    ).forEach(coord => {
        visibleCoords.push([coord.x, coord.y, coord.z])
    })
}).setFps(1), () => { return settings.showNaturals && hollowsChecker.check() })


registerWhen(register("renderWorld", () => {
    if(visibleCoords.length < 1) return
    waypointRender(visibleCoords)
}), () => { return settings.showNaturals })


register("worldUnload", () => {
    visibleCoords = []
})


export default ""