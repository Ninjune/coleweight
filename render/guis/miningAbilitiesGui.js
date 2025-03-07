import timer from "../../commands/timer"
import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { capitalizeFirst, dwarvenChecker, endChecker, hollowsChecker, isPlayerHoldingDrill, Title } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"

const miningAbilitiesGui = new BaseGui(["abilityGui", "miningabilities"], () => {
    if(!checkAreas())
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
}, () => { return miningAbilitiesGui.isOpen() || settings.miningAbilitiesGui})
let activeAbilities = [],
 selectedAbility

function checkAreas()
{
    if(dwarvenChecker.check() || hollowsChecker.check() || endChecker.check()) return true
    return false
}

registerGui(miningAbilitiesGui)

register("step", () => {
    activeAbilities.forEach(ability => {
        if(ability.timer > 0)
            ability.timer -= 1
        else if (ability.title.drawState == 0 && settings.miningAbilities)
            ability.title.draw()
    })
}).setDelay(1)
 
/* old nonjune code that was broken
register("chat", (abilityName, event) => {
    selectedAbility = capitalizeFirst(abilityName)
    addAbility(abilityName)
}).setCriteria(/&r&aYou used your &r&6(.+) &r&aPickaxe Ability!&r/g)


register("chat", (abilityName, event) => {
    selectedAbility = capitalizeFirst(abilityName)
}).setCriteria(/&r&aYou selected &r&e(.+) &r&aas your Pickaxe Ability. This ability will apply to all of your pickaxes!&r/g)


register("chat", (cdSeconds, event) => {
    if(selectedAbility == undefined || !isPlayerHoldingDrill()) return
    addAbility(selectedAbility, cdSeconds)
}).setCriteria(/&r&cThis ability is on cooldown for (.+)s.&r/g)
*/

//New Goat coolguy chad vinxey code
Bal = false //defaults Bal to false cause i couldnt figure out how to make it check tablist
register("chat", (message) => {
    message = ChatLib.removeFormatting(message)
    //checks if Bal is equipped through auto pet
    if (message.includes("Autopet equipped your ") && !message.includes("Bal")){
        return Bal = false
    }
    if (message.includes("Autopet equipped your [Lvl 100] Bal")){
        return Bal = true
    }

    //gets ability name through "{abilityname} is now available! message"
    if (message.includes("is now available!")){
        selectedAbility = message.split(" is now available!")[0]
    }
    //gets ability on ability use through "You used your {Abilityname} Pickaxe Ability!" messagee
    if (message.includes("You used your")){
        selectedAbility = message.split("You used your ")[1].split(" Pickaxe Ability!")[0]
        addAbility(selectedAbility)
    }
    // Gets cooldown based on "Your pickaxe ability is on cooldown for {time}" message if we already know what ur ability is
    if (message.includes("Your pickaxe ability is on cooldown for") && selectedAbility != undefined){
        timer = Number(message.split("Your pickaxe ability is on cooldown for ")[1].split("s.")[0])
        addAbility(selectedAbility, timer)
    }
    // gets ability from when you select it in hotm menu
    if (message.includes(" as your Pickaxe Ability. This ability will apply to all of your pickaxes!")){
        selectedAbility = message.split(" as your Pickaxe Ability. This ability will apply to all of your pickaxes!")[0].split("You selected ")[1]
        addAbility(selectedAbility)
    }

}).setCriteria("${message}")

function addAbility(abilityName, timer = 0)
{
    /* Old Nonjunecode not needed anymore as there is only 1 ability with a time diffrent than 120
    switch(capitalizeFirst(abilityName))
    {
        case "Pickobulus":
            maxTimer = 60
            break    
        default:
            maxTimer = 120
    }*/


   //Gives Ability base cooldown
    let found = false
    let maxTimer

    if (abilityName == "Pickobulus"){
        maxTimer = 60
    }
    else {
        maxTimer = 120
    }

    //if the timer has finished set the new timer based on buffs
    if(timer <= 0)
        //if you only have perf tank
        if (settings.PerfectFuelTank && !Bal){
            timer = (maxTimer*.9)
        }
        //if you only have Bal
        else if (!settings.PerfectFuelTank && Bal){
            timer = (maxTimer*.9)
        }
        //if you have both Bal and perf tank
        else if (settings.PerfectFuelTank && Bal){
            timer = (maxTimer*.8)
            
        }
        //if you have neither
        else {
            timer = maxTimer
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