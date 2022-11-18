import settings from "../settings";
import constants from "../util/constants";


const timerGui = new Gui()

export function openTimerGui()
{
    timerGui.open()
}

register("dragged", (dx, dy, x, y) => {
    if (!timerGui.isOpen()) return
    constants.timerdata.x = x
    constants.timerdata.y = y
    constants.timerdata.save()
});

register("renderOverlay", () => {
    if (timerGui.isOpen()) 
    {
        let txt = "Drag to move."
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }
    if (!settings.timerVisible) return
    
    let timerHr = Math.floor(constants.timerdata.timer/60/60), message

    if(timerHr >= 1)
        message = `&aTimer: &b${timerHr}h ${Math.floor(constants.timerdata.timer/60) - timerHr*60}m`
    else
        message = `&aTimer: &b${Math.floor(constants.timerdata.timer/60)}m ${Math.floor(constants.timerdata.timer%60)}s`
    
    Renderer.drawStringWithShadow(message, constants.timerdata.x, constants.timerdata.y)
})

register('worldLoad', () => {
    constants.timerdata.timer = 0
})

register("step", () => {
    constants.timerdata.timer += 1
}).setFps(1)