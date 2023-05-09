import axios from "../../axios"
import constants from "./constants"
const settings = constants.settings
import { Promise } from "../../PromiseV2"
const PREFIX = constants.PREFIX


export function addCommas(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } catch (error) {
        return 0
    }
} // credit to senither for the regex, just don't care to make my own lol


export function addNotation(type, value) {
    let returnVal = value
    let notList = []
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ]
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"]
    }

    let checkNum = 1000
    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1]
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift()
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100)
                    returnVal = Math.floor(returnVal)
                    returnVal = (returnVal / Math.pow(10, o)) * 10
                    returnVal = +returnVal.toFixed(o - 1) + notValue
                }
                checkNum *= 10
            }
        }
    } else {
        returnVal = addCommas(value.toFixed(0))
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

let griefers = []
/**
 * Finds if a player is a griefer.
 * @param {string} player
 * @returns
 */
export function findGriefer(player)
{
    let grieferReturnObj = {}
    grieferReturnObj.found = false
    griefers.forEach(griefer => {
        griefer.dateObj = new Date(0)
        griefer.dateObj.setUTCMilliseconds(griefer.timestamp)

        if(griefer.name.toLowerCase() == player.toLowerCase())
        {
            grieferReturnObj = griefer
            grieferReturnObj.found = true
        }
    })
    return grieferReturnObj
}


register("gameLoad", () => {
    axios.get("https://ninjune.dev/api/mminers")
    .then(res => {
        griefers = res.data.griefers
    })
    .catch(err => {
        if(!settings.debug) return
        console.log(new Error(err).lineNumber)
    })
})


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
            case "k":
                return 1000 * parseFloat(input.slice(0, index))
            case "m":
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
    if(sentence == undefined) return sentence
    let words = sentence.split(" "),
     capitalized = words.map(word => {
        return word[0].toUpperCase() + word.slice(1)
    })

    return capitalized.join(" ")
}

/**
 * This contains a value "drawState", this dictates whether or not this draw or not. Default to 0. Check for 1 in a "renderOverlay" to draw. (must set to draw.)
 * @param {string} text
 * @param {object} options
 * @returns
 */
export class Title
{
    constructor(text, options = {scale: 5, time: 3000, sound: "random.orb", yOffset: 0, xOffset: 0})
    {
        this.text = text
        this.scale = options.scale
        this.time = options.time
        this.sound = options.sound
        this.sizeMultiplier = options.sizeMultiplier
        this.yOffset = options.yOffset
        this.xOffset = options.xOffset
        this.drawState = 0

        register("renderOverlay", () => {
            if(this.drawState == 1)
            {
                const title = new Text(this.text,
                    Renderer.screen.getWidth()/2 + this.xOffset,
                    Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/14 + this.yOffset
                )
                if(this.drawTimestamp == undefined)
                {
                    World.playSound(this.sound, 1, 1)
                    this.drawTimestamp = Date.now()
                    this.drawState = 1
                }
                else if (Date.now() - this.drawTimestamp > this.time)
                {
                    this.drawTimestamp = undefined
                    this.drawState = 2
                }
                else
                {
                    title.setAlign("CENTER")
                    .setShadow(true)
                    .setScale(this.scale)
                    .draw()
                    this.drawState = 1
                }
            }
        })
    }

    draw()
    {
        this.drawState = 1
    }
}

class LocationChecker
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
                    {
                        this.state = true
                        return this.state
                    }
                }
            }
            this.state = false
            return this.state
        }
        else
            return this.state
    }
}

const hollowsChecker = new LocationChecker(["Goblin", "Jungle", "Mithril", "Precursor", "Magma", "Crystal", "Khazad", "Divan", "City"])
export function checkInHollows()
{
    hollowsChecker.check()
    return hollowsChecker.state
}

const dwarvenChecker = new LocationChecker(["Dwarven", "Royal", "Palace", "Library", "Mist", "Cliffside", "Quarry", "Gateway", "Wall", "Forge", "Far", "Burrows", "Springs", "Upper"])
export function checkInDwarven()
{
    dwarvenChecker.check()
    return dwarvenChecker.state
}

