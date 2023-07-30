import { drawEspBox, trace } from "../../utils/Rendering"
import { PREFIX, invalidArgs, registerCommands } from "../../utils/Utils"

let x = 0
let y = 0
let z = 0

const render = register("renderWorld", () => {
    if(x == 0 && y == 0 && z == 0) return

    trace(x, y, z, 0, 0, 1, 0.86)
    drawEspBox(x, y, z, 0, 0, 1, 0.86)
}).unregister()


registerCommands({
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
                render.unregister()
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
                ChatLib.chat(invalidArgs)
                return
        }
        
        render.register()
        ChatLib.chat(`${PREFIX}&bNow drawing line to &a${x} ${Math.round(y)} ${z}`)
    }
})