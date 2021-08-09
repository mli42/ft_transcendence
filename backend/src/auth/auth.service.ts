import { Injectable } from "@nestjs/common";
import { User42Dto } from "../user/dto/user42.dto";
import { UserService } from "../user/user.service"
import { User } from "../user/entities/user.entity"

@Injectable()
export class AuthService{
	constructor(private userService: UserService) {}

	async validateUser(userData: User42Dto): Promise<User>{
		return this.userService.validateUser42(userData);
	}

	createUser(userData: User42Dto): Promise<User> {
		return this.userService.createUser42(userData);
	}
}
