import axios from '../axios'
import PogObject from "PogData"

const PREFIX = "&2[CW] "
let data = new PogObject("Coleweight", {
    "api_key": undefined,
    "x": 0.5,
    "y": 141,
    "coleweight": 0,
    "cwToggle": true,
    "first_time": true
}, ".cw_data.json");

let cwValues = [],
 upTimeTrack = false,
 uptime = 0,
 baseColeweight = 0,
 stepsSinceLast = 0,
 cwGui = new Gui(),
 throneValues = [],
 spiralValues = [],
 coleweightHr = 0,
 cwValuesSum = 0
 

//key
register("chat", (key) => {
    data.api_key = key
    data.save()
    axios.get(`https://api.hypixel.net/key?key=${data.api_key}`)
    .then(res => {
        if(res.data.success == true)
            ChatLib.chat(`${PREFIX}&aSuccessfully Set api key!`)
        else
            ChatLib.chat(`${PREFIX}&eKey is not valid! (Try to set manually with /cw setkey <key>!)`)
    })
    .catch(err => {
        ChatLib.chat(`${PREFIX}&eKey is not valid! (Try to set manually with /cw setkey <key>!)`)
    })
}).setCriteria(/Your new API key is (.+)/)

//cw
register("command", (arg, arg2) => {
    switch(arg)
    {
        case "setkey": 
            if(arg2 == undefined) { ChatLib.chat(`${PREFIX}&eRequires an argument!`); return; }
            else key = arg2

            data.api_key = key
            data.save()
            axios.get(`https://api.hypixel.net/key?key=${data.api_key}`)
            .then(res => {
                if(res.data.success == true)
                    ChatLib.chat(`${PREFIX}&aSuccsessfully set api key!`)
                else
                    ChatLib.chat(`${PREFIX}&eKey is not valid!`)
            })
            .catch(err => {
                ChatLib.chat(`${PREFIX}&eKey is not valid!`)
            })
            break
        case "help":
            ChatLib.chat("")
            ChatLib.chat(`${PREFIX}&b/cw [username] => Gets coleweight`)
            ChatLib.chat(`${PREFIX}&b/cw help => This menu.`)
            ChatLib.chat(`${PREFIX}&b/cw gui => Change gui location`)
            ChatLib.chat(`${PREFIX}&b/cw toggle => Toggle gui (gui is only active when mining)`)
            ChatLib.chat(`${PREFIX}&b/cw setkey (key) => Sets API key (can also use /api new)`)
            ChatLib.chat(`${PREFIX}&b/cw reload => Reloads the gui.`)
            ChatLib.chat(`${PREFIX}&b/cw throne => Guide for setting up waypoints for throne.`)
            ChatLib.chat(`${PREFIX}&b/cw spiral => Guide for setting up waypoints for spiral.`)
            ChatLib.chat(`${PREFIX}&b/fetchdiscord (username) => Gets discord of username (if linked)`)
            ChatLib.chat("")
            break
        case "gui":
            cwGui.open();
            break
        case "toggle":
            data.cwToggle = !data.cwToggle
            data.save()
            ChatLib.chat(`${PREFIX}&bSet gui to: &3${data.cwToggle}`)
            break
        case "throne":
            if(arg2 != "toggle")
            {
                ChatLib.chat(`${PREFIX}&bGo to the throne and sit on the back block then run /cw throne toggle.`)
            }
            else
            {
                if(throneValues[0] == undefined)
                {
                    let startPos = [Player.getX()-24, Player.getY()+6, Player.getZ()-59] // calculated below values at a weird start so adjusting them
                    throneValues.push([startPos[0]+8, startPos[1]+2, startPos[2]-5])
                    throneValues.push([startPos[0]+11, startPos[1]-35, startPos[2]-3])
                    throneValues.push([startPos[0]+2, startPos[1]-34, startPos[2]-4])
                    throneValues.push([startPos[0]+-2, startPos[1]-1, startPos[2]+49])
                    throneValues.push([startPos[0]+2, startPos[1]-13, startPos[2]+52])
                    throneValues.push([startPos[0]+27, startPos[1]-9, startPos[2]+51])
                    throneValues.push([startPos[0]+38, startPos[1]-15, startPos[2]+47])
                    throneValues.push([startPos[0]+41, startPos[1]-44, startPos[2]+46])
                    throneValues.push([startPos[0]+50, startPos[1]-28, startPos[2]+38])
                    throneValues.push([startPos[0]+49, startPos[1]-31, startPos[2]+1])
                    throneValues.push([startPos[0]+50, startPos[1]-1, startPos[2]+10])
                    ChatLib.chat(`${PREFIX}&bThrone waypoints turned on!`)
                }
                else 
                {
                    throneValues = []
                    ChatLib.chat(`${PREFIX}&bThrone waypoints turned off!`)
                }
            }
            break
        case "spiral":
            if(arg2 != "toggle")
            {
                new TextComponent(`${PREFIX}&bGo to the place in &3this&b picture and do /cw spiral toggle`)
                .setClickAction("open_url")
                .setClickValue("https://i.imgur.com/dyL30GD.png")
                .chat()
            }
            else
            {
                if(spiralValues[0] == undefined)
                {
                    let startPos = [Player.getX(), Player.getY(), Player.getZ()]
                    spiralValues.push([startPos[0]+2, startPos[1]-3, startPos[2]+14])
                    spiralValues.push([startPos[0]+3, startPos[1]-21, startPos[2]+6])
                    spiralValues.push([startPos[0]+6, startPos[1]-23, startPos[2]-1])
                    spiralValues.push([startPos[0]+19, startPos[1]+4, startPos[2]-5])
                    spiralValues.push([startPos[0]+21, startPos[1]-7, startPos[2]])
                    spiralValues.push([startPos[0]+25, startPos[1]-35, startPos[2]-8])
                    spiralValues.push([startPos[0]+39, startPos[1]-36, startPos[2]])
                    spiralValues.push([startPos[0]+52, startPos[1]-24, startPos[2]+1])
                    spiralValues.push([startPos[0]+48, startPos[1]+3, startPos[2]+3])
                    spiralValues.push([startPos[0]+47, startPos[1]+4, startPos[2]+22])
                    spiralValues.push([startPos[0]+55, startPos[1]-8, startPos[2]+42])
                    spiralValues.push([startPos[0]+46, startPos[1]-11, startPos[2]+49])
                    spiralValues.push([startPos[0]+26, startPos[1]+5, startPos[2]+39])
                    spiralValues.push([startPos[0]+20, startPos[1]+3, startPos[2]+41])
                    spiralValues.push([startPos[0]+8, startPos[1]-23, startPos[2]+32])
                    spiralValues.push([startPos[0]+4, startPos[1]-23, startPos[2]+28])
                    ChatLib.chat(`${PREFIX}&bSpiral waypoints turned on!`)
                }
                else 
                {
                    spiralValues = []
                    ChatLib.chat(`${PREFIX}&bSpiral waypoints turned off!`)
                }
            }
            break
        case "reload":
            upTimeTrack = false
            stepsSinceLast = 0
            cwValues = []
            break
        default:
            let username = ""
            if(arg == undefined) 
                username = Player.getUUID()
            else 
                username = arg 
            
            axios.get(`https://ninjune.dev/api/coleweight?username=${username}`)
                .then(res => {
                    let coleweightMessage = new TextComponent(`${PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%)`)
                        .setHoverValue(`&fExperience&f: &a${res.data.exp}\n&fPowder&f: &a${res.data.pow}\n&fCollection&f: &a${res.data.col}\n&fMiscellaneous&f: &a${res.data.bes + res.data.nuc}`);
                    ChatLib.chat(coleweightMessage);
                })
                .catch(err => {
                    ChatLib.chat(`${PREFIX}&eError. (api may be down)`)
                });
    }
    
}).setTabCompletions((args) => {
    let output = [],
     commands = ["help", "setkey", "gui", "toggle", "throne", "spiral", "reload"]

    if(args[0].length == 0 || args[0] == undefined)
        output = commands
    else
    {
        for(let i = 0; i < commands.length; i++)
        {
            for(let j = 0; j < args[0].length; j++)
            {
                if(commands[i][j] != args[0][j])
                    break
                else if(j == args[0].length - 1)
                    output.push(commands[i])
            }
        }
    }
    return output
}).setName("cw").setAliases(["coleweight"])


