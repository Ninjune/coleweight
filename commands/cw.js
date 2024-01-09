import axios from "../../axios"
import { findGriefer } from "../chat/grieferTrack"
import { registerCommand } from "../commandManager"
import constants from "../util/constants"


registerCommand({
    aliases: ["find"],
    description: "Gets the Coleweight of specified user.",
    options: "[player]",
    category: "info",
    execute: (args) => {
        findColeweight(args[1])
    }
})


function findColeweight(name)
{
    ChatLib.chat(`${constants.PREFIX}Finding Coleweight!`)
    let username = ""
    if(name == undefined)
        username = Player.getUUID()
    else
        username = name
    axios.get(`https://ninjune.dev/api/coleweight?username=${username}`)
    .then(res => {
        if(res.data.code != undefined)
            return ChatLib.chat(`${constants.PREFIX}&e${res.data.error} Code: ${res.data.code}`)

        let griefer = findGriefer(username), coleweightMessage

        if(griefer.found)
            coleweightMessage = new TextComponent(`${constants.PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%) &c&lHas griefed before. &cLast grief: &a${griefer.dateObj.toString().slice(4, 15)}`)
        else
            coleweightMessage = new TextComponent(`${constants.PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%)`)
        coleweightMessage.setHoverValue(`&fExperience&f: &a${Math.round(res.data.experience.total*100) / 100}\n&fPowder&f: &a${Math.round(res.data.powder.total*100) / 100}\n&fCollection&f: &a${Math.round(res.data.collection.total*100) / 100}\n&fMiscellaneous&f: &a${Math.round(res.data.miscellaneous.total*100) / 100}`)
        ChatLib.chat(coleweightMessage)
    })
    .catch(err => {
        if(settings.debug) ChatLib.chat(`${constants.PREFIX}&eError. (api may be down) ${err}`)
        else ChatLib.chat(`${constants.PREFIX}&eError. (api may be down)`)
    })
}
