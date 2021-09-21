import { socket } from "./socket";
import * as p5 from "p5";
import { Game, Player, Ball, PowerUp, IstringsAssociation } from "./dataStructures";
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
    const small_font_size: number = (canvasHUD / 50) + 10;
    let endGameMainInfos: any = document.getElementsByClassName("endGameMainInfo");
    let eloHUD: any = document.getElementsByClassName("eloHUD");

    for (let element of endGameMainInfos) {
      element.style['font-size'] = `${font_size}px`;
    }
    for (let element of eloHUD) {
      element.style['font-size'] = `${small_font_size}px`;
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
  let ball: Ball = game.ball;
  let factX: number = canvasWidth / 768;
  let factY: number = canvasHeight / 432;
  let transX = (coord: number) => { return (coord * factX); };
  let transY = (coord: number) => { return (coord * factY); };
  let barWidthFacted: number = transX(BAR_WIDTH);
  let ballSizeFacted: number = transX(ball.size);
  let ballSizeUpImg: p5.Image;
  let ballSizeDownImg: p5.Image;
  let barLenUpImg: p5.Image;
  let barSpeedUpImg: p5.Image;

  function resetPowEffect(game: Game): void {
    let pCrea: Player | undefined = game.players.get(game.creatorId);
    let pOppo: Player | undefined = game.players.get(game.opponentId);

    if (pCrea && pOppo) {
      game.ball.size = 16;
      ballSizeFacted = transX(ball.size);
      pCrea.barLen = 80;
      pOppo.barLen = 80;
      pCrea.barSpeed = 1.65;
      pOppo.barSpeed = 1.65;
    }
  }

  s.setup = () => {
    console.log();
    ballSizeUpImg = s.loadImage(`http://${window.location.hostname}:3000/api/game/powIcons/plus.svg`);
    ballSizeDownImg = s.loadImage(`http://${window.location.hostname}:3000/api/game/powIcons/minus.svg`);
    barLenUpImg = s.loadImage(`http://${window.location.hostname}:3000/api/game/powIcons/arrows.svg`);
    barSpeedUpImg = s.loadImage(`http://${window.location.hostname}:3000/api/game/powIcons/zap.svg`);
    let myCanvas: any = s.createCanvas(canvasWidth, canvasHeight);
    myCanvas.style('border', '2px dashed white');
    myCanvas.style('position', 'relative');
    myCanvas.style('backgroundImage', backgroundURL);
    myCanvas.style('background-size', '100% 100%');

    socket.on("countTC", (counterState: string) => {
      console.log(vueInstance.$data.activeCounter);
      if (counterState === "3") {
        vueInstance.$data.activeCounter = true;
      } else if (counterState === "GO !") {
        vueInstance.$data.activeCounter = false;
      }
      vueInstance.$mytoast.oneSec(counterState);
    });
    socket.on("b", (payload: { posX: number, posY: number, barCreaY: number, barOppoY: number }) => {
      ball.pos[0] = payload.posX;
      ball.pos[1] = payload.posY;
      pCrea.barY = payload.barCreaY;
      pOppo.barY = payload.barOppoY;
    });
    socket.on("pointTC", (score: Array<number>) => {
      console.log("LOG: pointTC");
      game.score = score;
      updateHUDtxt();
      resetPowEffect(game);
    });
    socket.on("changeSettingsTC", (settings: any) => {
      console.log("LOG: changeSettingsTC");
      if (settings.pCrea != undefined)
        pCrea = settings.pCrea;
      if (settings.pOppo != undefined)
        pOppo = settings.pOppo;
      if (settings.ball != undefined) {
        game.ball = settings.ball;
        ball = game.ball;
        ballSizeFacted = transX(ball.size);
      }
      barWidthFacted = transX(BAR_WIDTH);
    });
    socket.on("newPowTC", (powType: string, powPos: Array<number>) => {
      console.log(`LOG: newPowTC (powtype = ${powType}, powPos = ${powPos})`);
      let pow: PowerUp = new PowerUp(game.enabledPowerUps);
      pow.color = pow.colorMatch[powType];
      pow.modifier = pow.powMatch[powType];
      pow.pos = powPos;
      pow.type = powType;
      game.powerUps.push(pow);
    });
    socket.on("endGameTC", () => {
      setTimeout(() => { updateHUDtxt(); }, 5);
    });
    socket.on("collPowTC", (pos: Array<number>, userAffected?: string) => {
      let i: number = 0;
      for (let elem of game.powerUps) {
        if (elem.pos[0] === pos[0] && elem.pos[1] === pos[1]) {
          if (userAffected) {
            elem.modifier(game, userAffected);
          } else {
            elem.modifier(game, vueInstance.$data.user.userId);
          }
          game.powerUps.splice(i, 1);
          if (elem.type === "ballSizeUp" || elem.type === "ballSizeDown") {
            ballSizeFacted = transX(ball.size);
          }
          ball = game.ball;
          return;
        }
        i++;
      }
    });
    s.frameRate(50);
    s.noStroke();
    s.drawingContext.shadowBlur = 15;
    s.drawingContext.shadowOffsetX = 0;
    s.drawingContext.shadowOffsetY = 0;
    s.drawingContext.shadowColor = "#FFFFFFF0";
    s.rectMode(s.CENTER);
    s.imageMode(s.CENTER);
  }

  /**
   * SKETCH DRAW
   * Draw function is entierly executed each p5 frames.
   */

  s.draw = () => {
    s.clear();
    s.fill(pCrea.color);
    s.rect(transX(pCrea.barX), transY(pCrea.barY), barWidthFacted, transY(pCrea.barLen), 6, 6, 6, 6);
    s.fill(pOppo.color);
    s.rect(transX(pOppo.barX), transY(pOppo.barY), barWidthFacted, transY(pOppo.barLen), 6, 6, 6, 6);
    s.fill(ball.color);
    s.ellipse(transX(ball.pos[0]), transY(ball.pos[1]), ballSizeFacted);
    for (let elem of game.powerUps) {
      s.fill(elem.color);
      s.ellipse(transX(elem.pos[0]), transY(elem.pos[1]), transX(elem.size));
      s.image(eval(elem.type + "Img"), transX(elem.pos[0]), transY(elem.pos[1]), transX(elem.size) * 0.75, transY(elem.size) * 0.75);
    }
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
      socket.emit("changeBarModTS", { userId: vueInstance.$data.user.userId, state: 1 });
    } else if (event.key === "ArrowDown") {
      socket.emit("changeBarModTS", { userId: vueInstance.$data.user.userId, state: -1 });
    }
  }
  s.keyReleased = (event: any) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      socket.emit("changeBarModTS", { userId: vueInstance.$data.user.userId, state: 0 });
    }
  }
}
