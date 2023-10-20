//Written by _ryt
import axios from "../../axios"

register("chat", (playerName) => {
    axios.get("https://ninjune.dev/api/alloy-drop/on-drop?username="+playerName)
}).setCriteria(/ALLOY! (?:\[.*?\] )?([^ ]{1,16}) just found a Divan's Alloy!/)


export default ""