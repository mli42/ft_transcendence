<template>
  <div id="gameCanvas">
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Game from "./dataStructures";
import io, { Socket } from "socket.io-client";
import * as p5 from "p5";
import lookup from "socket.io-client";

const SOCKET_URL:string = "ws://localhost:3000/";
let socket: Socket = {} as any;

function socketInit(url:string, channel: string): any {
  let newSocket: any = io(url, {
      query: { channel: channel }
  });
  newSocket.on("connect", () => {
    console.log("Successfully connected to the newsocket channel " + channel);
  });
  newSocket.on("disconnect", () => {
    console.log("Disconnected to newsocket channel " + channel);
  });
  return (newSocket);
}

class Mouse {
  x: number;
  y: number;
  playerId: string;

  constructor(id: string, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.playerId = id;
  }
}

async function sketch (s: any): Promise<any> {
  let canvasDom: any = document.getElementById("gameCanvas");
  let otherMouses: Map<string, Array<number>> = new Map();
  let myMouse: Mouse = new Mouse(socket.id, 0, 0);

  s.setup = () => {
    console.log(socket);
    s.createCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
    socket.on("mousePosToClient", (payload: Mouse) => { // [0]:string [1]:Mouse
      otherMouses.set(payload.playerId, [payload.x, payload.y] as Array<number>);
    });
  }
  s.draw = () => {
    s.background("#00FF00");
    s.ellipse(s.mouseX, s.mouseY, 50, 50);
    socket.emit("mousePosToServer", [s.mouseX, s.mouseY] as Array<number>);
    otherMouses.forEach((value: any) => {
        s.fill("#0000FF");
        if (value)
          s.ellipse(value[0], value[1], 50, 50);
    });
  }
  s.windowResized = () => {
    s.resizeCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
}

export default Vue.extend({
  name: "gameCanvas" as string,
  data() {
    return {
      game: new Game(),
      id: this.$route.path.match("[^/]+$")?.toString() as string, // Get the id of the path
    }
  },
  async mounted() {
    socket = socketInit(SOCKET_URL, this.id);
    const { default: P5 } = await import('p5');
    const canvas = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
  },
},
);
</script>

<style scoped lang="scss" src="./gameCanvas.scss">

</style>
