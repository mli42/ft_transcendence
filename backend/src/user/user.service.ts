import { Injectable, ConflictException, UnauthorizedException, UploadedFile, Res, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { User42Dto } from './dto/user42.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
	) {}

	async signUp(userData: CreateUserDto): Promise<{accessToken: string}> {
		const {username, password } = userData;
		const user: Promise<User> = this.usersRepository.createUser(userData);

		if (await bcrypt.compare(password, (await user).password)) {
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			return {accessToken};
        } else {
            throw new InternalServerErrorException('access token creation error')
        }
	}

	async validateUser42(userData: User42Dto) {
		const { username } = userData;
		const user = await this.usersRepository.findOne({username});
		// console.log(user);
		if (user)
			return user;
		const newUser = await this.createUser42(userData);
		// console.log(newUser);
		return newUser;
	}

	createUser42(userData: User42Dto) {
		return this.usersRepository.createUser42(userData)
	}

	findUser42(username: string): Promise<User | undefined> {
		return this.usersRepository.findOne({username});
	}

	async signIn(id: string, password: string): Promise<{accessToken: string}> {
		let user: User = undefined;

		user = await this.usersRepository.findOne({username: id});
		if (user === undefined) {
			user = await this.usersRepository.findOne({email: id});
		}
		const username = user.username;
		if (user && (await bcrypt.compare(password, user.password))) {
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
	}

	getUserWithFilters(filterDto: GetUserFilterDto): Promise<User[]> {
		return this.usersRepository.getUsersWithFilters(filterDto);
	}

	updateUser(updateUser: UpdateUserDto, user: User): Promise<User> {
		return this.usersRepository.updateUser(updateUser, user);
	}

	async deleteUser(id: string): Promise<void> {
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
}