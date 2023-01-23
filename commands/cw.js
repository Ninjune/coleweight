const { findColeweight } = require("../util/helperFunctions")

module.exports =
{ 
    aliases: ["find", ""],
    description: "Gets the Coleweight of specified user.",
    options: "(player)",
    category: "info",
    execute: (args) => {
        if(args[0] == "find")
            findColeweight(args[1])
        else
            findColeweight(args[0])
    }
}