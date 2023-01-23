import axios from "../../axios"
import settings from "../settings"
import constants from "./constants"
import { Promise } from '../../PromiseV2'
const PREFIX = constants.PREFIX


export function addCommas(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (error) {
        return 0;
    }
}// credit to senither for the regex, just don't care to make my own lol


export function addNotation(type, value) {
    let returnVal = value;
    let notList = [];
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ];
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"];
    }

    let checkNum = 1000;
    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1];
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift()
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100)
                    returnVal = Math.floor(returnVal)
                    returnVal = (returnVal / Math.pow(10, o)) * 10
                    returnVal = +returnVal.toFixed(o - 1) + notValue
                }
                checkNum *= 10;
            }
        }
    } else {
        returnVal = numberWithCommas(value.toFixed(0))
    }

    return returnVal
}


export function waypointRender(waypoints, yellow=false, numbered=false)
{
    let string = ""
    if(waypoints.length < 1) return
    waypoints.forEach((waypoint, index) => {
        string = Math.floor((Math.abs(parseInt(Player.getX()) - waypoint[0]) + Math.abs(parseInt(Player.getY()) - waypoint[1]) + Math.abs(parseInt(Player.getZ()) - waypoint[2]))/3) + "m"
        if (numbered)
            string = index + 1
        
        if (yellow)
            Tessellator.drawString(string, waypoint[0], waypoint[1], waypoint[2], 0xFAFD01)
        else
            Tessellator.drawString(string, waypoint[0], waypoint[1], waypoint[2])
    }) 
}


export class textGui
// guiObject format: { leftValues: [], rightValues: [] } (must have same amount of each or error).
{
    constructor(guiObject, x, y)
    {
        this.guiObject = guiObject
        this.x = x
        this.y = y
        this.alignment = 0
        this.moveGuiObject = new Gui()
    }


    renderGui()
    {
        let string = ""

        this.guiObject.leftValues.forEach((leftValue, index) => {
            if(leftValue == "Uptime")
            {
                let uptime = this.guiObject.rightValues[index] ?? 0,
                uptimeHr = Math.floor(uptime/60/60)
                
                if(uptimeHr >= 1)
                    string += `&aUptime: &b${uptimeHr}h ${Math.floor(uptime/60) - uptimeHr*60}m\n`
                else
                    string += `&aUptime: &b${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s\n`
            }
            else
            {
                string += `&a${leftValue}: &b${this.guiObject.rightValues[index]}\n`
            }
        })

        let text = new Text(string)
        if (this.alignment == 1)
            text.setAlign("CENTER")
        else if (this.alignment == 2)
            text.setAlign("RIGHT")
        text.setShadow(true)
        .setX(this.x)
        .setY(this.y)

        if (this.moveGuiObject.isOpen()) 
        {
            let txt = "Drag to move."

            Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        }

        text.draw()
    }


    moveGui()
    {
        this.moveGuiObject.open()
    }


    findDrawValues()
    {
        let string = ""

        this.guiObject.leftValues.forEach((leftValue, index) => {
            if(leftValue == "Uptime")
            {
                let uptime = this.guiObject.rightValues[index] ?? 0,
                uptimeHr = Math.floor(uptime/60/60)
                
                if(uptimeHr >= 1)
                    string += `&aUptime: &b${uptimeHr}h ${Math.floor(uptime/60) - uptimeHr*60}m\n`
                else
                    string += `&aUptime: &b${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s\n`
            }
            else
            {
                string += `&a${leftValue}: &b${this.guiObject.rightValues[index]}\n`
            }
        })

        return string
    }
}


export class trackerGui
{
    constructor(trackedItem = "", itemStringed = "")
    {
        this.itemStringed = itemStringed
        this.trackedItem = trackedItem
        this.itemValues = []
        this.uptimeSeconds = 0
        this.trackingItem = false
        this.apiCallsSinceLastChange = 0
        this.calcItemPerHour = false
        this.itemValuesSum = 0
        this.itemPerHour = 0
        this.itemGui = new textGui()
        this.currentItem = 0
        this.collectionMoveGui = new Gui()
    }

