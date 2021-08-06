import { Controller, Get, Param, Post, Res, UseGuards, Req } from '@nestjs/common'
import { Response, Request } from 'express';
import { AuthenticatedGuard, IntraAuthGuard } from './guards/auth.guard';
import { ApiTags } from '@nestjs/swagger'
import { HttpService } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity'

@ApiTags('42 authentication')
@Controller('api/auth/')
export class AuthController {
	constructor (
		private httpService: HttpService,
		private readonly userService: UserService
	) {}

	@Get('42/login')
	@UseGuards(IntraAuthGuard)
	login() {
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		res.redirect('http://localhost:3030/');
	}

	@Get('42/status')
	@UseGuards(AuthenticatedGuard)
	status(@Req() req) {
		return req.user;
	}

	@Get('42/logout')
	@UseGuards(AuthenticatedGuard)
	logout(@Req() req: Request) {
		req.logOut();
	}

	// two factor authentication
	@Get('2fa/:user')
	async getQrcode(@Param('user') user, @Param('code') code) {
	  const resp = await this.httpService.get(
		  `https://www.authenticatorApi.com/pair.aspx?AppName=${process.env.TWO_FACTOR_AUTH_APP_NAME}
		  &AppInfo=${user}
		  &SecretCode=${process.env.TWO_FACTOR_AUTH_SECRET_CODE}`,
		).toPromise();
	  return resp.data;
	}

	@Post('2fa/:secret')
	async validate(@Param('secret') secret) {
	  const resp = await this.httpService.get(
		  `https://www.authenticatorApi.com/Validate.aspx?Pin=${secret}
		  &SecretCode=${process.env.TWO_FACTOR_AUTH_SECRET_CODE}`,
		).toPromise();
	  return resp.data;
	}

}