import { Controller, Get, Param, Post, Res, UseGuards, Req } from '@nestjs/common'
import { Response, Request } from 'express';
import {  IntraAuthGuard } from './guards/auth.guard';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
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

	@ApiOperation({summary: 'Authentication with 42 Api'})
	@Get('42/login')
	@UseGuards(IntraAuthGuard)
	login() {
	}

	@ApiOperation({summary: 'Redirection to front home page after 42 authentication'})
	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	async redirect(@Res({passthrough: true}) res: Response, @Req() req: Request) {
		const username = req.user['username'];
		const payload: JwtPayload = { username };
		const accessToken: string = await this.jwtService.sign(payload);
		res.cookie('jwt', accessToken, {httpOnly: true});
		res.redirect("http://localhost:3030");
	}

	// two factor authentication
	@ApiOperation({summary: 'QR code authentication - User'})
	@ApiParam({name: 'username', required: true, description: 'username'})
	@ApiParam({name: 'userId', required: true, description: 'userId'})
	@Get('2fa/:username/:userId')
	async getQrcode(@Param('username') username, @Param('userId') userId) {
	  const resp = await this.httpService.get(
		  `https://www.authenticatorApi.com/pair.aspx?AppName=${process.env.TWO_FACTOR_AUTH_APP_NAME}&AppInfo=${username}&SecretCode=${userId}`,
		).toPromise();
	  return resp.data;
	}

	@ApiOperation({summary: 'Code authentication - Secret'})
	@ApiParam({name: 'secret', required: true, description: 'Code authentication - Google Authenticator'})
	@ApiParam({name: 'userId', required: true, description: 'userId'})
	@Post('2fa/:secret/:userId')
	async validate(@Param('secret') secret, @Param('userId') userId) {
	  const resp = await this.httpService.get(
		  `https://www.authenticatorApi.com/Validate.aspx?Pin=${secret}&SecretCode=${userId}`,
		).toPromise();
	  return resp.data;
	}

}