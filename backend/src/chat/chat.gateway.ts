import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersRepository } from '../user/user.repository';
import { User } from '../user/entities/user.entity';
import { ChannelService } from './channel.service'
import { ChannelI } from "./interfaces/channel.interface";
import { ConnectedUserService } from './connected-user.service';
import { ConnectedUserI } from './interfaces/user-connected.interface';
import { MessageService } from './massage.service';
import { JoinedChannelService } from './joined-channel.service';
import { MessageI } from './interfaces/message.interface';
import { JoinedChannelI } from './interfaces/joined-channel.interface';

@WebSocketGateway({ namespace: "/chat", cors: { origin: 'http://localhost:3030', credentials: true }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

    constructor(
        private readonly userRepository: UsersRepository,
        private readonly channelService: ChannelService,
        private readonly connectedUserService: ConnectedUserService,
        private readonly messageService: MessageService,
        private readonly joinedChannelService: JoinedChannelService,
    ) {}

    @WebSocketServer()
    server: Server;
 
    private logger: Logger = new Logger('ChatGateway');

    // afterInit(server: Server) {
    //     this.logger.log('Initialized !')
    // }

    /********************* CONNECTION ********************** */

    // Called once the host module's dependencies have been resolved
    async onModuleInit() {
        await this.connectedUserService.deleteAll();
        await this.joinedChannelService.deleteAll();
    }

    async handleConnection(client: Socket) {
        try {
            const user: User = await this.channelService.getUserFromSocket(client);
            if (!user) {
                return this.disconnectClient(client);
            } 
            else {
                client.data.user = user;

                const channels = await this.channelService.getChannelsForUser(user.userId);
                await this.connectedUserService.create({socketId: client.id, user});

                this.logger.log(`Client connected: ${client.id}`);
                return this.server.to(client.id).emit('channel', channels);
            }
        } catch {
            console.log("ok disc.");
            return this.disconnectClient(client);
        }
    }

    /********************* DISCONNECTION ****************** */
    @SubscribeMessage('disconnectUser')
    async handleDisconnect(client: Socket) {
        // remove connection from db
        await this.connectedUserService.deleteBySoketId(client.id);
        client.disconnect();
        this.logger.log(`Client diconnect: ${client.id}`);
    }

    private disconnectClient(client: Socket) {
        client.emit('Error', new UnauthorizedException());
        client.disconnect();
        this.logger.log(`Client diconnect: ${client.id}`);
    }

    /********************* CREATE CHANNEL **************** */
    @SubscribeMessage('createChannel')
    async onCreateChannel(client: Socket, channel: ChannelI) {
        const { publicChannel } = channel;

        const createChannel: ChannelI = await this.channelService.createChannel(channel, client.data.user);

        if (publicChannel === true) {
            const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
            for (const connection of connections) {
                const channels = await this.channelService.getChannelsForUser(connection.user.userId);
                await this.server.to(connection.socketId).emit('channel', channels);
            }
        } else {
            for (const user of createChannel.users) {
                const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
                const channels = await this.channelService.getChannelsForUser(user.userId);
                for (const connection of connections) {
                    await this.server.to(connection.socketId).emit('channel', channels);
                }
            }
        }
    }

    @SubscribeMessage('displayChannel')
    async onChatPage(client: Socket) {
        const user: User = await this.channelService.getUserFromSocket(client);
        const channels = await this.channelService.getChannelsForUser(user.userId);
        return channels;
    }

    /********************* HANDLE MESSAGE *****************/
    // @SubscribeMessage('msgToServer')
    // handleMessage(client: Socket, text: string) {
    //     this.logger.log('New message from a socket !');
    //     // this.server.to(message.room).emit('msgToClient', message);                      
    //     this.server.emit('msgToClient',text);
    // }

    @SubscribeMessage('newMessage')
    async onAddMessage(client: Socket, message: MessageI) {
        const createMessage: MessageI = await this.messageService.create({...message, user: client.data.user});
        const channel: ChannelI = await this.channelService.getChannel(createMessage.channel.channelId);

        const joinedUsers: JoinedChannelI[] = await this.joinedChannelService.findByChannel(channel);
        for (const user of joinedUsers) {
            await this.server.to(user.socketId).emit('messageAdded', createMessage);
        }
    }
    /********************* Autorisation Channel *********************/
    @SubscribeMessage('autorisationChannel')
    async updateAutoricationChannel(client: Socket, channel: ChannelI, ban: boolean, mute: boolean) {
        if (ban === true) {
            this.channelService.addBanUser(channel, client.data.user);
        } else {
            this.channelService.removeBanUser(channel, client.data.user);
        }
        if (mute === true) {
            this.channelService.addMuteUser(channel, client.data.user);
        } else {
            this.channelService.removeMuteUser(channel, client.data.user);
        }
    }

    /********************* Auth Private Channel *********************/
    @SubscribeMessage('passwordChannel')
    async authPrivateChannel(client: Socket, channel: ChannelI, password: string): Promise<boolean> {
        if (password != channel.password)
            return false;
        await this.channelService.addAuthUserPrivateChannel(channel, client.data.user);
        return true;
    }

    /********************* Join Channel *********************/
    @SubscribeMessage('joinChannel')
    async handleJoinChannel(client: Socket, channel: ChannelI) {
        if (channel.publicChannel === false && await this.channelService.isAuthPrivateChannel(channel, client.data.user) == false)
            throw new WsException('The user is not authenticated in this private channel');
        const messages = await this.messageService.findMessagesForChannel(channel)
        await this.joinedChannelService.create({socketId: client.id, user: client.data.user, channel})
        await this.server.to(client.id).emit('messages', messages);
    }

    /********************* Leave Channel ********************/
    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(client: Socket) {
        await this.joinedChannelService.deleteBySocketId(client.id);
    }

}
