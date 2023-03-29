import constants from "../../util/constants"
import { addCommas } from "../../util/helperFunctions"
const PREFIX = constants.PREFIX


export function hotmCalc(hotmName, minLevel, maxLevel)
{
    if(hotmName == undefined)
    {
        let hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data

        ChatLib.chat("/cw calc hotm (hotmName listed below) (minLevel) [maxLevel]")
        for(let i = 0; i < hotmData.length; i++)
        {
            ChatLib.chat(hotmData[i].names[0])
        }
        return
    }
    new Thread(() => {
        if(maxLevel == undefined)
        {
            maxLevel = minLevel
            minLevel = 2
        }

        if(minLevel != parseInt(minLevel) || maxLevel != parseInt(maxLevel)) return ChatLib.chat(constants.CALCULATEERRORMESSAGE)

        minLevel = parseInt(minLevel)
        maxLevel = parseInt(maxLevel)
        let hotmObjectToFind = findHotmObject(hotmName)
        if(hotmObjectToFind == undefined) return ChatLib.chat(`${PREFIX}&cDid not find HOTM perk with name '${hotmName}'!`)

        maxLevel = (maxLevel < hotmObjectToFind.maxLevel ? maxLevel : hotmObjectToFind.maxLevel)
        let powderSum,
        reward = findReward(hotmName, minLevel, maxLevel)

        if(hotmObjectToFind.names[0] == "fortunate")
            powderSum = findCost(undefined, minLevel, maxLevel, true)
        else
            powderSum = findCost(hotmName, minLevel, maxLevel)


        ChatLib.chat("")
        ChatLib.chat(`&6${hotmObjectToFind.nameStringed} ${minLevel} - ${maxLevel} &bwill cost &6&l${addCommas(Math.round(powderSum))} &6${hotmObjectToFind.powderType[0].toUpperCase() + hotmObjectToFind.powderType.slice(1)} &bpowder.`)
        ChatLib.chat(`&6${hotmObjectToFind.nameStringed} ${minLevel} - ${maxLevel} &bwill give &6&l${addCommas(Math.round(reward * 100) / 100)} &bof whatever reward is listed.`)
        ChatLib.chat("")
    }).start()
}

export function findHotmObject(hotmName)
{
    let hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data

    for(let i = 0; i < hotmData.length; i++)
    {
        if(hotmData[i].names.includes(hotmName.toLowerCase()))
            return hotmData[i]
    }
}


let tickData = JSON.parse(FileLib.read("Coleweight", "data/tickData.json"))
export function findCost(hotmName, minLevel, maxLevel, fortunate = false)
{
    let costFormula
    if(tickData[`${hotmName} ${minLevel}-${maxLevel}`] != undefined)
        return tickData[`${hotmName} ${minLevel}-${maxLevel}`]
    else
    {
        if(!fortunate)
            costFormula = findHotmObject(hotmName).costFormula

        let powderSum = 0

        if(fortunate)
            powderSum = Math.pow(maxLevel+1, 3.05)
        else
        {
            for(let currentLevel = minLevel; currentLevel <= maxLevel; currentLevel++) // finds cost
                powderSum += eval(costFormula.replace("currentLevel", currentLevel))
        }
        tickData[`${hotmName} ${minLevel}-${maxLevel}`] = powderSum
        FileLib.write("Coleweight", "data/tickData.json", JSON.stringify(tickData))
        return powderSum
    }
}

export function findReward(hotmName, minLevel, maxLevel)
{
    let rewardFormula = findHotmObject(hotmName).rewardFormula
    return eval(rewardFormula.replace("Level", 2+maxLevel-minLevel))
}