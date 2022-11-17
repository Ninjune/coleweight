/*
Created 11/11/2022 by Ninjune.
*/

import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { addCommas } from "../util/helperFunctions"
const PREFIX = constants.PREFIX

register("chat", (level, typeOfChat, hypixelRank, username, playerMessage, event) => { // CW Rank
    if(!settings.rankChat) return
    if(!settings.rankEverywhere && !(constants.serverData.map == "Crystal Hollows" || constants.serverData.map == "Dwarven Mines")) return
    if(!settings.rankEverywhere && typeOfChat != "") return
    let onward = true

    playerMessage.split(" ").forEach((chunk) => {
        if (chunk.startsWith("https"))
            onward = false
    })
    if(!onward) return

    let message = ChatLib.getChatMessage(event, true),
     messagePrefix = message,
     newMessage = new Message()
    cancel(event)
    axios.get(`https://ninjune.dev/api/lbpos?username=${username}`)
    .then(res => {
        if(res.data.rank > 0 && res.data.rank < 501)
            messagePrefix = message.slice(0, message.indexOf(':')) + ` &8[&6#${addCommas(res.data.rank)}&8]&f: `
        else if(hypixelRank == "" && typeOfChat == "")
            messagePrefix = message.slice(0, message.indexOf(':')) + `&7: `
        else
            messagePrefix = message.slice(0, message.indexOf(':')) + `&f: `
        
        newMessage.addTextComponent(messagePrefix)

        if (hypixelRank == "" && typeOfChat == "")
            playerMessage = "&7" + playerMessage.slice(0)
        else
            playerMessage = "&f" + playerMessage.slice(0)
        
        newMessage.addTextComponent(playerMessage)
        ChatLib.chat(newMessage)
    })
    .catch(err => {
        ChatLib.chat(err)
    })
}).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(\[\w+\+{0,2}\] )?(\w{1,16})(?: \[\w{1,6}\])?: (.*)$/g)

export default ""