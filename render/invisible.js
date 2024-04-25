import settings from "../settings"
import { hollowsChecker } from "../util/helperFunctions"
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
const EntitySlime = Java.type("net.minecraft.entity.monster.EntitySlime");

register("renderItemIntoGui", (item, x, y, event) => {
    if(!settings.invisibleItems) return
    cancel(event)
    //item.itemStack.func_150996_a(Item2.func_111206_d("minecraft:air")) // item.itemStack.setItem(Item.getByNameOrId())
})


register("renderHand", event => {
    if(!settings.invisibleItems) return
    cancel(event)
})


register("renderEntity", (entity, position, partialTicks, event) => {
    if(!hollowsChecker.check() || !countSludge() || settings.debug)
        return;
    entity = entity.getEntity();
    const CTEntity = new Entity(entity);
    if(entity instanceof EntitySlime)
        cancel(event);
    else if (entity instanceof EntityArmorStand &&
        CTEntity.getName().includes("Sludge")
    )
        cancel(event);
})


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