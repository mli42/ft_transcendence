import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { GameHistory } from './entities/gameHistory.entity';
import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameHistory]),
    TypeOrmModule.forFeature([GameRepository]),
    ChatModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
