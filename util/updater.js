import axios from "../../axios"
import constants from "./constants"
PREFIX = constants.PREFIX
VERSION = constants.VERSION

register("worldLoad", () => {
    axios.get(`https://raw.githubusercontent.com/Ninjune/coleweight/main/metadata.json`)
    .then(res => {
        if(res.data.version == VERSION) return
        ChatLib.chat(`${PREFIX}&eYou are using an unsupported version of Coleweight!`)
        new TextComponent(`${PREFIX}&eClick &3here&e to open the github releases!`)
        .setClickAction("open_url")
        .setClickValue(`https://github.com/Ninjune/coleweight/releases`)
        .chat()
        ChatLib.chat("")
    })
    .catch(err => {
        ChatLib.chat(err)
    })
})

export default ""