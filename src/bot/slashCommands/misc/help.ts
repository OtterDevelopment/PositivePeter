import { CommandInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import SlashCommand from "../../../../lib/classes/SlashCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";

export default class Ping extends SlashCommand {
	constructor(client: BetterClient) {
		super("help", client, {
			description: `Get some help with Positive Peter.`
		});
	}

	override async run(interaction: CommandInteraction) {
		return interaction.reply(
			this.client.functions.generatePrimaryMessage(
				{
					title: "Positive Peter",
					description: `Positive Peter is a Discord bot meant to uplift Discord users and provide resources to professionals when needed.\n\nTo view all of the commands Positive Peter has to offer type \`/\`!`
				},
				[
					new MessageActionRow().addComponents([
						new MessageButton({
							label: "Invite",
							style: "LINK",
							url: this.client.config.minimalInvite
						}),
						new MessageButton({
							label: "Support Server",
							style: "LINK",
							url: this.client.config.supportServer
						}),
						new MessageButton({
							label: "GitHub",
							style: "LINK",
							url: this.client.config.gitHub
						})
					])
				]
			)
		);
	}
}
