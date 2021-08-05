import { PassportSerializer } from "@nestjs/passport"
import { Inject, Injectable } from "@nestjs/common"
import { User } from '../../user/entities/user.entity'
import { AuthenticationProvider } from "../auth.provider";

export class SessionSerializer extends PassportSerializer {
	constructor(
		@Inject('AUTH_SERVICE')
		private readonly authService: AuthenticationProvider
	) {
		super();
	}

	serializeUser(user: User, done: (err: Error, user: User) => void) {
		done(null, user);
	}

	async deserializeUser(user: User, done: (err: Error, user: User) => void) {
		const userDb = await this.authService.findUser(user.username);
		return userDb ? done(null, userDb) : done(null, null);
	}
}