import settings from "../settings"
import constants from "../util/constants"
import { capitalizeFirst, checkInDwarven, checkInHollows, drawTitle, textGui } from "../util/helperFunctions"

const miningAbilitiesGui = new textGui()
let activeAbilities = []


export function openMiningAbilitiesGui()
{
    miningAbilitiesGui.moveGui()
}   


register("dragged", (dx, dy, x, y) => {
    if (!miningAbilitiesGui.moveGuiObject.isOpen()) return
    constants.abilitydata.x = x
    constants.abilitydata.y = y
    constants.abilitydata.save()
})


register("renderOverlay", () => {
    if(!(checkInDwarven() || checkInHollows()) || !settings.miningAbilities) return
    activeAbilities.forEach(ability => {
        if(ability.drawTitle == 1)
        {
            let titleResults = drawTitle(`&6[&3&kd&6] &b&l${ability.name}&6 [&3&kd&6]`, ability.drawTimestamp)
            ability.drawTitle = titleResults.drawTitle
            ability.drawTimestamp = titleResults.drawTimestamp
        }
    })
})

register("renderOverlay", () => {
    if(!(checkInDwarven() || checkInHollows()) || !settings.miningAbilitiesGui) return
    let leftValues = [],
     rightValues = []

    activeAbilities.forEach(ability => {
        leftValues.push(`${ability.name} CD`)
        rightValues.push(ability.timer + "s")
    })

    if(miningAbilitiesGui.moveGuiObject.isOpen() && leftValues.length < 1)
    {
        leftValues.push("Mining Speed Boost")
        rightValues.push("0")
    }

    miningAbilitiesGui.guiObject = {leftValues: leftValues, rightValues: rightValues}
    miningAbilitiesGui.x = constants.abilitydata.x
    miningAbilitiesGui.y = constants.abilitydata.y
    miningAbilitiesGui.alignment = settings.miningAbilitiesAlignment
    miningAbilitiesGui.renderGui()
})


register("step", () => {
    activeAbilities.forEach(ability => {
        if(ability.timer > 0)
            ability.timer -= 1
        else if (ability.drawTitle == 0)
            ability.drawTitle = 1
    })
}).setDelay(1)


register("chat", (abilityName, event) => {
    let found = false
    let timer

    switch(capitalizeFirst(abilityName))
    {
        case "Pickobulus":
            timer = 110
            break
        case "Vein seeker":
            timer = 60
            break
        default:
            timer = 120
    }

    activeAbilities.forEach(ability => {
        if(ability.name == capitalizeFirst(abilityName))
        {
            found = true
            drawTimestamp = undefined
            ability.drawTitle = 0
            ability.timer = timer
        }
    })

    if (!found)
    {
        let object = {timer: timer, name: capitalizeFirst(abilityName), drawTitle: 0, drawTimestamp: undefined}

        activeAbilities.push(object)
    }
}).setCriteria(/&r&aYou used your &r&6(.+) &r&aPickaxe Ability!&r/g)

register("worldLoad", () => {
    activeAbilities = []
})