//fetchdiscord
register("command", (arg) => {
    if(arg == undefined) { ChatLib.chat(`${PREFIX}&eRequires a username!`); return; }
    axios.get(`https://api.ashcon.app/mojang/v2/user/${arg}`)
        .then(res => {
            let uuid = res.data.uuid;
            axios.get(`https://api.hypixel.net/player?key=${data.api_key}&uuid=${uuid}`)
            .then(res2 => {
                let discordMessage = new TextComponent(`${PREFIX}&a${res.data.username}'s Discord: `)
                ChatLib.chat(discordMessage);
                ChatLib.chat(`&b${res2.data.player.socialMedia.links.DISCORD}`)
            })
            .catch(err => {
                ChatLib.chat(`${PREFIX}&eNo discord linked :( (or no key linked)`)
            })
        })
        .catch(err => {
            ChatLib.chat(`${PREFIX}&eInvalid name! `)
        });
}).setName("fetchdiscord").setAliases(["fdiscord"]);

//gui
register("dragged", (dx, dy, x, y) => {
    if (!cwGui.isOpen()) return
    data.x = x
    data.y = y
    data.save()
});

register("renderOverlay", () => {
    if (cwGui.isOpen()) {
        let txt = "Please set your api key with /cw setkey (key)!"
        if (data.api_key != undefined)
            txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        Renderer.drawStringWithShadow(`&aCW: &b0\n&aCW/hr: &b0\n&aUptime: &b0m\n&aColeweight Gained: &b0`, data.x, data.y)
    }
    if(!data.cwToggle || data.api_key == undefined) return
    let coleweight = data.coleweight || 0,
     coleweightMessage = ""

    coleweight > 1000 ?coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    if(cwValues[0] != undefined && upTimeTrack && calcCwPerHr)
    {
        cwValuesSum = 0
        for(let i = 0; i < cwValues.length; i++)
        {
            cwValuesSum += cwValues[i]
        }
        coleweightHr = Math.ceil((cwValuesSum*(3600/uptime)) * 100) / 100
        calcCwPerHr = false
    }
    
    if (cwGui.isOpen() || !upTimeTrack) return
    let uptimeHr = Math.floor(uptime/60/60)
    if(uptimeHr >= 1)
        Renderer.drawStringWithShadow(`&aCW: &b${coleweightMessage}\n&aCW/hr: &b${coleweightHr}\n&aUptime: &b${uptimeHr}h ${Math.floor(uptime/60) - uptimeHr}m\n&aColeweight Gained: &b${Math.ceil(cwValuesSum*100) / 100}`, data.x, data.y)
    else
        Renderer.drawStringWithShadow(`&aCW: &b${coleweightMessage}\n&aCW/hr: &b${coleweightHr}\n&aUptime: &b${Math.floor(uptime/60)}m\n&aColeweight Gained: &b${Math.ceil(cwValuesSum*100) / 100}`, data.x, data.y)
})

