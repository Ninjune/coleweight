import PogObject from "PogData"

let PogData = new PogObject("Coleweight", {
    "api_key": "",
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

export default
{
    PREFIX: "&2[CW] ",
    VERSION: (JSON.parse(FileLib.read("Coleweight", "metadata.json"))).version,
    data: PogData,
    powderdata: PowderData,
    timerdata: TimerData,
    downtimedata: DowntimeData,
    cwValues: [],
    calcCwPerHr: false,
    upTimeTrack: false,
    uptime: 0,
    baseColeweight: 0,
    stepsSinceLast: 0,
    throneValues: [],
    spiralValues: [],
    coleweightHr: 0,
    cwValuesSum: 0,
    beta: false,
    serverData: {}
}