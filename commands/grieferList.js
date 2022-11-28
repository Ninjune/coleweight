/*import settings from "../settings" // future
import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function grieferList(arg2, arg3)
{
    switch(arg2)
    {
        case "list":
            break
        case "add":
            let griefers = JSON.parse(FileLib.read("Coleweight", "config/grieferlist.txt"))
            griefers.push({griefers: [name]})
            FileLib.write("Coleweight", "config/grieferlist.txt", `${JSON.stringify(griefers)}`)
            ChatLib.chat(`${PREFIX}&aAdded ${arg3} to griefer list!`)
            break
        case "remove":
            break
        default:
            ChatLib.chat(`${PREFIX}&cArgument '${arg2 ?? ""}' not found`)
            break
    }
}*/