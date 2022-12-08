import settings from "../settings"
import constants from "../util/constants"
const NBTTagString = Java.type("net.minecraft.nbt.NBTTagString")


register("itemTooltip", (lore, item) => { // this is so bad 💀
    if(item.getLore()[0] != "§o§aYour SkyBlock Profile§r" || !settings.gemstoneMiningStats) return
    const list = new NBTTagList(item.getNBT().getCompoundTag("tag").getCompoundTag("display").getTagMap().get("Lore"))
     
    for(let index = 0; index < list.getTagCount(); index++)
    {
        let element = list.getStringTagAt(index)
        if(element !== ` §6⸕ Mining Speed §f${element.replace(" §6⸕ Mining Speed §f", "").replace("§", "")}` || constants.data.professional == 0)
            continue
        let miningSpeed = element.replace(" §6⸕ Mining Speed §f", "").replace("§", ""),
        professionalSpeed = parseInt(miningSpeed.toString().replace(",", "")) + Math.floor(50+(constants.data.professional*5)),
        miningSpeedText = `${element} §6(§b${professionalSpeed}§6)`

        list.set(index, new NBTTagString(miningSpeedText))
    }

    for(let i = 0; i < list.getTagCount(); i++)
    {
        let element = list.getStringTagAt(i)
        if(element !== ` §6☘ Mining Fortune §f${element.replace(" §6☘ Mining Fortune §f", "").replace("§", "")}` || constants.data.jungle_amulet == false)
            continue
        let miningFortune = element.replace(" §6☘ Mining Fortune §f", "").replace("§", ""),
        replacedFortune = parseInt(miningFortune.toString().replace(",", "")) + 10,
        miningFortuneText = `${element} §6(§b${replacedFortune}§6)`

        list.set(i, new NBTTagString(miningFortuneText))
    }
})


register("itemTooltip", (lore, item) => {
    if(item.getLore()[0] != "§o§aProfessional§r") return
    constants.data.professional = parseInt(item.getLore()[1].replace("§5§o§7Level ", ""))
    constants.data.save()
})


register('step', () => {
    let inventoryName = Player?.getOpenedInventory()?.getName()?.toString()
    if(inventoryName == undefined) return
    if(inventoryName.includes("Acessory Bag ")) {
        for (i = 0; i < Player.getOpenedInventory().size; i++) {
            let extraAttributes = Player.getOpenedInventory().getStackInSlot(i)?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
            if (extraAttributes.getString('id') == "JUNGLE_AMULET") 
            {
                constants.data.jungle_amulet = true
                constants.data.save()
            }
        }
    }
}).setFps(2)


/*
let checked = false
register("itemTooltip", (lore, item) => {
    if(!settings.debug || checked) return
    console.log(item.getLore())
    checked = true
})
*/