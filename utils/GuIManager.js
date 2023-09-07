let guis = []
let guiNames = []

export const registerGui = (gui) => {
    guis.push(gui)
    guiNames.push(gui.aliases[0])
}

export default guis