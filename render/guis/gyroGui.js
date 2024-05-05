import { registerGui } from "../../guiManager"
import settings from "../../settings"
import { BaseGui } from "../BaseGui"
let gyroPlayers = []
const GYRO_COOLDOWN = 10.0
const GYRO_DURATION = 6.0

const gyroGui = new BaseGui(["gyroGui", "gyro", "alignment", "align"], () => {
    // check and remove from array players whose cooldowns are < 0
    gyroPlayers = gyroPlayers.filter(player => Date.now()-player.castTime <= GYRO_COOLDOWN*1000)
    let aligned = gyroPlayers.some(player => GYRO_DURATION*1000-(Date.now()-player.castTime) >= 0)

    // render durations
    let message = aligned ? "&aAligned\n" : "&cNot Aligned\n"
    gyroPlayers.forEach(player => {
        message += `${aligned ? "&a" : "&c"}${player.name}: &b${(Math.round(Math.max(GYRO_DURATION*1000-(Date.now()-player.castTime), 0.0)/100)/10).toFixed(1)}\n`
    })

    if(gyroGui.isOpen() && gyroPlayers.length == 0)
        message += "&aYou: &b0.0\n"

    return message
}, () => { return gyroGui.isOpen() || settings.gyroTracker }, () => { gyroPlayers = [] })
registerGui(gyroGui)


register("chat", (name) => {
    let found = gyroPlayers.find(player => player.name === name)
    if(found == undefined)
        gyroPlayers.push({name, castTime: Date.now()})
    else
        found.castTime = Date.now()
}).setChatCriteria(/(?:&r)*&.(.+) (?:&ecasted &aCells Alignment &eon you!&r|aligned &r&a. &r&eother players!&r|&r&aaligned &r&eyourself!&r)/g)

/*
using a start timestamp instead of a step with -= to the count because I assume it is better performance.

round to 100ms
*/