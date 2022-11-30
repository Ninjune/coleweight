import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty } from 'Vigilance'

@Vigilant("Coleweight")
class Settings {
    @SwitchProperty({
        name: "Coleweight tracker",
        description: "Enables the Coleweight tracker.",
        subcategory: "Coleweight Tracker",
        category: "General"
    })
    cwToggle = true;

    @ButtonProperty({
        name: "Change Coleweight tracker position",
        description: "Move the location of the coleweight tracker.",
        subcategory: "Coleweight Tracker",
        category: "General",
        placeholder: "Open"
    })
    moveCwLocation() {
        ChatLib.command("cw move coleweight", true);
    }

    @SwitchProperty({
        name: "Rank chat",
        description: "Enables the Coleweight rank message after a name in chat.",
        subcategory: "Ranked Chat",
        category: "General"
    })
    rankChat = true;

    @SwitchProperty({
        name: "Rank everywhere",
        description: "Enables showing Coleweight rank everywhere. (instead of just in crystal hollows)",
        subcategory: "Ranked Chat",
        category: "General"
    })
    rankEverywhere = false;

    @SwitchProperty({
        name: "Track griefers",
        description: "Check lobbies for griefers (on join and when new players join.)",
        subcategory: "Random Features",
        category: "General"
    })
    trackGriefers = true;

    @SwitchProperty({
        name: "Claiming",
        description: "Enables lobby claiming (/claim).",
        subcategory: "Random Features",
        category: "General"
    })
    claiming = true;

    @SwitchProperty({
        name: "Downtime tracker",
        description: "Tracks downtime.",
        subcategory: "Downtime",
        category: "General"
    })
    downtimeTracker = false;

    @ButtonProperty({
        name: "Change downtime tracker position",
        description: "Move the location of the downtime tracker.",
        subcategory: "Downtime",
        category: "General",
        placeholder: "Open"
    })
    moveDowntimeLocation() {
        ChatLib.command("cw move downtime", true);
    }

    @SwitchProperty({
        name: "Debug",
        description: "Toggles debug mode.",
        subcategory: "Random Features",
        category: "General"
    })
    debug = false;

    @SwitchProperty({
        name: "Marked lobbies",
        description: "Enables lobby marking (automatic).",
        category: "General",
        subcategory: "Marking"
    })
    lobbyMarking = false;

    @ButtonProperty({
        name: "Clear lobbies",
        description: "Clears marked lobbies.",
        category: "General",
        subcategory: "Marking",
        placeholder: "Clear"
    })
    clearLobbies() {
        ChatLib.command("cw clearlobbies", true);
    }

    @SwitchProperty({
        name: "Timer",
        description: "Toggles visibility of CHollows timer",
        subcategory: "Timer",
        category: "General"
    })
    timerVisible = false;

    @ButtonProperty({
        name: "Change timer position",
        description: "Move the location of the timer.",
        subcategory: "Timer",
        category: "General",
        placeholder: "Open"
    })
    moveTimerLocation() {
        ChatLib.command("cw move timer", true);
    }

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
        name: "Change Powdertracker position",
        description: "Move the location of the powdertracker.",
        category: "Powdertracker",
        placeholder: "Open"
    })
    movePowderLocation() {
        ChatLib.command("cw move powdertracker", true);
    }

    @SwitchProperty({
        name: "Show naturals",
        description: "If natural veins should show.",
        category: "Naturals"
    })
    showNaturals = false

    @SliderProperty({
        name: "Natural range",
        description: "Range that naturals will show up in",
        category: "Naturals",
        min: 16,
        max: 64
    })
    naturalRange = 32

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
        this.registerListener("Marked lobbies", value => {
            this.lobbyMarking = value;
        })
        this.registerListener("Timer", value => {
            this.timerVisible = value;
        })
        this.registerListener("Downtime tracker", value => {
            this.downtimeTracker = value;
        })
        this.registerListener("Debug", value => {
            this.debug = value;
        })
        this.registerListener("Show powdertracker", value => {
            this.trackerVisible = value;
        })
        this.registerListener("Show totals", value => {
            this.showTotals = value;
        })
        this.registerListener("Show rates", value => {
            this.showRates = value;
        })
        this.registerListener("Alignment", value => {
            this.trackerAlignment = value;
        })
        this.registerListener("Show naturals", value => {
            this.showNaturals = value;
        })
        this.registerListener("Natural range", value => {
            this.naturalRange = value;
        })
    }
}

export default new Settings()