import constants from "../util/constants";

let cwGui = new Gui()

export function openCwGui()
{
    cwGui.open()
}


register("dragged", (dx, dy, x, y) => {
    if (!cwGui.isOpen()) return
    constants.data.x = x
    constants.data.y = y
    constants.data.save()
});

register("renderOverlay", () => {
    if (cwGui.isOpen()) 
    {
        let txt = "Please set your api key with /cw setkey (key)!"
        if (constants.data.api_key != undefined)
            txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        Renderer.drawStringWithShadow(`&aCW: &b0\n&aCW/hr: &b0\n&aUptime: &b0m\n&aColeweight Gained: &b0`, constants.data.x, constants.data.y)
    }
    if(!constants.data.cwToggle || constants.data.api_key == undefined) return
    let coleweight = constants.data.coleweight || 0,
     coleweightMessage = ""

    coleweight > 1000 ?coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    if(constants.cwValues[0] != undefined && constants.upTimeTrack && constants.calcCwPerHr)
    {
        constants.cwValuesSum = 0
        for(let i = 0; i < constants.cwValues.length; i++)
        {
            constants.cwValuesSum += constants.cwValues[i]
        }
        let eq = Math.ceil((constants.cwValuesSum*(3600/constants.uptime)) * 100) / 100
        eq != Infinity ? constants.coleweightHr = eq : constants.coleweightHr = "Calculating..."
        constants.calcCwPerHr = false
    }
    
    if (cwGui.isOpen() || !constants.upTimeTrack) return
    let uptimeHr = Math.floor(constants.uptime/60/60)
    if(uptimeHr >= 1)
        Renderer.drawStringWithShadow(`&aCW: &b${coleweightMessage}\n&aCW/hr: &b${constants.coleweightHr}\n&aUptime: &b${uptimeHr}h ${Math.floor(constants.uptime/60) - uptimeHr*60}m\n&aColeweight Gained: &b${Math.ceil(constants.cwValuesSum*100) / 100}`, constants.data.x, constants.data.y)
    else
        Renderer.drawStringWithShadow(`&aCW: &b${coleweightMessage}\n&aCW/hr: &b${constants.coleweightHr}\n&aUptime: &b${Math.floor(constants.uptime/60)}m ${Math.floor(constants.uptime%60)}s\n&aColeweight Gained: &b${Math.ceil(constants.cwValuesSum*100) / 100}`, constants.data.x, constants.data.y)
})