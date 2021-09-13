import { Game, Player, Ball } from "./dataStructures";
import { Socket, Server } from "socket.io";

export { gameInstance }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function genRandDelta(): Array<number> {
  let ballDelta: Array<number> = new Array();
  let ballDeltaSum: number = 1;
  let ballDeltaRand: number = Math.random();

  while (ballDeltaRand * 10 < 4 || ballDeltaRand * 10 > 7) {// Ajust to start with a delta more horizontal
    ballDeltaRand = Math.random();
  }
  ballDelta[0] = ballDeltaSum - ballDeltaRand;
  if (Math.round(Math.random())) { ballDelta[0] = -ballDelta[0] } // Add negative ranges between -1 and 0
  ballDelta[1] = ballDeltaRand;
  if (Math.round(Math.random())) { ballDelta[1] = -ballDelta[1] }
  return (ballDelta);
}

async function gameInstance(client: Socket, game: Game): Promise<any> {
  let ball: Ball = game.ball;
  let pCrea: Player = game.players.get(game.creatorId);
  let pOppo: Player = game.players.get(game.opponentId);
  let collBarChecker: () => void; // Default behavior
  const BAR_WIDTH: number = 4;

  pCrea.barX = 16 + BAR_WIDTH; // Padding + bar width
  pOppo.barX = 768 - (16 + BAR_WIDTH); // Screen width - (bar width + padding)

  const protecUp = (p: Player): boolean => { if (p.barY - (p.barLen / 2) < 0) { return (true) } else { return (false); } };
  const protecDown = (p: Player): boolean => { if (p.barY + (p.barLen / 2) > 432) { return (true) } else { return (false); } };
  const modifierUpCrea = () => { if (protecUp(pCrea)) { return; } pCrea.barY -= 3 * pCrea.barSpeed; };
  const modifierDownCrea = () => { if (protecDown(pCrea)) { return; } pCrea.barY += 3 * pCrea.barSpeed; };
  const modifierUpOppo = () => { if (protecUp(pOppo)) { return; } pOppo.barY -= 3 * pOppo.barSpeed; };
  const modifierDownOppo = () => { if (protecDown(pOppo)) { return; } pOppo.barY += 3 * pOppo.barSpeed; };

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
        client.to(game.id).emit("changeSettingsTC", {ball: ball});
        client.emit("changeSettingsTC", {ball: ball});
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
        client.to(game.id).emit("changeSettingsTC", {ball: ball});
        client.emit("changeSettingsTC", {ball: ball});
        collBarChecker = collCreaChecker;
      }
    }
  };

  ball.delta = genRandDelta();
  if (ball.delta[0] > 0) {
    collBarChecker = collOppoChecker;
  } else {
    collBarChecker = collCreaChecker;
  }
  while (game.score[0] < 5 && game.score[1] < 5) {
    // Temp loop
    await sleep(10);
    // Move bars if needed
    if (game.modBarCrea === 1) { modifierUpCrea(); } else if (game.modBarCrea === -1) { modifierDownCrea(); }
    if (game.modBarOppo === 1) { modifierUpOppo(); } else if (game.modBarOppo === -1) { modifierDownOppo(); }
    // Check collisions between ball and bars
    collBarChecker();
    // Move the ball one step
    ball.pos[0] += ball.delta[0] * ball.speed;
    ball.pos[1] += ball.delta[1] * ball.speed;
    // Check collisions between ball and grid borders
    if (ball.pos[1] - (ball.size / 2) <= 0 || ball.pos[1] + (ball.size / 2) >= 432) { // top & bot collision
      ball.delta[1] *= -1;
    } else if (ball.pos[0] - (ball.size / 2) <= 0 || ball.pos[0] + (ball.size / 2) >= 768) { // left & right collision
      if (ball.pos[0] - (ball.size / 2) <= 0) { // left collision
        game.score[0]++;
      } else {                                  // right collision
        game.score[1]++;
      }
      ball.pos = [768 / 2, 432 / 2];
      ball.delta = genRandDelta();
      ball.speed = 2;
      if (ball.delta[0] > 0) { collBarChecker = collOppoChecker; } else { collBarChecker = collCreaChecker; }
      client.to(game.id).emit("pointTC", game.score); // Update point on front
      client.emit("pointTC", game.score);
    }
    // Broadcast positions
    client.to(game.id).emit("b", {posX: game.ball.pos[0], posY: game.ball.pos[1], barCreaY: pCrea.barY, barOppoY: pOppo.barY} );
    client.emit("b", {posX: game.ball.pos[0], posY: game.ball.pos[1], barCreaY: pCrea.barY, barOppoY: pOppo.barY} );
  }
  game.state = "ended";
  while (game.state != "closed") {
    await sleep(10);
    if (game.modBarCrea === 1) { modifierUpCrea(); } else if (game.modBarCrea === -1) { modifierDownCrea(); }
    if (game.modBarOppo === 1) { modifierUpOppo(); } else if (game.modBarOppo === -1) { modifierDownOppo(); }
    client.to(game.id).emit("b", {posX: -100, posY: -100, barCreaY: pCrea.barY, barOppoY: pOppo.barY} );
    client.emit("b", {posX: -100, posY: -100, barCreaY: pCrea.barY, barOppoY: pOppo.barY} );
  }
}
