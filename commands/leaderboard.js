import axios from "../../axios"
import { registerCommand } from "../commandManager"
import constants from "../util/constants"
const PREFIX = constants.PREFIX


registerCommand({
    aliases: ["leaderboard", "lb", "top"],
    description: "Coleweight leaderboard.",
    options: "(min) [max]",
    category: "info",
    execute: (args) => {
        if(args[1] != undefined && parseInt(args[1]) == args[1] && !isNaN(parseInt(args[1])))
        {
            if(args[2] == undefined && parseInt(args[1]) == args[1] && !isNaN(parseInt(args[1])))
            {
                axios.get(`https://ninjune.dev/api/coleweight-leaderboard?length=${args[1]-1}`)
                .then(res => {
                    for(let i = 0; i < res.data.length; i++)
                    {
                        ChatLib.chat(`&a${res.data[i].rank}. &b${res.data[i].name}: &f${res.data[i].coleweight}`)
                    }
                })
                .catch(err => {
                    ChatLib.chat(`${PREFIX}&4Error! &eApi might be down.`)
                })
            }
            else if(parseInt(args[2]) == args[2] && !isNaN(parseInt(args[2])))
            {
                axios.get(`https://ninjune.dev/api/coleweight-leaderboard?length=${args[2]-1}`)
                .then(res => {
                    for(let i = args[1] - 1; i < res.data.length; i++)
                    {
                        ChatLib.chat(`&a${res.data[i].rank}. &b${res.data[i].name}: &f${res.data[i].coleweight}`)
                    }
                })
                .catch(err => {
                    ChatLib.chat(`${PREFIX}&4Error! &eApi might be down.`)
                })
            }
            else
            {
                ChatLib.chat(`${PREFIX}&ePlease enter an integer! (how many positions) (or a range ie. '20 40')`)
            }
        }
        else
        {
            ChatLib.chat(`${PREFIX}&ePlease enter an integer! (how many positions) (or a range ie. '20 40')`)
        }
    }
})