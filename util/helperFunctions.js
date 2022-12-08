import axios from "../../axios";
import settings from "../settings";
import constants from "./constants";

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
        Renderer.drawStringWithShadow(string, this.x, this.y)
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

    renderGui(x, y, notation = false, renderGui = true) // can only be called in renderOverlay
    {
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
        if(!renderGui) return
        if(this.itemValues[0] != undefined && this.trackingItem && this.calcItemPerHour)
        {
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
            {
                uuid += tempUuid[i]
            }
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
                else if ((source - this.currentItem) > 0)
                {
                    this.itemValues.push(source - this.currentItem)
                    this.calcItemPerHour = true
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


function getObjectValue(obj, path, def) 
{
	let current = obj

    for (let i = 0; i < path.length; i++) 
	    current = current[path[i]] // could be source of issues

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