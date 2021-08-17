import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from './channel.repository'
import { User } from '../user/entities/user.entity';
import { ChannelI } from './interfaces/channel.interface';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { JwtPayload } from '../user/interfaces/jwt-payload.interface'
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../user/user.repository';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(ChannelRepository)
		private channelRepository: ChannelRepository,
		private readonly jwtService: JwtService,
		private usersRepository: UsersRepository
	) {}

	async createChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		const { channelName } = channel;
		const name = await this.channelRepository.findOne({channelName: channelName});
		if (name)
			throw new UnauthorizedException('This channel name already exist');
		const newChannel = await this.channelRepository.addCreatorToChannel(channel, creator);
		return this.channelRepository.createChannel(newChannel);
	}

	async getUserFromSocket(client: Socket): Promise<User> {
		const cookie = client.handshake.headers['cookie'];
		const { jwt: token } = parse(cookie);
		const payload: JwtPayload = this.jwtService.verify(token, {secret: process.env.SECRET_JWT});
		const {username} = payload;
		const user: User = await this.usersRepository.findOne({username});
		return user;
	}
}