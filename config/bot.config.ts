import { Intents, PermissionString, PresenceData } from "discord.js";

export default {
	prefix: "s!",

	version: "4.0.0",
	admins: ["619284841187246090", "102102717165506560"],

	supportServer: "https://discord.gg/VwMWj2B",
	minimalInvite:
		"https://discord.com/api/oauth2/authorize?client_id=696257723808874496&permissions=274878220288&scope=bot%20applications.commands",
	gitHub: "https://github.com/OtterDevelopment/PositivePeter",

	presence: {
		status: "online",
		activities: [
			{
				type: "LISTENING",
				name: "users"
			}
		]
	} as PresenceData,

	hastebin: "https://h.inv.wtf",

	colors: {
		primary: "5865F2",
		success: "57F287",
		warning: "FEE75C",
		error: "ED4245"
	},

	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],

	requiredPermissions: [
		"EMBED_LINKS",
		"SEND_MESSAGES",
		"USE_EXTERNAL_EMOJIS"
	] as PermissionString[],

	defaultTriggerCount: 3,

	dataDog: {
		apiKey: process.env.DATADOG_API_KEY,
		baseURL: "https://app.datadoghq.com/api/v1/",
	}
};
