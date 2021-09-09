import { socket } from "./socket";
import * as p5 from "p5";
import { Mouse, Game, Player, Ball } from "./dataStructures";
import Vue from "vue";

export { sketchWrap, p5Instance };

let game: Game;
let p5Instance: p5;
let vueInstance: any;
let backgroundURL: string;
let canvasWidth: number;
let canvasHeight: number;
let canvasHUD: any;
let HUDtxt: any;

function updateHUDtxt(): void {
  const margin: number = canvasHeight / 50;
  const font_size: number = margin + 10;

  for (let element of HUDtxt) {
    element.style.margin = `${margin}px`;
    element.style['font-size'] = `${font_size}px`;
  }
}

function updateCanvasDim(innerWidth: number, innerHeight: number): void {
  // Updates canvasWidth, canvasHeight
  const ratio: number = 1.89;
  const predictHeight: number = innerWidth / ratio;
  const contentHeight = innerHeight - 64;

  if (contentHeight > predictHeight) {
    canvasWidth = innerWidth;
    canvasHeight = predictHeight;
  } else {
    canvasHeight = contentHeight;
    canvasWidth = canvasHeight * ratio;
  }
  canvasHUD.style.width = `${canvasWidth}px`;
  canvasHUD.style.height = `${canvasHeight}px`;
  updateHUDtxt();
}

async function sketchWrap(vue: any) {
  vueInstance = vue;
  backgroundURL = vue.bgImgURL();
  game = vue.$data.game;
  const { default: P5 } = await import('p5');
  p5Instance = new P5(sketch, document.getElementById('gameCanvas') as HTMLElement);
}

