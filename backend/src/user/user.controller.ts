import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Get, Req, Patch, Param, Query, Delete, Res } from "@nestjs/common"
import { UserService } from "./user.service";
import { User } from './entities/user.entity';
import { CreateUserDto, SigInUserDto } from "./dto/user.dto";
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Observable, of } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import path = require("path")
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUserFilterDto } from "./dto/get-user-filter.dto";
import { Response, Request } from 'express';
import { join } from "path";

export const storage = {
	storage: diskStorage({
		destination: '/upload/image',
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

	@ApiOperation({description: 'User Sign Up - Password : uppercase, lowercase, number and special character'})
    @ApiOkResponse({description: 'access token'})
    @ApiConflictResponse({description: 'Username or email already exist'})
	/*******/
	@Post('/signup')
	async signUp(@Body() userData: CreateUserDto, @Res({passthrough: true}) res: Response): Promise<{accessToken: string}> {
		return this.userService.signUp(userData, res);
	}

	@ApiOperation({description: 'User Sign In'})
	@ApiOkResponse({description: 'access token'})
    @ApiUnauthorizedResponse({description: 'Please check your login credentials'})
	/*******/
	@Post('/signin')
	async signIn(@Body() userData: SigInUserDto, @Res({passthrough: true}) res: Response): Promise<{accessToken: string}> {
		return this.userService.signIn(userData, res);
	}

	@ApiOperation({description: 'Partial User Information'})
	@ApiOkResponse({description: 'Partial User Information'})
	@ApiBearerAuth()
	/*******/
	@UseGuards(AuthGuard())
	@Get('/partialInfo')
	getPartialUserInfo(@Body('userId') userId: string): Promise<Partial<User>> {
		return this.userService.getPartialUserInfo(userId);
	}

	@ApiOperation({description: 'Search User by name or email'})
	@ApiQuery({name:'username',required:false})
	@ApiBearerAuth('accessToken')
	/*******/
	@UseGuards(AuthGuard())
	@Get('/search')
	getUserWithFilters(@Query() filterDto: GetUserFilterDto): Promise<User[]> {
		return this.userService.getUserWithFilters(filterDto);
	}

	@ApiOperation({
		summary: 'Update user info',
		description: 'Update username, email or password'
	})
	@ApiOkResponse({description: 'User account'})
	@ApiBearerAuth('accessToken')
	/*******/
	@UseGuards(AuthGuard())
	@Patch('/settings')
	updateUser(@Body() updateUser: UpdateUserDto, @Req() req): Promise<User> {
		const user: User = req.user;
		return this.userService.updateUser(updateUser, user);
	}

	@ApiOperation({
		summary: 'delete user account',
		description: 'Delete : User who wants to delete is account'
	})
	@ApiOkResponse({description: 'User Delete'})
	@ApiBearerAuth('accessToken')
	/*******/
	@UseGuards(AuthGuard())
	@Delete('/delete')
	deleteUser(@Req() req): Promise<void> {
		const user_id = req.user.userId;
		return this.userService.deleteUser(user_id);
	}

	@ApiOperation({summary: 'Upload profil picture'})
	@ApiOkResponse({description: 'Picture File'})
	@ApiBearerAuth()
	/*******/
	@UseGuards(AuthGuard())
	@Post('/upload')
	@UseInterceptors(FileInterceptor('file', storage))
	uploadImage(@UploadedFile() file, @Req() req): Promise<string> {
		const user: User = req.user;
		return this.userService.uploadImage(file, user);
	}

	@ApiOperation({summary: 'User Get Profile Picture'})
	@ApiOkResponse({description: 'Picture File'})
	@ApiBearerAuth()
	/*******/
	@UseGuards(AuthGuard())
	@Get('/profile-picture')
	getProfilePicture(@Res() res, @Req() req): Observable<object> {
		const user: User = req.user;
		return this.userService.getProfilePicture(res, user.profile_picture);
	}

	@ApiOperation({summary: 'User Add Friend'})
	@ApiBearerAuth()
	/*******/
	@UseGuards(AuthGuard())
	@Patch('/addFriend')
	addFriend(@Body('friend') friend: string, @Req() req): Promise<void> {
		const user: User = req.user;
		return this.userService.addFriend(friend, user);
	}

	@ApiOperation({summary: 'User Delete Friend'})
	@ApiBearerAuth()
	/*******/
	@UseGuards(AuthGuard())
	@Delete('/deleteFriend')
	deleteFriend(@Body('friend') friend: string, @Req() req): Promise<void>  {
		const user: User = req.user;
		return this.userService.deleteFriend(friend, user);
	}

	@ApiOperation({summary: 'Show Friends'})
	@ApiOkResponse({description: 'Friends List'})
	@ApiBearerAuth()
	/*******/
	@UseGuards(AuthGuard())
	@Get('/friendList')
	getFriendList(@Req() req): Promise<object> {
		const user: User = req.user;
		return this.userService.getFriendList(user);
	}
}