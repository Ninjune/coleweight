import { registerGui } from "../../guiManager"
import settings from "../../settings"
import constants from "../../util/constants"
import { addCommas, secondsToMessage, calculateAverage } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
import request from "../../../requestV2"
// some code from soopy's version
let money = 0
let startTime = -1
let lastMined = -1
let moneyPerHour = -1

let flawedMined = 0;
let fineEquivalents = 0;
let flawlessEquivalents = 0;
let totalFlawlessMined = 0;
let lastFlawlessTime = null;
let allTimes = [];

const flawedGemstoneCosts = {};
const fineGemstoneCosts = {};
const flawlessGemstoneCosts = {};
const coinGui = new BaseGui(["coinGui", "coin", "money", "cointracker"], () => {
    if((!coinGui.isOpen() && !settings.coinTracker) || startTime <= 0)
        return

    return `&a$/hr: &b$${addCommas(moneyPerHour)}\n&a$ made: &b$${addCommas(Math.floor(money))}&b\n&aUptime: &b${secondsToMessage((Date.now()-startTime)/1000)}`
}, resetVars)
registerGui(coinGui)

register("chat", (gem, amount, event) => { 
    let id = "FLAWED_" + gem.toUpperCase() + "_GEM"
    let fine = "FINE_" + gem.toUpperCase() + "_GEM"
    let flawless = "FLAWLESS_" + gem.toUpperCase() + "_GEM"
    lastMined = Date.now()

    if(startTime === 0) return
    if(startTime === -1)
    {
        startTime = 0
        request({
            url: `https://api.hypixel.net/skyblock/bazaar`,
            json: true
        })
        .then(res => {
            startTime = Date.now()
            Object.keys(res.products).forEach(i => {
                if(id.startsWith("FLAWED_")) {
                    flawedGemstoneCosts[i] = settings.forceNpc ? 240 : Math.max(240, res.products[id].quick_status.sellPrice);
                }
                if (fine.startsWith("FINE_")) {
                    fineGemstoneCosts[i] = settings.forceNpc ? 19200 : Math.max(19200, res.products[fine].quick_status.sellPrice);
                }
                if(flawless.startsWith("FLAWLESS_")) {
                    flawlessGemstoneCosts[i] = settings.forceNpc ? 1536000 : Math.max(1536000, res.products[flawless].quick_status.sellPrice);
                }
            });
        })
        .catch(err => {
            if(settings.debug)
                console.log("Coin tracker: " + err)
        })
        return
    }

    flawedMined += parseInt(amount);
    if (getBestFormToSell(fineGemstoneCosts[fine], flawlessGemstoneCosts[flawless]) == "FINE") {
        while (flawedMined >= 80) {
            // 80 flawed has been mined, add 1 fine
            fineEquivalents++;
            flawedMined -= 80;
        }
    } else {
        while (flawedMined >= 6400) {
            // 80 fine has been mined, add 1 flawless
            flawlessEquivalents++;
            flawedMined -= 6400;
            totalFlawlessMined++;
            if(settings.flawlessAlert){
                if(totalFlawlessMined == 1){
                    if(settings.flawlessSound){
                        World.playSound("fireworks.largeBlast", 1, 1);
                    }
                    ChatLib.chat(constants.PREFIX + ` &eOne flawless gemstone has been mined in ${secondsToMessage((Date.now()-startTime)/1000)}!`);
                    lastFlawlessTime = Date.now();
                    allTimes.push((Date.now()-startTime)/1000);
                }
                else{
                    if(allTimes[allTimes.length - 1] > (Date.now()-lastFlawlessTime)/1000){
                        if(settings.flawlessSound){
                            World.playSound("fireworks.largeBlast", 1, 1);
                        }
                        allTimes.push((Date.now()-lastFlawlessTime)/1000);
                        ChatLib.chat(constants.PREFIX + ` &eAnother flawless gemstone has been mined in ${secondsToMessage((Date.now()-lastFlawlessTime)/1000)}! (&2&l+${secondsToMessage(allTimes[allTimes.length - 2] - (Date.now()-lastFlawlessTime)/1000)}&e - avg time ${secondsToMessage(calculateAverage(allTimes))})`);
                    }else{
                        if(settings.flawlessSound){
                            World.playSound("fireworks.largeBlast", 1, 1);
                        }
                        allTimes.push((Date.now()-lastFlawlessTime)/1000);
                        ChatLib.chat(constants.PREFIX + ` &eAnother flawless gemstone has been mined in ${secondsToMessage((Date.now()-lastFlawlessTime)/1000)}! (&4&l-${secondsToMessage((Date.now()-lastFlawlessTime)/1000 - allTimes[allTimes.length - 2])}&e - avg time ${secondsToMessage(calculateAverage(allTimes))})`);
                    }
                    lastFlawlessTime = Date.now();
                }
            }
        }
    }

    money = (flawedGemstoneCosts[id] * flawedMined);
    if (getBestFormToSell(fineGemstoneCosts[fine], flawlessGemstoneCosts[flawless]) == "FINE") {
        money += fineGemstoneCosts[fine] * fineEquivalents;
    }
    else {
        money += flawlessGemstoneCosts[flawless] * flawlessEquivalents;
    }

    moneyPerHour = Math.floor(money / ((Date.now() - startTime) / (1000 * 60 * 60)));
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r&a. &r&aFlawed (.+) Gemstone &r&8x(\d+)&r&f!&r/g)

register("step", () => {
    if (lastMined && Date.now() - lastMined > 2 * 60000) {
        resetVars()
    }
}).setFps(1)

function resetVars()
{
    if (flawlessEquivalents > 0) {
        if (settings.flawlessSound){
            World.playSound("fireworks.twinkle", 1, 1);
        }
        ChatLib.chat(constants.PREFIX + " &eGG, You mined equivalent of &b" + flawlessEquivalents + " flawless gemstones!");
    }
    money = 0
    startTime = -1
    lastMined = -1
    flawedMined = 0;
    fineEquivalents = 0;
    flawlessEquivalents = 0;
    allTimes = [];
    lastFlawlessTime = null;
    totalFlawlessMined = 0;
}

function getBestFormToSell(pFine, pFlawless)
{
    if ((pFine * 80) > pFlawless) {
        return "FINE";
    } else {
        return "FLAWLESS";
    }
}
