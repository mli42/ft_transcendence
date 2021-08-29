import { ChannelI } from "../interfaces/channel.interface";
import { User } from "../../user/entities/user.entity";

export interface RoleChannelI {
	roleId?: string;
	authPrivateChannel?: boolean;
	isBan?: boolean;
	isAdmin?: boolean;
	user: User;
	channel: ChannelI;
}