import constants from "../util/constants"
const PREFIX = constants.PREFIX

export function throne(arg2) 
{
    if(arg2 != "toggle")
    {
        ChatLib.chat(`${PREFIX}&bGo to the throne and sit on the back block then run /cw throne toggle.`)
    }
    else
    {
        if(constants.throneValues[0] == undefined)
        {
            let startPos = [Player.getX()-24, Player.getY()+6, Player.getZ()-59] // calculated below values at a weird start so adjusting them
            constants.throneValues.push([startPos[0]+8, startPos[1]+2, startPos[2]-5])
            constants.throneValues.push([startPos[0]+11, startPos[1]-35, startPos[2]-3])
            constants.throneValues.push([startPos[0]+2, startPos[1]-34, startPos[2]-4])
            constants.throneValues.push([startPos[0]+-2, startPos[1]-1, startPos[2]+49])
            constants.throneValues.push([startPos[0]+2, startPos[1]-13, startPos[2]+52])
            constants.throneValues.push([startPos[0]+27, startPos[1]-9, startPos[2]+51])
            constants.throneValues.push([startPos[0]+38, startPos[1]-15, startPos[2]+47])
            constants.throneValues.push([startPos[0]+41, startPos[1]-44, startPos[2]+46])
            constants.throneValues.push([startPos[0]+50, startPos[1]-28, startPos[2]+38])
            constants.throneValues.push([startPos[0]+49, startPos[1]-31, startPos[2]+1])
            constants.throneValues.push([startPos[0]+50, startPos[1]-1, startPos[2]+10])
            ChatLib.chat(`${PREFIX}&bThrone waypoints turned on!`)
        }
        else 
        {
            constants.throneValues = []
            ChatLib.chat(`${PREFIX}&bThrone waypoints turned off!`)
        }
    }
}