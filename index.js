import axios from '../axios'
import './commandManager'
import constants from './util/constants';
import "./util/updater"
import Settings from "./gui/settingsGui.js"

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
    if (constants.data.api_key == undefined) return

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
             cwRows = (FileLib.read("Coleweight", "coleweight.csv")).split("\r\n"),
             cwData = "",
             coleweight = 0,
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
                for(let i=0; i < res.data.profiles.length; i+=1) 
                {
                    if(profileToSearch = 'none' && res.data.profiles[i].selected == true) 
                        cwData = res.data.profiles[i] 
                    else if(res.data.profiles[i].cute_name == profileToSearch) 
                        cwData = res.data.profiles[i]
                }
                for(let i = 0; i < cwRows.length; i++)
                {
                    let row = cwRows[i].split(","),
                     sourceToSearch = row[0];
                     
                    if(row[2] == undefined) 
                    {
                        let source = cwData.members[uuid][sourceToSearch],
                         eq = Math.ceil(source/row[1]*100) / 100
                        if(eq != undefined)
                            coleweight += eq
                    }
                    else if(row[3] == undefined)
                    {
                        let source = cwData.members[uuid][row[2]][sourceToSearch]
                        if (sourceToSearch == "powder_mithril_total")
                        {
                            var eq = Math.ceil(source/row[1]*100) / 100
                            let powder2 = cwData.members[uuid]['mining_core']['powder_spent_mithril']
                            
                            if(powder2 != undefined)
                            {
                                eq = Math.ceil((source+powder2)/row[1]*100) / 100
                            }
                        }
                        else if (sourceToSearch == "powder_gemstone_total")
                        {
                            var eq = Math.ceil(source/row[1]*100) / 100
                            let powder2 = cwData.members[uuid]['mining_core']['powder_spent_gemstone']

                            if(powder2 != undefined)
                            {
                                eq = Math.ceil((source+powder2)/row[1]*100) / 100
                            }
                        }
                        else
                            var eq = Math.ceil(source/row[1]*100) / 100
                        
                        if(eq != undefined)
                            coleweight += eq
                    }
                    else if(row[5] == undefined)
                    {
                        let source = cwData.members[uuid][row[2]][row[3]][row[4]][sourceToSearch]
                         eq = Math.ceil(source/row[1]*100) / 100
                        if(source != undefined)
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
            .catch(err => {})
        }
        catch(e)
        {
            ChatLib.chat(e)
        }
    }
}).setFps(1);