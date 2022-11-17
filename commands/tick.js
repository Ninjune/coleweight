import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function tick(speed, block)
{
    if(speed == undefined || parseInt(speed) != speed) 
        return `${PREFIX}&cMining speed must be an integer!`
    let strength = findStrength(block)
    if(strength < 1) return `${PREFIX}&cBlock must be a gemstone or positive breaking power! (or starting letter of gemstone)`
    let currentBlockTick = strength*30/speed,
     currentShardTick = (strength-200)*30/speed,
     nextBlockSpeed, nextShardSpeed

    if(currentBlockTick < Math.floor(currentBlockTick) + 0.5)
        nextBlockSpeed = strength*30/(Math.floor(currentBlockTick)-0.5)
    else
        nextBlockSpeed = strength*30/(Math.floor(currentBlockTick)+0.5)

    if(currentShardTick < Math.floor(currentShardTick) + 0.5)
        nextShardSpeed = strength*30/(Math.floor(currentShardTick)-0.5)
    else
        nextShardSpeed = strength*30/(Math.floor(currentShardTick)+0.5)

    ChatLib.chat(`\n&bCurrently mining blocks in &6&l${Math.round(currentBlockTick)} ticks` + 
    `\n&bCurrently mining shards in &6&l${Math.round(currentShardTick)} ticks` +
    `\n&bNext block tick will be at: &6&l${Math.round(nextBlockSpeed)} mining speed` +
    `\n&bNext shard tick will be at: &6&l${Math.round(nextShardSpeed)} mining speed` +
    `\n&bYou need &6&l${Math.round(nextBlockSpeed - speed)} mining speed&b to get the next block tick.` +
    `\n&bYou need &6&l${Math.round(nextShardSpeed - speed)} mining speed&b to get the next shard tick.\n`)
}

function findStrength(block)
{
    let strength = -1

    if(block == parseInt(block))
        strength = block
    else
    {
        switch(block.toLowerCase())
        {
            case "ruby":
            case "r":
                strength = 2500
                break
            case "j":
            case "jade":
            case "a":
            case "amber":
            case "amethyst":
            case "s":
            case "sapphire":
                strength = 3200
                break
            case "t":
            case "topaz":
            case "o":
            case "opal":
                strength = 4000
        }
    }

    return strength
}
