import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { distanceCalc } from "../util/helperFunctions"
const PREFIX = constants.PREFIX
let args

registerCommand({
    aliases: ["optimize"],
    description: "Optimizes routes for Skytils (next neighbour algorithm, y values are 2.5x the distance). Routes must only contain vein nodes! no bombs! This is probably only good for coal/long routes like coal because of the different variables when doing other forms of mining. &4&lDeprecated",
    options: "(skytils route category name)",
    category: "miscellaneous",
    execute: (argsT) => { // thanks rAnalysis for helping.
        args = argsT
        mainThread.start()
    }
})

const mainThread = new Thread(() => {
    ChatLib.chat(`${PREFIX}Working...`)
    let routes = JSON.parse(FileLib.read("Coleweight", "../../../skytils/waypoints.json"))
    let route = routes.categories.find(route => route.name.toLowerCase() === args.slice(1).join(" ").toLowerCase())
    let origWaypoints = route?.waypoints
    if(origWaypoints == undefined || origWaypoints.length < 2) return ChatLib.chat(`${PREFIX}&cRoute does not exist or there is less than two waypoints.`)

    let nextNeighborObj = nextNeighbor(origWaypoints)
    let newWaypoints = nextNeighborObj.waypoints, distances = nextNeighborObj.distances

    route.name = route.name + " Optimized"
    route.waypoints = newWaypoints
    let output = {categories: [route]}

    for(let i = 0; i < origWaypoints.length; i++)
        console.log(origWaypoints[i].x + "," + origWaypoints[i].y + "," + origWaypoints[i].z)
    for(let i = 0; i < newWaypoints.length; i++)
        console.log(newWaypoints[i].x + "," + newWaypoints[i].y + "," + newWaypoints[i].z)


    ChatLib.command(`ct copy ${Base64.encode(JSON.stringify(output))}`, true)

    ChatLib.chat(`${PREFIX}&bRoute copied to clipboard! Original distance: `  + Math.round(distances.orig) + " Optimized distance: " + Math.round(distances.new))
})


function nextNeighbor(origWaypoints)
{
    let newWaypoints = []
    let distances = {orig: 0, new: 0}
    let minDistance, distance, minIndex
    let currentNode = origWaypoints[0]
    newWaypoints.push(origWaypoints[0])
    origWaypoints[0].visited = true

    for(let i = 1; i < origWaypoints.length; i++)
    {
        if(i == origWaypoints.length - 1)
            distances.orig += distanceCalc(origWaypoints[i], origWaypoints[0])
        else
            distances.orig += distanceCalc(origWaypoints[i], origWaypoints[i+1])
        minDistance = Infinity

        for(let j = 0; j < origWaypoints.length; j++)
        {
            if(origWaypoints[j].visited ?? false) continue
            distance = distanceCalc(currentNode, origWaypoints[j])
            if(distance < minDistance)
            {
                minIndex = j
                minDistance = distance
            }
        }
        origWaypoints[minIndex].name = i+1
        newWaypoints.push(origWaypoints[minIndex])
        origWaypoints[minIndex].visited = true
        currentNode = origWaypoints[minIndex]
    }

    newWaypoints.forEach(waypoint => {
        waypoint.visited = undefined
    })

    newWaypoints[0].name = "1"

    // 2-opt to make better
    let improved = true
    while (improved) {
        improved = false
        for (let i = 0; i < newWaypoints.length - 2; i++)
        {
            for (let j = i + 2; j < newWaypoints.length - 1; j++)
            {
                let d1 = distanceCalc(newWaypoints[i], newWaypoints[i + 1])
                let d2 = distanceCalc(newWaypoints[j], newWaypoints[j + 1])
                let d3 = distanceCalc(newWaypoints[i], newWaypoints[j])
                let d4 = distanceCalc(newWaypoints[i + 1], newWaypoints[j + 1])
                if (d1 + d2 > d3 + d4)
                {
                    // swap edges (i+1, i+2), (j, j+1)
                    let newTour = newWaypoints.slice(0, i + 1).concat(newWaypoints.slice(i + 1, j + 1).reverse()).concat(newWaypoints.slice(j + 1))
                    newWaypoints = newTour
                    improved = true
                }
            }
        }
    }

    for(let i = 0; i < newWaypoints.length-1; i++)
        distances.new += distanceCalc(newWaypoints[i], newWaypoints[i+1])
    distances.new += distanceCalc(newWaypoints[newWaypoints.length-1], newWaypoints[0])


    return { waypoints: newWaypoints, distances}
}


// stole from https://www.programiz.com/javascript/examples/encode-string-Base64 because idk how to make b64
const Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        let output = ""
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4
        let i = 0

        input = Base64._utf8_encode(input)

        while (i < input.length) {

            chr1 = input.charCodeAt(i++)
            chr2 = input.charCodeAt(i++)
            chr3 = input.charCodeAt(i++)

            enc1 = chr1 >> 2
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
            enc4 = chr3 & 63

            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            } else if (isNaN(chr3)) {
                enc4 = 64
            }

            output = output +
            Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
            Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4)

        }

        return output
    },

    // public method for decoding
    decode : function (input) {
        let output = ""
        let chr1, chr2, chr3
        let enc1, enc2, enc3, enc4
        let i = 0

        input = input.replace(/[^A-Za-z0-9+/=]/g, "")

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++))
            enc2 = Base64._keyStr.indexOf(input.charAt(i++))
            enc3 = Base64._keyStr.indexOf(input.charAt(i++))
            enc4 = Base64._keyStr.indexOf(input.charAt(i++))

            chr1 = (enc1 << 2) | (enc2 >> 4)
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            chr3 = ((enc3 & 3) << 6) | enc4

            output = output + String.fromCharCode(chr1)

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2)
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3)
            }

        }

        output = Base64._utf8_decode(output)

        return output

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n")
        let utftext = ""

        for (let n = 0; n < string.length; n++) {

            let c = string.charCodeAt(n)

            if (c < 128) {
                utftext += String.fromCharCode(c)
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192)
                utftext += String.fromCharCode((c & 63) | 128)
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224)
                utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                utftext += String.fromCharCode((c & 63) | 128)
            }

        }

        return utftext
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        let string = ""
        let i = 0
        let c = c1 = c2 = 0

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i)

            if (c < 128) {
                string += String.fromCharCode(c)
                i++
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1)
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
                i += 2
            }
            else {
                c2 = utftext.charCodeAt(i+1)
                c3 = utftext.charCodeAt(i+2)
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                i += 3
            }

        }
        return string
    }
}