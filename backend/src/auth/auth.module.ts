import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { IntraStrategy } from './strategy/auth.strategy';


@Module({
	imports: [HttpModule],
	controllers: [AuthController],
	providers: [IntraStrategy]
})
export class AuthModule {}