import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelRepository } from './channel.repository'
import { Channel } from './entities/channel.entity';
import { User } from '../user/entities/user.entity';
import { ChannelI } from './interfaces/channel.interface';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { JwtPayload } from '../user/interfaces/jwt-payload.interface'
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../user/user.repository';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChannelRepository)
		private channelRepository: ChannelRepository,
		private readonly jwtService: JwtService,
		private usersRepository: UsersRepository
	) {}

	async createChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		const newChannel = await this.addCreatorToChannel(channel, creator);
		return this.channelRepository.createChannel(newChannel);
	}

	async getChannelForUser(userId: string, options: IPaginationOptions): Promise <Pagination<ChannelI>>{
		const query = this.channelRepository
		.createQueryBuilder('channel')
		.leftJoin('channel.users', 'user')
		.where('user.id =  :userId', {userId})
		return paginate(query, options);
	}

	async addCreatorToChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		channel.users.push(creator);
		return channel;
	}

	async getUserFromSocket(client: Socket): Promise<User> {
		const cookie = client.handshake.headers.cookie;
		const { Authentication: authenticationToken } = parse(cookie);

		const payload: JwtPayload = this.jwtService.verify(authenticationToken, {secret: process.env.SECRET_JWT});
		console.log(payload);
		const {username} = payload;
		const user: User = await this.usersRepository.findOne({username});
		if (!user) {
			throw new WsException('Invalid credentials.');
		}
		return user;
	}
}