import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Game, Player } from "./dataStructures";
import { Socket, Server } from "socket.io";

let gamesMap: Map<string, Game> = new Map(); // Relation between games and gameIds

/**
 * Here you will found all message emitable by this server.
 * updatePlayerTC   -> send update of one player (color for instance).
 * updatePlayersTC  -> send the map of players to update it (player added for instace).
 * updateGameTypeTC -> send the new game type of the game (matchmaking or private).
 * updateMapTC      -> send the new map name of the game.
 * fetchMapTC       -> send the entire Game class of a game.
 */

// get the gameId of rooms list of a player
function getIdFromRooms(rooms: Set<any>): string {
  return (Array.from(rooms)[0]);
}

@WebSocketGateway({ cors: true })
export class gameGateway {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  afterInit(server: Server) {
    this.logger.log("game socket init !");
  }

  // A client ask to get the entire game class. Or to create it if does not exists
  @SubscribeMessage("fetchGameTS")
  fetchGame(client: Socket, gameId: string): void {
    const query: any = client.handshake.query;

    if (gamesMap.has(gameId) == false) {
      gamesMap.set(gameId, new Game(query.userId, query.username, gameId));
    }
    client.emit("fetchGameTC", gamesMap.get(gameId), JSON.stringify(Array.from(gamesMap.get(gameId).players.entries())));
  }

  // A client want to join the game as player
  @SubscribeMessage("addPlayerTS")
  addPlayer(client: Socket, player: Player): void {
  }

  // A client want to change its color
  @SubscribeMessage("changePlayerColorTS")
  changePlayerColor(client: Socket, player: Player): void {
  }

  @SubscribeMessage("changeGameTypeTS")
  changeGameType(client: Socket, player: Player): void {
  }

  handleConnection(client: Socket, ...args: any[]) {
    const gameWanted: string = client.handshake.query.gameId as string;
    let user: { userId: string, username: string } = {} as any;

    user.userId = client.handshake.query.userId as string;
    user.username = client.handshake.query.username as string;
    client.join(gameWanted);
    if (gamesMap.has(gameWanted) === false) {
      gamesMap.set(gameWanted, new Game(user.userId, user.username, gameWanted));
    }
    this.logger.log("Client connected: " + user.username + " in room: " + gameWanted);
  }

  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }
}
