import { reloadCollection } from "../render/guis/collectionGui"
import { reloadColeweight } from "../render/guis/cwGui"
import { reloadDowntime } from "../render/guis/downtimeGui"
import constants from "../util/constants"


module.exports =
{ 
    aliases: ["reload"],
    description: "Reloads guis.",
    options: "(gui)",
    category: "settings",
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&cMust specify a gui. Hit tab on '/cw reload ' for options.`)
        switch(args[1].toLowerCase())
        {
            case "coleweight":
                reloadColeweight()
                break
            case "collection":
                reloadCollection()
                break
            case "downtime":
                reloadDowntime()
                break
            default:
                ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${args[1]}'.`)
        }
    }
}