import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function toggle()
{
    constants.data.cwToggle = !constants.data.cwToggle
    constants.data.save()
    ChatLib.chat(`${PREFIX}&bSet gui to: &3${constants.data.cwToggle}`)
}