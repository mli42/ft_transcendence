import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersRepository } from './user.repository';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import * as dotenv from 'dotenv'
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UsersRepository]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, UserService],
})
export class UserModule {}