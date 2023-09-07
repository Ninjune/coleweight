import config from "./settings"
import { data, isInTab } from "./utils/Utils"

let events = {}
let eventsAlreadyRegistered = {}
let currentWorld = null
let currentArea = null

/**
 * 
 * @param {String} configName Config name from vigilance
 * @param {*} mainEvent Register/Event from chattrigger
 * @param {Array} sideEvents Register(s)/Event(s) from chattrigger
 * @param {String} world The required world (tab name)
 * @param {String} area The required area (scoreboard name)
 * @param {Boolean} isPogData Boolean that det if this event should use pogdata instead of vigilance
 * @param {Boolean} hasDoubleConfigName Boolean that def if it should use one or two settings of vigilance
 * 
 */
export const addEvent = (configName, mainEvent, sideEvents = [], world = null, area = null, isPogData = false, hasDoubleConfigName = false) => {
    events[configName] = {
        event: mainEvent,
        sideEvents: sideEvents,
        requiredWorld: world,
        requiredArea: area,
        isPogData: isPogData,
        hasDoubleConfigName: hasDoubleConfigName
    }
}

register("gameUnload", () => {
    const registeredEvents = Object.keys(events)
    
    registeredEvents.forEach(values => {
        events[values].event.unregister()
        events[values].sideEvents.forEach(events => events.unregister())
    })
})

register("step", () => {
    if(!World.isLoaded()) return
    
    const registeredEvents = Object.keys(events)

    currentWorld = (isInTab("Crystal Hollows") || isInTab("Dwarven Mines"))
        ? "Mines"
        : TabList.getNames()?.find(names => names.removeFormatting()?.match(/^Area|Dungeons: ([\w\d ]+)$/))

    currentArea = currentWorld?.includes("The Rift") 
        ? Scoreboard.getLines()?.find(f => f.getName().removeFormatting().match(/ ф (.+)/))?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")
        : Scoreboard.getLines()?.find(f => f.getName().removeFormatting().match(/ ⏣ (.+)/))?.getName()?.removeFormatting()?.replace(/[^\u0000-\u007F]/g, "")

    registeredEvents.forEach(values => {
        // i reall hate myself for this
        const bool = events[values].isPogData
            ? data[values]
            : events[values].hasDoubleConfigName
                // index [1] should always take priority to this since this will be the
                // "should always be on" setting
                ? (config[values.split("|")[1]] || config[values.split("|")[0]])
                : config[values]
        

        if(!currentWorld || !currentArea){
            events[values].event.unregister()
            events[values].sideEvents.forEach(events => events.unregister())

            eventsAlreadyRegistered[values] = false
            
            //ChatLib.chat(`ConfigName: ${values}, Boolean: ${bool} All`)
            return
        }
        else if(
            bool &&
            checkForWorld(values) &&
            checkForArea(values) &&
            !eventsAlreadyRegistered[values]
            ){
            events[values].event.register()
            events[values].sideEvents.forEach(events => events.register())

            eventsAlreadyRegistered[values] = true

            ChatLib.chat(`ConfigName: ${values}, Boolean: ${bool} Registered`)
        }
        else if(
            !bool || eventsAlreadyRegistered[values] &&
            !checkForWorld(values) &&
            !checkForArea(values)
            ){
            events[values].event.unregister()
            events[values].sideEvents.forEach(events => events.unregister())

            eventsAlreadyRegistered[values] = false

            //ChatLib.chat(`ConfigName: ${values}, Boolean: ${bool} Unregistered`)
        }
    })
}).setFps(1)

const checkForWorld = (values) => (!events[values].requiredWorld || currentWorld.removeFormatting().includes(events[values].requiredWorld))
const checkForArea = (values) => (!events[values].requiredArea || currentArea.removeFormatting().includes(events[values].requiredArea))