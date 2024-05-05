import settings from "../settings";
import { registerWhen } from "../util/helperFunctions";


registerWhen(register("postGuiRender", (mX, mY, gui) => {
    if(!gui.toString().includes("GuiChest") || !Player.getContainer().getName().toLowerCase().includes("recipe"))
        return
    const container = Player.getContainer();
    const supercraft = container.getStackInSlot(32)
    if(!supercraft?.getName()?.includes("Supercraft"))
        return
    const lore = supercraft.getLore();
    let ret = false
    lore.forEach(l => {
        if(l.includes("Max"))
            ret = true
    })
    if(ret)
        return
    lore.splice(0, 1);
    const regres = lore[0].removeFormatting().replaceAll(",", "").match(/ . (\d+)\/(\d+).+/)
    const max = Math.floor(parseInt(regres[1]) / parseInt(regres[2]))
    lore[1] = "§aMax: §b" + max;
    supercraft.setLore(...lore);
}), () => { return settings.superCraft })