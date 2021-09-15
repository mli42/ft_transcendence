import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JoinedChannel } from './entities/joined-channel.entity'
import { Repository } from 'typeorm'
import { JoinedChannelI } from './interfaces/joined-channel.interface'
import { User } from '../user/entities/user.entity'
import { ChannelI } from './interfaces/channel.interface'

@Injectable()
export class JoinedChannelService {
    constructor (
        @InjectRepository(JoinedChannel)
        private readonly joinedChannelRepository: Repository<JoinedChannel>
    ) {}

    async create(joinedChannel: JoinedChannelI): Promise<JoinedChannelI> {
        return this.joinedChannelRepository.save(joinedChannel);
    }

    async findByChannel(channel: ChannelI): Promise<JoinedChannelI[]> {
        return this.joinedChannelRepository.find({where: {channel: channel}, relations: ['user']});
    }

    async deleteBySocketId(socketId: string) {
        return this.joinedChannelRepository.delete({socketId});
    }

    async deleteAll() {
        await this.joinedChannelRepository
        .createQueryBuilder()
        .delete()
        .execute();
    }
}