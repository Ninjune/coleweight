import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty, @ColorProperty, Color } from "../Vigilance/index"

@Vigilant("Coleweight/config", "Coleweight Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Naturals", "Gui", "Stats", "Ordered waypoints", "Foraging"];

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
        name: "Griefer messages everywhere",
        description: "Makes griefer messages appear in all lobbies (not just CH/DM)",
        subcategory: "Random Features",
        category: "General"
    })
    grieferEverywhere = false;

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
        name: "Streamer mode",
        description: "Various features to protect against snipers.",
        subcategory: "Streamer mode",
        category: "General"
    })
    streamerMode = false;

    @SwitchProperty({
        name: "Block tab",
        description: "Blocks tab from being rendered. (when streamer mode)",
        subcategory: "Streamer mode",
        category: "General"
    })
    streamerBlockTab = true;

    @SwitchProperty({
        name: "Block debug",
        description: "Blocks debug menu (F3) from being rendered. (when streamer mode)",
        subcategory: "Streamer mode",
        category: "General"
    })
    streamerBlockDebug = true;

    @SwitchProperty({
        name: "Block bossbar",
        description: "Blocks bossbar from being rendered. (when streamer mode)",
        subcategory: "Streamer mode",
        category: "General"
    })
    streamerBlockBossbar = true;

    @SwitchProperty({
        name: "Randomize lobby",
        description: "Randomizes lobby on the sidebar. (when streamer mode)",
        subcategory: "Streamer mode",
        category: "General"
    })
    streamerRandomizeLobby = true;
    
    @SwitchProperty({
        name: "Ordered waypoints line",
        description: "Toggles line for ordered waypoints.",
        category: "Ordered waypoints"
    })
    orderedWaypointsLine = true;

    @SwitchProperty({
        name: "Setup mode",
        description: "Renders all waypoints in 16 block radius with a red outline with wall phase off & renders an additional line to show where the player will be looking when they warp to next block. &cCan cause lag.",
        category: "Ordered waypoints"
    })
    orderedSetup = false;

    @SliderProperty({
        name: "Next waypoint distance",
        description: "The distance the player must be in before the ordered waypoints goes to the next one.",
        category: "Ordered waypoints",
        min: 1,
        max: 10
    })
    nextWaypointRange = 3;

    @SliderProperty({
        name: "Ordered trace line thickness",
        description: "Thickness of trace line.",
        category: "Ordered waypoints",
        min: 1,
        max: 3
    })
    orderedLineThickness = 1;

    @ColorProperty({
        name: "Ordered color",
        description: "Sets the color of the line.",
        category: "Ordered waypoints"
    })
    orderedColor =  Color.GREEN;

    @SwitchProperty({
        name: "Efficient miner with dillo warning",
        description: "Shows a warning when you have dillo + efficient miner equipped.",
        subcategory: "Random Features",
        category: "General"
    })
    effDilloWarning = true;

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
        name: "Efficient Miner Overlay",
        description: "Points towards the best block to break with efficient miner. (Also dwarven mines mithril overlay)",
        subcategory: "Efficient Miner Overlay",
        category: "Gui"
    })
    efficientMinerOverlay = false;

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

    @SwitchProperty({
        name: "Collection show always",
        description: "Changes collection tracker to show always.",
        subcategory: "Collection",
        category: "Gui"
    })
    showCollectionTrackerAlways = false;

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
        description: "Toggles visibility of timer (/cw timer)",
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

    @SwitchProperty({
        name: "Timer End Visiblity",
        description: "Toggles visibility of timer at 0m 0s",
        subcategory: "Timer",
        category: "Gui"
    })
    timerEndVisible = false;

    @SwitchProperty({
        name: "Stopwatch",
        description: "Toggles visibility of stopwatch (/cw stopwatch)",
        subcategory: "Stopwatch",
        category: "Gui"
    })
    stopwatchVisible = false;

    @ButtonProperty({
        name: "Change stopwatch position",
        description: "Move the location of the stopwatch.",
        subcategory: "Stopwatch",
        category: "Gui",
        placeholder: "Open"
    })
    moveStopwatchLocation() {
        ChatLib.command("cw move stopwatch", true);
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

    @SwitchProperty({
        name: "Mining abilities selected indicator",
        description: "Tells which ability is selected on the ability gui.",
        subcategory: "Mining Abilities",
        category: "Gui"
    })
    miningAbilitiesSelectedIndicator = true;

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
        subcategory: "Powdertracker",
        category: "Gui"
    })
    trackerVisible = false;
    
    @SwitchProperty({
        name: "Show totals",
        description: "If the tracker should show the total amount.",
        subcategory: "Powdertracker",
        category: "Gui"
    })
    showTotals = true;
    
    @SwitchProperty({
        name: "Show rates",
        description: "If the tracker should show the estimated rates per hour.",
        subcategory: "Powdertracker",
        category: "Gui"
    })
    showRates = true;
    
    @SelectorProperty({
        name: "Alignment",
        description: "Sets the alignment of the tracker.",
        subcategory: "Powdertracker",
        category: "Gui",
        options: ["Left", "Right", "Center"]
    })
    trackerAlignment = 0;
    
    @ButtonProperty({
        name: "Change Powdertracker position",
        description: "Move the location of the powdertracker.",
        subcategory: "Powdertracker",
        category: "Gui",
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
    }
}

export default new Settings()