import constants from "../util/constants"
import { addCommas } from "../util/helperFunctions"
const PREFIX = constants.PREFIX

export function info()
{
    let cwinfo = constants.CWINFO,
     values = {"experience" : "", "powder": "", "collection": "", "miscellaneous": ""}
    
    cwinfo.forEach(info => {
        values[info.category] += `&b${addCommas(info.cost)} ${info.nameStringed}\n`
    })

    ChatLib.chat(
    `${PREFIX}&bEach of the following are equivalent to one unit of ColeWeight` +
    "\n&4&lExperience\n" + values.experience +
    "\n&4&lPowder\n" + values.powder +
    "\n&4&lCollections\n" + values.collection +
    "\n&4&lMiscellaneous\n" + values.miscellaneous)
}