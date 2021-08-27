import io, { Socket } from "socket.io-client";
import { Game, Player } from "./dataStructures";

export { socket, socketInit };

let socket: Socket;

function socketInit(url:string, gameId: string, vue: any): void {
  socket = io(url, {
    query: {
      gameId: gameId,
      userId: vue.$nuxt.$store.state.user.userId,
      username: vue.$nuxt.$store.state.user.username,
    }
  });
  socket.on("connect", () => {
    console.log("Successfully connected to the newsocket game " + gameId);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected to newsocket game " + gameId);
  });
  socket.on("fetchGameTC", (game: Game, serialPlayers: string) => {
    console.log("LOG: fetchGameTC");
    const deserialPlayers: Map<string, Player> = new Map(JSON.parse(serialPlayers));
    game.players = deserialPlayers;
    vue.$data.game = game;
    vue.updateDisplayedElem();
  });
  socket.on("changePlayerColorTC", (payload: {userId: string, player: Player}) => {
    console.log("LOG: changePlayerTC");
    vue.$data.game.players.set(payload.userId, payload.player);
    vue.updatePlayersColors();
  });
  socket.on("changeGameTypeTC", (type: string) => {
    console.log("LOG: changeGameTypeTC");
    let game: Game = vue.$data.game;

    game.type = type;
    if (type == "matchmaking" && game.players.size == 2) {
      game.players.delete(game.opponentId);
      game.opponentId = "";
    }
    vue.updateDisplayedElem();
  });
  socket.on("playerJoinTC", (payload: {playerId: string, player: Player}) => { // New opponent!
    console.log("LOG: playerJoinTC");
    let game: Game = vue.$data.game;
    game.players.set(payload.playerId, payload.player);
    game.opponentId = payload.playerId;
    vue.updateDisplayedElem();
  });
  socket.on("playerLeaveTC", (playerId: string) => { // A player leaved
    console.log("LOG: playerLeaveTC");
  });
}
