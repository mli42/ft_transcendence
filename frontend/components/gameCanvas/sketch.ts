import { socket } from "./socket";
import * as p5 from "p5";
import { Mouse, Game } from "./dataStructures";

export { sketchWrap };

let vueInstance: any;
let game: Game;

async function sketchWrap(vue: any) {
  vueInstance = vue;
  game = vue.$data.game;
  const { default: P5 } = await import('p5');
  const canvas = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
}

async function sketch (s: any): Promise<any> {
  let canvasDom: any = document.getElementById("gameCanvas");
  let otherMouses: Map<string, Array<number>> = new Map();
  let background: p5.Image;

  s.preload = () => {
    s.loadImage(`http://localhost:3000/api/game/map/${game.mapName.replace(" ", "-")}.jpeg`, (img: p5.Image) => {
        background = img;
    });
  }
  s.setup = () => {
    s.createCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
    socket.on("mousePosToClient", (payload: Mouse) => { // [0]:string [1]:Mouse
      otherMouses.set(payload.playerId, [payload.x, payload.y] as Array<number>);
    });
  }
  s.draw = () => {
    s.background(background);
    s.ellipse(s.mouseX, s.mouseY, 50, 50);
  }
  s.windowResized = () => {
    s.resizeCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
}
