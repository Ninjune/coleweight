import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty } from 'Vigilance'

@Vigilant("Coleweight/config", "Coleweight Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Powdertracker", "Naturals", "Gui", "Stats", "Foraging"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    @SwitchProperty({
        name: "Coleweight tracker",
        description: "Enables the Coleweight tracker. (gain coleweight for a few mins for it to show up)",
        subcategory: "Coleweight Tracker",
        category: "Gui"
    })
    cwToggle = false;

    @ButtonProperty({
        name: "Change Coleweight tracker position",
        description: "Move the location of the coleweight tracker.",
        subcategory: "Coleweight Tracker",
        category: "Gui",
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
        description: "Enables showing Coleweight rank everywhere. (instead of just in Crystal Hollows/Dwarven Mines)",
        subcategory: "Ranked Chat",
        category: "General"
    })
    rankEverywhere = false;

    @SwitchProperty({
        name: "Track griefers",
        description: "Check lobbies for griefers (on join and when new players join.) Mining cult does not encourage the harrasment of people on this list.",
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
        name: "Dwarven notifier",
        description: "Notifies you every day when not in Dwarven Mines.",
        subcategory: "Random Features",
        category: "General"
    })
    dwarvenNotifier = false;

    @SwitchProperty({
        name: "Debug",
        description: "Toggles debug mode.",
        subcategory: "Random Features",
        category: "General"
    })
    debug = false;

    @SwitchProperty({
        name: "Downtime tracker",
        description: "Tracks downtime.",
        subcategory: "Downtime",
        category: "Gui"
    })
    downtimeTracker = false;

    @ButtonProperty({
        name: "Change downtime tracker position",
        description: "Move the location of the downtime tracker.",
        subcategory: "Downtime",
        category: "Gui",
        placeholder: "Open"
    })
    moveDowntimeLocation() {
        ChatLib.command("cw move downtime", true);
    }

    @SwitchProperty({
        name: "Collection tracker",
        description: "Tracks collections ('/cw track (collection)' to set).",
        subcategory: "Collection",
        category: "Gui"
    })
    collectionTracker = false;

    @SwitchProperty({
        name: "Collection notation",
        description: "Changes collection to be abbrivated like '45K' or '2M'.",
        subcategory: "Collection",
        category: "Gui"
    })
    collectionNotation = true;

    @ButtonProperty({
        name: "Change collection tracker position",
        description: "Move the location of the collection tracker.",
        subcategory: "Collection",
        category: "Gui",
        placeholder: "Open"
    })
    moveCollectionLocation() {
        ChatLib.command("cw move collection", true);
    }

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

    @SwitchProperty({ // Gui
        name: "Timer",
        description: "Toggles visibility of CHollows timer",
        subcategory: "Timer",
        category: "Gui"
    })
    timerVisible = false;

    @ButtonProperty({
        name: "Change timer position",
        description: "Move the location of the timer.",
        subcategory: "Timer",
        category: "Gui",
        placeholder: "Open"
    })
    moveTimerLocation() {
        ChatLib.command("cw move timer", true);
    }

    @SwitchProperty({ // Mining abilities
        name: "Mining abilities",
        description: "Toggles title notification of mining abilities.",
        subcategory: "Mining Abilities",
        category: "Gui"
    })
    miningAbilities = false;

    @SwitchProperty({
        name: "Mining abilities gui",
        description: "Toggles mining abilities gui.",
        subcategory: "Mining Abilities",
        category: "Gui"
    })
    miningAbilitiesGui = false;

    @SelectorProperty({
        name: "Mining abilities alignment",
        description: "Sets the alignment of the tracker.",
        subcategory: "Mining Abilities",
        category: "Gui",
        options: ["Left", "Center", "Right"]
    })
    miningAbilitiesAlignment = 0;

    @ButtonProperty({
        name: "Change mining abilities position",
        description: "Move the location of the mining abilities gui.",
        subcategory: "Mining Abilities",
        category: "Gui",
        placeholder: "Open"
    })
    moveAbilitiesLocation() {
        ChatLib.command("cw move miningabilities", true);
    }

    @SwitchProperty({ // Powdertracker
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
    showNaturals = false;

    @SliderProperty({
        name: "Natural range",
        description: "Range that naturals will show up in",
        category: "Naturals",
        min: 16,
        max: 64
    })
    naturalRange = 32;
    
    @SwitchProperty({ // Stats
        name: "Gemstone mining stats",
        description: "Shows gemstone mining speed/fortune on player profile. Also shows tick that you're mining at. (set block below)",
        category: "Stats"
    })
    gemstoneMiningStats = true;

    @SwitchProperty({ // Stats
        name: "Show powder sum",
        description: "Shows powder sum in HOTM menu.",
        category: "Stats"
    })
    showPowderSum = false;

    @SelectorProperty({
        name: "Tick speed block",
        description: "Sets the tick speed block on player profile.",
        category: "Stats",
        options: ["Green Mithril", "Blue Mithril", "Ruby", "Normal gemstone (jade, amethyst, etc)", "Topaz/Opal", "Jasper"]
    })
    tickSpeedBlock = 3;

    @SwitchProperty({ // Foraging
        name: "Treecap timer",
        description: "Shows a timer over crosshair that shows time to next treecapitator proc.",
        category: "Foraging"
    })
    treecapTimer = false;

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
        this.registerListener("Dwarven notifier", value => {
            this.dwarvenNotifier = value;
        })
        this.registerListener("Debug", value => {
            this.debug = value;
        })
        this.registerListener("Marked lobbies", value => {
            this.lobbyMarking = value;
        })
        this.registerListener("Timer", value => {
            this.timerVisible = value;
        })
        this.registerListener("Mining abilities", value => {
            this.miningAbilities = value;
        })
        this.registerListener("Mining abilities gui", value => {
            this.miningAbilitiesGui = value;
        })
        this.registerListener("Mining abilities alignment", value => {
            this.miningAbilitiesAlignment = value;
        })
        this.registerListener("Downtime tracker", value => {
            this.downtimeTracker = value;
        })
        this.registerListener("Collection tracker", value => {
            this.collectionTracker = value;
        })
        this.registerListener("Collection notation", value => {
            this.collectionNotation = value;
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
        this.registerListener("Gemstone mining stats", value => {
            this.gemstoneMiningStats = value;
        })
        this.registerListener("Show powder sum", value => {
            this.showPowderSum = value;
        })
        this.registerListener("Tick speed block", value => {
            this.tickSpeedBlock = value;
        })
        this.registerListener("Tick speed block", value => {
            this.tickSpeedBlock = value;
        })
    }
}

export default new Settings()