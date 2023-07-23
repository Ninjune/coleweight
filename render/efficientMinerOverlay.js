import { drawEspBox, trace } from "../util/renderUtil"
import settings from "../settings"

let blockStatesToFind = [
    {name: "minecraft:wool[color=light_blue]", prio: 2},
    {name: "minecraft:obsidian", prio: 0},
    {name: "minecraft:prismarine[variant=prismarine_bricks]", prio: 0},
    {name: "minecraft:prismarine[variant=prismarine_bricks]", prio: 0},
    {name: "minecraft:prismarine[variant=prismarine]", prio: 0}]
let threadActive = false,
 maxPrio = -10000000,
 drawBlocks = [],
 lookingAt

let thread = new Thread(() => {
    threadActive = true
    let tempPrio, tempMax = { prio: -100000 }, tempSecondMax = { prio: -100000 }, block, blockState, tempBlocks = []

    const playerX = Player.getX(),
     playerY = Player.getY(),
     playerZ = Player.getZ(),
     playerReach = 4

    if(playerX == undefined || playerY == undefined || playerZ == undefined || !World.isLoaded()) { threadActive = false; return thread.stop() }


    for(let x = Math.round(playerX-playerReach); x < Math.ceil(playerX+playerReach); x++)
    {
        for(let y = Math.round(playerY-playerReach); y < Math.ceil(playerY+playerReach); y++)
        {
            for(let z = Math.round(playerZ-playerReach); z < Math.ceil(playerZ+playerReach); z++)
            {
                block = World.getBlockAt(x, y, z)
                blockState = block.getState().toString()

                if(blockStatesToFind.some(obj => obj.name === blockState) && isVisible(x, y, z))
                {
                    tempPrio = findPrio(x, y, z, blockState, blockStatesToFind[blockStatesToFind.findIndex(obj => obj.name === blockState)].prio)
                    tempBlocks.push({x: Math.round(x) + 0.5, y: y, z: Math.round(z) + 0.5, prio: tempPrio})
                }
            }
        }
    }
    for(let i = 0; i < tempBlocks.length; i++)
    {
        if(tempBlocks[i].prio > tempMax.prio)
        {
            tempMax = tempBlocks[i]
        }
        if(tempBlocks[i].prio > tempSecondMax.prio && tempBlocks[i].prio < tempMax.prio)
        {
            tempSecondMax = tempBlocks[i]
        }
    }

    if(tempMax == undefined || tempSecondMax == undefined) drawBlocks = []
    else if(drawBlocks[0] != undefined && drawBlocks[1] != undefined && drawBlocks[0].x != undefined && drawBlocks[1].x != undefined &&
        World.getBlockAt(drawBlocks[0].x, drawBlocks[0].y, drawBlocks[0].z).type.getRegistryName() === "minecraft:bedrock") // if player just mined block
    {
        drawBlocks[0] = drawBlocks[1]
        threadActive = false
        drawBlocks[1] = tempSecondMax
    }
    else
    {
        drawBlocks[0] = tempMax
        drawBlocks[1] = tempSecondMax
        maxPrio = tempMax.prio
    }

    threadActive = false
})


register("renderWorld", () => {
    if(!settings.efficientMinerOverlay || drawBlocks.length < 2 || drawBlocks[0] == undefined || drawBlocks[1] == undefined
        || drawBlocks[0].x == undefined || drawBlocks[1].x == undefined) return

    try{
        trace(drawBlocks[0].x, drawBlocks[0].y + 5/10, drawBlocks[0].z, 1, 0, 0.3, 0.7, true)
        drawEspBox(drawBlocks[0].x, drawBlocks[0].y, drawBlocks[0].z, 1, 0, 0.3, 0.7, true)
        drawEspBox(drawBlocks[1].x, drawBlocks[1].y, drawBlocks[1].z, 1, 0.5, 0.3, 0.7, true)
    } catch(err) {if(settings.debug) console.log(err)}

})


register("step", () => {
    if (!settings.efficientMinerOverlay)
        return
    if(!threadActive)
        thread.start()
}).setFps(20)


register("gameUnload", () => {
    thread.stop()
})


function findPrio(originX, originY, originZ, blockStateToFind, prio)
{
    let radius = 2 + 1/2,
     blockCount = 0,
     rayTraceX, rayTraceY, rayTraceZ
    if(Player.lookingAt() != undefined && Player.lookingAt()?.getRegistryName() != "minecraft:air")
        lookingAt = Player.lookingAt()

    if(lookingAt instanceof Block)
    {
        rayTraceX = lookingAt.getX()
        rayTraceY = lookingAt.getY()
        rayTraceZ = lookingAt.getZ()
    }


    for(let x = Math.round(originX-radius); x < Math.round(originX+radius); x++) // second cube
    {
        for(let y = Math.round(originY-radius); y < Math.round(originY+radius); y++)
        {
            for(let z = Math.round(originZ-radius); z < Math.round(originZ+radius); z++)
            {
                if(World.getBlockAt(x, y, z)?.getState()?.toString() === blockStateToFind)
                {
                    if(checkConnectedBlocks(x, y, z, originX, originY, originZ, blockStateToFind, 2.5))
                        blockCount++
                }
                else if (World.getBlockAt(x, y, z)?.getState()?.toString() === "minecraft:stone[variant=smooth_diorite]")
                {
                    if(prio > 0)
                        prio = 0
                    else
                        prio += 2/10
                }

                // RAYTRACE
                if(lookingAt != undefined)
                {
                    prio -= Math.abs(rayTraceX - x)/100 // = 0.01 per block of distance
                    prio -= Math.abs(rayTraceY - y)/100
                    prio -= Math.abs(rayTraceZ - z)/100
                }

            }
        }
    }
    if(blockCount > 6)
        blockCount = 6
    prio += blockCount*3/10

    return Math.round(prio*100)/100
}

function isVisible(x, y, z)
{
    if(World.getBlockAt(x, y, z).type.getRegistryName() === "minecraft:bedrock") return false
    if (World.getBlockAt(x, y+1, z).type.getRegistryName() === "minecraft:air") return true // above
    if (World.getBlockAt(x, y-1, z).type.getRegistryName() === "minecraft:air") return true // below
    if (World.getBlockAt(x+1, y, z).type.getRegistryName() === "minecraft:air") return true // east
    if (World.getBlockAt(x-1, y, z).type.getRegistryName() === "minecraft:air") return true // west
    if (World.getBlockAt(x, y, z+1).type.getRegistryName() === "minecraft:air") return true // north
    if (World.getBlockAt(x, y, z-1).type.getRegistryName() === "minecraft:air") return true // south

    return false
}


function checkConnectedBlocks(x, y, z, originX, originY, originZ, blockStateToFind, distance) {
    if (World.getBlockAt(x, y, z).getState().toString() !== blockStateToFind) {
        return false
    }
    if (Math.abs(x - originX) + Math.abs(y - originY) + Math.abs(z - originZ) > distance) {
        return false
    }

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                if (dx === 0 && dy === 0 && dz === 0) {
                    continue
                }
                if (!checkConnectedBlocks(x + dx, y + dy, z + dz, distance)) {
                    return false
                }
            }
        }
    }
    return true
}