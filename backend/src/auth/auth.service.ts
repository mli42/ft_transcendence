import { Injectable } from "@nestjs/common";
import { AuthenticationProvider } from "./auth.provider";
import { User42Dto } from "../user/dto/user42.dto";
import { UserService } from "../user/user.service"
import { User } from "../user/entities/user.entity"

@Injectable()
export class AuthService implements AuthenticationProvider{
<<<<<<< HEAD
	constructor(		
=======
	constructor(
		// @InjectRepository(UserService)
>>>>>>> 1cdb132895532dce9db3d3b0944e570e5001e36d
		private userService: UserService
	) {}

	async validateUser(userData: User42Dto) {
		return this.userService.validateUser42(userData);
	}

	createUser(userData: User42Dto) {
		return this.userService.createUser42(userData);
	}
	findUser(username: string): Promise<User | undefined> {
		return this.userService.findUser42(username);
	}
}