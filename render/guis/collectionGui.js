import constants from "../../util/constants"
import settings from "../../settings"
import { trackerGui } from "../../util/helperFunctions"
const PREFIX = constants.PREFIX
const collectionMoveGui = new Gui()
const collectionGui = new trackerGui("", "Collection Not set! /cw track", settings.collectionNotation)


export function trackCollection(arg)
{
    collectionGui.resetVars()
    let collections = JSON.parse(FileLib.read("Coleweight", "data/collections.json"))
    if(arg == "obby") arg = "obsidian"
    if(arg == "cobble") arg = "cobblestone"
    if(collections[arg.toLowerCase()] == undefined) return ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    collectionGui.trackedItem = collections[arg].collectionToTrack
    collectionGui.itemStringed = collections[arg].collectionStringed

    ChatLib.chat(`${PREFIX}&bSet collection to ${collectionGui.itemStringed}!`)
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
    collectionGui.renderGui(constants.collectiondata.x, constants.collectiondata.y, settings.collectionNotation, settings.collectionTracker)
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