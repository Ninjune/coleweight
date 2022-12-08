import PogObject from "PogData"

let PogData = new PogObject("Coleweight", {
    "api_key": "",
    "professional": 0,
    "jungle_amulet": true,
    "x": 0.5,
    "y": 141,
    "coleweight": 0,
    "first_time": true
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

const PREFIX = "&2[CW] "
export default
{
    PREFIX: PREFIX,
    CALCULATEERRORMESSAGE: `${PREFIX}&cInvalid arguments. '/cw calculate help' for more information.`,
    INVALIDARGS: `${PREFIX}&cInvalid arguments. '/cw help' for more information.`,
    VERSION: (JSON.parse(FileLib.read("Coleweight", "metadata.json"))).version,
    data: PogData,
    powderdata: PowderData,
    timerdata: TimerData,
    collectiondata: DowntimeData,
    collectiondata: CollectionData,
    throneValues: [],
    spiralValues: [],
    beta: false,
    serverData: {}
}