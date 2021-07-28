import { EntityRepository, Repository } from "typeorm";
import { User } from './entities/user.entity'
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { ConflictException } from "@nestjs/common";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

	async createUser(userData: CreateUserDto): Promise<Partial<User>> {
		const user = this.create(userData);

		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(user.password, salt);

		try {
			await this.save(user);
		} catch(e) {
			throw new ConflictException('Username or email already exist')
		}
		return {
			userId: user.userId,
			username: user.username,
			email: user.email
		}
	}
}