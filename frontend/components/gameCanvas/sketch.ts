import { socket } from "./socket";
import * as p5 from "p5";
import { Mouse, Game, Player, Ball } from "./dataStructures";
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
    pCrea.barX = 16 + 8; // Padding + bar width
  }
  temp = game.players.get(game.opponentId);
  if (temp) {
    pOppo = temp;
    pOppo.barX = 768 - (16 + 8); // Screen width - (bar width + padding)
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
    socket.on("ballTC", (payload: {deltaX: number, deltaY: number, posX: number, posY: number}) => {
      ball.delta[0] = payload.deltaX;
      ball.delta[1] = payload.deltaY;
      ball.pos[0] = payload.posX;
      ball.pos[1] = payload.posY;
    });
    socket.on("pointTC", (isCreatorLoose: boolean) => {
      if (isCreatorLoose) {
        game.score[1]++;
      } else {
        game.score[0]++;
      }
    });
    s.frameRate(50);
    s.noStroke();
    s.textAlign(s.CENTER, s.CENTER);
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
  let ball: Ball = game.ball;
  let factX: number = canvasDom.offsetWidth / 768;
  let factY: number = canvasDom.offsetHeight / 432;
  let transX = (coord: number) => { return (coord * factX); };
  let transY = (coord: number) => { return (coord * factY); };
  let barWidthFacted: number = transX(8);
  let ballSizeFacted: number = transX(ball.size);

  s.draw = () => {
    s.clear();
    mod();
    s.fill(pCrea.color);
    s.rect(transX(pCrea.barX), transY(pCrea.barY), barWidthFacted, transY(pCrea.barLen));
    s.fill(pOppo.color);
    s.rect(transX(pOppo.barX), transY(pOppo.barY), barWidthFacted, transY(pOppo.barLen));
    ball.pos[0] += ball.delta[0] * 2;
    ball.pos[1] += ball.delta[1] * 2;
    if (ball.pos[1] - (ball.size / 2) < 0 || ball.pos[1] + (ball.size / 2) > 432) { // top & bot collision
      ball.delta[1] *= -1;
    } else if (ball.pos[0] - (ball.size / 2) < 0 || ball.pos[0] + (ball.size / 2) > 768) {
      ball.pos[0] = 768 / 2;
      ball.pos[1] = 432 / 2;
      ball.delta = [0, 0];
      socket.emit("pointTS", (ball.pos[0] - (ball.size / 2) < 0)); // If it's true, oppo win a point, if else it's crea that win;
    }
    s.fill(game.ball.color);
    s.ellipse(transX(ball.pos[0]), transY(ball.pos[1]), ballSizeFacted);
  }
  s.windowResized = () => {
    barWidthFacted = transX(8);
    ballSizeFacted = transX(16);
    factX = canvasDom.offsetWidth / 768;
    factY = canvasDom.offsetHeight / 432;
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
