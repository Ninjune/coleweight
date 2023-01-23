import constants from "../util/constants"

module.exports =
{ 
    aliases: ["timer", "time"],
    description: "Sets timer.",
    category: "miscellaneous",
    options: ["(time) - 30m, 1h, 30s"],
    execute: (args) => {
        if(args[1] == undefined)
            constants.timerdata.timer = 0
        else if(args[1].includes('h'))
            constants.timerdata.timer = parseInt(args[1])*60*60 ?? 0
        else if(args[1].includes('m'))
            constants.timerdata.timer = parseInt(args[1])*60 ?? 0
        else
            constants.timerdata.timer = parseInt(args[1]) ?? 0
        constants.timerdata.save()

        ChatLib.chat(`${constants.PREFIX}&bSet timer to ${Math.ceil(constants.timerdata.timer/60)}m`)
    }
}