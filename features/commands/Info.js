import { infoCommand, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["cwinfo", "info"],
    description: "Gives cwinfo.",
    options: "",
    category: "info",
    execute: (args) => {
        infoCommand()
    }
})