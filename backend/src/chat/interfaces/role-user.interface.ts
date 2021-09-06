import { ChannelI } from "../interfaces/channel.interface";

export interface RoleUserI {
	roleUserId?: string;
	userId: string;
    block: boolean;
	ban?: Date;
    mute?: Date;
	channel: ChannelI;
}