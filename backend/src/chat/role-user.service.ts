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

    async create(data:any): Promise<RoleUserI> {
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
        const newRole: RoleUserI = await this.roleUserRepository.save({userId: user.userId, ban, mute, channel});
        return newRole;
    }

    async updateRole(role: RoleUserI, data: any): Promise<RoleUserI> {
        let { ban, mute, unBan, unMute } = data;
        
        if (ban > 0) {
            let dateBan = new Date;
            dateBan.setDate(dateBan.getDate() + ban);
            role.ban = dateBan;
        }
        if(unBan) {
            role.ban = null;
        }
        if (mute > 0) {
            let dateMute = new Date;
            dateMute.setDate(dateMute.getDate() + mute)
            role.mute = dateMute;
        }
        if (unMute) {
            role.mute = null;
        }
       const newRole: RoleUserI =  await this.roleUserRepository.save(role);
       return newRole;
    }

    async findUserByChannel(channel: ChannelI, userId: string): Promise<RoleUserI> {
        return this.roleUserRepository.findOne({where: { channel: channel, userId: userId }});
    }
}