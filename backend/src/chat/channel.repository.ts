import { EntityRepository, Repository } from "typeorm";
import { Channel } from './entities/channel.entity';
import { ChannelI } from "./interfaces/channel.interface";

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {

	async createChannel(newChannel: Channel): Promise<ChannelI> {
		return this.save(newChannel);
	}
}