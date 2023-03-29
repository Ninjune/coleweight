import { registerCommand } from "../commandManager"
import { openCoordsGui } from "../render/coordsMenu"


registerCommand({
    aliases: ["coords", "coord", "cord", "cords"],
    description: "Opens coords GUI.",
    options: "",
    category: "waypoints",
    execute: (args) => {
        openCoordsGui()
    }
})