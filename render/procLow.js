import settings from "../settings";

register("chat", (icon, type, number) => {
    if(settings.lowProc == "") return
    lowProcs = settings.lowProc.split(',')

    lowProcs.forEach(proc => {
        if(parseInt(number) % parseInt(proc) == 0)
            return World.playSound(settings.lowProcSound, parseFloat(settings.lowProcVolume), parseFloat(settings.lowProcPitch))
    })
}).setChatCriteria(/&r&d&lPRISTINE! &r&fYou found &r(.+) &r&aFlawed (.+) Gemstone &r&8x(.+)&r&f!&r/g)