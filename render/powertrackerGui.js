/*
Major credit to Fabi019 for Powdertracker module.
*/
import constants from "../util/constants"
import settings from "../settings"

const powderGui = new Gui(),
 bossBar = Java.type("net.minecraft.entity.boss.BossStatus").field_82827_c

let sessionRunning = false,
 sessionChests = 0,
 sessionGemstone = 0,
 sessionMithril = 0,
 seconds = 0,
 timeSinceLastGain = 0

export function openPowderGui()
{
    powderGui.open()
}

function DoublePowderActive() 
{
    return bossBar.includes("2X POWDER")
}

register("dragged", (dx, dy, x, y) => {
    if (!powderGui.isOpen()) return
    constants.powderdata.x = x
    constants.powderdata.y = y
    constants.powderdata.save()
})

register("chat", (value, type) => {
    let powder = parseInt(value)

    if (DoublePowderActive()) 
        powder *= 2 
    if(type.toLowerCase() == "gemstone")
    {
        constants.powderdata.gemstonePowder += powder
        sessionGemstone += powder
    }
    else if (type.toLowerCase() == "mithril")
    {
        constants.powderdata.mithrilPowder += powder
        sessionMithril += powder
    }
    constants.powderdata.save()
    timeSinceLastGain = 0
    sessionRunning = true
}).setCriteria(/You received \+([0-9]+) ([a-zA-Z]+) Powder/g)

register("chat", event => {
    constants.powderdata.chests += 1
    sessionChests += 1
    sessionRunning = true
}).setCriteria("&r&6You have successfully picked the lock on this chest!&r");

register("renderOverlay", () => {
    if (powderGui.isOpen()) 
    {
        let txt = "Drag to move."
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }
    if (!settings.trackerVisible || !sessionRunning) return
    
    let uptimeHr = Math.floor(seconds/60/60),
     lines = [], 
     message =""
    
    function addText(item, value)
    {
        lines.push("&a" + item + ": &b" + value)
    }

    if (settings.showTotals) 
    {
        addText("Total Chest", constants.powderdata.chests)
        addText("Total Gemstone", constants.powderdata.gemstonePowder)
        addText("Total Mithril", constants.powderdata.mithrilPowder)
    }

    addText("Session Chests", sessionChests)
    addText("Session Gemstone", sessionGemstone)
    addText("Session Mithril", sessionMithril)


    if (settings.showRates) 
    {
        addText("Chests/hr", Math.round(((sessionChests ?? 0)/(seconds ?? 1)) * 3600))
        addText("Gemstone/hr", Math.round(((sessionGemstone ?? 0)/(seconds ?? 1)) * 3600))
        addText("Mithril/hr", Math.round(((sessionMithril ?? 0)/(seconds ?? 1)) * 3600))
        if(uptimeHr >= 1)
            addText("Uptime", `${uptimeHr}h ${Math.floor(seconds/60) - uptimeHr*60}m`)
        else
            addText("Uptime", `${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`)
    }

    lines.forEach((line) => {
        message += line + "\n"
    })
    Renderer.drawStringWithShadow(message, constants.powderdata.x, constants.powderdata.y)
})

register("step", () => {
    if(sessionRunning)
    {
        seconds += 1
        timeSinceLastGain += 1
    }
    if(timeSinceLastGain > 300 && sessionRunning)
    {
        sessionRunning = false
    }
}).setFps(1)
