import beaconBeam from "../../BeaconBeam/index.js"
import { addCommas } from "./helperFunctions.js"

if(!GlStateManager) {
    var GL11=Java.type("org.lwjgl.opengl.GL11")
    var GlStateManager=Java.type("net.minecraft.client.renderer.GlStateManager")
}
export function trace (x, y, z, red, green, blue, alpha, lineWidth = 1)
{
    if(Player.isSneaking())
        drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
    else
        drawLine(Player.getRenderX(), Player.getRenderY()+1.62, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
}

export function drawLine (x1, y1, z1, x2, y2, z2, red, green, blue, alpha, lineWidth = 1)
{
    GL11.glBlendFunc(770,771)
    GL11.glEnable(GL11.GL_BLEND)
    GL11.glLineWidth(lineWidth)
    GL11.glDisable(GL11.GL_TEXTURE_2D)
    GL11.glDisable(GL11.GL_DEPTH_TEST)
    GL11.glDepthMask(false)
    GlStateManager.func_179094_E()

    Tessellator.begin(GL11.GL_LINE_STRIP).colorize(red, green, blue, alpha)
    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x2, y2, z2).tex(0, 0)
    Tessellator.draw()

    GlStateManager.func_179121_F()
    GL11.glEnable(GL11.GL_TEXTURE_2D)
    GL11.glEnable(GL11.GL_DEPTH_TEST)
    GL11.glDepthMask(true)
    GL11.glDisable(GL11.GL_BLEND)
}

/**
 * 
 * @param {number} x x
 * @param {number} y y
 * @param {number} z z
 * @param {number} red 0 - 1
 * @param {number} green 0 - 1
 * @param {number} blue 0 - 1
 * @param {number} alpha 0 - 1
 * @param {bool} phase ability to see through walls (true = see through walls)
 */
export function drawEspBox (x, y, z, red, green, blue, alpha, phase = true) // thanks to renderlib, don't need the whole module so I'm not adding it.
{
    Tessellator.pushMatrix()
    GL11.glLineWidth(2.0)
    GlStateManager.func_179129_p() // disableCullFace
    GlStateManager.func_179147_l() // enableBlend
    GlStateManager.func_179112_b(770, 771) // blendFunc
    GlStateManager.func_179132_a(false) // depthMask
    GlStateManager.func_179090_x() // disableTexture2D

    if(phase)
        GlStateManager.func_179097_i() // disableDepth

    const locations = [
        //    x, y, z    x, y, z
        [
            [0, 0, 0],
            [1, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, 1],
        ],
        [
            [1, 0, 1],
            [1, 0, 0],
        ],
        [
            [1, 0, 1],
            [0, 0, 1],
        ],

        [
            [0, 1, 0],
            [1, 1, 0],
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
        ],
        [
            [1, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 1, 1],
            [0, 1, 1],
        ],

        [
            [0, 0, 0],
            [0, 1, 0],
        ],
        [
            [1, 0, 0],
            [1, 1, 0],
        ],
        [
            [0, 0, 1],
            [0, 1, 1],
        ],
        [
            [1, 0, 1],
            [1, 1, 1],
        ],
    ]

    locations.forEach((loc) => {
        Tessellator.begin(3).colorize(red, green, blue, alpha)
        Tessellator.pos(x + loc[0][0] - 1 / 2, y + loc[0][1], z + loc[0][2] - 1 / 2).tex(0, 0)
        Tessellator.pos(x + loc[1][0] - 1 / 2, y + loc[1][1], z + loc[1][2] - 1 / 2).tex(0, 0)
        Tessellator.draw()
    })

    GlStateManager.func_179089_o() // enableCull
    GlStateManager.func_179084_k() // disableBlend
    GlStateManager.func_179132_a(true) // depthMask
    GlStateManager.func_179098_w() // enableTexture2D

    if(phase)
        GlStateManager.func_179126_j() // enableDepth

    Tessellator.popMatrix()
}

// stolen from soopy
/**
 * Renders a waypoint with some settings.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} r 0 - 1
 * @param {number} g 0 - 1
 * @param {number} b 0 - 1
 * @param {*} options name = "", showDist = name defined, phase = true, renderBeacon = true, alpha = 0.6, drawBox = true
 */
