import { Controller, Get, Param, Post, Res, UseGuards, Req } from '@nestjs/common'
import { Response, Request } from 'express';
import {  IntraAuthGuard } from './guards/auth.guard';
import { ApiTags } from '@nestjs/swagger'
import { HttpService } from '@nestjs/axios';
import { JwtPayload } from '../user/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@ApiTags('42 authentication')
@Controller('api/auth/')
export class AuthController {
	constructor (
		private httpService: HttpService,
		private jwtService: JwtService,
	) {}

	@Get('42/login')
	@UseGuards(IntraAuthGuard)
	login() {
	}

	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	async redirect(@Res() res: Response, @Req() req: Request) {
		const username = req.user['username'];
		const payload: JwtPayload = { username };
		const accessToken: string = await this.jwtService.sign(payload);
		res.cookie('jwt', accessToken, {httpOnly: true});
	}

	@Get('42/status')
	// @UseGuards(AuthenticatedGuard)
	status(@Req() req: Request) {

		return req.user;
	}

	@Get('42/logout')
	// @UseGuards(AuthenticatedGuard)
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