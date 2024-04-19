import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { addCommas, capitalizeFirst } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let statsHoverCheck = false,
 block,
 fortune,
 speed,
 pristine,
 blueCheese = false,
 blockPercentage = .45

registerCommand({
    aliases: ["gemstone", "gem"],
    description: "$/hr with gemstones. &cLess accurate than Skyhelper's. &4&lDeprecated",
    options: "",
    category: "info",
    execute: (args) => {
        let textComponents, run = false

        switch(args[1])
        {
            case undefined:
                statsHoverCheck = true
                new TextComponent(`${PREFIX}&bHold whatever drill you plan to use, and hover over your profile in /sbmenu. &7[&eNEXT&7]`)
                .setClickAction("run_command")
                .setClickValue("/cw gemstone m1")
                .chat()
                break
            case "m1":
                textComponents = [
                    new TextComponent("&7[&aUsing blue cheese omelette&7] ")
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m2"),
                    new TextComponent("&7[&cNot Using blue cheese omelette&7]")
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m3")
                ]
                new Message(textComponents).chat()
                break
            case "m2":
                blueCheese = true
            case "m3":
                textComponents = [
                    new TextComponent("&7[&cRuby&7] ")
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m4"),
                    new TextComponent("&7[&dJasper/Opal&7] ")
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m5"),
                    new TextComponent("&7[&dJade&7] ")
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m6"),
                    new TextComponent("&7[&aAny other gemstone&7]")
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m7")
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
                blockPercentage = .98
                run = true
                break
            case "m7":
                block = "amethyst"
                run = true
                break
        }

        if(run)
        {
            const result = findGemstonesPerHr(block, pristine, fortune, speed, blueCheese, blockPercentage)
            instaSellBZPrice(`FINE_${block.toUpperCase()}_GEM`)
            .then(bzPrice => {
                ChatLib.chat(`${PREFIX}&b$${addCommas(Math.round(result.gemstonesPerHour*bzPrice/80/80))}/hr (&b~${addCommas(Math.round(result.gemstonesPerHour))} ${capitalizeFirst(block)} per hour.)`)
            })
        }
    }
})


register("itemTooltip", (lore, item) => {
    if(!statsHoverCheck || !item.getLore()[0].startsWith("§o§aYour SkyBlock Profile")) return
    statsHoverCheck = false
    findStats(item)
})


function findStats(item)
{
    let matches

    setTimeout(() => {
        if(constants.checkedGemstoneStats) return findStats(item)
        item.getLore().forEach(line => {
            if(line.includes("Mining Fortune"))
            {
                matches = /§b([0-9,]+)/g.exec(line) ?? /§f([0-9,]+)/g.exec(line)
                fortune = parseInt(matches[1].replace(/,/g, ""))
            }
            if(line.includes("Mining Speed"))
            {
                matches = /§b([0-9,]+)/g.exec(line) ?? /§f([0-9,]+)/g.exec(line)
                speed = parseInt(matches[1].replace(/,/g, ""))
            }
            if(line.includes("Pristine"))
            {
                matches = /§f([0-9,]+)/g.exec(line)
                pristine = parseInt(matches[1].replace(/,/g, ""))
            }
        })
        ChatLib.chat(`${PREFIX}&bLoaded stats.`)
        return
    }, 200)
}


// code based on MattTheCuber's gemstones/hr
/**
 *
 * @param {string} block
 * @param {number} pristine
 * @param {number} fortune
 * @param {number} speed
 * @param {boolean} blueCheese
 * @param {number} blockPercentage must be decimal
 */
 function findGemstonesPerHr(block, pristine, fortune, speed, blueCheese, blockPercentage)
 {
     const bal = block == "ruby" ? true : false
     const percentage = blockPercentage

     const msbTime = blueCheese ? 25 : 20
     const msb = (blueCheese ? 4 : 3) * (bal ? 1.15 : 1)

     const shardDrops = (2+4) / 2
     const blockDrops = (3+6) / 2
     const avgDrops = blockDrops * percentage + shardDrops * (1-percentage)

     const miningTicksObj = findTick(speed, block)
     const miningTicksBlocks = Math.max(4, miningTicksObj.currentBlockTick)
     const miningTicksShards = Math.max(4, miningTicksObj.currentShardTick)
     const miningTicks = miningTicksBlocks * percentage + miningTicksShards * (1-percentage)

     const msbSpeed = speed + speed * msb
     const msbTicksObj = findTick(msbSpeed, block)
     const msbTicksBlocks = Math.max(4, msbTicksObj.currentBlockTick)
     const msbTicksShards = Math.max(4, msbTicksObj.currentShardTick)
     const msbTicks = msbTicksBlocks * percentage + msbTicksShards * (1-percentage)

     const blocksPerHour = (72000 / (1 + miningTicks)) * ((120 - msbTime) / 120) + (72000 / (1 + msbTicks)) * (msbTime / 120)

     const gemstonesPerHour = avgDrops * (1 + pristine * 0.79) * (1 + fortune / 100) * blocksPerHour
     return { ticks: {blocks: miningTicksBlocks, shards: miningTicksShards, msbBlocks: msbTicksBlocks, msbShards: msbTicksShards}, gemstonesPerHour }
 }


function instaSellBZPrice(product)
{
    return new Promise((resolve, reject) => {
        request("https://api.hypixel.net/skyblock/bazaar")
        .then(res => {
            if(res.data.products[product] != undefined)
                resolve(res.data.products[product].sell_summary[0].pricePerUnit)
            else
                resolve(0)
        })
        .catch(err => {
            if(settings.debug) console.log("BZ Price: " + err)
            reject(err)
        })
    })
}