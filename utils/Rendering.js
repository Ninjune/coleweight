import { addCommas } from "./Utils"

export const trace = (x, y, z, red, green, blue, alpha, lineWidth = 1) => {
    return Player.isSneaking()
    ? drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
    : drawLine(Player.getRenderX(), Player.getRenderY()+1.62, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
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
export function drawCoolWaypoint(x, y, z, r, g, b, {name = "", showDist = name != "", phase = true, renderBeacon = true, alpha = 0.6, drawBox = true, nameColor = "a", includeVerticalDistance = true})
{
    let distToPlayerSq = (x-Player.getRenderX())**2 + (y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2 + (z-Player.getRenderZ())**2
    let distanceText = includeVerticalDistance ? Math.hypot(x-Player.getRenderX(), y-(Player.getRenderY() +
        Player.getPlayer()["func_70047_e"]()), z-Player.getRenderZ()) :
        Math.hypot(x-Player.getRenderX(), z-Player.getRenderZ())
    //let alpha=Math.min(1,Math.max(0,1-(distToPlayerSq-10000)/12500))

    if(drawBox)
        drawEspBox(x+0.5,y,z+0.5,r,g,b, alpha, phase)

    if(name||showDist){
        let distToPlayer=Math.sqrt(distToPlayerSq)

        let distRender=Math.min(distToPlayer,50)

        let loc5=[Player.getRenderX()+(x+0.5-Player.getRenderX())/(distToPlayer/distRender),Player.getRenderY()+Player.getPlayer()["func_70047_e"]()+(y+2+20*distToPlayer/300-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))/(distToPlayer/distRender),Player.getRenderZ()+(z+0.5-Player.getRenderZ())/(distToPlayer/distRender)]
        let loc6=[Player.getRenderX()+(x+0.5-Player.getRenderX())/(distToPlayer/distRender),Player.getRenderY()+Player.getPlayer()["func_70047_e"]()+(y+2+20*distToPlayer/300-10*distToPlayer/300-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))/(distToPlayer/distRender),Player.getRenderZ()+(z+0.5-Player.getRenderZ())/(distToPlayer/distRender)]

        if(name != "") Tessellator.drawString("\xA7"+nameColor+name,loc5[0],loc5[1],loc5[2],0,true,distRender/300,false)
        if(showDist) Tessellator.drawString("\xA7b("+addCommas(Math.round(distanceText))+"m)",name?loc6[0]:loc5[0],name?loc6[1]:loc5[1],name?loc6[2]:loc5[2],0,false,distRender/300,false)
    }
}

/**
 * This contains a value "drawState", this dictates whether or not this draw or not. Default to 0. Check for 1 in a "renderOverlay" to draw. (must set to draw.)
 * @returns
 */
export class Title
{
    /**
     *
     * @param {{text: string, scale: number, time: number, sound: string, yOffset: number, xOffset: number}} param0
     */
    constructor({text, scale = 5, time = 3000, sound = "random.orb", yOffset = 0, xOffset = 0})
    {
        this.text = text
        this.scale = scale
        this.time = time
        this.sound = sound
        this.yOffset = yOffset
        this.xOffset = xOffset
        this.drawState = 0
        this.drawing = false

        register("renderOverlay", () => {
            this.drawing = false
            
            if(this.drawState == 1){
                this.drawing = true

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

    isDrawing()
    {
        return this.drawing
    }
}