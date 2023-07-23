import PogObject from "PogData"
import axios from "../../axios"
import settings from "../settings"

let PogData = new PogObject("Coleweight", {
    "api_key": "",
    "professional": 0,
    "jungle_amulet": true,
    "first_time": true,
    "tracked": {},
    "itemStringed": "",
    "museum": [],
    "currentPet": "",
    "effMinerEnabled": false,
    "coleweightGui": {
        "x": 0.5,
        "y": 141,
        "alignment": 0,
        "scale": 1.0
    },
    "powdertrackerGui": {
        "chests": 0,
        "gemstonePowder": 0,
        "mithrilPowder": 0,
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "timerGui": {
        "x": 0,
        "y": 0,
        "timer": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "stopwatchGui": {
        "x": 0,
        "y": 0,
        "stopwatch": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "downtimeGui" : {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "collectionGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "abilityGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "gyroGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "coinGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "ffGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    },
    "danceGui": {
        "x": 0,
        "y": 0,
        "alignment": 0,
        "scale": 1.0
    }
}, "config/data.json")

const PREFIX = "&2[CW] "
export default constants = {
    PREFIX: PREFIX,
    CALCULATEERRORMESSAGE: `${PREFIX}&cInvalid arguments. '/cw calculate help' for more information.`,
    INVALIDARGS: `${PREFIX}&cInvalid arguments. '/cw help' for more information.`,
    VERSION: (JSON.parse(FileLib.read("Coleweight", "metadata.json"))).version,
    CWINFO: undefined,
    data: PogData,
    beta: false,
    checkedGemstoneStats: false,
    settings,
    isFiesta: false
}

register("gameLoad", () => {
    axios.get("https://ninjune.dev/api/cwinfo?new=true")
    .then((res) => {
        constants.CWINFO = res.data
    })
    .catch((e) => {
    })
})


register("chat", (lvl, pet, event) => {
    constants.data.currentPet = pet.toLowerCase()
    constants.data.save()
}).setCriteria(/&cAutopet &eequipped your &.\[Lvl ([0-9]+)] &.([a-zA-Z]+)&e! &a&lVIEW RULE&r/g)


register("chat", (message, pet, event) => {
    if(message == "summoned")
        constants.data.currentPet = pet.toLowerCase()
    else if (message == "despawned")
        constants.data.currentPet = "N/A"

    constants.data.save()
}).setCriteria(/&r&aYou ([a-zA-Z]+) your &r&.([a-zA-Z✦ ]+)&r&a!&r/g)


register("chat", (state, event) => {
    constants.data.effMinerEnabled = state == "Enabled"
    constants.data.save()
}).setCriteria(/&r&.([a-zA-Z]+) Efficient Miner&r/g)