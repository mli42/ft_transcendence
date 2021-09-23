import { Logger, OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from '../user/entities/user.entity';
import { ChannelService } from './channel.service'
import { ChannelI } from "./interfaces/channel.interface";
import { ConnectedUserService } from './connected-user.service';
import { ConnectedUserI } from './interfaces/user-connected.interface';
import { MessageService } from './message.service';
import { JoinedChannelService } from './joined-channel.service';
import { MessageI } from './interfaces/message.interface';
import { JoinedChannelI } from './interfaces/joined-channel.interface';
import { RoleUserI } from './interfaces/role-user.interface';
import { RoleUserService } from './role-user.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserAuthHandshake } from './guards/userAuthHandshake.guard';
import { playingUsers } from 'src/game/game.gateway';

@WebSocketGateway({ namespace: "/chat", cors: { origin: process.env.IP_FRONTEND, credentials: true }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    constructor(
        private readonly userService: UserService,
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
    async onModuleInit() {
        await this.connectedUserService.deleteAll();
        await this.joinedChannelService.deleteAll();
    }

    async handleConnection(client: Socket) {
        try {
            const user: User = await this.channelService.getUserFromSocket(client);
            if (!user) {
                return this.disconnectClient(client);
            } else {
                client.data.user = user;

                const channels = await this.channelService.getChannelsForUser(user.userId);
                await this.connectedUserService.create({socketId: client.id, user});
                this.userStatus();

                this.logger.log(`Client connected: ${client.id}`);
                // return this.server.to(client.id).emit('channel', channels);
            }
        } catch {
            return this.disconnectClient(client);
        }
    }

    /********************* DISCONNECTION ****************** */
    @SubscribeMessage('disconnectUser')
    async handleDisconnect(client: Socket) {
        await this.connectedUserService.deleteBySoketId(client.id);
        client.disconnect();
        this.logger.log(`Client diconnect: ${client.id}`);
        this.userStatus();
    }

    private disconnectClient(client: Socket) {
        client.disconnect();
        this.userStatus();
        this.logger.log(`Client diconnect: ${client.id}`);
    }

    /********************* EMIT CHANNEL CONNECTED USERS **************** */
    async emitChannelForConnectedUsers() {
        const connections: ConnectedUserI[] = await this.connectedUserService.findAll();
        for (const connection of connections) {
            const channels: ChannelI[] = await this.channelService.getChannelsForUser(connection.user.userId);
            await this.server.to(connection.socketId).emit('channel', channels);
        }
    }





    /********************* CREATE CHANNEL **************** */
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('createChannel')
    async onCreateChannel(client: Socket, channel: ChannelI): Promise<boolean> {
        const createChannel: ChannelI = await this.channelService.createChannel(channel, client.data.user);
        if (!createChannel) {
            return false;
        } else {
            await this.emitChannelForConnectedUsers();
            return true;
        }
    }

    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('displayChannel')
    async onChatPage(client: Socket): Promise<ChannelI[]> {
        const user: User = await this.channelService.getUserFromSocket(client);
        const channels: ChannelI[] = await this.channelService.getChannelsForUser(user.userId);
        return channels;
    }

    /********************* DELETE CHANNEL **************** */
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('deleteChannel')
    async onDeleteChannel(client: Socket, channel: ChannelI) {
        await this.channelService.deleteChannel(channel);
        await this.emitChannelForConnectedUsers();
    }

    /********************* USER LEAVE FROM CHANNEL CHANNEL **************** */
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('userLeaveChannel')
    async onUserLeaveChannel(client: Socket, data: any) {
        const { channel, user } = data;
        await this.channelService.userLeaveChannel(channel, user);
        await this.emitChannelForConnectedUsers();
    }

    /********************* UPDATE CHANNEL **************** */
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('updateChannel')
    async updateChannel(client: Socket, info: any): Promise<boolean> {
        const { channel } = info;
        const channelFound = await this.channelService.getChannel(channel.channelId);

        const ret: Boolean = await this.channelService.updateChannelInfo(channelFound, info.data)
        if (ret === true){
            await this.emitChannelForConnectedUsers();
            return true;
        }
        return false;
    }





    /********************* HANDLE MESSAGE *****************/
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('newMessage')
    async onAddMessage(client: Socket, message: MessageI) {
        const userRoleFound = await this.roleUserService.findUserByChannel(message.channel, client.data.user.userId);
        let date = new Date;
        if (userRoleFound && (userRoleFound.mute >= date || userRoleFound.ban >= date))
            return;
        const createMessage: MessageI = await this.messageService.create({...message, user: client.data.user});
        const channel: ChannelI = await this.channelService.getChannel(createMessage.channel.channelId);
        const joinedUsers: JoinedChannelI[] = await this.joinedChannelService.findByChannel(channel);

        const originalMessage = createMessage.text;
        for (const user of joinedUsers) {
            createMessage.text = originalMessage;

            const userFound: string = user.user.blockedUsers.find(element => element === createMessage.user.userId)
            if (userFound) {
                createMessage.text = "--------[Vous avez bloqué cet utilisateur]--------";
            }
            const userJoinRoleFound = await this.roleUserService.findUserByChannel(message.channel, user.user.userId);
            let date = new Date;
            if (!userJoinRoleFound || userJoinRoleFound.ban < date || userJoinRoleFound.ban === null || userJoinRoleFound.mute >= date) {
                await this.server.to(user.socketId).emit('messageAdded', createMessage);
            }
        }
    }




    /********************* Block user *********************/
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('blockUser')
    async blockOrDefiUser(client: Socket, data: any): Promise<User> {
        const { user, block } = data;
        const userUpdate = this.userService.updateBlockUser(block, client.data.user, user);
        return userUpdate;
    }

    /********************* Autorisation Channel *********************/
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('autorisationChannel')
    async updateAutorisationChannel(client: Socket, data: any) {
        const { user, channel, admin } = data;
        const channelFound = await this.channelService.getChannel(channel.channelId);

        this.channelService.updateAdminUser(admin, channelFound, user);

        const roleFound: RoleUserI = await this.roleUserService.findUserByChannel(channelFound, user.userId);
        let role: RoleUserI = null;
        if (roleFound) {
            role = await this.roleUserService.updateRole(roleFound, data);
        } else {
            role = await this.roleUserService.create(data);
        }
        let date = new Date;
        const userConnectedFound: ConnectedUserI = await this.connectedUserService.findUser(user);
        if (userConnectedFound) {
            if (role.ban > date)
                this.server.to(userConnectedFound.socketId).emit('banUserChannel', channelFound);
            if (role.mute > date)
                this.server.to(userConnectedFound.socketId).emit('muteUserChannel', channelFound);
        }
        await this.emitChannelForConnectedUsers();
    }

    @SubscribeMessage('checkRoleChannelMute')
    async checkRoleForChannelMute(client: Socket, channel: ChannelI): Promise<any> {
        const channelFound = await this.channelService.getChannel(channel.channelId);
        const userChannelRolesFound = await this.roleUserService.findUserByChannel(channelFound, client.data.user.userId);
        let date = new Date;
        if (userChannelRolesFound && userChannelRolesFound.mute > date) {
            const data = { isMute: true, date: userChannelRolesFound.mute }
            return data;
        } else {
            const data = { isMute: false, date: date }
            return data;
        }
    }

    @SubscribeMessage('checkRoleChannelBan')
    async checkRoleForChannelBan(client: Socket, channel: ChannelI): Promise<any> {
        const channelFound = await this.channelService.getChannel(channel.channelId);
        const userChannelRolesFound = await this.roleUserService.findUserByChannel(channelFound, client.data.user.userId);
        let date = new Date;
        if (userChannelRolesFound && userChannelRolesFound.ban > date) {
            const data = { isBan: true, date: userChannelRolesFound.ban }
            return data;
        } else {
            const data = { isBan: false, date: date }
            return data;
        }
    }


    @SubscribeMessage('checkRoleMembersChannel')
    async checkRoleMembersChannel(client: Socket, data: any): Promise<any> {
        const { user, channel } = data;
        const channelFound = await this.channelService.getChannel(channel.channelId);
        const userChannelRolesFound = await this.roleUserService.findUserByChannel(channelFound, user.userId);
        let date = new Date;
        let isMute: Boolean  = false;
        let dateMute: Date = null;
        let isBan: Boolean = false;
        let dateBan: Date = null;
        if (userChannelRolesFound) {
            if (userChannelRolesFound.mute > date) {
                isMute = true; 
                dateMute = userChannelRolesFound.mute;
            }
            if (userChannelRolesFound.ban > date) {
                isBan = true; 
                dateBan = userChannelRolesFound.ban;
            }
        }
        return {isMute, dateMute, isBan, dateBan}
    }

    /********************* Auth Private Channel *********************/
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('passwordChannel')
    async authPrivateChannel(client: Socket, data: any): Promise<boolean> {
        const { channel, password } = data;
        if (await bcrypt.compare(password, channel.password) === false)
            return false;
        await this.channelService.addAuthUserPrivateChannel(channel, client.data.user);
        await this.emitChannelForConnectedUsers();
        return true;
    }





    /********************* Join Channel *********************/
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('joinChannel')
    async handleJoinChannel(client: Socket, channel: ChannelI) {
        const channelFound = await this.channelService.getChannel(channel.channelId);
        if (channelFound.publicChannel === false && await this.channelService.isAuthPrivateChannel(channelFound, client.data.user) == false){
            return;
        }
        const messages = await this.messageService.findMessagesForChannel(channelFound, client.data.user)
        await this.joinedChannelService.create({socketId: client.id, user: client.data.user, channel})
        await this.server.to(client.id).emit('messages', messages);
    }

    /********************* Leave Channel ********************/
    @UseGuards(UserAuthHandshake)
    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(client: Socket) {
        await this.joinedChannelService.deleteBySocketId(client.id);
    }





    /********************* USER STATUT ********************/
    async userStatus() {
        let userConnected = await this.connectedUserService.userStatus();
        this.userInGame(playingUsers);
        return this.server.emit('userConnected', userConnected);
    }

    async userInGame(playingUser) {
        let obj = {};
        playingUser.forEach(function(value, key){
            obj[key] = value
        });
        return this.server.emit('userInGame', obj);
    }

}
