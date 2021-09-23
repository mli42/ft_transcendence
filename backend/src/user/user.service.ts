import { Injectable, UnauthorizedException, NotFoundException, UploadedFile, Res, InternalServerErrorException, Req, ConsoleLogger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, SigInUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { User42Dto } from './dto/user42.dto';
import { Response, Request } from 'express';
import { UserModule } from './user.module';
import { GameHistory } from 'src/game/entities/gameHistory.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
	) {}

	async signUp(userData: CreateUserDto, @Res({passthrough: true}) res: Response): Promise<{accessToken: string}> {
		const {username, password } = userData;
		const user: Promise<User> = this.usersRepository.createUser(userData);
		if (await bcrypt.compare(password, (await user).password)) {
			let auth: boolean = false;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
			return {accessToken};
        } else {
            throw new InternalServerErrorException('access token creation error')
        }
	}

	async validateUser42(userData: User42Dto): Promise<User> {
		let user: User = undefined;

		const { login42 } = userData;
		user = await this.usersRepository.findOne({login42: login42});
		if (user)
			return user;
		let { username } = userData;
		user = await this.usersRepository.findOne({username});
		if (user)
		{
			const rand = Math.random().toString(16).substr(2, 5);
			username = username + '-' + rand;
			userData.username = username;
		}
		const newUser: User = await this.createUser42(userData);
		return newUser;
	}

	createUser42(userData: User42Dto): Promise<User>{
		return this.usersRepository.createUser42(userData)
	}

	async signIn(userData: SigInUserDto, @Res({passthrough: true}) res: Response): Promise<{accessToken: string}> {
		const {id, password } = userData;
		let user: User = undefined;

		user = await this.usersRepository.findOne({username: id});
		if (user === undefined) {
			user = await this.usersRepository.findOne({email: id});
		}
		if (user && (await bcrypt.compare(password, user.password))) {
			const username = user.username;
			let auth: boolean = false;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
			return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
	}

	async currentUser(user: User): Promise<Partial<User>>{
		let userFound: User = undefined;
		userFound = await this.usersRepository.findOne(user.userId);
		if (!user)
			throw new NotFoundException('No user found');
		let { password, ...res } = user;
		return res;
	}

	async userInfo(username: string): Promise<Partial<User>> {
		let user: User = undefined;
		user = await this.usersRepository.findOne({username: username});
		if (!user)
			throw new NotFoundException('No user found');
		let { password, ...res } = user;
		return res;
	}

	async getPartialUserInfo(id: string): Promise<Partial<User>> {
		let user: User = undefined;

		user = await this.usersRepository.findOne({userId: id});
		if (!user)
			return user;
		return {
			userId: user.userId,
			username: user.username,
			elo: user.elo,
			profile_picture: user.profile_picture,
		}
	}

	getUserWithFilters(filterDto: GetUserFilterDto):  Promise<Partial<User[]>> {
		return this.usersRepository.getUsersWithFilters(filterDto);
	}

	async updateUser(updateUser: UpdateUserDto, user: User, @Res({passthrough: true}) res: Response): Promise<void> {
		const { username } = updateUser;

		const updated: boolean = await this.usersRepository.updateUser(updateUser, user);
		if (updated === true && username !== undefined)
		{
		   	let auth: boolean = true;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
		}
	}

	async deleteUser(id: string, @Res({passthrough: true}) res: Response): Promise<void> {
		const query = await this.usersRepository.createQueryBuilder('user').getMany();

		for (const user of query) {
			if (user.friends.indexOf(id) > -1) {
				this.deleteFriend(id, user);
			}
		}
		res.clearCookie('jwt');
		const result = await this.usersRepository.delete(id);
	}

	uploadImage(@UploadedFile() file, user: User): Promise<string> {
		return this.usersRepository.saveImage(file, user);
	}

	async getProfilePicture(@Res() res, profilePicture: string): Promise<Observable<object>> {
		let fs = require('fs');
		let files = fs.readdirSync('../upload/image/');
		if (Object.values(files).indexOf(profilePicture) === -1) {
			return of(res.sendFile(join(process.cwd(), process.env.DEFAULT_PROFILE_PICTURE)));
		}
		return of(res.sendFile(join(process.cwd(), '../upload/image/' + profilePicture)));
	}

	addFriend(friend: string, user: User): Promise<void> {
		return this.usersRepository.addFriend(friend, user);
	}

	deleteFriend(friend: string, user: User): Promise<void> {
		return this.usersRepository.deleteFriend(friend, user);
	}

	async getFriendList(user: User): Promise<object> {
		let i = 0;
		let friendList = [];
		while (user.friends[i]) {

			await this.getPartialUserInfo(user.friends[i]).then(function(result) {
				friendList.push(result);
				i++;
			});
		}
		return friendList;
	}

	getTwoFactorAuth(user: User): boolean {
		return user.twoFactorAuth;
	}

	async updateTwoFactorAuth(bool: boolean, user: User, res: Response): Promise<void> {
		user.twoFactorAuth = bool;
		const username = user.username;
		try {
			await this.usersRepository.save(user);
			let auth: boolean = true;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	async getIsBan(userId: string, userIsAdmin: User): Promise<boolean> {
		let user: User = undefined;

		// if (userIsAdmin.isAdmin === false)
		// 	throw new UnauthorizedException('You aren\'t an administrator');
		user = await this.usersRepository.findOne({userId: userId});
		if (!user)
			throw new NotFoundException('No user found');
		return user.isBan;
	}

	async updateIsBan(bool: boolean, userId: string, userIsAdmin: User): Promise<void> {
		let user: User = undefined;

		if (userIsAdmin.userId === userId) {
			throw new UnauthorizedException('Cannot change your own banned state');
		}

		user = await this.usersRepository.findOne({userId: userId});
		if (!user)
			throw new NotFoundException('No user found');

		user.isBan = bool;
		try {
			await this.usersRepository.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	async getIsAdmin(userId: string, userIsAdmin: User): Promise<boolean> {
		let user: User = undefined;

		user = await this.usersRepository.findOne({userId: userId});
		if (!user)
			throw new NotFoundException('No user found');
		return user.isAdmin;
	}

	async updateIsAdmin(bool: boolean, userId: string, userIsAdmin: User): Promise<void> {
		let user: User = undefined;

		if (userIsAdmin.userId === userId) {
			throw new UnauthorizedException('Cannot change your own admin state');
		}

		user = await this.usersRepository.findOne({userId: userId});
		if (!user)
			throw new NotFoundException('No user found');

		user.isAdmin = bool;
		try {
			await this.usersRepository.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	async getGameHistory(userId: string): Promise<GameHistory[]> {
		const user = await this.usersRepository.findOne({userId: userId});
		return user.game_history;
	}

	calculElo(eloPlayerWin: string, eloPlayerLoose: string): number {
		let EloRating = require('elo-rating');

		let elo = EloRating.calculate(parseInt(eloPlayerWin), parseInt(eloPlayerLoose));
		return elo.playerRating - parseInt(eloPlayerWin);
	}

	updateBlockUser(block: boolean, user: User, userToBlock: User): Promise<User> {
		return this.usersRepository.updateBlockUser(block, user, userToBlock);
	}
}