import constants from "../../util/constants"




/* Depreciated
import settings from "../../settings"
import { secondsToMessage } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
import { registerGui } from "../../guiManager"
import { addNotation, getObjectValue, addCommas } from "../../util/helperFunctions"
import request from "../../../requestV2"

let itemStringed = "",
    trackedItem = "Collection Not set! /cw track",
    itemValues = [],
    uptimeSeconds = 0,
    trackingItem = false,
    apiCallsSinceLastChange = 0,
    calcItemPerHour = false,
    itemValuesSum = 0,
    itemPerHour = 0,
    currentItem = 0

const collectionGui = new BaseGui(["collectionGui", "collection"], () => {
    let leftValues = [`${itemStringed}`, `${itemStringed}/hr`, `${itemStringed} gained`, "Uptime"]
    if(!(settings.showCollectionTrackerAlways || trackingItem || trackedItem == "")) return
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
}, () => { return settings.collectionTracker || collectionGui.isOpen() }, resetVars)
registerGui(collectionGui)

function getPlayerInfo(){

}


// thanks to Axl#9999 for most collections in collections.json
export function cguiTrackCollection(collection)
{
    if(collection == undefined)
        return ChatLib.chat(`${constants.PREFIX}&bNot a valid collection.`)
    resetVars()
    trackCollection(collection)
    trackedItem = constants.data.tracked.item
    itemStringed = constants.data.tracked.itemStringed
}

register("step", () => {
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()

    if(trackingItem == true)
        uptimeSeconds += 1
    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
        calcApi(["members", Player.getUUID().replace(/-/g, ""), "collection"], Player.getUUID())
}).setFps(1)


register("gameLoad", () => {
    if(constants.data.tracked.item != undefined)
    {
        resetVars()
        trackedItem = constants.data.tracked.item
        itemStringed = constants.data.tracked.itemStringed
    }
})


function calcApi(apiPath, tempUuid)
{
    if(trackedItem == "" || constants.data.api_key == "") return
    let profileData = "",
    uuid = ""

    for(let i = 0; i < tempUuid.length; i++)
    {
        if(tempUuid[i] != "-")
            uuid += tempUuid[i]
    }

    try
    {
        request({
            url: `https://api.hypixel.net/v2/skyblock/profiles?key=${constants.data.api_key}&profile=${uuid}`,
            json: true
        })
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
        })
    }
    catch(e) { if(settings.debug) console.log(e)}
}



function resetVars()
{
    currentItem = 0
    itemValues = []
    uptimeSeconds = 0
    trackingItem = false
    apiCallsSinceLastChange = 0
    itemPerHour = "Calculating..."
    itemValuesSum = 0
}*/