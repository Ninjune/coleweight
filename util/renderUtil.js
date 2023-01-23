export function trace(x, y, z, red, green, blue, alpha)
{
    GL11.glLineWidth(2.0)
    GlStateManager.func_179129_p() // disableCullFace
    GlStateManager.func_179147_l() // enableBlend
    GlStateManager.func_179112_b(770, 771) // blendFunc
    GlStateManager.func_179132_a(false) // depthMask
    GlStateManager.func_179090_x() // disableTexture2D
    

    Tessellator.begin(1).colorize(red, green, blue, alpha)
    if(Player.isSneaking())
        Tessellator.pos(Player.getRenderX(), Player.getRenderY()+1.54, Player.getRenderZ()).tex(0, 0)
    else
        Tessellator.pos(Player.getRenderX(), Player.getRenderY()+1.6203, Player.getRenderZ()).tex(0, 0)
    Tessellator.pos(x, y, z).tex(0, 0)
    Tessellator.draw()
    GlStateManager.func_179089_o() // enableCull
    GlStateManager.func_179084_k() // disableBlend
    GlStateManager.func_179132_a(true) // depthMask
    GlStateManager.func_179098_w() // enableTexture2D
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
        Tessellator.begin(3).colorize(red, green, blue, alpha);
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