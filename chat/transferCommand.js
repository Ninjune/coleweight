import settings from "../settings"

let partyLeader = "";
let lastTimeUsed = 0;
register('chat', (rank, name) => {
	if (!settings.transferCommand || Date.now() - lastTimeUsed < 750)
        return
	if (partyLeader == Player.getName() || partyLeader == "")
    {
		ChatLib.command(`party transfer ${name}`)
        partyLeader = name;
	}
}).setChatCriteria(/Party > (\[.+\])? ?(.+) ?[ቾ⚒]?: (!|\.|\?)+(ptme|pt)?/)


register("chat", (rank, name) => {
    partyLeader = name;
}).setChatCriteria(/The party was transferred to (\[\w+\+{0,2}\] )?(\w{1,16}) by (\[\w+\+{0,2}\] )?(\w{1,16})/g)