import axios from "../../axios"
import settings from "../settings"
import constants from "../util/constants"
import { addCommas, checkInDwarven, checkInHollows } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let cwlbData = [],
 newMessage, message, messagePrefix = "", cwlbPlayerData, onward

register("chat", (level, typeOfChat, hypixelRank, username, ironman, playerMessage, event) => { // CW Rank
    if(!settings.rankChat) return
    if(!settings.rankEverywhere && !(checkInHollows() || checkInDwarven())) return
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
}).setCriteria(/^(\[\d+\] )?((?:(?:Guild|Party|Co-op) > )|(?:\[:v:\] ))?(\[\w+\+{0,2}\] )?(\w{1,16}) ?(♲)?(?: \[\w{1,6}\])?: (.*)$/g)

register("gameLoad", () => {
    axios.get("https://ninjune.dev/api/coleweight-leaderboard?length=500")
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
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bJoin my discord &3here&b to keep up with development!`))
        .setClickAction("open_url")
        .setClickValue("https://discord.gg/yj4P4FqHPA")
        .chat()
        ChatLib.chat("")
    }
}).setFps(1)


export default ""