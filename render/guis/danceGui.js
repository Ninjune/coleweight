import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { mirroverseCheck, Title } from "../../util/helperFunctions"
import { drawEspBox } from "../../util/renderUtil"
import { BaseGui } from "../BaseGui"
let danceTime = 0 // dance time is when the game checks for player failed challenge
let danceIndex = 0
let blockIndex = 0
const danceData = FileLib.read("Coleweight", "data/dance.txt").split("\n")
let updatedBlock = false
let punches = 0
let danceStreak = 0
const jumpTitle = new Title({text: "&cJump!", scale: 3, time: 650})
const punchMin = 0.2
const punchMax = 1.7
const blocks = [ [-265, 32, -108],
    [-265, 32, -106],
    [-263, 32, -106],
    [-263, 32, -108]
]

const danceGui = new BaseGui(["danceGui", "dance"], () => {
    const modifiedTime = Date.now()

    let dance = false
    blocks.forEach(block => {
        if(World.getBlockAt(block[0], block[1], block[2]).type.getRegistryName() == "minecraft:stained_glass")
            dance = true
    })

    if(danceIndex < 1)
        return

    if(danceIndex == 50)
    {
        danceStreak += 1
        danceIndex = 0
    }
    if(modifiedTime - danceTime >= 1000 && !updatedBlock)
    {
        blockIndex = (blockIndex+1)%4
        danceIndex += 1
        danceTime = modifiedTime
        danceTime = modifiedTime
        updatedBlock = true
    }

    if((2000 - (modifiedTime - danceTime)) < 1400 && (2000 - (modifiedTime - danceTime)) > 200)
        punches = 0

    if (modifiedTime - danceTime >= 2000)
    {
        updatedBlock = false
    }
    const currentTime = Math.floor(((2000-(modifiedTime-danceTime))/1000)  / 0.05) * 0.05
    const nextTime = currentTime+2
    let message = `${danceData[danceIndex-1]}&7: &b${Math.max(currentTime, 0).toFixed(2)}\n${danceData[danceIndex]}&7: &b${nextTime.toFixed(2)}`
    return `${danceIndex} / ${danceData.length-1}${danceStreak > 0 ? " Streak: " + danceStreak : ""}`
}, () => { return settings.danceTracker && mirroverseCheck.check() })
registerGui(danceGui)


register("renderTitle", (title, subtitle, event) => {
    if(!settings.danceTracker || !checkInMirrorverse())
        return
    if(subtitle.includes("§bMove!§r") && danceIndex == 0)
    {
        danceIndex = 1
        blockIndex = 1
        updatedBlock = false
        danceTime = Date.now()
        cancel(event)
    }
    else if (danceIndex >= 1)
        cancel(event)
})

let block = []
register("renderWorld", () => {
    if(danceIndex < 1)
        return
    block = blocks[blockIndex]
    let currentTime = Math.floor(((2000-(Date.now()-danceTime))/1000)  / 0.05) * 0.05

    if(danceIndex == 1)
        currentTime -= 1

    //Tessellator.drawString(danceData[danceIndex-1] + ` §b${Math.max(currentTime, 0).toFixed(2)}`, block[0] + 0.5, block[1] + 0.5, block[2] + 0.5, 0, true, 0.05, false)
    drawEspBox(block[0] + 0.5, block[1], block[2] + 0.5, 1, 1, 0, 1)
})

register("renderOverlay", () => {
    if(danceIndex < 1)
        return
    let currentTime = Math.floor(((2000-(Date.now()-danceTime))/1000)  / 0.05) * 0.05
    if((blockIndex == 1 || blockIndex == 3) && 2000-(Date.now()-danceTime) <= 1500)
    {
        const txt = `${Player.isSneaking() ? "&aSneaking!" : "&cSneak!"}`
        let sneakText = new Text(txt,
            Renderer.screen.getWidth()/2,
            Renderer.screen.getHeight()/2-Renderer.screen.getHeight()/9
        )
        sneakText.setShadow(true)
        sneakText.setScale(2)
        sneakText.setAlign("CENTER")
        sneakText.draw()
    }
    if((blockIndex == 1 || blockIndex == 2) && 2000-(Date.now()-danceTime) <= 500)
    {
        const txt = `${!Player.getPlayer().field_70122_E ? "&aJumping!" : "&cJump!"}`
        let jumpText = new Text(txt,
            Renderer.screen.getWidth()/2,
            Renderer.screen.getHeight()/2
        )
        jumpText.setShadow(true)
        jumpText.setScale(2)
        jumpText.setAlign("CENTER")
        jumpText.draw()
    }
    if(currentTime >= punchMin && currentTime < punchMax)
        return
    const txt = `${punches != 0 ? "&aPunched!" : "&cPunch!"}`
    let punchText = new Text(txt,
        Renderer.screen.getWidth()/2,
        Renderer.screen.getHeight()/2+Renderer.screen.getHeight()/12
    )
    punchText.setShadow(true)
    punchText.setScale(2)
    punchText.setAlign("CENTER")
    punchText.draw()
})


register("hitBlock", block => {
    if(danceIndex < 1)
        return
    let currentTime = Math.floor(((2000-(Date.now()-danceTime))/1000)  / 0.05) * 0.05
    if(currentTime >= punchMin && currentTime < punchMax)
        return
    punches += 1
    ChatLib.chat(2000-(Date.now()-danceTime))
})


register("attackEntity", e => {
    if(danceIndex < 1)
        return
    let currentTime = Math.floor(((2000-(Date.now()-danceTime))/1000)  / 0.05) * 0.05
    if(currentTime >= punchMin && currentTime < punchMax)
        return
    punches += 1
    ChatLib.chat(2000-(Date.now()-danceTime))
})

register("chat", message => {
    if(!((message.startsWith("You wer") || message.startsWith("You didn")) && message.endsWith("!")))
        return
    danceIndex = 0
    danceStreak = 0
}).setChatCriteria(/(.+)/g)


register("worldLoad", () => {
    danceIndex = 0
    danceStreak = 0
})


register("soundPlay", (pos, name, volume, pitch, category, event) => {
    if(pitch != 0.6984127163887024 ||
        name != "note.bassattack"
    )
        return
    danceTime = Date.now()-1000
}) // note.bassattack ; 1 ; 0.6984127163887024 ; RECORDS ;  (8)

/*
-265 32 -108 green
-265 31 -106 blue
-263 32 -106 red
-265 32 -108 pink
2s between blocks
*/