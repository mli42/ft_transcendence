import { Logger, Req } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ChatService } from './chat.service'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly userService: UserService,
        private readonly chatService: ChatService,
    ) {}

    @WebSocketServer() 
    server: Server;

    private logger: Logger = new Logger('ChatGateway');

    afterInit(server: Server) {
        this.logger.log('Initialized !')
    }

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, text: string) {
        this.logger.log('New message from a socket !');
        // this.server.to(message.room).emit('msgToClient', message);
        return {event: 'msgToClient', data: text};
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        client.emit('leftRoom', room);
    }




    handleDisconnect(client: Socket) {
        client.disconnect();
        this.logger.log(`Client diconnect: ${client.id}`);
    }

    async handleConnection(client: Socket) {
        // const user: User = await this.chatService.getUserFromSocket(client)
        this.server.emit('message', 'test');
        this.logger.log(`Client connected: ${client.id}`);
    }

}