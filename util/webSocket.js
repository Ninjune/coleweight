/*import WebSocket from "../libs/WebSocket" // I'll add later (maybe) (I need to stop doing this)

const ws = new WebSocket("wss://ninjune.dev")
const serverId = java.util.UUID.randomUUID().toString().replace("-", "")

setTimeout(() => {
    ChatLib.chat(serverId)
    Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
    ws.connect()
}, 333)


ws.onOpen(() => {
    ChatLib.chat("established")
    ws.send(JSON.stringify({ method: "login", username: Player.getName(), serverId: serverId }))
})

ws.onError(err => {
    console.log("WS Error: " + err)
})

ws.onMessage(message => {
    const json = JSON.parse(message.toString())

    if(json.method == "heartbeat")
        ws.send(JSON.stringify({method: "heartbeat"}))
    else
        console.log(json.message)
})

ws.onClose(() => {
    ChatLib.chat("connection closed")
})

register("gameUnload", () => {
    ws.close()
})*/