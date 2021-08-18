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
import { Message } from './entities/message.entity';
import { JoinedChannel } from './entities/joined-channel.entity';
import { MessageService } from './massage.service';
import { JoinedChannelService } from './joined-channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelRepository]),
    TypeOrmModule.forFeature([Channel, ConnectedUser, Message, JoinedChannel]),
    TypeOrmModule.forFeature([UsersRepository]),
    UserModule,
  ],
  providers: [ChatGateway, ChannelService, ConnectedUserService, MessageService, JoinedChannelService],
})
export class ChatModule {}