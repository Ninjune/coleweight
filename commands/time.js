import constants from "../util/constants"
const PREFIX = constants.PREFIX
let timerHr

export function time()
{
    timerHr = Math.floor(constants.timerdata.timer/60/60)

    if(timerHr >= 1)
        ChatLib.chat(`${PREFIX}&aTimer (${constants.serverData.server}): &b${timerHr}h ${Math.floor(constants.timerdata.timer/60) - timerHr*60}m`)
    else
        ChatLib.chat(`${PREFIX}&aTimer (${constants.serverData.server}): &b${Math.floor(constants.timerdata.timer/60)}m ${Math.floor(constants.timerdata.timer%60)}s`)
}