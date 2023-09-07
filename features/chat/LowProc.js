import settings from "../../settings"

register("chat", (type, number) => {
    if(settings.lowProc == "") return

    lowProcs = settings.lowProc.split(',')
    number = parseInt(number)

    lowProcs.forEach(proc => {
        proc = parseInt(proc)

        // future doc issue
        //if(constants.isFiesta)
        //    proc *= 2
        
        if( (number <= 24 && number == proc) || (number > 24 && number % proc == 0))
            return World.playSound(settings.lowProcSound, parseFloat(settings.lowProcVolume), parseFloat(settings.lowProcPitch))
    })
}).setCriteria(/^PRISTINE! You found [\W] Flawed ([\w]+) Gemstone x([\d]+)!$/)