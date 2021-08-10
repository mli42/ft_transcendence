import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategy/auth.strategy';

@Module({
	imports: [
		forwardRef(() => UserModule), 
		HttpModule
	],
	controllers: [AuthController],
	providers: [
		IntraStrategy,
		AuthService,
	],
})
export class AuthModule {}
