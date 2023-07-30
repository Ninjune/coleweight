import { PREFIX, distanceCalc, registerCommands } from "../../utils/Utils"

registerCommands({
    aliases: ["optimize"],
    description: "Optimizes routes for Skytils (next neighbour algorithm, y values are 2.5x the distance). Routes must only contain vein nodes! no bombs! This is probably only good for coal/long routes like coal because of the different variables when doing other forms of mining.",
    options: "(skytils route category name)",
    category: "miscellaneous",
    execute: (args) => {
        mainThread(args).start()
    }
})

const mainThread = (args) => new Thread(() => {
    ChatLib.chat(`${PREFIX}Working...`)

    let routes = JSON.parse(FileLib.read("Coleweight", "../../../skytils/waypoints.json"))
    let route = routes.categories.find(route => route.name.toLowerCase() === args.slice(1).join(" ").toLowerCase())
    let origWaypoints = route?.waypoints

    if(!origWaypoints || origWaypoints.length < 2) return ChatLib.chat(`${PREFIX}&cRoute does not exist or there is less than two waypoints.`)

    let nextNeighborObj = nextNeighbor(origWaypoints)
    let newWaypoints = nextNeighborObj.waypoints, distances = nextNeighborObj.distances

    route.name = route.name + " Optimized"
    route.waypoints = newWaypoints
    let output = {categories: [route]}

    for(let i = 0; i < origWaypoints.length; i++)
        console.log(origWaypoints[i].x + "," + origWaypoints[i].y + "," + origWaypoints[i].z)
    for(let i = 0; i < newWaypoints.length; i++)
        console.log(newWaypoints[i].x + "," + newWaypoints[i].y + "," + newWaypoints[i].z)


    ChatLib.command(`ct copy ${FileLib.decodeBase64(JSON.stringify(output))}`, true)

    ChatLib.chat(`${PREFIX}&bRoute copied to clipboard! Original distance: `  + Math.round(distances.orig) + " Optimized distance: " + Math.round(distances.new))
})

const nextNeighbor = (origWaypoints) => {
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