const foragingChecker = new LocationChecker(["§aDark Thic🐍§aket", "§aBirch Par🐍§ak", "§aSpruce Wo🐍§aods", "§aSavanna W🐍§aoodland", "§aJungle Is🐍§aland", "§bForest"])
// pov: hypixel making a working game (i do the same thing)
export function checkInPark()
{
    foragingChecker.check()
    return foragingChecker.state
}


const endChecker = new LocationChecker(["End", "Dragon's"])
export function checkInEnd()
{
    endChecker.check()
    return endChecker.state
}


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
        if(res.data.code != undefined)
            return ChatLib.chat(`${PREFIX}&e${res.data.error} Code: ${res.data.code}`)

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

// code based on MattTheCuber's gemstones/hr
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
        axios.get("https://api.hypixel.net/skyblock/bazaar", { headers: {"User-Agent": "Coleweight-requests"} })
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
    if(collection == undefined) return ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    if(collection == "obby") collection = "obsidian"
    if(collection == "cobble") collection = "cobblestone"
    if(collections[collection.toLowerCase()] == undefined) return ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    constants.data.tracked.item = collections[collection].collectionToTrack
    constants.data.tracked.itemStringed = collections[collection].collectionStringed
    constants.data.save()

    ChatLib.chat(`${PREFIX}&bSet collection to ${constants.data.tracked.itemStringed}!`)
}


function findStrength(block)
{
    let strength = -1

    if(block == parseInt(block) && block > 5) // change if add block to tick speed blocks in settings
        strength = block
    else
    {
        switch(block.toString().toLowerCase())
        {
            case "0":
            case "green_mithril":
                strength = 800
                break
            case "1":
            case "blue_mithril":
                strength = 1500
                break
            case "2":
            case "ruby":
            case "r":
                strength = 2500
                break
            case "3":
            case "j":
            case "jade":
            case "a":
            case "amber":
            case "amethyst":
            case "s":
            case "sapphire":
                strength = 3200
                break
            case "4":
            case "t":
            case "topaz":
            case "o":
            case "opal":
                strength = 4000
            case "5":
            case "jasper":
                strength = 5000
        }
    }

    return strength
}


/**
 * finds tick, returns and object with currentBlockTick & currentShardTick
 * @param {number} speed
 * @param {string} block
 * @returns {object}
 */
export function findTick(speed, block)
{
    let ticks = {err: false},
     strength = findStrength(block),
     tickStrength = strength-200

    ticks.currentBlockTick = strength*30/speed
    ticks.currentShardTick = tickStrength*30/speed

    if(ticks.currentBlockTick < 4.5)
    {
        if(ticks.currentBlockTick > 0.5)
            ticks.currentBlockTick = 4
    }

    if(ticks.currentShardTick < 4.5)
    {
        if(ticks.currentShardTick > 0.5)
            ticks.currentShardTick = 4
    }

    if(strength < 1) return ticks.err = true


    if(ticks.currentBlockTick < Math.floor(ticks.currentBlockTick) + 0.5)
        ticks.nextBlockSpeed = strength*30/(Math.floor(ticks.currentBlockTick)-0.5)
    else
        ticks.nextBlockSpeed = strength*30/(Math.floor(ticks.currentBlockTick)+0.5)

    if(ticks.currentShardTick < Math.floor(ticks.currentShardTick) + 0.5)
        ticks.nextShardSpeed = strength*30/(Math.floor(ticks.currentShardTick)-0.5)
    else
        ticks.nextShardSpeed = strength*30/(Math.floor(ticks.currentShardTick)+0.5)

    ticks.currentBlockTick = Math.round(ticks.currentBlockTick)
    ticks.currentShardTick = Math.round(ticks.currentShardTick)

    return ticks
}

/**
 * Function to remove the MC color codes from strings, chainable with other string functions.
 * @returns the string without the color code
 */
 String.prototype.removeColorCode = function() {
    let regex = /\u00A7[0-9A-FK-ORZ]/ig
    this.replaced = this.replace(regex, "")
    return this.replaced
} // @CrazyTech4

const File = Java.type("java.io.File")
export function deleteFile(path)
{
    const file = new File(Config.modulesFolder + "/Coleweight/" + path)

    if(file.exists())
        file.delete()
}
