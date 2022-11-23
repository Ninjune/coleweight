import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function help()
{
    ChatLib.chat("")
    ChatLib.chat(`${PREFIX}&b/cw [username] => Gets coleweight`)
    ChatLib.chat(`${PREFIX}&b/cw help => This menu.`)
    ChatLib.chat(`${PREFIX}&b/cw settings => Open settings.`)
    ChatLib.chat(`${PREFIX}&b/cw time => Prints time on timer (timer gui doesn't have to be visible).`)
    ChatLib.chat(`${PREFIX}&b/cw tick <mining speed> <('r','jade', etc) || breaking power of block> => Shows tick data.`)
    ChatLib.chat(`${PREFIX}&b/cw info => Prints coleweight info.`)
    ChatLib.chat(`${PREFIX}&b/cw claim <throne || spiral> => Claims a chollows sapphire structure in a lobby.`)
    ChatLib.chat(`${PREFIX}&b/cw setkey <key> => Sets API key (can also use /api new)`)
    ChatLib.chat(`${PREFIX}&b/cw reload => Reloads the gui.`)
    ChatLib.chat(`${PREFIX}&b/cw throne => Guide for setting up waypoints for throne.`)
    ChatLib.chat(`${PREFIX}&b/cw spiral => Guide for setting up waypoints for spiral.`)
    ChatLib.chat(`${PREFIX}&b/cw yog => Guide for setting up waypoints for yogs.`)
    ChatLib.chat(`${PREFIX}&b/cw leaderboard => Gets leaderboard within a specific range (like 20 40)`)
    ChatLib.chat(`${PREFIX}&b/fetchdiscord (username) => Gets discord of username (if linked)`)
    ChatLib.chat("")
}