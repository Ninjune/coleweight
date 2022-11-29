import axios from "../../axios"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function leaderboard(arg2, arg3)
{
    if(arg2 != undefined && parseInt(arg2) == arg2 && !isNaN(parseInt(arg2)))
    {
        if(arg3 == undefined && parseInt(arg2) == arg2 && !isNaN(parseInt(arg2)))
        {
            axios.get(`https://ninjune.dev/api/coleweight-leaderboard?length=${arg2}`)
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
        else if(parseInt(arg3) == arg3 && !isNaN(parseInt(arg3)))
        {
            axios.get(`https://ninjune.dev/api/coleweight-leaderboard?length=${arg3}`)
            .then(res => {
                for(let i = arg2 - 1; i < res.data.length; i++)
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
