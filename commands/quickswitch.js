import { registerCommand } from "../commandManager";
import { quickswitch } from "../render/miningAbilitiesMenu";

registerCommand({
    aliases: ["qs", "quickswitch"],
    description: "Opens HOTM menu with ability quickswitching (redirects clicks to rotate through abilities). Bind to a skytils command shortcut.",
    options: "",
    category: "miscellaneous",
    execute: (args) => {
        quickswitch()
    },
})
