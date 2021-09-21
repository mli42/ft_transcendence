import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity'
import { UsersRepository } from '../user/user.repository';
import { ConnectedUser } from './entities/connected-user.entity';
import { ConnectedUserService } from './connected-user.service';
import { Message } from './entities/message.entity';
import { JoinedChannel } from './entities/joined-channel.entity';
import { MessageService } from './message.service';
import { JoinedChannelService } from './joined-channel.service';
import { RoleUser } from './entities/role-user.entity';
import { RoleUserService } from './role-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ConnectedUser, Message, JoinedChannel, RoleUser]),
    TypeOrmModule.forFeature([UsersRepository]),
    UserModule,
  ],
  providers: [ChatGateway, ChannelService, ConnectedUserService, MessageService, JoinedChannelService, RoleUserService],
  exports: [ChatGateway],
})
export class ChatModule {}