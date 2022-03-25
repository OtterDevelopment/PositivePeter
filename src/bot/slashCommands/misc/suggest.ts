import { CommandInteraction, MessageEmbed } from "discord.js";
import SlashCommand from "../../../../lib/classes/SlashCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";

export default class Ping extends SlashCommand {
    constructor(client: BetterClient) {
        super("suggest", client, {
            description: `Suggest a trigger to be added into ${client.config.botName}.`,
            options: [
                {
                    name: "trigger",
                    description: "The trigger to suggest.",
                    type: "STRING",
                    required: true
                }
            ]
        });
    }

    override async run(interaction: CommandInteraction) {
        const blocked = await this.client.mongo
            .db("users")
            .collection("blocked")
            .findOne({
                userId: this.client.functions.hash(interaction.user.id)
            });
        if (blocked)
            return interaction.reply(
                this.client.functions.generateErrorMessage({
                    title: "Blocked",
                    description: `You are blocked from making trigger suggestions${
                        blocked.reason ? ` for: ${blocked.reason}` : "!"
                    }`
                })
            );
        await this.client.logger.webhookLog("suggestion", {
            username: "Trigger Suggestion",
            embeds: [
                new MessageEmbed({
                    title: "Trigger Suggestion",
                    description: interaction.options.getString("trigger")!,
                    footer: {
                        text: `Hashed User ID: ${this.client.functions.hash(
                            interaction.user.id
                        )}`
                    },
                    timestamp: Date.now(),
                    color: parseInt(this.client.config.colors.primary, 16)
                })
            ]
        });
        return interaction.reply({
            ...this.client.functions.generateSuccessMessage({
                title: "Trigger Suggested",
                description: "I have suggested your trigger!"
            }),
            ephemeral: true
        });
    }
}
