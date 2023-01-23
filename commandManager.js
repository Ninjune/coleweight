import Settings from "./settings"
const File = Java.type("java.io.File")
const fileNames = new File(Config.modulesFolder + "/Coleweight/commands").list()
let commandNames = [],
 commands = [],
 fileNames2, file, meta, stop, defaultCommand

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
                    commands.push(require("./commands/" + fileName + "/" + fileName2))
            })
        }
    }
    else if (!file.isDirectory())
        commands.push(require("./commands/" + fileName))
})

commands.forEach(command => {
    if(command.aliases[1] == "")
        defaultCommand = command
    else
        commandNames.push(...command.aliases)
})

register("command", (...args) => {
    stop = false
    if (args == undefined || args[0] == undefined) { Settings.openGUI(); return }

    commands.forEach(command => {
        if((command.cw ?? true) && command.aliases.includes(args[0].toString().toLowerCase()))
        {
            command.execute(args)
            stop = true
        }
    })

    if(!stop) defaultCommand.execute(args)
}).setTabCompletions((args) => {
    let output = [],
        reloadOptions = ["coleweight", "collection"],
        calculateOptions = ["tick", "ms2toprofessional", "hotm", "calchotm"]
    
    if(args[0].length == 0 || args[0] == undefined)
        return output = commandNames

    switch(args[0])
    {
        case "reload":
            output = findTabOutput(args[1], reloadOptions)
            break
        case "calculate":
        case "calc":
            output = findTabOutput(args[1], calculateOptions)
            break
        default:
            output = findTabOutput(args[0], commandNames)
            break
    }
    return output
}).setName("cw").setAliases(["coleweight"])


register("command", (...args) => {
    commands.find(command => command.aliases[0] == "fetchdiscord").execute(args)
}).setTabCompletions((args) => {
    let players = World.getAllPlayers().map((p) => p.getName())
    .filter((n) =>
        n.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : "")
    )
    .sort()
        
    return players
}).setName("fetchdiscord").setAliases(["fdiscord"]);    


function findTabOutput(input, options)
{
    let output = []

    if(input == undefined || input == "") return options
    options.forEach(option => {
        for(let char = 0; char < input.length; char++)
        {
            if(option[char] != input[char])
                break
            else if(char == input.length - 1)
                output.push(option)
        }
    })

    return output
}