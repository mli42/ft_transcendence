import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from './channel.repository'
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/channel.dto'

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChannelRepository)
		private channelRepository: ChannelRepository
	) {}
}