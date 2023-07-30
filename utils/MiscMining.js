// Misc mining functions i didn't know what to call it
import { CALCULATEERRORMESSAGE, PREFIX, addCommas, parseNotatedInput } from "./Utils"

export function tickCommand(speed, block) {
    if(speed == undefined || parseInt(speed) != speed)
        return ChatLib.chat(`${PREFIX}&cMining speed must be an integer!`)
    if(block == undefined)
        return ChatLib.chat(CALCULATEERRORMESSAGE)
    const ticks = findTick(speed, block)
    if(ticks.err) return ChatLib.chat(`${PREFIX}&cBlock must be a gemstone or positive breaking power! (or starting letter of gemstone)`)


    ChatLib.chat(`\n&bCurrently mining blocks in &6&l${Math.round(ticks.currentBlockTick)} ticks` +
    `\n&bCurrently mining shards in &6&l${Math.round(ticks.currentShardTick)} ticks` +
    `\n&bNext block tick will be at: &6&l${Math.round(ticks.nextBlockSpeed)} mining speed` +
    `\n&bNext shard tick will be at: &6&l${Math.round(ticks.nextShardSpeed)} mining speed` +
    `\n&bYou need &6&l${Math.round(ticks.nextBlockSpeed - speed)} mining speed&b to get the next block tick.` +
    `\n&bYou need &6&l${Math.round(ticks.nextShardSpeed - speed)} mining speed&b to get the next shard tick.\n`)
}

/**
 * finds tick, returns and object with currentBlockTick & currentShardTick
 * @param {number} speed
 * @param {string} block
 * @returns {object}
 */
export function findTick(speed, block) {
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

function findStrength(block) {
    let strength = -1

    if(block == parseInt(block) && block > 5) // change if add block to tick speed blocks in settings
        strength = block
    else {
        switch(block.toString().toLowerCase()) {
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

export function hotmCalc(hotmName, minLevel, maxLevel) {
    if(!hotmName) {
        let hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data

        ChatLib.chat("/cw calc hotm (hotmName listed below) (minLevel) [maxLevel]")
        for(let i = 0; i < hotmData.length; i++)
        {
            ChatLib.chat(hotmData[i].names[0])
        }
        return
    }
    new Thread(() => {
        if(!maxLevel) {
            maxLevel = minLevel
            minLevel = 2
        }

        if(minLevel != parseInt(minLevel) || maxLevel != parseInt(maxLevel)) return ChatLib.chat(CALCULATEERRORMESSAGE)

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

export function findHotmObject(hotmName) {
    let hotmData = JSON.parse(FileLib.read("Coleweight", "data/hotm.json")).data

    for(let i = 0; i < hotmData.length; i++)
    {
        if(hotmData[i].names.includes(hotmName.toLowerCase()))
            return hotmData[i]
    }
}


let tickData = JSON.parse(FileLib.read("Coleweight", "data/tickData.json"))

export function findCost(hotmName, minLevel, maxLevel, fortunate = false) {
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

export function findReward(hotmName, minLevel, maxLevel) {
    let rewardFormula = findHotmObject(hotmName).rewardFormula
    return eval(rewardFormula.replace("Level", 2+maxLevel-minLevel))
}

export function calcSpeed(powder) {
    let speedLevels = 1
    let professionalLevels = 1

    if(powder == undefined || parseNotatedInput(powder) == undefined) return ChatLib.chat(constants.CALCULATEERRORMESSAGE)
    powder = parseNotatedInput(powder)

    while(powder > msPowder(speedLevels) + profPowder(professionalLevels)) {
        if(ms2SpeedPerPowder(speedLevels + 1) > professionalSpeedPerPowder(professionalLevels + 1) && speedLevels < 50) {
            powder -= msPowder(speedLevels++)
        }

        else if (professionalLevels < 140) {
            powder -= profPowder(professionalLevels++)
        }
        else break
    }
    return ChatLib.chat(`&bGet &6&l${speedLevels} &bmining speed levels and &6&l${professionalLevels} &bprofessional levels.`)
}

// 40 speed per level
function ms2SpeedPerPowder(miningSpeedLevel) {
    return 40/msPowder(miningSpeedLevel)
}

// 5 speed per level
function professionalSpeedPerPowder(professionalLevel) {
    return 5/profPowder(professionalLevel)
}

function msPowder(miningSpeedLevel) {
    return Math.floor(Math.pow(miningSpeedLevel+1, 3.2))
}

function profPowder(professionalLevel) {
    return Math.floor(Math.pow(professionalLevel+1, 2.3))
}