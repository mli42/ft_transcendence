import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { UsersRepository } from 'src/user/user.repository';
import { GameHistory } from './entities/gameHistory.entity';
import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameHistory]),
    TypeOrmModule.forFeature([GameRepository]),
    TypeOrmModule.forFeature([UsersRepository]),
    ChatModule,
    UserModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}