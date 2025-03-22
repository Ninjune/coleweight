import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { BaseGui } from "../BaseGui"
import constants from "../../util/constants"
import { Title } from "../../util/helperFunctions"
collectionTotal = 0;
collectionPerHour = 0;
timer = 0;
skymallDuringTest = [];
lastcheck = false
testover = true
const miningtestgui = new BaseGui(["miningtestgui"], () =>
{

    let timerHr = Math.floor(constants.data.miningtestgui.timer/60/60)

    if(timerHr >= 1)
            timer = `&aTimer: &b${timerHr}h ${Math.floor(constants.data.miningtestgui.timer/60) - timerHr*60}m`
    else
            timer = `&aTimer: &b${Math.floor(constants.data.miningtestgui.timer/60)}m ${Math.floor(constants.data.miningtestgui.timer%60)}s`
    message = `&a${constants.data.miningtestgui.collectionName}/h: &b${collectionPerHour} \n&a${constants.data.miningtestgui.collectionName} Gained: &b${collectionTotal} \n${timer}`

    return message
}, () => {return miningtestgui.isOpen() || settings.miningtestgui})
registerGui(miningtestgui)
const title = new Title({text: "&bTest Over"})

register("step", () => {
    
    if(constants.data.miningtestgui.timer > 0)
    {
        testover = false
        constants.data.miningtestgui.timer -= 1
        if (!skymallDuringTest.includes(constants.data.currentSkymall) ){skymallDuringTest.push(constants.data.currentSkymall)}
    }
    else if (constants.data.testTitlePlay)
    {
        title.draw()
        constants.data.testTitlePlay = false
        constants.data.save()
        lastcheck = true
    } 
    else if (!lastcheck && constants.data.miningtestgui.timer <= 0 && !testover){
        activepb = constants.pbs[constants.data.miningtestgui.collectionName]
        if (collectionPerHour > activepb){
            newpb=true 
            constants.pbs[constants.data.miningtestgui.collectionName] = collectionPerHour
            constants.pbs.save()
        }
        else
        {
        newpb=false
        }
        finalMessage(collectionPerHour,constants.data.miningtestgui.maxtimer,newpb,constants.data.miningtestgui.collectionName,skymallDuringTest)
        resetTest()
        
    }
}).setFps(1)

export function resetTest(){
    collectionTotal = 0;
    constants.data.skymallDuringTest = []
    constants.data.testTitlePlay = false
    constants.data.miningtestgui.timer = 0
    lastcheck = false
    testover = true
    constants.data.save()
}

export function trackCollection(collection)
{
    let collections = JSON.parse(FileLib.read("Coleweight", "data/collections.json"))
    if(collection == undefined) return ChatLib.chat(`${constants.PREFIX}&eThat is not a valid collection! (or is not supported)`)
    if(collection == "obby") collection = "obsidian"
    if(collection == "cobble") collection = "cobblestone"
    if(collections[collection.toLowerCase()] == undefined) return ChatLib.chat(`${constants.PREFIX}&eThat is not a valid collection! (or is not supported)`)
    constants.data.tracked.collectionEnchanted = collections[collection].collectionEnchanted
    constants.data.tracked.collectionName = collections[collection].collectionName
    constants.data.miningtestgui.collectionName = collections[collection].collectionName
    activepb = constants.pbs[collection]
    collection = collection
    collectionTotal = 0
    constants.data.save()
    
    ChatLib.chat(`${constants.PREFIX}&bSet collection to ${constants.data.tracked.collectionName}!`)
}

register('chat', (time, evn) => {
    time = parseInt(time);
    if (constants.data.miningtestgui.timer > 0 || lastcheck){
        
    
    const itemLog = evn.message.func_150253_a()[0].func_150256_b().func_150210_i().func_150702_b().func_150253_a();
    const items = new Map();
    // -1 = 'This message can be disabled in the settings.'
    for (let i = 0; i < itemLog.length - 1; i += 4) {
      // '  +23 '
      let amnt = itemLog[i].func_150261_e()
      amnt = Number(amnt.replace(/[,+]/g,''))

      // 'Blaze Rod'
      let name = itemLog[i+1].func_150261_e();
      items.set(name,amnt); 
    }
    enchantedColl = items.get(constants.data.tracked.collectionEnchanted)
    coll = items.get(constants.data.tracked.collectionName)
    if (enchantedColl != undefined){
        collectionTotal += enchantedColl * 160
    }
    if (coll != undefined){
        collectionTotal += coll
    }
    try {
        const removeditemlog = evn.message.func_150253_a()[3].func_150256_b().func_150210_i().func_150702_b().func_150253_a();
        const removeditems = new Map();
        for (let i = 0; i < removeditemlog.length - 1; i += 4) {
            // '  +23 '
            let amnt = removeditemlog[i].func_150261_e()
            amnt = Number(amnt.replace(',',''))
      
            // 'Blaze Rod'
            let name = removeditemlog[i+1].func_150261_e();
            removeditems.set(name,amnt); 
        }
        removedcoll = removeditems.get(constants.data.tracked.collectionName)
        if(removedcoll != undefined){collectionTotal += removedcoll} 
    } catch (error){}
    collectionPerHour = Math.floor(collectionTotal * (3600 / (constants.data.miningtestgui.maxtimer - constants.data.miningtestgui.timer)))
    lastcheck = false
}
}).setCriteria(/^&6\[Sacks\] &r&a\+[\d,]+&r&e items?&r&e(?:, &r&c-[\d,]+&r&e items?&r&e)?\.&r&8 \(Last (\d+)s\.\)&r$/);



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function finalMessage(collectionfromtest,testLength,newpb,collection,skymallsduringtest){
    collectionfromtest = numberWithCommas(collectionfromtest)
    line1 = '&3==============================================='
    line3 = ChatLib.getCenteredText(`&4${collection} Test Over!`)
    line4 = `&eTest Length: ${testLength}`
    line5 = `&2${collection} /h: &a${collectionfromtest}`
    if (constants.data.lobbyswaps > 1){
        line6 = `\n&dLobby swaps: ${constants.data.lobbyswaps}\n`
    } else {line6 = `\n\n`}
    
    if (skymallsduringtest[1] != undefined){
        line7 = `&bSkymall: \n&a${skymallsduringtest[0]}\n&a${skymallsduringtest[1]}`
    }else{line7 = `&bSkymall: \n&a${skymallsduringtest[0]}`}
    
    pb1 = ChatLib.getCenteredText(`&e************************`)
    pb2 = ChatLib.getCenteredText(`&e*      New Pb!      *`)
    pb3 = ChatLib.getCenteredText(`&e************************`)
    pb4 = ChatLib.getCenteredText(`&a${collectionfromtest} /h`)
    lineend = '&3==============================================='
    
    if (newpb){
        message = `\n${line1}\n\n${line3}\n\n${pb1}\n${pb2}\n${pb3}\n\n${pb4}\n${line4}${line6}${line7}\n\n${lineend}\n`
    }else{
        message = `\n${line1}\n\n${line3}\n\n${line5}${line6}${line7}\n\n${lineend}\n`
    }
    ChatLib.chat(message)
}


/*TODO:
get collection wanted to be checked :check:
sack tracker :check:
collection menu tracker
skill menu tracker 
actionbar tracker
finished test chat message 
pb's
lobby swap tracker
pre test checklist
*/ 