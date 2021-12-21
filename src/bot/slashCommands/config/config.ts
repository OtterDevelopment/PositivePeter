import { CommandInteraction } from "discord.js";
import SlashCommand from "../../../../lib/classes/SlashCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";

export default class Ping extends SlashCommand {
	constructor(client: BetterClient) {
		super("config", client, {
			description: `Config Positive Peter for your server`,
			guildOnly: true,
			permissions: ["MANAGE_GUILD"],
			options: [
				{
					name: "compliments",
					description: "Enable or disable compliments from being sent in the server.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "toggle",
							description: "Whether to enable or disable compliments.",
							type: "STRING",
							choices: [
								{ name: "Enable", value: "enable" },
								{ name: "Disable", value: "disable" }
							],
							required: true
						}
					]
				},
				{
					name: "count",
					description:
						"Set the amount of times the bot has to be triggered before DMing a user.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "number",
							description:
								"The amount of times the bot has to be triggered before DMing a user.",
							type: "NUMBER",
							required: true,
							minValue: 1
						}
					]
				}
			]
		});
	}

	override async run(interaction: CommandInteraction) {
		if (interaction.options.getSubcommand() === "compliments") {
			if (interaction.options.getString("toggle") === "enable") {
				this.client.mongo
					.db("guilds")
					.collection("compliments")
					.updateOne(
						{ guildId: this.client.functions.hash(interaction.guild!.id) },
						{ $set: { enabled: true } },
						{ upsert: true }
					);
				this.client.cache.complimentsDisabled.push(
					this.client.functions.hash(interaction.guild!.id)
				);
			} else {
				this.client.mongo
					.db("guilds")
					.collection("compliments")
					.deleteOne({ guildId: this.client.functions.hash(interaction.guild!.id) });
				this.client.cache.complimentsDisabled =
					this.client.cache.complimentsDisabled.filter(
						(item) => item !== this.client.functions.hash(interaction.guild!.id)
					);
			}
			return interaction.reply(
				this.client.functions.generateSuccessMessage({
					title: `Compliments ${this.client.functions.titleCase(
						interaction.options.getString("toggle")!
					)}`,
					description: `I have **${interaction.options.getString(
						"toggle"
					)}d** compliments for this server!`
				})
			);
		} else if (interaction.options.getSubcommand() === "count") {
			this.client.mongo
				.db("guilds")
				.collection("count")
				.updateOne(
					{ guildId: this.client.functions.hash(interaction.guild!.id) },
					{ $set: { count: interaction.options.getNumber("number") } },
					{ upsert: true }
				);
			return interaction.reply(
				this.client.functions.generateSuccessMessage({
					title: "Trigger Count Set",
					description: `I have set the trigger count for this server to **${interaction.options.getNumber(
						"number"
					)}**!`
				})
			);
		}
	}
}
