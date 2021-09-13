import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Game, Player } from "./dataStructures";
import { Socket, Server } from "socket.io";
import { AuthGuard } from "@nestjs/passport";
import { ChatGateway } from "src/chat/chat.gateway";

let gamesMap: Map<string, Game> = new Map(); // Relation between gamesIds and games
let playingGames: Array<string> = new Array();
let searchList: Map<string, {client: Socket, gameId: string, player: Player}> = new Map(); // Relation between playerId and Player class
let playingUsers: Array<string> = new Array(); // Array of userId that currentlty playing

export { playingGames, gamesMap, playingUsers };

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

@WebSocketGateway( { namespace: "/game", cors: { origin: process.env.IP_BACKEND, credentials: true }})
export class gameGateway {

  constructor(
    private chatGateway: ChatGateway,
) {}
  /**
   * LIST OF LOG FUNCTIONS
   */

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("gameGateway");

  afterInit(server: Server) {
    this.logger.log("game socket init !");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log("Client connected: " + client.handshake.query.username);
  }

  handleDisconnect(client: Socket) {
    const game: Game = gamesMap.get(client.handshake.query.gameId as string);
    const query: any = client.handshake.query;
    this.logger.log(`Client disconnected: ${client.id}`);

    if (game) {
      if (searchList.has(query.userId)) {
        searchList.delete(query.userId as string);
      }
      if (game.state === "waiting")
        this.playerLeave(client);
    }
  }

  /**
   * LIST OF PRE-GAME MESSAGE LISTENERS
   */
  genRandDelta(): Array<number> {
    let ballDelta: Array<number> = new Array();
    let ballDeltaSum: number = 1;
    let ballDeltaRand: number = Math.random();

    while (ballDeltaRand * 10 < 2 || ballDeltaRand * 10 > 8) {// Ajust to start with a delta more horizontal
      ballDeltaRand = Math.random();
    }
    ballDelta[0] = ballDeltaSum - ballDeltaRand;
    if (Math.round(Math.random())) { ballDelta[0] = -ballDelta[0] } // Add negative ranges between -1 and 0
    ballDelta[1] = ballDeltaRand;
    if (Math.round(Math.random())) { ballDelta[1] = -ballDelta[1] }
    return (ballDelta);
  }

  startGame(client: Socket, game: Game): void {
    let ballDelta: Array<number> = this.genRandDelta();

    client.to(client.handshake.query.gameId).emit("startGameTC", ballDelta);
    client.emit("startGameTC", ballDelta);
    game.state = "started";
    playingGames.push(game.id);
    playingUsers.push(game.creatorId);
    playingUsers.push(game.opponentId);
    game.startDate = new Date();
    this.chatGateway.userInGame(playingUsers);
    game.ball.delta = ballDelta;
  }

  // A client ask to get the entire game class. Or to create it if does not exists
  @SubscribeMessage("fetchGameTS")
  fetchGame(client: Socket, gameId: string): void {
    const rooms: Array<string> = getIdsFromRooms(client.rooms);
    this.logger.log("LOG: fetchGameTS on " + gameId + " from " + client.handshake.query.username);

    client.handshake.query.gameId = gameId; // Protection when the WS is from the middleware
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
    client.emit("fetchGameTC", {
      game: gamesMap.get(gameId),
      serialPlayers: JSON.stringify(Array.from(gamesMap.get(gameId).players.entries())),
      modBarCrea: gamesMap.get(gameId).modBarCrea.toString(),
      modBarOppo: gamesMap.get(gameId).modBarOppo.toString(),
    });
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
      if (game.type === "matchmaking" && game.players.size === 2 && game.state === "waiting") {
        this.startGame(client, game);
      }
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
        playingUsers.splice(playingUsers.indexOf(game.creatorId), 1);
        game.creatorId = "";
        if (game.opponentId != "") { // Do we have an opponent to set as creator?
          game.creatorId = game.opponentId;
          game.opponentId = "";
        }
      } else if (game.opponentId === query.userId) {
        game.players.delete(query.userId as string);
        playingUsers.splice(playingUsers.indexOf(game.opponentId), 1);
        game.opponentId = "";
      }
      this.chatGateway.userInGame(playingUsers);
      client.to(game.id).emit("playerLeaveTC", query.userId);
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
  updateReady(client: Socket, isReady: boolean ): void {
    const query: any = client.handshake.query;
    const game: Game = gamesMap.get(query.gameId);
    this.logger.log("LOG: updateReadyTS on " + query.gameId + " from " + query.username);

    if (game) {
      game.players.get(query.userId).isReady = isReady;
      client.to(query.gameId).emit("updateReadyTC", {playerId: query.userId, isReady: isReady});
      if (game.players.get(game.opponentId).isReady && game.players.get(game.creatorId).isReady) {
        this.startGame(client, game);
        game.state = "started";
      }
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

  @SubscribeMessage("startSearchTS")
  startSearch(client: Socket, player: Player): void {
    const query: any = client.handshake.query;
    this.logger.log("LOG: startSearchTS on " + query.gameId + " from " + query.username);

    if (searchList.size >= 1) {
      const playerCreaId: string = searchList.keys().next().value; // Selection of the first player who search for a game
      const playerCrea: {client: Socket, gameId: string, player: Player} = searchList.values().next().value; // Get data from it
      gamesMap.get(playerCrea.gameId).opponentIdFound = query.userId;
      searchList.delete(playerCreaId);
      playerCrea.client.emit("foundSearchCreaTC", { userId: query.userId, player });
      client.emit("foundSearchOppoTC", playerCrea.gameId);
    } else if (searchList.has(query.userId) == false) {
      searchList.set(query.userId, {client: client, gameId: query.gameId, player: player});
    }
  }

  @SubscribeMessage("stopSearchTS")
  stopSearch(client: Socket): void {
    const query: any = client.handshake.query;
    this.logger.log("LOG: stopSearchTS on " + query.gameId + " from " + query.username);

    searchList.delete(query.userId);
  }

  /**
   * GAME LISTENERS
   */
  @SubscribeMessage("posCreaTS")
  posCrea(client: Socket, pos: number): void {
    const query: any = client.handshake.query;

    client.to(query.gameId).emit("posCreaTC", pos);
  }

  @SubscribeMessage("posOppoTS")
  posOppo(client: Socket, pos: number): void {
    const query: any = client.handshake.query;

    client.to(query.gameId).emit("posOppoTC", pos);
  }

  @SubscribeMessage("changeBarModTS")
  changeBarMod(client: Socket, payload: {userId: string, state: number}): void {
    const query: any = client.handshake.query;

    client.to(query.gameId).emit("changeBarModTC", payload);
  }

  @SubscribeMessage("pointTS")
  pointTS(client: Socket, isCreaLoose: boolean): void {
    const query: any = client.handshake.query;
    this.logger.log("LOG: pointTS on " + query.gameId + " from " + query.username);

    const game: Game = gamesMap.get(query.gameId);
    const randDelta: Array<number> = this.genRandDelta();

    if (!game)
      return;
    if (isCreaLoose === true) { // Add one point to opponent
      game.score[1]++;
    } else {                    // Add one point to creator
      game.score[0]++;
    }
    client.to(game.id).emit("pointTC", isCreaLoose);
    client.to(game.id).emit("newRoundTC", randDelta);
    client.emit("newRoundTC", randDelta);
  }

  @SubscribeMessage("ballSync")
  ballSync(client: Socket, payload: { posX: number, posY: number }): void {
    const query: any = client.handshake.query;

    client.to(query.gameId).emit("ballSync", payload);
  };
}
