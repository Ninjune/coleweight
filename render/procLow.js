import settings from "../settings";
import constants from "../util/constants";

register("chat", (icon, type, number) => {
    if(settings.lowProc == "") return
    lowProcs = settings.lowProc.split(',')
    number = parseInt(number)

    lowProcs.forEach(proc => {
        proc = parseInt(proc)
        if(constants.isFiesta)
            proc *= 2
        
        if( (number <= 24 && number == proc) || (number > 24 && number % proc == 0))
            return World.playSound(settings.lowProcSound, parseFloat(settings.lowProcVolume), parseFloat(settings.lowProcPitch))
    })
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r(.+) Flawed (.+) Gemstone &r&8x(.+)&r&f!&r/g)