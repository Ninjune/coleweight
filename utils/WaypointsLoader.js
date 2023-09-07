const Base64 = Java.type("java.util.Base64")
const DataInputStream = Java.type("java.io.DataInputStream")
const ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream")
/**
 * 
 * @param {String} data 
 * @param {"soopy" | "skytils"} format 
 * @returns
 */
export function getWaypoints(data, format) {
    let oldJSON, rows, tempData

    try {
        if (data.startsWith("<Skytils-Waypoint-Data>(V"))
            return { success: false, message: "&eLoader doesn't support Skytils V1 (goto ninjune.dev/waypoint &e)"}
        else if (data.startsWith("eyJ")) // old skytils
            oldJSON = JSON.parse(FileLib.decodeBase64(data))
        else if (data.startsWith("[{")) // soopy from webiste??
        {
            tempData = JSON.parse(data)
            oldJSON = {categories: []}
            oldJSON.categories.push({
                name: "imported",
                waypoints: [],
                island: "crystal_hollows"
            })

            tempData.forEach((soopyWP, index) => {
                oldJSON.categories[0].waypoints.push({
                    name: soopyWP.options.name ?? index+1,
                    x: parseInt(soopyWP.x),
                    y: parseInt(soopyWP.y),
                    z: parseInt(soopyWP.z),
                    enabled: true,
                    color: 16711680,
                    addedAt: 1666700977214
                })
            })

        }
        else if (data.startsWith("{") || data.startsWith("AQAA")) // old soopy I think
        {
            if(data.startsWith("AQAA"))
                tempData = weirdSoopyFormatToRealSoopyFormat(data)
            else
                tempData = JSON.parse(data)

            oldJSON = {categories: []}
            oldJSON.categories.push({
                name: "imported",
                waypoints: [],
                island: "crystal_hollows"
            })

            Object.keys(tempData).forEach(key => {
                oldJSON.categories[0].waypoints.push({
                    name: tempData[key].options.name ?? key.toString(),
                    x: parseInt(tempData[key].x),
                    y: parseInt(tempData[key].y),
                    z: parseInt(tempData[key].z),
                    enabled: true,
                    color: 16711680,
                    addedAt: 1666700977214
                })
            })
        }
        else // rows
        {
            oldJSON = {categories: []}
            oldJSON.categories.push({
                name: "imported",
                waypoints: [],
                island: "crystal_hollows"
            })

            rows = data.replace("\r", "").split("\n")

            rows.forEach((row, index) => {
                rowArr = row.split(" ")
                oldJSON.categories[0].waypoints.push({
                    name: index+1,
                    x: parseInt(rowArr[0]),
                    y: parseInt(rowArr[1]),
                    z: parseInt(rowArr[2]),
                    enabled: true,
                    color: 16711680,
                    addedAt: 1666700977214
                })
            })
        }


        if(format == "soopy")
        {
            let waypoints = []
            oldJSON.categories[0].waypoints.forEach((waypoint, index) => {
                waypoints.push({
                    x: waypoint.x,
                    y: waypoint.y,
                    z: waypoint.z,
                    r: 0,
                    g: 1,
                    b: 0,
                    options: {name: waypoint.name}
                })
            })

            return { success: true, waypoints }
        }
        else if(format == "skytils")
            return { success: true, waypoints: oldJSON }
    }
    catch (message)
    {
        return { success: false, message }
    }
}


function weirdSoopyFormatToRealSoopyFormat(str)
{
    let byteArray = Base64.getDecoder().decode(str)

    let dataIS = new DataInputStream(new ByteArrayInputStream(byteArray))

    let dataVersion = dataIS.readByte()
    if (dataVersion !== 1) {
        return [true, "Invalid waypoint data version!"]
    }

    let json = {}

    let numbWaypoints = dataIS.readInt()

    for (let i = 0; i < numbWaypoints; i++)
    {
        let waypointD = {}
        let waypointID = dataIS.readUTF()

        waypointD.x = dataIS.readFloat()
        waypointD.y = dataIS.readFloat()
        waypointD.z = dataIS.readFloat()
        waypointD.r = dataIS.readByte() / (255 / 2)
        waypointD.g = dataIS.readByte() / (255 / 2)
        waypointD.b = dataIS.readByte() / (255 / 2)
        waypointD.area = dataIS.readUTF()
        waypointD.options = { name: dataIS.readUTF() }

        json[waypointID] = waypointD

    }

    return json
}