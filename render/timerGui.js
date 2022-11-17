import settings from "../settings";
import constants from "../util/constants";


const timerMove = new Gui(),
 timerGui = new Display()

timerGui.setBackgroundColor(Renderer.color(0, 0, 0, 50));
timerGui.setBackground("full");

export function openTimerGui()
{
    timerMove.open()
}

register("dragged", (dx, dy, x, y) => {
    if (!timerMove.isOpen()) return
    constants.timerdata.x = x
    constants.timerdata.y = y
    constants.timerdata.save()
});

register("renderOverlay", () => {
    timerGui.setShouldRender(false)
    timerGui.clearLines()
    timerGui.setRenderLoc(constants.timerdata.x, constants.timerdata.y)
    
    if (timerMove.isOpen())
    {
        let txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        timerGui.addLines([`&aTimer: &b0h 0m`])
        timerGui.setShouldRender(true)
        return
    }

    if(!settings.timerVisible) return
    timerGui.setShouldRender(true)
    let timerHr = Math.floor(constants.timerdata.timer/60/60)
    

    if(timerHr >= 1)
        timerGui.addLine(`&aTimer: &b${timerHr}h ${Math.floor(constants.timerdata.timer/60) - timerHr*60}m`)
    else
        timerGui.addLine(`&aTimer: &b${Math.floor(constants.timerdata.timer/60)}m ${Math.floor(constants.timerdata.timer%60)}s`)
})

register('worldLoad', () => {
    constants.timerdata.timer = 0
})

register("step", () => {
    constants.timerdata.timer += 1
}).setFps(1)