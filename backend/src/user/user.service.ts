import { Injectable, UnauthorizedException, NotFoundException, UploadedFile, Res, InternalServerErrorException, Req, ConsoleLogger } from '@nestjs/common';
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
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
			return {accessToken};
        } else {
            throw new InternalServerErrorException('access token creation error')
        }
	}

	async validateUser42(userData: User42Dto): Promise<User> {
		const { username } = userData;
		const user = this.usersRepository.findOne({username});
		if (user)
			return user;
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
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
			return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
	}

	async currentUser(user: User): Promise<User> {
		let userFound: User = undefined;
		userFound = await this.usersRepository.findOne(user.userId);
		if (!user)
			throw new NotFoundException('No user found');
		return userFound;
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
		return {
			userId: user.userId,
			username: user.username,
			profile_picture: user.profile_picture,
		}
	}

	getUserWithFilters(filterDto: GetUserFilterDto): Promise<User[]> {
		return this.usersRepository.getUsersWithFilters(filterDto);
	}

	async updateUser(updateUser: UpdateUserDto, user: User, @Res({passthrough: true}) res: Response): Promise<User> {
		const { username } = updateUser;
		if(username)
		{
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
		}
		return this.usersRepository.updateUser(updateUser, user);
	}

	async deleteUser(id: string, @Res({passthrough: true}) res: Response): Promise<void> {
		res.clearCookie('jwt');
		const result = await this.usersRepository.delete(id);
	}

	uploadImage(@UploadedFile() file, user: User): Promise<string> {
		return this.usersRepository.saveImage(file, user);
	}

	getProfilePicture(@Res() res, picture: string): Observable<object> {
		return of(res.sendFile(join(process.cwd(), '../upload/image/' + picture)));
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
}