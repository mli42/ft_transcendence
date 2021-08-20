import io, { Socket } from "socket.io-client";

export { socket, socketInit };

let socket: Socket;

function socketInit(url:string, channel: string, vue: Vue): void {
  socket = io(url, {
      query: {
        channel: channel,
        user: vue.$nuxt.$store.state.user,
      }
  });
  socket.on("connect", () => {
    console.log("Successfully connected to the newsocket channel " + channel);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected to newsocket channel " + channel);
  });
}
