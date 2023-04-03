import settings from "../settings"
import constants from "../util/constants"
let sidebarUpdated = false, currentServer, timers = { debug: -1, playerList: -1}
const Item2 = Java.type("net.minecraft.item.Item")

register("step", () => {
    if(!settings.streamerMode) return

    if(settings.streamerRandomizeLobby && !sidebarUpdated)
    {
        let serverScore, date

        Scoreboard.getLines(false).forEach((line) => {
            const unformattedLine = line.getName().removeFormatting().replace("🍫", "")
            const matches = /([0-9/]+) [mM][0-9a-zA-Z]+/g.exec(unformattedLine)
            if(matches != undefined)
            {
                serverScore = line.getPoints()
                date = matches[1]
            }
        })
        if(serverScore == undefined) return
        currentServer = randomServer()
        Scoreboard.setLine(serverScore, `§7${date} §8${currentServer}`, true)
        sidebarUpdated = true
    }

    Object.keys(timers).forEach(key => {
        timers[key]--
    })
}).setFps(20)


register("renderBossHealth", event => {
    if(!(settings.streamerMode && settings.streamerBlockBossbar)) return
    cancel(event)
})


register("renderPlayerList", event => {
    if(!(settings.streamerMode && settings.streamerBlockTab)) return
    if(timers.playerList <= 0)
    {
        timers.playerList = 20
        ChatLib.chat(`${constants.PREFIX}&bCW has canceled opening tab! (disable &aStreamer Mode&b in settings if you don't want this.)`)
    }

    cancel(event)
})


register("renderDebug", event => {
    if(!(settings.streamerMode && settings.streamerBlockDebug)) return
    if(timers.debug <= 0)
    {
        ChatLib.chat(`${constants.PREFIX}&bCW has canceled opening debug menu! (disable &aStreamer Mode&b in settings if you don't want this.)`)
        timers.debug = 20
    }
    cancel(event)
})

register("renderItemIntoGui", (item, x, y, event) => {
    if(!settings.debug) return
    cancel(event)
    //item.itemStack.func_150996_a(Item2.func_111206_d("minecraft:air")) // item.itemStack.setItem(Item.getByNameOrId())
})


register("renderHand", event => {
    if(!settings.debug) return
    cancel(event)
})

function randomServer()
{
    const letters = "ABCDEFGHIJKLMNOPQRS" // - list of letters
    const numbers = "0123456789" // - list of numbers
    return "m" + randomFromString(numbers) + randomFromString(numbers) + randomFromString(letters) + randomFromString(letters)
}


function randomFromString(str)
{
    let index = Math.floor(Math.random()*str.length)
    return str[index]
}


register("worldLoad", () => {
    sidebarUpdated = false
    currentServer = undefined
})