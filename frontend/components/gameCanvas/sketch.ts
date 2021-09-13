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

function updateHUDtxt(): void {
  if (vueInstance.endGame.isFinished == false) {
    const margin: number = canvasHeight / 50;
    const font_size: number = margin + 10;
    let HUDtxt: any = document.getElementsByClassName("txtHUD");

    for (let element of HUDtxt) {
      element.style.margin = `${margin}px`;
      element.style['font-size'] = `${font_size}px`;
    }
  } else {
    const font_size: number = canvasHeight / 10;
    let endGameMainInfos: any = document.getElementsByClassName("endGameMainInfo");

    for (let element of endGameMainInfos) {
      element.style['font-size'] = `${font_size}px`;
    }
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
  }
  /**
   * SKETCH SETUP
   */
  let canvasDom: any = document.getElementById("gameCanvas");
  canvasHUD = document.getElementById("gameHUD");
  updateCanvasDim(canvasDom.offsetWidth, canvasDom.offsetHeight);
  s.disableFriendlyErrors = true; // Optimize code

  s.setup = () => {
    let myCanvas: any = s.createCanvas(canvasWidth, canvasHeight);
    myCanvas.style('border', '2px dashed white');
    myCanvas.style('position', 'relative');
    myCanvas.style('backgroundImage', backgroundURL);
    myCanvas.style('background-size', '100% 100%');

    socket.on("b", (payload: {posX: number, posY: number, barCreaY: number, barOppoY: number}) => {
      ball.pos[0] = payload.posX;
      ball.pos[1] = payload.posY;
      pCrea.barY = payload.barCreaY;
      pOppo.barY = payload.barOppoY;
    });
    socket.on("pointTC", (score: Array<number>) => {
      console.log("LOG: pointTC");
      game.score = score;
      updateHUDtxt();
    });
    socket.on("changeSettingsTC", (settings: any) => {
      console.log("LOG: changeSettingsTC");
      if (settings.pCrea != undefined)
        pCrea = settings.pCrea;
      if (settings.pOppo != undefined)
        pOppo = settings.pOppo;
      if (settings.ball != undefined)
        game.ball = settings.ball;
    });
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
  let ball: Ball = game.ball;
  let factX: number = canvasWidth / 768;
  let factY: number = canvasHeight / 432;
  let transX = (coord: number) => { return (coord * factX); };
  let transY = (coord: number) => { return (coord * factY); };
  let barWidthFacted: number = transX(BAR_WIDTH);
  let ballSizeFacted: number = transX(ball.size);

  s.draw = () => {
    s.clear();
    s.fill(pCrea.color);
    s.rect(transX(pCrea.barX), transY(pCrea.barY), barWidthFacted, transY(pCrea.barLen), 6, 6, 6, 6);
    s.fill(pOppo.color);
    s.rect(transX(pOppo.barX), transY(pOppo.barY), barWidthFacted, transY(pOppo.barLen), 6, 6, 6, 6);
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
      socket.emit("changeBarModTS", {userId: vueInstance.$data.user.userId, state: 1});
    } else if (event.key === "ArrowDown") {
      socket.emit("changeBarModTS", {userId: vueInstance.$data.user.userId, state: -1});
    }
  }
  s.keyReleased = (event: any) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      socket.emit("changeBarModTS", {userId: vueInstance.$data.user.userId, state: 0});
    }
  }
}
