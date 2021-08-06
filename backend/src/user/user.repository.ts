import { EntityRepository, Repository } from "typeorm";
import { User } from './entities/user.entity'
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { ConflictException, HttpStatus, InternalServerErrorException, UnauthorizedException, UploadedFile } from "@nestjs/common";
import { GetUserFilterDto } from "./dto/get-user-filter.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User42Dto } from "./dto/user42.dto";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

	async createUser(userData: CreateUserDto): Promise<User> {
		const user = this.create(userData);

		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);
		user.friends = [];

		try {
			await this.save(user);
		} catch(error) {
			if (error.code === '23505') {
				throw new ConflictException('Username or email already exist')
			} else {
				console.log(error);
				throw new InternalServerErrorException();
			}
		}
		return user;
	}

	async createUser42(userData: User42Dto): Promise<Partial<User>> {
		console.log("Creating user");
		const user = this.create(userData);
		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);
		user.friends = [];
		return this.save(user);
	}

	async getUsersWithFilters(filterDto: GetUserFilterDto): Promise<User[]> {
		const {
			username,
			email,
			elo,
			status,
		} = filterDto;
		const query = this.createQueryBuilder('user');

		if (username) {
			query.andWhere(
				'user.username LIKE :username', { username: `%${username}%` });
		} else if (email) {
			query.andWhere(
				'user.email like :email', { email: `%${email}%` });
		}
		const users = await query.getMany();
		return users;
	}

	async updateUser(updateUser: UpdateUserDto, user: User): Promise<User> {
		const {
			username,
			email,
			password,
		} = updateUser;

		if (username) {
			user.username = username;
		} if (email) {
			user.email = email;
		} if (password) {
			user.password = password;
		}
		try {
			await this.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
		return user;
	}

	async saveImage(@UploadedFile() file, user: User): Promise<string> {
		user.profile_picture = file.filename;
		try {
			await this.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
		return file.filename;
	}

	async addFriend(friend: string, user: User): Promise<void> {
		const found = user.friends.find(element => element === friend)
		if (found != undefined) {
			throw new UnauthorizedException({
				status: HttpStatus.FORBIDDEN,
				error: 'the user is already in your friend list',});
		}
		user.friends.push(friend);
		try {
			await this.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}

	async deleteFriend(friend: string, user: User): Promise<void> {
		const index = user.friends.indexOf(friend);
		if (index !== -1) {
			user.friends.splice(index, 1);
		} else {
			throw new UnauthorizedException({
				status: HttpStatus.FORBIDDEN,
				error: 'user id isn\'t in your friends list',});
		}
		try {
			await this.save(user);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}
}