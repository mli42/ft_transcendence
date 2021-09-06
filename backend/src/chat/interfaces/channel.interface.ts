import { User } from '../../user/entities/user.entity';

export interface ChannelI {
	channelId?: string;
	channelName?: string;
	users?: User[];
	publicChannel?: boolean;
	password?: string;
	adminUsers?: string[];
	owner?: string;
	authPrivateChannelUsers?: string[];
}