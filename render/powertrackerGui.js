/*
Major credit to Fabi019 for Powdertracker module.
*/
import constants from "../util/constants"
import settings from "../settings"

const moveGui = new Gui(),
 powderGui = new Display(),
 bossBar = Java.type("net.minecraft.entity.boss.BossStatus").field_82827_c

powderGui.setBackgroundColor(Renderer.color(0, 0, 0, 75));
powderGui.setBackground("full");

let sessionRunning = false,
 sessionChests = 0,
 sessionGemstone = 0,
 sessionMithril = 0,
 seconds = 0,
 timeSinceLastGain = 0

export function openPowderGui()
{
    moveGui.open()
}

function DoublePowderActive() 
{
    return bossBar.includes("2X POWDER")
}

register("dragged", (dx, dy, x, y) => {
    if (!moveGui.isOpen()) return
    sessionRunning = true
    powderGui.setRenderLoc(x, y)
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
    timeSinceLastGain = 0
    sessionRunning = true
}).setCriteria(/You received \+([0-9]+) ([a-zA-Z]+) Powder/g)

register("chat", event => {
    constants.powderdata.chests += 1
    sessionChests += 1
    sessionRunning = true
}).setCriteria("&r&6You have successfully picked the lock on this chest!&r");

export function updateDisplay() 
{
    if (!sessionRunning) {powderGui.setShouldRender(false); return}
    else if (!settings.trackerVisible) {powderGui.setShouldRender(false); return}
    else {powderGui.setShouldRender(true)}

    const renderText = (text, value) => {
        powderGui.setLine(line++, `§a${text}: §b${value}`)
    }
    
    let uptimeHr = Math.floor(seconds/60/60),
     lines = [],
     line = 0
    
    powderGui.clearLines()
    powderGui.setRenderLoc(constants.powderdata.x, constants.powderdata.y)
    powderGui.setAlign(
        settings.trackerAlignment == 0 ? "left" : 
        settings.trackerAlignment == 1 ? "right" :
        "center"
    )
        
    if (settings.showTotals) 
    {
        renderText("Total Chests", constants.powderdata.chests)
        renderText("Total Gemstone", constants.powderdata.gemstonePowder)
        renderText("Total Mithril", constants.powderdata.mithrilPowder)
        line++
    }

    renderText("Session Chests", sessionChests)
    renderText("Session Gemstone", sessionGemstone)
    renderText("Session Mithril", sessionMithril)


    if (settings.showRates) 
    {
        line++
        renderText("Chests/hr", Math.round(((sessionChests ?? 0)/(seconds ?? 1)) * 3600))
        renderText("Gemstone/hr", Math.round(((sessionGemstone ?? 0)/(seconds ?? 1)) * 3600))
        renderText("Mithril/hr", Math.round(((sessionMithril ?? 0)/(seconds ?? 1)) * 3600))
        if(uptimeHr >= 1)
            renderText("Uptime", `${uptimeHr}h ${Math.floor(seconds/60) - uptimeHr*60}m`)
        else
            renderText("Uptime", `${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`)
    }
}

register("renderOverlay", () => {
    if (moveGui.isOpen()) 
    {
        let txt = "Drag to move."
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }
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
    updateDisplay()
}).setFps(1)
