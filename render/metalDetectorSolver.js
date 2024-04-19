// almost all of this copied from soopy (just reformatted)
import settings from "../settings"
import constants from "../util/constants"
import { drawCoolWaypoint, trace } from "../util/renderUtil"

let chestCoords = JSON.parse(FileLib.read("Coleweight", "data/treasureChestCoords.json"))
let lastLoc = [0, 0, 0]
let baseCoordinates = undefined
let lastSearchedForBase = 0
let ignoreLocation = undefined
let predictedChestLocations = []
let playedPling = false

register("worldLoad", () => {
    lastLoc = [0, 0, 0]
    baseCoordinates = undefined
    lastSearchedForBase = 0
    predictedChestLocations = []
    ignoreLocation = undefined
})

register("actionBar", (dist) => {
    let lapis = false
    let diamond = false
    let emerald = false
    let gold = false
    Player.getInventory().getItems().forEach(i => {
        if (i && i.getName().includes("Scavenged Lapis"))
            lapis = true
        if (i && i.getName().includes("Scavenged Diamond"))
            diamond = true
        if (i && i.getName().includes("Scavenged Emerald"))
            emerald = true
        if (i && i.getName().includes("Scavenged Golden"))
            gold = true
    })

    if (settings.alertTools && lapis && diamond && gold && emerald) Client.showTitle("§cALL TOOLS", "", 10, 40, 20)

    if (!settings.metalDetectorSolver)
        return
    let distance = parseFloat(dist)
    if (!baseCoordinates) findBaseCoordinates();

    if (lastLoc[0] !== Player.getX() || lastLoc[1] !== Player.getY() || lastLoc[2] !== Player.getZ()) {
        lastLoc = [Player.getX(), Player.getY(), Player.getZ()]
        playedPling = false;
        return
    }

    predictedChestLocations = []

    chestCoords.forEach((coordinates) => {
        let currentDistance = Math.hypot(Player.getX() - (baseCoordinates[0] - coordinates[0]), Player.getY() - (baseCoordinates[1] - coordinates[1] + 1), Player.getZ() - (baseCoordinates[2] - coordinates[2]))

        if (Math.round(currentDistance * 10) / 10 === distance) {

            if ([baseCoordinates[0] - coordinates[0], baseCoordinates[1] - coordinates[1], baseCoordinates[2] - coordinates[2]].join(",") === ignoreLocation) {
                ignoreLocation = undefined
                return
            }

            if (predictedChestLocations.length === 0 && !playedPling)
            {
                World.playSound("note.pling", 100, 2)
                playedPling = true;
            }

            predictedChestLocations.push([baseCoordinates[0] - coordinates[0], baseCoordinates[1] - coordinates[1], baseCoordinates[2] - coordinates[2]])
        }
    });
}).setCriteria('TREASURE: ${rest}').setParameter('contains');

register("chat", (a) => {
    if (predictedChestLocations[0]) ignoreLocation = predictedChestLocations[0].join(",")
    predictedChestLocations = []
}).setChatCriteria("&r&aYou found${*}with your &r&cMetal Detector&r&a!&r")


function findBaseCoordinates()
{
    if (Date.now() - lastSearchedForBase < 15000) return;
    let x = ~~Player.getX();
    let y = ~~Player.getY();
    let z = ~~Player.getZ();
    for (let i = x - 50; i < x + 50; i++) {
        for (let j = y + 30; j >= y - 30; j--) {
            for (let k = z - 50; k < z + 50; k++) {
                if (World.getBlockAt(i, j, k).getType().getID() === 156 && World.getBlockAt(i, j + 13, k).getType().getID() === 166) {
                    baseCoordinates = getBaseCoordinates(i, j + 13, k);
                    return;
                }
            }
        }
    }
    lastSearchedForBase = Date.now();
}

function getBaseCoordinates(x, y, z) {
    let loop = true;
    let posX = x;
    let posY = y;
    let posZ = z;
    if (World.getBlockAt(x, y, z).getType().getID() !== 166) return [x, y, z];
    while (loop) {
        loop = false;
        if (World.getBlockAt(posX + 1, posY, posZ).getType().getID() == 166) {
            posX++;
            loop = true;
        }
        if (World.getBlockAt(posX, posY - 1, posZ).getType().getID() == 166) {
            posY--;
            loop = true;
        }
        if (World.getBlockAt(posX, posY, posZ + 1).getType().getID() == 166) {
            posZ++;
            loop = true;
        }
    }
    return [posX, posY, posZ];
}


register("renderWorld", () => {
    predictedChestLocations.forEach(loc => {
        drawCoolWaypoint(loc[0], loc[1], loc[2], 0, 255, 0, { name: "TREASURE", phase: true })
        trace(loc[0] + 0.5, loc[1] + 0.5, loc[2] + 0.5, 0, 1, 0, 1, settings.orderedLineThickness)
    })
})


register("soundPlay", (pos, name, vol, pitch, category, event) => {
    if(!settings.muteMetalDetectorSound || event == undefined)
        return;
    let heldItem = Player.getHeldItem()?.getItemNBT()?.getTag("tag")?.getTag("ExtraAttributes")?.getTag("id")?.toString();
    if(heldItem == "\"DWARVEN_METAL_DETECTOR\"" &&
        name == "note.harp"
    )
        cancel(event);
})