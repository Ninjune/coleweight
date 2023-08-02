import constants from "../util/constants"
import { registerCommand } from "../commandManager"
import { getWaypoints } from "../util/waypointLoader";

registerCommand({
    aliases: ["structure"],
    description: ["Generates a structure check route using the route on the clipboard."],
    options: "(amount)",
    category: "waypoints",
    execute: (args) => {
        let points = args[1]
        if (points == undefined || parseInt(points) != points)
            return ChatLib.chat(`${constants.PREFIX}&bPoints must be a integer!`);
        ChatLib.chat(`${constants.PREFIX}&bLoaded Coleweight waypoint data.`);
        let waypoints = getWaypoints(Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j(), "soopy")
        waypoints = waypoints["waypoints"];
        let waypointAmount = waypoints.length;
        let structureCheckPoints = [];
        for (let i = 0; i < points; i++) {
            let k = 0;
            let x = 0;
            let y = 0;
            let z = 0;
            for (let j = 0; j < Math.floor(waypointAmount / points); j++) {
                if (i * Math.floor(waypointAmount / points) + j >= waypointAmount) break;
                x += waypoints[i * Math.floor(waypointAmount / points) + j].x;
                y += waypoints[i * Math.floor(waypointAmount / points) + j].y;
                z += waypoints[i * Math.floor(waypointAmount / points) + j].z;
                k = j;
            }
            x /= k + 1;
            y /= k + 1;
            z /= k + 1;
            x = Math.round(x);
            y = Math.round(y);
            z = Math.round(z);
            structureCheckPoints.push({x: x, y: y, z: z, r: 0, g: 1, b: 0, options: {name: i + 1}});
        }

        ChatLib.command(`ct copy ${JSON.stringify(structureCheckPoints)}`, true)
        ChatLib.chat(`${constants.PREFIX}&bCopied structure check route to clipboard!`);
    }
})