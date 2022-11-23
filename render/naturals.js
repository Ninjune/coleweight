import axios from "../../axios" // USE AT YOUR OWN RISK disabled by default in this version because dragoonmaster4 wants me to confirm that this isn't bannable with admins before adding. 
import settings from "../settings"
import constants from "../util/constants"
const PREFIX = constants.PREFIX
let coords = []

register("step", () => {
    if(constants.serverData.map != "Crystal Hollows" || !settings.showNaturals) return
    axios.get(`https://ninjune.dev/api/coords`)
    .then((res) => {
        coords = []
        res.data.filter(coord => 
            (((-1 * settings.naturalRange)/2 < (parseInt(Player.getX()) - coord.x)) && ((parseInt(Player.getX()) - coord.x) < settings.naturalRange/2)
            && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getY()) - coord.y)) && ((parseInt(Player.getY()) - coord.y) < settings.naturalRange/2)
            && ((-1 * settings.naturalRange)/2 < (parseInt(Player.getZ()) - coord.z)) && ((parseInt(Player.getZ()) - coord.z) < settings.naturalRange/2))
        ).forEach(coord => {
            coords.push({x: coord.x, y: coord.y, z: coord.z})
        })
    })
    .catch((err) => {
        console.log(err)
    })
}).setFps(1)

register("renderWorld", () => {
    if(!settings.showNaturals) return
    if(coords.length < 1) return
    coords
    .forEach((coord) => {
        Tessellator.drawString(Math.floor((Math.abs(parseInt(Player.getX()) - coord.x) + Math.abs(parseInt(Player.getY()) - coord.y) + Math.abs(parseInt(Player.getZ()) - coord.z))/3) + "m", coord.x, coord.y, coord.z)
    })
})

export default ""