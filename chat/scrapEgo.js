import constants from "../util/constants"

let enterTime = undefined;
register("chat", (name) => {
    if(name != Player.getName())
        return;
    enterTime = Date.now()
}).setChatCriteria(/ ⛏ (.*) entered the mineshaft!/)


register("chat", () => {
    ChatLib.chat(`${constants.PREFIX}&bYou found a scrap in ${(Date.now()-enterTime)/1000} seconds!`)
}).setChatCriteria("EXCAVATOR! You found a Suspicious Scrap!")