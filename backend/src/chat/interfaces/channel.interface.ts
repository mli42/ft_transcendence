import { User } from '../../user/entities/user.entity';

export interface ChannelI {
	channelId: string;
	name: string;
	users: User[];
}