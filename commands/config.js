import { registerCommand } from "../commandManager"
import settings from "../settings"


registerCommand({
    aliases: ["settings", "config"],
    description: "Opens settings.",
    options: "",
    category: "settings",
    showInHelp: false,
    execute: (args) => {
        settings.openGUI()
    }
})