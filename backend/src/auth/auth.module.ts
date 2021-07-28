import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { IntraStrategy } from './strategy/auth.strategy';


@Module({
	controllers: [AuthController],
	providers: [IntraStrategy]
})
export class AuthModule {}