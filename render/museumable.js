/*import constants from "../util/constants"
import axios from "../../axios"
let itemData = []

register("step", () => {
    let inventoryName = Player?.getOpenedInventory()?.getName()?.toString()
    let added = false
    if(!inventoryName.includes("Museum")) return
    for (i = 0; i < Player.getOpenedInventory().getSize()-36; i++) {
        console.dir(Player.getOpenedInventory().getStackInSlot(i)?.getNBT())
        let extraAttributes = Player.getOpenedInventory().getStackInSlot(i)?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")
        if(extraAttributes?.getString("id") == undefined || extraAttributes.getString("id") == "")
        {
            //if(itemData.some(item => item.name == ))
        }
        //added = true
        //console.log(extraAttributes?.getString("id"))
        /*if(!constants.data.museumable.includes(extraAttributes?.getString("id")))
            constants.data.museumable.push(extraAttributes?.getString("id"))
        constants.data.save()
    }
    if(added)
        console.log("\n")
}).setFps(2)


register("gameLoad", () => {
    axios.get("https://api.hypixel.net/resources/skyblock/items")
    .then(res => {
        if(res.data.success)
            itemData = res.data.items
    })
})
/*
store item data as constant
compare green dye item name to constant items
if has id add id to museumable
structure of owned item below.

{id:"minecraft:dye",Count:1b,tag:{overrideMeta:1b,display:{Lore:[0:"§7Damage: §c+50",1:"§7Strength: §c+20",2:" §8[§7✎§8]",3:"",4:"§bArachno I",5:"§7Grants §c+3% §c❁ Damage",6:"§c§7against §aspiders§7.",7:"§bMana Steal I",8:"§7Regain §b0.2% of your max mana",9:"§bevery time you hit a mob.",10:"",11:"§6Ability: Fire Freeze §e§lRIGHT CLICK",12:"§7Creates a circle with a radius",13:"§7of §a5 blocks§7. After §a5s§7,",14:"§7all mobs inside are frozen for",15:"§7§a10s§7.",16:"§8Mana Cost: §3500",17:"§8Cooldown: §a10s",18:"",19:"§7§8This item can be reforged!",20:"§8§l* §8Co-op Soulbound §8§l*",21:"§5§lEPIC SWORD",22:"§8§m-----------------",23:"§7Item Donated",24:"§bFebruary 8, 2023",25:"",26:"§7Item Created",27:"§aDecember 18, 2022",28:"  §614,702nd §7created",29:"",30:"§7Item Clean Value",31:"§6668,650 Coins",32:"",33:"§7Item Value",34:"§6707,198 Coins",35:"§8§m-----------------",36:"§7You have retrieved this from",37:"§7your Museum but can add it back",38:"§7at any time.",39:"",40:"§7Click on this item in your",41:"§7inventory to add it to your",42:"§7§9Museum§7!"],Name:"§5Fire Freeze Staff"},AttributeModifiers:[]},Damage:10s} {
 getClass: [object Function(0)],
 getByte: [object Function(0)],
 setInteger: [object Function(0)],
 getInteger: [object Function(0)],
 setShort: [object Function(0)],
 integer: undefined,
 getKeySet: [object Function(0)],
 float: undefined,
 setDouble: [object Function(0)],
 NBTBase: undefined,
 removeTag: [object Function(0)],
 tagMap: {id="minecraft:dye", Count=1b, tag={overrideMeta:1b,display:{Lore:[0:"§7Damage: §c+50",1:"§7Strength: §c+20",2:" §8[§7✎§8]",3:"",4:"§bArachno I",5:"§7Grants §c+3% §c❁ Damage",6:"§c§7against §aspiders§7.",7:"§bMana Steal I",8:"§7Regain §b0.2% of your max mana",9:"§bevery time you hit a mob.",10:"",11:"§6Ability: Fire Freeze §e§lRIGHT CLICK",12:"§7Creates a circle with a radius",13:"§7of §a5 blocks§7. After §a5s§7,",14:"§7all mobs inside are frozen for",15:"§7§a10s§7.",16:"§8Mana Cost: §3500",17:"§8Cooldown: §a10s",18:"",19:"§7§8This item can be reforged!",20:"§8§l* §8Co-op Soulbound §8§l*",21:"§5§lEPIC SWORD",22:"§8§m-----------------",23:"§7Item Donated",24:"§bFebruary 8, 2023",25:"",26:"§7Item Created",27:"§aDecember 18, 2022",28:"  §614,702nd §7created",29:"",30:"§7Item Clean Value",31:"§6668,650 Coins",32:"",33:"§7Item Value",34:"§6707,198 Coins",35:"§8§m-----------------",36:"§7You have retrieved this from",37:"§7your Museum but can add it back",38:"§7at any time.",39:"",40:"§7Click on this item in your",41:"§7inventory to add it to your",42:"§7§9Museum§7!"],Name:"§5Fire Freeze Staff"},AttributeModifiers:[]}, Damage=10s},
 id: 10,
 tag: undefined,
 byte: undefined,
 double: undefined,
 byteArray: undefined,
 intArray: undefined,
 setLong: [object Function(0)],
 setString: [object Function(0)],
 getTagId: [object Function(0)],
 setByteArray: [object Function(0)],
 setIntArray: [object Function(0)],
 setByte: [object Function(0)],
 wait: [object Function(0)],
 getRawNBT: [object Function(0)],
 getCompoundTag: [object Function(0)],
 string: undefined,
 tagId: undefined,
 notifyAll: [object Function(0)],
 getTagMap: [object Function(0)],
 compoundTag: undefined,
 getDouble: [object Function(0)],
 getId: [object Function(0)],
 getFloat: [object Function(0)],
 notify: [object Function(0)],
 long: undefined,
 hashCode: [object Function(0)],
 get: [object Function(0)],
 getTagList: [object Function(0)],
 hasTags: [object Function(0)],
 getBoolean: [object Function(0)],
 toObject: [object Function(0)],
 copy: [object Function(0)],
 hasNoTags: [object Function(0)],
 class: class com.chattriggers.ctjs.minecraft.wrappers.inventory.nbt.NBTTagCompound,
 keySet: [id, Count, tag, Damage],
 setFloat: [object Function(0)],
 set: [object Function(0)],
 setNBTBase: [object Function(0)],
 getShort: [object Function(0)],
 getString: [object Function(0)],
 getTag: [object Function(0)],
 rawNBT: {id:"minecraft:dye",Count:1b,tag:{overrideMeta:1b,display:{Lore:[0:"§7Damage: §c+50",1:"§7Strength: §c+20",2:" §8[§7✎§8]",3:"",4:"§bArachno I",5:"§7Grants §c+3% §c❁ Damage",6:"§c§7against §aspiders§7.",7:"§bMana Steal I",8:"§7Regain §b0.2% of your max mana",9:"§bevery time you hit a mob.",10:"",11:"§6Ability: Fire Freeze §e§lRIGHT CLICK",12:"§7Creates a circle with a radius",13:"§7of §a5 blocks§7. After §a5s§7,",14:"§7all mobs inside are frozen for",15:"§7§a10s§7.",16:"§8Mana Cost: §3500",17:"§8Cooldown: §a10s",18:"",19:"§7§8This item can be reforged!",20:"§8§l* §8Co-op Soulbound §8§l*",21:"§5§lEPIC SWORD",22:"§8§m-----------------",23:"§7Item Donated",24:"§bFebruary 8, 2023",25:"",26:"§7Item Created",27:"§aDecember 18, 2022",28:"  §614,702nd §7created",29:"",30:"§7Item Clean Value",31:"§6668,650 Coins",32:"",33:"§7Item Value",34:"§6707,198 Coins",35:"§8§m-----------------",36:"§7You have retrieved this from",37:"§7your Museum but can add it back",38:"§7at any time.",39:"",40:"§7Click on this item in your",41:"§7inventory to add it to your",42:"§7§9Museum§7!"],Name:"§5Fire Freeze Staff"},AttributeModifiers:[]},Damage:10s},
 getLong: [object Function(0)],
 tagList: undefined,
 boolean: undefined,
 equals: [object Function(0)],
 getByteArray: [object Function(0)],
 short: undefined,
 toString: [object Function(0)],
 getIntArray: [object Function(0)],
 setBoolean: [object Function(0)]
}
*/