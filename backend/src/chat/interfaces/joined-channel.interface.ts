import { ChannelI } from "../interfaces/channel.interface";
import { User } from "../../user/entities/user.entity";

export interface JoinedChannelI {
	joinId?: string;
	socketId: string;
	user: User;
	channel: ChannelI;
}