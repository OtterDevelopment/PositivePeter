import TextCommand from "../../../../lib/classes/TextCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";
import BetterMessage from "../../../../lib/extensions/BetterMessage.js";

export default class Ping extends TextCommand {
	constructor(client: BetterClient) {
		super("block", client, {
			description: "Block a user from suggesting triggers.",
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
		const reason = args.join(" ") || null;
		this.client.mongo
			.db("users")
			.collection("blocked")
			.updateOne({ userId: hash }, { $set: { reason } }, { upsert: true });
		return message.reply(
			this.client.functions.generateSuccessMessage({
				title: "User Blocked",
				description: `I have blocked \`${hash}\` from suggesting triggers.`
			})
		);
	}
}
