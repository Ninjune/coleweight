import settings from "../settings";
import { dwarvenChecker, registerWhen } from "../util/helperFunctions";
import { drawCoolWaypoint } from "../util/renderUtil"

let waypoints = JSON.parse(FileLib.read("Coleweight", "data/glaciteTunnels.json"))
waypoints.forEach(wp => {
    let rgb

    switch(wp.type)
    {
    case "onyx":
        rgb = [27/255, 26/255, 43/255]
        break;
    case "peridot":
        rgb = [39/255, 105/255, 42/255]
        break;
    case "citrine":
        rgb = [115/255, 107/255, 36/255]
        break;
    default:
        rgb = [67/255, 52/255, 235/255]
        break;
    }
    wp.rgb = rgb;
});

registerWhen(register("renderWorld", () => {
    for(let i = 0; i < waypoints.length; i++)
    {
        let wp = waypoints[i];
        drawCoolWaypoint(wp.coords[0], wp.coords[1], wp.coords[2], wp.rgb[0], wp.rgb[1], wp.rgb[2], {})
    }
}), () => { return settings.tunnelsWaypoints && dwarvenChecker.check() })


/*register("command", (type) => {
    waypoints.push({type, coords: [Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ())]})
    FileLib.write("Coleweight", "data/glaciteTunnels.json", JSON.stringify(waypoints))
}).setCommandName("cwrecord")*/