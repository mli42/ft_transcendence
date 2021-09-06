import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from '../user/entities/user.entity';
import { ChannelService } from './channel.service'
import { ChannelI } from "./interfaces/channel.interface";
import { ConnectedUserService } from './connected-user.service';
import { ConnectedUserI } from './interfaces/user-connected.interface';
import { MessageService } from './massage.service';
import { JoinedChannelService } from './joined-channel.service';
import { MessageI } from './interfaces/message.interface';
import { JoinedChannelI } from './interfaces/joined-channel.interface';
import { RoleUserI } from './interfaces/role-user.interface';
import { RoleUserService } from './role-user.service';

@WebSocketGateway({ namespace: "/chat", cors: { origin: 'http://localhost:3030', credentials: true }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    constructor(
        private readonly channelService: ChannelService,
        private readonly connectedUserService: ConnectedUserService,
        private readonly messageService: MessageService,
        private readonly joinedChannelService: JoinedChannelService,
        private readonly roleUserService: RoleUserService,
    ) {}

    @WebSocketServer()
    server: Server;
 
    private logger: Logger = new Logger('ChatGateway');

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
                this.logger.log(`Client connected: ${client.id} - ${user.username}`);
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
        this.logger.log(`Client diconnect: ${client.id} - ${client.data.user.username}`);
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
        this.emitUpdateChannel(createChannel, publicChannel);

    }

    @SubscribeMessage('displayChannel')
    async onChatPage(client: Socket): Promise<ChannelI[]> {
        const user: User = await this.channelService.getUserFromSocket(client);
        const channels: ChannelI[] = await this.channelService.getChannelsForUser(user.userId);
        return channels;
    }

    async emitUpdateChannel(channel:ChannelI, publicChannel: boolean) {
        if (publicChannel === true) {
            const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
            for (const connection of connections) {
                const channels: ChannelI[] = await this.channelService.getChannelsForUser(connection.user.userId);
                await this.server.to(connection.socketId).emit('channel', channels);
            }
        } else {
            for (const user of channel.users) {
                const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
                const channels: ChannelI[] = await this.channelService.getChannelsForUser(user.userId);
                for (const connection of connections) {
                    await this.server.to(connection.socketId).emit('channel', channels);
                }
            }
        }
    }

    /********************* HANDLE MESSAGE *****************/

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
    async updateAutorisationChannel(client: Socket, data: any) {

        let { user, channel, admin, ban, mute, block } = data;
        console.log(data)
        if (admin === true) {
            this.channelService.addAdminUser(channel, user);
        } else {
            this.channelService.removeAdminUser(channel, user);
        }

        // console.log("OK")
        // let dateBan = new Date;
        // console.log(dateBan)
        // if (ban > 0) {
        //     console.log("Ban !");
        //     var day = dateBan.getDate()
        //     var month = dateBan.getMonth() + 1
        //     var year = dateBan.getFullYear()
        //     console.log("---" + day + "/" + month + "/" + year + "---")
    
        //     dateBan.setDate(dateBan.getDate() + ban)
    
        //     day = dateBan.getDate()
        //     month = dateBan.getMonth() + 1
        //     year = dateBan.getFullYear()
        //     console.log("---" + day + "/" + month + "/" + year + "---")
        //     ban = dateBan;
        // }
        // const role: RoleUserI = {userId: user.userId, block, ban, mute, channel}
        // this.roleUserService.create(role);


        // this.emitUpdateChannel(channel, channel.publicChannel);
        // if (ban === true) {
        //     this.channelService.addBanUser(channel, user);
        // } else {
        //     this.channelService.removeBanUser(channel, user);
        // }
        // if (mute === true) {
        //     this.channelService.addMuteUser(channel, user);
        // } else {
        //     this.channelService.removeMuteUser(channel, user);
        // }
    }

    /********************* Auth Private Channel *********************/

    // apdate password

    @SubscribeMessage('passwordChannel')
    async authPrivateChannel(client: Socket, data: any): Promise<boolean> {
        const { channel, password } = data;
        if (password != channel.password)
            return false;
        await this.channelService.addAuthUserPrivateChannel(channel, client.data.user);
        const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
        for (const connection of connections) {
            const channels: ChannelI[] = await this.channelService.getChannelsForUser(connection.user.userId);
            await this.server.to(connection.socketId).emit('channel', channels);
        }
        return true;
    }

    /********************* Join Channel *********************/
    @SubscribeMessage('joinChannel')
    async handleJoinChannel(client: Socket, channel: ChannelI) {
        // creer un eventpour check si user ban ou mute 
        const channelFound = await this.channelService.getChannel(channel.channelId);
        if (channelFound.publicChannel === false && await this.channelService.isAuthPrivateChannel(channelFound, client.data.user) == false){
            console.log("FAUX")
            throw new WsException('The user is not authenticated in this private channel');
        }
        const messages = await this.messageService.findMessagesForChannel(channelFound)
        await this.joinedChannelService.create({socketId: client.id, user: client.data.user, channel})
        await this.server.to(client.id).emit('messages', messages);
    }

    /********************* Leave Channel ********************/
    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(client: Socket) {
        await this.joinedChannelService.deleteBySocketId(client.id);
    }

}
