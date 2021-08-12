import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
// export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
export class ChatGateway {

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, text: string): WsResponse<string> {
        this.logger.log('New message from a socket !');
        return {event: 'msgToClient', data: text};
        // this.server.emit('msgToClient', text);
        // return { event: 'msgToClient', data: text };
    }

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    afterInit(server: Server) {
        this.logger.log('Initialized !')
    }

    // handleDisconnect(client: Socket) {
    //     this.logger.log(`Client diconnect: ${client.id}`);
    // }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    

}