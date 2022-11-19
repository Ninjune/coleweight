/*
Created 11/11/2022 by Ninjune.
*/
import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { addCommas } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let cwlbData = [],
 newMessage, message, messagePrefix, cwlbPlayerData, onward

register("chat", (level, typeOfChat, hypixelRank, username, playerMessage, event) => { // CW Rank
    if(!settings.rankChat) return
    if(!settings.rankEverywhere && !(constants.serverData.map == "Crystal Hollows" || constants.serverData.map == "Dwarven Mines")) return
    if(!settings.rankEverywhere && typeOfChat != "") return
    onward = true

    playerMessage.split(" ").forEach((chunk) => {
        if (chunk.startsWith("https"))
            onward = false
    })
    if(!onward || cwlbData == undefined) return
    cwlbPlayerData = cwlbData.filter(player => player.name == username)[0]
    if(cwlbPlayerData == undefined) return
    cancel(event)
    newMessage = new Message()
    message = ChatLib.getChatMessage(event, true),
    messagePrefix = message
        
    if(cwlbPlayerData.rank > 0 && cwlbPlayerData.rank < 501)
        messagePrefix = message.slice(0, message.indexOf(':')) + ` &8[&6#${addCommas(cwlbPlayerData.rank)}&8]&f: `
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
}).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(\[\w+\+{0,2}\] )?(\w{1,16})(?: \[\w{1,6}\])?: (.*)$/g)

register("worldLoad", () => {
    axios.get(`https://ninjune.dev/api/coleweight-leaderboard`)
    .then(res => {
        cwlbData = res.data
    })
    .catch(err => {
        ChatLib.chat(err)
    })
})

export default ""