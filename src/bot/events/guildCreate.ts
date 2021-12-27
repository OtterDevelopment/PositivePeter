import { Guild } from "discord.js";
import EventHandler from "../../../lib/classes/EventHandler.js";

export default class GuildCreate extends EventHandler {
	override async run(guild: Guild) {
		this.client.dataDog.increment("events", 1, ["event:guildCreate"]);
		const stats = await this.client.fetchStats();
		this.client.dataDog.gauge("guilds", stats.guilds);
		this.client.dataDog.gauge("users", stats.users);
		try {
			await guild.commands.set(
				this.client.slashCommands.map((command) => {
					return {
						name: command.name,
						description: command.description,
						options: command.options
					};
				})
			);
		} catch (error: any) {
			if (error.code === 50001)
				this.client.logger.error(
					null,
					`I encountered DiscordAPIError: Missing Access in ${guild.name} [${guild.id}] when trying to set slash commands!`
				);
			else {
				this.client.logger.error(error);
				this.client.logger.sentry.captureWithExtras(error, {
					guild: guild
				});
			}
		}
		this.client.logger.info(
			`Joined guild ${guild.name} (${guild.id}) with ${guild.memberCount} members, now in ${stats.guilds} guilds(s)!`
		);
		return this.client.logger.webhookLog("guild", {
			content: `**__Joined a New Guild (${stats.guilds} Total)__**\n**Guild Name:** \`${
				guild.name
			}\`\n**Guild ID:** \`${guild.id}\`\n**Guild Owner:** <@${guild.ownerId}> \`[${
				guild.ownerId
			}]\`\n**Guild Member Count:** \`${
				guild.memberCount || 2
			}\`\n**Timestamp:** ${this.client.functions.generateTimestamp()}`,
			username: `${this.client.user?.username} | Guild Logs`
		});
	}
}
