import { registerCommands } from "../../utils/Utils"
import { openCoordsGui } from "../render/CoordsMenu"

registerCommands({
    aliases: ["coords", "coord", "cord", "cords"],
    description: "Opens coords GUI.",
    options: "",
    category: "waypoints",
    execute: (args) => {
        openCoordsGui()
    }
})