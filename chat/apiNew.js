import constants from "../util/constants"
import axios from "../../axios"
const PREFIX = constants.PREFIX


register("chat", (key) => {
    axios.get(`https://api.hypixel.net/key?key=${key}`)
    .then(res => {
        if(res.data.success == true)
        {
            constants.data.api_key = key
            constants.data.save()
            ChatLib.chat(`${PREFIX}&aSuccsessfully set api key!`)
        }
        else
            ChatLib.chat(`${PREFIX}&eKey is not valid!`)
    })
    .catch(err => {
        ChatLib.chat(`${PREFIX}&eKey is not valid! if this is a mistake report: ${err}`)
    })
    ChatLib.chat(`${PREFIX}&aApi Key Successfully Set!`)
}).setCriteria(/Your new API key is (.+)/)

export default ""