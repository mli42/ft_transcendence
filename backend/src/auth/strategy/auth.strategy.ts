import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy, Profile, CallBack } from 'passport-42'
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		// @InjectRepository(UserService)
		private userService: UserService
	) {
		super({
			clientID: process.env.UID,
			clientSecret: process.env.SECRET,
			callbackURL: "http://localhost:3000/api/auth/redirect",
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, cb: CallBack){
		// console.log(profile);
		const  { username, displayName, emails } = profile;
		const user = {username, displayName, emails, accessToken, refreshToken};
		// console.log(user);

		// Create user
		const email = user['emails'][0]['value'];
		const newUser = { username, email };
		// console.log(newUser);

		this.userService.signUp42(newUser);
		return cb(null, user);
	}
}