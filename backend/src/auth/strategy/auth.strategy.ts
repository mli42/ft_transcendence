import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy, Profile, CallBack } from 'passport-42'
import { UserService } from 'src/user/user.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		// @InjectRepository(UserService)
		// private readonly userService: UserService
		private readonly userService: UserService
	) {
		super({
			clientID: process.env.UID,
			clientSecret: process.env.SECRET,
			callbackURL: "http://localhost:3000/api/auth/redirect",
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, cb: CallBack) {
		// console.log(profile);
		const  { username, displayName, emails } = profile;
		const user = {username, displayName, emails, accessToken, refreshToken};
		// console.log(user);

		// Create user
		const email = user['emails'][0]['value'];
		const password = "Password1234*";
		const newUser = { username, email, password };
		// console.log(newUser);
		return this.userService.validateUser42(newUser);

		// return this.userService.signUp42(newUser);
		// return cb(null, user);
	}
}