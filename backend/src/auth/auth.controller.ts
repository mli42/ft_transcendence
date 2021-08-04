import { Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express';
import { IntraAuthGuard } from './guards/auth.guard';
import { ApiTags } from '@nestjs/swagger'
import { Code } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@ApiTags('42 authentication')
@Controller('api/auth/')
export class AuthController {
	constructor (
		private httpService: HttpService,
	) {}

	// 42 API
	// GET /api/auth/login
	// Route que le user visit pour s'authentifier
	@Get('42/login')
	@UseGuards(IntraAuthGuard)
	login() {
		console.log("ok login");
		return;
	}

	// GET /api/auth/redirect
	// redirect URL que OAuth2 va appeler pour rediriger l'utilisateur sur la page de connexion d'accueil
	// Je n'est pas m'y @Get('redirect') car j'avais deja demandé l'url de redirection "http://localhost:3000"...
	@Get('redirect')
	@UseGuards(IntraAuthGuard)
	redirect(@Res() res: Response) {
		// res.send(200);
		res.redirect('http://localhost:8080/');
	}

	// to do
	// GET /api/auth/status
	// Recupérer le status d'anthentification

	@Get('42/status')
	status() {
	}

	// to do
	// GET /api/auth/logout
	// Supprimer la session
	@Get('42/logout')
	logout() {}


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