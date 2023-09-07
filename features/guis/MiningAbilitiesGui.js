import settings from "../../settings"
import { BaseGui } from "../../utils/BaseGui"
import { registerGui } from "../../utils/GuIManager"
import { Title } from "../../utils/Rendering"
import { capitalizeFirst, isInTab } from "../../utils/Utils"

const miningAbilitiesGui = new BaseGui(["abilityGui", "miningabilities"], () => {
    if(!miningAbilitiesGui.isOpen() && (!settings.miningAbilitiesGui || !checkAreas()))
        return
    let leftValues = [],
     rightValues = []

    activeAbilities.forEach(ability => {
        if(settings.miningAbilitiesSelectedIndicator && ability.name == selectedAbility)
            leftValues.push(`&e${ability.name} CD`)
        else
            leftValues.push(`${ability.name} CD`)
        rightValues.push(ability.timer + "s")
    })

    if(miningAbilitiesGui.isOpen() && leftValues.length < 1)
    {
        leftValues.push("Mining Speed Boost")
        rightValues.push("0")
    }
    let message = ""

    leftValues.forEach((value, i) => {
        message += "&a" + value + ": &b" + rightValues[i] + "\n"
    })

    return message
}, "miningAbilitiesGui", [
    register("step", () => {
        activeAbilities.forEach(ability => {
            if(ability.timer > 0)
                ability.timer -= 1
            else if (ability.title.drawState == 0 && settings.miningAbilities)
                ability.title.draw()
        })
    }).setDelay(1)
])

registerGui(miningAbilitiesGui)

let activeAbilities = []
let selectedAbility

function checkAreas(){
    return (isInTab("Dwarven Mines") || isInTab("The End") || isInTab("Crystal Hollows"))
}

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


function addAbility(abilityName, timer = 0){
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
        let object = {timer, name: capitalizeFirst(abilityName), title: new Title({text: `&6[&3&kd&6] &b&l${capitalizeFirst(abilityName)}&6 [&3&kd&6]`}), maxTimer}

        activeAbilities.push(object)
    }
}