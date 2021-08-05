import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entity/Session';
import { SessionSerializer } from './session/serializer';
import { IntraStrategy } from './strategy/auth.strategy';

@Module({
	imports: [
		forwardRef(() => UserModule), 
		TypeOrmModule.forFeature([Session]),
		HttpModule],
	controllers: [AuthController],
	providers: [
		IntraStrategy,
		SessionSerializer,
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService
		},
	],
})
export class AuthModule {}