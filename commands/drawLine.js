import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { trace, drawEspBox } from "../util/renderUtil"
const PREFIX = constants.PREFIX

let x = 0,
 y = 0,
 z = 0


register("renderWorld", () => {
    if(x == 0 && y == 0 && z == 0) return

    trace(x, y, z, 0, 0, 1, 0.86)
    drawEspBox(x, y, z, 0, 0, 1, 0.86)
})


registerCommand({
    aliases: ["drawline", "draw"],
    description: "Draws a line to coords. (y defaults to the player's y)",
    options: "(x) [y] (z)",
    category: "miscellaneous",
    execute: (args) => {
        switch(args.length - 1)
        {
            case 0:
            case 1:
                x = 0
                y = 0
                z = 0
                ChatLib.chat(`${PREFIX}&bStopped drawing line.`)
                return
            case 2:
                x = args[1]
                y = Player.getY() + 1
                z = args[2]
                break
            case 3: 
                x = args[1]
                y = args[2]
                z = args[3]
                break
            default:
                ChatLib.chat(constants.INVALIDARGS)
                return
        }
        
        ChatLib.chat(`${PREFIX}&bNow drawing line to &a${x} ${Math.round(y)} ${z}`)
    }
})