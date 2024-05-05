import settings from "../settings"
import { hollowsChecker, registerWhen } from "../util/helperFunctions"
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
const EntitySlime = Java.type("net.minecraft.entity.monster.EntitySlime");

registerWhen(register("renderItemIntoGui", (item, x, y, event) => {
    cancel(event)
    //item.itemStack.func_150996_a(Item2.func_111206_d("minecraft:air")) // item.itemStack.setItem(Item.getByNameOrId())
}), () => { return settings.invisibleItems })


registerWhen(register("renderHand", event => {
    cancel(event)
}), () => { return settings.invisibleItems })


registerWhen(register("renderEntity", (entity, position, partialTicks, event) => {
    if(!countSludge())
        return;
    entity = entity.getEntity();
    const CTEntity = new Entity(entity);
    if(entity instanceof EntitySlime)
        cancel(event);
    else if (entity instanceof EntityArmorStand &&
        CTEntity.getName().includes("Sludge")
    )
        cancel(event);
}), () => { return hollowsChecker.check() && !settings.debug})


function countSludge()
{
    let count = 0;

    World.getAllEntitiesOfType(EntityArmorStand).forEach(stand => {
        if(stand.getName().includes("Sludge"))
            count++;
        else if (count >= 50)
            return;
    })

    return count >= 50;
}