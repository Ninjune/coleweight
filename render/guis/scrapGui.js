import { registerGui } from "../../guiManager";
import settings from "../../settings";
import { addCommas, secondsToMessage } from "../../util/helperFunctions";
import { BaseGui } from "../BaseGui";

let scrap = 0;
let startTime = undefined
const scrapGui = new BaseGui(["scrapGui", "scrap"], () => {
    if(scrap <= 0)
        return;
    let scrapPerHour = Math.floor(scrap / ((Date.now() - startTime) / (1000 * 60 * 60)));
    return `&aScrap/hr: &b${scrapPerHour}\n&aScrap made: &b${addCommas(scrap)}&b\n&aUptime: &b${secondsToMessage((Date.now()-startTime)/1000)}`;
}, () => { return scrapGui.isOpen() || settings.scrapGui }, () => {
    scrap = 0;
    startTime = undefined;
})
registerGui(scrapGui)


register("chat", () => {
    if(startTime == undefined)
        startTime = Date.now()
    scrap++
}).setChatCriteria("EXCAVATOR! You found a Suspicious Scrap!")