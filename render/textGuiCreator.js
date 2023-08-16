export function createGui(guiObject, x, y) 
// format: { leftValues: [], rightValues: [] } (must have same amount of each or error).
{
    let string = ""
    guiObject.leftValues.forEach((leftValue, index) => {
        if(leftValue == "Uptime")
        {
            let uptime = guiObject.rightValues[index],
             uptimeHr = Math.floor(uptime/60/60)
            
            if(uptimeHr >= 1)
                string += `&aUptime: &b${uptimeHr}h ${Math.floor(uptime/60) - uptimeHr*60}m\n`
            else
                string += `&aUptime: &b${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s\n`
        }
        else
            string += `&a${leftValue}: &b${guiObject.rightValues[index]}\n`
    })
    Renderer.drawStringWithShadow(string, x, y)
}