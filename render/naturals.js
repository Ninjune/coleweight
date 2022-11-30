import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { waypointRender } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let coords = []


register("step", () => {
    if(constants.serverData.map != "Crystal Hollows") return
    axios.get(`https://ninjune.dev/api/coords`)
    .then((res) => {
        coords = []
        res.data.filter(coord => 
            (((-1 * settings.naturalRange)/2 < (parseInt(Player.getX()) - coord.x)) && ((parseInt(Player.getX()) - coord.x) < settings.naturalRange/2)
            && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getY()) - coord.y)) && ((parseInt(Player.getY()) - coord.y) < settings.naturalRange/2)
            && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getZ()) - coord.z)) && ((parseInt(Player.getZ()) - coord.z) < settings.naturalRange/2))
        ).forEach(coord => {
            coords.push([coord.x, coord.y, coord.z])
        })
    })
    .catch((err) => {
        console.log(err)
    })
}).setFps(1)


register("renderWorld", () => {
    if(!settings.showNaturals) return
    if(coords.length < 1) return
    waypointRender(coords)
})

register("worldUnload", () => {
    coords = []
})


export default ""