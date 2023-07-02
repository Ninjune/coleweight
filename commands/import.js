import axios from "../../axios"
import { registerCommand } from "../commandManager"
import settings from "../settings"
import constants from "../util/constants"
import { load } from "./ordered"
const PREFIX = constants.PREFIX

if(!FileLib.exists("Coleweight", "config/routes.json"))
    FileLib.write("Coleweight", "config/routes.json", FileLib.read("Coleweight", "data/defaultroutes"))

registerCommand({
    aliases: ["import"],
    description: "Import waypoints into Skytils.",
    options: "[route]",
    category: "miscellaneous",
    execute: (args) => {
        let routes = JSON.parse(FileLib.read("Coleweight", "config/routes.json"))

        if(args[1] == undefined)
        {
            axios.get("https://ninjune.dev/api/cw/routes")
            .then(res => {
                local(routes)
                res.data.forEach(route => {
                    ChatLib.chat(`&b${route.name}: ${route.description}`)
                })
                ChatLib.chat("")
                ChatLib.chat(`${PREFIX}&bDo '&e/cw import (route)&b' to copy the import for Skytils!`)
            })
            .catch(err => {
                if(settings.debug) console.log(err)
                local(routes)
                ChatLib.chat("&cUnable to fetch online routes. (api may be down.)")
                ChatLib.chat("")
                ChatLib.chat(`${PREFIX}&bDo '&e/cw import (route)&b' to copy the import!`)
            })
        }
        else
        {
            let route = routes[args[1].toLowerCase()]
            if(route == undefined)
            {
                axios.get(`https://ninjune.dev/api/cw/routes?route=${args[1]}`)
                .then(res => {
                    if(res.data.found !== false)
                    {
                        ChatLib.command(`ct copy ${res.data.route}`, true)
                        ChatLib.chat(`${PREFIX}&bSuccessfully copied &a${args[1]}&b route's data to clipboard! Format: &a${res.data.format}`)
                    }
                    else
                        ChatLib.chat(`${PREFIX}&cCould not find the route '&e${args[1]}&c'!`)
                })
                .catch(err => {
                    ChatLib.chat(`${PREFIX}&cCThere was an error fetching the api! ${err}`)
                })
            }
            else
            {
                if(route.format != "soopy")
                    ChatLib.command(`ct copy ${route.data}`, true)
                else
                    load(route.data)

                ChatLib.chat(`${PREFIX}&bSuccessfully ${route.format != "soopy" ? "copied" : "loaded"} &a${args[1]}&b route! Format: &a${route.format}`)
            }
        }
    }
})


function local(routes)
{
    ChatLib.chat("")
    ChatLib.chat(ChatLib.getCenteredText("&aLocal routes:"))
    Object.keys(routes).forEach(key => {
        ChatLib.chat(`&b${key}: ${routes[key].desc}`)
    })
    ChatLib.chat("")
    ChatLib.chat(ChatLib.getCenteredText("&aOnline routes:"))
}