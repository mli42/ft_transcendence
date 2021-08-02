import { Injectable, ConflictException, UnauthorizedException, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
	) {}

	async signUp(userData: CreateUserDto): Promise<Partial<User>> {
		return this.usersRepository.createUser(userData)
	}

	async signIn(userAuth: AuthCredentialsDto): Promise<{accessToken: string}> {
		const {username, email, password} = userAuth;
		let user: User = undefined;

		if (username != undefined) {
			user = await this.usersRepository.findOne({username});
		} else if (email != undefined) {
			user = await this.usersRepository.findOne({email});
		}

		if (user && (await bcrypt.compare(password, user.password))) {
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
	}

	async uploadImage(@UploadedFile() file, user: User): Promise<string> {
		return this.usersRepository.saveImage(file, user);
	}
}