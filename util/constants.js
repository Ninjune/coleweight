import PogObject from "PogData"

let PogData = new PogObject("Coleweight", {
    "api_key": "",
    "x": 0.5,
    "y": 141,
    "coleweight": 0,
    "cwToggle": true,
    "first_time": true
}, ".cw_data.json");

export default
{
    PREFIX: "&2[CW] ",
    VERSION: (JSON.parse(FileLib.read("Coleweight", "metadata.json"))).version,
    data: PogData,
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
    beta: false
}