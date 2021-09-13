import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy, Profile } from 'passport-42'
import { AuthService } from '../auth.service';
import { User } from "../../user/entities/user.entity"

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.UID,
			clientSecret: process.env.SECRET,
			callbackURL: process.env.IP_REDIRECT,
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
		const  { username } = profile;
		const user = {
			username: username,
			email: profile['emails'][0]['value'],
			password: username,
			login42: username
		}
		return this.authService.validateUser(user);
	}
}