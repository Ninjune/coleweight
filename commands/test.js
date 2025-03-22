import { registerCommand } from "../commandManager"
import { trackCollection, resetTest } from "../render/guis/miningtestGui"
import constants from "../util/constants"


export default registerCommand({
    aliases: ["test"],
    description: "Manages mining test",
    category: "miscellaneous",
    options: ["(start, reset, set)"],
    subcommands: [["start", "reset","set"]],
    execute: (args) => {
        let timer = constants.data.timerGui.timer
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bOptions are: &3start&b, &3reset&b, &3set&b.`)
        if(args[1].toLowerCase() == "start")
        {
            timer = 1800
            constants.data.testTitlePlay = true
            ChatLib.chat(`${constants.PREFIX}&bSet timer to ${Math.floor(timer/60)}m ${Math.ceil(timer%60)}s`)
        }
        else if (args[1].toLowerCase() == "reset"){
        resetTest()
        ChatLib.chat(`${constants.PREFIX}&bTest has been reset!`)
    }
        else if (args[1].toLowerCase() == "set"){
            trackCollection(args[2])
        }
        else
            return ChatLib.chat(`${constants.PREFIX}&bOptions are: &3start&b, &3reset&b, &3set&b.`)
        constants.data.miningtestgui.timer = timer
        constants.data.miningtestgui.maxtimer = timer
        constants.data.save()
    }
})