import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function spiral(arg2) 
{
    if(arg2 != "toggle")
    {
        new TextComponent(`${PREFIX}&bGo to the place in &3this&b picture and do /cw spiral toggle`)
        .setClickAction("open_url")
        .setClickValue("https://i.imgur.com/dyL30GD.png")
        .chat()
    }
    else
    {
        if(constants.spiralValues[0] == undefined)
        {
            let startPos = [Player.getX(), Player.getY(), Player.getZ()]
            constants.spiralValues.push([startPos[0]+2, startPos[1]-3, startPos[2]+14])
            constants.spiralValues.push([startPos[0]+3, startPos[1]-21, startPos[2]+6])
            constants.spiralValues.push([startPos[0]+6, startPos[1]-23, startPos[2]-1])
            constants.spiralValues.push([startPos[0]+19, startPos[1]+4, startPos[2]-5])
            constants.spiralValues.push([startPos[0]+21, startPos[1]-7, startPos[2]])
            constants.spiralValues.push([startPos[0]+25, startPos[1]-35, startPos[2]-8])
            constants.spiralValues.push([startPos[0]+39, startPos[1]-36, startPos[2]])
            constants.spiralValues.push([startPos[0]+52, startPos[1]-24, startPos[2]+1])
            constants.spiralValues.push([startPos[0]+48, startPos[1]+3, startPos[2]+3])
            constants.spiralValues.push([startPos[0]+47, startPos[1]+4, startPos[2]+22])
            constants.spiralValues.push([startPos[0]+55, startPos[1]-8, startPos[2]+42])
            constants.spiralValues.push([startPos[0]+46, startPos[1]-11, startPos[2]+49])
            constants.spiralValues.push([startPos[0]+26, startPos[1]+5, startPos[2]+39])
            constants.spiralValues.push([startPos[0]+20, startPos[1]+3, startPos[2]+41])
            constants.spiralValues.push([startPos[0]+8, startPos[1]-23, startPos[2]+32])
            constants.spiralValues.push([startPos[0]+4, startPos[1]-23, startPos[2]+28])
            ChatLib.chat(`${PREFIX}&bSpiral waypoints turned on!`)
        }
        else 
        {
            constants.spiralValues = []
            ChatLib.chat(`${PREFIX}&bSpiral waypoints turned off!`)
        }
    }
}