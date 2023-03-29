/*import constants from "../util/constants"

let drillStrength = -1


export function updateDrillStrength()
{
    drillStrength = getStrength()
    ChatLib.chat(`${constants.PREFIX}&bSet drill strength to &a${drillStrength}!`)
}


register("renderOverlay", () => {
    if(drillStrength == -1) return
    let hasDrillStats = false
    if(getStrength() > drillStrength - 15 && getStrength() < drillStrength + 15)
        hasDrillStats = true
    Renderer.drawRect(hasDrillStats ? Renderer.GREEN : Renderer.RED, Renderer.screen.getWidth()/2-4, Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/28, 8, 8)
})


function getStrength()
{
    let tablist = TabList.getNames()
    let result = /§r Strength: §r§c❁([0-9]+)§r/g.exec(tablist)
    return result[1]
}*/