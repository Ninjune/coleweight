import axios from "../../axios"
import constants from "../util/constants"
/**
 * The base for a gui in the mod.
 */
export class BaseGui
{
    /**
     *
     * @param {string[]} aliases - Names of the gui. aliases[0] is required and used in config.
     * @param {callback} renderOverlayCallback - Callback to be used in renderOverlay.
     * @param {callback} reloadCallback - Callback to be used on .reload().
     */
    constructor(aliases, renderOverlayCallback, reloadCallback)
    {
        this.reloadCallback = reloadCallback
        this.aliases = aliases
        this.gui = new Gui()
        this.reloadCallback = reloadCallback == undefined ? reloadCallback : () => {
            reloadCallback()
            ChatLib.chat(`${constants.PREFIX}&bReloaded ${aliases[0]}!`)
        }

        register("dragged", (dx, dy, x, y) => {
            if (!this.gui.isOpen()) return
            constants.data[aliases[0]].x = x
            constants.data[aliases[0]].y = y
            constants.data.save()
        })

        register("renderOverlay", () => {
            if (this.gui.isOpen())
            {
                let txt = "Drag to move."
                Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
            }

            renderOverlayCallback()
        })
    }

    isOpen()
    {
        return this.gui.isOpen()
    }

    open()
    {
        this.gui.open()
    }
}