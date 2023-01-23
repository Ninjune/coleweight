import { openCoordsGui } from "../render/guis/coordsGui"

module.exports =
{ 
    aliases: ["coords", "coord", "cord"],
    description: "Opens coords GUI.",
    options: "",
    category: "waypoints",
    execute: (args) => {
        openCoordsGui()
    }
}