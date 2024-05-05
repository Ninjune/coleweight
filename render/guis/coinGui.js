import { registerGui } from "../../guiManager";
import settings from "../../settings";
import { addCommas, secondsToMessage } from "../../util/helperFunctions";
import { BaseGui } from "../BaseGui";
import request from "../../../requestV2";
// some code from soopy's version
let money = 0;
let startTime = -1;
let lastMined = -1;
let moneyPerHour = -1;
let lastPrice = 0;
let lastForceNPC = settings.forceNPC;
let lastGemstoneType = settings.gemstoneType;
let lastGemstone = "n/a";
const gemstoneCosts = {};


const coinGui = new BaseGui(["coinGui", "coin", "money", "cointracker"], () => {
    if(startTime <= 0)
        return;

    let type;
    switch(settings.gemstoneType)
    {
    case 0:
        type = "Perfect";
        break;
    case 1:
        type = "Flawless";
        break;
    case 2:
        type = "Fine";
        break;
    case 3:
        type = "Flawed";
        break;
    case 4:
        type = "Rough";
        break;
    }

    return `&a(${lastGemstone} ${type} @ &b${addCommas(lastPrice)}&a)\n&a$/hr: &b$${addCommas(moneyPerHour)}\n&a$ made: &b$${addCommas(Math.floor(money))}&b\n&aUptime: &b${secondsToMessage((Date.now()-startTime)/1000)}`;
}, () => { return coinGui.isOpen() || settings.coinTracker } , resetVars);
registerGui(coinGui);


register("chat", (gem, amount, event) => {
    if(lastForceNPC != settings.forceNPC || lastGemstoneType != settings.gemstoneType)
        resetVars();
    lastForceNPC = settings.forceNPC;
    lastGemstoneType = settings.gemstoneType;
    let type;
    switch(settings.gemstoneType)
    {
    case 0:
        type = "PERFECT";
        break;
    case 1:
        type = "FLAWLESS";
        break;
    case 2:
        type = "FINE";
        break;
    case 3:
        type = "FLAWED";
        break;
    case 4:
        type = "ROUGH";
        break;
    }

    let id = type + "_" + gem.toUpperCase() + "_GEM";
    lastMined = Date.now();

    if(startTime === 0) return;
    if(startTime === -1)
    {
        startTime = 0;
        request({
            url: "https://api.hypixel.net/skyblock/bazaar",
            json: true
        })
        .then(res => {
            startTime = Date.now();
            Object.keys(res.products).filter(i => {
                if(i.startsWith("FLAWED") || i.startsWith("FINE") || i.startsWith("FLAWLESS") | i.startsWith("PERFECT") || i.startsWith("ROUGH")) return true
            }).forEach(i => {
                let npc = 3 * Math.pow(80, (4-settings.gemstoneType));
                gemstoneCosts[i] = settings.forceNPC ? npc : Math.max(npc, res.products[i].quick_status.sellPrice);
            });
        })
        .catch(err => {
            if(settings.debug)
                console.log("Coin tracker: " + err);
        });
        return;
    }

    lastGemstone = gem;
    lastPrice = parseInt(gemstoneCosts[id]);
    money += (gemstoneCosts[id] / Math.pow(80, (3-settings.gemstoneType))) * amount;
    moneyPerHour = Math.floor(money / ((Date.now() - startTime) / (1000 * 60 * 60)));
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r&a. Flawed (.+) Gemstone &r&8x(\d+)&r&f!&r/g);


register("step", () => {
    if (lastMined && Date.now() - lastMined > 2 * 60000) {
        resetVars();
    }
}).setFps(1);


function resetVars()
{
    money = 0;
    startTime = -1;
    lastMined = -1;
}
