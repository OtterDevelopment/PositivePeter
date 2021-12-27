import { MessageActionRow, MessageButton } from "discord.js";
import EventHandler from "../../../lib/classes/EventHandler.js";
import BetterMessage from "../../../lib/extensions/BetterMessage.js";

export default class CheckSuicide extends EventHandler {
	override async run(message: BetterMessage) {
		this.client.dataDog.increment("events", 1, ["event:checkSuicide"]);
		for (let trigger of this.client.triggers.suicide) {
			if (
				message.content
					.replace("'", "")
					.replace("i am", "im")
					.replace("want to", "")
					.replace("can not", "cant")
					.replace("do not", "")
					.includes(trigger)
			) {
				this.client.dataDog.increment("suicide", 1, [`trigger:${trigger}`]);
				const count =
					(
						await this.client.mongo
							.db("guilds")
							.collection("count")
							.findOne({
								guildId: this.client.functions.hash(message.guild?.id || "")
							})
					)?.count || this.client.config.defaultTriggerCount;
				const detections = await this.client.mongo
					.db("users")
					.collection("detections")
					.findOneAndUpdate(
						{ userId: this.client.functions.hash(message.author.id) },
						{ $inc: { count: 1 } },
						{ upsert: true, returnDocument: "after" }
					);
				if (detections.value?.count >= count) {
					try {
						await message.author.send(
							this.client.functions.generatePrimaryMessage(
								{
									title: "Suicide Prevention",
									description: `Hey there ${message.author.username}, based on your previous messages I have detected hints of suicidal thoughts. If you are considering suicide please contact your local suicide prevention hotline please click the button below!`,
									footer: {
										text: "If you don't want me to interact with you anymore please run the /interactions Disable command!"
									}
								},
								[
									new MessageActionRow().addComponents(
										new MessageButton({
											label: "Hotlines",
											style: "LINK",
											url: "https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines"
										})
									)
								]
							)
						);
						this.client.dataDog.increment("directMessagesSent", 1, [
							`trigger:${trigger}`
						]);
					} catch (error: any) {
						if (error.code !== 50007) {
							this.client.logger.error(error);
							this.client.logger.sentry.captureWithMessage(error, message);
						}
					}
					this.client.mongo
						.db("users")
						.collection("detections")
						.deleteOne({ userId: this.client.functions.hash(message.author?.id) });
				}
			}
		}
	}
}