    renderGui(x, y, toggle = true, notation = false, alwaysShow = false) // can only be called in renderOverlay
    {
        if(!toggle) return
        let leftValues = [`${this.itemStringed}`, `${this.itemStringed}/hr`, `${this.itemStringed} gained`, "Uptime"]
        this.itemGui.x = x
        this.itemGui.y = y
        if (this.collectionMoveGui.isOpen()) 
        {
            let txt = "Drag to move."

            Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
            if(notation)
                this.itemGui.guiObject = {leftValues: leftValues, rightValues: [addNotation("oneLetters", this.currentItem) ?? 0, addNotation("oneLetters", this.itemPerHour) ?? 0, addNotation("oneLetters", this.itemValuesSum) ?? 0, this.uptimeSeconds]}
            else
                this.itemGui.guiObject = {leftValues: leftValues, rightValues: [addCommas(this.currentItem) ?? 0, addCommas(this.itemPerHour) ?? 0, addCommas(this.itemValuesSum) ?? 0, this.uptimeSeconds]}
            
            return this.itemGui.renderGui()
        }
        if(!toggle || !(alwaysShow || this.trackingItem || this.trackedItem == "")) return
        if(this.itemValues[0] != undefined && this.calcItemPerHour)
        {
            this.itemValuesSum = 0
            for(let i = 0; i < this.itemValues.length; i++)
                this.itemValuesSum += this.itemValues[i]
            let eq = Math.ceil((this.itemValuesSum*(3600/this.uptimeSeconds)) * 100) / 100
            eq != Infinity ? this.itemPerHour = eq : this.itemPerHour = "Calculating..."
            this.calcItemPerHour = false
        }

        if(notation)
            this.itemGui.guiObject = {leftValues: leftValues, rightValues: [addNotation("oneLetters", this.currentItem) ?? 0, addNotation("oneLetters", this.itemPerHour) ?? 0, addNotation("oneLetters", this.itemValuesSum) ?? 0, this.uptimeSeconds]}
        else
            this.itemGui.guiObject = {leftValues: leftValues, rightValues: [addCommas(this.currentItem) ?? 0, addCommas(this.itemPerHour) ?? 0, addCommas(this.itemValuesSum) ?? 0, this.uptimeSeconds]}    
        
        this.itemGui.renderGui()
    }

    calcApi(apiPath, tempUuid)
    {
        if(this.trackedItem == "" || constants.data.api_key == "") return
        let profileData = "",
        uuid = ""

        for(let i = 0; i < tempUuid.length; i++)
        {
            if(tempUuid[i] != "-")
                uuid += tempUuid[i]
        }

        try 
        {
            axios.get(`https://api.hypixel.net/skyblock/profiles?key=${constants.data.api_key}&uuid=${uuid}`)
            .then(res => {
                for(let i=0; i < res.data.profiles.length; i+=1) 
                {
                    if(res.data.profiles[i].selected == true) 
                        profileData = res.data.profiles[i]
                }
                let source = getObjectValue(profileData, apiPath)[this.trackedItem]

                if(this.currentItem == 0 || this.currentItem == undefined)
                {
                    this.currentItem = source
                }
                else if (this.trackingItem && (source - this.currentItem) > 0) // don't track first item because it won't have time tracked.
                {
                    this.itemValues.push(source - this.currentItem) // for averaging
                    this.calcItemPerHour = true // for deciding when to average the values (don't need to every renderGui)
                    this.trackingItem = true // for rendering gui & timer
                    this.apiCallsSinceLastChange = 0 // for disabling gui at 20
                    this.currentItem = source // current item value
                }
                else if ((source - this.currentItem) > 0)
                {
                    this.trackingItem = true
                    this.apiCallsSinceLastChange = 0
                    this.currentItem = source 
                }
                else if (this.apiCallsSinceLastChange > 20)
                {
                    this.uptimeSeconds = 0
                    this.trackingItem = false
                    this.apiCallsSinceLastChange = 0
                    this.itemValues = []
                }
                else
                {
                    this.apiCallsSinceLastChange += 1
                }
            })
        }
        catch(e) { if(settings.debug) console.log(e)}
    }
    resetVars()
    {
        this.currentItem = 0
        this.itemValues = []
        this.uptimeSeconds = 0
        this.trackingItem = false
        this.apiCallsSinceLastChange = 0
        this.itemPerHour = "Calculating..."
        this.itemValuesSum = 0
    }
    moveGui()
    {
        this.collectionMoveGui.open()
    }
}