async function sketch(s: any): Promise<any> {
  let temp: Player | undefined;
  let pCrea: Player = new Player(); // Creator player
  let pOppo: Player = new Player(); // Opposent player
  let isAPlayer: boolean = false;   // Is true if the client is a player
  let msgBarTS: string;
  const BAR_WIDTH: number = 4;

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
    pCrea.barX = 16 + BAR_WIDTH; // Padding + bar width
  }
  temp = game.players.get(game.opponentId);
  if (temp) {
    pOppo = temp;
    pOppo.barX = 768 - (16 + BAR_WIDTH); // Screen width - (bar width + padding)
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
  canvasHUD = document.getElementById("gameHUD");
  HUDtxt = document.getElementsByClassName("txtHUD");
  updateCanvasDim(canvasDom.offsetWidth, canvasDom.offsetHeight);
  s.disableFriendlyErrors = true; // Optimize code

  let collCreaChecker = function(): void { // Check if the ball collide to the crea paddle
    const halfBar: number = pCrea.barLen / 2;
    const halfBall: number = ball.size / 2;
    if (ball.pos[1] - halfBall >= pCrea.barY - halfBar && ball.pos[1] - halfBall <= pCrea.barY + halfBar ||
        ball.pos[1] + halfBall >= pCrea.barY - halfBar && ball.pos[1] + halfBall <= pCrea.barY + halfBar) { // Vertical check
      if (ball.pos[0] - halfBall >= pCrea.barX - (BAR_WIDTH / 2) &&
          ball.pos[0] - halfBall <= pCrea.barX + (BAR_WIDTH / 2)) {
        ball.delta[0] *= -1;
        ball.speed *= 1.15;
        ball.color = pCrea.color;
        collBarChecker = collOppoChecker;
      }
    }
  };
  let collOppoChecker = function(): void { // Check if the ball collide to the oppo paddle
    const halfBar: number = pOppo.barLen / 2;
    const halfBall: number = ball.size / 2;
    if (ball.pos[1] - halfBall >= pOppo.barY - halfBar && ball.pos[1] - halfBall <= pOppo.barY + halfBar ||
        ball.pos[1] + halfBall >= pOppo.barY - halfBar && ball.pos[1] + halfBall <= pOppo.barY + halfBar) { // Vertical check
      if (ball.pos[0] + halfBall >= pOppo.barX - (BAR_WIDTH / 2) &&
          ball.pos[0] + halfBall <= pOppo.barX + (BAR_WIDTH / 2)) {
        ball.delta[0] *= -1;
        ball.speed *= 1.15;
        ball.color = pOppo.color;
        collBarChecker = collCreaChecker;
      }
    }
  };
  let collBarChecker: () => void; // Default behavior

  s.setup = () => {
    let myCanvas: any = s.createCanvas(canvasWidth, canvasHeight);
    myCanvas.style('border', '2px dashed white');
    myCanvas.style('position', 'relative');
    myCanvas.style('backgroundImage', backgroundURL);
    myCanvas.style('background-size', '100% 100%');

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
      console.log("LOG: ballTC");
      ball.delta[0] = payload.deltaX;
      ball.delta[1] = payload.deltaY;
      ball.pos[0] = payload.posX;
      ball.pos[1] = payload.posY;
    });
    socket.on("ballSync", (payload: {posX: number, posY: number}) => {
      console.log("LOG: ballSync");
      ball.pos[0] = payload.posX;
      ball.pos[1] = payload.posY;
    });
    socket.on("changeBarModTC", (payload: {userId: string, state: number}) => {
      console.log("LOG: changeBarModTC");
      if (payload.state === 1) {
        if (payload.userId === game.creatorId) {
          game.modBarCrea = modifierUpCrea;
        } else if (payload.userId === game.opponentId) {
          game.modBarOppo = modifierUpOppo;
        }
      } else if (payload.state === 0) {
        if (payload.userId === game.creatorId) {
          game.modBarCrea = modifierDownCrea;
        } else if (payload.userId === game.opponentId) {
          game.modBarOppo = modifierDownOppo;
        }
      }
    });
    socket.on("pointTC", (isCreatorLoose: boolean) => {
      console.log("LOG: pointTC");
      if (isCreatorLoose) {
        game.score[1]++;
      } else {
        game.score[0]++;
      }
      ball.speed = 5;
    });
    socket.on("newRoundTC", (delta: Array<number>) => {
      console.log("LOG: newRoundTC");
      ball.delta = delta;
      ball.color = "#DCE1E5";
      if (ball.delta[0] > 0) {
        collBarChecker = collOppoChecker;
      } else {
        collBarChecker = collCreaChecker;
      }
      ball.pos = [768 / 2, 432 / 2];
    });
    if (ball.delta[0] > 0) {
      collBarChecker = collOppoChecker;
    } else {
      collBarChecker = collCreaChecker;
    }
    s.frameRate(50);
    s.noStroke();
    s.drawingContext.shadowBlur = 15;
    s.drawingContext.shadowOffsetX = 0;
    s.drawingContext.shadowOffsetY = 0;
    s.drawingContext.shadowColor = "#FFFFFFF0";
    s.rectMode(s.CENTER);
  }

  /**
   * SKETCH DRAW
   * Draw function is entierly executed each p5 frames.
   */
  const protecUp = (p: Player): boolean => { if (p.barY - (p.barLen / 2) < 0) { return (true) } else { return (false); } };
  const protecDown = (p: Player): boolean => { if (p.barY + (p.barLen / 2) > 432) { return (true) } else { return (false); } };
  const modifierUpCrea = () => { if (protecUp(pCrea)) { return; } pCrea.barY -= 4 * pCrea.barSpeed; socket.emit(msgBarTS, pCrea.barY); };
  const modifierDownCrea = () => { if (protecDown(pCrea)) { return; } pCrea.barY += 4 * pCrea.barSpeed; socket.emit(msgBarTS, pCrea.barY); };
  const modifierUpOppo = () => { if (protecUp(pOppo)) { return; } pOppo.barY -= 4 * pOppo.barSpeed; socket.emit(msgBarTS, pOppo.barY); };
  const modifierDownOppo = () => { if (protecDown(pOppo)) { return; } pOppo.barY += 4 * pOppo.barSpeed; socket.emit(msgBarTS, pOppo.barY); };
  let ball: Ball = game.ball;
  let factX: number = canvasWidth / 768;
  let factY: number = canvasHeight / 432;
  let transX = (coord: number) => { return (coord * factX); };
  let transY = (coord: number) => { return (coord * factY); };
  let barWidthFacted: number = transX(BAR_WIDTH);
  let ballSizeFacted: number = transX(ball.size);

  s.draw = () => {
    s.clear();
    game.modBarCrea();
    game.modBarOppo();
    s.fill(pCrea.color);
    s.rect(transX(pCrea.barX), transY(pCrea.barY), barWidthFacted, transY(pCrea.barLen), 6, 6, 6, 6);
    s.fill(pOppo.color);
    s.rect(transX(pOppo.barX), transY(pOppo.barY), barWidthFacted, transY(pOppo.barLen), 6, 6, 6, 6);
    collBarChecker();
    ball.pos[0] += ball.delta[0] * ball.speed;
    ball.pos[1] += ball.delta[1] * ball.speed;
    if (isAPlayer && s.frameCount % 25 == 4 && ball.pos[0] > 50 && ball.pos[1] < 400) { // Sync the ball pos 1 frome on 10
      socket.emit("ballSync", { posX: ball.pos[0], posY: ball.pos[1] });
    }
    if (ball.pos[1] - (ball.size / 2) <= 0 || ball.pos[1] + (ball.size / 2) >= 432) { // top & bot collision
      ball.delta[1] *= -1;
    } else if (ball.pos[0] - (ball.size / 2) <= 0 || ball.pos[0] + (ball.size / 2) >= 768) { // left & right collision
      ball.pos = [768 / 2, 432 / 2];
      ball.delta = [0, 0];
      ball.speed = 5;
      if (vueInstance.$data.user.userId === game.creatorId) {
        socket.emit("pointTS", (ball.pos[0] - (ball.size / 2) < 0)); // If it's true, oppo win a point, if else it's crea that win;
      }
    }
    s.fill(game.ball.color);
    s.ellipse(transX(ball.pos[0]), transY(ball.pos[1]), ballSizeFacted);
  }
  s.windowResized = () => {
    updateCanvasDim(canvasDom.offsetWidth, canvasDom.offsetHeight);
    barWidthFacted = transX(BAR_WIDTH);
    ballSizeFacted = transX(16);
    factX = canvasWidth / 768;
    factY = canvasHeight / 432;
    s.resizeCanvas(canvasWidth, canvasHeight);
  }
  s.keyPressed = (event: any) => {
    if (event.key === "ArrowUp") {
      if (vueInstance.$data.user.userId === game.creatorId) {
        socket.emit("changeBarModTS", vueInstance.$data.user.userId, 1);
        game.modBarCrea = modifierUpCrea;
      } else if (isAPlayer === true) {
        socket.emit("changeBarModTS", vueInstance.$data.user.userId, 1);
        game.modBarOppo = modifierUpOppo;
      }
    } else if (event.key === "ArrowDown") {
      if (vueInstance.$data.user.userId === game.creatorId) {
        socket.emit("changeBarModTS", vueInstance.$data.user.userId, 0);
        game.modBarCrea = modifierDownCrea;
      } else if (isAPlayer === true) {
        socket.emit("changeBarModTS", vueInstance.$data.user.userId, 0);
        game.modBarOppo = modifierDownOppo;
      }
    }
  }
  s.keyReleased = (event: any) => {
    if (vueInstance.$data.user.userId === game.creatorId) {
      game.modBarCrea = () => {};
    } else if (isAPlayer === true) {
      game.modBarOppo = () => {};
    }
  }
}
