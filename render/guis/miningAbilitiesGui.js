import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { capitalizeFirst, dwarvenChecker, endChecker, hollowsChecker, isPlayerHoldingDrill, Title } from "../../util/helperFunctions"
import { BaseGui } from "../BaseGui"
import constants from "../../util/constants"

//initializes ability from data  
activeAbilities = undefined
addAbility(constants.data.currentAbility, 0) 
const miningAbilitiesGui = new BaseGui(["abilityGui", "miningabilities"], () => {
    if(!checkAreas() || constants.data.currentAbility == "") // had to add currentAbility check otherwise on first time timer would just say 0 forever and give errors etc
           
        return
        
        let leftValues = [],
        rightValues = []
    
        leftValues.push(`&e${activeAbilities.name} CD`)
        rightValues.push(activeAbilities.timer + "s")
    

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
 
function checkAreas()
{
    if(dwarvenChecker.check() || hollowsChecker.check() || endChecker.check()) return true
    return false
}

registerGui(miningAbilitiesGui)

register("step", () => {
    if (constants.data.currentAbility != ""){// had to add currentAbility check otherwise on first time timer would just say 0 forever and give errors etc
        if(activeAbilities.timer > 0)
            activeAbilities.timer -= 1
        else if (activeAbilities.title.drawState == 0 && settings.miningAbilities && constants.data.miningAbilities != "z")
            activeAbilities.title.draw()
    }
    
}).setDelay(1)
 

//gets skymall and saves it to data could be used for other things also but mainly just doing for 20% cooldown reduction thing
register("chat", (Skymall) => {
    switch (Skymall){
        case "-20% Pickaxe Ability cooldowns":
        constants.data.currentSkymall = Skymall
        constants.data.save()
        break
        case "Gain +100⸕ Mining Speed":
        constants.data.currentSkymall = Skymall
        constants.data.save()
        break
        case "Gain +50☘ Mining Fortune":
        constants.data.currentSkymall = Skymall
        constants.data.save()
        break
        case "Gain +15% more Powder while mining":
        constants.data.currentSkymall = Skymall
        constants.data.save()
        break
        case "Gain 5x Titanium drops":
        constants.data.currentSkymall = Skymall
        constants.data.save()
        break
        case "10x chance to find Golden and Diamond Goblins":
        constants.data.currentSkymall = Skymall
        constants.data.save()
        break
    }
}).setCriteria(/New buff: (.*?)\.$/g)

//gets ability through you used your {ability name} message
register("chat", (abilityName) =>{
    //sets timer to 0 otherwise timer becomes undefined cause javascript is awsome and idc enough to fix it properly
    constants.data.currentAbility = abilityName
    constants.data.save()
    addAbility(abilityName, 0)
}).setCriteria(/&r&aYou used your &r&6([a-zA-Z ]+) &r&aPickaxe Ability!&r/g)

//gets ability through hotm selection
register("chat", (abilityName) =>{
    constants.data.currentAbility = abilityName
    constants.data.save()
    addAbility(abilityName)
}).setCriteria(/&r&aYou selected &r&e([a-zA-Z ]+) &r&aas your Pickaxe Ability. This ability will apply to all of your pickaxes!&r/g)

//gets ability name through "{ability} is now available" message
register("chat", (abilityName) => {
    constants.data.currentAbility = abilityName
    constants.data.save()
}).setCriteria(/&r&a&r&6([a-zA-Z ]+) &r&ais now available!&r/g)

//gets cooldown from chat cause sometimes its more accurate
register("chat", (cooldown) =>{
    if (constants.data.currentAbility != ""){
    addAbility(constants.data.currentAbility, cooldown)
}
}).setCriteria(/&r&cYour pickaxe ability is on cooldown for ([0-9]+)s.&r/g)

function addAbility(abilityName, timer = 0)
{
    let found = false
    let maxTimer

    //Gives Ability base cooldown
    //pickobulus is a little innacurate cause for some reason its the only ability where the cooldown is effected by blegg so this just assumes no  blegg
    if (constants.data.currentAbility == "Pickobulus"){
        maxTimer = 50
    }
    else {
        maxTimer = 120
    }

    //checks for active pet for bal
    if (constants.data.currentPet == "bal"){
        Bal = true
    }else {
        Bal = false
    }

    //checks if skymall has cooldown reduction
    if (constants.data.currentSkymall == "Reduce Pickaxe Ability cooldown by 20%"){
        Skymall = true
    } else{
        Skymall = false
    }
    //print(timer)
    //if the timer has finished set the new timer based on buffs
    if (timer <= 0) {
        let multiplier = 1
        
        //if only perf tank 10% reduction
        if (settings.PerfectFuelTank) multiplier *= 0.9

        //if only bal tank 10% reduction
        if (Bal) multiplier *= 0.9

        //if only skymall tank 20% reduction
        if (Skymall) multiplier *= 0.8
    
        //if all buffs ~35% reduction
        if (settings.PerfectFuelTank && Bal && Skymall) multiplier = 0.648

        //if Skymall + other 28% reduction
        else if ((settings.PerfectFuelTank && Skymall) || (Bal && Skymall)) multiplier = .72

        //if tank + Bal 19% reduction
        else if (settings.PerfectFuelTank && Bal) multiplier = 0.81        
        timer = Math.round(maxTimer * multiplier)
    }
    
    
    //if ability is swapped change the name of the ability on the gui
    if (activeAbilities != undefined && abilityName != activeAbilities.name){
            found = true
            activeAbilities.name = abilityName
            activeAbilities.title = new Title({text: `&6[&3&kd&6] &b&l${abilityName}&6 [&3&kd&6]`})
            //timer = activeAbilities.timer
    }

    //if this is first check apply default attributes and create object
    if (!found)
    {
        //print(object)
        let object = {timer, name: abilityName, title: new Title({text: `&6[&3&kd&6] &b&l${abilityName}&6 [&3&kd&6]`})}
        activeAbilities = (object)
        drawTimestamp = timer
        activeAbilities.title.drawState = 0
        activeAbilities.timer = timer
        //print(activeAbilities.timer)
    }
    
    
}