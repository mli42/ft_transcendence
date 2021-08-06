import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategy/auth.strategy';

@Module({
	imports: [
<<<<<<< HEAD
		forwardRef(() => UserModule), 
=======
		forwardRef(() => UserModule),
		TypeOrmModule.forFeature([Session]),
>>>>>>> 1cdb132895532dce9db3d3b0944e570e5001e36d
		HttpModule],
	controllers: [AuthController],
	providers: [
		IntraStrategy,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService
		},
	],
})
export class AuthModule {}