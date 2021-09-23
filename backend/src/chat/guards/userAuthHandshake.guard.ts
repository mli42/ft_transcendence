import { Injectable, CanActivate } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { parse } from 'cookie';
import { JwtPayload } from '../../user/interfaces/jwt-payload.interface'
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../user/user.repository';

@Injectable()
export class UserAuthHandshake implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepository: UsersRepository
    ) {}

    async canActivate(context: any): Promise<boolean> {
		const cookie = context.args[0].handshake.headers['cookie'];
		const { jwt: token } = parse(cookie);
		const payload: JwtPayload = this.jwtService.verify(token, {secret: process.env.SECRET_JWT});
		const {username} = payload;
		const user: User = await this.usersRepository.findOne({username});

        if (user.isBan === true) {
            return false;
        }
        if (payload['auth'] === false && user.twoFactorAuth === true) {
            return false;
        }
        return true;
    }
}