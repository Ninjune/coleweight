import settings from "../settings";
import constants from "../util/constants";

let quickswitchActive = false;
let firstIteration = true;
let abilities = []
let page = 0;
let nextAbility = 0;
let clickedAbility = false
register("guiMouseClick", (x, y, button, gui, event) => {
    if(!quickswitchActive)
        return;
    const inventory = Player.getContainer();
    if(!isHotmMenu(inventory))
        return;
    //ChatLib.chat(page + " " + nextAbility)
    event.setCanceled(true)
    if(firstIteration)
    {
        const items = inventory.getItems();
        for(let i = 0; i < items.length; i++)
        {
            let item = items[i];
            if(item != undefined && item.getUnlocalizedName() == "tile.blockEmerald")
            {
                abilities.push({page: page, slot: i})
                if(settings.debug)
                    console.log("page: " + page + " slot: " + i)
            }
        }

        if(page == 0)
        {
            click(8, false, "RIGHT");
            page++
        }
        else
        {
            firstIteration = false;
            ChatLib.chat(`${constants.PREFIX}&bSuccessfully recorded available abilities!`)
            Client.currentGui.close()
        }
    }
    else
    {
        let ability = abilities[nextAbility];
        if(!clickedAbility && ability.page == page)
        {
            click(ability.slot, false, "LEFT")
            clickedAbility = true;
            nextAbility = (nextAbility+1) % abilities.length
        }
        else if (!clickedAbility && page < 1)
        {
            click(8, false, "RIGHT");
            page++
        }
        else
            Client.currentGui.close()
    }
    
})


register("chat", () => {
    resetAbilities()
}).setChatCriteria("Reset your Heart of the Mountain! Your Perks and Abilities have been reset.")


register("guiClosed", (gui) => {
    if(Player.getContainer().getName() != "container") // closed menu
        return;
    page = 0;
    clickedAbility = false;
    quickswitchActive = false;
})


register("step", () => {
    //ChatLib.chat()
}).setFps(4)

export function quickswitch()
{
    quickswitchActive = true;
    ChatLib.command("hotm")
}


export function resetAbilities()
{
    abilities = [];
    firstIteration = true;
    page = 0;
    nextAbility = 0;
    quickswitchActive = false;
}


/**
 * 
 * @param {Inventory} inventory 
 * @returns 
 */
function isHotmMenu(inventory)
{
    return inventory?.getName() != undefined &&
        inventory.getName().includes("Heart of the Mountain")
}

function click(slot, shift, clickType)
{
    Player.getContainer().click(slot, shift, clickType);
}

/*register("guiOpened", (event) => {
    if(!justChanged)
        checkGui = true;
})*/


/*register("postGuiRender", (x, y, gui) => {
    if(!checkGui)
        return;
    checkGui = false;
    const inventory = Player.getContainer()

    if(inventory?.getName() == undefined ||
        !inventory.getName().includes("Heart of the Mountain")
    )
        return;
    const oldHotmMenu = gui.field_147002_h;
    Player.getContainer().click(8, false, "RIGHT");
    for(let i = 0; i < oldHotmMenu.field_75151_b.length; i++) // inventorySlots
    {
        slot = oldHotmMenu.field_75151_b[i]; // inventorySlots
        if(!slot.func_75216_d()) // getHasStack()
            continue;
        let itemStack = slot.func_75211_c(); // getStack()
        if(itemStack.func_77973_b().func_77658_a() == "tile.blockEmerald" && !itemStack.func_77948_v()) //getItem()->getUnlocalizedName
        {
            //oldHotmMenu.func_75144_a(i, 0, 0, Player.getPlayer()) // slotClick
            //oldHotmMenu.func_75142_b(); // 	detectAndSendChanges()
            Player.getContainer().click(i, false, "MIDDLE");
            ChatLib.chat("click " + i)
            justChanged = true;
            Client.scheduleTask(10, () => {
                justChanged = false
            });
        }
    }
    
       
    // putStackInSlot()
    //Client.currentGui.close();
})*/