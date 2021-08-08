import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios';
import { Strategy, Profile } from 'passport-42'
import { AuthService } from '../auth.service';
import { User } from "../../user/entities/user.entity"

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private readonly authService: AuthService,
		private httpService: HttpService
	) {
		super({
			clientID: process.env.UID,
			clientSecret: process.env.SECRET,
			callbackURL: "http://localhost:3000/api/auth/redirect",
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
		const  { username } = profile;
		const user = {
			username: username,
			email: profile['emails'][0]['value'],
			password: username,
		} 
		return this.authService.validateUser(user);
	}
}