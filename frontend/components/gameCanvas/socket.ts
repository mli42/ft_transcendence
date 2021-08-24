import io, { Socket } from "socket.io-client";
import { Game, Player } from "./dataStructures";

export { socket, socketInit };

let socket: Socket;

function socketInit(url:string, channel: string, vue: Vue): void {
  socket = io(url, {
      query: {
        channel: channel,
        username: vue.$nuxt.$store.state.user.username,
      }
  });
  socket.on("connect", () => {
    console.log("Successfully connected to the newsocket channel " + channel);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected to newsocket channel " + channel);
  });
  socket.on("fetchGameTC", (game: Game) => {
    vue.$data.game = game;
  });
  socket.on("updatePlayersTC", (players: Map<string, Player>) => {
    vue.$data.game.players = players;
  });
  socket.on("updatePlayerTC", (payload: {userId: string, player: Player}) => {
    vue.$data.game.players.set(payload.userId, payload.player);
  });
}
