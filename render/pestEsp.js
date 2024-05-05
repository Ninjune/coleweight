// basis: https://github.com/Skytils/SkytilsMod/blob/293ebf80522daf105da19ddb8ad27fa4fc5f9af9/src/main/kotlin/gg/skytils/skytilsmod/features/impl/mining/MiningFeatures.kt#L364 & nwjn esps: matcho + corpse
import settings from "../settings";
import { gardenCheck, registerWhen } from "../util/helperFunctions";
import { drawEspBox } from "../util/renderUtil"
const pests = ["fly", "cricket", "locust", "rat", "mosquito", "earthworm", "mite", "moth", "slug", "beetle"]

registerWhen(register("renderWorld", () => {
    World.getAllEntitiesOfType(Java.type("net.minecraft.entity.item.EntityArmorStand").class)
    .forEach(entity => {
        pests.forEach(pest => {
            if(entity.getName().removeFormatting().toLowerCase().includes(pest))
                drawEspBox(entity.getX(), entity.getY()-1, entity.getZ(), 1, 1, 0, 0.7, 0.7, 1, true)
        })
    })
}), () => { return settings.pestEsp && gardenCheck.check()})