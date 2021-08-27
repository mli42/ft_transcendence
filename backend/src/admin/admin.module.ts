import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UsersRepository } from 'src/user/user.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from 'src/user/strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  controllers: [AdminController],
  providers: [AdminService, UserService, JwtStrategy]
})
export class AdminModule {}
