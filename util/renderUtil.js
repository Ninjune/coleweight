export function trace(x, y, z, red, green, blue, alpha)
{
    GL11.glLineWidth(2.0)
    GlStateManager.func_179090_x() // disableTexture2D

    Tessellator.begin(1).colorize(red, green, blue, alpha)
    if(Player.isSneaking())
        Tessellator.pos(Player.getRenderX(), Player.getRenderY()+1.54, Player.getRenderZ()).tex(0, 0)
    else
        Tessellator.pos(Player.getRenderX(), Player.getRenderY()+1.6203, Player.getRenderZ()).tex(0, 0)
    Tessellator.pos(x, y, z).tex(0, 0)
    Tessellator.draw()

    GlStateManager.func_179098_w() // enableTexture2D
}