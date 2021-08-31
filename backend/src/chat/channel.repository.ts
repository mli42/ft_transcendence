import { EntityRepository, Repository } from "typeorm";
import { Channel } from './entities/channel.entity';
import { ChannelI } from "./interfaces/channel.interface";
import { User } from '../user/entities/user.entity';

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {

	// async createChannel(newChannel: ChannelI): Promise<ChannelI> {
	// 	return this.save(newChannel);
	// }






}