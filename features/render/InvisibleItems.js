import { addEvent } from "../../FeatureBase"
import settings from "../../settings"

addEvent("invisibleItems", register("renderItemIntoGui", (item, x, y, event) => {
    if(!settings.invisibleItems) return
    cancel(event)
}), [
    register("renderHand", event => {
        if(!settings.invisibleItems) return
        cancel(event)
    })
])