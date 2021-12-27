import EventHandler from "../../../lib/classes/EventHandler.js";
import BetterMessage from "../../../lib/extensions/BetterMessage.js";

export default class CheckSuicide extends EventHandler {
	override async run(message: BetterMessage) {
		this.client.dataDog.increment("events", 1, ["event:checkCompliments"]);
		for (let [trigger, responses] of Object.entries(this.client.triggers.compliments)) {
			if (
				message.content
					.replace("'", "")
					.replace("i am", "im")
					.replace("want to", "")
					.replace("can not", "cant")
					.replace("do not", "")
					.includes(trigger)
			) {
				this.client.dataDog.increment("compliment", 1, [`trigger:${trigger}`]);
				return message.reply({
					content: this.client.functions.random(responses)
				});
			}
		}
	}
}
