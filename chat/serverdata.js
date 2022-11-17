import constants from "../util/constants";
let needCheck = false

register("chat", (message, event) => {
    if(needCheck) 
    {
        try
        {
            constants.serverData = JSON.parse(message)
            cancel(event)
            needCheck = false
        }
        catch (e) {}
    }
}).setCriteria(/(\{"server":"(?:.*)","gametype":"(?:.*)","mode":"(?:.*)","map":"(?:.*)"\})/g)

register('worldLoad', () => {
    needCheck = true
    ChatLib.command('locraw')
})