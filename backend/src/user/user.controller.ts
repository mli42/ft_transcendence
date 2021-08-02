import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Get, Request, Patch, Param, Query, Delete } from "@nestjs/common"
import { UserService } from "./user.service";
import { User } from './entities/user.entity';
import { CreateUserDto } from "./dto/user.dto";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ApiConflictResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Observable, of } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import path = require("path")
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUserFilterDto } from "./dto/get-user-filter.dto";

export const storage = {
	storage: diskStorage({
		destination: 'upload/profileImage',
		filename: (req, file, cb) => {
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;
			cb(null, `${filename}${extension}`)
		}
	}),
}

@ApiTags('users')
@Controller('api/user')
export class UserController {
	constructor (
		private readonly userService: UserService,
	) {}

    @ApiOkResponse({description: 'User Sign Up'})
    @ApiConflictResponse({description: 'Username or email already exist'})
	@Post('/signup')
	async signUp(@Body() userData: CreateUserDto): Promise<Partial<User>> {
		return this.userService.signUp(userData);
	}

	@ApiOkResponse({description: 'User Sign In'})
    @ApiUnauthorizedResponse({description: 'Please check your login credentials'})
	@Post('/signin')
	async signIn(@Body() userAuth: AuthCredentialsDto): Promise<{accessToken: string}> {
		return this.userService.signIn(userAuth);
	}

	@ApiOkResponse({description: 'User Search'})
	@Get('/search')
	getUser(@Query() filterDto: GetUserFilterDto): Promise<User[]> {
		return this.userService.getUserWithFilters(filterDto);
	}

	@ApiOkResponse({description: 'User Update'})
	@UseGuards(AuthGuard())
	@Patch('/settings')
	updateUser(@Body() updateUser: UpdateUserDto, @Request() req): Promise<User> {
		const user: User = req.user;
		return this.userService.updateUser(updateUser, user);
	}

	@ApiOkResponse({description: 'User Delete'})
	@UseGuards(AuthGuard())
	@Delete('/delete')
	deleteUser(@Request() req): Promise<void> {
		const user_id = req.user.userId;
		console.log(req.user);
		console.log(user_id);
		return this.userService.deleteUser(user_id);
	}


	@ApiOkResponse({description: 'User Upload Image'})
	@UseGuards(AuthGuard())
	@Post('/upload')
	@UseInterceptors(FileInterceptor('file', storage))
	uploadImage(@UploadedFile() file, @Request() req): Promise<string> {
		const user: User = req.user;
		return this.userService.uploadImage(file, user);
	}
}