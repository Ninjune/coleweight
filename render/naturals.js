import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { waypointRender } from "../util/helperFunctions"
let coords = [],
 visibleCoords = []

register("gameLoad", res => {
    axios.get(`https://ninjune.dev/api/coords`)
    .then((res) => {
        coords = res.data
    })
    .catch((err) => {
        if(settings.debug) return console.log(err)
    })
})

register("step", () => {
    if(constants.serverData.map != "Crystal Hollows" || !settings.showNaturals || coords.length < 1) return
    visibleCoords = []
    coords.filter(coord => 
        (((-1 * settings.naturalRange)/2 < (parseInt(Player.getX()) - coord.x)) && ((parseInt(Player.getX()) - coord.x) < settings.naturalRange/2)
        && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getY()) - coord.y)) && ((parseInt(Player.getY()) - coord.y) < settings.naturalRange/2)
        && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getZ()) - coord.z)) && ((parseInt(Player.getZ()) - coord.z) < settings.naturalRange/2))
    ).forEach(coord => {
        visibleCoords.push([coord.x, coord.y, coord.z])
    })
}).setFps(1)


register("renderWorld", () => {
    if(!settings.showNaturals) return
    if(visibleCoords.length < 1) return
    waypointRender(visibleCoords)
})

register("worldUnload", () => {
    visibleCoords = []
})


export default ""