export function addCommas(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (error) {
        return 0;
    }
}// credit to senither for the regex, just don't care to make my own lol


export function waypointRender(waypoints, yellow=false)
{
    if(waypoints.length < 1) return
    waypoints.forEach((waypoint) => {
        if(yellow)
            Tessellator.drawString(Math.floor((Math.abs(parseInt(Player.getX()) - waypoint[0]) + Math.abs(parseInt(Player.getY()) - waypoint[1]) + Math.abs(parseInt(Player.getZ()) - waypoint[2]))/3) + "m", waypoint[0], waypoint[1], waypoint[2], 0xFAFD01)
        else
            Tessellator.drawString(Math.floor((Math.abs(parseInt(Player.getX()) - waypoint[0]) + Math.abs(parseInt(Player.getY()) - waypoint[1]) + Math.abs(parseInt(Player.getZ()) - waypoint[2]))/3) + "m", waypoint[0], waypoint[1], waypoint[2])
    }) 
}


export class textGui // first class I've made, gonna be dog
// guiObject format: { leftValues: [], rightValues: [] } (must have same amount of each or error).
{
    constructor(guiObject, x, y)
    {
        this.guiObject = guiObject
        this.x = x
        this.y = y
    }


    renderGui()
    {
        let string = ""
        this.guiObject.leftValues.forEach((leftValue, index) => {
            if(leftValue == "Uptime")
            {
                let uptime = this.guiObject.rightValues[index],
                uptimeHr = Math.floor(uptime/60/60)
                
                if(uptimeHr >= 1)
                    string += `&aUptime: &b${uptimeHr}h ${Math.floor(uptime/60) - uptimeHr*60}m\n`
                else
                    string += `&aUptime: &b${Math.floor(uptime/60)}m ${Math.floor(uptime%60)}s\n`
            }
            else
                string += `&a${leftValue}: &b${this.guiObject.rightValues[index]}\n`
        })
        Renderer.drawStringWithShadow(string, this.x, this.y)    }
}