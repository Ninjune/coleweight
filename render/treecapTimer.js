import settings from "../settings"
import { checkInPark } from "../util/helperFunctions"

treecapCooldown = 0.0
monkeyLevel = 0

register("renderOverlay", () => {
    if(!settings.treecapTimer || !checkInPark()) return
    // ChatLib.chat(Player.getHeldItem().getItemNBT().getTag('tag').getTag('ExtraAttributes').getTag("id").toString())
    let itemId = Player.getHeldItem()?.getItemNBT()?.getTag('tag')?.getTag('ExtraAttributes')?.getTag("id")?.toString()
    if(!(itemId == `"TREECAPITATOR_AXE"` || itemId == `"ASPECT_OF_THE_VOID"` || Player?.getHeldItem()?.getRegistryName() == "minecraft:fishing_rod")) return
    let txt = Math.ceil(treecapCooldown*10)/10
    Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/25)
})

register("step", () => {
    if(!settings.treecapTimer || !checkInPark()) return
    if(treecapCooldown > 0)
    {
        let multipler = 1 + Math.floor(1/2 * parseInt(monkeyLevel))/100
        if(treecapCooldown - 0.1*multipler < 0)
            treecapCooldown = 0
        else
            treecapCooldown -= 0.1 * multipler
    }
}).setFps(10)

register("blockBreak", (block) => {
    if(!settings.treecapTimer || !checkInPark()) return
    let blockRegistryName = block.type.getRegistryName()
    if (treecapCooldown > 0.5 || !(blockRegistryName == "minecraft:log" || blockRegistryName == "minecraft:log2")) return
    treecapCooldown = 2.0
})

register("chat", (lvl, pet, event) => {
    if(!settings.treecapTimer || !checkInPark()) return
    if(pet != "Monkey") return monkeyLevel = 0
    monkeyLevel = lvl
}).setCriteria(/&cAutopet &eequipped your &.\[Lvl ([0-9]+)] &.([a-zA-Z]+)&e! &a&lVIEW RULE&r/g)