import settings from "../settings"
import constants from "../util/constants"
import { findTick } from "../commands/calculate/tick"
import { addCommas, getSelectedProfile } from "../util/helperFunctions"
import axios from "../../axios"
import { findCost, findHotmObject } from "../commands/calculate/hotmCalc"
const NBTTagString = Java.type("net.minecraft.nbt.NBTTagString")


register("itemTooltip", (lore, item) => { // this is so bad 💀
    if(!item.getLore()[0].startsWith("§o§aYour SkyBlock Profile") || !settings.gemstoneMiningStats) return
    const list = new NBTTagList(item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("Lore")),
     tempList = []

    for(let elementIndex = 0; elementIndex < list.getTagCount(); elementIndex++)
    {
        tempList.push(list.getStringTagAt(elementIndex))
    }
    
    for(let elementIndex = 0; elementIndex < list.getTagCount(); elementIndex++)
    {
        let element = list.getStringTagAt(elementIndex)
        if(element !== ` §6⸕ Mining Speed §f${element.replace(" §6⸕ Mining Speed §f", "").replace("§", "")}` || constants.data.professional == 0)
        {
            if(element !== ` §6☘ Mining Fortune §f${element.replace(" §6☘ Mining Fortune §f", "").replace("§", "")}` || (constants.data.jungle_amulet == false && constants.data.fortunate == 0))
                continue
            let miningFortune = element.replace(" §6☘ Mining Fortune §f", "").replace("§", ""),
            replacedFortune
    
            if(constants.data.jungle_amulet && constants.data.fortunate > 0)
                replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 10 + 5*constants.data.fortunate
            else if(constants.data.jungle_amulet)
                replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 10
            else
                replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 5*constants.data.fortunate
            
            let miningFortuneText = `${element} §6(§b${addCommas(replacedFortune)}§6)`
    
            list.set(elementIndex, new NBTTagString(miningFortuneText))
            continue
        }
        let miningSpeed = parseInt(element.replace(" §6⸕ Mining Speed §f", "").replace("§", "").replace(",", "")),
         professionalSpeed = miningSpeed + Math.floor(50+(constants.data.professional*5)),
         miningSpeedText = `${element} §6(§b${addCommas(professionalSpeed)}§6)`,
         tick
        
        if(professionalSpeed > 50 && settings.tickSpeedBlock > 1) // may need to change if add tick blocks (good programming real)
            tick = findTick(professionalSpeed, settings.tickSpeedBlock).currentBlockTick
        else
            tick = findTick(miningSpeed, settings.tickSpeedBlock).currentBlockTick
        
        list.set(elementIndex, new NBTTagString(miningSpeedText))
        list.set(elementIndex + 1, new NBTTagString(` §6⸕ Block Tick §f${Math.round(tick)}`)) // 1 new added
        for(let i = elementIndex + 2; i < list.getTagCount(); i++)
        {
            list.set(i, new NBTTagString(tempList[i - 1]))
        }
    }
})


register("gameLoad", () => {
    axios.get(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${Player.getUUID()}`)
    .then(res => {
        let professional = getSelectedProfile(res)?.members[Player.getUUID().replace(/-/g, "")]?.mining_core?.nodes?.professional,
         fortunate = getSelectedProfile(res)?.members[Player.getUUID().replace(/-/g, "")]?.mining_core?.nodes?.fortunate
        
        if(professional != undefined)
            constants.data.professional = professional
        if(fortunate != undefined)
            constants.data.fortunate = fortunate
        constants.data.save()
    })
})

register('step', () => {
    let inventoryName = Player?.getOpenedInventory()?.getName()?.toString()
    if(inventoryName == undefined) return
    if(inventoryName.includes("Accessory Bag ")) {
        for (i = 0; i < Player.getOpenedInventory().getSize(); i++) {
            let extraAttributes = Player.getOpenedInventory().getStackInSlot(i)?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
            if (extraAttributes?.getString('id') === "JUNGLE_AMULET") 
            {
                constants.data.jungle_amulet = true
                constants.data.save()
            }
        }
    }
}).setFps(2)


register("itemTooltip", (lore, item) => {
    if(item.getLore()[0].startsWith("§o§aFortunate§r"))
        constants.data.fortunate = parseInt(item.getLore()[1].replace("§5§o§7Level ", ""))
    else if (item.getLore()[0].startsWith("§o§aProfessional§r"))
        constants.data.professional = parseInt(item.getLore()[1].replace("§5§o§7Level ", ""))
    else return
    constants.data.save()
})

register("itemTooltip", (lore, item) => { // powder put into each perk
    if(!settings.showPowderSum || !item.getLore()[1]?.startsWith("§5§o§7Level ") || item?.getLore()[1]?.includes("💀")) return
    new Thread(() => {
        if(item.getLore()[1].includes("💀")) return
        const list = new NBTTagList(item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("Lore"))
        let perk = item.getLore()[0].replace(/§.|\(.+\)/g, "").replace(/ /g, "")
        let level = /Level (\d+)/g.exec(item.getLore()[1])[1]
        let hotmObjectToFind = findHotmObject(perk)
        if(hotmObjectToFind == undefined) return

        let powderSum

        if(perk == "Fortunate")
            powderSum = findCost(undefined, 1, parseInt(level), true)
        else
            powderSum = findCost(hotmObjectToFind.costFormula, 1, parseInt(level))
       
        if(item.getLore()[1].includes("💀")) return
        list.set(0, new NBTTagString(item.getLore()[1] + ` §7(§b${addCommas(Math.round(powderSum))}§7)💀`)) // this is a perfect solution no cap
    }).start()
})