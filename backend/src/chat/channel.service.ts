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
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		private readonly jwtService: JwtService,
		private readonly usersRepository: UsersRepository
	) {}

	async createChannel(channel: ChannelI, creator: User): Promise<ChannelI> {
		let { channelName, publicChannel, password } = channel;
		const name = await this.channelRepository.findOne({channelName: channelName});
		if (name)
			throw new UnauthorizedException('This channel name already exist');
		channel.adminUsers = [];
		channel.authPrivateChannelUsers = [];
		channel.owner = creator.userId;
		if (!password)
			password = null;
		if (publicChannel === false) {
			channel.users.push(creator);
			if (password) {
				const salt = await bcrypt.genSalt();
				channel.password = await bcrypt.hash(password, salt);
				channel.authPrivateChannelUsers.push(creator.userId)
			} else {
				for (const user of channel.users) {
					channel.authPrivateChannelUsers.push(user.userId)
				}
			}
		}
		return this.channelRepository.save(channel);
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
		.orderBy('channel.date', 'ASC');
		const privateChannels: ChannelI[] = await query.getMany();
		const channels = publicChannels.concat(privateChannels);

		channels.sort(function(date1,date2) {
			let d1 = new Date(date1.date);
			let d2 = new Date(date2.date);
			if (d1 > d2) return 1;
			else if (d1 < d2) return -1;
			else return 0;
		  });
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
		if(channel.authPrivateChannelUsers.length === 0)
			return false;
		const userFound = channel.authPrivateChannelUsers.find(element => element === user.userId)
		if (userFound)
			return true;
		return false;
	}

	async addAuthUserPrivateChannel(channel: ChannelI, user: User): Promise<boolean>  {
		if (await this.isAuthPrivateChannel(channel, user) === true)
			return true;
		channel.authPrivateChannelUsers.push(user.userId);
		try {
			await this.channelRepository.save(channel);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException('add Auth private channel');
		}
		return true;
	}



	async isAdminUser(channel: ChannelI, user: User): Promise<boolean> {
		const userFound = channel.adminUsers.find(element => element === user.userId)
		if (userFound)
			return true;
		return false;
	}

	async addAdminUser(channel: ChannelI, user: User) {
		if (await this.isAdminUser(channel, user) === true)
			return;
		channel.adminUsers.push(user.userId);
		try {
			await this.channelRepository.save(channel);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException('add an user admin');
		}
	}

	async removeAdminUser(channel: ChannelI, user: User) {
		if (await this.isAdminUser(channel, user) === false)
			return;
		const index = channel.adminUsers.indexOf(user.userId);
		channel.adminUsers.splice(index, 1);
	}



	async addBlockUser(user: User, userToBlock: User) {

	}

	async removeBlockUser(channel: ChannelI, user: User) {
	
	}


	async updateChannelInfo(channelFound: ChannelI, info: any) {
		const { applyPassword, password, deletePassword, members } = info;
        if (applyPassword) {
            if (!password) {
                channelFound.password = "";
            } else {
				const salt = await bcrypt.genSalt();
				channelFound.password = await bcrypt.hash(password, salt);
            }
        }
        if (deletePassword)
            channelFound.password = "";
		if (members) {
			const newUsers = [];
			for (const user of members) {
				const userFound: User = channelFound.users.find(element => element.userId === user.userId);
				if (!userFound)
					newUsers.push(user);
			}
			const newMembers = channelFound.users.concat(newUsers);
			channelFound.users = newMembers;
		}
		await this.channelRepository.save(channelFound);
	}

	// add or remove a user to private channel
}