import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(ChannelRepository)
		private readonly channelRepository: Repository<Channel>,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository
	) {}

	async createChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		const { channelName, publicChannel } = channel;
		const name = await this.channelRepository.findOne({channelName: channelName});
		if (name)
			throw new UnauthorizedException('This channel name already exist');
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
		console.log("publicChannels");
		console.log(publicChannels);

		query = this.channelRepository
		.createQueryBuilder('channel')
		.leftJoin('channel.users', 'users')
		.where('users.userId = :userId', {userId})
		.andWhere('channel.publicChannel = false')
		.leftJoinAndSelect('channel.users', 'all_users')
		.orderBy('channel.update_at', 'DESC');
		const privateChannels: ChannelI[] = await query.getMany();
		console.log("privateChannels");
		console.log(privateChannels);

		
		const channels = publicChannels.concat(privateChannels);
		console.log("channels")
		console.log(channels)

		return channels;
	}

	// async updatePublicChannelsForNewUser(user: User) {
	// 	const { userId } = user;
	// 	const query = this.channelRepository
	// 	.createQueryBuilder('channel')
	// 	.leftJoin('channel.users', 'users')
	// 	.where('users.userId = :userId', {userId})
	// 	.andWhere('channel.publicChannel = true')
	// 	const channelsFound: ChannelI[] = await query.getMany();
	// 	if (channelsFound.length === 0){
	// 		const queryPublic = this.channelRepository
	// 		.createQueryBuilder('channel')
	// 		.where('channel.publicChannel = true')
	// 		const publicChannels: ChannelI[] = await queryPublic.getMany();
	// 		if (publicChannels.length > 0) {
	// 			for (const channel of publicChannels) {
	// 				console.log(channel.channelName)
	// 				// if (!Array.isArray(channel.users)) {
	// 				// 	channel.users = [];
	// 				// }
	// 				channel.users.push(user);
	// 				try {
	// 					await this.channelRepository.save(channel);
	// 				} catch (error) {
	// 					console.log(error);
	// 					throw new InternalServerErrorException('new user get public channels');
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		console.log("found")
	// 	}
	// 	// console.log(channels);
	// }

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
		channel.authPrivateChannelUsers.push(user.userId);
		try {
			await this.channelRepository.save(channel);
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
}