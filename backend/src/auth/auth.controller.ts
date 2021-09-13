import { Controller, Get, Param, Post, Res, UseGuards, Req } from '@nestjs/common'
import { Response, Request } from 'express';
import {  IntraAuthGuard } from './guards/auth.guard';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { HttpService } from '@nestjs/axios';
import { JwtPayload } from '../user/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

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
		let auth: boolean = false;
		const payload: JwtPayload = { username, auth };
		const accessToken: string = await this.jwtService.sign(payload);
		res.cookie('jwt', accessToken, {httpOnly: true});
		res.redirect(process.env.IP_BACKEND);
	}

	// two factor authentication
	@ApiOperation({summary: 'QR code authentication - User'})
	@UseGuards(AuthGuard('jwt'))
	@Get('2fa')
	async getQrcode(@Req() req) {
		const user: User = req.user;
	  	const resp = await this.httpService.get(
		  `https://www.authenticatorApi.com/pair.aspx?AppName=${process.env.TWO_FACTOR_AUTH_APP_NAME}&AppInfo=${user.username}&SecretCode=${user.userId}`,
		).toPromise();
	  return resp.data;
	}

	@ApiOperation({summary: 'Code authentication - Secret'})
	@ApiParam({name: 'secret', required: true, description: 'Code authentication - Google Authenticator'})
	@UseGuards(AuthGuard('jwt'))
	@Post('2fa/:secret')
	async validate(@Param('secret') secret, @Req() req, @Res({passthrough: true}) res: Response) {
		const user: User = req.user;
		const resp = await this.httpService.get(
		  `https://www.authenticatorApi.com/Validate.aspx?Pin=${secret}&SecretCode=${user.userId}`,
		).toPromise();
		if (resp.data === 'True') {
			const username = user.username;
			const auth: boolean = true;
			const payload: JwtPayload = { username, auth };
			const accessToken: string = await this.jwtService.sign(payload);
			res.cookie('jwt', accessToken, {httpOnly: true});
		}
	  	return resp.data;
	}

}