import settings from "../../settings"
import { registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["settings", "config"],
    description: "Opens settings.",
    options: "",
    category: "settings",
    showInHelp: false,
    execute: (args) => {
        settings.openGUI()
    }
})