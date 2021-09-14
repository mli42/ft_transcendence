import { User } from '../../user/entities/user.entity';

export interface ChannelI {
	channelId?: string;
	channelName?: string;
	date?: Date;
	users?: User[];
	publicChannel?: boolean;
	password?: string;
	adminUsers?: string[];
	owner?: string;
	authPrivateChannelUsers?: string[];
	directMessage: boolean;
}