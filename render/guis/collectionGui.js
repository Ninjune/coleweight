import constants from "../../util/constants"
import settings from "../../settings"
import { trackCollection, trackerGui } from "../../util/helperFunctions"
const PREFIX = constants.PREFIX
const collectionGui = new trackerGui("", "Collection Not set! /cw track", settings.collectionNotation)


export function cguiTrackCollection(collection)
{
    collectionGui.resetVars()
    trackCollection(collection)
    collectionGui.trackedItem = constants.data.tracked.item
    collectionGui.itemStringed = constants.data.tracked.itemStringed
}

export function openCollectionGui()
{
    collectionGui.moveGui()
}

export function reloadCollection()
{
    collectionGui.resetVars()
}

register("dragged", (dx, dy, x, y) => {
    if (!collectionGui.collectionMoveGui.isOpen()) return
    constants.collectiondata.x = x
    constants.collectiondata.y = y
    constants.collectiondata.save()
})

register("renderOverlay", () => {
    collectionGui.renderGui(constants.collectiondata.x, constants.collectiondata.y, settings.collectionTracker, settings.collectionNotation, settings.showCollectionTrackerAlways)
})

register("step", () => {
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()
    
    if(collectionGui.trackingItem == true)
        collectionGui.uptimeSeconds += 1
    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
    {
        collectionGui.calcApi(["members", Player.getUUID().replace(/-/g, ""), "collection"],  Player.getUUID())
    }
}).setFps(1)