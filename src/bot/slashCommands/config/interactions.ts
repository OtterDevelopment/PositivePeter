import { CommandInteraction } from "discord.js";
import SlashCommand from "../../../../lib/classes/SlashCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";

export default class Ping extends SlashCommand {
	constructor(client: BetterClient) {
		super("interactions", client, {
			description: `Enable or disable Positive Peter from interacting with you.`,
			options: [
				{
					name: "toggle",
					description: "Enable or disable Positive Peter from interacting with you.",
					type: "STRING",
					choices: [
						{ name: "Enable", value: "enable" },
						{ name: "Disable", value: "disable" }
					],
					required: true
				}
			]
		});
	}

	override async run(interaction: CommandInteraction) {
		if (interaction.options.getString("toggle") === "enable") {
			this.client.mongo
				.db("users")
				.collection("dontInteract")
				.deleteOne({ userId: this.client.functions.hash(interaction.user.id) });
			this.client.cache.dontInteract = this.client.cache.dontInteract.filter(
				(item) => item !== this.client.functions.hash(interaction.user.id)
			);
		} else {
			this.client.mongo
				.db("users")
				.collection("dontInteract")
				.updateOne(
					{ userId: this.client.functions.hash(interaction.user.id) },
					{ $set: { enabled: true } },
					{ upsert: true }
				);
			this.client.cache.dontInteract.push(this.client.functions.hash(interaction.user.id));
		}
		return interaction.reply(
			this.client.functions.generateSuccessMessage({
				title: `${this.client.functions.titleCase(
					interaction.options.getString("toggle")!
				)}d Interactions`,
				description: `I have **${interaction.options.getString(
					"toggle"
				)}d** Positive Peter interacting with you.`
			})
		);
	}
}
