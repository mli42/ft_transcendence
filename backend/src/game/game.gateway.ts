import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";

let userRoomsMap: Map<Socket, string> = new Map();

class Mouse {
  x: number = 0;
  y: number = 0;
  playerId: string;

  constructor(x: number, y: number, id: string) {
    this.x = x;
    this.y = y;
    this.playerId = id;
  }
}

@WebSocketGateway({ cors: true })
export class gameGateway {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  afterInit(server: Server) {
    this.logger.log("game socket init !");
  }

  @SubscribeMessage("mousePosToServer")
  handleMessage(client: Socket, payload: Array<number>): void {
    let data: Array<any> = new Array<any>();
    this.server
      .to(userRoomsMap.get(client))
      .emit('mousePosToClient', new Mouse(payload[0], payload[1], client.id));
  }

  handleConnection(client: Socket, ...args: any[]) {
    userRoomsMap.set(client, client.handshake.query.channel as string);
    client.join(userRoomsMap.get(client));
    this.logger.log(`Client connected: ${client.id}` + " in room: " + userRoomsMap.get(client));
  }

  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }
}
