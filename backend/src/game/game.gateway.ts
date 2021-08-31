import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Game, Player } from "./dataStructures";
import { Socket, Server } from "socket.io";
import { AuthGuard } from "@nestjs/passport";

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
function getIdsFromRooms(rooms: Set<any>): Array<string> {
  let result: Array<string> = Array.from(rooms);
  result.shift();
  return (result);
}

@WebSocketGateway( { namespace: "/game", cors: { origin: 'http://localhost:3030', credentials: true }})
export class gameGateway {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("gameGateway");

  afterInit(server: Server) {
    this.logger.log("game socket init !");
  }

  // A client ask to get the entire game class. Or to create it if does not exists
  @SubscribeMessage("fetchGameTS")
  fetchGame(client: Socket, gameId: string): void {
    const rooms: Array<string> = getIdsFromRooms(client.rooms);
    this.logger.log("LOG: fetchGameTS on " + gameId + " from " + client.handshake.query.username);

    if (rooms.find(element => element === gameId) == undefined) {
      rooms.forEach(function(value: string) {
        client.leave(value);
      });
      if (gamesMap.has(gameId) === false) {
        gamesMap.set(gameId, new Game(
          client.handshake.query.userId as string,
          client.handshake.query.username as string,
          gameId
        ));
      }
      client.join(gameId);
    }
    client.emit("fetchGameTC", gamesMap.get(gameId), JSON.stringify(Array.from(gamesMap.get(gameId).players.entries())));
  }

  // A client join the game as player
  @SubscribeMessage("playerJoinTS")
  playerJoin(client: Socket, player: Player): void {
    const query: any = client.handshake.query;
    this.logger.log("LOG: playerJoinTS on " + query.gameId + " from " + query.username);
    const game: Game = gamesMap.get(query.gameId as string);

    if (game) {
      game.players.set(query.userId as string, player);
      if (game.creatorId === "") {
        game.creatorId = query.userId as string;
      } else {
        game.opponentId = query.userId as string;
      }
      client.to(game.id).emit("playerJoinTC", {playerId: query.userId, player: player});
    }
  }

  // A client leave the game as player
  @SubscribeMessage("playerLeaveTS")
  playerLeave(client: Socket): void {
    const query: any = client.handshake.query;
    this.logger.log("LOG: playerLeaveTS on " + query.gameId + " from " + query.username);
    const game: Game = gamesMap.get(query.gameId);

    if (game) {
      if (game.creatorId === query.userId) {
        game.players.delete(game.creatorId);
        game.creatorId = "";
        if (game.opponentId != "") { // Do we have an opponent to set as creator?
          game.creatorId = game.opponentId;
          game.opponentId = "";
        }
      } else if (game.opponentId === query.userId) {
        game.players.delete(query.userId as string);
        game.opponentId = "";
      }
      client.to(game.id).emit("playerLeaveTC", query.userId);
      gamesMap.delete(query.userId);
    }
  }

  // A client want to change its color
  @SubscribeMessage("changePlayerColorTS")
  changePlayerColor(client: Socket, payload: {userId:string, player: Player}): void {
    const gameId: string = client.handshake.query.gameId as string;
    const game: Game = gamesMap.get(gameId);
    this.logger.log("LOG: changePlayerColorTS on " + gameId + " from " + client.handshake.query.username);

    if (game) {
      game.players.set(payload.userId, payload.player);
      client.to(gameId).emit("changePlayerColorTC", payload);
    }
  }

  @SubscribeMessage("changeGameTypeTS")
  changeGameType(client: Socket, type: string): void {
    const gameId: string = client.handshake.query.gameId as string;
    const game: Game = gamesMap.get(gameId);
    this.logger.log("LOG: changeGameTypeTS on " + gameId + " from " + client.handshake.query.username);

    if (game) {
      game.type = type;
      client.to(gameId).emit("changeGameTypeTC", type);
    }
  }

  @SubscribeMessage("updateReadyTS")
  updateReady(client: Socket, payload: {userId: string, isReady: boolean}): void {
    const gameId: string = client.handshake.query.gameId as string;
    const game: Game = gamesMap.get(gameId);
    this.logger.log("LOG: updateReadyTS on " + gameId + " from " + client.handshake.query.username);

    if (game) {
      game.players.get(payload.userId).isReady = payload.isReady;
      client.to(gameId).emit("updateReadyTC", payload);
    }
  }

  @SubscribeMessage("updatePowTS")
  updatePow(client: Socket, enabledPowerUps: Array<string>): void {
    const query: any = client.handshake.query;
    const game: Game = gamesMap.get(query.gameId);
    this.logger.log("LOG: updatePowTS on " + query.gameId + " from " + query.username);

    if (game) {
      game.enabledPowerUps = enabledPowerUps;
      client.to(game.id).emit("updatePowTC", enabledPowerUps);
    }
  }

  @SubscribeMessage("updateMapTS")
  updateMap(client: Socket, mapName: string): void {
    const query: any = client.handshake.query;
    const game: Game = gamesMap.get(query.gameId);
    this.logger.log("LOG: updateMapTS on " + query.gameId + " from " + query.username);

    if (game) {
      game.mapName = mapName;
      client.to(game.id).emit("updateMapTC", mapName);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log("Client connected: " + client.handshake.query.username);
  }

  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }
}
