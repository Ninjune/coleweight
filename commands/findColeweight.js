import axios from "../../axios"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function findColeweight(arg)
{
    ChatLib.chat(`${PREFIX}Finding Coleweight!`)
    let username = ""
    if(arg == undefined) 
        username = Player.getUUID()
    else 
        username = arg 
    axios.get(`https://ninjune.dev/api/coleweight?username=${username}`)
        .then(res => {
            let coleweightMessage = new TextComponent(`${PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%)`)
                .setHoverValue(`&fExperience&f: &a${res.data.exp}\n&fPowder&f: &a${res.data.pow}\n&fCollection&f: &a${res.data.col}\n&fMiscellaneous&f: &a${res.data.bes + res.data.nuc}`)
            ChatLib.chat(coleweightMessage)
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eError. (api may be down)`)
        })
}