import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity'
import { ChannelRepository } from './channel.repository';
import { UsersRepository } from '../user/user.repository';
import { ConnectedUser } from './entities/connected-user.entity';
import { ConnectedUserService } from './connected-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelRepository]),
    TypeOrmModule.forFeature([Channel, ConnectedUser]),
    TypeOrmModule.forFeature([UsersRepository]),
    UserModule,
  ],
  providers: [ChatGateway, ChannelService, ConnectedUserService],
})
export class ChatModule {}