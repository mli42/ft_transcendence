import { EntityRepository, Repository } from "typeorm";
import { Channel } from './entities/channel.entity';
import { ChannelI } from "./interfaces/channel.interface";
import { User } from '../user/entities/user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {

	async createChannel(newChannel: Channel): Promise<ChannelI> {
		return this.save(newChannel);
	}
	async addCreatorToChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		channel.users.push(creator);
		return channel;
	}

	async getChannelForUser(userId: string, options: IPaginationOptions): Promise <Pagination<ChannelI>>{
		const query = this
		.createQueryBuilder('channel')
		.leftJoin('channel.users', 'user')
		.where('user.id =  :userId', {userId})
		return paginate(query, options);
	}
}