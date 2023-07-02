import { registerCommand } from "../commandManager"
import { cguiTrackCollection } from "../render/guis/collectionGui"


registerCommand({
    aliases: ["track"],
    description: "Changes the collection that is being tracked with the collection tracker.",
    options: "(collection)",
    category: "settings",
    execute: (args) => {
        cguiTrackCollection(args[1]?.toLowerCase())
    }
})