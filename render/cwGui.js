import settings from "../settings";
import constants from "../util/constants";

const cwMove = new Gui(),
 cwGui = new Display()

cwGui.setBackgroundColor(Renderer.color(0, 0, 0, 75));
cwGui.setBackground("full");
cwGui.setMinWidth(100)

export function openCwGui()
{
    cwMove.open()
}


register("dragged", (dx, dy, x, y) => {
    if (!cwMove.isOpen()) return
    constants.data.x = x
    constants.data.y = y
    constants.data.save()
});

register("renderOverlay", () => {
    cwGui.setShouldRender(false)
    cwGui.clearLines()
    cwGui.setRenderLoc(constants.data.x, constants.data.y)
    
    if (cwMove.isOpen()) 
    {
        let txt = "Please set your api key with /cw setkey (key)!"
        if (constants.data.api_key != undefined)
            txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        cwGui.addLines([`&aCW: &b0`, `&aCW/hr: &b0`, `&aUptime: &b69h 420m `, `&aColeweight Gained: &b0     `])
        cwGui.setShouldRender(true)
    }

    if(!settings.cwToggle || constants.data.api_key == undefined) return
    let coleweight = constants.data.coleweight || 0,
     coleweightMessage = "",
     uptimeHr = Math.floor(constants.uptime/60/60)
    
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
    
    if (cwMove.isOpen() || !constants.upTimeTrack) return

    cwGui.setShouldRender(true)

    if(uptimeHr >= 1)
        cwGui.addLines([`&aCW: &b${coleweightMessage}`, `&aCW/hr: &b${constants.coleweightHr}`, `&aUptime: &b${uptimeHr}h ${Math.floor(constants.uptime/60) - uptimeHr*60}m`, `&aColeweight Gained: &b${Math.ceil(constants.cwValuesSum*100) / 100}`])
    else
        cwGui.addLines([`&aCW: &b${coleweightMessage}`, `&aCW/hr: &b${constants.coleweightHr}`, `&aUptime: &b${Math.floor(constants.uptime/60)}m ${Math.floor(constants.uptime%60)}s`, `&aColeweight Gained: &b${Math.ceil(constants.cwValuesSum*100) / 100}`])
})