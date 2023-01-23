import Settings from "../settings"

module.exports =
{ 
    aliases: ["settings", "config"],
    description: "Opens settings.",
    options: "",
    category: "settings",
    showInHelp: false,
    execute: (args) => {
        Settings.openGUI()
    }
}