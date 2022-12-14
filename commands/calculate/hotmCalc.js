import constants from "../../util/constants"
import { addCommas } from "../../util/helperFunctions"
const PREFIX = constants.PREFIX


export function hotmCalc(hotmName, minLevel, maxLevel)
{   
    if(hotmName == undefined)
    {
        let hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data

        ChatLib.chat(`/cw calc hotm (hotmName listed below) (minLevel) [maxLevel]`)
        for(let i = 0; i < hotmData.length; i++)
        {
            ChatLib.chat(hotmData[i].names[0])
        }
        return
    }
    if(maxLevel == undefined)
    {
        maxLevel = minLevel
        minLevel = 1
    }

    if(minLevel != parseInt(minLevel) || maxLevel != parseInt(maxLevel)) return ChatLib.chat(constants.CALCULATEERRORMESSAGE)

    minLevel = parseInt(minLevel)
    maxLevel = parseInt(maxLevel)
    let hotmObjectToFind = findHotmObject(hotmName)
    if(hotmObjectToFind == undefined) return ChatLib.chat(`${PREFIX}&cDid not find HOTM perk with name '${hotmName}'!`)

    maxLevel = (maxLevel < hotmObjectToFind.maxLevel ? maxLevel : hotmObjectToFind.maxLevel)

    let powderSum = findCost(hotmObjectToFind.costFormula, minLevel, maxLevel),
     reward = findReward(hotmObjectToFind.rewardFormula, minLevel, maxLevel)
    
    ChatLib.chat("")
    ChatLib.chat(`&6${hotmObjectToFind.nameStringed} ${minLevel} - ${maxLevel} &bwill cost &6&l${addCommas(Math.round(powderSum))} &6${hotmObjectToFind.powderType[0].toUpperCase() + hotmObjectToFind.powderType.slice(1)} &bpowder.`)
    ChatLib.chat(`&6${hotmObjectToFind.nameStringed} ${minLevel} - ${maxLevel} &bwill give &6&l${addCommas(Math.round(reward * 100) / 100)} &bof whatever reward is listed.`)
    ChatLib.chat("")
}

export function findHotmObject(hotmName)
{
    let hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data

    for(let i = 0; i < hotmData.length; i++)
    {
        if(hotmData[i].names.includes(hotmName))
            return hotmData[i]
    }
}

export function findCost(costFormula, minLevel, maxLevel)
{
    let powderSum = 0

    for(let currentLevel = minLevel; currentLevel < maxLevel; currentLevel++) // finds cost
        powderSum += eval(costFormula.replace("currentLevel", currentLevel))
    return powderSum
}

export function findReward(rewardFormula, minLevel, maxLevel)
{
    return eval(rewardFormula.replace("Level", 1+maxLevel-minLevel))
}