const { capitalizeFirst, helpCommand } = require("../util/helperFunctions")

const File = Java.type("java.io.File")
const fileNames = new File(Config.modulesFolder + "/Coleweight/commands").list()
let commands = [], helpCommands = {info: [], settings: [], waypoints: [], miscellaneous: []},
 fileNames2, file, meta

fileNames.forEach(fileName => {
    file = new File(Config.modulesFolder + "/Coleweight/commands/" + fileName)

    if(file.isDirectory())
    {
        meta = JSON.parse(FileLib.read("Coleweight", "commands/" + fileName + "/meta.json"))
        if(meta.include)
        {
            fileNames2 = file.list()
            fileNames2.forEach(fileName2 => {
                if(fileName2.endsWith(".js"))
                    commands.push(require("./" + fileName + "/" + fileName2))
            })
        }
    }
    else if (!file.isDirectory() && fileName != "help.js")
        commands.push(require("./" + fileName))
})

commands.forEach(command => {
    if(command.showInHelp ?? true)
        helpCommands[command.category].push({name: command.aliases[0], description: command.description, options: command.options})
})

module.exports =
{ 
    aliases: ["help"],
    description: "This.",
    options: "",
    showInHelp: false, // wont actually do anything
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
}