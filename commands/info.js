import axios from "../../axios"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function info()
{
    axios.get(`https://ninjune.dev/api/cwinfo`)
    .then((res) => {
        let values = res.data,
        powder = values.powder,
        collection = values.collection,
        miscellaneous = values.miscellaneous

        ChatLib.chat(`${PREFIX}&bEach of the following are equivalent to one unit of ColeWeight` +
        `\n\n&4&lExperience \n&b${values.experience.req} mining exp` +
        `\n\n&4&lPowder \n&b${powder[0].req} &bmithril powder\n&b${powder[1].req} gemstone powder` + // in theory I should have just added formatted names to the api
        `\n\n&4&lCollections \n&b${collection[0].req} &bmithril\n&b${collection[1].req} gemstone\n&b${collection[2].req} gold\n&b${collection[3].req}netherrack\n&b${collection[4].req} diamond\n&b${collection[5].req} ice\n&b${collection[6].req} redstone\n&b${collection[7].req} lapis\n&b${collection[8].req} sulphur\n&b${collection[9].req} coal\n&b${collection[10].req} emerald\n&b${collection[11].req} endstone\n&b${collection[12].req} glowstone\n&b${collection[13].req} gravel\n&b${collection[14].req} iron\n&b${collection[15].req} mycelium\n&b${collection[16].req} quartz\n&b${collection[17].req} obsidian\n&b${collection[18].req} red sand\n&b${collection[19].req} sand\n&b${collection[20].req} cobblestone\n&b${collection[21].req} hardstone` +
        `\n\n&4&lMiscellaneous \n&b${miscellaneous[0].req} scatha kills\n&b${miscellaneous[1].req} worm kills\n&b${miscellaneous[2].req} nucleus runs`)
    })
    .catch((e) => {
        return `${PREFIX}&cThere was an error. (api may be down)`
    })
}