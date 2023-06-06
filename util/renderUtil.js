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
    let [x1, y1, z1] = startCoord
    let [x2, y2, z2] = endCoord
    x1 = parseInt(x1) - 1
    y1 = parseInt(y1)
    z1 = parseInt(z1) - 1
    x2 = parseInt(x2) - 1
    y2 = parseInt(y2)
    z2 = parseInt(z2) - 1
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const dz = Math.abs(z2 - z1)
    const incX = x2 > x1 ? 1 : -1
    const incY = y2 > y1 ? 1 : -1
    const incZ = z2 > z1 ? 1 : -1
    let x = x1
    let y = y1
    let z = z1
    const blocks = []

    if (dx >= dy && dx >= dz)
    {
        let err1 = 2 * dy - dx
        let err2 = 2 * dz - dx

        while (x != x2)
        {
            //console.log(`${x} ${y} ${z} | ${x1} ${y1} ${z1} | ${x2} ${y2} ${z2} | ${err1} ${err2}`)
            blocks.push([x, y, z])

            if (err1 > -dx)
            {
                err1 -= 2 * dx
                y += incY
            }
            if (err2 > -dx)
            {
                err2 -= 2 * dx
                z += incZ
            }
            if (err1 < err2)
            {
                err1 += 2 * dy
                x += incX
            }
            else
            {
                err2 += 2 * dz
                x += incX
            }
        }
    }
    else if (dy >= dx && dy >= dz)
    {
        let err1 = 2 * dx - dy
        let err2 = 2 * dz - dy

        while (y != y2)
        {
            //console.log(`${x} ${y} ${z} | ${x1} ${y1} ${z1} | ${x2} ${y2} ${z2} | ${err1} ${err2}`)
            blocks.push([x, y, z])

            if (err1 > -dy)
            {
                err1 -= 2 * dy
                x += incX
            }
            if (err2 > -dy)
            {
                err2 -= 2 * dy
                z += incZ
            }
            if (err1 < err2)
            {
                err1 += 2 * dx
                y += incY
            }
            else
            {
                err2 += 2 * dz
                y += incY
            }
        }
    }
    else
    {
        let err1 = 2 * dy - dz
        let err2 = 2 * dx - dz

        while (z != z2)
        {
            //console.log(`${x} ${y} ${z} | ${x1} ${y1} ${z1} | ${x2} ${y2} ${z2} | ${err1} ${err2}`)
            blocks.push([x, y, z])

            if (err1 > -dz)
            {
                err1 -= 2 * dz
                y += incY
            }
            if (err2 > -dz)
            {
                err2 -= 2 * dz
                x += incX
            }
            if (err1 < err2)
            {
                err1 += 2 * dy
                z += incZ
            }
            else
            {
                err2 += 2 * dx
                z += incZ
            }
        }
    }

    blocks.push([x2, y2, z2])
    return blocks
}