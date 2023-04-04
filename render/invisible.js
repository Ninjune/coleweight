import settings from "../settings"

register("renderItemIntoGui", (item, x, y, event) => {
    if(!settings.invisibleItems) return
    cancel(event)
    //item.itemStack.func_150996_a(Item2.func_111206_d("minecraft:air")) // item.itemStack.setItem(Item.getByNameOrId())
})


register("renderHand", event => {
    if(!settings.invisibleItems) return
    cancel(event)
})