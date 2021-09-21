import io, { Socket } from "socket.io-client";
import { Game, Player } from "./dataStructures";

export { socket, socketInit };

let socket: Socket;

function socketInit(url: string, gameId: string, vue: any): void {
  socket = io(url, {
    forceNew: true,
    withCredentials: true,
    query: {
      gameId: gameId,
      userId: vue.$store.state.user.userId,
      username: vue.$store.state.user.username,
    },
  });
  socket.on("connect", () => {
    console.log("Successfully connected to the newsocket game " + gameId);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected to newsocket game " + gameId);
  });
  socket.on("fetchGameTC",
      (payload: {game: Game, serialPlayers: string, modBarCrea: string, modBarOppo: string}) => {
    console.log("LOG: fetchGameTC");
    const deserialPlayers: Map<string, Player> = new Map(JSON.parse(payload.serialPlayers));
    payload.game.players = deserialPlayers;
    vue.$data.game = payload.game;
    vue.$data.game.modBarCrea = eval("(" + payload.modBarCrea + ")");
    vue.$data.game.modBarOppo = eval("(" + payload.modBarOppo + ")");
    if (payload.game.opponentIdFound != "" && payload.game.opponentIdFound === vue.$data.user.userId) {
      vue.btnActionJoin();
    }
    if (payload.game.state === "started") {
      vue.startGame();
    } else if (payload.game.state === "waiting") {
      vue.$data.isPreGameDisplayed = true;
      vue.updateDisplayedElem();
    } else if (payload.game.state === "ended") {
      vue.$mytoast.err("The game is finished and this part is not done for now");
    }
  });
  socket.on("changePlayerColorTC", (payload: { userId: string, player: Player }) => {
    console.log("LOG: changePlayerTC");
    vue.$data.game.players.set(payload.userId, payload.player);
    vue.updatePlayersColors();
  });
  socket.on("changeGameTypeTC", (type: string) => {
    console.log("LOG: changeGameTypeTC");
    let game: Game = vue.$data.game;

    game.type = type;
    if (game.players.size == 2) {
      game.players.delete(game.opponentId);
      game.opponentId = "";
    }
    vue.updateDisplayedElem();
  });
  socket.on("playerJoinTC", (payload: { playerId: string, player: Player }) => { // New opponent!
    console.log("LOG: playerJoinTC");
    let game: Game = vue.$data.game;
    game.players.set(payload.playerId, payload.player);
    if (game.creatorId === "") {
      game.creatorId = payload.playerId;
    } else {
      game.opponentId = payload.playerId;
    }
    vue.updateDisplayedElem();
  });
  socket.on("playerLeaveTC", (playerId: string) => { // A player leaved
    console.log("LOG: playerLeaveTC");
    let game: Game = vue.$data.game;
    if (game.creatorId === playerId) {
      game.creatorId = "";
      if (game.opponentId) {
        game.creatorId = game.opponentId;
        game.opponentId = "";
      }
    } else {
      game.opponentId = "";
    }
    game.players.delete(playerId);
    vue.updateDisplayedElem();
  });
  socket.on("updatePowTC", (enabledPowerUps: Array<string>) => {
    console.log("LOG: updatePowTC");
    const game: Game = vue.$data.game;
    game.enabledPowerUps = enabledPowerUps;
  });
  socket.on("updateMapTC", (mapName: string) => {
    console.log("LOG: updateMapTC");
    const game: Game = vue.$data.game;
    game.mapName = mapName;
  });
  socket.on("updateReadyTC", (payload: { playerId: string, isReady: boolean }) => {
    console.log("LOG: updateReadyTC");
    const game: Game = vue.$data.game;
    const player: Player | undefined = game.players.get(payload.playerId);

    if (game && player) {
      player.isReady = payload.isReady;
      vue.updateDisplayedElem();
    }
  });
  socket.on("foundSearchCreaTC", (payload: { userId: string, player: Player }) => {
    console.log("LOG: foundSearchCreaTC");
    vue.$toast.clear();
    vue.$data.mainBtn.resetHover();
    vue.$data.mainBtn.isLoading = false;
    vue.$data.game.players.set(payload.userId, payload.player);
    vue.$data.game.opponentId = payload.userId;
  });
  socket.on("foundSearchOppoTC", (gameId: string) => {
    console.log("LOG: foundSearchOppoTC");
    vue.$toast.clear();
    window.$nuxt.$router.push('/game/' + gameId); // Redirect client
  });
  socket.on("startGameTC", () => {
    console.log("LOG: startGameTC");
    vue.$data.game.state = "started";
    vue.startGame();
  });
}
