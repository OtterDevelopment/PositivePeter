import EventHandler from "../../../lib/classes/EventHandler.js";
import BetterMessage from "../../../lib/extensions/BetterMessage.js";

export default class MessageCreate extends EventHandler {
	override async run(message: BetterMessage) {
		this.client.dataDog.increment("events", 1, ["event:messageCreate"]);
		this.client.dataDog.increment("messagesSeen");
		if (message.author.bot) return;
		// @ts-ignore
		else if (this.client.mongo.topology.s.state === "connected")
			this.client.textCommandHandler.handleCommand(message);
		if (
			!this.client.cache.dontInteract.includes(this.client.functions.hash(message.author.id))
		) {
			this.client.emit("checkSuicide", message);
			if (
				message.guild &&
				!this.client.cache.complimentsDisabled.includes(
					this.client.functions.hash(message.guild.id)
				)
			)
				this.client.emit("checkCompliment", message);
		}
	}
}
