// Major credit to Fabi019 for Powdertracker module.

import settings from "../../settings"
import { BaseGui } from "../../utils/BaseGui"
import { registerGui } from "../../utils/GuIManager"
import { addCommas, addNotation, data } from "../../utils/Utils"

let sessionRunning = false
let sessionChests = 0
let sessionGemstone = 0
let sessionMithril = 0
let seconds = 0
let timeSinceLastGain = 0

const powderGui = new BaseGui(["powdertrackerGui", "powdertracker", "powder"], () => {
    if (!powderGui.isOpen() && (!settings.trackerVisible || !sessionRunning)) return

    let uptimeHr = Math.floor(seconds/60/60)
    let lines = []
    let message = ""

    if (settings.showTotals){
        addText("Total Chest", addCommas(data.powdertrackerGui.chests), lines)
        addText("Total Gemstone", addNotation("oneLetters", data.powdertrackerGui.gemstonePowder), lines)
        addText("Total Mithril", addNotation("oneLetters", data.powdertrackerGui.mithrilPowder), lines)
    }

    addText("Session Chests", addCommas(sessionChests), lines)
    addText("Session Gemstone", addNotation("oneLetters", sessionGemstone), lines)
    addText("Session Mithril", addNotation("oneLetters", sessionMithril), lines)


    if (settings.showRates){
        addText("Chests/hr", addCommas(Math.round(((sessionChests ?? 0)/(seconds ?? 1)) * 3600)), lines)
        addText("Gemstone/hr", addNotation("oneLetters", Math.round(((sessionGemstone ?? 0)/(seconds ?? 1)) * 3600)), lines)
        addText("Mithril/hr", addNotation("oneLetters", Math.round(((sessionMithril ?? 0)/(seconds ?? 1)) * 3600)), lines)
        if(uptimeHr >= 1)
            addText("Uptime", `${uptimeHr}h ${Math.floor(seconds/60) - uptimeHr*60}m`, lines)
        else
            addText("Uptime", `${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`, lines)
    }

    lines.forEach((line) => {
        message += line + "\n"
    })

    return message
}, "trackerVisible", [
    register("step", () => {
        if(sessionRunning){
            seconds += 1
            timeSinceLastGain += 1
        }
        if(timeSinceLastGain > 300 && sessionRunning){
            sessionRunning = false
        }
    }).setFps(1)
], false, resetVars)

registerGui(powderGui)

function DoublePowderActive(){
    const bossBar = Java.type("net.minecraft.entity.boss.BossStatus")?.field_82827_c
    if(bossBar == undefined)
        return false
    return bossBar.includes("2X POWDER")
}

register("chat", (value, type) => {
    let powder = parseInt(value)

    if (DoublePowderActive())
        powder *= 2
    if(type.toLowerCase() == "gemstone"){
        data.powdertrackerGui.gemstonePowder += powder
        sessionGemstone += powder
    }
    else if (type.toLowerCase() == "mithril"){
        data.powdertrackerGui.mithrilPowder += powder
        sessionMithril += powder
    }

    data.save()
    timeSinceLastGain = 0
    sessionRunning = true
}).setCriteria(/You received \+([0-9]+) ([a-zA-Z]+) Powder./g)

register("chat", () => {
    data.powdertrackerGui.chests += 1
    sessionChests += 1
    sessionRunning = true
}).setCriteria("&r&6You have successfully picked the lock on this chest!&r")

function addText(item, value, lines){
    lines.push("&a" + item + ": &b" + value)
}

function resetVars(){
    sessionRunning = false,
    sessionChests = 0,
    sessionGemstone = 0,
    sessionMithril = 0,
    seconds = 0,
    timeSinceLastGain = 0
}