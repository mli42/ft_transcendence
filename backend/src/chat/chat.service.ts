import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from './channel.repository'
import { Channel } from './entities/channel.entity';
import { User } from '../user/entities/user.entity';
import { ChannelI } from './interfaces/channel.interface';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChannelRepository)
		private channelRepository: ChannelRepository
	) {}

	async createChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		const newChannel = await this.addCreatorToChannel(channel, creator);
		return this.channelRepository.createChannel(newChannel);
	}

	async addCreatorToChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		channel.users.push(creator);
		return channel;
	}
}