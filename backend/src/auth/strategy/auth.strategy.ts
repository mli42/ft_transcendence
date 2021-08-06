import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { Strategy, Profile, CallBack } from 'passport-42'
import { AuthenticationProvider } from '../auth.provider';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthenticationProvider) {
		super({
			clientID: process.env.UID,
			clientSecret: process.env.SECRET,
			callbackURL: "http://localhost:3000/api/auth/redirect",
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, cb: CallBack) {
		const  { username } = profile;
		const user = {
			username: username,
			email: profile['emails'][0]['value'],
			password: username,
		}
		// console.log(user);
		return this.authService.validateUser(user);
	}
}