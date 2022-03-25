import {
    CommandInteraction,
    MessageActionRow,
    MessageButton
} from "discord.js";
import SlashCommand from "../../../../lib/classes/SlashCommand.js";
import BetterClient from "../../../../lib/extensions/BetterClient.js";

export default class Ping extends SlashCommand {
    constructor(client: BetterClient) {
        super("help", client, {
            description: `Get some help with ${client.config.botName}.`
        });
    }

    override async run(interaction: CommandInteraction) {
        return interaction.reply(
            this.client.functions.generatePrimaryMessage(
                {
                    title: this.client.config.botName,
                    description: `${this.client.config.botName} is a Discord bot meant to uplift Discord users and provide resources to professionals when needed.\n\nTo view all of the commands Positive Peter has to offer type \`/\`!`
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
