import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RoleUser } from './entities/role-user.entity';
import { ChannelI } from './interfaces/channel.interface'
import { RoleUserI } from './interfaces/role-user.interface';

@Injectable()
export class RoleUserService {
    constructor (
        @InjectRepository(RoleUser)
        private readonly roleUserRepository: Repository<RoleUser>
    ) {}

    async create(role: RoleUserI): Promise<RoleUserI> {
        return this.roleUserRepository.save(role);
    }
}