export function getObjectValue(obj, path, def) 
{
	let current = obj
    if(path == undefined) return undefined
    for (let i = 0; i < path.length; i++) 
	    current = current[path[i]]

	return current
}


export function parseNotatedInput(input)
{
    for(let index = 0; index < input.length; index++)
    {
        
        switch(input[index])
        {
            case 'k':
                return 1000 * parseFloat(input.slice(0, index))
            case 'm':
                return 1000000 * parseFloat(input.slice(0, index))
        }
    }
    if(parseFloat(input) == input)
        return parseFloat(input)
    else
        return "NI" // not integer
}


export function getSelectedProfile(res)
{
    for(let i=0; i < res.data.profiles.length; i+=1) 
    {
        if(res.data.profiles[i].selected == true) 
            return res.data.profiles[i]
    }
}


export function capitalizeFirst(sentence)
{
    let words = sentence.split(" "),
     capitalized = words.map(word => {
        return word[0].toUpperCase() + word.slice(1);
    })

    return capitalized.join(" ")
}


export function drawTitle(text, drawTimestamp, scale = 5, time = 3000, sound = "random.orb",)
{
    let object = {}
    if(drawTimestamp == undefined)
    {
        World.playSound(sound, 1, 1)
        object.drawTimestamp = Date.now()
        object.drawTitle = 1
    }
    else if (Date.now() - drawTimestamp > time)
    {
        object.drawTimestamp = undefined
        object.drawTitle = 2
    }
    else
    {
        let title = new Text(text, Renderer.screen.getWidth()/2, Renderer.screen.getHeight()/2)
        title.setAlign("CENTER")
        .setShadow(true)
        .setScale(scale)
        .draw()
        object.drawTimestamp = drawTimestamp
        object.drawTitle = 1
    }
    return object
}


class locationChecker
{
    constructor(locations)
    {
        this.locations = locations
        this.checkTime = Date.now()
        this.state = false
        this.scoreboard = 0
    }

    check()
    {
        if(Date.now() - this.checkTime > 1000) // 1 sec
        {
            this.checkTime = Date.now()
            this.scoreboard = Scoreboard.getLines()

            for(let lineIndex = 0; lineIndex < this.scoreboard.length; lineIndex++)
            {
                for(let locationsIndex = 0; locationsIndex < this.locations.length; locationsIndex++)
                {
                    if(this.scoreboard[lineIndex].toString().includes(this.locations[locationsIndex])) 
                        return this.state = true
                }
            }
            return this.state = false
        }
    }
}

const hollowsChecker = new locationChecker(["Goblin", "Jungle", "Mithril", "Precursor", "Magma", "Crystal", "Khazad", "Divan", "City"])
export function checkInHollows() 
{
    hollowsChecker.check()
    return hollowsChecker.state
}

const dwarvenChecker = new locationChecker(["Dwarven", "Royal", "Palace", "Library", "Mist", "Cliffside", "Quarry", "Gateway", "Wall", "Forge", "Far", "Burrows", "Springs", "Upper"])
export function checkInDwarven() 
{
    dwarvenChecker.check()
    return dwarvenChecker.state
}

const foragingChecker = new locationChecker(["§aDark Thic🐍§aket", "§aBirch Par🐍§ak", "§aSpruce Wo🐍§aods", "§aSavanna W🐍§aoodland", "§aJungle Is🐍§aland", "§bForest"])
// pov: hypixel making a working game (i do the same thing)
export function checkInPark()
{
    foragingChecker.check()
    return foragingChecker.state
}


const endChecker = new locationChecker(["End", "Dragon's"])
export function checkInEnd() 
{
    endChecker.check()
    return endChecker.state
}

import { findGriefer } from "../chat/grieferTrack"
import { findTick } from "../commands/calculate/tick";

