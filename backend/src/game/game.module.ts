import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [ChatModule],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
