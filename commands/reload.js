import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function reload() 
{
    constants.upTimeTrack = false
    constants.stepsSinceLast = 0
    constants.cwValues = []
    constants.uptime = 0
    ChatLib.chat(`${PREFIX}Reloaded!`)
}