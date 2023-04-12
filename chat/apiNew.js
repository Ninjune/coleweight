import constants from "../util/constants"
import axios from "../../axios"
const PREFIX = constants.PREFIX


register("chat", (key) => {
    axios.get(`https://api.hypixel.net/key?key=${key}`)
    .then(res => {
        if(res.data.success == true)
            ChatLib.chat(`${PREFIX}&aSuccsessfully set api key!`)
        else
            ChatLib.chat(`${PREFIX}&eKey might not be valid!`)
        constants.data.api_key = key
        constants.data.save()
    })
    .catch(err => {
        ChatLib.chat(`${PREFIX}&eKey is not valid! if this is a mistake report: ${err}`)
    })
}).setCriteria(/Your new API key is (.+)/)

export default ""