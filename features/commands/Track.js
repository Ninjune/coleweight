import { registerCommands } from "../../utils/Utils"
import { cguiTrackCollection } from "../guis/CollectionGui"

registerCommands({
    aliases: ["track"],
    description: "Changes the collection that is being tracked with the collection tracker.",
    options: "(collection)",
    category: "settings",
    execute: (args) => {
        cguiTrackCollection(args[1]?.toLowerCase())
    }
})