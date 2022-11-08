import axios from "../../axios"
import constants from "./constants"
PREFIX = constants.PREFIX
VERSION = constants.VERSION

register("worldLoad", () => {
    axios.get(`https://chattriggers.com/api/modules/1367`)
    .then(res => {
        let ctVersionArray = (res.data.releases[0].releaseVersion).split('.'),
         currentVersionArray = VERSION.split('.'),
         newVersion = false

        for(let i = 0; i < ctVersionArray.length; i++)
        {
            if (ctVersionArray[i] > currentVersionArray[i])
                newVersion = true
        }

        if(newVersion)
        {
            ChatLib.chat(VERSION + " " + res.data.releases[0].releaseVersion)
            ChatLib.chat(`${PREFIX}&eYou are using an unsupported version of Coleweight!`)
            new TextComponent(`${PREFIX}&eClick &3here&e to update!`)
            .setClickAction("run_command")
            .setClickValue(`/ct load`)
            .chat()
            ChatLib.chat("")
        }
        else
        {
            axios.get(`https://raw.githubusercontent.com/Ninjune/coleweight/main/metadata.json`)
            .then(res => {
                let githubVersionArray = (res.data.version).split('.')

                for(let i = 0; i < githubVersionArray.length; i++)
                {
                    if(githubVersionArray[i] > currentVersionArray[i])
                        newVersion = true
                }

                if(!newVersion) return
                
                ChatLib.chat(`${PREFIX}&eYou are using an unsupported version of Coleweight!`)
                new TextComponent(`${PREFIX}&eClick &3here&e to open the github releases!`)
                .setClickAction("open_url")
                .setClickValue(`https://github.com/Ninjune/coleweight/releases`)
                .chat()
                ChatLib.chat("")
                return
            })
            .catch(err => {
                ChatLib.chat(err)
            })
        }
    })
    
})

export default ""