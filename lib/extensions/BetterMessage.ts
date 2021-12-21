import BetterClient from "./BetterClient";
import { RawMessageData } from "discord.js/typings/rawDataTypes";
import { Message, MessagePayload, ReplyMessageOptions, Structures } from "discord.js";

export default class BetterMessage extends Message {
	constructor(client: BetterClient, data: RawMessageData) {
		super(client, data);
	}

	public override async reply(
		options: string | MessagePayload | ReplyMessageOptions
	): Promise<BetterMessage> {
		try {
			if (this.deleted) return this.channel.send(options);
			else return this.reply(options);
		} catch {
			return this.channel.send(options);
		}
	}
}

// @ts-ignore
Structures.extend("Message", () => BetterMessage);
