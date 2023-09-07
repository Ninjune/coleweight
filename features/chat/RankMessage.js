import axios from "../../../axios"
import settings from "../../settings"
import { addCommas, isInTab } from "../../utils/Utils"

let cwlbData = []
let newMessage
let message
let messagePrefix = ""
let cwlbPlayerData
let onward

// not willing to recode this

register("chat", (level, typeOfChat, emblem, hypixelRank, username, ironman, playerMessage, event) => { // CW Rank
    if(!settings.rankChat || !World.isLoaded()) return
    if(!settings.rankEverywhere && !(isInTab("Crystal Hollows") || isInTab("Dwarven Mines"))) return
    if(!settings.rankEverywhere && typeOfChat != "") return
    onward = true

    playerMessage.split(" ").forEach((chunk) => {
        if (chunk.startsWith("https"))
            onward = false
        else if (chunk.startsWith("[ITEM:"))
            onward = false
    })
    if(!onward || cwlbData == undefined) return
    cwlbPlayerData = cwlbData.filter(player => player.name == username)[0]
    if(cwlbPlayerData == undefined) return
    newMessage = new Message()
    message = ChatLib.getChatMessage(event, true),
    cancel(event)

    messagePrefix = message.slice(0, message.indexOf(":")) + ` &8[${cwlbPlayerData.rank <= 50 ? "&b" : "&6"}#${addCommas(cwlbPlayerData.rank)}&8]&f: `

    newMessage.addTextComponent(messagePrefix)

    if (hypixelRank == "" && typeOfChat == "")
        playerMessage = "&7" + playerMessage.slice(0)
    else
        playerMessage = "&f" + playerMessage.slice(0)

    newMessage.addTextComponent(playerMessage)
    ChatLib.chat(newMessage)
}).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(.)? ?(\[\w+\+{0,2}\] )?(\w{1,16}) ?(♲)?(?: \[\w{1,6}\])?: (.*)$/g)

register("gameLoad", () => {
    axios.get("https://ninjune.dev/api/coleweight-leaderboard?length=500")
    .then(res => {
        cwlbData = res.data
    })
    .catch(err => {
        print(err)
    })
})