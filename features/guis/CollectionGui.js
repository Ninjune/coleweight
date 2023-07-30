import settings from "../../settings"
import { BaseGui } from "../../utils/BaseGui"
import { registerGui } from "../../utils/GuIManager"
import { addCommas, addNotation, data, getObjectValue, makeRequest, secondsToMessage } from "../../utils/Utils"

// DocilElm does not want to touch this :(

let itemStringed = ""
let trackedItem = "Collection Not set! /cw track"
let itemValues = []
let uptimeSeconds = 0
let trackingItem = false
let apiCallsSinceLastChange = 0
let calcItemPerHour = false
let itemValuesSum = 0
let itemPerHour = 0
let currentItem = 0

const collectionGui = new BaseGui(["collectionGui", "collection"], () => {
    let leftValues = [`${itemStringed}`, `${itemStringed}/hr`, `${itemStringed} gained`, "Uptime"]
    if(!settings.collectionTracker || !(settings.showCollectionTrackerAlways || trackingItem || trackedItem == "" || collectionGui.isOpen())) return
    if(itemValues[0] != undefined && calcItemPerHour)
    {
        itemValuesSum = 0
        for(let i = 0; i < itemValues.length; i++)
            itemValuesSum += itemValues[i]
        let eq = Math.ceil((itemValuesSum*(3600/uptimeSeconds)) * 100) / 100
        eq != Infinity ? itemPerHour = eq : itemPerHour = "Calculating..."
        calcItemPerHour = false
    }
    let rightValues
    let message = ""

    if(settings.collectionNotation)
        rightValues = [addNotation("oneLetters", currentItem) ?? 0, addNotation("oneLetters", itemPerHour) ?? 0,
            addNotation("oneLetters", itemValuesSum) ?? 0, secondsToMessage(uptimeSeconds)
        ]
    else
        rightValues = [addCommas(currentItem) ?? 0, addCommas(itemPerHour) ?? 0,
            addCommas(itemValuesSum) ?? 0, secondsToMessage(uptimeSeconds)]

    leftValues.forEach((value, i) => {
        message += "&a" + value + ": &b" + rightValues[i] + "\n"
    })
    return message
}, "collectionTracker|showCollectionTrackerAlways", [
    register("step", () => {
        let date_ob = new Date(),
         seconds = date_ob.getSeconds()
    
        if(trackingItem == true)
            uptimeSeconds += 1
        if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
            calcApi(["members", Player.getUUID().replace(/-/g, ""), "collection"], Player.getUUID())
    }).setFps(1)
], true, resetVars)

registerGui(collectionGui)

// thanks to Axl#9999 for most collections in collections.json
export function cguiTrackCollection(collection){
    if(collection == undefined)
        return ChatLib.chat(`${constants.PREFIX}&bNot a valid collection.`)
    resetVars()
    trackCollection(collection)
    trackedItem = data.tracked.item
    itemStringed = data.tracked.itemStringed
}

register("gameLoad", () => {
    if(data.tracked.item != undefined)
    {
        resetVars()
        trackedItem = data.tracked.item
        itemStringed = data.tracked.itemStringed
    }
})

function calcApi(apiPath, tempUuid){
    if(trackedItem == "" || data.api_key == "") return
    let profileData = "",
    uuid = ""

    for(let i = 0; i < tempUuid.length; i++)
    {
        if(tempUuid[i] != "-")
            uuid += tempUuid[i]
    }

    try
    {
        makeRequest(`https://api.hypixel.net/skyblock/profiles?key=${data.api_key}&uuid=${uuid}`)
        .then(res => {
            for(let i=0; i < res.profiles.length; i+=1)
            {
                if(res.profiles[i].selected == true)
                    profileData = res.profiles[i]
            }
            let source = getObjectValue(profileData, apiPath)[trackedItem]

            if(currentItem == 0 || currentItem == undefined)
            {
                currentItem = source
            }
            else if (trackingItem && (source - currentItem) > 0) // don't track first item because it won't have time tracked.
            {
                itemValues.push(source - currentItem) // for averaging
                calcItemPerHour = true // for deciding when to average the values (don't need to every renderGui)
                trackingItem = true // for rendering gui & timer
                apiCallsSinceLastChange = 0 // for disabling gui at 20
                currentItem = source // current item value
            }
            else if ((source - currentItem) > 0)
            {
                trackingItem = true
                apiCallsSinceLastChange = 0
                currentItem = source
            }
            else if (apiCallsSinceLastChange > 20)
            {
                resetVars()
            }
            else
            {
                apiCallsSinceLastChange += 1
            }
        })
        .catch(e => {
            if(!settings.debug) return
            console.dir(e)
            console.dir(e.response)
        })
    }
    catch(e) { if(settings.debug) console.log(e)}
}


function trackCollection(collection){
    let collections = JSON.parse(FileLib.read("Coleweight", "data/collections.json"))
    if(collection == undefined) return ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    if(collection == "obby") collection = "obsidian"
    if(collection == "cobble") collection = "cobblestone"
    if(collections[collection.toLowerCase()] == undefined) return ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    data.tracked.item = collections[collection].collectionToTrack
    data.tracked.itemStringed = collections[collection].collectionStringed
    data.save()

    ChatLib.chat(`${PREFIX}&bSet collection to ${data.tracked.itemStringed}!`)
}


function resetVars(){
    currentItem = 0
    itemValues = []
    uptimeSeconds = 0
    trackingItem = false
    apiCallsSinceLastChange = 0
    itemPerHour = "Calculating..."
    itemValuesSum = 0
}