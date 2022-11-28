export function waypointRender(waypoints)
{
    if(waypoints.length < 1) return
    waypoints.forEach((waypoint) => {
        Tessellator.drawString(Math.floor((Math.abs(parseInt(Player.getX()) - waypoint[0]) + Math.abs(parseInt(Player.getY()) - waypoint[1]) + Math.abs(parseInt(Player.getZ()) - waypoint[2]))/3) + "m", waypoint[0], waypoint[1], waypoint[2])
    }) 
}