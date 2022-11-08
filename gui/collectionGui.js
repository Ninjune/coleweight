/*import constants from "../util/constants"
const PREFIX = constants.PREFIX

let collectionGui = new Gui(),
 collection = ""

export function trackCollection(arg)
{
    switch(arg)
    {
        case "obby":
        case "obsidian":
            collection = "OBSIDIAN"
            break
        default:
            ChatLib.chat(`${PREFIX}&eThat is not a valid collection! (or is not supported)`)
    }
}

export function moveCollection()
{
    collectionGui.open()
}

register("dragged", (dx, dy, x, y) => {
    if (!collectionGui.isOpen()) return
    constants.data.collectionX = x
    constants.data.collectionY = y
    constants.data.save()
})

register("renderOverlay", () => {
    if (cwGui.isOpen()) 
    {
        let txt = "Please set your api key with /cw setkey (key)!"
        if (constants.data.api_key != undefined)
            txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
        Renderer.drawStringWithShadow(`&aCollection: &b0\n&aCW/hr: &b0\n&aUptime: &b0m\n&aColeweight Gained: &b0`, constants.data.collectionX, constants.data.collectionY)
    }
    if(collection == "") return
    coleweight > 1000 ?collectionMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`: coleweightMessage = `&b${coleweight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
})*/