import TextCommand from "../../../../lib/classes/TextCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";
import BetterMessage from "../../../../lib/extensions/BetterMessage.js";

export default class Ping extends TextCommand {
	constructor(client: BetterClient) {
		super("unblock", client, {
			description: "Unblock a user from suggesting triggers.",
			devOnly: true
		});
	}

	override async run(message: BetterMessage, args: string[]) {
		if (!args.length)
			return message.reply(
				this.client.functions.generateErrorMessage({
					title: "Invalid Argument",
					description: "Please provide a hashed user ID!"
				})
			);
		const hash = args.shift();
		this.client.mongo.db("users").collection("blocked").deleteOne({ userId: hash });
		return message.reply(
			this.client.functions.generateSuccessMessage({
				title: "User Unblocked",
				description: `I have unblocked \`${hash}\` from suggesting triggers.`
			})
		);
	}
}