export function drawCoolWaypoint(x, y, z, r, g, b, {name = "", showDist = name != "", phase = true, renderBeacon = true, alpha = 0.6, drawBox = true, nameColor = "a",})
{
    let distToPlayerSq=(x-Player.getRenderX())**2+(y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2+(z-Player.getRenderZ())**2

    //let alpha=Math.min(1,Math.max(0,1-(distToPlayerSq-10000)/12500))

    if(drawBox)
        drawEspBox(x+0.5,y,z+0.5,r,g,b, alpha, phase)
    //if(renderBeacon) beaconBeam(x,y+1,z,r,g,b,Math.min(1,Math.max(0,(distToPlayerSq-25)/100))*alpha,!phase)

    if(name||showDist){
        let distToPlayer=Math.sqrt(distToPlayerSq)

        let distRender=Math.min(distToPlayer,50)

        let loc5=[Player.getRenderX()+(x+0.5-Player.getRenderX())/(distToPlayer/distRender),Player.getRenderY()+Player.getPlayer()["func_70047_e"]()+(y+2+20*distToPlayer/300-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))/(distToPlayer/distRender),Player.getRenderZ()+(z+0.5-Player.getRenderZ())/(distToPlayer/distRender)]
        let loc6=[Player.getRenderX()+(x+0.5-Player.getRenderX())/(distToPlayer/distRender),Player.getRenderY()+Player.getPlayer()["func_70047_e"]()+(y+2+20*distToPlayer/300-10*distToPlayer/300-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))/(distToPlayer/distRender),Player.getRenderZ()+(z+0.5-Player.getRenderZ())/(distToPlayer/distRender)]

        if(name != "") Tessellator.drawString("\xA7"+nameColor+name,loc5[0],loc5[1],loc5[2],0,true,distRender/300,false)
        if(showDist) Tessellator.drawString("\xA7b("+addCommas(Math.round(distToPlayer))+"m)",name?loc6[0]:loc5[0],name?loc6[1]:loc5[1],name?loc6[2]:loc5[2],0,false,distRender/300,false)
    }
}



export function getBlocksAlongLine(startCoord, endCoord)
{
    

}


/** stolen from bloomcore
 * Does a voxel traversal from the startPos (Or player eye coord by default) until it hits a non-air block.
 * @param {[Number, Number, Number] | null} startPos - The position to start at
 * @param {Vector3 | null} directionVector - The direction for the ray to travel in. Keep as null to use the player's look vector 
 * @param {Number} distance 
 * @param {BlockCheckFunction} blockCheckFunc 
 * @param {Boolean} returnWhenTrue 
 * @param {Boolean} stopWhenNotAir
 */
export const raytraceBlocks = (startPos=null, directionVector=null, distance=60, blockCheckFunc=null, returnWhenTrue=false, stopWhenNotAir=true) => {
    // Set default values to send a raycast from the player's eye pos, along the player's look vector.
    if (!startPos) startPos = getPlayerEyeCoords()
    if (!directionVector) directionVector = getPlayerLookVec()

    const endPos = directionVector.normalize().multiply(distance).add(startPos).getComponents()

    return traverseVoxels(startPos, endPos, blockCheckFunc, returnWhenTrue, stopWhenNotAir)
}

/** stolen from bloomcore
 * Gets the coordinates of the player's eyes.
 * @param {Boolean} forceSneak - If the player is not sneaking, lower the Y value by 0.08 blocks.
 * @returns 
 */
export const getPlayerEyeCoords = (forceSneak=false) => {
    let x = Player.getX()
    let y = Player.getY() + Player.getPlayer().func_70047_e()
    let z = Player.getZ()

    if (forceSneak && !Player.isSneaking()) y -= 0.08
    return [x, y, z]
}


/** stolen from bloomcore
 * Gets the player's look vector
 * @returns {Vector3}
 */
export const getPlayerLookVec = () => {
    let lookVec = Player.getPlayer().func_70040_Z() // .getLookVec()
    return [lookVec.field_72450_a,
        lookVec.field_72448_b,
        lookVec.field_72449_c]
}


register("tick", () => {
    //console.log(getPlayerLookVec())

})