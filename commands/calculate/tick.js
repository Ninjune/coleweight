import constants from "../../util/constants"
const PREFIX = constants.PREFIX

export function tickCommand(speed, block)
{
    if(speed == undefined || parseInt(speed) != speed)
        return ChatLib.chat(`${PREFIX}&cMining speed must be an integer!`)
    if(block == undefined)
        return ChatLib.chat(constants.CALCULATEERRORMESSAGE)
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
