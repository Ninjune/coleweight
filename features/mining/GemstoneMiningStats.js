import { addEvent } from "../../FeatureBase"
import settings from "../../settings"
import { findCost, findHotmObject, findTick } from "../../utils/MiscMining"
import { addCommas, data, getSelectedProfile, makeRequest } from "../../utils/Utils"

const NBTTagString = Java.type("net.minecraft.nbt.NBTTagString")
let powderTotals = {}
let getPlayerDataSuccess = false
let checkedHotmInfo = false
let checkedHotmReset = false

addEvent("gemstoneMiningStats", register("itemTooltip", (lore, item) => { // this is so bad 💀
    if(!settings.gemstoneMiningStats || item.getLore() == undefined || item.getLore()[0] == undefined || !item.getLore()[0].startsWith("§o§aYour SkyBlock Profile")) return
    const list = new NBTTagList(item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("Lore")),
     tempList = []

    for(let elementIndex = 0; elementIndex < list.getTagCount(); elementIndex++)
    {
        tempList.push(list.getStringTagAt(elementIndex))
    }

    for(let elementIndex = 0; elementIndex < list.getTagCount(); elementIndex++)
    {
        let element = list.getStringTagAt(elementIndex)
        if(element !== ` §6⸕ Mining Speed §f${element.replace(" §6⸕ Mining Speed §f", "").replace("§", "")}` || data.professional == 0)
        {
            if(element !== ` §6☘ Mining Fortune §f${element.replace(" §6☘ Mining Fortune §f", "").replace("§", "")}` || (data.jungle_amulet == false && data.fortunate == 0))
                continue
                
            let miningFortune = element.replace(" §6☘ Mining Fortune §f", "").replace("§", ""),
            replacedFortune

            if(data.jungle_amulet && data.fortunate > 0)
                replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 10 + 5*data.fortunate
            else if(data.jungle_amulet)
                replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 10
            else
                replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 5*data.fortunate

            let miningFortuneText = `${element} §6(§b${addCommas(replacedFortune)}§6)`

            list.set(elementIndex, new NBTTagString(miningFortuneText))
            continue
        }
        let miningSpeed = parseInt(element.replace(" §6⸕ Mining Speed §f", "").replace("§", "").replace(",", "")),
         professionalSpeed = miningSpeed + Math.floor(50+(data.professional*5)),
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
}), [
    register("step", () => {
        let inventoryName = Player?.getContainer()?.getName()?.toString()
        if(inventoryName == undefined) return
        if(inventoryName.includes("Accessory Bag ")) {
            for (i = 0; i < Player.getContainer().getSize(); i++) {
                let extraAttributes = Player.getContainer().getStackInSlot(i)?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
                if (extraAttributes?.getString("id") === "JUNGLE_AMULET")
                {
                    data.jungle_amulet = true
                    data.save()
                }
            }
        }
    }).setFps(2),
    
    
    register("itemTooltip", (lore, item) => {
        if(item.getLore()[0]?.startsWith("§o§aFortunate§r"))
            data.fortunate = parseInt(item.getLore()[1].replace("§5§o§7Level ", ""))
        else if (item.getLore()[0]?.startsWith("§o§aProfessional§r"))
            data.professional = parseInt(item.getLore()[1].replace("§5§o§7Level ", ""))
        else return
        data.save()
    }),
    
    register("itemTooltip", (lore, item) => { // powder put into each perk
        if(!settings.showPowderSum || !item.getLore()[1]?.startsWith("§5§o§7Level ") || item?.getLore()[1]?.includes("💀")) return
        new Thread(() => {
            if(item.getLore()[1].includes("💀") || item.getLore()[1] == undefined) return
            const list = new NBTTagList(item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("Lore"))
            let perk = item.getLore()[0].replace(/§.|\(.+\)/g, "").replace(/ /g, "")
            let level = /Level (\d+)/g.exec(item.getLore()[1])[1]
            let hotmObjectToFind = findHotmObject(perk)
            if(hotmObjectToFind == undefined || (hotmObjectToFind.costFormula == undefined && perk != "Fortunate")) return
    
            let powderSum
    
            if(perk == "Fortunate")
                powderSum = findCost(undefined, 2, parseInt(level), true)
            else
                powderSum = findCost(perk, 2, parseInt(level))
    
            if(item.getLore()[1].includes("💀")) return
            list.set(0, new NBTTagString(item.getLore()[1] + ` §7(§b${addCommas(Math.round(powderSum))} §l${Math.round(powderSum/powderTotals[hotmObjectToFind.powderType]*100)}%§7)💀`)) // this is a perfect solution no cap
        }).start()
    }),
    
    register("step", () => {
        let inventoryName = Player?.getContainer()?.getName()?.toString()
        if(inventoryName == undefined || !inventoryName.includes("Heart of the Mountain") || getPlayerDataSuccess) return
        for (i = 0; i < Player.getContainer().getSize(); i++)
        {
            let item = Player.getContainer().getStackInSlot(i)
            let lore = item?.getLore()
            if(lore == undefined) return
            let loreType = lore[0]?.removeFormatting()
            if(!settings.showPowderSum || !loreType?.match(/(^Heart|^Reset).*/g) || (checkedHotmInfo && checkedHotmReset) || getPlayerDataSuccess) continue
            let loreItems = item.getLore()
            if(!loreItems)
                continue
            for(let loreItem of loreItems)
            {
                if (loreType?.match(/(^Heart).*/g) && !checkedHotmInfo)
                {
                    if(!loreItem.removeFormatting().match(/(^Mithril|^Gemstone).*/g))
                        continue
                    let loreItemSplit = loreItem.split(" ")
                    let powderType = loreItemSplit[0].removeFormatting().toLowerCase()
                    let add = parseInt(loreItemSplit[2].removeFormatting().replace(",",""))
    
                    if(!powderTotals[powderType])
                        powderTotals[powderType] = add
                    else if(!checkedHotmInfo)
                        powderTotals[powderType] += add
    
                }
                else if (!checkedHotmReset)
                {
                    let stripped = loreItem.removeFormatting().replace(/[ \-,]/g,"")
                    if(!stripped.match(/(MithrilPowder$|GemstonePowder$)/g))
                        continue
                    let powderType = stripped.match(/MithrilPowder$/g) ? "mithril" : "gemstone"
                    stripped = stripped.replace(/(MithrilPowder|GemstonePowder)/g,"")
                    let add = parseInt(stripped)
    
                    if(!powderTotals[powderType])
                        powderTotals[powderType] = add
                    else if(!checkedHotmReset)
                        powderTotals[powderType] += add
    
                }
            }
    
            if(loreType?.match(/(^Heart).*/g))
                checkedHotmInfo = true
            else
                checkedHotmReset = true
        }
    }).setFps(2) // @CrazyTech4
])


register("gameLoad", () => {
    makeRequest(`https://api.hypixel.net/skyblock/profiles?key=${data.api_key}&uuid=${Player.getUUID()}`)
    .then(res => {
        let selected = getSelectedProfile(res)?.members[Player.getUUID().replace(/-/g, "")]
         professional = selected?.mining_core?.nodes?.professional,
         fortunate = selected?.mining_core?.nodes?.fortunate

        powderTotals = {
            gemstone: (selected?.mining_core?.powder_gemstone_total ?? 0)
              + (selected?.mining_core?.powder_spent_gemstone ?? 0),
            mithril: (selected?.mining_core?.powder_mithril_total ?? 0)
              + (selected?.mining_core?.powder_spent_mithril ?? 0)
        }

        if(professional != undefined)
            data.professional = professional
        if(fortunate != undefined)
            data.fortunate = fortunate
        data.save()
        getPlayerDataSuccess = true
    })
})