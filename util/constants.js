import PogObject from "PogData"
import axios from "../../axios"
import settings from "../settings"

let PogData = new PogObject("Coleweight", {
    "api_key": "",
    "professional": 0,
    "jungle_amulet": true,
    "x": 0.5,
    "y": 141,
    "first_time": true,
    "tracked": {}
}, "config/.cw_data.json")

let PowderData = new PogObject("Coleweight", {
    "chests": 0,
    "gemstonePowder": 0,
    "mithrilPowder": 0,
    "x": 0,
    "y": 0
}, "config/.powdertracker_data.json")

let TimerData = new PogObject("Coleweight", {
    "x": 0,
    "y": 0,
    "timer": 0
}, "config/.timer_data.json")

let DowntimeData = new PogObject("Coleweight", {
    "x": 0,
    "y": 0
}, "config/.downtime_data.json")

let CollectionData = new PogObject("Coleweight", {
    "x": 0,
    "y": 0
}, "config/.collection_data.json")

let AbilityData = new PogObject("Coleweight", {
    "x": 0,
    "y": 0
}, "config/.ability_data.json")

const PREFIX = "&2[CW] "
export default constants = {
    PREFIX: PREFIX,
    CALCULATEERRORMESSAGE: `${PREFIX}&cInvalid arguments. '/cw calculate help' for more information.`,
    INVALIDARGS: `${PREFIX}&cInvalid arguments. '/cw help' for more information.`,
    VERSION: (JSON.parse(FileLib.read("Coleweight", "metadata.json"))).version,
    CWINFO: undefined,
    data: PogData,
    powderdata: PowderData,
    timerdata: TimerData,
    downtimedata: DowntimeData,
    collectiondata: CollectionData,
    abilitydata: AbilityData,
    beta: false
}

register("gameLoad", () => {
    axios.get(`https://ninjune.dev/api/cwinfo?new=true`)
    .then((res) => {
        constants.CWINFO = res.data
    })
    .catch((e) => {
        if(settings.debug) console.log(`[CW] Error loading CWINFO: ${e}`)
    })
})