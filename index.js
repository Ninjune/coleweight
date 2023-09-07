/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import { PREFIX, data } from "./utils/Utils"

// Render
import "./features/render/NaturalCoords"
import "./features/render/InvisibleItems"
import "./features/render/StreamerMode"
import "./features/render/TreeCapOverlay"
// Commands
import "./features/commands/ColeWeight"
import "./features/commands/FetchDiscord"
import "./features/commands/SetKey"
import "./features/commands/Help"
import "./features/commands/Coords"
import "./features/commands/Credits"
import "./features/commands/DeleteRoute"
import "./features/commands/DrawLine"
import "./features/commands/Import"
import "./features/commands/Info"
import "./features/commands/Leaderboard"
import "./features/commands/MarkingLobbies"
import "./features/commands/MningTest"
import "./features/commands/Optimize"
import "./features/commands/StopWatch"
import "./features/commands/Structure"
import "./features/commands/Timer"
import "./features/commands/Waypoints"
import "./features/commands/Ordered"
import "./features/commands/Track"
import "./features/commands/Reload"
import "./features/commands/Move"
import "./features/commands/Config"
// Command/Coords
import "./features/commands/coord/automatons"
import "./features/commands/coord/divans"
import "./features/commands/coord/spiral"
import "./features/commands/coord/temple"
import "./features/commands/coord/throne"
import "./features/commands/coord/yog"
// Chat
import "./features/chat/LowProc"
import "./features/chat/AutoRenew"
import "./features/chat/RankMessage"
// Mining
import "./features/mining/GrieferTrack"
import "./features/mining/DwarvenNotifier"
import "./features/mining/EfficientMinerDilloWarning"
import "./features/mining/EfficientMinerOverlay"
import "./features/mining/GemstoneMiningStats"
// Guis
import "./features/guis/StopWatchGui"
import "./features/guis/ColeWeightGui"
import "./features/guis/CoinsGui"
import "./features/guis/CollectionGui"
import "./features/guis/DanceGui"
import "./features/guis/FireFreezeGui"
import "./features/guis/GyroGui"
import "./features/guis/MiningAbilitiesGui"
import "./features/guis/PowderTrackerGui"
import "./features/guis/TimerGui"

// first time check
const firstTimeRegister = register("step", () => {
    if(!World.isLoaded()) return
    if(!data.first_time) return firstTimeRegister.unregister()

    data.first_time = false
    data.save()
    ChatLib.chat("")
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bPlease Set Your Api Key By Doing /api new`)).chat()
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bOr By Doing /cw setkey (key)`)).chat()
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bView commands: /cw help`)).chat()
    new TextComponent(ChatLib.getCenteredText(`${PREFIX}&bJoin my discord &3here&b to keep up with development!`))
    .setClickAction("open_url")
    .setClickValue("https://discord.gg/yj4P4FqHPA")
    .chat()
    ChatLib.chat("")
}).setFps(1)

// check routes
if(!FileLib.exists("Coleweight", "config/routes.json"))
    FileLib.write("Coleweight", "config/routes.json", FileLib.read("Coleweight", "data/defaultroutes"))