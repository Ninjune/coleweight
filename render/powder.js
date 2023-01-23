/*import constants from "../../util/constants" // will add later im too tired
import { findGemstonesPerHr } from "../../util/helperFunctions"
import { findCost, findReward } from "./hotmCalc"
import { findTick } from "./tick"
const PREFIX = constants.PREFIX
let statsHoverCheck = false,
 powderHoverCheck = false,
 blueCheese = false,
 baseFortune,
 baseSpeed,
 pristine,
 powderGemstone,
 powderMithril,
 block,
 currentHotmPerks = [],
 showWindow = false


const thread = new Thread(() => {
    if()
})


register("itemTooltip", (lore, item) => {
    if(!statsHoverCheck || !item.getLore()[0].startsWith("§o§aYour SkyBlock Profile")) return
    statsHoverCheck = false

    let matches
    setTimeout(() => {
        item.getLore().forEach(line => {
            if(line.includes("Mining Fortune"))
            {
                matches = /§b([0-9,]+)/g.exec(line) ?? /§f([0-9,]+)/g.exec(line)
                baseFortune = parseInt(matches[1].replace(/,/g, ""))
            }
            if(line.includes("Mining Speed"))
            {
                matches = /§b([0-9,]+)/g.exec(line) ?? /§f([0-9,]+)/g.exec(line)
                baseSpeed = parseInt(matches[1].replace(/,/g, ""))
            }
            if(line.includes("Pristine"))
            {
                matches = /§f([0-9,]+)/g.exec(line)
                pristine = parseInt(matches[1].replace(/,/g, ""))
            }
        })
        ChatLib.chat(`${PREFIX}&bLoaded stats.`)
    }, 200);
})


register("renderOverlay", () => {
    if(!showWindow) return
    let txt = ""
    if(powderGemstone == undefined)
        txt += "Doesn't have gemstone powder.\n"
    if(powderMithril == undefined)
        txt += "Doesn't have mithril powder.\n"
    Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/6 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
})

register("gameUnload", () => {
    thread.stop()
})

const hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data
register('step', () => {
    let inventoryName = Player?.getOpenedInventory()?.getName()?.toString(),
     lore,
     hotmObj,
     matches
    if(inventoryName == undefined) return showWindow = false
    if(inventoryName.includes("Heart of the Mountain")) {
        showWindow = true
        for (i = 0; i < Player.getOpenedInventory().getSize() - 36; i++) {
            lore = Player.getOpenedInventory().getStackInSlot(i)?.getLore()
            hotmObj = hotmData.find(data => data.nameStringed.toLowerCase() == lore[0].removeFormatting().toLowerCase())
            matches = /\/([0-9]+)/g.exec(lore[1])

            if(!currentHotmPerks.find(perk => perk.name == hotmObj.nameStringed.toLowerCase()))
                currentHotmPerks.push({name: hotmObj.nameStringed.toLowerCase(), shortName: names[0], level: parseInt(matches[1]) ?? 0})
            else if (lore[0].removeFormatting().includes("Heart of the Mountain"))
            {
                lore.forEach(line => {
                    if(line.includes("Mithril Powder"))
                    {
                        matches = /§2([0-9,]+)/g.exec(line)
                        powderMithril = parseInt(matches[1].replace(/,/g, ""))
                    }
                    else if(line.includes("Gemstone Powder"))
                    {
                        matches = /§d([0-9,]+)/g.exec(line)
                        powderGemstone = parseInt(matches[1].replace(/,/g, ""))
                    }
                })
            }
        }
    }
}).setFps(2)


function updateTicks(ticks, miningStats)
{
    ticks.shards = miningStats.ticks.shards
    ticks.blocks = miningStats.ticks.blocks
    ticks.msbShards = miningStats.ticks.msbShards
    ticks.msbBlocks = miningStats.ticks.msbBlocks
}


/*
export function powderCalc(args)
{
    let textComponents, run = false

    switch(args[0])
    {
        case undefined:
            statsHoverCheck = true
            powderHoverCheck = true
            new TextComponent(`${PREFIX}&bHover over the Heart of the Mountain icon, hold whatever drill you plan to use, and hover over your profile in /sbmenu. &7[&eNEXT&7]`)
            .setClickAction("run_command")
            .setClickValue("/cw calc powder 1")
            .chat()
            break
        case '1':
            textComponents = [
                new TextComponent(`&7[&cManual mining&7] `)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m1"),
                new TextComponent(`&7[&bDillo mining&7]`)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder d1")
            ]
            new Message(textComponents).chat()
            break
        case "m1":
            textComponents = [
                new TextComponent(`&7[&aUsing blue cheese omelette&7] `)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m2"),
                new TextComponent(`&7[&cNot Using blue cheese omelette&7]`)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m3")
            ]
            new Message(textComponents).chat()
            break
        case "m2":
            blueCheese = true
        case "m3":
            textComponents = [
                new TextComponent(`&7[&cRuby&7] `)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m4"),
                new TextComponent(`&7[&dJasper/Opal&7] `)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m5"),
                new TextComponent(`&7[&dJade&7] `)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m6"),
                new TextComponent(`&7[&aAny other gemstone&7]`)
                .setClickAction("run_command")
                .setClickValue("/cw calc powder m7")
            ]
            new Message(textComponents).chat()
            break
        case "m4":
            block = "ruby"
            run = true
            break
        case "m5":
            block = "jasper"
            run = true
            break
        case "m6":
            block = "jade"
            run = true
            break
        case "m7":
            block = "amethyst"
            run = true
            break
        case "d1":
            ChatLib.chat(`${PREFIX}idk bro just get all fortune.`)
            break
    }

    if(run)
    {
        // go through ever combination of perks the player can afford for each powder then find the combination with the highest gemstonesPerHr
        // object format { msLevel, mfLevel, gemstonesPerHr } { ms2Level, mf2Level, professionalLevel, gemstonesPerHr }
        ChatLib.chat(`${PREFIX}&bCalculating...`)

        thread.start()
    }
}*/