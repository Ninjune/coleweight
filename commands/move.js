import { openCollectionGui } from "../render/guis/collectionGui";
import { openCwGui } from "../render/guis/cwGui";
import { openDowntimeGui } from "../render/guis/downtimeGui";
import { openPowderGui } from "../render/guis/powertrackerGui";
import { openTimerGui } from "../render/guis/timerGui";
import { openMiningAbilitiesGui } from "../render/miningAbilities";
import constants from "../util/constants"


module.exports =
{ 
    aliases: ["move"],
    description: "Move guis.",
    options: "(gui)",
    category: "miscellaneous",
    showInHelp: false,
    execute: (args) => {
        if (args[1] == undefined) {ChatLib.chat(`${constants.PREFIX}&cNot enough arguments.`); return}
        switch(args[1].toLowerCase())
        {
            case "coleweight":
                openCwGui()
                break
            case "powdertracker":
                openPowderGui()
                break
            case "time":
            case "timer":
                openTimerGui()
                break
            case "downtime":
                openDowntimeGui()
                break
            case "collection":
                openCollectionGui()
                break
            case "miningabilities":
                openMiningAbilitiesGui()
                break
            default:
                ChatLib.chat(`${constants.PREFIX}&cNo such gui as '${args[1]}'.`)
        }
    }
}