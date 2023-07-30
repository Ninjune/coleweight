import settings from "../../settings"
import axios from "../../../axios"
import request from "../../../requestV2"
import { registerGui } from "../../utils/GuIManager"
import { BaseGui } from "../../utils/BaseGui"
import { PREFIX, data, getCwApi, getObjectValue, getSelectedProfile, secondsToMessage } from "../../utils/Utils"

let cwValues = []
let calcCwPerHr = false
let upTimeTrack = false
let uptime = 0
let coleweight = 0
let baseColeweight = 0
let stepsSinceLast = 0
let coleweightHr = 0
let cwValuesSum = 0
let passPlayerCW = 0
let passPlayerRank = 0

const cwGui = new BaseGui(["coleweightGui", "coleweight", "cw"], () => {
    if(!data.api_key) return

    let coleweightMessage = ""
    let renderString = ""

    coleweight > 1000 ?coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`: coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`

    if(cwValues[0] != undefined && upTimeTrack && calcCwPerHr){
        cwValuesSum = 0
        for(let i = 0; i < cwValues.length; i++)
            cwValuesSum += cwValues[i]
        let eq = Math.ceil((cwValuesSum*(3600/uptime)) * 100) / 100
        eq != Infinity ? coleweightHr = eq : coleweightHr = "Calculating..."
        calcCwPerHr = false
    }

    if (!(cwGui.isOpen() || upTimeTrack)) return
    renderString += `&aCW: &b${coleweightMessage}\n&aCW/hr: &b${coleweightHr}\n`
    renderString += `&aUptime: &b${secondsToMessage(uptime)}\n`
    renderString += `&aColeweight Gained: &b${Math.ceil(cwValuesSum*100) / 100}\n`

    if(passPlayerCW != 0 && coleweightHr === parseFloat(coleweightHr))
        renderString += `&aTime to pass &6#${passPlayerRank}&a ${passPlayerName}:&b ${Math.round((passPlayerCW - coleweight)/coleweightHr)}h ${Math.floor((passPlayerCW - coleweight)/coleweightHr*60%60)}m`

    return renderString
}, "cwToggle", [
    register("step", () => {
        // updates coleweight for gui
        let date_ob = new Date()
        let seconds = date_ob.getSeconds()
        let coleWeightApi = getCwApi()
    
        if(!coleWeightApi) return
    
        if(upTimeTrack == true)
            uptime += 1
        if((seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45) && settings.cwToggle && coleWeightApi.length > 1)
        {
            try
            {
                let tempUuid = Player.getUUID(),
                 profileData = "",
                 tempColeweight = 0,
                 uuid = ""
    
                for(let i = 0; i < tempUuid.length; i++)
                {
                    if(tempUuid[i] != "-")
                        uuid += tempUuid[i]
                }
                request({
                    url: `https://api.hypixel.net/skyblock/profiles?key=${data.api_key}&uuid=${uuid}`,
                    json: true
                })
                .then(res => {
                    profileData = getSelectedProfile(res)
    
                    for(let i = 0; i < coleWeightApi.length; i++)
                    {
                        let source = getObjectValue(profileData.members[uuid], coleWeightApi[i].path),
                         source2 = getObjectValue(profileData.members[uuid], coleWeightApi[i].path2),
                         eq
    
                        if(source == undefined) continue
    
                        eq = Math.ceil(source/coleWeightApi[i].cost*100) / 100
                        if(source2 != undefined)
                            eq = Math.ceil((source+source2)/coleWeightApi[i].cost*100) / 100
    
                        if(eq != undefined)
                            tempColeweight += eq
                    }
    
                    if(baseColeweight == 0) // case: first run
                    {
                        baseColeweight = tempColeweight
                    }
                    else if((tempColeweight - baseColeweight) > 0) // case: new coleweight
                    {
                        cwValues.push(tempColeweight - baseColeweight)
                        calcCwPerHr = true
                        upTimeTrack = true
                        stepsSinceLast = 0
                        baseColeweight = tempColeweight
                    }
                    else if(stepsSinceLast > 20) // case: over 5m have passed with no cw updates
                    {
                        uptime = 0
                        upTimeTrack = false
                        stepsSinceLast = 0
                        cwValues = []
                    }
                    else // case: none of the above
                    {
                        stepsSinceLast += 1
                    }
    
                    coleweight = Math.ceil(tempColeweight*100)/100
                })
            }
            catch(e) { if(settings.debug) console.log(e) }
        }
    }).setFps(1)
], false, reloadColeweight)

registerGui(cwGui)

function reloadColeweight() {
    upTimeTrack = false
    stepsSinceLast = 0
    cwValues = []
    uptime = 0

    if(settings.cwPassPlayer == "") return
    
    axios.get(`https://ninjune.dev/api/coleweight?username=${settings.cwPassPlayer}`)
    .then(res => {
        if(res.data.code != undefined) // good
            return ChatLib.chat(`${PREFIX}&ePass player name in settings is not a valid player!`)
        passPlayerCW = res.data.coleweight
        passPlayerRank = res.data.rank
        passPlayerName = res.data.name
    })
}

register("gameLoad", () => {
    reloadColeweight()
})