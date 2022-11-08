import './util/apiNew'
import './commandManager'
import './util/updater'
import axios from '../axios'
import constants from './util/constants';
import Settings from './gui/settingsGui.js'


const PREFIX = constants.PREFIX


//world update (coords)
register("renderWorld", () => {
    if(constants.throneValues[0] != undefined)
    {
        for(let i = 0; i < constants.throneValues.length; i++)
        {
            Tessellator.drawString(i+1, constants.throneValues[i][0], constants.throneValues[i][1], constants.throneValues[i][2])
        }
    }
    if(constants.spiralValues[0] != undefined)
    {
        for(let i = 0; i < constants.spiralValues.length; i++)
        {
            Tessellator.drawString(i+1, constants.spiralValues[i][0], constants.spiralValues[i][1], constants.spiralValues[i][2])
        }
    }
    
})

//update every second (dogshit code)
register("step", () => {
    // first time check
    if (constants.data.first_time) 
    {
        constants.data.first_time = false
        constants.data.save()
        ChatLib.chat("")
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bPlease Set Your Api Key By Doing /api new`)).chat()
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bOr By Doing /cw setkey (key)`)).chat()
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bView commands: /cw help`)).chat()
        ChatLib.chat("")
    }
    if (constants.data.api_key == undefined || constants.data.api_key == "") return

    // updates coleweight for gui
    let date_ob = new Date(),
     seconds = date_ob.getSeconds()
    
    if(constants.upTimeTrack == true)
        constants.uptime += 1
    if(seconds == 0 || seconds == 15 || seconds == 30 || seconds == 45)
    {
        try 
        {
            let tempUuid = Player.getUUID(),
             profileData = "",
             coleweight = 0,
             uuid = ""

            for(let i = 0; i < tempUuid.length; i++)
            {
                if(tempUuid[i] != "-")
                {
                    uuid = uuid + tempUuid[i]
                }
            }
            axios.get(`https://ninjune.dev/api/cwinfo`)
            .then(cwInfoRes => {
                axios.get(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${uuid}`)
                .then(res => {
                    let eq = 0,
                     cwInfo = cwInfoRes.data

                    for(let i=0; i < res.data.profiles.length; i+=1) 
                    {
                        if(res.data.profiles[i].selected == true) 
                            profileData = res.data.profiles[i] 
                    }

                    coleweight += Math.ceil((profileData.members[uuid][cwInfo.experience.name]/cwInfo.experience.req)*100) / 100

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
                            coleweight += eq
                        }
                    }
                    
                    for(let i = 0; i < cwInfo.collection.length; i++)
                    {
                        let sourceToSearch = cwInfo.collection[i].name,
                         source = profileData.members[uuid].collection[sourceToSearch]
                        
                        if(source != undefined)
                        {
                            eq = Math.ceil(source/cwInfo.collection[i].req*100) / 100
                            coleweight += eq
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
                            coleweight += eq
                        }
                    }

                    if(constants.baseColeweight == 0)
                    {
                        constants.baseColeweight = coleweight
                    }
                    else if((coleweight - constants.baseColeweight) > 0)
                    {
                        constants.cwValues.push(coleweight - constants.baseColeweight)
                        constants.calcCwPerHr = true
                        constants.upTimeTrack = true
                        constants.stepsSinceLast = 0
                        constants.baseColeweight = coleweight
                    }
                    else if(constants.stepsSinceLast > 20)
                    {
                        constants.upTimeTrack = false
                        constants.stepsSinceLast = 0
                        constants.cwValues = []
                    }
                    else
                    {
                        constants.stepsSinceLast += 1
                    }
                        
                    constants.data.coleweight = Math.ceil(coleweight*100)/100
                    constants.data.save()
                })
                .catch(err => {ChatLib.chat(e)})
                })
        }
        catch(e)
        {
            ChatLib.chat(e)
        }
    }
}).setFps(1);