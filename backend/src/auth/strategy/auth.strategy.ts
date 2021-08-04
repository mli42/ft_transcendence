import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy, Profile, CallBack } from 'passport-42'
import { UserService } from 'src/user/user.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor() {
		super({
			clientID: process.env.UID,
			clientSecret: process.env.SECRET,
			callbackURL: "http://localhost:3000/api/auth/redirect",
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, cb: CallBack){
		// console.log(profile);
		const  { username, displayName, name } = profile;
		const user = {username, displayName, name, accessToken, refreshToken};
		console.log(user);
		// this.userService.signUp(newuser);
		return cb(null, user);
	}
}