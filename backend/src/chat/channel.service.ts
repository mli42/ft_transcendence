import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ChannelI } from './interfaces/channel.interface';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { JwtPayload } from '../user/interfaces/jwt-payload.interface'
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../user/user.repository';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository
	) {}

	async createChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		const { channelName, publicChannel } = channel;
		const name = await this.channelRepository.findOne({channelName: channelName});
		if (name)
			throw new UnauthorizedException('This channel name already exist');
		channel.adminUsers = [];
		channel.banedUsers = [];
		channel.mutedUsers = [];
		channel.authPrivateChannelUsers = [];
		if (publicChannel === false) {
			const newChannel = await this.addCreatorToChannel(channel, creator);
			return this.channelRepository.save(newChannel);
		}
		return this.channelRepository.save(channel);
	}

	async addCreatorToChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		if (!Array.isArray(channel.users)) {
			channel.users = [];
		}
		channel.users.push(creator);
		return channel;
	}

	async getChannelsForUser(userId: string): Promise <ChannelI[]> {
		let query = this.channelRepository
		.createQueryBuilder('channel')
		.where('channel.publicChannel = true')
		const publicChannels: ChannelI[] = await query.getMany();

		query = this.channelRepository
		.createQueryBuilder('channel')
		.leftJoin('channel.users', 'users')
		.where('users.userId = :userId', {userId})
		.andWhere('channel.publicChannel = false')
		.leftJoinAndSelect('channel.users', 'all_users')
		.orderBy('channel.update_at', 'DESC');
		const privateChannels: ChannelI[] = await query.getMany();
		
		const channels = publicChannels.concat(privateChannels);

		return channels;
	}

	async getUserFromSocket(client: Socket): Promise<User> {
		const cookie = client.handshake.headers['cookie'];
		const { jwt: token } = parse(cookie);
		const payload: JwtPayload = this.jwtService.verify(token, {secret: process.env.SECRET_JWT});
		const {username} = payload;
		const user: User = await this.usersRepository.findOne({username});
		return user;
	}

	async getChannel(channelId: string): Promise<ChannelI> {
		return this.channelRepository.findOne(channelId, {relations: ['users']});
	}
	
	async foundChannel(channelId: string): Promise<ChannelI> {
		return this.channelRepository.findOne(channelId);
	}

	async isAuthPrivateChannel(channel: ChannelI, user: User): Promise<boolean> {
		// console.log(typeof channel.authPrivateChannelUsers)
		// if (!Array.isArray(channel.authPrivateChannelUsers)) {
		// 	channel.users = [];
		// }
		// channel.authPrivateChannelUsers = [];
		if(channel.authPrivateChannelUsers.length === 0)
			return false;
		const userFound = channel.authPrivateChannelUsers.find(element => element === user.userId)
		if (userFound) {
			return true;
		}
		return false;
	}

	async addAuthUserPrivateChannel(channel: ChannelI, user: User): Promise<boolean>  {
		if (await this.isAuthPrivateChannel(channel, user) === true) {
			return true;
		}
		// console.log("OK1")
		channel.authPrivateChannelUsers = [];
		channel.authPrivateChannelUsers.push(user.userId);
		// console.log(channel)
		try {
			await this.channelRepository.save(channel);
			// console.log("OK3")
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException('add Auth private channel');
		}
		return true;
	}

	async isBanUser(channel: ChannelI, user: User): Promise<boolean> {
		const userFound = channel.banedUsers.find(element => element === user.userId)
		if (userFound) {
			return true;
		}
		return false;
	}

	async addBanUser(channel: ChannelI, user: User) {
		if (await this.isBanUser(channel, user) === true) {
			throw new UnauthorizedException('This user is already ban');
		}
		channel.banedUsers.push(user.userId);
		try {
			await this.channelRepository.save(channel);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException('add an user');
		}
	}

	async removeBanUser(channel: ChannelI, user: User) {
		if (await this.isBanUser(channel, user) === false)
			return;
		const index = channel.banedUsers.indexOf(user.userId);
		channel.banedUsers.splice(index, 1);
	}

	async isMuteUser(channel: ChannelI, user: User): Promise<boolean> {
		const userFound = channel.mutedUsers.find(element => element === user.userId)
		if (userFound) {
			return true;
		}
		return false;
	}

	async addMuteUser(channel: ChannelI, user: User) {
		if (await this.isMuteUser(channel, user) === true) {
			throw new UnauthorizedException('This user is already ban');
		}
		channel.mutedUsers.push(user.userId);
		try {
			await this.channelRepository.save(channel);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException('add an user');
		}
	}

	async removeMuteUser(channel: ChannelI, user: User) {
		if (await this.isMuteUser(channel, user) === false)
			return;
		const index = channel.mutedUsers.indexOf(user.userId);
		channel.banedUsers.splice(index, 1);
	}

	// add or remove a user to private channel
}