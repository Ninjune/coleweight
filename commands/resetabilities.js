import { registerCommand } from "../commandManager";
import { resetAbilities } from "../render/miningAbilitiesMenu";

registerCommand({
    aliases: ["resetabilities"],
    description: "Resets abilities for the ability quickswitch.",
    options: "",
    category: "miscellaneous",
    execute: (args) => {
        resetAbilities()
    },
})
