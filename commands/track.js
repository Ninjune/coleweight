const { cguiTrackCollection } = require("../render/guis/collectionGui")

module.exports =
{ 
    aliases: ["track"],
    description: "Changes the collection that is being tracked with the collection tracker.",
    options: "(collection)",
    category: "settings",
    execute: (args) => {
        cguiTrackCollection(args[1])
    }
}