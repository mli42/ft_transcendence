import { EntityRepository, Repository } from "typeorm";
import { Channel } from './entities/channel.entity';
import { ChannelI } from "./interfaces/channel.interface";
import { User } from '../user/entities/user.entity';

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {

	async createChannel(newChannel: ChannelI): Promise<ChannelI> {
		return this.save(newChannel);
	}

	async addCreatorToChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		if (!Array.isArray(channel.users)) {
			channel.users = [];
		}
		channel.users.push(creator);
		return channel;
	}

	async getChannelsForUser(userId: string): Promise <ChannelI[]> {
		const query = this
		.createQueryBuilder('channel')
		.leftJoin('channel.users', 'users')
		.where('users.userId =  :userId', {userId})
		const channels: ChannelI[] = await query.getMany();
		console.log(channels)
		return channels;
	}
}