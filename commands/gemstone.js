import constants from "../util/constants"
import { addCommas, capitalizeFirst, findGemstonesPerHr, instaSellBZPrice } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let statsHoverCheck = false,
 block,
 fortune,
 speed,
 pristine,
 blueCheese = false,
 blockPercentage = .45

module.exports =
{ 
    aliases: ["gemstone", "gem"],
    description: "$/hr with gemstones.",
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
                    new TextComponent(`&7[&aUsing blue cheese omelette&7] `)
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m2"),
                    new TextComponent(`&7[&cNot Using blue cheese omelette&7]`)
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m3")
                ]
                new Message(textComponents).chat()
                break
            case "m2":
                blueCheese = true
            case "m3":
                textComponents = [
                    new TextComponent(`&7[&cRuby&7] `)
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m4"),
                    new TextComponent(`&7[&dJasper/Opal&7] `)
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m5"),
                    new TextComponent(`&7[&dJade&7] `)
                    .setClickAction("run_command")
                    .setClickValue("/cw gemstone m6"),
                    new TextComponent(`&7[&aAny other gemstone&7]`)
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
}


register("itemTooltip", (lore, item) => {
    if(!statsHoverCheck || !item.getLore()[0].startsWith("§o§aYour SkyBlock Profile")) return
    statsHoverCheck = false

    let matches
    setTimeout(() => {
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
    }, 200);
})