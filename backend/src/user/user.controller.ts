import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Get, Req, Patch, Param, Query, Delete, Res } from "@nestjs/common"
import { UserService } from "./user.service";
import { User } from './entities/user.entity';
import { CreateUserDto, SigInUserDto } from "./dto/user.dto";
import { ApiBody, ApiConflictResponse, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
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

	@ApiOperation({
		summary: 'Verify if User is Log in',
		description: 'Indique si un user est actuellement connecté en vérifiant l\'existance d\'un cookie'
	})
	@ApiOkResponse({description: 'True is a user is log in'})
	@ApiUnauthorizedResponse({description: 'Unauthorized if no cookie found'})
	@UseGuards(AuthGuard('jwt'))
	/*******/
	@Get('/isLogin')
	isLogin(@Req() req: Request): boolean{
		const token = req.cookies['jwt'];
		if (!token)
			return false;
		return true;
	}

	@ApiOperation({summary: 'Get all info of current user'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/currentUser')
	currentUser(@Req() req) : Promise<Partial<User>> {
		const user: User = req.user;
		return this.userService.currentUser(user);
	}

	@ApiOperation({summary: 'User Informations'})
	@ApiOkResponse({description: 'User Informations'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/userInfo')
	userInfo(@Query('username') username: string): Promise<Partial<User>> {
		return this.userService.userInfo(username);
	}

	@ApiOperation({summary: 'Partial User Information'})
	@ApiOkResponse({description: 'Partial User Information'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/partialInfo')
	getPartialUserInfo(@Query('userId') userId: string): Promise<Partial<User>> {
		return this.userService.getPartialUserInfo(userId);
	}

	@ApiOperation({summary: 'Search User by name or email'})
	@ApiQuery({name:'username',required:false})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/search')
	getUserWithFilters(@Query() filterDto: GetUserFilterDto):  Promise<Partial<User[]>> {
		return this.userService.getUserWithFilters(filterDto);
	}

	@ApiOperation({
		summary: 'Update user info',
		description: 'Update username, email or password'
	})
	@ApiOkResponse({description: 'User account'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Patch('/settings')
	updateUser(@Body() updateUser: UpdateUserDto, @Req() req, @Res({passthrough: true}) res: Response): Promise<void> {
		const user: User = req.user;
		return this.userService.updateUser(updateUser, user, res);
	}

	@ApiOperation({
		summary: 'delete user account',
		description: 'Delete : User who wants to delete is account'
	})
	@ApiOkResponse({description: 'User Delete'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Delete('/delete')
	deleteUser(@Req() req, @Res({passthrough: true}) res: Response): Promise<void> {
		const user_id = req.user.userId;
		return this.userService.deleteUser(user_id, res);
	}

	@ApiOperation({summary: 'Upload profil picture'})
	@ApiOkResponse({description: 'Picture File'})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			properties: {
				file: {
					type : 'string',
					format: 'binary',
				},
			},
		}
	})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Post('/upload/avatar')
	@UseInterceptors(FileInterceptor('file', storage))
	uploadImage(@UploadedFile() file, @Req() req): Promise<string> {
		const user: User = req.user;
		return this.userService.uploadImage(file, user);
	}

	@ApiOperation({summary: 'User Get Profile Picture'})
	@ApiOkResponse({description: 'Picture File'})
	@ApiParam({name: 'userId', required: true, description: 'userId'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/avatar/:userId')
	getProfilePicture(@Res() res, @Param('userId') userId): Promise<Observable<object>> {
		return this.userService.getProfilePicture(res, userId);
	}

	@ApiOperation({summary: 'User Add Friend'})
	@ApiConsumes('application/json')
	@ApiBody({
		schema: {
			properties: {
				userId: {
					type: 'string',
				}
			}
		}
	})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Patch('/addFriend')
	addFriend(@Body('userId') friend: string, @Req() req): Promise<void> {
		const user: User = req.user;
		return this.userService.addFriend(friend, user);
	}

	@ApiOperation({summary: 'User Delete Friend'})
	@ApiConsumes('application/json')
	@ApiBody({
		schema: {
			properties: {
				userId: {
					type: 'string',
				}
			}
		}
	})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Delete('/deleteFriend')
	deleteFriend(@Body('userId') friend: string, @Req() req): Promise<void>  {
		const user: User = req.user;
		return this.userService.deleteFriend(friend, user);
	}

	@ApiOperation({summary: 'Show Friends'})
	@ApiOkResponse({description: 'Friends List'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/friendList')
	getFriendList(@Req() req): Promise<object> {
		const user: User = req.user;
		return this.userService.getFriendList(user);
	}

	@ApiOperation({summary: 'Logout the user'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Delete('/logout')
	logout(@Res({passthrough: true}) res: Response) {
		res.clearCookie('jwt');
		return "User is logout";
	}

	@ApiOperation({summary: 'Get Boolean TwoFactorAuth'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/twoFactorAuth')
	getTwoFactorAuth(@Req() req): boolean {
		const user: User = req.user;
		return this.userService.getTwoFactorAuth(user);
	}

	@ApiOperation({summary: 'Update Two Factor Auth'})
	@ApiConsumes('application/json')
	@ApiBody({
		schema: {
			properties: {
				toggle: {
					type: 'boolean',
				}
			}
		}
	})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Patch('/updateTwoFactorAuth')
	updateTwoFactorAuth(@Body('toggle') bool: boolean, @Req() req): Promise<void> {
		const user: User = req.user;
		return this.userService.updateTwoFactorAuth(bool, user);
	}

	@ApiOperation({summary: 'Get Boolean isBan'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/isBan')
	getIsBan(@Query('userId') userId: string): Promise<boolean> {
		return this.userService.getIsBan(userId);
	}

	@ApiOperation({summary: 'Update isBan'})
	@ApiConsumes('application/json')
	@ApiBody({
		schema: {
			properties: {
				toggle: {
					type: 'boolean',
				}
			}
		}
	})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Patch('/updateIsBan')
	updateIsBan(@Body('toggle') bool: boolean, @Query('userId') userId: string): Promise<void> {
		return this.userService.updateIsBan(bool, userId);
	}

	@ApiOperation({summary: 'Get Boolean isAdmin'})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/isAdmin')
	getIsAdmin(@Query('userId') userId: string): Promise<boolean> {
		return this.userService.getIsAdmin(userId);
	}

	@ApiOperation({summary: 'Update isAdmin'})
	@ApiConsumes('application/json')
	@ApiBody({
		schema: {
			properties: {
				toggle: {
					type: 'boolean',
				}
			}
		}
	})
	/*******/
	@UseGuards(AuthGuard('jwt'))
	@Patch('/updateIsAdmin')
	updateIsAdmin(@Body('toggle') bool: boolean, @Query('userId') userId: string): Promise<void> {
		return this.userService.updateIsAdmin(bool, userId);
	}
}