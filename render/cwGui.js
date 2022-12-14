import settings from "../settings";
import constants from "../util/constants";
import axios from "../../axios"
const cwGui = new Gui()
let txt = "Please set your api key with /cw setkey (key)!"

let cwValues = [],
 calcCwPerHr = false,
 upTimeTrack = false,
 uptime = 0,
 coleweight = 0,
 baseColeweight = 0,
 stepsSinceLast = 0,
 coleweightHr = 0,
 cwValuesSum = 0,
 cwInfo


export function openCwGui()
{
    cwGui.open()
}


export function reloadColeweight() 
{
    upTimeTrack = false
    stepsSinceLast = 0
    cwValues = []
    uptime = 0
    ChatLib.chat(`${PREFIX}Reloaded!`)
}


register("dragged", (dx, dy, x, y) => {
    if (!cwGui.isOpen()) return
    constants.data.x = x
    constants.data.y = y
    constants.data.save()
})

register("renderOverlay", () => {
    if (cwGui.isOpen())
    {
        if (constants.data.api_key != undefined)
        txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        Renderer.drawStringWithShadow(`&aCW: &b0\n&aCW/hr: &b0\n&aUptime: &b0m\n&aColeweight Gained: &b0`, constants.data.x, constants.data.y)
    }

    if(!settings.cwToggle || constants.data.api_key == undefined) return
    let coleweightMessage = "",
     uptimeHr = Math.floor(uptime/60/60)
    
    coleweight > 1000 ?coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    if(cwValues[0] != undefined && upTimeTrack && calcCwPerHr)
    {
        cwValuesSum = 0
        for(let i = 0; i < cwValues.length; i++)
            cwValuesSum += cwValues[i]
        let eq = Math.ceil((cwValuesSum*(3600/uptime)) * 100) / 100
        eq != Infinity ? coleweightHr = eq : coleweightHr = "Calculating..."
        calcCwPerHr = false
    }
    
    if (cwGui.isOpen() || !upTimeTrack) return

    if(uptimeHr >= 1)
        Renderer.drawStringWithShadow(`&aCW: &b${coleweightMessage}\n&aCW/hr: &b${coleweightHr}\n&aUptime: &b${uptimeHr}h ${Math.floor(uptime/60) - uptimeHr*60}m\n&aColeweight Gained: &b${Math.ceil(cwValuesSum*100) / 100}`, constants.data.x, constants.data.y)
    else
        Renderer.drawStringWithShadow(`&aCW: &b${coleweightMessage}\n&aCW/hr: &b${coleweightHr}\n&aUptime: &b${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s\n&aColeweight Gained: &b${Math.ceil(cwValuesSum*100) / 100}`, constants.data.x, constants.data.y)
})

register("gameLoad", () => {
    axios.get(`https://ninjune.dev/api/cwinfo`)
    .then(cwInfoRes => {
        cwInfo = cwInfoRes.data
    })
})


register("step", () => {
    // updates coleweight for gui
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()
    
    if(upTimeTrack == true)
        uptime += 1
    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
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
                {
                    uuid = uuid + tempUuid[i]
                }
            }
                axios.get(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${uuid}`)
                .then(res => {
                    let eq = 0

                    for(let i=0; i < res.data.profiles.length; i+=1) 
                    {
                        if(res.data.profiles[i].selected == true) 
                            profileData = res.data.profiles[i] 
                    }

                    tempColeweight += Math.ceil((profileData.members[uuid][cwInfo.experience.name]/cwInfo.experience.req)*100) / 100

                    for(let i = 0; i < cwInfo.powder.length; i++)
                    {
                        let sourceToSearch = cwInfo.powder[i].name,
                         source = profileData.members[uuid].mining_core[sourceToSearch]
                        
                        if(source != undefined)
                        {
                            eq = Math.ceil(source/cwInfo.powder[i].req*100) / 100
                            
                            if(i == 0)
                            {
                                let powder2 = profileData.members[uuid].mining_core['powder_spent_mithril']

                                if(powder2 != undefined)
                                    eq = Math.ceil((source+powder2)/cwInfo.powder[i].req*100) / 100
                            }
                            else
                            {
                                let powder2 = profileData.members[uuid].mining_core['powder_spent_gemstone']

                                if(powder2 != undefined)
                                    eq = Math.ceil((source+powder2)/cwInfo.powder[i].req*100) / 100
                            }
                            tempColeweight += eq
                        }
                    }
                    
                    for(let i = 0; i < cwInfo.collection.length; i++)
                    {
                        let sourceToSearch = cwInfo.collection[i].name,
                         source = profileData.members[uuid].collection[sourceToSearch]
                        
                        if(source != undefined)
                        {
                            eq = Math.ceil(source/cwInfo.collection[i].req*100) / 100
                            tempColeweight += eq
                        }
                    }
                    for(let i = 0; i < cwInfo.miscellaneous.length; i++)
                    {
                        let sourceToSearch = cwInfo.miscellaneous[i].name
                        if(i == 0 || i == 1)
                            source = profileData.members[uuid].bestiary[sourceToSearch]
                        else
                            source = profileData.members[uuid].mining_core.crystals.jade_crystal[sourceToSearch]
                        if (source != undefined)
                        {
                            eq = Math.ceil(source/cwInfo.miscellaneous[i].req*100) / 100
                            tempColeweight += eq
                        }
                    }
                    if(baseColeweight == 0)
                    {
                        baseColeweight = tempColeweight
                    }
                    else if((tempColeweight - baseColeweight) > 0)
                    {
                        cwValues.push(tempColeweight - baseColeweight)
                        calcCwPerHr = true
                        upTimeTrack = true
                        stepsSinceLast = 0
                        baseColeweight = tempColeweight
                    }
                    else if(stepsSinceLast > 20)
                    {
                        uptime = 0
                        upTimeTrack = false
                        stepsSinceLast = 0
                        cwValues = []
                    }
                    else
                    {
                        stepsSinceLast += 1
                    }
                        
                    coleweight = Math.ceil(tempColeweight*100)/100
                })
        }
        catch(e) { if (settings.debug) console.log(e)}
    }
}).setFps(1)