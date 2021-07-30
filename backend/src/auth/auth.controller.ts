import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express';
import { IntraAuthGuard } from './guards/auth.guard';
import { ApiTags } from '@nestjs/swagger'

@ApiTags('42 authentication')
// Je n'est pas m'y @Controller('api') car j'avais deja demandé l'url de redirection "http://localhost:3000"...
@Controller('42/')
export class AuthController {

	// GET /api/auth/login
	// Route que le user visit pour s'authentifier
	@Get('login')
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
		res.redirect('http://localhost:3000/');
	}

	// to do
	// GET /api/auth/status
	// Recupérer le status d'anthentification

	@Get('status')
	status() {
	}

	// to do
	// GET /api/auth/logout
	// Supprimer la session
	@Get('logout')
	logout() {}
}