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

    async create(data:any) {
        let { user, channel, ban, mute } = data;

        if (ban > 0) {
            let dateBan = new Date;
            dateBan.setDate(dateBan.getDate() + ban);
            ban = dateBan;
        } else {
            ban = null;
        }
        if (mute > 0) {
            let dateMute = new Date;
            dateMute.setDate(dateMute.getDate() + mute)
            mute = dateMute;
        } else {
            mute = null;
        }

        const role: RoleUserI = {userId: user.userId, ban, mute, channel}
        await this.roleUserRepository.save(role);
    }

    async updateRole(role: RoleUserI, data: any) {
        let { ban, mute } = data;
        
        if (ban > 0) {
            let dateBan = new Date;
            dateBan.setDate(dateBan.getDate() + ban);
            role.ban = dateBan;
        } else {
            ban = null;
        }
        if (mute > 0) {
            let dateMute = new Date;
            dateMute.setDate(dateMute.getDate() + mute)
            role.mute = dateMute;
        } else {
            mute = null;
        }
        await this.roleUserRepository.save(role);
    }

    async findByUserId(userId: string): Promise<RoleUserI> {
        return this.roleUserRepository.findOne({userId: userId});
    }

    async findUserByChannel(channel: ChannelI, userId: string): Promise<RoleUserI> {
        return this.roleUserRepository.findOne({where: {channel: channel, userId: userId }});
    }
}