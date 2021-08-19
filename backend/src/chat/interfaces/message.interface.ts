import { User } from "../../user/entities/user.entity";
import { ChannelI } from "./channel.interface";


export interface MessageI {
	msgId?: string;
	text: string;
	user: User;
	channel: ChannelI;
	date: Date;
	update_at: Date;
}