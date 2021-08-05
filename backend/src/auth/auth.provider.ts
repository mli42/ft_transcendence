import { User42Dto } from "../user/dto/user42.dto";

export interface AuthenticationProvider {
	validateUser(userData: User42Dto);
	createUser(userData: User42Dto);
	findUser(username: string);
}