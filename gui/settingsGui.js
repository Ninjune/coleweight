import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @TextProperty } from 'Vigilance'
import constants from "../util/constants.js"

@Vigilant("Coleweight")
class Settings {
    @ButtonProperty({
        name: "Change tracker position",
        description: "Move the location of the tracker.",
        category: "General",
        placeholder: "Open"
    })
    moveLocation() {
        ChatLib.command("cw move", true);
    }

    @TextProperty({
        name: "TBA",
        description: "TBA; This menu will probably not work while this text is here.",
        category: "General",
        protected: false
    })
    key = "";

    constructor() {
        this.initialize(this);
    }
}

export default new Settings()