import constants from "../../util/constants"
import { parseNotatedInput } from "../../util/helperFunctions"
const PREFIX = constants.PREFIX


export function calcSpeed(powder)
{
    let speedLevels = 1,
     professionalLevels = 1

    if(powder == undefined || parseNotatedInput(powder) == undefined) return ChatLib.chat(constants.CALCULATEERRORMESSAGE)
    powder = parseNotatedInput(powder)

    while(powder > msPowder(speedLevels) + profPowder(professionalLevels))
    {
        if(ms2SpeedPerPowder(speedLevels + 1) > professionalSpeedPerPowder(professionalLevels + 1) && speedLevels < 50)
        {
            powder -= msPowder(speedLevels++)
        }
        else if (professionalLevels < 140)
        {
            powder -= profPowder(professionalLevels++)
        }
        else break
    }
    return ChatLib.chat(`&bGet &6&l${speedLevels} &bmining speed levels and &6&l${professionalLevels} &bprofessional levels.`)
}

function ms2SpeedPerPowder(miningSpeedLevel) // 40 speed per level
{
    return 40/msPowder(miningSpeedLevel)
}

function professionalSpeedPerPowder(professionalLevel) // 5 speed per level
{
    return 5/profPowder(professionalLevel)
}

function msPowder(miningSpeedLevel)
{
    return Math.floor(Math.pow(miningSpeedLevel+1, 3.2))
}

function profPowder(professionalLevel)
{
    return Math.floor(Math.pow(professionalLevel+1, 2.3))
}