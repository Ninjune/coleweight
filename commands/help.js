import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function help()
{
    ChatLib.chat("")
    ChatLib.chat(`${PREFIX}&b/cw [username] => Gets coleweight`)
    ChatLib.chat(`${PREFIX}&b/cw help => This menu.`)
    ChatLib.chat(`${PREFIX}&b/cw gui => Change gui location`)
    ChatLib.chat(`${PREFIX}&b/cw toggle => Toggle gui (gui is only active when mining)`)
    ChatLib.chat(`${PREFIX}&b/cw setkey (key) => Sets API key (can also use /api new)`)
    ChatLib.chat(`${PREFIX}&b/cw reload => Reloads the gui.`)
    ChatLib.chat(`${PREFIX}&b/cw throne => Guide for setting up waypoints for throne.`)
    ChatLib.chat(`${PREFIX}&b/cw spiral => Guide for setting up waypoints for spiral.`)
    ChatLib.chat(`${PREFIX}&b/cw leaderboard => Gets leaderboard within a specific range (like 20 40)`)
    ChatLib.chat(`${PREFIX}&b/fetchdiscord (username) => Gets discord of username (if linked)`)
    ChatLib.chat("")
}