export function findColeweight(name)
{
    ChatLib.chat(`${PREFIX}Finding Coleweight!`)
    let username = ""
    if(name == undefined) 
        username = Player.getUUID()
    else 
        username = name
    axios.get(`https://ninjune.dev/api/coleweight?username=${username}`)
    .then(res => {
        let griefer = findGriefer(username), coleweightMessage
        if(griefer.found)
            coleweightMessage = new TextComponent(`${PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%) &c&lHas griefed before. &cLast grief: &a${griefer.dateObj.toString().slice(4, 15)}`)
        else
            coleweightMessage = new TextComponent(`${PREFIX}&b${res.data.rank}. ${res.data.name}&b's Coleweight: ${res.data.coleweight} (Top &l${res.data.percentile}&b%)`)
        coleweightMessage.setHoverValue(`&fExperience&f: &a${Math.round(res.data.experience.total*100) / 100}\n&fPowder&f: &a${Math.round(res.data.powder.total*100) / 100}\n&fCollection&f: &a${Math.round(res.data.collection.total*100) / 100}\n&fMiscellaneous&f: &a${Math.round(res.data.miscellaneous.total*100) / 100}`)
        ChatLib.chat(coleweightMessage)
    }) 
    .catch(err => {
        if(settings.debug) ChatLib.chat(`${PREFIX}&eError. (api may be down) ${err}`)
        else ChatLib.chat(`${PREFIX}&eError. (api may be down)`)
    })
}

/**
Chats a chat message with specified parameters.
@param {string} command - Command
@param {string} desc - Description
@param {string} usage - Usage
*/
export function helpCommand(command, desc, usage)
{  
    ChatLib.chat(new TextComponent(`&a◆ /cw ${command} => &b${desc}`).setHoverValue(`${"/cw " + command + " " + usage}`))
}


function findBlockEfficiency()
{

}

// https://cdn.discordapp.com/attachments/1052785334661947472/1053390221162590278/image.png thanks skyhelper dev
/**
 * 
 * @param {string} block 
 * @param {number} pristine 
 * @param {number} fortune 
 * @param {number} speed 
 * @param {boolean} blueCheese 
 * @param {number} blockPercentage must be decimal
 */
export function findGemstonesPerHr(block, pristine, fortune, speed, blueCheese, blockPercentage)
{
    const bal = block == "ruby" ? true : false
    const percentage = blockPercentage
    
    const msbTime = blueCheese ? 25 : 20
    const msb = (blueCheese ? 4 : 3) * (bal ? 1.15 : 1)

    const shardDrops = (2+4) / 2
    const blockDrops = (3+6) / 2
    const avgDrops = blockDrops * percentage + shardDrops * (1-percentage)

    const miningTicksObj = findTick(speed, block)
    const miningTicksBlocks = Math.max(4, miningTicksObj.currentBlockTick)
    const miningTicksShards = Math.max(4, miningTicksObj.currentShardTick)
    const miningTicks = miningTicksBlocks * percentage + miningTicksShards * (1-percentage)

    const msbSpeed = speed + speed * msb
    const msbTicksObj = findTick(msbSpeed, block)
    const msbTicksBlocks = Math.max(4, msbTicksObj.currentBlockTick)
    const msbTicksShards = Math.max(4, msbTicksObj.currentShardTick)
    const msbTicks = msbTicksBlocks * percentage + msbTicksShards * (1-percentage)

    const blocksPerHour = (72000 / (1 + miningTicks)) * ((120 - msbTime) / 120) + (72000 / (1 + msbTicks)) * (msbTime / 120)
    
    const gemstonesPerHour = avgDrops * (1 + pristine * 0.79) * (1 + fortune / 100) * blocksPerHour
    return { ticks: {blocks: miningTicksBlocks, shards: miningTicksShards, msbBlocks: msbTicksBlocks, msbShards: msbTicksShards}, gemstonesPerHour }
}


export function instaSellBZPrice(product)
{
    return new Promise((resolve, reject) => {
        axios.get("https://api.hypixel.net/skyblock/bazaar")
        .then(res => {
            if(res.data.products[product] != undefined)
                resolve(res.data.products[product].sell_summary[0].pricePerUnit)
            else
                resolve(0)
        })
        .catch(err => {
            if(settings.debug) console.log("BZ Price: " + err)
            reject(err)
        })
    })
}


export function trackCollection(collection)
{
    let collections = JSON.parse(FileLib.read("Coleweight", "data/collections.json"))
    if(collection == "obby") collection = "obsidian"
    if(collection == "cobble") collection = "cobblestone"
    if(collections[collection.toLowerCase()] == undefined) return ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    constants.data.tracked.item = collections[collection].collectionToTrack
    constants.data.tracked.itemStringed = collections[collection].collectionStringed
    constants.data.save()

    ChatLib.chat(`${PREFIX}&bSet collection to ${constants.data.tracked.itemStringed}!`)
}