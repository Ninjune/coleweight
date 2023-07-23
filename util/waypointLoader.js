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
            oldJSON = JSON.parse(B64.decode(data))
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


// stole from https://www.programiz.com/javascript/examples/encode-string-Base64 because idk how to make b64
const B64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        let output = ""
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4
        let i = 0

        input = B64._utf8_encode(input)

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
            B64._keyStr.charAt(enc1) + B64._keyStr.charAt(enc2) +
            B64._keyStr.charAt(enc3) + B64._keyStr.charAt(enc4)

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

            enc1 = B64._keyStr.indexOf(input.charAt(i++))
            enc2 = B64._keyStr.indexOf(input.charAt(i++))
            enc3 = B64._keyStr.indexOf(input.charAt(i++))
            enc4 = B64._keyStr.indexOf(input.charAt(i++))

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

        output = B64._utf8_decode(output)

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