import settings from "../settings"
import constants from "../util/constants"
import { capitalizeFirst, checkInDwarven, checkInEnd, checkInHollows, drawTitle, textGui } from "../util/helperFunctions"

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
        if(ability.drawTitle == 1)
        {
            let titleResults = drawTitle(`&6[&3&kd&6] &b&l${ability.name}&6 [&3&kd&6]`, ability.drawTimestamp)
            ability.drawTitle = titleResults.drawTitle
            ability.drawTimestamp = titleResults.drawTimestamp
        }
    })
})


register("renderOverlay", () => {
    if(!settings.miningAbilitiesGui || !checkAreas()) return
    let leftValues = [],
     rightValues = []

    activeAbilities.forEach(ability => {
        leftValues.push(`${ability.name} CD`)
        if(settings.miningAbilitiesSelectedIndicator && ability.name == selectedAbility)
            rightValues.push(ability.timer + "s &eSELECTED")
        else
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
    selectedAbility = abilityName
    addAbility(abilityName)
}).setCriteria(/&r&aYou used your &r&6(.+) &r&aPickaxe Ability!&r/g)


register("worldLoad", () => {
    activeAbilities.forEach(ability => {
        ability.timer = ability.maxTimer/2
    })
})


register("chat", (abilityName, event) => {
    selectedAbility = abilityName
}).setCriteria(/&r&aYou selected &r&e(.+) &r&aas your Pickaxe Ability. This ability will apply to all of your pickaxes!&r/g)


register("chat", (cdSeconds, event) => {
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
            ability.drawTitle = 0
            ability.timer = timer
        }
    })

    if (!found)
    {
        let object = {timer: timer, name: capitalizeFirst(abilityName), drawTitle: 0, drawTimestamp: undefined, maxTimer: maxTimer}

        activeAbilities.push(object)
    }
}