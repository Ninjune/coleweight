import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty } from 'Vigilance'

@Vigilant("Coleweight")
class Settings {
    @ButtonProperty({
        name: "Change tracker position",
        description: "Move the location of the tracker.",
        category: "General",
        placeholder: "Open"
    })
    moveLocation() {
        ChatLib.command("cw move coleweight", true);
    }

    @SwitchProperty({
        name: "Coleweight tracker",
        description: "Enables the Coleweight tracker.",
        category: "General"
    })
    cwToggle = true;

    @SwitchProperty({
        name: "Rank chat",
        description: "Enables the Coleweight rank message after a name in chat.",
        category: "General"
    })
    rankChat = true;

    @SwitchProperty({
        name: "Rank everywhere",
        description: "Enables showing Coleweight rank everywhere. (instead of just in crystal hollows)",
        category: "General"
    })
    rankEverywhere = false;

    @SwitchProperty({
        name: "Track griefers",
        description: "Check lobbies for griefers (on join and when new players join.)",
        category: "General"
    })
    trackGriefers = true;

    @SwitchProperty({
        name: "Claiming",
        description: "Enables lobby claiming (/claim).",
        category: "General"
    })
    claiming = true;

    @SwitchProperty({
        name: "Timer",
        description: "Toggles visibility of CHollows timer",
        category: "General"
    })
    timerVisible = false;

    @SwitchProperty({
        name: "Show powdertracker",
        description: "If the tracker overlay should be visible.",
        category: "Powdertracker"
    })
      trackerVisible = false;
    
    @SwitchProperty({
        name: "Show totals",
        description: "If the tracker should show the total amount.",
        category: "Powdertracker"
    })
      showTotals = true;
    
    @SwitchProperty({
        name: "Show rates",
        description: "If the tracker should show the estimated rates per hour.",
        category: "Powdertracker"
    })
      showRates = true;
    
    @SelectorProperty({
        name: "Alignment",
        description: "Sets the alignment of the tracker.",
        category: "Powdertracker",
        options: ["Left", "Right", "Center"]
    })
      trackerAlignment = 0;
    
    @ButtonProperty({
        name: "Change tracker position",
        description: "Move the location of the tracker.",
        category: "Powdertracker",
        placeholder: "Open"
    })
    moveLocation() {
        ChatLib.command("cw move powdertracker", true);
    }

    constructor() {
        this.initialize(this);
        this.registerListener("Rank chat", value => {
            this.rankChat = value;
        })
        this.registerListener("Rank everywhere", value => {
            this.rankEverywhere = value;
        })
        this.registerListener("Track griefers", value => {
            this.trackGriefers = value;
        })
        this.registerListener("Claiming", value => {
            this.claiming = value;
        })
        this.registerListener("Timer", value => {
            this.timerVisible = value;
        })
        this.registerListener("Show powdertracker", value => {
            this.trackerVisible = value;
            this.sync();
        })
        this.registerListener("Show totals", value => {
            this.showTotals = value;
            this.sync();
        })
        this.registerListener("Show rates", value => {
            this.showRates = value;
            this.sync();
        })
        this.registerListener("Alignment", value => {
            this.trackerAlignment = value;
            this.sync();
        })
    }
      
    sync() {
        ChatLib.command("cw powdertrackersync", true);
    }
}

export default new Settings()