//world update (coords)
register("renderWorld", () => {
    if(throneValues[0] != undefined)
    {
        for(let i = 0; i < throneValues.length; i++)
        {
            Tessellator.drawString(i+1, throneValues[i][0], throneValues[i][1], throneValues[i][2])
        }
    }
    if(spiralValues[0] != undefined)
    {
        for(let i = 0; i < spiralValues.length; i++)
        {
            Tessellator.drawString(i+1, spiralValues[i][0], spiralValues[i][1], spiralValues[i][2])
        }
    }
    
})

//update every second (dogshit code)
register("step", () => {
    // first time check
    if (data.first_time) 
    {
        data.first_time = false; 
        data.save();
        ChatLib.chat("");
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bPlease Set Your Api Key By Doing /api new`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bOr By Doing /cw setkey (key)`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bView commands: /cw help`)).chat();
        ChatLib.chat("");
    }
    if (data.api_key == undefined) return
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
            
            axios.get(`https://api.hypixel.net/skyblock/profiles?key=${data.api_key}&uuid=${uuid}`)
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
                if(baseColeweight == 0)
                {
                    baseColeweight = coleweight
                }
                else if((coleweight - baseColeweight) > 0)
                {
                    cwValues.push(coleweight - baseColeweight)
                    calcCwPerHr = true
                    upTimeTrack = true
                    stepsSinceLast = 0
                    baseColeweight = coleweight
                }
                else if(stepsSinceLast > 20)
                {
                    upTimeTrack = false
                    stepsSinceLast = 0
                    cwValues = []
                }
                else
                {
                    stepsSinceLast += 1
                }
                    
                data.coleweight = Math.ceil(coleweight*100)/100
                data.save()
            })
            .catch(err => {})
        }
        catch(e)
        {
            ChatLib.chat(e)
        }
    }
}).setFps(1);