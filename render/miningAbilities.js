import settings from "../settings"
import constants from "../util/constants"
import { capitalizeFirst, checkInDwarven, checkInEnd, checkInHollows, Title, textGui } from "../util/helperFunctions"

const miningAbilitiesGui = new textGui()
let activeAbilities = [],
 selectedAbility


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


function checkAreas()
{
    if(checkInDwarven() || checkInHollows() || checkInEnd()) return true
    return false
}


register("renderOverlay", () => {
    if(!settings.miningAbilities || !checkAreas()) return
    activeAbilities.forEach(ability => {
        if(ability.title.drawState == 1)
            ability.title.draw()
    })
})


register("renderOverlay", () => {
    if(!settings.miningAbilitiesGui || !checkAreas()) return
    let leftValues = [],
     rightValues = []

    activeAbilities.forEach(ability => {
        if(settings.miningAbilitiesSelectedIndicator && ability.name == selectedAbility)
            leftValues.push(`&e${ability.name} CD`)
        else
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
        else if (ability.title.drawState == 0)
            ability.title.drawState = 1
    })
}).setDelay(1)


register("chat", (abilityName, event) => {
    selectedAbility = capitalizeFirst(abilityName)
    addAbility(abilityName)
}).setCriteria(/&r&aYou used your &r&6(.+) &r&aPickaxe Ability!&r/g)


register("worldLoad", () => {
    activeAbilities.forEach(ability => {
        ability.timer = ability.maxTimer/2
    })
})


register("chat", (abilityName, event) => {
    selectedAbility = capitalizeFirst(abilityName)
}).setCriteria(/&r&aYou selected &r&e(.+) &r&aas your Pickaxe Ability. This ability will apply to all of your pickaxes!&r/g)


register("chat", (cdSeconds, event) => {
    if(selectedAbility == undefined) return
    addAbility(selectedAbility, cdSeconds)
}).setCriteria(/&r&cThis ability is on cooldown for (.+)s.&r/g)


function addAbility(abilityName, timer = 0)
{
    let found = false
    let maxTimer

    switch(capitalizeFirst(abilityName))
    {
        case "Pickobulus":
            if(timer <= 0)
                timer = 110
            maxTimer = 110
            break
        case "Vein seeker":
            if(timer <= 0)
                timer = 60
            maxTimer = 60
            break
        default:
            if(timer <= 0)
                timer = 120
            maxTimer = 120
    }

    activeAbilities.forEach(ability => {
        if(ability.name == capitalizeFirst(abilityName))
        {
            found = true
            drawTimestamp = undefined
            ability.title.drawState = 0
            ability.timer = timer
        }
    })

    if (!found)
    {
        let object = {timer, name: capitalizeFirst(abilityName), title: new Title(`&6[&3&kd&6] &b&l${capitalizeFirst(abilityName)}&6 [&3&kd&6]`), maxTimer}

        activeAbilities.push(object)
    }
}