import { socket } from "./socket";
import * as p5 from "p5";
import { Mouse, Game, Player } from "./dataStructures";
import Vue from "vue";

export { sketchWrap };

let vueInstance: any;
let game: Game;

async function sketchWrap(vue: Vue) {
  vueInstance = vue;
  game = vue.$data.game;
  const { default: P5 } = await import('p5');
  const canvas = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
}

async function sketch (s: any): Promise<any> {
  let temp: Player | undefined;
  let pCrea: Player = new Player(); // Creator player
  let pOppo: Player = new Player(); // Opposent player
  let pCurr: Player = new Player(); // Current playing player
  let isAPlayer: boolean = false;   // Is true if the client is a player
  let msgBarTS: string;

  /**
   * SKETCH INIT
   */
  if (game.players.has(game.creatorId) === false ||
    game.players.has(game.opponentId) === false) {
    console.error("ERR: sketch() : creatorId or opponentId not found in players");
    return ;
  }
  temp = game.players.get(game.creatorId);
  if (temp) {
    pCrea = temp;
    pCrea.barX = 32 + 16; // Padding + bar width / 2
  }
  temp = game.players.get(game.opponentId);
  if (temp) {
    pOppo = temp;
    pOppo.barX = 1920 - (32 + 16);
  }
  if (vueInstance.$data.user.userId === game.creatorId ||
      vueInstance.$data.user.userId === game.opponentId) {
    isAPlayer = true;
    temp = game.players.get(vueInstance.$data.user.userId);
    if (temp)
      pCurr = temp;
    if (vueInstance.$data.user.userId === game.creatorId) {
      msgBarTS = "posCreaTS";
    } else if (vueInstance.$data.user.userId === game.opponentId) {
      msgBarTS = "posOppoTS";
    }
  }
  /**
   * SKETCH PRELOAD
   */
  s.preload = () => {
    s.loadImage(`http://localhost:3000/api/game/map/${game.mapName.replace(" ", "-")}.jpeg`, (img: p5.Image) => {
        background = img;
    });
  }
  /**
   * SKETCH SETUP
   */
  let canvasDom: any = document.getElementById("gameCanvas");
  let background: p5.Image;
  let creaGraphics: p5.Graphics;
  let oppoGraphics: p5.Graphics;
  let currGraphics: p5.Graphics; // Graphics of the user if the client is a player

  s.setup = () => {
    s.createCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
    creaGraphics = s.createGraphics(1920, 1016);
    creaGraphics.rectMode(s.CENTER);
    creaGraphics.fill(pCrea.color);
    oppoGraphics = s.createGraphics(1920, 1016);
    oppoGraphics.rectMode(s.CENTER);
    oppoGraphics.fill(pOppo.color);
    if (vueInstance.$data.user.userId != game.creatorId) {  // Subscribe to bar player info
      socket.on("posCreaTC", (pos: number) => {
        pCrea.barY = pos;
        creaGraphics.clear();
        creaGraphics.rect(pCrea.barX, pCrea.barY, 32, pCrea.barLen);
      });
    } else
      currGraphics = creaGraphics;
    if (vueInstance.$data.user.userId != game.opponentId) { // Subscribe to bar player info
      socket.on("posOppoTC", (pos: number) => {
        pOppo.barY = pos;
        oppoGraphics.clear();
        oppoGraphics.rect(pOppo.barX, pOppo.barY, 32, pOppo.barLen);
      });
    } else
      currGraphics = oppoGraphics;
  }
  /**
   * SKETCH DRAW
   * Draw function is entierly executed each p5 frames.
   */
  s.draw = () => {
    s.background(background);
    if (s.keyIsDown(s.UP_ARROW) === true) {
      pCurr.barY -= 10 * pCurr.barSpeed;
      socket.emit(msgBarTS, pCurr.barY);
      currGraphics.clear();
      currGraphics.rect(pCurr.barX, pCurr.barY, 32, pCurr.barLen);
    }
    if (s.keyIsDown(s.DOWN_ARROW) === true) {
      pCurr.barY += 10 * pCurr.barSpeed;
      socket.emit(msgBarTS, pCurr.barY);
      currGraphics.clear();
      currGraphics.rect(pCurr.barX, pCurr.barY, 32, pCurr.barLen);
    }
    s.image(creaGraphics, 0, 0, canvasDom.offsetWidth, canvasDom.offsetHeight);
    s.image(oppoGraphics, 0, 0, canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
  s.windowResized = () => {
    s.resizeCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
}
