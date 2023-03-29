import { registerCommand } from "../commandManager"
import { capitalizeFirst, helpCommand } from "../util/helperFunctions"
import helpCommands from "../commandManager"


registerCommand({
    aliases: ["help"],
    description: "This.",
    options: "",
    showInHelp: false,
    execute: (args) => {
        ChatLib.chat(ChatLib.getCenteredText("&b--------------[ &a&lColeweight &b]--------------"))
        ChatLib.chat(ChatLib.getCenteredText("&7(Hover over command to see usage.)"))
        Object.keys(helpCommands).forEach(key => {
            ChatLib.chat(ChatLib.getCenteredText("&a&l" + capitalizeFirst(key)))
            helpCommands[key].forEach(command => {
                helpCommand(command.name, command.description, command.options)
            })
        })
        ChatLib.chat(ChatLib.getCenteredText("&b--------------------------------------------"))
    },
})