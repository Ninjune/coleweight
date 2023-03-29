import { registerCommand } from "../commandManager"
import { updateDrillStrength } from "../render/dilloStatsUpdate"

registerCommand({
    aliases: ["setdrill"],
    description: "Sets current drill strength.",
    options: "",
    category: "settings",
    execute: (args) => {
        updateDrillStrength()
    }
})