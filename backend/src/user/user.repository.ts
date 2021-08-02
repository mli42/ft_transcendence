import { EntityRepository, Repository } from "typeorm";
import { User } from './entities/user.entity'
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException, UploadedFile } from "@nestjs/common";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

	async createUser(userData: CreateUserDto): Promise<Partial<User>> {
		const user = this.create(userData);
		user.profile_picture = "empty";

		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);
		user.auth = false;

		try {
			await this.save(user);
		} catch(error) {
			if (error.code === '23505') { //duplicate username or email
				throw new ConflictException('Username or email already exist')
			} else {
				console.log(error);
				throw new InternalServerErrorException();
			}
		}
		return {
			userId: user.userId,
			username: user.username,
			email: user.email
		}
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
}