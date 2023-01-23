/*
Created 11/11/2022 by Ninjune.
*/
import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { addCommas, checkInDwarven, checkInHollows } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let cwlbData = [],
 newMessage, message, messagePrefix, cwlbPlayerData, onward

register("chat", (level, typeOfChat, hypixelRank, username, playerMessage, event) => { // CW Rank
    if(!settings.rankChat) return
    if(!settings.rankEverywhere && !(checkInHollows() || checkInDwarven())) return
    if(!settings.rankEverywhere && typeOfChat != "") return
    onward = true

    playerMessage.split(" ").forEach((chunk) => {
        if (chunk.startsWith("https"))
            onward = false
    })
    if(!onward || cwlbData == undefined) return
    cwlbPlayerData = cwlbData.filter(player => player.name == username)[0]
    if(cwlbPlayerData == undefined) return
    newMessage = new Message()
    message = ChatLib.getChatMessage(event, true),
    messagePrefix = message
    cancel(event)
        
    messagePrefix = message.slice(0, message.indexOf(':')) + ` &8[&6#${addCommas(cwlbPlayerData.rank)}&8]&f: `
    
    newMessage.addTextComponent(messagePrefix)

    if (hypixelRank == "" && typeOfChat == "")
        playerMessage = "&7" + playerMessage.slice(0)
    else
        playerMessage = "&f" + playerMessage.slice(0)
    
    newMessage.addTextComponent(playerMessage)
    ChatLib.chat(newMessage)
}).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(\[\w+\+{0,2}\] )?(\w{1,16})(?: \[\w{1,6}\])?: (.*)$/g)

register("gameLoad", () => {
    axios.get(`https://ninjune.dev/api/coleweight-leaderboard?length=500`)
    .then(res => {
        cwlbData = res.data
    })
    .catch(err => {
        ChatLib.chat(err)
    })
})

// first time check
register("step", () => {
    if (constants.data.first_time) 
    {
        constants.data.first_time = false
        constants.data.save()
        ChatLib.chat("")
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bPlease Set Your Api Key By Doing /api new`)).chat()
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bOr By Doing /cw setkey (key)`)).chat()
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bView commands: /cw help`)).chat()
        ChatLib.chat("")
    }
    if (constants.data.api_key == undefined || constants.data.api_key == "") return
}).setFps(1);


export default ""