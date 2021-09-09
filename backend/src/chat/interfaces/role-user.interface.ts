import { ChannelI } from "../interfaces/channel.interface";

export interface RoleUserI {
	roleUserId?: string;
	userId: string;
	ban?: Date;
    mute?: Date;
	channel: ChannelI;
}