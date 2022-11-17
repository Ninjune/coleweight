/*import RenderLib from "../../RenderLib/index.js";
Disabled.
register('renderWorld', () => {
    try{
        if(Player.getHeldItem().getItemNBT().getTag('tag').getTag('ExtraAttributes').getTag("id").toString() != `"BOB_OMB"`) return
    } catch(e) {return}

    const boxR = 0.3,
     boxB = 0.5,
     boxG =  0,
     boxAlpha = 0.3
    
    let x = Math.floor(Player.getX()) + 0.5,
     y = Math.floor(Player.getY())
     z = Math.floor(Player.getZ()) + 0.5

    
    
    RenderLib.drawInnerEspBox(x, y - 1, z - 8, 1, 1, boxR, boxB, boxG, boxAlpha, true)
    RenderLib.drawInnerEspBox(x + 1, y + 1, z - 7, 1, 1, boxR, boxB, boxG, boxAlpha, true)
    RenderLib.drawInnerEspBox(x + 1, y + 1, z - 7, 1, 1, boxR, boxB, boxG, boxAlpha, true)
})*/