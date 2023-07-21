import constants from "../util/constants"

register("command", (points) => {
  var data = Java.type('java.awt.Toolkit').getDefaultToolkit().getSystemClipboard().getContents(null).getTransferData(Java.type('java.awt.datatransfer.DataFlavor').stringFlavor);
  ChatLib.chat(`${constants.PREFIX} &aLoaded Coleweight waypoint data.`);
  data = JSON.parse(data);

  var waypointAmount = data.length;
  var structureCheckPoints = [];
  for (var i = 0; i < points; i++) {
    var k = 0;
    var x = 0;
    var y = 0;
    var z = 0;
    for (var j = 0; j < Math.floor(waypointAmount / points); j++) {
      if (i * Math.floor(waypointAmount / points) + j >= waypointAmount) break;
      x += data[i * Math.floor(waypointAmount / points) + j].x;
      y += data[i * Math.floor(waypointAmount / points) + j].y;
      z += data[i * Math.floor(waypointAmount / points) + j].z;
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
  //if (mode == "export") {
  var StringSelection = Java.type('java.awt.datatransfer.StringSelection');
  var stringSel = new StringSelection(JSON.stringify(structureCheckPoints));
  Java.type('java.awt.Toolkit').getDefaultToolkit().getSystemClipboard().setContents(stringSel, null);
  ChatLib.chat(`${constants.PREFIX} &aPoints to check copied to clipboard. Load into Coleweight using /cw ordered load to check the route.`);
  //}
  //else if (mode == "render") {
    //currRenderedPoints = structureCheckPoints;
  //  ChatLib.chat(`${constants.PREFIX} &aPoints rendered on screen as waypoints. Use /catclear to clear them.`);
  //}
}).setName("coleweightstructure").setAliases("cwstructure", "structure");