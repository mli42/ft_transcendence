import { EntityRepository, Repository } from "typeorm";
import { User } from './entities/user.entity'
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { ConflictException, ForbiddenException, HttpStatus, InternalServerErrorException, UnauthorizedException, UploadedFile } from "@nestjs/common";
import { GetUserFilterDto } from "./dto/get-user-filter.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User42Dto } from "./dto/user42.dto";
import { v4 as uuidv4 } from "uuid";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

	randomHexColorCode(): string {
		let n = (Math.random() * 0xfffff * 1000000).toString(16);
		return '#' + n.slice(0, 6);
	}

	async replaceColor(): Promise<string> {
		const replaceColor = require('replace-color')
		let nameProfilePicture= "";

		await replaceColor({
		  image: process.env.DEFAULT_PROFILE_PICTURE,
		  colors: {
		    type: 'hex',
		    targetColor: '#00FF2A',
		    replaceColor: this.randomHexColorCode()
		  }
		}).then((jimpObject) => {
			nameProfilePicture = 'deluxe_pong_default_picture_' + uuidv4() + '.png';
			let pathProfilePicture = "../upload/image/" + nameProfilePicture;
		    jimpObject.write(pathProfilePicture, (err) => {
		      if (err) return console.log(err)
		    })
		  })
		  .catch((err) => {
		    console.log(err)
		  })
		return nameProfilePicture;
	}

	generateProfilePicture(): Promise<string> {
		return this.replaceColor();
	}

	async createUser(userData: CreateUserDto): Promise<User> {
		const user = this.create(userData);

		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);
		user.friends = [];
		user.profile_picture = await this.generateProfilePicture();

		const numberUsers = await this.createQueryBuilder('user').getCount().catch(() => 0);
		if (numberUsers === 0)
			user.isAdmin = true;
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

	async createUser42(userData: User42Dto): Promise<User> {
		const user: User = this.create(userData);
		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);
		user.friends = [];
		user.login42 = userData.login42;
		user.profile_picture = await this.generateProfilePicture();
		const numberUsers = await this.createQueryBuilder('user').getCount().catch(() => 0);
		if (numberUsers === 0)
			user.isAdmin = true;
		return this.save(user);
	}

	async getUsersWithFilters(filterDto: GetUserFilterDto):  Promise<Partial<User[]>> {
		const {
			username,
			email,
		} = filterDto;
		const query = this.createQueryBuilder('user') .select([
			"user.userId",
			"user.username",
			"user.profile_picture",
			"user.elo",
			"user.game_won",
			"user.lost_game",
			"user.ratio",
			"user.status"
		]);

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

	async updateUser(updateUser: UpdateUserDto, user: User): Promise<boolean> {
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
			const salt = await bcrypt.genSalt();
			user.password = await bcrypt.hash(password, salt);
		}
		try {
			await this.save(user);
			return true;
		} catch (e) {
			if (e.code == '23505')
				throw new InternalServerErrorException('Username or email already taken');
			throw new InternalServerErrorException();
		}
	}

	deleteOldImage(image: string) {
		let fs = require('fs');
		let filePath = "../upload/image/" + image;
		fs.stat(filePath, function (err, stats) {
			// console.log(stats);
			if (err) {
				return console.error(err);
			}
			fs.unlinkSync(filePath);
		})
	}

	async saveImage(@UploadedFile() file, user: User): Promise<string> {
		if (!file?.filename)
			throw new ForbiddenException('Only image files are allowed !');

		this.deleteOldImage(user.profile_picture);
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

	async updateBlockUser(block: boolean, user: User, userToBlock: User): Promise<User> {
		const userFound = user.blockedUsers.find(element => element === userToBlock.userId)
		if (block === true && !userFound)
		{
			user.blockedUsers.push(userToBlock.userId);
			try {
				await this.save(user);
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('add blocked user');
			}
		}
		if (block === false && userFound) {
			const index = user.blockedUsers.indexOf(userToBlock.userId);
			user.blockedUsers.splice(index, 1);
			try {
				await this.save(user);
			} catch (error) {
				console.log(error);
				throw new InternalServerErrorException('add blocked user');
			}
		}
		return user;
	}
}