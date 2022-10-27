import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function setkey(arg2)
{
    if(arg2 == undefined) { ChatLib.chat(`${PREFIX}&eRequires an argument!`); return; }
    else key = arg2

    constants.data.api_key = key
    constants.data.save()
    axios.get(`https://api.hypixel.net/key?key=${constants.data.api_key}`)
    .then(res => {
        if(res.data.success == true)
            ChatLib.chat(`${PREFIX}&aSuccsessfully set api key!`)
        else
            ChatLib.chat(`${PREFIX}&eKey is not valid!`)
    })
    .catch(err => {
        ChatLib.chat(`${PREFIX}&eKey is not valid!`)
    })
}