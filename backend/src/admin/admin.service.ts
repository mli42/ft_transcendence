import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UsersRepository } from 'src/user/user.repository';

@Injectable()
export class AdminService {
    constructor (
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
    ) {}

    async getNumbersUsers(): Promise<number> {
        const query = await this.usersRepository.createQueryBuilder('user').getCount()
        return query;
    }

    async getAllAdmin(): Promise<Partial<User[]>> {
        const query = await this.usersRepository.createQueryBuilder('user')
        .andWhere('user.isAdmin = :isAdmin', {isAdmin: true}).select([
            "user.userId",
            "user.username",
            "user.status"
        ]).getMany();
        return query;
    }
}
