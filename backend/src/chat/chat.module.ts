import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity'
import { ChannelRepository } from './channel.repository';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelRepository]),
    TypeOrmModule.forFeature([Channel]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}