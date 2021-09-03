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

async function sketch(s: any): Promise<any> {
  let temp: Player | undefined;
  let pCrea: Player = new Player(); // Creator player
  let pOppo: Player = new Player(); // Opposent player
  let isAPlayer: boolean = false;   // Is true if the client is a player
  let msgBarTS: string;

  /**
   * SKETCH INIT
   */
  if (game.players.has(game.creatorId) === false ||
    game.players.has(game.opponentId) === false) {
    console.error("ERR: sketch() : creatorId or opponentId not found in players");
    return;
  }
  temp = game.players.get(game.creatorId);
  if (temp) {
    pCrea = temp;
    pCrea.barX = 32 + 16; // Padding + bar width / 2
  }
  temp = game.players.get(game.opponentId);
  if (temp) {
    pOppo = temp;
    pOppo.barX = 768 - (32 + 16);
  }
  if (vueInstance.$data.user.userId === game.creatorId ||
    vueInstance.$data.user.userId === game.opponentId) {
    isAPlayer = true;
    if (vueInstance.$data.user.userId === game.creatorId) {
      msgBarTS = "posCreaTS";
    } else if (vueInstance.$data.user.userId === game.opponentId) {
      msgBarTS = "posOppoTS";
    }
  }
  /**
   * SKETCH SETUP
   */
  let canvasDom: any = document.getElementById("gameCanvas");
  let graphic: p5.Graphics = s.createGraphics(768, 432);
  s.disableFriendlyErrors = true; // Optimize code

  s.setup = () => {
    s.createCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
    if (vueInstance.$data.user.userId != game.creatorId) {  // Subscribe to bar player info
      socket.on("posCreaTC", (pos: number) => {
        pCrea.barY = pos;
      });
    }
    if (vueInstance.$data.user.userId != game.opponentId) { // Subscribe to bar player info
      socket.on("posOppoTC", (pos: number) => {
        pOppo.barY = pos;
      });
    }
    graphic.rectMode(s.CENTER);
    graphic.noStroke();
  }
  /**
   * SKETCH DRAW
   * Draw function is entierly executed each p5 frames.
   */
  let mod = () => { };
  let modifierUpCrea = () => { pCrea.barY -= 4 * pCrea.barSpeed; socket.emit(msgBarTS, pCrea.barY) };
  let modifierDownCrea = () => { pCrea.barY += 4 * pCrea.barSpeed; socket.emit(msgBarTS, pCrea.barY) };
  let modifierUpOppo = () => { pOppo.barY -= 4 * pOppo.barSpeed; socket.emit(msgBarTS, pOppo.barY) };
  let modifierDownOppo = () => { pOppo.barY += 4 * pOppo.barSpeed; socket.emit(msgBarTS, pOppo.barY) };

  s.draw = () => {
    s.clear();
    graphic.clear();
    mod();
    graphic.fill(pCrea.color);
    graphic.rect(pCrea.barX, pCrea.barY, 8, pCrea.barLen);
    graphic.fill(pOppo.color);
    graphic.rect(pOppo.barX, pOppo.barY, 8, pOppo.barLen);
    s.image(graphic, 0, 0, canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
  s.windowResized = () => {
    s.resizeCanvas(canvasDom.offsetWidth, canvasDom.offsetHeight);
  }
  s.keyPressed = (event: any) => {
    if (event.key === "ArrowUp") {
      if (vueInstance.$data.user.userId === game.creatorId) {
        mod = modifierUpCrea;
      } else if (isAPlayer === true) {
        mod = modifierUpOppo;
      }
    } else if (event.key === "ArrowDown") {
      if (vueInstance.$data.user.userId === game.creatorId) {
        mod = modifierDownCrea;
      } else if (isAPlayer === true) {
        mod = modifierDownOppo;
      }
    }
  }
  s.keyReleased = (event: any) => {
    mod = () => { };
  }
}
