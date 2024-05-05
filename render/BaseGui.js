import constants from "../util/constants";
import { registerWhen } from "../util/helperFunctions";

/**
 * The base for a gui in the mod.
 */
export class BaseGui
{
    /**
     *
     * @param {string[]} aliases - Names of the gui. aliases[0] is required and used in config. You must make an entry in the module's PogData in constants.js to track the x and y.
     * @param {callback} renderOverlayCallback - Callback to be used in renderOverlay. Must return the string that will be rendered.
     * @param {callback} dependency - Callback to be used as dependency for the gui rendering. Must return a boolean.
     * @param {callback} reloadCallback - Callback to be used on .reload(). Return is voided.
     */
    constructor(aliases, renderOverlayCallback, dependency, reloadCallback)
    {
        this.reloadCallback = reloadCallback;
        this.aliases = aliases;
        this.gui = new Gui();
        this.reloadCallback = reloadCallback == undefined ? reloadCallback : () => {
            reloadCallback();
            ChatLib.chat(`${constants.PREFIX}&bReloaded ${aliases[0]}!`);
        };

        register("dragged", (dx, dy, x, y) => {
            if (!this.gui.isOpen()) return;
            constants.data[aliases[0]].x = x;
            constants.data[aliases[0]].y = y; // - ... to account for s: ...
            constants.data.save();
        });

        registerWhen(register("renderOverlay", () => {
            if (this.gui.isOpen())
            {
                let txt = "Drag to move. Use +/- to increase/decrease gui size. Use arrow keys to set alignment.";
                Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2);
            }

            let message = renderOverlayCallback();
            if(this.gui.isOpen())
                message = `&f&os: ${constants.data[aliases[0]].scale.toFixed(2)}&r\n` + (message ?? "");
            let text = new Text(message ?? "");
            text.setX(constants.data[aliases[0]].x);
            text.setY(constants.data[aliases[0]].y - (this.gui.isOpen() ? 10*constants.data[aliases[0]].scale : 0)); // addition to account for "s: ..."
            if(constants.data[aliases[0]].alignment == 1)
                text.setAlign("CENTER");
            else if(constants.data[aliases[0]].alignment == 2)
                text.setAlign("RIGHT");
            text.setScale(parseFloat(constants.data[aliases[0]].scale));
            text.setShadow(true);
            text.draw();
        }), dependency);

        register("guiKey", (char, keyCode, gui, event) => {
            if (!this.gui.isOpen()) return;

            if (keyCode == 13)
                constants.data[aliases[0]].scale += 0.05;
            else if (keyCode == 12)
                constants.data[aliases[0]].scale -= 0.05;
            else if (keyCode == 203)
                constants.data[aliases[0]].alignment = 0;
            else if (keyCode == 208 || keyCode == 200)
                constants.data[aliases[0]].alignment = 1;
            else if (keyCode == 205)
                constants.data[aliases[0]].alignment = 2;

            constants.data.save();
        });
    }

    isOpen()
    {
        return this.gui.isOpen();
    }

    open()
    {
        return this.gui.open();
    }
}