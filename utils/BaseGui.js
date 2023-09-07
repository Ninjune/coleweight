import { addEvent } from "../FeatureBase"
import { PREFIX, data } from "./Utils"

/**
 * The base for a gui in the module.
 */
export class BaseGui {
    /**
     *
     * @param {array} aliases - Names of the gui. aliases[0] is required and used in config. You must make an entry in the module's PogData in Utils.js to track the x and y.
     * @param {callback} renderOverlayCallback - Callback to be used in renderOverlay. Must return the string that will be rendered.
     * @param {string} settingsName - The settings name in Vigilance. This is used for the unregister/register trigger
     * @param {array} sideEvents - Side events works the same way addEvent works in Utils.js
     * @param {boolean} hasDoubleConfigName If this is enabled it'll take 2 config names to unregister/register e.g "Settings1 | Settings2"
     * @param {callback} reloadCallback - Callback to be used on .reload(). Return is voided.
     */

    constructor(aliases = [], renderOverlayCallback, settingsName, sideEvents = [], hasDoubleConfigName = false, reloadCallback){
        this.aliases = aliases
        this.gui = new Gui()
        this.reloadCallback = !reloadCallback ? reloadCallback : () => {
            reloadCallback()
            ChatLib.chat(`${PREFIX}&bReloaded ${aliases[0]}!`)
        }

        addEvent(settingsName, register("renderOverlay", () => {
            if (this.gui.isOpen()){
                let txt = "Drag to move. Use +/- to increase/decrease gui size. Use arrow keys to set alignment."
                Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
            }

            let message = renderOverlayCallback()

            if(this.gui.isOpen())
                message = `&f&os: ${data[aliases[0]].scale.toFixed(2)}&r\n` + (message ?? "")

            let text = new Text(message ?? "")

            text.setX(data[aliases[0]].x)
            text.setY(data[aliases[0]].y - (this.gui.isOpen() ? 10*data[aliases[0]].scale : 0)) // addition to account for "s: ..."

            if(data[aliases[0]].alignment == 1)
                text.setAlign("CENTER")

            else if(data[aliases[0]].alignment == 2)
                text.setAlign("RIGHT")

            text.setScale(parseFloat(data[aliases[0]].scale))
            text.setShadow(true)
            text.draw()
        }), [
            register("dragged", (dx, dy, x, y) => {
                if (!this.gui.isOpen()) return
                data[aliases[0]].x = x
                data[aliases[0]].y = y // - ... to account for s: ...
                data.save()
            }),
    
            register("guiKey", (char, keyCode, gui, event) => {
                if (!this.gui.isOpen()) return
    
                if (keyCode == 13)
                    data[aliases[0]].scale += 0.05
                else if (keyCode == 12)
                    data[aliases[0]].scale -= 0.05
                else if (keyCode == 203)
                    data[aliases[0]].alignment = 0
                else if (keyCode == 208 || keyCode == 200)
                    data[aliases[0]].alignment = 1
                else if (keyCode == 205)
                    data[aliases[0]].alignment = 2
    
                data.save()
            }),
            ...sideEvents
        ], null, null, false, hasDoubleConfigName)
        
    }

    isOpen(){
        return this.gui.isOpen()
    }

    open(){
        return this.gui.open()
    }
}