import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleChannel } from './entities/role-channel.entity'
import { Repository } from 'typeorm'
import { RoleChannelI } from './interfaces/role-channel.interface'
import { User } from '../user/entities/user.entity'
import { ChannelI } from './interfaces/channel.interface'

@Injectable()
export class RoleChannelService {
    constructor (
        @InjectRepository(RoleChannel)
        private readonly roleChannelRepository: Repository<RoleChannel>
    ) {}

    async create(roleChannel: RoleChannelI): Promise<RoleChannelI> {
        return this.roleChannelRepository.save(roleChannel);
    }
}