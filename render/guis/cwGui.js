import settings from "../../settings"
import constants from "../../util/constants"
import axios from "../../../axios"
import request from "../../../requestV2"
import { getObjectValue, getSelectedProfile, secondsToMessage } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
import { registerGui } from "../../guiManager"

let cwValues = [],
 calcCwPerHr = false,
 upTimeTrack = false,
 uptime = 0,
 coleweight = 0,
 baseColeweight = 0,
 stepsSinceLast = 0,
 coleweightHr = 0,
 cwValuesSum = 0,
 passPlayerCW = 0,
 passPlayerRank = 0

const cwGui = new BaseGui(["coleweightGui", "coleweight", "cw"], () => {
    if(constants.data.api_key == undefined) return
    let coleweightMessage = "",
     renderString = ""

    coleweight > 1000 ?coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`: coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    if(cwValues[0] != undefined && upTimeTrack && calcCwPerHr)
    {
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
}, () => { return settings.cwToggle } , reloadColeweight)
registerGui(cwGui)


function reloadColeweight()
{
    upTimeTrack = false
    stepsSinceLast = 0
    cwValues = []
    uptime = 0

    if(settings.cwPassPlayer == "") return
    axios.get(`https://ninjune.dev/api/coleweight?username=${settings.cwPassPlayer}`)
    .then(res => {
        if(res.data.code != undefined) // good
            return ChatLib.chat(`${constants.PREFIX}&ePass player name in settings is not a valid player!`)
        passPlayerCW = res.data.coleweight
        passPlayerRank = res.data.rank
        passPlayerName = res.data.name
    })
}


register("step", () => {
    // updates coleweight for gui
    let date_ob = new Date(),
     seconds = date_ob.getSeconds(),
     cwinfo = constants.CWINFO

    if(cwinfo == undefined) return

    if(upTimeTrack == true)
        uptime += 1
    if((seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45) && settings.cwToggle && cwinfo.length > 1)
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
                url: `https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${uuid}`,
                json: true
            })
            .then(res => {
                profileData = getSelectedProfile(res)

                for(let i = 0; i < cwinfo.length; i++)
                {
                    let source = getObjectValue(profileData.members[uuid], cwinfo[i].path),
                     source2 = getObjectValue(profileData.members[uuid], cwinfo[i].path2),
                     eq

                    if(source == undefined) continue

                    eq = Math.ceil(source/cwinfo[i].cost*100) / 100
                    if(source2 != undefined)
                        eq = Math.ceil((source+source2)/cwinfo[i].cost*100) / 100

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


register("gameLoad", () => {
    reloadColeweight()
})