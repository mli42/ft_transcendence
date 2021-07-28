import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Strategy, Profile, CallBack } from 'passport-42'

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
	constructor() {
		super({
			clientID: "YOUR_CLIENT_ID",
			clientSecret: "YOUR_SECRET",
			callbackURL: "http://localhost:3000",
			scope: ['public']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, cb: CallBack){ 
		const  { username } = profile;
		const user = {username, accessToken, refreshToken};
		console.log(user);

		return cb(null, user);
	}
}