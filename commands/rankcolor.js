import axios from "../../axios";
import { reloadColor } from "../chat/message";
import { registerCommand } from "../commandManager"
import constants from "../util/constants"
const PREFIX = constants.PREFIX

registerCommand({
    aliases: ["rankcolor"],
    description: "Allows you to change your cw rank color.",
    options: "(list | set | reload)",
    subcommands: [["list", "set", "reload"]],
    category: "miscellaneous",
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw rankcolor " to see usages.`);
        switch(args[1].toLowerCase())
        {
        case "list":
            ChatLib.chat(`${constants.PREFIX}&bRequesting...`);
            axios.get(`https://ninjune.dev/api/cw/colors/get-colors?username=${Player.getName()}`)
            .then(res => {
                let colors = res.data.colors;

                colors.forEach(color => {
                    ChatLib.chat(color + " - §" + color + "Hello")
                });
                ChatLib.chat(`${PREFIX}&bTo set color: /cw rankcolor set (number/letter)`);
            })
            .catch(err => {
                if(settings.debug)
                    console.log("Get colors: " + err);
            });
            break;
        case "set":
            const serverId = java.util.UUID.randomUUID().toString().replace("-", "")
            // below makes the client join the server, used to validate minecraft auth
            Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
            axios.get(`https://ninjune.dev/api/cw/colors/set-color?color=${args[2].toLowerCase()}&username=${Player.getName()}&serverID=${serverId}`)
            .then(res => {
                if(res.data.success)
                    ChatLib.chat(`${PREFIX}&bSuccessfully changed CW rank color!`);
                else
                    ChatLib.chat(`${PREFIX}&eFailed to change CW rank color! ${res.data.reason}`);
                reloadColor();
            })
            .catch(err => {
                if(settings.debug)
                    console.log("Set color: " + err);
            });
            break;
        case "reload":
            ChatLib.chat(`${PREFIX}&bSuccessfully reloaded color!`);
            reloadColor();
            break;
        default:
            ChatLib.chat(`${constants.PREFIX}&eUnknown usage! Hit tab on "/cw rankcolor " to see usages.`)
        }
    }
})