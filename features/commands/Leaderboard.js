import { PREFIX, addCommas, makeRequest, printError, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["leaderboard", "lb", "top"],
    description: "Checks for leaderboard positions.",
    options: "(min) [max]",
    category: "info",
    execute: (args) => {
        if(!args[1]) return ChatLib.chat(`${PREFIX}&ePlease enter an integer! (how many positions) (or a range ie. "20 40")`)

        if(args[2]) return makeRequest(`https://ninjune.dev/api/coleweight-leaderboard?length=${args[2]-1}`)
            .then(response => {
                response.forEach(result => {
                    ChatLib.chat(`&a${result.rank}. &b${result.name}: &f${addCommas(result.coleweight)}`)
                })
            })
            .catch(error => {
                print(error.message)
                printError(error)
            })

        makeRequest(`https://ninjune.dev/api/coleweight-leaderboard?length=${args[1]-1}`)
            .then(response => {
                response.forEach(result => {
                    ChatLib.chat(`&a${result.rank}. &b${result.name}: &f${addCommas(result.coleweight)}`)
                })
            })
            .catch(error => {
                print(error.message)
                printError(error)
            })
    }
})