import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WsEchoGateway {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: any, payload: any): string {
    console.log(client.rooms);
    let it: IterableIterator<string> = client.rooms.values();
    it.next();
    this.server.to(it.next().value).emit('msgToClient', payload);
    this.logger.log('Client send msgToServer : ' + payload);
    return ('ok');
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.join(client.handshake.query.channel as string);
    let it: IterableIterator<string> = client.rooms.values();
    it.next();
    this.logger.log(`Client connected: ${client.id}` + ' in room: ' + it.next().value);
  }
}
